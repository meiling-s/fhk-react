// @ts-nocheck
import {
  Autocomplete,
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography
} from '@mui/material'
import { styles } from '../../../../constants/styles'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import CustomField from '../../../../components/FormComponents/CustomField'
import { useEffect, useState } from 'react'
import {
  collectionPoint,
  updateCP,
  openingPeriod,
  recyclable,
  timePeriod
} from '../../../../interfaces/collectionPoint'
import CustomTextField from '../../../../components/FormComponents/CustomTextField'
import { LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import useDebounce from '../../../../hooks/useDebounce'
import { getLocation } from '../../../../APICalls/getLocation'
import CustomSwitch from '../../../../components/FormComponents/CustomSwitch'
import CustomPeriodSelect from '../../../../components/FormComponents/CustomPeriodSelect'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  findCollectionPointExistByName,
  findCollectionPointExistByContractAndAddress,
  updateCollectionPoint,
  getCollectionPointDetail
} from '../../../../APICalls/collectionPointManage'
import { useTranslation } from 'react-i18next'
import {
  colPointType,
  premiseType,
  recycType,
  siteType,
  colPtRoutine,
  formValidate
} from '../../../../interfaces/common'
import { getCommonTypes } from '../../../../APICalls/commonManage'
import RecyclablesList from '../../../../components/SpecializeComponents/RecyclablesList'
import PremiseTypeList from '../../../../components/SpecializeComponents/PremiseTypeList'
import ColPointTypeList from '../../../../components/SpecializeComponents/CollectionPointTypeList'
import SiteTypeList from '../../../../components/SpecializeComponents/SiteTypeList'
import { STATUS_CODE, formErr } from '../../../../constants/constant'
import RoutineSelect from '../../../../components/SpecializeComponents/RoutineSelect'
import { FormErrorMsg } from '../../../../components/FormComponents/FormErrorMsg'
import { dayjsToLocalDate, toGpsCode } from '../../../../components/Formatter'
import { localStorgeKeyName } from '../../../../constants/constant'
import CustomItemList from '../../../../components/FormComponents/CustomItemList'
import {
  displayCreatedDate,
  extractError,
  returnErrorMsgCP,
  showErrorToast,
  validDayjsISODate
} from '../../../../utils/utils'

