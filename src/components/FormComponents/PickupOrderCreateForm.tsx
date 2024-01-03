import {
  Alert,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  Modal,
  Stack,
  Typography
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import React, { SyntheticEvent, useEffect, useState } from 'react'
import { styles } from '../../constants/styles'
import CustomField from './CustomField'
import CustomSwitch from './CustomSwitch'
import CustomDatePicker2 from './CustomDatePicker2'
import RoutineSelect from '../SpecializeComponents/RoutineSelect'
import CustomTextField from './CustomTextField'
import CustomItemList, { il_item } from './CustomItemList'
import CreateRecycleForm from './CreateRecycleForm'
import { useContainer } from 'unstated-next'
import CheckInRequestContainer from '../../contexts/CheckInRequestContainer'
import {
  CreatePicoDetail,
  EditPo,
  PickupOrder,
  PickupOrderDetail
} from '../../interfaces/pickupOrder'
import { colPtRoutine } from '../../interfaces/common'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { useNavigate } from 'react-router-dom'
import { DataGrid, GridColDef, GridRowSpacingParams } from '@mui/x-data-grid'
import {
  ADD_CIRCLE_ICON,
  DELETE_OUTLINED_ICON,
  EDIT_OUTLINED_ICON
} from '../../themes/icons'
import theme from '../../themes/palette'
import { t, use } from 'i18next'
import { useFormik } from 'formik'
import { editPickupOrder } from '../../APICalls/Collector/pickupOrder/pickupOrder'
import { validate } from 'uuid'
import CustomAutoComplete from './CustomAutoComplete'
import CommonTypeContainer from '../../contexts/CommonTypeContainer'
import PicoRoutineSelect from '../SpecializeComponents/PicoRoutineSelect'
import PickupOrderList from '../../components/PickupOrderList'
import { amET } from '@mui/material/locale'
import i18n from '../../setups/i18n'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { format } from '../../constants/constant'
import { divIcon } from 'leaflet'

const PickupOrderCreateForm = ({
  selectedPo,
  title,
  formik,
  setState,
  state
}: {
  selectedPo?: PickupOrder
  title: string
  formik: any
  setState: (val: CreatePicoDetail[]) => void
  state: CreatePicoDetail[]
}) => {
  const { t } = useTranslation()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [editRowId, setEditRowId] = useState<number | null>(null)
  const [id, setId] = useState<number>(0)
  const [picoRefId, setPicoRefId] = useState('')
  const { logisticList, contractType, vehicleType } =
    useContainer(CommonTypeContainer)
  const navigate = useNavigate()
  const handleCloses = () => {
    setOpenModal(false)
  }

  // console.log('yo' + JSON.stringify(state))
  const createdDate = dayjs(new Date()).format(format.dateFormat1)

  const handleEditRow = (id: number) => {
    setEditRowId(id)
    setOpenModal(true)
  }
  const handleDeleteRow = (id: any) => {
    const updatedRows = state.filter((row) => row.id !== id)
    setState(updatedRows)
  }
  const handleHeaderOnClick = () => {
    console.log('Header click')
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
    const reasons: il_item[] = [
      {
        id: '1',
        name: '壞車'
      },
      {
        id: '2',
        name: '貨物過剩'
      }
    ]
    return reasons
  }

  const columns: GridColDef[] = [
    {
      field: 'pickupAt',
      headerName: t('pick_up_order.detail.shipping_time'),
      width: 150
    },
    {
      field: 'recycType',
      headerName: t('pick_up_order.detail.main_category'),
      width: 150,
      editable: true,
      valueGetter: ({ row }) => row.recycType
    },
    {
      field: 'recycSubType',
      headerName: t('pick_up_order.detail.subcategory'),
      type: 'string',
      width: 150,
      editable: true
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
      headerName: '',
      width: 100,
      renderCell: (params) => (
        <IconButton>
          <EDIT_OUTLINED_ICON onClick={() => handleEditRow(params.row.id)} />
        </IconButton>
      )
    },
    {
      field: 'delete',
      headerName: '',
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => handleDeleteRow(params.row.id)}>
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
    const pickupDetails: CreatePicoDetail = {
      id: picodetail.picoDtlId,
      picoHisId: picoRefId,
      senderId: picodetail.senderId,
      senderName: picodetail.senderName,
      senderAddr: picodetail.senderAddr,
      senderAddrGps: [11, 12],
      receiverId: picodetail.receiverId,
      receiverName: picodetail.receiverName,
      receiverAddr: picodetail.receiverAddr,
      receiverAddrGps: [11, 12],
      status: 'CREATED',
      createdBy: 'ADMIN',
      updatedBy: 'ADMIN',
      pickupAt: picodetail.pickupAt,
      recycType: picodetail.recycType,
      recycSubType: picodetail.recycSubType,
      weight: picodetail.weight
    }
    setState([...state, pickupDetails])
    setOpenPico(false)
  }

  const resetPicoId = () => {
    setOpenPico(true) 
    setPicoRefId('')
  }
  return (
    <>
      <form onSubmit={formik.handleSubmit} className="w-full">
        <Box sx={[styles.innerScreen_container, { paddingRight: 0 }]}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="zh-cn"
          >
            <Grid
              container
              direction={'column'}
              spacing={2.5}
              sx={{ ...styles.gridForm }}
            >
              <Grid item>
                <Button
                  sx={[styles.headerSection]}
                  onClick={handleHeaderOnClick}
                >
                  <ArrowBackIosIcon sx={{ fontSize: 15, marginX: 0.5 }} />
                  <Typography sx={styles.header1}>{title}</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Typography sx={styles.header2}>
                  {t('pick_up_order.shipping_info')}
                </Typography>
              </Grid>
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
              <Grid item display="flex">
                <CustomDatePicker2
                  pickupOrderForm={true}
                  setDate={(values) => {
                    formik.setFieldValue('effFrmDate', values.startDate)
                    formik.setFieldValue('effToDate', values.endDate)
                  }}
                  defaultStartDate={selectedPo?.effFrmDate}
                  defaultEndDate={selectedPo?.effToDate}
                />
              </Grid>
              {formik.values.picoType == 'ROUTINE' && (
                <CustomField
                  label={t('pick_up_order.routine.every_week')}
                  style={{ width: '100%' }}
                  mandatory
                >
                  <PicoRoutineSelect
                    setRoutine={(values) => {
                      console.log('routine' + JSON.stringify(values))
                      formik.setFieldValue('routineType', values.routineType)
                      formik.setFieldValue('routine', values.routineContent)
                    }}
                    defaultValue={{
                      routineType: selectedPo?.routineType ?? 'daily',
                      routineContent: selectedPo?.routine ?? []
                    }}
                  />
                </CustomField>
              )}

              <Grid item>
                <CustomField
                  label={t('pick_up_order.choose_logistic')}
                  mandatory
                >
                  <CustomAutoComplete
                    placeholder={t('pick_up_order.enter_company_name')}
                    option={
                      logisticList?.map((option) => option.logisticNameTchi) ??
                      []
                    }
                    sx={{ width: '400px' }}
                    onChange={(_: SyntheticEvent, newValue: string | null) =>
                      formik.setFieldValue('logisticName', newValue)
                    }
                    onInputChange={(event: any, newInputValue: string) => {
                      console.log(newInputValue) // Log the input value
                      formik.setFieldValue('logisticName', newInputValue) // Update the formik field value if needed
                    }}
                    value={formik.values.logisticName}
                    inputValue={formik.values.logisticName}
                    error={
                      formik.errors.logisticName && formik.touched.logisticName
                    }
                  />
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField
                  label={t('pick_up_order.vehicle_category')}
                  mandatory
                >
                  <CustomItemList
                    items={getvehicleType() || []}
                    singleSelect={(values) =>
                      formik.setFieldValue('vehicleTypeId', values)
                    }
                    value={formik.values.vehicleTypeId}
                    defaultSelected={selectedPo?.vehicleTypeId}
                    error={
                      formik.errors.vehicleTypeId &&
                      formik.touched.vehicleTypeId
                    }
                  />
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={t('pick_up_order.plat_number')} mandatory>
                  <CustomTextField
                    id="platNo"
                    placeholder={t('pick_up_order.enter_plat_number')}
                    onChange={formik.handleChange}
                    value={formik.values.platNo}
                    sx={{ width: '400px' }}
                    error={formik.errors.platNo && formik.touched.platNo}
                  />
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField
                  label={t('pick_up_order.contact_number')}
                  mandatory
                >
                  <CustomTextField
                    id="contactNo"
                    placeholder={t('pick_up_order.enter_contact_number')}
                    onChange={formik.handleChange}
                    value={formik.values.contactNo}
                    sx={{ width: '400px' }}
                    error={formik.errors.contactNo && formik.touched.contactNo}
                  />
                </CustomField>
              </Grid>
              {formik.values.picoType == 'ROUTINE' && (
                <Grid item>
                  <Box>
                    <CustomField
                      label={t('pick_up_order.routine.contract_number')}
                      mandatory
                    >
                      <CustomAutoComplete
                        placeholder={t('pick_up_order.routine.enter_contract')}
                        option={
                          contractType?.map((option) => option.contractNo) ?? []
                        }
                        sx={{ width: '400px' }}
                        onChange={(
                          _: SyntheticEvent,
                          newValue: string | null
                        ) => formik.setFieldValue('contractNo', newValue)}
                        value={formik.values.contractNo}
                        error={
                          formik.errors.contractNo && formik.touched.contractNo
                        }
                      />
                    </CustomField>
                  </Box>
                </Grid>
              )}
              {formik.values.picoType == 'AD_HOC' && (
                <Grid item>
                  <CustomField
                    label={t('pick_up_order.adhoc.reason_get_off')}
                    mandatory
                  >
                    <CustomItemList
                      items={getReason() || []}
                      singleSelect={(values) =>
                        formik.setFieldValue('reason', values)
                      }
                      value={formik.values.reason}
                      defaultSelected={selectedPo?.vehicleTypeId}
                      error={
                        formik.errors.reason && formik.touched.vehicleTypeId
                      }
                    />
                  </CustomField>
                </Grid>
              )}
              {formik.values.picoType === 'AD_HOC' && (
                <>
                  <Grid item>
                  <Typography sx={[styles.header3, { marginBottom: 1 }]}>
                    {t('pick_up_order.adhoc.po_number')}
                  </Typography>
                    {picoRefId !== '' ? (
                      <div className="flex items-center justify-between w-[390px]">
                        <div className="font-bold text-mini">{picoRefId}</div>
                        <div className="text-mini text-green-400 cursor-pointer" onClick={resetPicoId}>
                          {t('pick_up_order.change')}
                        </div>
                      </div>
                    ) : (
                      <div>
                       
                        <Button
                          sx={[localstyles.picoIdButton]}
                          onClick={() => setOpenPico(true)}
                        >
                          <AddCircleIcon
                            sx={{ ...styles.endAdornmentIcon, pr: 1 }}
                          />
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
                    rows={state}
                    hideFooter
                    columns={columns}
                    disableRowSelectionOnClick
                    getRowSpacing={getRowSpacing}
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
                  <Modal open={openModal} onClose={handleCloses}>
                    <CreateRecycleForm
                      data={state}
                      id={id}
                      setId={setId}
                      setState={setState}
                      onClose={handleCloses}
                      editRowId={editRowId}
                      picoHisId={picoRefId}
                    />
                  </Modal>

                  <PickupOrderList
                    drawerOpen={openPico}
                    handleDrawerClose={handleClosePicoList}
                    selectPicoDetail={selectPicoRefrence}
                  ></PickupOrderList>

                  <Button
                    variant="outlined"
                    startIcon={
                      <AddCircleIcon
                        sx={{ ...styles.endAdornmentIcon, pr: 1 }}
                      />
                    }
                    onClick={() => setOpenModal(true)}
                    sx={{
                      height: '40px',
                      width: '100%',
                      mt: '20px',
                      borderColor: theme.palette.primary.main,
                      color: 'black',
                      borderRadius: '10px'
                    }}
                  >
                    {t('pick_up_order.new')}
                  </Button>
                </CustomField>
              </Grid>
              <Grid item>
                <Typography sx={styles.header3}>
                  {t('pick_up_order.creation_time') + ' : ' + createdDate}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  sx={[styles.buttonFilledGreen, localstyles.localButton]}
                >
                  {t('pick_up_order.finish')}
                </Button>
                <Button
                  sx={[styles.buttonOutlinedGreen, localstyles.localButton]}
                  onClick={handleHeaderOnClick}
                >
                  {t('pick_up_order.cancel')}
                </Button>
              </Grid>
            </Grid>
            <Stack mt={2} spacing={2}>
              {Object.keys(formik.errors).map((fieldName) =>
                formik.touched[fieldName] && formik.errors[fieldName] ? (
                  <Alert severity="error" key={fieldName}>
                    {formik.errors[fieldName]}
                  </Alert>
                ) : null
              )}
            </Stack>
          </LocalizationProvider>
        </Box>
      </form>
    </>
  )
}

let localstyles = {
  localButton: {
    width: '200px',
    fontSize: 18,
    mr: 3
  },
  picoIdButton: {
    flexDirection: 'column',
    borderRadius: '8px',
    width: '400px',
    padding: '32px',
    border: 1,
    borderColor: '#79ca25',
    backgroundColor: 'white',
    color: 'black',
    fontWeight: 'bold',
    '&.MuiButton-root:hover': {
      bgcolor: '#F4F4F4'
    }
  }
}

export default PickupOrderCreateForm
