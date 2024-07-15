import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  Autocomplete,
  TextField,
  Modal,
  Divider,
  Stack,
  Typography
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import React, { SyntheticEvent, useEffect, useState } from 'react'
import { styles } from '../../constants/styles'
import CustomField from './CustomField'
import CustomSwitch from './CustomSwitch'
import CustomDatePicker2 from './CustomDatePicker2'
import CustomTextField from './CustomTextField'
import CustomItemList, { il_item } from './CustomItemList'
import CreateRecycleForm from './CreateRecycleForm'
import { useContainer } from 'unstated-next'
import {
  CreatePicoDetail,
  PickupOrder,
  PickupOrderDetail
} from '../../interfaces/pickupOrder'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { useNavigate } from 'react-router-dom'
import { DataGrid, GridColDef, GridRowSpacingParams } from '@mui/x-data-grid'
import { DELETE_OUTLINED_ICON, EDIT_OUTLINED_ICON } from '../../themes/icons'
import { t } from 'i18next'
import CustomAutoComplete from './CustomAutoComplete'
import CommonTypeContainer from '../../contexts/CommonTypeContainer'
import PicoRoutineSelect from '../SpecializeComponents/PicoRoutineSelect'
import PickupOrderList from '../../components/PickupOrderList'
import i18n from '../../setups/i18n'
import { useTranslation } from 'react-i18next'
import { Languages, format } from '../../constants/constant'
import { localStorgeKeyName } from '../../constants/constant'
import {
  getThemeColorRole,
  getThemeCustomList,
  displayCreatedDate,
  getPrimaryColor
} from '../../utils/utils'

import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import useLocaleTextDataGrid from '../../hooks/useLocaleTextDataGrid'
import useValidationPickupOrder from '../../pages/Collector/PickupOrder/useValidationPickupOrder'

dayjs.extend(utc)
dayjs.extend(timezone)

type DeleteModalProps = {
  open: boolean
  selectedRecycLoc?: CreatePicoDetail | null
  onClose: () => void
  onDelete: (id: number) => void
  editMode: boolean
}

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="bg-[#F7BBC6] p-3 rounded-xl w-1/2">
      <Typography
        style={{
          color: 'red',
          fontWeight: '400'
        }}
      >
        {message}
      </Typography>
    </div>
  )
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  selectedRecycLoc,
  onClose,
  onDelete,
  editMode
}) => {
  const { t } = useTranslation()
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          <Box sx={{ paddingX: 3, paddingTop: 3 }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold' }}
            >
              {t('pick_up_order.delete_msg')}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ alignSelf: 'center', paddingBottom: 3 }}>
            <button
              className="primary-btn mr-2 cursor-pointer"
              onClick={() => {
                if (editMode && selectedRecycLoc?.picoDtlId) {
                  onDelete(selectedRecycLoc?.picoDtlId)
                } else {
                  onDelete(selectedRecycLoc?.id)
                }
              }}
            >
              {t('check_in.confirm')}
            </button>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={() => {
                onClose()
              }}
            >
              {t('check_out.cancel')}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