function CreateCollectionPoint() {
  const { state } = useLocation()
  const colInfo: collectionPoint = state
  const [colType, setCOLType] = useState<string>(colInfo.colPointTypeId)
  const [address, setAddress] = useState<string>(colInfo.address)
  const [gpsCode, setGPSCode] = useState<number[]>(colInfo.gpsCode)
  const [openingPeriod, setOpeningPeriod] = useState<openingPeriod>({
    startDate: dayjs(new Date(colInfo.effFrmDate)).add(8, 'hour'),
    endDate: dayjs(new Date(colInfo.effToDate)).add(8, 'hour')
  })
  const [colPtRoutine, setColPtRoutine] = useState<colPtRoutine>()
  const [siteType, setSiteType] = useState<string>(colInfo.siteTypeId) //site type
  const [contractNo, setContractNo] = useState<string>(colInfo.contractNo)
  const [premiseName, setPremiseName] = useState<string>(colInfo.premiseName) //Name of the house/place
  const [premiseType, setPremiseType] = useState<string>(colInfo.premiseTypeId) //Category of the house/place
  const [premiseRemark, setPremiseRemark] = useState<string>(
    colInfo.premiseRemark
  )
  const [status, setStatus] = useState<boolean>(true)
  const [recyclables, setRecyclables] = useState<recyclable[]>(
    colInfo.colPtRecyc
  )
  const [staffNum, setStaffNum] = useState<string>(colInfo.noOfStaff.toString())
  const [EPDEnable, setEPDEnable] = useState<boolean>(colInfo.epdFlg)
  //   const [serviceType, setServiceType] = useState<boolean>(
  //     colInfo.extraServiceFlg
  //   )
  const [serviceFlg, setServiceFlg] = useState<string>(colInfo.serviceFlg)
  const [searchText, setSearchText] = useState<string>('')
  const [listPlace, setListPlace] = useState<any[]>([])
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const [version, setVersion] = useState<number>(0)
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
    initCollectionPointDetail()
    setRecyclables(colInfo.colPtRecyc)
  }, [])

  const initType = async () => {
    try {
      const result = await getCommonTypes()
      if (result) {
        setTypeList(result)
      }
      if (result?.contract) {
        var conList: {
          contractNo: string
          isEpd: boolean
          frmDate: string
          toDate: string
        }[] = []
        result?.contract?.map((con) => {
          conList.push({
            contractNo: con.contractNo,
            isEpd: con.epdFlg,
            frmDate: con.contractFrmDate,
            toDate: con.contractToDate
          })
        })
        setContractList(conList)
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const initCollectionPointDetail = async () => {
    const result = await getCollectionPointDetail(colInfo.colId)
    const data = result.data as collectionPoint

    if (data) {
      setCOLType(data.colPointTypeId)
      setAddress(data.address)
      setGPSCode(data.gpsCode)
      setSiteType(data.siteTypeId)
      setContractNo(data.contractNo)
      setPremiseName(data.premiseName)
      setPremiseType(data.premiseTypeId)
      setPremiseRemark(data.premiseRemark)
      setRecyclables(data.colPtRecyc)
      setStaffNum(data.noOfStaff)
      setEPDEnable(data.epdFlg)
      setServiceFlg(data.serviceFlg)
      setVersion(data.version)
    }
  }

  useEffect(() => {
    if (debouncedSearchValue) {
      getLocation(debouncedSearchValue)
        .then((response) => {
          const result = response.data.results
          setListPlace(result)
        })
        .catch((error) => {
          // console.log('Error fetching data:', error)
        })
    } else {
      setListPlace([])
    }
  }, [debouncedSearchValue])

  const checkRecyclable = () => {
    return recyclables.every((item) => {
      const recycType = typeList.recyc.find(
        (r) => r.recycTypeId === item.recycTypeId
      )
      if (recycType && recycType.recycSubType.length > 0) {
        return item.recycSubTypeId.length > 0
      }
      return true // If no sub-types available, it's okay
    })
  }

  const getTime = (value: string) => {
    return value.match(/\d{2}:\d{2}:\d{2}/)[0]
  }

  const checkTimePeriod = () => {
    return colPtRoutine?.routineContent.every(
      (item) => item.startTime.length > 0 && item.endTime.length > 0
    )
  }

  const checkTimePeriodNotInvalid = () => {
    return colPtRoutine?.routineContent.every((item) => {
      for (let index = 0; index < item.startTime.length; index++) {
        const currStartTime = new Date(item.startTime[index])
        const currEndTime = new Date(item.endTime[index])

        //console.log('checkTimePeriodNotInvalid', currStartTime, currEndTime)
        if (currEndTime < currStartTime) {
          return false
        }
      }
      return true
    })
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

  const checkTimeNotOverlapping = () => {
    return colPtRoutine?.routineContent.every((item) => {
      const periods = []
      for (let i = 0; i < item.startTime.length; i++) {
        const start = new Date(`1970-01-01T${getTime(item.startTime[i])}`)
        const end = new Date(`1970-01-01T${getTime(item.endTime[i])}`)

        if (isOverlapping([start, end], periods)) {
          return false
        }

        periods.push([start, end])
      }
      return true
    })
  }

  const isOverlapping = (newPeriod, periods) => {
    const [newStart, newEnd] = newPeriod
    for (let period of periods) {
      const [start, end] = period
      if (
        (newStart < end && newEnd > start) ||
        (start < newEnd && end > newStart)
      ) {
        return true
      }
    }
    return false
  }

  const checkRoutineDates = () => {
    if (colPtRoutine?.routineType !== 'specificDate') {
      return true
    }

    const startDate = dayjs(openingPeriod.startDate)
      .subtract(1, 'day')
      .startOf('day')
    const endDate = dayjs(openingPeriod.endDate).add(1, 'day').endOf('day')

    return colPtRoutine.routineContent.every((content) => {
      const contentDate = dayjs(content.id)
      return contentDate.isAfter(startDate) && contentDate.isBefore(endDate)
    })
  }

  const checkEffectiveDate = () => {
    const startDate = dayjs(openingPeriod.startDate).startOf('day')
    const endDate = dayjs(openingPeriod.endDate).endOf('day')

    if (startDate.isAfter(endDate)) {
      return false
    } else {
      return true
    }
  }

  const isOpeningPeriodValid = () => {
    return (
      validDayjsISODate(openingPeriod.startDate) &&
      validDayjsISODate(openingPeriod.endDate)
    )
  }

  const isOpeningPeriodEmpty = () => {
    return !openingPeriod.startDate || !openingPeriod.endDate
  }

  useEffect(() => {
    const validate = async () => {
      //do validation here

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
      address == ''
        ? tempV.push({
            field: 'col.address',
            problem: formErr.incorrectAddress,
            type: 'error'
          })
        : // (await checkAddressUsed(contractNo, address)) &&
          //   tempV.push({
          //     field: "col.address",
          //     problem: formErr.hasBeenUsed,
          //     type: "error",
          //   });
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
      colPtRoutine?.routineType == 'weekly' &&
        colPtRoutine?.routineContent.length === 0 &&
        tempV.push({
          field: 'component.routine.everyWeekDay',
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
          problem: formErr.endTimeBehindStartTime,
          type: 'error'
        })

      !checkTimeNotOverlapping() &&
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
      if (colType === 'CPT00003') {
        premiseType == '' &&
          tempV.push({
            field: 'col.premiseType',
            problem: formErr.empty,
            type: 'error'
          })
      }
      // premiseRemark == '' && premiseType === 'PT00009' &&
      //   tempV.push({
      //     field: 'col.premiseRemark',
      //     problem: formErr.empty,
      //     type: 'error'
      //   })
      recyclables.length == 0 &&
        tempV.push({
          field: 'col.recycType',
          problem: formErr.empty,
          type: 'error'
        })
      isOpeningPeriodEmpty() &&
        tempV.push({
          field: `${t('col.effFromDate')}`,
          problem: formErr.empty,
          type: 'error'
        })

      !isOpeningPeriodValid() &&
        tempV.push({
          field: `${t('col.effFromDate')}`,
          problem: formErr.wrongFormat,
          type: 'error'
        })

      !checkRoutineDates() &&
        tempV.push({
          field: 'date',
          problem: formErr.dateSpesificIsWrong,
          type: 'error'
        })
      !checkRecyclable() &&
        tempV.push({
          field: 'inventory.recyleSubType',
          problem: formErr.empty,
          type: 'error'
        })
      !checkEffectiveDate() &&
        tempV.push({
          field: 'col.effDate',
          problem: formErr.effectiveDateLess,
          type: 'error'
        })
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
      //console.log(tempV);
    }

    validate()
  }, [
    colType,
    siteType,
    colPtRoutine,
    colPtRoutine?.routineContent,
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
    // console.log(skip, skipValidation)
    var tempSkipValid = Object.assign([], skipValidation)
    tempSkipValid.push(skip)
    setSkipValidation(tempSkipValid)
  }

  const checkEPD = (contractNo: string) => {
    const contract = contractList.find((contract) => {
      return contract.contractNo == contractNo
    })
    if (contract) {
      setEPDEnable(contract.isEpd)
    }
  }

  const checkContractisEff = (contractNo: string) => {
    const contract = contractList.find((contract) => {
      return contract.contractNo == contractNo
    })
    var isBetween = false
    if (contract) {
      const contractStart = dayjs(contract.frmDate)
      const contractEnd = dayjs(contract.toDate)
      const openingStart = dayjs(openingPeriod.startDate)
      const openingEnd = dayjs(openingPeriod.endDate)

      isBetween =
        (contractStart.isSame(openingStart, 'day') ||
          contractStart.isBefore(openingStart, 'day')) &&
        (contractEnd.isSame(openingEnd, 'day') ||
          contractEnd.isAfter(openingEnd, 'day'))
    }
    return isBetween
  }

  const checkAddressUsed = async (contractNo: string, address: string) => {
    if (contractNo != colInfo.contractNo || address != colInfo.address) {
      const result = await findCollectionPointExistByContractAndAddress(
        contractNo,
        address
      )
      if (result && result.data != undefined) {
        //console.log(result.data)
        return result.data
      }
    }

    return false
  }

  function convertToUTCWithOffset(dateString: any) {
    // Parse the date and subtract 8 hours (HK time is UTC+8)
    const date = new Date(`${dateString}T00:00:00+08:00`)
    return date.toISOString()
  }

  const handleSaveOnClick = async () => {
    try {
      const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
      if (validation.length == 0) {
        const utcEffFrmDate = convertToUTCWithOffset(
          dayjs(openingPeriod.startDate).format('YYYY-MM-DD')
        )
        const utcEffToDate = convertToUTCWithOffset(
          dayjs(openingPeriod.endDate).format('YYYY-MM-DD')
        )
        const cp: updateCP = {
          colPointTypeId: colType,
          effFrmDate: utcEffFrmDate,
          effToDate: utcEffToDate,
          routine: colPtRoutine,
          address: address,
          gpsCode: toGpsCode(gpsCode[0], gpsCode[1]),
          epdFlg: EPDEnable,
          // extraServiceFlg: !serviceType,
          serviceFlg: serviceFlg,
          siteTypeId: siteType,
          contractNo: contractNo,
          noOfStaff: parseInt(staffNum),
          status: status ? 'CREATED' : 'CLOSED',
          premiseName: premiseName,
          premiseTypeId: premiseType,
          premiseRemark: premiseRemark,
          normalFlg: true,
          updatedBy: loginId,
          colPtRecyc: recyclables,
          roster: [],
          version: version
        }
        const result = await updateCollectionPoint(colInfo.colId, cp)
        const data = result?.data
        if (data) {
          //console.log('updated collection point: ', data)
          navigate('/collector/collectionPoint', { state: 'updated' })
        }
      } else {
        //console.log('recyclables', recyclables)
        //console.log(validation)
        setTrySubmited(true)
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      } else if (state.code === STATUS_CODE[409]) {
        showErrorToast(error.response.data.message)
      }
    }
  }

  const handleCancelOnClick = () => {
    //console.log('Cancel click')
    navigate(-1) //goback to last page
  }

  const handleHeaderOnClick = () => {
    //console.log('Header click')
    navigate(-1) //goback to last page
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

  const createdDate = colInfo.createdAt
    ? displayCreatedDate(colInfo.createdAt)
    : dayjs(new Date()).format(format.dateFormat1)

  const isIncludeOthersPremis = () => {
    return (
      premiseType === 'PT00009' ||
      premiseType === 'PT00027' ||
      premiseType === 'PT00028'
    )
  }

  return (
    <>
      <Box
        sx={
          (styles.innerScreen_container,
          { paddingLeft: { xs: 0 }, width: '80%' })
        }
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          <Grid
            container
            direction={'column'}
            spacing={2.5}
            sx={
              (styles.gridForm,
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
                <Typography sx={styles.header1}>{t('col.editCP')}</Typography>
              </Button>
            </Grid>

            <CustomField label={t('col.colType')} mandatory={true}>
              <ColPointTypeList
                setState={setCOLType}
                colPointTypes={typeList.colPoint}
                defaultValue={colType}
                editable={false}
              />
            </CustomField>

            <CustomField label={t('col.siteType')} mandatory={true}>
              <SiteTypeList
                setState={setSiteType}
                siteTypes={typeList.site}
                error={checkString(siteType)}
                defaultValue={siteType}
                editable={false}
              />
            </CustomField>

            <CustomField label={t('col.colName')}>
              <Typography
                sx={{
                  ...styles.formDataText,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '750px',
                  whiteSpace: 'nowrap'
                }}
              >
                {colInfo.colName}
              </Typography>
            </CustomField>

            <CustomField
              label={`${t('col.address')} (${t('col.addressReminder')})`}
              mandatory={true}
            >
              <CustomTextField
                id="address"
                placeholder={t('col.enterAddress')}
                // onChange={(event) => handleSearchTextChange(event)}
                //hardcode the gps
                onChange={(e) => {
                  // Handle the onClick event here
                  setAddress(e.target.value) // Set the hardcoded address
                  setGPSCode([22.426887, 114.211165]) // Set the hardcoded GPS coordinates
                }}
                // endAdornment={locationSelect(setCPLocation)}
                value={address ? address : searchText}
                error={checkString(address)}
              />
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

            <CustomField label={t('col.effFromDate')} mandatory={true}>
              <CustomPeriodSelect
                setDate={setOpeningPeriod}
                defaultStartDate={openingPeriod.startDate}
                defaultEndDate={openingPeriod.endDate}
              />
            </CustomField>

            <CustomField
              label={t('col.startTime')}
              mandatory={true}
              style={{ width: '100%' }}
              error={!checkTimeNotOverlapping()}
              helperText={
                !checkTimeNotOverlapping() ? t('error.timeOverlap') : ''
              }
            >
              <RoutineSelect
                setRoutine={setColPtRoutine}
                requiredTimePeriod={true}
                defaultValue={{
                  routineType: colInfo.routineType,
                  routineContent: colInfo.routine
                }}
              />
            </CustomField>
            {trySubmited && !checkTimeNotOverlapping() && (
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
                defaultValue={premiseName}
              />
            </CustomField>
            {colType === 'CPT00003' && (
              <CustomField label={t('col.premiseType')} mandatory={true}>
                <PremiseTypeList
                  setState={setPremiseType}
                  premiseTypes={typeList.premise}
                  error={checkString(premiseType)}
                  defaultValue={premiseType}
                  editable={false}
                />
              </CustomField>
            )}

            {isIncludeOthersPremis() && (
              <Grid item>
                {/* <Collapse in={premiseType == "PT00010"} > */}
                <CustomField
                  label={
                    premiseType === 'PT00027'
                      ? t('col.otherResidentialPremise')
                      : t('col.otherNonResidentialPremise')
                  }
                  mandatory={false}
                >
                  <CustomTextField
                    id="premiseRemark"
                    disabled={true}
                    placeholder={t('col.enterText')}
                    onChange={(event) => setPremiseRemark(event.target.value)}
                    defaultValue={premiseRemark}
                    error={checkString(premiseRemark)}
                  />
                </CustomField>
                {/* </Collapse> */}
              </Grid>
            )}

            <CustomField label={t('col.status')}>
              <CustomSwitch
                onText={t('col.open')}
                offText={t('col.close')}
                defaultValue={colInfo.status == 'CREATED'}
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
                defaultRecycL={recyclables}
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
                defaultValue={staffNum}
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
                defaultValue={contractNo}
                onChange={(event, value) => {
                  //console.log(value)
                  if (value) {
                    setContractNo(value)
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t('col.enterNo')}
                    sx={[styles.textField, { width: 250 }]}
                    InputProps={{
                      ...params.InputProps,
                      sx: styles.inputProps
                    }}
                  />
                )}
                noOptionsText={t('common.noOptions')}
              />
            </CustomField>
            {colType !== 'CPT00001' && (
              <CustomField label={t('col.serviceType')}>
                <CustomItemList
                  items={serviceTypeList}
                  singleSelect={setServiceFlg}
                  defaultSelected={serviceFlg}
                  editable={false}
                ></CustomItemList>
              </CustomField>
            )}
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  sx={{
                    ...styles.header3,
                    paddingX: '4px',
                    paddingRight: '16px'
                  }}
                >
                  {t('common.createdDatetime') +
                    ' : ' +
                    displayCreatedDate(colInfo.createdAt)}
                </Typography>
                <Typography
                  sx={{
                    ...styles.header3,
                    paddingX: '4px',
                    paddingLeft: '16px',
                    borderLeft: '1px solid #ACACAC'
                  }}
                >
                  {t('common.lastUpdateDatetime') +
                    ' : ' +
                    displayCreatedDate(colInfo.updatedAt)}
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
                onClick={() => handleSaveOnClick()}
              >
                {t('col.save')}
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
                validation.map((val, index) => (
                  <FormErrorMsg
                    key={index}
                    field={t(val.field)}
                    errorMsg={returnErrorMsgCP(val.problem, t)}
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
