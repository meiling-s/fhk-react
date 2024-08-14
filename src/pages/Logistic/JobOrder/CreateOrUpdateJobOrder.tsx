import { Box, Button, Typography, Grid, Modal } from '@mui/material'
import { useEffect, useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { styles } from '../../../constants/styles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CardTravelIcon from '@mui/icons-material/CardTravel'
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined'
import { useTranslation } from 'react-i18next'
import AssignDriverForm from '../../../components/FormComponents/AssignDriverForm'
import {
  OrderJobHeader,
  AssignJobDriver,
  DriverList,
  VehicleList
} from '../../../interfaces/pickupOrder'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { Languages, STATUS_CODE, format } from '../../../constants/constant'
import { rejectAssginDriver, assignDriver, getVehiclePlateList, getVehicleDriverList } from '../../../APICalls/jobOrder'
import { ToastContainer, toast } from 'react-toastify'
import { EDIT_OUTLINED_ICON, DELETE_OUTLINED_ICON } from '../../../themes/icons'
import {
  extractError,
  formatWeight,
  returnApiToken
} from '../../../utils/utils'
import { getPicoById } from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import { mappingRecyName } from '../../../utils/utils'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

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
  const { t, i18n } = useTranslation()
  const { loginId } = returnApiToken()
  const { recycType, decimalVal, dateFormat, companies } =
    useContainer(CommonTypeContainer)
  const [driverList, setDriverList] = useState<DriverList[]>([])
  const [vehicleList, setVehicleList] = useState<VehicleList[]>([])

  const handleCloses = () => {
    setId(0)
    setOpenModal(false)
    setIsActive(false)
  }

  const initListDriver = async () => {
    try {
      const result = await getVehicleDriverList()
      if (result) {
        const data = result?.data
        setDriverList(data)
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const initListVehicle = async () => {
    try {
      const result = await getVehiclePlateList()
      if (result) {
        const data = result?.data
        setVehicleList(data)
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  useEffect(() => {
    initListDriver()
    initListVehicle()
  }, [])

  const getLogisticName = (logisticId: number) => {
    try {
      if (logisticId) {
        // const tenant =  getTenantById(logisticId);
        const tenant = companies.find((item) => item.id == logisticId)

        let logisticName: string = ''
        if (tenant) {
          if (i18n.language === Languages.ENUS)
            logisticName = tenant.nameEng ?? ''
          if (i18n.language === Languages.ZHCH)
            logisticName = tenant.nameSchi ?? ''
          if (i18n.language === Languages.ZHHK)
            logisticName = tenant.nameTchi ?? ''
        }
        return logisticName
      }
    } catch (error) {
      return null
    }
  }

  // useEffect(() => {
  //   if(picoId) getDetailPico(picoId)
  // },[i18n.language])

  function sortByPickupAt(arr: any[]) {
    return arr.sort((a, b) => {
      const dateA = parseDateOrTime(a.pickupAt);
      const dateB = parseDateOrTime(b.pickupAt);
      return dateA.getTime() - dateB.getTime();
    });
  }
  
  function parseDateOrTime(pickupAt: string): Date {
    if (pickupAt.includes('T')) {
      return new Date(pickupAt);
    }
    
    const now = new Date();
    const [hours, minutes, seconds] = pickupAt.split(':').map(Number);
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
  }
  

  const getDetailPico = async (picoId: string) => {
    try {
      const response = await getPicoById(picoId)
      if (response) {
        const logistic = getLogisticName(response?.data?.logisticId)
        if (logistic) {
          response.data.logisticName = logistic
        }
        const details: any[] = []
        const sortedPickupOrderDetails = sortByPickupAt(response.data.pickupOrderDetail);

        for (let item of sortedPickupOrderDetails) {
          const date = dayjs(item.pickupAt).tz('Asia/Hong_Kong');
          const formattedPickUpAt = date.format('DD/MM/YYYY HH:mm');
          const receiverName = getLogisticName(item?.receiverId);
          const senderName = getLogisticName(item?.senderId);
        
          if (receiverName) item.receiverName = receiverName;
          if (senderName) item.senderName = senderName;
        
          details.push({
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
            weight: formatWeight(item?.weight, decimalVal) ?? 0,
            vehicleId: item?.vehicleId ?? 0,
            driverId: item?.driverId ?? '',
            contractNo: response?.data?.contractNo ?? '',
            pickupAt: item.pickupAt ?? '',
            createdBy: loginId ?? '',
            updatedBy: loginId ?? '',
            status: item?.driverId ? 'assigned' : '',
          });
        }

        // const details = response?.data.pickupOrderDetail.map(async (item: any) => {
        //   const currentDate = dayjs().format('YYYY-MM-DD');
        //   const fullDateTime = `${currentDate}T${item?.pickupAt}.000Z`;
        //   const date = dayjs.utc(fullDateTime).tz('Asia/Hong_Kong');
        //   const formattedPickUpAt = date.format('DD/MM/YYYY HH:mm');

        //   // const receiverName = await getLogisticName(item?.receiverId);
        //   // const senderName = await getLogisticName(item?.senderId);
        //   // console.log('receiverAddr', item.receiverId, item.senderId, receiverName, senderName)
        //   // if(receiverName)item.receiverName = receiverName;
        //   // if(senderName) item.senderName = senderName;
        //   return {
        //     joId: item?.joId ?? 0,
        //     picoId: response?.data?.picoId,
        //     picoDtlId: item?.picoDtlId ?? 0,
        //     plateNo: item?.plateNo ?? '',
        //     senderId: item?.senderId ?? '',
        //     senderName: item?.senderName ?? '',
        //     senderAddr: item?.senderAddr ?? '',
        //     senderAddrGps: item?.senderAddrGps ?? [],
        //     receiverId: item?.receiverId ?? '',
        //     receiverName: item?.receiverName ?? '',
        //     receiverAddr: item?.receiverAddr ?? '',
        //     receiverAddrGps: item?.receiverAddrGps ?? [],
        //     recycType: item?.recycType ?? '',
        //     recycSubType: item?.recycSubType ?? '',
        //     weight: formatWeight(item?.weight, decimalVal) ?? 0,
        //     vehicleId: item?.vehicleId ?? 0,
        //     driverId: item?.driverId ?? '',
        //     contractNo: response?.data?.contractNo ?? '',
        //     pickupAt: item.pickupAt ?? '',
        //     createdBy: loginId ?? '',
        //     updatedBy: loginId ?? '',
        //     status: item?.driverId ? 'assigned' : ''
        //   }
        // })

        setPickupOrderDetail(details)

        setOrderDetail((prev) => {
          return {
            ...prev,
            picoId: response?.data?.picoId,
            receiverName: response?.data?.logisticName,
            effFrmDate: response?.data?.effFrmDate,
            effToDate: response?.data?.effToDate,
            // setupDate: dayjs(response?.data?.createdAt).format(
            //   'YYYY/MM/DD hh:mm'
            // )
            setupDate: dayjs
              .utc(response?.data?.createdAt)
              .tz('Asia/Hong_Kong')
              .format(`${dateFormat} HH:mm`)
          }
        })
      }
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    if (picoId) getDetailPico(picoId)
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
          status: status,
          pickupAt: dayjs(new Date()).format(`HH:mm:ss`).toString()
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
        const date = new Date(order.pickupAt)
        await date.setHours(date.getHours() + 8)
        order.pickupAt = date.toISOString()
        const response = await assignDriver(order)
        if (response?.status === 201) {
          onSubmitData(
            'success',
            `${t('jobOrder.success_assign')} ${orderDetail.picoId}`
          )
          setTimeout(() => {
            onHandleCancel()
          }, 1000)
        } else {
          onSubmitData(
            'error',
            `${t('jobOrder.failed_assign')} ${order.picoDtlId}`
          )
        }
      }
    } else {
      for (let order of pickupOrderDetail) {
        const response = await rejectAssginDriver(order, order.joId)
        if (response?.status === 201) {
          onSubmitData(
            'success',
            `你已核準[${order.driverId}] 拒絕工作運單 [${order.joId}]，請指派另一位司機`
          )
          setTimeout(() => {
            onHandleCancel()
          }, 1000)
        } else {
          onSubmitData(
            'error',
            `${t('jobOrder.failed_assign')} ${order.picoDtlId}`
          )
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

  const getRecyName = (recycTypeId: string, recycSubTypeId: string) => {
    if (recycType) {
      return mappingRecyName(recycTypeId, recycSubTypeId, recycType)
    }
  }

  useEffect(() => {
    console.log(pickupOrderDetail, 'a')
  }, [pickupOrderDetail])
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
            {sortByPickupAt(pickupOrderDetail).map((item: AssignJobDriver, index) => {
              const driver = driverList.find(
                (value) => value.driverId === item.driverId
              )
              const driverName =
                i18n.language === 'enus'
                  ? driver?.driverNameEng
                  : i18n.language === 'zhch'
                  ? driver?.driverNameSchi
                  : driver?.driverNameTchi
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
                    <p className="font-semibold text-black">
                      {getRecyName(item.recycType, item.recycSubType)?.name}
                    </p>
                  </div>
                  <div className="flex justify-start flex-col">
                    <label className="font-bold text-[#717171]">
                      {' '}
                      {t('jobOrder.subcategory')}
                    </label>
                    <p className="font-semibold text-black">
                      {getRecyName(item.recycType, item.recycSubType)?.subName}
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
                      {item.driverId == ''
                        ? dayjs(new Date()).format(
                            `${dateFormat} ${item.pickupAt}`
                          )
                        : dayjs(item.pickupAt).format(`${dateFormat} HH:mm`)}
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
                      {item.weight}kg
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
                        {item.senderName}
                      </p>
                      <ArrowForwardIcon fontSize="small" />
                      <p className="font-semibold text-[#535353]">
                        {item.receiverName}
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
                        {item.senderAddr}
                      </p>
                      <ArrowForwardIcon fontSize="small" />
                      <p className="font-semibold text-[#535353]">
                        {item.receiverAddr}
                      </p>
                    </div>
                  </div>

                  {!item.driverId && !item.plateNo ? (
                    <div
                      className={`flex flex-col items-center justify-center h-[113px] rounded-md w-full border border-solid hover:cursor-pointer ${
                        isActive && index == id
                          ? 'bg-white'
                          : 'border-[#8AF3A3]'
                      }`}
                      onClick={() => onHandleAssign(index)}
                    >
                      <AddCircleIcon
                        fontSize="large"
                        className="text-[#7CE495]"
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
                            {driverName}
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
