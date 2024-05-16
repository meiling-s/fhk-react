import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { styles } from '../../../constants/styles'
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab'
import CustomField from '../../../components/FormComponents/CustomField'
import StatusCard from '../../../components/StatusCard'
import { useNavigate } from 'react-router-dom'
import { getPurchaseOrderById } from '../../../APICalls/Manufacturer/purchaseOrder'
import { useTranslation } from 'react-i18next'
import { displayCreatedDate } from '../../../utils/utils'
import { Languages, Roles, Status, localStorgeKeyName } from '../../../constants/constant'
import {
  PurChaseOrder,
  Row,
  PurchaseOrderDetail
} from '../../../interfaces/purchaseOrder'
import PurchaseOrderCard from './PurchaseOrderCard'
import { PaymentType } from '../../../interfaces/purchaseOrder'
import i18n from '../../../setups/i18n'
const PurchaseOrderForm = ({
  onClose,
  selectedRow,
  purchaseOrder,
  initPickupOrderRequest
}: {
  onClose?: () => void
  selectedRow?: Row | null | undefined
  purchaseOrder?: PurChaseOrder[] | null
  initPickupOrderRequest: () => void
}) => {
  const { t } = useTranslation()
  const role = localStorage.getItem(localStorgeKeyName.role)
  const userRole = localStorage.getItem(localStorgeKeyName.role) || '';
  const rolesEnableCreatePO = [Roles.customerAdmin]
  const paymentTypes : PaymentType[] = [
    {
      paymentNameTchi: '現金',
      paymentNameSchi: '现金',
      paymentNameEng: 'Cash',
      value: 'cash'
    },
    {
      paymentNameTchi: '信用卡',
      paymentNameSchi: '信用卡',
      paymentNameEng: 'Credit card',
      value: 'card'
    },
    {
      paymentNameTchi: '支票',
      paymentNameSchi: '支票',
      paymentNameEng: 'Cheque',
      value: 'cheque'
    },
    {
      paymentNameTchi: '轉數快',
      paymentNameSchi: '转数快',
      paymentNameEng: 'FPS',
      value: 'fps'
    }
  ]
  
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // If the overlay is clicked (not its children), close the modal
      onClose && onClose()
    }
  }
  const navigate = useNavigate()
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurChaseOrder>()
  const [pickupOrderDetail, setPickUpOrderDetail] = useState<PurchaseOrderDetail[]>()
  useEffect(() => {
    if (selectedRow) {
      // refresh the data first
      initGetPickUpOrderData(selectedRow.poId)
    }
  }, [selectedRow])

  const initGetPickUpOrderData = async (poId: string) => {
    const result = await getPurchaseOrderById(poId)
    if (result) {
      setSelectedPurchaseOrder(result.data)
      setPickUpOrderDetail(result.data.purchaseOrderDetail)
    }
  }

  const handleRowClick = async () => {
    const routeName = role
    if(selectedPurchaseOrder?.poId){
      const result = await getPurchaseOrderById(selectedPurchaseOrder?.poId)
    if (result) {
      navigate(`/${routeName}/editPurchaseOrder`, { state: result.data })
    }
    }
    
  }
  
  const onHandlePaymentType = () => {
    const payment = paymentTypes.find(payment => payment.value === selectedPurchaseOrder?.paymentType)

    if(i18n.language === Languages.ENUS) {
      return payment?.paymentNameEng
    } else if(i18n.language === Languages.ZHCH){
      return payment?.paymentNameSchi
    } else {
      return payment?.paymentNameTchi
    }
  }

  return (
    <>
      <Box sx={localstyles.modal} onClick={handleOverlayClick}>
        <Box sx={localstyles.container}>
          <Box sx={{ display: 'flex', flex: '1', p: 4, alignItems: 'center' }}>
            <Box>
              <Typography sx={styles.header4}>
                {t('purchase_order.detail.order')}
              </Typography>
              <Typography sx={styles.header3}>
                {selectedPurchaseOrder?.poId}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexShrink: 0, ml: '20px' }}>
              <StatusCard status={selectedPurchaseOrder?.status} />
            </Box>
            <Box sx={{ marginLeft: 'auto' }}>
            { selectedRow?.status === Status.CREATED && rolesEnableCreatePO.includes(userRole) && 
              (
                <Button
                  onClick={handleRowClick}
                  sx={{
                    borderRadius: "20px",
                    backgroundColor: "#6BC7FF",
                    '&.MuiButton-root:hover':{bgcolor: '#6BC7FF'},
                    width:'fit-content',
                    height: "40px",
                    marginLeft:'20px'
                  }}
                  variant='contained'
                >
                  {t("purchase_order_customer.createOrEdit.edit")}
                </Button>
              )

              }
              <IconButton sx={{ ml: '20px' }} onClick={onClose}>
                <KeyboardTabIcon sx={{ fontSize: '30px' }} />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <Stack spacing={2} sx={localstyles.content}>
            <Box>
              <Typography sx={localstyles.typo_header}>
                {t('purchase_order.detail.contact_info')}
              </Typography>
            </Box>

            <CustomField
              label={t('purchase_order.create.receiving_company_name')}
            >
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPurchaseOrder?.receiverName}
              </Typography>
            </CustomField>

            <CustomField label={t('purchase_order.detail.contact_number')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPurchaseOrder?.contactNo}
              </Typography>
            </CustomField>

            <CustomField label={t('purchase_order.detail.payment_method')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {onHandlePaymentType()}
              </Typography>
            </CustomField>

            {rolesEnableCreatePO.includes(userRole) && 
              (
                <CustomField label={t('purchase_order.create.sender_company_name')}>
                  <Typography sx={localstyles.typo_fieldContent}>
                    {selectedPurchaseOrder?.senderName}
                  </Typography>
                </CustomField>
              )
            }

            <Typography sx={localstyles.typo_header}>
              {t('purchase_order.detail.order_info')}
            </Typography>

            <CustomField label={t('purchase_order.detail.pico_id')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPurchaseOrder?.picoId}
              </Typography>
            </CustomField>

            <PurchaseOrderCard
              selectedPurchaseOrder={
                selectedPurchaseOrder ? selectedPurchaseOrder : null
              }
              purchaseOrderDetail={pickupOrderDetail ?? []}
            />

            <CustomField label={t('check_in.message')}>
              <Typography sx={localstyles.typo_fieldContentGray}>
                {selectedPurchaseOrder?.approvedBy}{' '}
                {selectedPurchaseOrder?.status}{' '}
                {selectedPurchaseOrder?.approvedAt
                  ? displayCreatedDate(selectedPurchaseOrder?.approvedAt)
                  : ''}
              </Typography>
            </CustomField>
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
  },
  typo_fieldContentGray: {
    fontSize: '15px',
    fontWeight: '400',
    letterSpacing: '0.5px',
    marginTop: '2px',
    color: '#717171'
  }
}

export default PurchaseOrderForm
