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

import {
  PickupOrder,
  PickupOrderDetail,
  Row
} from '../../../interfaces/pickupOrder'
import { useNavigate } from 'react-router-dom'
import {
  editPickupOrderDetailStatus,
  editPickupOrderStatus,
  getPicoById
} from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import { useTranslation } from 'react-i18next'
import { displayCreatedDate } from '../../../utils/utils'
import CustomButton from '../../../components/FormComponents/CustomButton'
import { localStorgeKeyName } from '../../../constants/constant'

const PurchaseOrderForm = ({
  onClose,
  selectedRow,
  pickupOrder,
  initPickupOrderRequest
}: {
  onClose?: () => void
  selectedRow?: Row | null | undefined
  pickupOrder?: PickupOrder[] | null
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

  const handleRowClick = async (po: PickupOrder) => {
    const routeName = role
    const result = await getPicoById(
      selectedPickupOrder ? selectedPickupOrder.picoId : ''
    )
    if (result) {
      navigate(`/${routeName}/editPickupOrder`, { state: result.data })
    }
  }

  const [selectedPickupOrder, setSelectedPickupOrder] = useState<PickupOrder>()

  const [pickupOrderDetail, setPickUpOrderDetail] =
    useState<PickupOrderDetail[]>()
  const [pickupOrderData, setPickupOrderData] = useState<PickupOrder>()

  useEffect(() => {
    if (selectedRow) {
      // refresh the data first
      initGetPickUpOrderData(selectedRow.picoId)
    }
  }, [selectedRow])

  const initGetPickUpOrderData = async (picoId: number) => {
    const result = await getPicoById(picoId.toString())
    if (result) {
      setSelectedPickupOrder(result.data)
      setPickUpOrderDetail(result.data.pickupOrderDetail)
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
                {selectedPickupOrder?.picoId}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexShrink: 0, ml: '20px' }}>
              <StatusCard status={selectedPickupOrder?.status} />
            </Box>
            <Box sx={{ marginLeft: 'auto' }}>
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
              label={t('purchase_order.detail.receiving_company_name')}
            >
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPickupOrder?.createdAt
                  ? displayCreatedDate(selectedPickupOrder?.createdAt)
                  : ''}
              </Typography>
            </CustomField>

            <CustomField label={t('purchase_order.detail.contact_number')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPickupOrder?.effFrmDate}
              </Typography>
            </CustomField>

            <CustomField label={t('purchase_order.detail.payment_method')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPickupOrder?.platNo}
              </Typography>
            </CustomField>

            <Typography sx={localstyles.typo_header}>
              {t('purchase_order.detail.order_info')}
            </Typography>

            <CustomField label={t('purchase_order.detail.pico_id')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPickupOrder?.contactNo}
              </Typography>
            </CustomField>

            <PickupOrderCard pickupOrderDetail={pickupOrderDetail ?? []} />

            <CustomField label={t('purchase_order.detail.message')}>
              <Typography sx={localstyles.typo_fieldContentGray}>
                [UserID] Approved on 2023/09/24 17:00
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