const PickupOrderCreateForm = ({
  selectedPo,
  title,
  formik,
  setState,
  state,
  editMode
}: {
  selectedPo?: PickupOrder
  title: string
  formik: any
  setState: (val: CreatePicoDetail[]) => void
  state: CreatePicoDetail[]
  editMode: boolean
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [editRowId, setEditRowId] = useState<number | null>(null)
  const [updateRowId, setUpdateRowId] = useState<number | null>(null)
  const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'
  const [id, setId] = useState<number>(0)
  const [picoRefId, setPicoRefId] = useState('')
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const {
    logisticList,
    contractType,
    vehicleType,
    recycType,
    dateFormat,
    getLogisticlist,
    getContractList,
    getRecycType
  } = useContainer(CommonTypeContainer)
  const navigate = useNavigate()
  const { localeTextDataGrid } = useLocaleTextDataGrid()
  const logisticCompany = logisticList
  const contractRole = contractType
  const [index, setIndex] = useState<number | null>(null)
  const { validateData, errorsField, changeTouchField } =
    useValidationPickupOrder(formik.values, state)

  const unexpiredContracts = contractRole
    ? contractRole?.filter((contract) => {
        const currentDate = new Date()
        const contractDate = new Date(contract.contractToDate)
        return contractDate > currentDate
      })
    : []
  const [recycbleLocId, setRecycbleLocId] = useState<CreatePicoDetail | null>(
    null
  )

  // set custom style each role
  const colorTheme: string = getThemeColorRole(role)
  const customListTheme = getThemeCustomList(role)
  const [prevLang, setPrevLang] = useState(i18n.language)

  const buttonFilledCustom = {
    borderRadius: '40px',
    borderColor: '#7CE495',
    backgroundColor: colorTheme,
    color: 'white',
    fontWeight: 'bold',
    transition: '0.3s',
    '&.MuiButton-root:hover': {
      backgroundColor: colorTheme,
      borderColor: '#D0DFC2',
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)'
    }
  }
  const buttonOutlinedCustom = {
    borderRadius: '40px',
    border: 1,
    borderColor: colorTheme,
    backgroundColor: 'white',
    color: colorTheme,
    fontWeight: 'bold',
    '&.MuiButton-root:hover': {
      bgcolor: '#F4F4F4'
    },
    width: 'max-content'
  }

  const endAdornmentIcon = {
    fontSize: 25,
    color: colorTheme
  }

  const picoIdButton = {
    flexDirection: 'column',
    borderRadius: '8px',
    width: '400px',
    padding: '32px',
    border: 1,
    borderColor: colorTheme,
    backgroundColor: 'white',
    color: 'black',
    fontWeight: 'bold',
    '&.MuiButton-root:hover': {
      bgcolor: '#F4F4F4'
    }
  }
  //-- end custom style --

  useEffect(() => {
    getLogisticlist()
    getContractList()
    getRecycType()
  }, [])

  const handleCloses = () => {
    setIsEditing(false)
    setEditRowId(null)
    setUpdateRowId(null)
    setOpenModal(false)
    setIndex(null)
  }

  const handleEditRow = (id: number) => {
    setIsEditing(true)
    setEditRowId(id)
    setOpenModal(true)
  }

  const handleDeleteRow = (id: any) => {
    if (editMode) {
      let updateDeleteRow = state.filter((row, index) => index != id)
      updateDeleteRow = updateDeleteRow.map((picoDtl, index) => {
        return {
          ...picoDtl,
          status: picoDtl.picoDtlId === id ? 'DELETED' : picoDtl.status
        }
      })
      setState(updateDeleteRow)
    } else {
      let updateDeleteRow = state.filter((row) => row.id !== id)
      setState(updateDeleteRow)
    }
  }

  const createdDate = selectedPo
    ? dayjs
        .utc(selectedPo.createdAt)
        .tz('Asia/Hong_Kong')
        .format(`${dateFormat} HH:mm`)
    : dayjs.utc(new Date()).tz('Asia/Hong_Kong').format(`${dateFormat} HH:mm`)

  const approveAt = selectedPo?.approvedAt
    ? dayjs
        .utc(selectedPo?.approvedAt)
        .tz('Asia/Hong_Kong')
        .format(`${dateFormat} HH:mm`)
    : dayjs
        .utc(selectedPo?.updatedAt)
        .tz('Asia/Hong_Kong')
        .format(`${dateFormat} HH:mm`)

  const handleHeaderOnClick = () => {
    //console.log('Header click')
    navigate(-1) //goback to last page
  }
  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  const getvehicleType = () => {
    if (vehicleType) {
      const carType: il_item[] = []
      vehicleType?.forEach((vehicle) => {
        var name = ''
        switch (i18n.language) {
          case 'enus':
            name = vehicle.vehicleTypeNameEng
            break
          case 'zhch':
            name = vehicle.vehicleTypeNameSchi
            break
          case 'zhhk':
            name = vehicle.vehicleTypeNameTchi
            break
          default:
            name = vehicle.vehicleTypeNameTchi //default fallback language is zhhk
            break
        }
        const vehicleType: il_item = {
          id: vehicle.vehicleTypeId,
          name: name
        }
        carType.push(vehicleType)
      })
      return carType
    }
  }

  const getReason = () => {
    const reasonList = [
      {
        id: '1',
        reasonEn: 'Broken Car',
        reasonSchi: '坏车',
        reasonTchi: '壞車'
      },
      {
        id: '2',
        reasonEn: 'Surplus of Goods',
        reasonSchi: '货物过剩',
        reasonTchi: '貨物過剩'
      }
    ]
    const reasons: il_item[] = []
    reasonList.forEach((item) => {
      var name = ''
      switch (i18n.language) {
        case 'enus':
          name = item.reasonEn
          break
        case 'zhch':
          name = item.reasonSchi
          break
        case 'zhhk':
          name = item.reasonTchi
          break
        default:
          name = item.reasonTchi //default fallback language is zhhk
          break
      }
      const reasonItem: il_item = {
        id: item.id,
        name: name
      }
      reasons.push(reasonItem)
    })
    return reasons
  }

  const onDeleteModal = (id: number) => {
    handleDeleteRow(id)
    setOpenDelete(false)
  }

  const columns: GridColDef[] = [
    {
      field: 'pickupAt',
      headerName: t('pick_up_order.recyclForm.shipping_time'),
      width: 150
    },
    {
      field: 'recycType',
      headerName: t('pick_up_order.detail.main_category'),
      width: 150,
      editable: true,
      valueGetter: ({ row }) => {
        const matchingRecycType = recycType?.find(
          (item) => item.recycTypeId === row.recycType
        )
        if (matchingRecycType) {
          var name = ''
          switch (i18n.language) {
            case 'enus':
              name = matchingRecycType.recyclableNameEng
              break
            case 'zhch':
              name = matchingRecycType.recyclableNameSchi
              break
            case 'zhhk':
              name = matchingRecycType.recyclableNameTchi
              break
            default:
              name = matchingRecycType.recyclableNameTchi //default fallback language is zhhk
              break
          }
          return name
        }
      }
    },
    {
      field: 'recycSubType',
      headerName: t('pick_up_order.detail.subcategory'),
      type: 'string',
      width: 150,
      editable: true,
      valueGetter: ({ row }) => {
        const matchingRecycType = recycType?.find(
          (item) => item.recycTypeId === row.recycType
        )
        if (matchingRecycType) {
          const matchrecycSubType = matchingRecycType.recycSubType?.find(
            (subtype) => subtype.recycSubTypeId === row.recycSubType
          )
          if (matchrecycSubType) {
            var subName = ''
            switch (i18n.language) {
              case 'enus':
                subName = matchrecycSubType?.recyclableNameEng ?? ''
                break
              case 'zhch':
                subName = matchrecycSubType?.recyclableNameSchi ?? ''
                break
              case 'zhhk':
                subName = matchrecycSubType?.recyclableNameTchi ?? ''
                break
              default:
                subName = matchrecycSubType?.recyclableNameTchi ?? '' //default fallback language is zhhk
                break
            }

            return subName
          }
        }
      }
    },
    {
      field: 'weight',
      headerName: t('pick_up_order.detail.weight'),
      type: 'string',
      width: 150,
      editable: true
    },
    {
      field: 'senderName',
      headerName: t('pick_up_order.detail.sender_name'),
      type: 'string',
      width: 150,
      editable: true
    },
    {
      field: 'receiverName',
      headerName: t('pick_up_order.detail.receiver'),
      type: 'string',
      width: 150,
      editable: true
    },
    {
      field: 'senderAddr',
      headerName: t('pick_up_order.detail.recycling_location'),
      type: 'string',
      width: 150,
      editable: true
    },
    {
      field: 'receiverAddr',
      headerName: t('pick_up_order.detail.arrived'),
      type: 'string',
      width: 200,
      editable: true
    },
    {
      field: 'edit',
      headerName: t('notification.menu_staff.edit'),
      width: 100,
      filterable: false,
      renderCell: (params) => (
        <IconButton>
          <EDIT_OUTLINED_ICON
            onClick={() => {
              setIndex(params.row.id)
              handleEditRow(params.row.picoDtlId)
            }}
          />
        </IconButton>
      )
    },
    {
      field: 'delete',
      headerName: t('pick_up_order.item.delete'),
      filterable: false,
      width: 100,
      renderCell: (params) => (
        // <IconButton onClick={() => handleDeleteRow(params.row.id)}>
        //   <DELETE_OUTLINED_ICON />
        // </IconButton>
        <IconButton
          onClick={() => {
            console.log('params delete', params.row.picoDtlId)
            setOpenDelete(true)
            setRecycbleLocId(params.row)
          }}
        >
          <DELETE_OUTLINED_ICON />
        </IconButton>
      )
    }
  ]

  const [openPico, setOpenPico] = useState(false)

  const handleClosePicoList = () => {
    setOpenPico(false)
  }

  const selectPicoRefrence = (
    picodetail: PickupOrderDetail,
    picoId: string
  ) => {
    setPicoRefId(picoId)
    formik.setFieldValue('refPicoId', picoId)
    setOpenPico(false)
  }

  const resetPicoId = () => {
    setOpenPico(true)
    setPicoRefId('')
  }

  const getCurrentLogisticName = (value: string) => {
    let logisticName: string = ''
    if (!logisticCompany) return logisticName
    if (prevLang === Languages.ENUS) {
      const logistic = logisticCompany.find(
        (item) => item.logisticNameEng === value
      )
      if (i18n.language === Languages.ZHCH) {
        logisticName = logistic?.logisticNameSchi ?? ''
      } else if (i18n.language === Languages.ZHHK) {
        logisticName = logistic?.logisticNameTchi ?? ''
      }
    } else if (prevLang === Languages.ZHCH) {
      const logistic = logisticCompany.find(
        (item) => item.logisticNameSchi === value
      )
      if (i18n.language === Languages.ENUS) {
        logisticName = logistic?.logisticNameEng ?? ''
      } else if (i18n.language === Languages.ZHHK) {
        logisticName = logistic?.logisticNameTchi ?? ''
      }
    } else if (prevLang === Languages.ZHHK) {
      const logistic = logisticCompany.find(
        (item) => item.logisticNameTchi === value
      )
      if (i18n.language === Languages.ZHCH) {
        logisticName = logistic?.logisticNameSchi ?? ''
      } else if (i18n.language === Languages.ENUS) {
        logisticName = logistic?.logisticNameEng ?? ''
      }
    }
    formik.setFieldValue('logisticName', logisticName)
  }

  useEffect(() => {
    if (formik?.values?.logisticName && prevLang !== i18n.language) {
      getCurrentLogisticName(formik.values.logisticName)
    }
    setPrevLang(i18n.language)
  }, [i18n.language])

  const onhandleSubmit = () => {
    const isValid = validateData()
    if (!isValid) return
    formik.handleSubmit()
  }

  return (
    <>
      {/* <form onSubmit={formik.handleSubmit}> */}
      <Box sx={[styles.innerScreen_container, { paddingRight: 0 }]}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          <Grid
            container
            direction={'column'}
            spacing={2.5}
            sx={{ ...styles.gridForm }}
          >
            <Grid item>
              <Button sx={[styles.headerSection]} onClick={handleHeaderOnClick}>
                <ArrowBackIosIcon sx={{ fontSize: 15, marginX: 0.5 }} />
                <Typography sx={styles.header1}>{title}</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Typography sx={styles.header2}>
                {t('pick_up_order.shipping_info')}
              </Typography>
            </Grid>
            {selectedPo && (
              <Grid item>
                <Grid item>
                  <CustomField label={t('pick_up_order.table.pico_id')}>
                    <Typography sx={styles.header2}>
                      {selectedPo.picoId}
                    </Typography>
                  </CustomField>
                </Grid>
              </Grid>
            )}
            <Grid item>
              <CustomField
                label={t('pick_up_order.select_shipping_category')}
                mandatory
              >
                <CustomSwitch
                  onText={t('pick_up_order.regular_shipping')}
                  offText={t('pick_up_order.one-transport')}
                  defaultValue={
                    selectedPo?.picoType === 'AD_HOC'
                      ? false
                      : selectedPo?.picoType === 'ROUTINE'
                      ? true
                      : true
                  }
                  setState={(value) =>
                    formik.setFieldValue(
                      'picoType',
                      value ? 'ROUTINE' : 'AD_HOC'
                    )
                  }
                  value={formik.values.picoType}
                />
              </CustomField>
            </Grid>
            <Grid item style={{ display: 'flex', flexDirection: 'column' }}>
              <CustomDatePicker2
                pickupOrderForm={true}
                setDate={(values) => {
                  formik.setFieldValue('effFrmDate', values.startDate)
                  formik.setFieldValue('effToDate', values.endDate)
                  changeTouchField('effFrmDate')
                  changeTouchField('effToDate')
                }}
                defaultStartDate={selectedPo?.effFrmDate}
                defaultEndDate={selectedPo?.effToDate}
                iconColor={colorTheme}
              />
              {/* {errorsField.effFrmDate.status ? (
                <ErrorMessage message={errorsField.effFrmDate.message} />
              ) : (
                ''
              )}
              {errorsField.effToDate.status ? (
                <ErrorMessage message={errorsField.effToDate.message} />
              ) : (
                ''
              )} */}
            </Grid>
            {formik.values.picoType == 'ROUTINE' && (
              <Grid item style={{ display: 'flex', flexDirection: 'column' }}>
                <CustomField
                  label={t('pick_up_order.table.delivery_date')}
                  style={{ width: '100%' }}
                  mandatory
                >
                  <PicoRoutineSelect
                    setRoutine={(values) => {
                      formik.setFieldValue('routineType', values.routineType)
                      formik.setFieldValue('routine', values.routineContent)
                      changeTouchField('routine')
                    }}
                    defaultValue={{
                      routineType: selectedPo?.routineType ?? 'daily',
                      routineContent: selectedPo?.routine ?? []
                    }}
                    itemColor={{
                      bgColor: customListTheme.bgColor,
                      borderColor: customListTheme
                        ? customListTheme.border
                        : '#79CA25'
                    }}
                    roleColor={colorTheme}
                  />
                </CustomField>
                {/* {errorsField.routine.status ? (
                  <ErrorMessage message={errorsField.routine.message} />
                ) : (
                  ''
                )} */}
              </Grid>
            )}

            <Grid item style={{ display: 'flex', flexDirection: 'column' }}>
              <CustomField label={t('pick_up_order.choose_logistic')} mandatory>
                <CustomAutoComplete
                  placeholder={t('pick_up_order.enter_company_name')}
                  option={
                    logisticCompany?.map((option) => {
                      if (i18n.language === Languages.ENUS) {
                        return option.logisticNameEng
                      } else if (i18n.language === Languages.ZHCH) {
                        return option.logisticNameSchi
                      } else {
                        return option.logisticNameTchi
                      }
                    }) ?? []
                  }
                  sx={{ width: '400px' }}
                  onChange={(_: SyntheticEvent, newValue: string | null) => {
                    formik.setFieldValue('logisticName', newValue)
                    changeTouchField('logisticName')
                  }}
                  onInputChange={(event: any, newInputValue: string) => {
                    formik.setFieldValue('logisticName', newInputValue) // Update the formik field value if needed
                    changeTouchField('logisticName')
                  }}
                  value={formik.values.logisticName}
                  inputValue={formik.values.logisticName}
                  error={
                    errorsField.logisticName.status
                    //formik.errors.logisticName && formik.touched.logisticName
                  }
                />
              </CustomField>
              {/* {errorsField.logisticName.status ? (
                <ErrorMessage message={errorsField.logisticName.message} />
              ) : (
                ''
              )} */}
            </Grid>
            <Grid item style={{ display: 'flex', flexDirection: 'column' }}>
              <CustomField
                label={t('pick_up_order.vehicle_category')}
                mandatory={false}
              >
                <CustomItemList
                  items={getvehicleType() || []}
                  singleSelect={(values) =>
                    formik.setFieldValue('vehicleTypeId', values)
                  }
                  value={formik.values.vehicleTypeId}
                  defaultSelected={selectedPo?.vehicleTypeId}
                  error={
                    errorsField.vehicleTypeId.status
                   // formik.errors.vehicleTypeId && formik.touched.vehicleTypeId
                  }
                  itemColor={{
                    bgColor: customListTheme.bgColor,
                    borderColor: customListTheme
                      ? customListTheme.border
                      : '#79CA25'
                  }}
                />
              </CustomField>
              {/* {errorsField.vehicleTypeId.status ? (
                <ErrorMessage message={errorsField.vehicleTypeId.message} />
              ) : (
                ''
              )} */}
            </Grid>
            <Grid item>
              <CustomField
                label={t('pick_up_order.plat_number')}
                mandatory={false}
              >
                <CustomTextField
                  id="platNo"
                  placeholder={t('pick_up_order.enter_plat_number')}
                  onChange={(event) => {
                    formik.setFieldValue('platNo', event.target.value)
                    changeTouchField('platNo')
                  }}
                  value={formik.values.platNo}
                  sx={{ width: '400px' }}
                  error={formik.errors.platNo && formik.touched.platNo}
                />
              </CustomField>
              {/* {errorsField.platNo.status ? (
                <ErrorMessage message={errorsField.platNo.message} />
              ) : (
                ''
              )} */}
            </Grid>
            <Grid item>
              <CustomField
                label={t('pick_up_order.contact_number')}
                mandatory={false}
              >
                <CustomTextField
                  id="contactNo"
                  placeholder={t('pick_up_order.enter_contact_number')}
                  onChange={(event) => {
                    // formik.handleChange(event.target.value)
                    formik.setFieldValue('contactNo', event.target.value)
                    changeTouchField('contactNo')
                  }}
                  value={formik.values.contactNo}
                  sx={{ width: '400px' }}
                  error={formik.errors.contactNo && formik.touched.contactNo}
                />
                {/* {errorsField.contactNo.status ? (
                  <ErrorMessage message={errorsField.contactNo.message} />
                ) : (
                  ''
                )} */}
              </CustomField>
            </Grid>
            {formik.values.picoType == 'ROUTINE' && (
              <Grid item>
                <Box>
                  <CustomField label={t('col.contractNo')}>
                    <Autocomplete
                      disablePortal
                      id="contractNo"
                      sx={{ width: 400 }}
                      defaultValue={formik.values.contractNo}
                      options={
                        unexpiredContracts?.map(
                          (contract) => contract.contractNo
                        ) || []
                      }
                      onChange={(event, value) => {
                        formik.setFieldValue('contractNo', value)
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={t('col.enterNo')}
                          sx={[styles.textField, { width: 400 }]}
                          InputProps={{
                            ...params.InputProps,
                            sx: styles.inputProps
                          }}
                        />
                      )}
                      noOptionsText={t('common.noOptions')}
                    />
                  </CustomField>
                </Box>
              </Grid>
            )}
            {formik.values.picoType == 'AD_HOC' && (
              <Grid item style={{ display: 'flex', flexDirection: 'column' }}>
                <CustomField
                  label={t('pick_up_order.adhoc.reason_get_off')}
                  mandatory
                >
                  <CustomItemList
                    items={getReason() || []}
                    singleSelect={(values) => {
                      formik.setFieldValue('reason', values)
                    }}
                    value={formik.values.reason}
                    defaultSelected={selectedPo?.reason}
                    error={
                      errorsField.AD_HOC.status
                      //formik.errors.reason && formik.touched.reason
                    }
                    itemColor={{
                      bgColor: customListTheme.bgColor,
                      borderColor: customListTheme
                        ? customListTheme.border
                        : '#79CA25'
                    }}
                  />
                </CustomField>
                {/* {errorsField.AD_HOC.status ? (
                  <ErrorMessage message={errorsField.AD_HOC.message} />
                ) : (
                  ''
                )} */}
              </Grid>
            )}
            {formik.values.picoType === 'AD_HOC' && (
              <>
                <Grid item>
                  <Typography sx={[styles.header3, { marginBottom: 1 }]}>
                    {t('pick_up_order.adhoc.po_number')}
                  </Typography>
                  {formik.values.refPicoId !== '' && formik.values.refPicoId ? (
                    <div className="flex items-center justify-between w-[390px]">
                      <div className="font-bold text-mini">
                        {formik.values.refPicoId}
                      </div>
                      <div
                        className={`text-mini cursor-pointer text-[${colorTheme}]`}
                        onClick={resetPicoId}
                      >
                        {t('pick_up_order.change')}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Button
                        sx={[picoIdButton]}
                        onClick={() => setOpenPico(true)}
                      >
                        <AddCircleIcon sx={{ ...endAdornmentIcon, pr: 1 }} />
                        {t('pick_up_order.choose')}
                      </Button>
                    </div>
                  )}
                </Grid>
              </>
            )}
            <Grid item>
              <Typography sx={styles.header2}>
                {t('pick_up_order.recyle_loc_info')}
              </Typography>
            </Grid>
            <Grid item>
              <CustomField label={''}>
                <DataGrid
                  rows={state.filter((row, index) => {
                    if (row.status !== 'DELETED') {
                      return {
                        ...row,
                        id: row.picoDtlId
                      }
                    }
                  })}
                  getRowId={(row) => row.id}
                  hideFooter
                  columns={columns}
                  disableRowSelectionOnClick
                  getRowSpacing={getRowSpacing}
                  localeText={localeTextDataGrid}
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                      border: 'none' // Remove the borders from the cells
                    },
                    '& .MuiDataGrid-row': {
                      bgcolor: 'white',
                      borderRadius: '10px'
                    },
                    '&>.MuiDataGrid-main': {
                      '&>.MuiDataGrid-columnHeaders': {
                        borderBottom: 'none'
                      }
                    },
                    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                      display: 'none'
                    },
                    '& .MuiDataGrid-overlay': {
                      display: 'none'
                    }
                  }}
                />
                {/* <Modal open={openModal} onClose={handleCloses}> */}
                <CreateRecycleForm
                  openModal={openModal}
                  data={state}
                  setId={setId}
                  setState={setState}
                  onClose={handleCloses}
                  editRowId={editRowId}
                  picoHisId={picoRefId}
                  isEditing={isEditing}
                  index={index}
                  editMode={editMode}
                />
                {/* </Modal> */}

                <PickupOrderList
                  drawerOpen={openPico}
                  handleDrawerClose={handleClosePicoList}
                  selectPicoDetail={selectPicoRefrence}
                  picoId={selectedPo?.picoId}
                ></PickupOrderList>

                <Button
                  variant="outlined"
                  startIcon={
                    <AddCircleIcon sx={{ ...endAdornmentIcon, pr: 1 }} />
                  }
                  onClick={() => {
                    setIndex(null)
                    setIsEditing(false)
                    setOpenModal(true)
                    changeTouchField('createPicoDetail')
                  }}
                  sx={{
                    height: '40px',
                    width: '100%',
                    mt: '20px',
                    borderColor: colorTheme,
                    color: 'black',
                    borderRadius: '10px'
                  }}
                >
                  {t('pick_up_order.new')}
                </Button>
              </CustomField>
            </Grid>
            <Grid item>
              {/* {errorsField.createPicoDetail.status ? (
                <ErrorMessage message={errorsField.createPicoDetail.message} />
              ) : (
                ''
              )} */}
            </Grid>
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
                {approveAt && editMode && (
                  <Typography
                    sx={{
                      ...styles.header3,
                      paddingX: '4px',
                      paddingLeft: '16px',
                      borderLeft: '1px solid #ACACAC'
                    }}
                  >
                    {t('common.lastUpdateDatetime') + ' : ' + approveAt}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                sx={[buttonFilledCustom, localstyles.localButton]}
                onClick={onhandleSubmit}
              >
                {t('pick_up_order.finish')}
              </Button>
              <Button
                sx={[buttonOutlinedCustom, localstyles.localButton]}
                onClick={handleHeaderOnClick}
              >
                {t('pick_up_order.cancel')}
              </Button>
            </Grid>
          </Grid>
          <Stack mt={2} spacing={2}>
            {/* {Object.keys(formik.errors).map((fieldName) =>
              formik.touched[fieldName] && formik.errors[fieldName] ? (
                <Alert severity="error" key={fieldName}>
                  {formik.errors[fieldName]}
                </Alert>
              ) : null
            )} */}
            {errorsField.routine.status && (
              <ErrorMessage message={errorsField.routine.message} />
            )}
            {errorsField.effFrmDate.status && (
              <ErrorMessage message={errorsField.effFrmDate.message} />
            )}
            {errorsField.effToDate.status && (
              <ErrorMessage message={errorsField.effToDate.message} />
            )}
            {errorsField.logisticName.status && (
              <ErrorMessage message={errorsField.logisticName.message} />
            )}
            {errorsField.AD_HOC.status && formik.values.picoType === 'AD_HOC' && (
              <ErrorMessage message={errorsField.AD_HOC.message} />
            )}
            {errorsField.createPicoDetail.status && (
              <ErrorMessage message={errorsField.createPicoDetail.message} />
            )}
          </Stack>
          <DeleteModal
            open={openDelete}
            selectedRecycLoc={recycbleLocId}
            onClose={() => {
              setOpenDelete(false)
            }}
            onDelete={onDeleteModal}
            editMode={editMode}
          />
        </LocalizationProvider>
      </Box>
      {/* </form> */}
    </>
  )
}

let localstyles = {
  localButton: {
    width: '200px',
    fontSize: 18,
    mr: 3
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '34%',
    height: 'fit-content',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: 5
  }
}

export default PickupOrderCreateForm
