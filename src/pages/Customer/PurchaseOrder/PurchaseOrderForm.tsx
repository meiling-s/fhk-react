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
import PickupOrderCard from '../../../components/PickupOrderCard'
import { useNavigate } from 'react-router-dom'
import { getPurchaseOrderById } from '../../../APICalls/Manufacturer/purchaseOrder'
import { useTranslation } from 'react-i18next'
import { displayCreatedDate, showErrorToast, showSuccessToast } from '../../../utils/utils'
import CustomButton from '../../../components/FormComponents/CustomButton'
import { Status, localStorgeKeyName } from '../../../constants/constant'
import {
  PurChaseOrder,
  Row,
  PurchaseOrderDetail
} from '../../../interfaces/purchaseOrder'
import PurchaseOrderCard from './PurchaseOrderCard'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { UpdatePurchaseOrder } from '../../../APICalls/Customer/purchaseOrder'

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
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId)

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // If the overlay is clicked (not its children), close the modal
      onClose && onClose()
    }
  }
  const navigate = useNavigate()

  const [selectedPurchaseOrder, setSelectedPurchaseOrder] =
    useState<PurChaseOrder>()

  const [pickupOrderDetail, setPickUpOrderDetail] =
    useState<PurchaseOrderDetail[]>()
  const [pickupOrderData, setPickupOrderData] = useState<PurChaseOrder>()

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
  
  const onHandleUpdate = async () => {
    
  }

  return (
    <>
      <Box sx={localstyles.modal} onClick={handleOverlayClick}>
        <Box sx={localstyles.container}>
          <Box sx={{ display: 'flex', flex: '1', p: 4, alignItems: 'center' }}>
            <Box>
              <Typography sx={styles.header4}>
                {t('purchase_order_customer.detail.order')}
              </Typography>
              <Typography sx={styles.header3}>
                {selectedPurchaseOrder?.poId}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexShrink: 0, ml: '20px' }}>
              <StatusCard status={selectedPurchaseOrder?.status} />
            </Box>
            <Box sx={{ marginLeft: 'auto' }}>
              { selectedPurchaseOrder?.status === Status.CREATED && 
              (
                <Button
                  onClick={onHandleUpdate}
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
                {t('purchase_order_customer.detail.contact_info')}
              </Typography>
            </Box>

            <CustomField label={t('purchase_order_customer.detail.receiving_company_name')}>
               <Typography sx={localstyles.typo_fieldContent}>
                    {selectedPurchaseOrder?.receiverName}
                </Typography>
            </CustomField>

            <CustomField label={t('purchase_order_customer.detail.contact_number')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPurchaseOrder?.contactNo}
              </Typography>
            </CustomField>

            <CustomField label={t('purchase_order_customer.detail.payment_method')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPurchaseOrder?.paymentType}
              </Typography>
            </CustomField>

            <Typography sx={localstyles.typo_header}>
              {t('purchase_order_customer.detail.order_info')}
            </Typography>

            <CustomField label={t('purchase_order_customer.table.recycling_plant')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPurchaseOrder?.picoId}
              </Typography>
            </CustomField>

            <CustomField label={t('purchase_order_customer.detail.pico_id')}>
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
