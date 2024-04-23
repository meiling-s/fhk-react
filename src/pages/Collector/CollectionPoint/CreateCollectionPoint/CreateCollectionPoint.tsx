// @ts-nocheck
import {
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Typography
} from '@mui/material'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { styles } from '../../../../constants/styles'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import CustomField from '../../../../components/FormComponents/CustomField'
import { useEffect, useState } from 'react'
import {
  createCP,
  openingPeriod,
  recyclable,
  timePeriod
} from '../../../../interfaces/collectionPoint'
import CustomTextField from '../../../../components/FormComponents/CustomTextField'
import { LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import useDebounce from '../../../../hooks/useDebounce'
import { getLocation } from '../../../../APICalls/getLocation'
import CustomSwitch from '../../../../components/FormComponents/CustomSwitch'
import CustomPeriodSelect from '../../../../components/FormComponents/CustomPeriodSelect'
import { useNavigate } from 'react-router-dom'
import {
  findCollectionPointExistByName,
  findCollectionPointExistByContractAndAddress,
  createCollectionPoint
} from '../../../../APICalls/collectionPointManage'

import { formErr, format } from '../../../../constants/constant'
import { useTranslation } from 'react-i18next'
import { getCommonTypes } from '../../../../APICalls/commonManage'
import {
  colPointType,
  premiseType,
  recycType,
  siteType,
  colPtRoutine,
  formValidate
} from '../../../../interfaces/common'
import RecyclablesList from '../../../../components/SpecializeComponents/RecyclablesList'
import PremiseTypeList from '../../../../components/SpecializeComponents/PremiseTypeList'
import ColPointTypeList from '../../../../components/SpecializeComponents/CollectionPointTypeList'
import SiteTypeList from '../../../../components/SpecializeComponents/SiteTypeList'
import RoutineSelect from '../../../../components/SpecializeComponents/RoutineSelect'
import { FormErrorMsg } from '../../../../components/FormComponents/FormErrorMsg'
import { localStorgeKeyName } from '../../../../constants/constant'
import { dayjsToLocalDate, toGpsCode } from '../../../../components/Formatter'
import CustomItemList from '../../../../components/FormComponents/CustomItemList'

dayjs.extend(isBetween)

function CreateCollectionPoint() {
  const [colType, setCOLType] = useState<string>('')
  const [colName, setCOLName] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [gpsCode, setGPSCode] = useState<number[]>([0, 0])
  const [openingPeriod, setOpeningPeriod] = useState<openingPeriod>({
    startDate: dayjs(new Date()),
    endDate: dayjs(new Date())
  })
  const [colPtRoutine, setColPtRoutine] = useState<colPtRoutine>()
  const [siteType, setSiteType] = useState<string>('') //site type
  const [contractNo, setContractNo] = useState<string>('')
  const [premiseName, setPremiseName] = useState<string>('') //Name of the house/place
  const [premiseType, setPremiseType] = useState<string>('') //Category of the house/place
  const [premiseRemark, setPremiseRemark] = useState<string>('')
  const [status, setStatus] = useState<boolean>(true)
  const [recyclables, setRecyclables] = useState<recyclable[]>([])
  const [staffNum, setStaffNum] = useState<string>('')
  const [EPDFlg, setEPDFlg] = useState<boolean>(false)
  const [serviceType, setServiceType] = useState<boolean>(true)
  const [searchText, setSearchText] = useState<string>('')
  const [listPlace, setListPlace] = useState<any[]>([])
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const [skipValidation, setSkipValidation] = useState<string[]>([]) //store the fields of validation that are going to skip
  const [typeList, setTypeList] = useState<{
    colPoint: colPointType[]
    premise: premiseType[]
    site: siteType[]
    recyc: recycType[]
  }>({ colPoint: [], premise: [], site: [], recyc: [] })
  const [contractList, setContractList] = useState<
    { contractNo: string; isEpd: boolean; frmDate: string; toDate: string }[]
  >([])
  const debouncedSearchValue: string = useDebounce(searchText, 1000)

  const navigate = useNavigate()

  const { t, i18n } = useTranslation()

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (address) {
      setAddress('')
    }
    setSearchText(e.target.value)
  }

  useEffect(() => {
    initType()
  }, [])

  const initType = async () => {
    const result = await getCommonTypes()
    if (result) {
      setTypeList(result)
    }
    // console.log('result: ', result)
    if (result?.contract) {
      var conList: {
        contractNo: string
        isEpd: boolean
        frmDate: string
        toDate: string
      }[] = []
      result.contract.map((con) => {
        conList.push({
          contractNo: con.contractNo,
          isEpd: con.epdFlg,
          frmDate: con.contractFrmDate,
          toDate: con.contractToDate
        })
      })
      setContractList(conList)
    }
  }

  useEffect(() => {
    if (debouncedSearchValue) {
      getLocation(debouncedSearchValue)
        .then((response) => {
          if (response.data.results) {
            console.log(response.data)
            const result = response.data.results
            setListPlace(result)
          }
        })
        .catch((error) => {
          console.log('Error fetching data:', error)
        })
    } else {
      setListPlace([])
    }
  }, [debouncedSearchValue])

  const checkRecyclable = (items: recyclable) => {
    return items.every((item) => item.recycSubTypeId.length > 0)
  }

  const checkTimePeriod = () => {
    return colPtRoutine?.routineContent.every(
      (item) => item.startTime.length > 0 && item.endTime.length > 0
    )
  }

  const checkTimePeriodNotInvalid = () => {
    console.log('checkTimePeriodNotInvalid', colPtRoutine)
    return colPtRoutine?.routineContent.every((item) => {
      for (let index = 0; index < item.startTime.length; index++) {
        const currStartTime = item.startTime[index]
        const currEndTime = item.endTime[index]

        if (currEndTime > currStartTime) {
          return false
        }
      }
      return true
    })
  }

  const getTime = (value: string) => {
    return value.match(/\d{2}:\d{2}:\d{2}/)[0]
  }

  const checkTimeNotDuplicate = () => {
    const isvalid = colPtRoutine?.routineContent.every((item) => {
      for (let index = 0; index < item.startTime.length - 1; index++) {
        const currPair =
          getTime(item.startTime[index]) + getTime(item.endTime[index])

        const nextPair =
          getTime(item.startTime[index + 1]) + getTime(item.endTime[index + 1])

        if (currPair === nextPair) {
          return false
        }
      }
      return true
    })

    return isvalid
  }

  useEffect(() => {
    //do validation here
    const validate = async () => {
      const tempV: formValidate[] = [] //temp validation
      colType == '' &&
        tempV.push({
          field: 'col.colType',
          problem: formErr.empty,
          type: 'error'
        })
      siteType == '' &&
        tempV.push({
          field: 'col.siteType',
          problem: formErr.empty,
          type: 'error'
        })
      premiseName.length > 100 &&
        tempV.push({
          field: 'col.premiseName',
          problem: formErr.exceedsMaxLength,
          type: 'error'
        })
      // ;(await address) == ''
      //   ? tempV.push({
      //       field: 'col.address',
      //       problem: formErr.empty,
      //       type: 'error'
      //     })
      //   : (await checkAddressUsed(contractNo, address)) &&
      //     tempV.push({
      //       field: 'col.address',
      //       problem: formErr.hasBeenUsed,
      //       type: 'error'
      //     })
      ;(await colName) == ''
        ? tempV.push({
            field: 'col.colName',
            problem: formErr.empty,
            type: 'error'
          })
        : (await checkColPtExist(colName)) &&
          tempV.push({
            field: 'col.colName',
            problem: formErr.hasBeenUsed,
            type: 'error'
          })
      dayjs(new Date()).isBetween(
        openingPeriod.startDate,
        openingPeriod.endDate
      ) &&
        status == false &&
        !skipValidation.includes('col.openingDate') && //status == false: status is "CLOSED"
        tempV.push({
          field: 'col.openingDate',
          problem: formErr.withInColPt_Period,
          type: 'warning'
        })
      colPtRoutine?.routineType == '' &&
        tempV.push({
          field: 'col.startTime',
          problem: formErr.empty,
          type: 'error'
        })
      ;(colPtRoutine?.routineContent.length == 0 || !checkTimePeriod()) &&
        tempV.push({
          field: 'time_Period',
          problem: formErr.empty,
          type: 'error'
        })
      !checkTimePeriodNotInvalid() &&
        tempV.push({
          field: 'time_Period',
          problem: formErr.startDateBehindEndDate,
          type: 'error'
        })
      !checkTimeNotDuplicate() &&
        tempV.push({
          field: 'time_Period',
          problem: formErr.timeCantDuplicate,
          type: 'error'
        })
      premiseName == '' &&
        tempV.push({
          field: 'col.premiseName',
          problem: formErr.empty,
          type: 'error'
        })
      premiseType == '' &&
        tempV.push({
          field: 'col.premiseType',
          problem: formErr.empty,
          type: 'error'
        })
      premiseRemark == '' &&
        premiseType === 'PT00009' &&
        tempV.push({
          field: 'col.premiseRemark',
          problem: formErr.empty,
          type: 'error'
        })
      recyclables.length == 0 &&
        tempV.push({
          field: 'col.recycType',
          problem: formErr.empty,
          type: 'error'
        })
      !checkRecyclable(recyclables) &&
        tempV.push({
          field: 'inventory.recyleSubType',
          problem: formErr.empty,
          type: 'error'
        })
      // console.log(
      //   'num:',
      //   staffNum,
      //   Number.isNaN(parseInt(staffNum)),
      //   staffNum == ''
      // )
      staffNum == '' &&
        tempV.push({
          field: 'col.numOfStaff',
          problem: formErr.empty,
          type: 'error'
        })
      Number.isNaN(parseInt(staffNum)) && !(staffNum == '')
        ? tempV.push({
            field: 'col.numOfStaff',
            problem: formErr.wrongFormat,
            type: 'error'
          })
        : !Number.isNaN(parseInt(staffNum)) &&
          parseInt(staffNum) < 0 &&
          tempV.push({
            field: 'col.numOfStaff',
            problem: formErr.numberSmallThanZero,
            type: 'error'
          })
      contractNo == '' && !skipValidation.includes('col.contractNo')
        ? tempV.push({
            field: 'col.contractNo',
            problem: formErr.empty,
            type: 'warning'
          })
        : !checkContractisEff(contractNo) &&
          !skipValidation.includes('col.contractNo') &&
          tempV.push({
            field: 'col.contractNo',
            problem: formErr.notWithInContractEffDate,
            type: 'warning'
          })
      setValidation(tempV)
    }

    validate()
  }, [
    colType,
    siteType,
    colName,
    colPtRoutine,
    address,
    openingPeriod,
    premiseName,
    premiseType,
    premiseRemark,
    status,
    recyclables,
    staffNum,
    contractNo,
    skipValidation
  ])

  useEffect(() => {
    checkEPD(contractNo)
  }, [contractNo])

  useEffect(() => {
    setListPlace([])
  }, [address])

  //validation function
  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  const checkNumber = (n: string) => {
    //before first submit, don't check the validation
    if (!trySubmited) {
      return false
    }
    return (
      Number.isNaN(parseInt(n)) ||
      n == '' ||
      (!Number.isNaN(parseInt(n)) && parseInt(n) < 0)
    )
  }

  const addSkipValidation = (skip: string) => {
    console.log(skip, skipValidation)
    var tempSkipValid = Object.assign([], skipValidation)
    tempSkipValid.push(skip)
    setSkipValidation(tempSkipValid)
  }

  const returnErrorMsg = (error: string) => {
    var msg = ''
    console.log(error)
    switch (error) {
      case formErr.empty:
        msg = t('form.error.shouldNotBeEmpty')
        break
      case formErr.wrongFormat:
        msg = t('form.error.isInWrongFormat')
        break
      case formErr.numberSmallThanZero:
        msg = t('form.error.shouldNotSmallerThanZero')
        break
      case formErr.withInColPt_Period:
        msg = t('form.error.withInColPt_Period')
        break
      case formErr.notWithInContractEffDate:
        msg = t('form.error.isNotWithInContractEffDate')
        break
      case formErr.alreadyExist:
        msg = t('form.error.alreadyExist')
        break
      case formErr.hasBeenUsed:
        msg = t('form.error.hasBeenUsed')
        break
      case formErr.exceedsMaxLength:
        msg = t('form.error.exceedsMaxLength')
        break
      case formErr.timeCantDuplicate:
        msg = t('form.error.timeCantDuplicate')
        break
      case formErr.startDateBehindEndDate:
        msg = t('form.error.startDateBehindEndDate')
        break
    }
    return msg
  }

  const checkEPD = (contractNo: string) => {
    const contract = contractList.find((contract) => {
      return contract.contractNo == contractNo
    })
    if (contract) {
      setEPDFlg(contract.isEpd)
    }
  }

  const checkContractisEff = (contractNo: string) => {
    console.log('checkContractisEff')
    const contract = contractList.find((contract) => {
      return contract.contractNo == contractNo
    })
    var isBetween = false
    if (contract) {
      isBetween =
        dayjs(contract.frmDate).isBefore(openingPeriod.startDate) &&
        dayjs(contract.toDate).isAfter(openingPeriod.endDate)
    }
    return isBetween
  }

  const checkColPtExist = async (colName: string) => {
    const result = await findCollectionPointExistByName(colName)
    if (result && result.data != undefined) {
      console.log(result.data)
      return result.data
    }
    return false
  }

  const checkAddressUsed = async (contractNo: string, address: string) => {
    const result = await findCollectionPointExistByContractAndAddress(
      contractNo,
      address
    )
    if (result && result.data != undefined) {
      console.log(result.data)
      return result.data
    }
    return false
  }

  const handleCreateOnClick = async () => {
    console.log('colPtRoutine', colPtRoutine)
    const loginId = localStorage.getItem(localStorgeKeyName.username)
    const tenantId = localStorage.getItem(localStorgeKeyName.tenantId)

    if (validation.length == 0) {
      const cp: createCP = {
        tenantId: tenantId,
        colName: colName,
        colPointTypeId: colType,
        effFrmDate: dayjsToLocalDate(openingPeriod.startDate),
        effToDate: dayjsToLocalDate(openingPeriod.endDate),
        routine: colPtRoutine,
        address: address,
        gpsCode: toGpsCode(gpsCode[0], gpsCode[1]),
        epdFlg: EPDFlg,
        //extraServiceFlg: !serviceType,
        serviceFlg: serviceFlg,
        siteTypeId: siteType,
        contractNo: contractNo,
        noOfStaff: parseInt(staffNum),
        status: status ? 'CREATED' : 'CLOSED',
        premiseName: premiseName,
        premiseTypeId: premiseType,
        premiseRemark: premiseRemark,
        normalFlg: true,
        createdBy: loginId,
        updatedBy: loginId,
        colPtRecyc: recyclables,
        roster: []
      }
      const result = await createCollectionPoint(cp)
      const data = result?.data
      if (data) {
        console.log('all collection point: ', data)
      }
      navigate('/collector/collectionPoint', { state: 'created' }) //goback to collection point with action "created"
    } else {
      console.log(validation)
      setTrySubmited(true)
      //if(validation.incl)
    }
  }

  const handleCancelOnClick = () => {
    console.log('Cancel click')
    navigate('/collector/collectionPoint') //goback to last page
  }

  const handleHeaderOnClick = () => {
    console.log('Header click')
    navigate('/collector/collectionPoint') //goback to last page
  }

  const serviceTypeList = [
    {
      id: 'basic',
      name: t('col.basic')
    },
    {
      id: 'additional',
      name: t('col.additional')
    },
    {
      id: 'others',
      name: t('col.other')
    }
  ]
  const [serviceFlg, setServiceFlg] = useState<string>('basic')

  const createdDate = dayjs(new Date()).format(format.dateFormat1)

  return (
    <>
      <Box
        sx={
          (styles.innerScreen_container,
          { paddingLeft: { xs: 0 }, width: '100%' })
        }
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          <Grid
            container
            direction={'column'}
            spacing={2.5}
            sx={
              ({ ...styles.gridForm },
              {
                width: { xs: '100%' },
                marginTop: { sm: 2, xs: 6 },
                marginLeft: {
                  xs: 0
                }
              })
            }
            className="sm:ml-0 mt-o w-full"
          >
            <Grid item>
              <Button
                sx={[styles.headerSection]}
                onClick={() => handleHeaderOnClick()}
              >
                <ArrowBackIosIcon sx={{ fontSize: 15, marginX: 0.5 }} />
                <Typography sx={styles.header1}>{t('col.createCP')}</Typography>
              </Button>
            </Grid>

            <Grid item>
              <Typography sx={styles.header2}>
                {t('col.locationData')}
              </Typography>
            </Grid>

            <CustomField label={t('col.colType')} mandatory={true}>
              <ColPointTypeList
                setState={setCOLType}
                colPointTypes={typeList.colPoint}
                error={checkString(colType)}
              />
            </CustomField>

            <CustomField label={t('col.siteType')} mandatory={true}>
              <SiteTypeList
                setState={setSiteType}
                siteTypes={typeList.site}
                error={checkString(siteType)}
              />
            </CustomField>

            <CustomField label={t('col.colName')} mandatory={true}>
              <CustomTextField
                id="colName"
                placeholder={t('col.enterName')}
                onChange={(event) => setCOLName(event.target.value)}
                error={checkString(colName)}
              />
            </CustomField>

            <CustomField label={t('col.address')} mandatory={true}>
              <CustomTextField
                id="address"
                placeholder={t('col.enterAddress')}
                onChange={(event) => handleSearchTextChange(event)}
                multiline={true}
                // endAdornment={locationSelect(setCPLocation)}
                value={address ? address : searchText}
                error={checkString(address)}
              />
              <Typography sx={{ marginTop: 1, fontSize: 16, color: '#ACACAC' }}>
                請輸入座數,街名,屋苑等資料
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  borderColor: 'black'
                }}
              >
                {listPlace && listPlace.length > 0 && (
                  <List key={listPlace[0]?.place_id}>
                    <ListItemButton
                      onClick={() => {
                        setAddress(listPlace[0].formatted_address)
                        setGPSCode([
                          listPlace[0]?.geometry?.location?.lat,
                          listPlace[0]?.geometry?.location?.lng
                        ])
                      }}
                    >
                      <ListItemText>
                        {listPlace[0]?.formatted_address}
                      </ListItemText>
                    </ListItemButton>
                    <Divider />
                  </List>
                )}
              </Box>
            </CustomField>

            <CustomField label={t('col.effFromDate')}>
              <CustomPeriodSelect setDate={setOpeningPeriod} />
            </CustomField>

            <CustomField
              label={t('col.startTime')}
              mandatory={true}
              style={{ maxWidth: '220px' }}
            >
              <RoutineSelect
                setRoutine={setColPtRoutine}
                requiredTimePeriod={true}
              />
            </CustomField>
            {!checkTimeNotDuplicate() && (
              <div className="ml-5 text-red text-sm">
                {t('form.error.timeCantDuplicate')}
              </div>
            )}

            <CustomField label={t('col.premiseName')} mandatory={true}>
              <CustomTextField
                id="HouseOrPlaceName"
                placeholder={t('col.enterName')}
                onChange={(event) => setPremiseName(event.target.value)}
                error={checkString(premiseName)}
              />
            </CustomField>

            <CustomField label={t('col.premiseType')} mandatory={true}>
              <PremiseTypeList
                setState={setPremiseType}
                premiseTypes={typeList.premise}
                error={checkString(premiseType)}
              />
            </CustomField>

            {premiseType === 'PT00009' && (
              <Grid item>
                {/* <Collapse in={premiseType == 'PT00010'}> */}
                <CustomField label={t('col.premiseRemark')} mandatory={true}>
                  <CustomTextField
                    id="premiseRemark"
                    placeholder={t('col.enterText')}
                    onChange={(event) => setPremiseRemark(event.target.value)}
                    error={checkString(premiseName)}
                  />
                </CustomField>
                {/* </Collapse> */}
              </Grid>
            )}

            <CustomField label={t('col.status')}>
              <CustomSwitch
                onText={t('col.open')}
                offText={t('col.close')}
                defaultValue={true}
                setState={setStatus}
              />
            </CustomField>

            <Grid item sx={{ width: '100%' }}>
              <Divider />
            </Grid>

            <Grid item>
              <Typography sx={styles.header2}>
                {t('col.colRecycType')}
              </Typography>
            </Grid>

            <CustomField label={t('col.recycType')} mandatory={true}>
              <RecyclablesList
                recycL={typeList.recyc}
                subTypeRequired={true}
                setState={setRecyclables}
              />
            </CustomField>

            <Grid item sx={{ width: '100%' }}>
              <Divider />
            </Grid>

            <Grid item>
              <Typography sx={styles.header2}>{t('col.staffInfo')}</Typography>
            </Grid>

            <CustomField label={t('col.numOfStaff')} mandatory={true}>
              <CustomTextField
                id="employee number"
                placeholder={t('col.enterNumOfStaff')}
                onChange={(event) => {
                  const value = event.target.value
                  setStaffNum(value)
                }}
                error={checkNumber(staffNum)}
              />
            </CustomField>

            <Grid item sx={{ width: '100%' }}>
              <Divider />
            </Grid>

            <Grid item>
              <Typography sx={styles.header2}>
                {t('col.serviceInfo')}
              </Typography>
            </Grid>

            <CustomField label={t('col.contractNo')}>
              <Autocomplete
                disablePortal
                id="contractNo"
                options={contractList.map((contract) => contract.contractNo)}
                onChange={(event, value) => {
                  console.log(value)
                  if (value) {
                    setContractNo(value)
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t('col.enterNo')}
                    sx={[styles.textField, { width: 320 }]}
                    InputProps={{
                      ...params.InputProps,
                      sx: styles.inputProps
                    }}
                  />
                )}
              />
            </CustomField>

            <CustomField label={t('col.serviceType')}>
              <CustomItemList
                items={serviceTypeList}
                singleSelect={setServiceFlg}
                defaultSelected={serviceFlg}
              ></CustomItemList>
            </CustomField>
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  sx={{
                    ...styles.header3,
                    paddingX: '4px',
                    paddingRight: '16px'
                  }}
                >
                  {t('common.createdDatetime') + ' : ' + createdDate}
                </Typography>
                <Typography
                  sx={{
                    ...styles.header3,
                    paddingX: '4px',
                    paddingLeft: '16px',
                    borderLeft: '1px solid #ACACAC'
                  }}
                >
                  {t('common.lastUpdateDatetime') + ' : ' + createdDate}
                </Typography>
              </Box>
            </Grid>
            <Grid item className="lg:flex sm:block text-center">
              <Button
                sx={[
                  styles.buttonFilledGreen,
                  localstyles.localButton,
                  { marginBottom: { md: 0, xs: 2 } }
                ]}
                onClick={() => handleCreateOnClick()}
              >
                {t('col.create')}
              </Button>
              <Button
                sx={[styles.buttonOutlinedGreen, localstyles.localButton]}
                onClick={() => handleCancelOnClick()}
              >
                {t('col.cancel')}
              </Button>
            </Grid>
            <Grid item sx={{ width: '50%' }}>
              {trySubmited &&
                validation.map((val) => (
                  <FormErrorMsg
                    field={t(val.field)}
                    errorMsg={returnErrorMsg(val.problem)}
                    type={val.type}
                    setContinue={() => addSkipValidation(val.field)}
                  />
                ))}
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Box>
    </>
  )
}
const localstyles = {
  localButton: {
    width: '200px',
    fontSize: 18,
    mr: 3
  }
}

export default CreateCollectionPoint
