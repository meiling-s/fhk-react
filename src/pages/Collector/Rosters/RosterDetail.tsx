import { FunctionComponent, useState, useEffect } from 'react'
import {
  Box,
  Divider,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Typography
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { ADD_CIRCLE_ICON } from '../../../themes/icons'
import { REMOVE_CIRCLE_ICON } from '../../../themes/icons'

import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import CustomItemList, { StaffName } from '../../../components/FormComponents/CustomItemList'
import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import { ToastContainer, toast } from 'react-toastify'
import { styles } from '../../../constants/styles'
import {
  displayLocalDate,
  displayLocalDateWitoutOffset,
  showErrorToast,
  showSuccessToast
} from '../../../utils/utils'

import { Languages, formErr } from '../../../constants/constant'
import { returnErrorMsg } from '../../../utils/utils'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import { Roster, Staff } from '../../../interfaces/roster'
import { getCollectionPoint } from '../../../APICalls/collectionPointManage'
import {
  createRoster,
  addRosterStaff,
  deleteRosterStaff,
  updateRoster,
  cancelRoster
} from '../../../APICalls/roster'

import { localStorgeKeyName } from '../../../constants/constant'
import dayjs, { Dayjs } from 'dayjs'
import { collectionPoint } from '../../../interfaces/collectionPoint'
import { getStaffList } from '../../../APICalls/staff'
import { setDate } from 'date-fns'
import { format } from '../../../constants/constant'
import i18n from '../../../setups/i18n'

interface RosterDetailProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  selectedRoster?: Roster | null
  selectedDate: string
  rosterColId?: number | null
}

