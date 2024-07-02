import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { styles } from '../../constants/styles'
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import { DELETE_OUTLINED_ICON } from '../../themes/icons'
import CustomField from './CustomField'
import StatusCard from '../StatusCard'
import PickupOrderCard from '../PickupOrderCard'

import {
  PickupOrder,
  PickupOrderDetail,
  Row
} from '../../interfaces/pickupOrder'
import { useNavigate } from 'react-router-dom'
import {
  editPickupOrderDetailStatus,
  editPickupOrderStatus,
  getPicoById
} from '../../APICalls/Collector/pickupOrder/pickupOrder'
import { useTranslation } from 'react-i18next'
import { displayCreatedDate } from '../../utils/utils'
import CustomButton from './CustomButton'
import { Languages, localStorgeKeyName } from '../../constants/constant'

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../contexts/CommonTypeContainer'
import { getVehicleDetail } from '../../APICalls/ASTD/recycling'
import i18n from '../../setups/i18n'
import { weekDs } from '../SpecializeComponents/RoutineSelect/predefinedOption'
import NotifContainer from '../../contexts/NotifContainer'

dayjs.extend(utc)
dayjs.extend(timezone)

const PickupOrderForm = ({
  onClose,
  selectedRow,
  pickupOrder,
  initPickupOrderRequest
}: // navigateToJobOrder
{
  onClose?: () => void
  selectedRow?: PickupOrder | null | undefined
  pickupOrder?: PickupOrder[] | null
  initPickupOrderRequest: () => void
  // navigateToJobOrder: () => void;
}) => {
  const { t } = useTranslation()
  const role = localStorage.getItem(localStorgeKeyName.role)
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId)
  const {dateFormat} = useContainer(CommonTypeContainer)
  const [vehicleType, setVehicleType] = useState<string>('');
  const { marginTop } = useContainer(NotifContainer);

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // If the overlay is clicked (not its children), close the modal
      onClose && onClose()
    }
  }
  const navigate = useNavigate()

  const handleRowClick = async (po: PickupOrder) => {
    const routeName = role
    const result = await getPicoById(selectedPickupOrder ? selectedPickupOrder.picoId : '')
    if (result) {
      navigate(`/${routeName}/editPickupOrder`, { state: result.data })
    }
  }

  // const { pickupOrder, initPickupOrderRequest } = useContainer(
  //   CheckInRequestContainer
  // )
  const [selectedPickupOrder, setSelectedPickupOrder] = useState<PickupOrder>()
  //console.log(selectedPickupOrder)
  const [pickupOrderDetail, setPickUpOrderDetail] =
    useState<PickupOrderDetail[]>()
  const [pickupOrderData, setPickupOrderData] = useState<PickupOrder>()

  useEffect(() => {
    if (selectedRow) {
      // refresh the data first
      initGetPickUpOrderData(selectedRow.picoId)
    }
  }, [selectedRow])

  const initGetPickUpOrderData = async (picoId: string) => {
    const result = await getPicoById(picoId.toString())
    if (result) {
      setSelectedPickupOrder(result.data)
      setPickUpOrderDetail(result.data.pickupOrderDetail)
    }
  }

  const onDeleteClick = async () => {
    if (selectedPickupOrder) {
      const updatePoStatus = {
        status: 'CLOSED',
        reason: selectedPickupOrder.reason,
        updatedBy: selectedPickupOrder.updatedBy
      }
      const updatePoDtlStatus = {
        status: 'CLOSED',
        updatedBy: selectedPickupOrder.updatedBy
      }
      try {
        const result = await editPickupOrderStatus(
          selectedPickupOrder.picoId,
          updatePoStatus
        )
        if (result) {
          const detailUpdatePromises =
            selectedPickupOrder.pickupOrderDetail.map((detail) =>
              editPickupOrderDetailStatus(
                detail.picoDtlId.toString(),
                updatePoDtlStatus
              )
            )
          await Promise.all(detailUpdatePromises)
          await initPickupOrderRequest()
        }
        onClose && onClose()
        navigate('/collector/PickupOrder')
      } catch (error) {
        //console.error('Error updating field:', error)
      }
    } else {
      alert('No selected pickup order')
    }
  }

  const initVehicleDetail = async () => {
    try {
      if(selectedPickupOrder?.vehicleTypeId){
        const vehicle = await getVehicleDetail(selectedPickupOrder.vehicleTypeId);
        if(vehicle){
          let vehicleLang:string = '';
          if(i18n.language === Languages.ENUS){
            vehicleLang = vehicle?.data?.vehicleTypeNameEng
          } else if(i18n.language === Languages.ZHCH){
            vehicleLang = vehicle?.data?.vehicleTypeNameSchi
          } else {
            vehicleLang = vehicle?.data?.vehicleTypeNameTchi
          }
          setVehicleType(vehicleLang)
        }
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    initVehicleDetail()
  }, [selectedPickupOrder?.vehicleTypeId])
 
  const getDeliveryDate = (deliveryDate:string[]) => {
    const weeks = ['mon', 'tue', 'wed', 'thur', 'fri', 'sat', 'sun'];
    let delivery = deliveryDate.map(item => item.trim());
    let isWeek = false;

    for(let deliv of delivery){
      if(weeks.includes(deliv)){
        isWeek = true
      }
    }

    if(isWeek){
      delivery = delivery.map(item => {
        const days = weekDs.find(day => day.id === item);
        if(days) {
          if(i18n.language === Languages.ENUS){
            return days.engName
          } else if(i18n.language === Languages.ZHCH){
            return days.schiName
          } else {
            return days.tchiName
          }
        } else {
          return ''
        }
      })
    }
    return delivery.join(',')
  }
  
  return (
    <>
      <Box sx={{...localstyles.modal, marginTop}} onClick={handleOverlayClick}>
        <Box sx={localstyles.container}>
          <Box sx={{ display: 'flex', flex: '1', p: 4, alignItems: 'center' }}>
            <Box>
              <Typography sx={styles.header4}>
                {t('pick_up_order.item.detail')}
              </Typography>
              <Typography sx={styles.header3}>
                {selectedPickupOrder?.picoId}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexShrink: 0, ml: '20px' }}>
              <StatusCard status={selectedPickupOrder?.status} />
            </Box>
            <Box sx={{ marginLeft: 'auto' }}>
              {role === 'logistic' &&
              selectedRow &&
              ['STARTED', 'OUTSTANDING'].includes(selectedRow.status) ? (
                <CustomButton
                  text={t('pick_up_order.table.create_job_order')}
                  onClick={() => {
                    // navigateToJobOrder()
                  }}
                ></CustomButton>
              ) : role === 'logistic' &&
                selectedRow &&
                selectedRow.status === 'CREATED' &&
                selectedRow?.tenantId === tenantId ? (
                <CustomButton
                  text={t('pick_up_order.item.edit')}
                  onClick={() => {
                    selectedPickupOrder && handleRowClick(selectedPickupOrder)
                  }}
                ></CustomButton>
              ) : role !== 'logistic' ? (
                <>
                  <CustomButton
                    text={t('pick_up_order.item.edit')}
                    style={{ marginRight: '12px' }}
                    onClick={() => {
                      selectedPickupOrder && handleRowClick(selectedPickupOrder)
                    }}
                  ></CustomButton>
                  <CustomButton
                    text={t('pick_up_order.item.delete')}
                    outlined
                    onClick={onDeleteClick}
                  ></CustomButton>
                </>
              ) : null}
              <IconButton sx={{ ml: '20px' }} onClick={onClose}>
                <KeyboardTabIcon sx={{ fontSize: '30px' }} />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <Stack spacing={2} sx={localstyles.content}>
            <Box>
              <Typography sx={localstyles.typo_header}>
                {t('pick_up_order.item.shipping_info')}
              </Typography>
            </Box>

            <CustomField label={t('pick_up_order.item.date_time')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPickupOrder?.createdAt
                  ? dayjs.utc(selectedPickupOrder?.createdAt).tz('Asia/Hong_Kong').format(`${dateFormat} HH:mm`)
                  : ''}
              </Typography>
            </CustomField>

            <CustomField label={t('pick_up_order.item.transport_category')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPickupOrder?.picoType === 'AD_HOC'
                  ? t('pick_up_order.card_detail.one-transport')
                  : selectedPickupOrder?.picoType === 'ROUTINE'
                  ? t('pick_up_order.card_detail.regular_shipping')
                  : undefined}
              </Typography>
            </CustomField>

            <CustomField label={t('pick_up_order.item.shipping_validity')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {dayjs.utc(selectedPickupOrder?.effFrmDate).tz('Asia/Hong_Kong').format(`${dateFormat}`)} To{' '} {dayjs.utc(selectedPickupOrder?.effToDate).tz('Asia/Hong_Kong').format(`${dateFormat}`)}
              </Typography>
            </CustomField>
            <CustomField label={t('pick_up_order.item.recycling_week')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {/* {selectedPickupOrder?.routine
                  .map((routineItem) => routineItem)
                  .join(' ')} */}
                  { selectedPickupOrder?.routine 
                    && getDeliveryDate(selectedPickupOrder.routine)
                  }
              </Typography>
            </CustomField>

            <CustomField label={t('pick_up_order.item.vehicle_category')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {/* {selectedPickupOrder?.vehicleTypeId === '1'
                  ? t('pick_up_order.card_detail.van')
                  : selectedPickupOrder?.vehicleTypeId === '2'
                  ? t('pick_up_order.card_detail.large_truck')
                  : ''} */}
                  {vehicleType}
              </Typography>
            </CustomField>
            <CustomField label={t('pick_up_order.item.plat_number')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPickupOrder?.platNo}
              </Typography>
            </CustomField>
            <CustomField label={t('pick_up_order.item.contact_number')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPickupOrder?.contactNo}
              </Typography>
            </CustomField>

            <CustomField label={t('pick_up_order.item.logistic_company')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedRow?.logisticName}
              </Typography>
            </CustomField>

            <CustomField label={t('pick_up_order.item.exp_opration')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPickupOrder?.normalFlg ? t('yes') : t('no')}
              </Typography>
            </CustomField>

            <Typography sx={localstyles.typo_header}>
              {t('pick_up_order.item.rec_loc_info')}
            </Typography>

            <PickupOrderCard pickupOrderDetail={selectedRow?.pickupOrderDetail ?? []} />
          </Stack>
        </Box>
      </Box>
    </>
  )
}

let localstyles = {
  modal: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    justifyContent: 'flex-end'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '40%',
    bgcolor: 'white',
    overflowY: 'scroll'
  },

  button: {
    borderColor: 'lightgreen',
    color: 'green',
    width: '100px',
    height: '35px',
    p: 1,
    borderRadius: '18px',
    mr: '10px'
  },
  // header: {
  //   display: "flex",
  //   flex: 1,
  //   p: 4,
  //   alignItems:'center'

  //
  content: {
    flex: 9,
    p: 4
  },
  typo_header: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#717171',
    letterSpacing: '1px',
    mt: '10px'
  },
  typo_fieldTitle: {
    fontSize: '13px',
    color: '#ACACAC',
    letterSpacing: '1px'
  },
  typo_fieldContent: {
    fontSize: '15px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    marginTop: '2px'
  }
}

export default PickupOrderForm
