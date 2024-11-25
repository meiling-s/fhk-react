import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Modal,
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
import {
  displayCreatedDate,
  extractError,
  getPrimaryColor,
  showErrorToast
} from '../../utils/utils'
import CustomButton from './CustomButton'
import {
  Languages,
  STATUS_CODE,
  localStorgeKeyName
} from '../../constants/constant'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../contexts/CommonTypeContainer'
import { getVehicleDetail } from '../../APICalls/ASTD/recycling'
import { weekDs } from '../SpecializeComponents/RoutineSelect/predefinedOption'
import NotifContainer from '../../contexts/NotifContainer'
import RightOverlayForm from '../RightOverlayFormPickupOrder'

dayjs.extend(utc)
dayjs.extend(timezone)

type DeleteModalProps = {
  open: boolean
  id?: string | null
  onClose: () => void
  onDelete: (id: number) => void
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  id,
  onClose,
  onDelete
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
                // if(id) onDelete(id)
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

const PickupOrderForm = ({
  openModal,
  actions,
  onClose,
  selectedRow,
  pickupOrder,
  initPickupOrderRequest,
  onDeleteModal
}: // navigateToJobOrder
{
  openModal: boolean
  actions: 'add' | 'edit' | 'delete' | 'none'
  onClose?: () => void
  selectedRow?: PickupOrder | null | undefined
  pickupOrder?: PickupOrder[] | null
  initPickupOrderRequest: () => void
  onDeleteModal: () => void
  // navigateToJobOrder: () => void;
}) => {
  const { t, i18n } = useTranslation()
  const role = localStorage.getItem(localStorgeKeyName.role)
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId)
  const { dateFormat } = useContainer(CommonTypeContainer)
  const [vehicleType, setVehicleType] = useState<string>('')
  const { marginTop } = useContainer(NotifContainer)
  const [openDelete, setOpenDelete] = useState<boolean>(false)

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // If the overlay is clicked (not its children), close the modal
      onClose && onClose()
    }
  }
  const navigate = useNavigate()

  const handleRowClick = async () => {
    const routeName = role
    const result = await getPicoById(
      selectedPickupOrder ? selectedPickupOrder.picoId : ''
    )
    if (result) {
      navigate(`/${routeName}/editPickupOrder`, { state: result.data })
    }
  }

  const navigateToJobOrder = (picoId: string) => {
    navigate(`/logistic/createJobOrder/${picoId}?isEdit=false`)
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
        updatedBy: selectedPickupOrder.updatedBy,
        version: selectedPickupOrder.version
      }
      const updatePoDtlStatus = {
        status: 'CLOSED',
        updatedBy: selectedPickupOrder.updatedBy,
        version: selectedPickupOrder.version
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
      } catch (error: any) {
        const { state } = extractError(error)
        if (state.code === STATUS_CODE[503]) {
          navigate('/maintenance')
        } else if (state.code === STATUS_CODE[409]) {
          showErrorToast(error.response.data.message)
        }
      }
    } else {
      alert('No selected pickup order')
    }
  }

  const initVehicleDetail = async () => {
    try {
      if (selectedPickupOrder?.vehicleTypeId) {
        const vehicle = await getVehicleDetail(
          selectedPickupOrder.vehicleTypeId
        )
        if (vehicle) {
          let vehicleLang: string = ''
          if (i18n.language === Languages.ENUS) {
            vehicleLang = vehicle?.data?.vehicleTypeNameEng
          } else if (i18n.language === Languages.ZHCH) {
            vehicleLang = vehicle?.data?.vehicleTypeNameSchi
          } else {
            vehicleLang = vehicle?.data?.vehicleTypeNameTchi
          }
          setVehicleType(vehicleLang)
        }
      }
    } catch (error) {}
  }

  useEffect(() => {
    initVehicleDetail()
  }, [selectedPickupOrder?.vehicleTypeId, i18n.language])

  const getDeliveryDate = (deliveryDate: string[]) => {
    const weeks = ['mon', 'tue', 'wed', 'thur', 'fri', 'sat', 'sun']
    let delivery = deliveryDate.map((item) => item.trim())
    let isWeek = false

    for (let deliv of delivery) {
      if (weeks.includes(deliv)) {
        isWeek = true
      }
    }

    if (isWeek) {
      delivery = delivery.map((item) => {
        const days = weekDs.find((day) => day.id === item)
        if (days) {
          if (i18n.language === Languages.ENUS) {
            return days.engName
          } else if (i18n.language === Languages.ZHCH) {
            return days.schiName
          } else {
            return days.tchiName
          }
        } else {
          return ''
        }
      })
    }
    return t('pick_up_order.every') + ' ' + delivery.join(',')
  }

  return (
    <div className="add-vehicle">
      <Drawer
        open={openModal}
        onClose={onClose}
        anchor={'right'}
        variant={'temporary'}
        sx={{
          '& .MuiDrawer-paper': {
            marginTop: `${marginTop}`
          }
        }}
      >
        <div className="header">
          <div className="header-section">
            <div className="flex flex-row items-center justify-between p-[25px] gap-[25px">
              <div className="md:flex items-center gap-2 sm:block">
                <div className="flex-1 flex flex-col items-start justify-start sm:mb-2">
                  <b className="md:text-sm sm:text-xs">
                    {t('pick_up_order.item.detail')}
                  </b>
                  <div className="md:text-smi sm:text-2xs text-grey-dark text-left">
                    {selectedRow?.picoId}
                  </div>
                </div>
                {selectedRow?.status && (
                  <StatusCard status={selectedRow.status} />
                )}
              </div>
              <div className="right-action flex items-center">
                <Box sx={{ marginLeft: 'auto' }}>
                  {role === 'logistic' &&
                  selectedRow?.status &&
                  ['STARTED', 'OUTSTANDING'].includes(selectedRow?.status) ? (
                    <CustomButton
                      text={t('pick_up_order.table.create_job_order')}
                      onClick={() => {
                        if (selectedRow?.picoId) {
                          navigateToJobOrder(selectedRow?.picoId.toString())
                        }
                      }}
                    ></CustomButton>
                  ) : role === 'logistic' &&
                    selectedRow &&
                    selectedRow.status === 'CREATED' &&
                    selectedRow?.tenantId === tenantId ? (
                    <>
                      <CustomButton
                        text={t('pick_up_order.item.edit')}
                        style={{ marginRight: '12px' }}
                        onClick={() => {
                          selectedRow && handleRowClick()
                        }}
                        dataTestId='astd-pickup-order-sidebar-edit-button-4354'
                      />
                      <CustomButton
                        text={t('pick_up_order.item.delete')}
                        outlined
                        onClick={onDeleteModal}
                        dataTestId='astd-pickup-order-sidebar-delete-button-8775'
                      />
                    </>
                  ) : role !== 'logistic' &&
                    selectedRow?.status === 'CREATED' ? (
                    <>
                      <CustomButton
                        text={t('pick_up_order.item.edit')}
                        style={{ marginRight: '12px' }}
                        onClick={() => {
                          selectedRow && handleRowClick()
                        }}
                        dataTestId='astd-pickup-order-sidebar-edit-button-4354'
                      ></CustomButton>
                      <CustomButton
                        text={t('pick_up_order.item.delete')}
                        outlined
                        onClick={onDeleteModal}
                        dataTestId='astd-pickup-order-sidebar-delete-button-8775'
                      ></CustomButton>
                    </>
                  ) : null}
                </Box>

                <div className="close-icon ml-2 cursor-pointer">
                  <img
                    className="relative w-6 h-6 overflow-hidden shrink-0"
                    alt=""
                    src="/collapse1.svg"
                    onClick={onClose}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Divider></Divider>
        <Stack spacing={2} sx={localstyles.content}>
          <Box>
            <Typography sx={localstyles.typo_header}>
              {t('pick_up_order.item.shipping_info')}
            </Typography>
          </Box>

          <CustomField label={t('pick_up_order.item.date_time')}>
            <Typography sx={localstyles.typo_fieldContent}>
              {selectedPickupOrder?.createdAt
                ? dayjs
                    .utc(selectedPickupOrder?.createdAt)
                    .tz('Asia/Hong_Kong')
                    .format(`${dateFormat} HH:mm`)
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
              {dayjs
                .utc(selectedPickupOrder?.effFrmDate)
                .tz('Asia/Hong_Kong')
                .format(`${dateFormat}`)}{' '}
              To{' '}
              {dayjs
                .utc(selectedPickupOrder?.effToDate)
                .tz('Asia/Hong_Kong')
                .format(`${dateFormat}`)}
            </Typography>
          </CustomField>
          {selectedPickupOrder?.picoType !== 'AD_HOC' && (
            <CustomField label={t('pick_up_order.table.delivery_datetime')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {/* {selectedPickupOrder?.routine
                  .map((routineItem) => routineItem)
                  .join(' ')} */}
                {selectedPickupOrder?.routineType === 'daily' &&
                  t('pick_up_order.daily')}
                {selectedPickupOrder?.routineType === 'weekly' &&
                  getDeliveryDate(selectedPickupOrder.routine)}
              </Typography>
            </CustomField>
          )}
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
          {/* <CustomField label={t('pick_up_order.item.plat_number')}>
            <Typography sx={localstyles.typo_fieldContent}>
              {selectedPickupOrder?.platNo}
            </Typography>
          </CustomField> */}
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

          <PickupOrderCard
            pickupOrderDetail={selectedRow?.pickupOrderDetail ?? []}
            status={selectedRow?.status || 'CREATED'}
          />
          {selectedRow?.status === 'REJECTED' && (
            <Box>
              <Typography sx={localstyles.typo_fieldTitle}>
                {selectedRow?.updatedBy} {t('job_order.rejected_at')}{' '}
                {dayjs(selectedRow?.updatedAt).format(`${dateFormat} HH:mm`)},
                {t('job_order.reason_single')} {selectedRow?.reason}
              </Typography>
            </Box>
          )}
        </Stack>
        <DeleteModal
          open={openDelete}
          id={selectedRow?.picoId}
          onClose={() => {
            setOpenDelete(false)
          }}
          onDelete={onDeleteModal}
        />
      </Drawer>
    </div>
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