const RosterDetail: FunctionComponent<RosterDetailProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  selectedRoster,
  selectedDate,
  rosterColId
}) => {
  const { t } = useTranslation()
  const initStaff: string[] = ['']

  const [rosterDate, setRosterDate] = useState<string>('')
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs())
  const [endDate, setEndDate] = useState<dayjs.Dayjs>(dayjs())
  const [selectedColPoint, setSelectedColPoint] = useState<string>('')
  const [routineType, setRoutineType] = useState<string>('once')
  const [selectedStaff, setSelectedStaff] = useState<string[]>(initStaff)
  const [colPointList, setColPointList] = useState<il_item[]>([])
  const [staffList, setStaffList] = useState<il_item[]>([])
  const routineTypeList = [
    {
      id: 'once',
      name: t('roster.once')
    },
    {
      id: 'everyday',
      name: t('roster.everyday')
    },
    {
      id: 'weekly',
      name: t('roster.weekly')
    }
  ]

  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const loginName = localStorage.getItem(localStorgeKeyName.username) || ''
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ''

  useEffect(() => {
    initCollectionPoint()
    initStaffList()
  }, [drawerOpen])

  useEffect(() => {
    resetFormData()
    if (action !== 'add') {
      mappingData()
    } else {
      setRosterDate(selectedDate)
      if (rosterColId) setSelectedColPoint(rosterColId.toString())
    }
  }, [drawerOpen])

  const initCollectionPoint = async () => {
    const result = await getCollectionPoint(0, 1000)
    const data = result?.data.content
    if (data && data.length > 0) {
      const collectionPoint: il_item[] = []
      data.map((item: collectionPoint) => {
        collectionPoint.push({
          id: item.colId,
          name: item.colName
        })
      })

      setColPointList(collectionPoint)
    }
  }

  const initStaffList = async () => {
    const result = await getStaffList(0, 1000)
    if (result) {
      const data = result.data.content
      var staffMapping: StaffName[] = []
      data.map((item: any) => {
        let name:string = '';

        switch(i18n.language){
          case Languages.ENUS: 
            name = item.staffNameEng;
            break;
          case Languages.ZHCH:
            name = item.staffNameSchi
            break;
          default: 
            name = item.staffNameTchi
            break;
        }
        staffMapping.push({
          id: item.staffId,
          name: name,
          nameEng: item.staffNameEng,
          nameSc: item.staffNameSchi,
          nameTc: item.staffNameTchi
        })
      })
      setStaffList(staffMapping)
    }
  }

  const mappingData = () => {
    if (selectedRoster != null) {
      const staffIdList: string[] = selectedRoster.staff?.map((item: Staff) => {
        return item.staffId
      })
      setRosterDate(selectedRoster.startAt)
      setStartDate(dayjs(selectedRoster.startAt))
      setEndDate(dayjs(selectedRoster.endAt))
      setSelectedColPoint(selectedRoster.collectionPoint.colId.toString())
      setRoutineType(selectedRoster.routineType)
      setSelectedStaff(staffIdList.length > 0 ? staffIdList : initStaff)
    }
  }

  const resetFormData = () => {
    setRosterDate('')
    setSelectedColPoint('')
    setStartDate(dayjs())
    setEndDate(dayjs())
    setSelectedStaff(initStaff)
    setValidation([])
    setTrySubmited(false)
  }

  useEffect(() => {
    const validate = async () => {
      const tempV: formValidate[] = []

      selectedStaff.every((staffId) => staffId.trim() == '') &&
        tempV.push({
          field: t('roster.staff'),
          problem: formErr.empty,
          type: 'error'
        })
      startDate > endDate &&
        tempV.push({
          field: t('roster.timeBy'),
          problem: formErr.startDateBehindEndDate,
          type: 'error'
        })
      endDate < startDate &&
        tempV.push({
          field: t('roster.to'),
          problem: formErr.endDateEarlyThanStartDate,
          type: 'error'
        })

      setValidation(tempV)
    }

    validate()
  }, [selectedStaff, startDate, endDate])

  const formattedDate = (dateData: dayjs.Dayjs) => {
    return dateData.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  }

  const handleSubmit = () => {
    if (action == 'add') {
      handleCreateRoster()
    } else {
      handleEditRoster()
    }
  }

  const deleteStaff = async (rosterId: number) => {
    let allResponseSuccess = true
    if (selectedRoster!.staff.length > 0) {
      for (const key in selectedRoster!.staff) {
        const staffId = selectedRoster!.staff[key].staffId
        const response = await deleteRosterStaff(rosterId, staffId)
        if (!response) {
          allResponseSuccess = false
          break
        }
      }
    }

    if (allResponseSuccess) {
      addStaff(rosterId, 'edit')
    } else {
      showErrorToast(t('roster.errorCreatedRoster'))
      onSubmitData('error', 'Some data creation failed')
    }
  }

  const addStaff = async (rosterId: number, type: string) => {
    let allResponseSuccess = true

    for (const key in selectedStaff) {
      const staffId = selectedStaff[key]
      const response = await addRosterStaff(rosterId, staffId)
      if (!response) {
        allResponseSuccess = false
        break
      }
    }

    if (allResponseSuccess) {
      onSubmitData('success', 'Success created data')
      resetFormData()
      handleDrawerClose()
      type == 'create'
        ? showSuccessToast(t('roster.successCreatedRoster'))
        : showSuccessToast(t('roster.successEditRoster'))
    } else {
      showErrorToast(t('roster.errorCreatedRoster'))
      onSubmitData('error', 'Some data creation failed')
    }
  }

  const handleCreateRoster = async () => {
    const rosterForm = {
      tenantId: tenantId,
      routineType: routineType,
      startAt: formattedDate(startDate),
      endAt: formattedDate(endDate),
      status: 'ACTIVE',
      colId: selectedColPoint,
      createdBy: loginName,
      updatedBy: loginName
    }
    if (validation.length === 0) {
      const result = await createRoster(rosterForm)

      if (result) {
        const rosterId = result.data.rosterId
        addStaff(rosterId, 'create')
      } else {
        setTrySubmited(true)
        showErrorToast(t('roster.errorCreatedRoster'))
        onSubmitData('error', 'Failed created data')
      }
    } else {
      setTrySubmited(true)
    }
  }

  const handleEditRoster = async () => {
    const updateForm = {
      routineType: routineType,
      startAt: formattedDate(startDate),
      endAt: formattedDate(endDate),
      status: 'ACTIVE',
      reason: 0,
      createdBy: loginName,
      updatedBy: loginName
    }
    // console.log('validation', validation)
    if (validation.length === 0) {
      if (selectedRoster != null) {
        const result = await updateRoster(updateForm, selectedRoster.rosterId)
        if (result) {
          const rosterId = result.data.rosterId
          deleteStaff(rosterId)
        } else {
          setTrySubmited(true)
          onSubmitData('error', 'Failed edit data')
          showErrorToast(t('roster.errorEditRoster'))
        }
      } else {
        setTrySubmited(true)
        showErrorToast(t('roster.errorEditRoster'))
      }
    } else {
      setTrySubmited(true)
    }
  }

  const handleCancelRoster = async () => {
    const cancelForm = {
      reason: 0,
      updatedBy: loginName
    }
    if (selectedRoster) {
      const result = await cancelRoster(cancelForm, selectedRoster?.rosterId)
      if (result) {
        onSubmitData('success', 'Success created data')
        resetFormData()
        handleDrawerClose()
        showSuccessToast(t('roster.successDeletedRoster'))
      } else {
        onSubmitData('error', 'Failed created data')
        showErrorToast(t('roster.errorDeletedRoster'))
      }
    }
  }

  const handleRemoveStaff = (indexToRemove: number) => {
    const updatedContractNum = selectedStaff.filter(
      (_, index) => index !== indexToRemove
    )
    setSelectedStaff(updatedContractNum)
  }

  const handleAddStaff = () => {
    const updatedContractNum = [...selectedStaff, '']
    setSelectedStaff(updatedContractNum)
  }

  const handleStaffChange = (value: string, index: number) => {
    // console.log('value', value)
    const updatedStaff = [...selectedStaff]
    updatedStaff[index] = value
    setSelectedStaff(updatedStaff)
  }

  return (
    <div className="roster-details">
      <ToastContainer></ToastContainer>
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={action}
        headerProps={{
          title: action == 'add' ? t('userAccount.new') : t('userGroup.change'),
          subTitle: t('roster.schedule'),
          submitText: t('add_warehouse_page.save'),
          cancelText: t('add_warehouse_page.delete'),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
          onDelete: handleCancelRoster
        }}
      >
        <Divider></Divider>
        <Box sx={{ PaddingX: 2 }}>
          <Grid
            container
            direction={'column'}
            spacing={4}
            sx={{
              width: { xs: '100%' },
              marginTop: { sm: 2, xs: 6 },
              marginLeft: {
                xs: 0
              },
              paddingRight: 2
            }}
            className="sm:ml-0 mt-o w-full"
          >
            <Grid item>
              <CustomField label={t('roster.date')}>
                {action == 'add' ? (
                  <Box sx={{ ...localStyle.DateItem }}>
                    <DatePicker
                      defaultValue={dayjs()}
                      format={format.dateFormat2}
                      onChange={(value) => {
                        setStartDate(value!!)
                        setEndDate(value!!)
                      }}
                      sx={{ ...localStyle.datePicker }}
                    />
                  </Box>
                ) : (
                  <Typography sx={localStyle.textField}>
                    {displayLocalDateWitoutOffset(rosterDate)}
                  </Typography>
                )}
              </CustomField>
            </Grid>
            <Grid item sx={{ display: 'flex', gap: '8px' }}>
              <Box>
                <Typography sx={styles.header3}>
                  {t('roster.timeBy')}
                </Typography>
                <Box sx={{ ...localStyle.timePeriodItem }}>
                  <TimePicker
                    value={startDate}
                    onChange={(value) => setStartDate(value!!)}
                    sx={{ ...localStyle.timePicker }}
                  />
                </Box>
              </Box>
              <Box>
                <Typography sx={styles.header3}>{t('roster.to')}</Typography>
                <Box sx={{ ...localStyle.timePeriodItem }}>
                  <TimePicker
                    value={endDate}
                    onChange={(value) => setEndDate(value!!)}
                    sx={{ ...localStyle.timePicker }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Typography sx={{ ...styles.header3, marginBottom: 2 }}>
                {t('roster.recyclingPoint')}
              </Typography>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel id="recyclingPoint">
                  {t('roster.recyclingPoint')}
                </InputLabel>
                <Select
                  labelId="recyclingPoint"
                  id="recyclingPoint"
                  value={selectedColPoint}
                  sx={{
                    borderRadius: '12px'
                  }}
                  disabled={action === 'delete'}
                  label={t('vehicle.recyclingPoint')}
                  onChange={(event: SelectChangeEvent<string>) => {
                    setSelectedColPoint(event.target.value)
                  }}
                >
                  {colPointList?.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <CustomField label={t('roster.workWeek')}>
                <CustomItemList
                  items={routineTypeList}
                  singleSelect={(values) => setRoutineType(values)}
                  value={routineType}
                  defaultSelected={routineType}
                  //error={formik.errors.reason && formik.touched.vehicleTypeId}
                />
              </CustomField>
            </Grid>
            <Grid item>
              <Typography sx={{ ...styles.header3, marginBottom: 2 }}>
                {t('roster.staff')}
              </Typography>
              {selectedStaff.map((staff, index) => (
                <Box
                  key={index + staff}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px'
                  }}
                >
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="staff">
                      {t('roster.pleaseSelectAnEmployee')}
                    </InputLabel>
                    <Select
                      labelId="staff"
                      id="staff"
                      value={selectedStaff[index]}
                      sx={{
                        borderRadius: '12px'
                      }}
                      disabled={action === 'delete'}
                      label={t('roster.staff')}
                      onChange={(event: SelectChangeEvent<string>) => {
                        handleStaffChange(event.target.value, index)
                      }}
                      error={trySubmited && selectedStaff.length == 0}
                    >
                      {staffList?.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          {`${item.id} - ${item.name}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {index === selectedStaff.length - 1 ? (
                    <ADD_CIRCLE_ICON
                      fontSize="small"
                      className="text-green-primary cursor-pointer"
                      onClick={handleAddStaff}
                    />
                  ) : (
                    index !== selectedStaff.length - 1 && (
                      <REMOVE_CIRCLE_ICON
                        fontSize="small"
                        className={`text-grey-light ${
                          selectedStaff.length === 1
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer'
                        } `}
                        onClick={() => handleRemoveStaff(index)}
                      />
                    )
                  )}
                </Box>
              ))}
              <Grid item>
                {trySubmited &&
                  validation.map((val, index) => (
                    <FormErrorMsg
                      key={index}
                      field={t(val.field)}
                      errorMsg={returnErrorMsg(val.problem, t)}
                      type={val.type}
                    />
                  ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </RightOverlayForm>
    </div>
  )
}

let localStyle = {
  textField: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  timePicker: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: 'white',
    '& fieldset': {
      borderWidth: 0
    },
    '& input': {
      paddingX: 0
    },
    '& .MuiIconButton-edgeEnd': {
      color: '#79CA25'
    }
  },
  timePeriodItem: {
    display: 'flex',
    height: 'fit-content',
    paddingX: 2,
    alignItems: 'center',
    backgroundColor: 'white',
    border: 2,
    borderRadius: 3,
    borderColor: '#E2E2E2'
  },
  datePicker: {
    ...styles.textField,
    // width: '350px',
    '& .MuiIconButton-edgeEnd': {
      color: '#79CA25'
    }
  },
  DateItem: {
    display: 'flex',
    height: 'fit-content',
    alignItems: 'center'
  }
}

export default RosterDetail
