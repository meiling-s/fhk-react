import { Box, Button, Typography, Grid, Modal } from '@mui/material'
import { useEffect, useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { styles } from '../../constants/styles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CardTravelIcon from '@mui/icons-material/CardTravel'
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined'
import { useTranslation } from 'react-i18next'
import AssignDriverForm from '../../components/FormComponents/AssignDriverForm'
import {
  OrderJobHeader,
  AssignJobDriver,
  DriverList,
  VehicleList
} from '../../interfaces/pickupOrder'
import axiosInstance from '../../constants/axiosInstance'
import { GET_PICK_UP_ORDER_BY_ID } from '../../constants/requests'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { format } from '../../constants/constant'
import { rejectAssginDriver, assignDriver } from '../../APICalls/jobOrder'
import { ToastContainer, toast } from 'react-toastify'
import { EDIT_OUTLINED_ICON, DELETE_OUTLINED_ICON } from '../../themes/icons'
import { returnApiToken } from '../../utils/utils'
import { getAllVehiclesLogistic, getDriver } from '../../APICalls/jobOrder'

const JobOrder = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [orderDetail, setOrderDetail] = useState<OrderJobHeader>({
    picoId: '',
    receiverName: '',
    setupDate: '',
    effFrmDate: '',
    effToDate: ''
  })
  const [pickupOrderDetail, setPickupOrderDetail] = useState<AssignJobDriver[]>(
    []
  )
  const [id, setId] = useState<number>(0)
  const { picoId } = useParams()
  const params = new URLSearchParams(window.location.search)
  const [isEdit, setIsEdit] = useState(false)
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(false)
  const { t } = useTranslation()
  const { loginId } = returnApiToken()
  const [driverList, setDriverList] = useState<DriverList[]>([])
  const [vehicleList, setVehicleList] = useState<VehicleList[]>([])

  const handleCloses = () => {
    setId(0)
    setOpenModal(false)
    setIsActive(false)
  }

  const initListDriver = async () => {
    const result = await getDriver(0, 10, 'string')
    if (result) {
      const data = result?.data?.content
      const mappingDriver: DriverList[] = []
      data.forEach((item: any) => {
        mappingDriver.push({
          driverId: item.driverId,
          driverNameEng: item.driverNameEng,
          driverNameSchi: item.driverNameSchi,
          driverNameTchi: item.driverNameTchi
        })
      })
      setDriverList(mappingDriver)
    }
  }

  const initListVehicle = async () => {
    const result = await getAllVehiclesLogistic(0, 1000)
    if (result) {
      const data = result?.data?.content
      const mappingVehicle: VehicleList[] = []
      data.forEach((item: any) => {
        mappingVehicle.push({
          vehicleId: item.vehicleId,
          plateNo: item.plateNo
        })
      })
      setVehicleList(mappingVehicle)
    }
  }

  useEffect(() => {
    initListDriver()
    initListVehicle()
  }, [])

  const getPicoById = async (picoId: string) => {
    try {
      const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_PICK_UP_ORDER_BY_ID(picoId)
      })

      const details = response.data.pickupOrderDetail.map((item: any) => {
        return {
          joId: item?.joId ?? 0,
          picoId: response?.data?.picoId,
          picoDtlId: item?.picoDtlId ?? 0,
          plateNo: item?.plateNo ?? '',
          senderId: item?.senderId ?? '',
          senderName: item?.senderName ?? '',
          senderAddr: item?.senderAddr ?? '',
          senderAddrGps: item?.senderAddrGps ?? [],
          receiverId: item?.receiverId ?? '',
          receiverName: item?.receiverName ?? '',
          receiverAddr: item?.receiverAddr ?? '',
          receiverAddrGps: item?.receiverAddrGps ?? [],
          recycType: item?.recycType ?? '',
          recycSubType: item?.recycSubType ?? '',
          weight: item?.weight ?? 0,
          vehicleId: item?.vehicleId ?? 0,
          driverId: item?.driverId ?? '',
          contractNo: response?.data?.contractNo ?? '',
          pickupAt: item?.pickupAt ?? '',
          createdBy: loginId ?? '',
          updatedBy: loginId ?? '',
          status: item?.driverId ? 'assigned' : ''
        }
      })

      setPickupOrderDetail(details)

      setOrderDetail((prev) => {
        return {
          ...prev,
          picoId: response?.data?.picoId,
          receiverName: response?.data?.logisticName,
          effFrmDate: response?.data?.effFrmDate,
          effToDate: response?.data?.effToDate,
          setupDate: dayjs(response?.data?.createdAt).format('YYYY/MM/DD hh:mm')
        }
      })
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    if (picoId) getPicoById(picoId)
  }, [picoId])

  const onHandleAssign = (index: number) => {
    setOpenModal(true)
    setId(index)
    setIsActive(true)
  }

  const onHandleEdit = (index: number) => {
    setOpenModal(true)
    setId(index)
    setIsEdit(true)
    setIsActive(true)
  }

  const handleDelete = (index: number) => {
    const ids = pickupOrderDetail.map((item, indexItem) => {
      if (indexItem === index) {
        let status = ''
        if (item.status === 'assigned') {
          status = 'REJECTED'
        }
        return {
          ...item,
          vehicleId: 0,
          driverId: '',
          plateNo: '',
          status: status
        }
      } else {
        return item
      }
    })

    setPickupOrderDetail(ids)
  }

  const onHandleSubmitOrder = async () => {
    if (params?.get('isEdit') === 'false') {
      for (let order of pickupOrderDetail) {
        const response = await assignDriver(order)
        if (response?.status === 201) {
          onSubmitData('success', `${t('jobOrder.success_assign')} ${order.picoDtlId}`)
          setTimeout(() => {
            onHandleCancel()
          }, 1000)
        } else {
          onSubmitData('error', `${t('failed_assign.success_assign')} ${order.picoDtlId}`)
        }
      }
    } else {
      for (let order of pickupOrderDetail) {
        const response = await rejectAssginDriver(order, order.joId)
        if (response?.status === 201) {
          onSubmitData('success', `${t('jobOrder.success_assign')} ${order.picoDtlId}`)
          setTimeout(() => {
            onHandleCancel()
          }, 1000)
        } else {
          onSubmitData('error', `${t('failed_assign.success_assign')} ${order.picoDtlId}`)
        }
      }
    }
    // for(let order of pickupOrderDetail){
    //    if(order?.status === 'REJECTED'){
    //     const response = await rejectAssginDriver({status: 'REJECTED', reason: [], updatedBy: order.createdBy}, order.picoDtlId);
    //    } else {
    //     const response  =  await assignDriver(order);
    //     if(response?.status === 201){
    //         onSubmitData('success', `Success Assign Job Order ${order.picoDtlId}`)
    //         setTimeout(() => {
    //             onHandleCancel()
    //         }, 1000);
    //     } else {
    //         onSubmitData('error', `Failed Assign Job Order ${order.picoDtlId}`)
    //     }
    //    }

    // }
  }

  const onHandleCancel = () => {
    navigate('/logistic/pickupOrder')
  }

  const showErrorToast = (msg: string) => {
    toast.error(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    })
  }

  const showSuccessToast = (msg: string) => {
    toast.info(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    })
  }

  const onSubmitData = (type: string, msg: string) => {
    if (type == 'success') {
      showSuccessToast(msg)
    } else {
      showErrorToast(msg)
    }
  }

  return (
    <Box sx={[styles.innerScreen_container, { paddingRight: 0 }]}>
      <ToastContainer></ToastContainer>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
        <Grid
          container
          direction={'column'}
          spacing={2}
          sx={{ ...styles.gridForm }}
        >
          <Grid item>
            <Typography
              fontSize={22}
              color="black"
              style={{ fontWeight: '700' }}
            >
              {t('jobOrder.create_work_waybill')}
            </Typography>
          </Grid>

          <Grid item>
            <Typography
              fontSize={16}
              color="black"
              style={{ fontWeight: '700' }}
            >
              {t('jobOrder.shipping_information')}
            </Typography>
          </Grid>

          <Grid item>
            <Typography
              sx={{ fontSize: '13px', fontWeight: '400', color: 'ACACAC' }}
            >
              {t('jobOrder.corresponding_waybill')}
            </Typography>

            <Typography
              sx={{ fontSize: '16px', fontWeight: '700', color: 'black' }}
            >
              {orderDetail.picoId}
            </Typography>
          </Grid>

          <Grid
            display={'flex'}
            style={{ marginTop: '15px', marginLeft: '15px', fontSize: '16px' }}
            direction={'row'}
          >
            <div className="flex flex-col gap-y-1 w-[240px]">
              <Typography
                sx={{
                  fontSize: '13px',
                  lineHeight: '20px',
                  color: '#ACACAC',
                  fontWeight: '400'
                }}
              >
                {t('jobOrder.shipping_validity_date_from')}
              </Typography>
              <DatePicker
                value={dayjs(orderDetail.effFrmDate)}
                sx={localstyles.datePicker}
                format={format.dateFormat2}
                disabled
              />
            </div>
            <div className="flex flex-col ml-2 gap-y-1 w-[240px]">
              <Typography
                sx={{
                  fontSize: '13px',
                  lineHeight: '20px',
                  color: '#ACACAC',
                  fontWeight: '400'
                }}
              >
                {t('jobOrder.shipping_validity_date_to')}
              </Typography>
              <DatePicker
                value={dayjs(orderDetail.effToDate)}
                sx={localstyles.datePicker}
                format={format.dateFormat2}
                disabled
              />
            </div>
          </Grid>

          <Grid item>
            <Typography
              sx={{ fontSize: '13px', fontWeight: '400', color: 'ACACAC' }}
            >
              {t('jobOrder.shipping_company_name')}
            </Typography>

            <Typography
              sx={{ fontSize: '16px', fontWeight: '700', color: 'black' }}
            >
              {orderDetail.receiverName}
            </Typography>
          </Grid>

          <div className="flex flex-col gap-y-3 ml-4 mt-2">
            <p className="font-semibold text-[#717171]">
              {' '}
              {t('jobOrder.recycling_location_information')}
            </p>
            {pickupOrderDetail.map((item: AssignJobDriver, index) => {
              return (
                <div
                  className={`flex flex-col rounded-sm px-[15px] py-[18px] w-[450px] ${
                    isActive && index === id ? 'bg-[#F4FBF6]' : ' bg-white'
                  }`}
                >
                  <div className="flex justify-start flex-col">
                    <label className="font-bold text-[#717171]">
                      {' '}
                      {t('jobOrder.main_category')}
                    </label>
                    <p className="font-semibold text-black">{item.recycType}</p>
                  </div>
                  <div className="flex justify-start flex-col">
                    <label className="font-bold text-[#717171]">
                      {' '}
                      {t('jobOrder.subcategory')}
                    </label>
                    <p className="font-semibold text-black">
                      {item.recycSubType}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center flex-1 gap-x-1">
                      <AccessTimeIcon />
                      <label className="font-bold text-[#717171]">
                        {' '}
                        {t('jobOrder.estimated_shipping_time')}
                      </label>
                    </div>
                    <p className="flex-1 font-semibold text-[#535353]">
                      {item.pickupAt}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center flex-1 gap-x-1">
                      <MonitorWeightOutlinedIcon />
                      <label className="font-bold text-[#717171]">
                        {' '}
                        {t('jobOrder.weight')}
                      </label>
                    </div>
                    <p className="flex-1 font-semibold text-[#535353]">
                      ${item.weight}kg
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex flex-1  items-center gap-x-1">
                      <CardTravelIcon />
                      <label className="font-bold text-[#717171]">
                        {' '}
                        {t('jobOrder.shipping_and_receiving_companies')}
                      </label>
                    </div>
                    <div className="flex flex-1 items-center gap-x-1">
                      <p className="font-semibold text-[#535353]">
                        {item.receiverName}
                      </p>
                      <ArrowForwardIcon fontSize="small" />
                      <p className="font-semibold text-[#535353]">
                        {item.senderName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex flex-1  items-center gap-x-1">
                      <PlaceOutlinedIcon />
                      <label className="font-bold text-[#717171]">
                        {' '}
                        {t('jobOrder.delivery_and_arrival_locations')}
                      </label>
                    </div>
                    <div className="flex flex-1 items-center gap-x-1">
                      <p className="font-semibold text-[#535353]">
                        {item.receiverAddr}
                      </p>
                      <ArrowForwardIcon fontSize="small" />
                      <p className="font-semibold text-[#535353]">
                        {item.senderAddr}
                      </p>
                    </div>
                  </div>

                  {!item.driverId && !item.plateNo ? (
                    <div
                      className={`flex flex-col items-center justify-center h-[113px] rounded-md w-full border border-solid ${
                        isActive && index == id
                          ? 'bg-white'
                          : 'border-[#8AF3A3]'
                      }`}
                    >
                      <AddCircleIcon
                        fontSize="large"
                        className="text-[#7CE495] hover:cursor-pointer"
                        onClick={() => onHandleAssign(index)}
                      />
                      <label htmlFor="" className="font-semibold">
                        {t('jobOrder.assign_driver')}
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2  border border-solid border-[#8AF3A3] rounded-md">
                      <div className="flex items-center justify-center gap-x-2">
                        <div className="flex items-center justify-center border border-[#7CE495] rounded-2xl h-[25px] w-[25px] p-1 bg-[#7CE495]">
                          <label className="text-white font-bold">DR</label>
                        </div>
                        <div className="flex flex-col">
                          <label className="label-0 text-[#535353] text-[15px]">
                            {item.driverId}
                          </label>
                          <label className="label-0 text-[#535353] text-[15px]">
                            {item.plateNo}
                          </label>
                        </div>
                      </div>
                      <div className="flex  gap-x-1">
                        <EDIT_OUTLINED_ICON
                          fontSize="small"
                          className="hover:cursor-pointer text-grey-light"
                          onClick={() => onHandleEdit(index)}
                        />
                        <DELETE_OUTLINED_ICON
                          fontSize="small"
                          className="hover:cursor-pointer text-grey-light"
                          onClick={() => handleDelete(index)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <Grid item>
            <Typography sx={{ fontSize: '12px', color: '#ACACAC' }}>
              {t('jobOrder.setup_time')} : {orderDetail.setupDate}
            </Typography>
          </Grid>

          <Grid item>
            <Button
              type="submit"
              sx={[styles.buttonFilledGreen, localstyles.localButton]}
              onClick={onHandleSubmitOrder}
            >
              {t('jobOrder.finish')}
            </Button>
            <Button
              sx={[styles.buttonOutlinedGreen, localstyles.localButton]}
              onClick={onHandleCancel}
            >
              {t('jobOrder.cancel')}
            </Button>
          </Grid>
        </Grid>

        <Modal open={openModal} onClose={handleCloses}>
          <AssignDriverForm
            onClose={handleCloses}
            editRowId={id}
            pickupOrderDetail={pickupOrderDetail}
            setPickupOrderDetail={setPickupOrderDetail}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            driverList={driverList}
            vehicleList={vehicleList}
            // onSubmitData={onSubmitData}
          />
        </Modal>
      </LocalizationProvider>
    </Box>
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
  },
  typo_fieldContent: {
    fontSize: '16PX',
    letterSpacing: '2px',
    color: 'black',
    weight: 700
  },
  datePicker: {
    ...styles.textField,
    maxWidth: '280px',
    '& .MuiIconButton-edgeEnd': {
      color: '#79CA25'
    }
  }
}

export default JobOrder
