import { Box, Icon, Modal, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomField from '../../../components/FormComponents/CustomField'
import StatusCard from '../../../components/StatusCard'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LocalizeRecyctype from '../../../components/TableComponents/LocalizeRecyctype'
import {
  PurChaseOrder,
  PurchaseOrderDetail
} from '../../../interfaces/purchaseOrder'
import { useTranslation } from 'react-i18next'
import i18n from '../../../setups/i18n'
import { displayCreatedDate } from '../../../utils/utils'
import { EDIT_OUTLINED_ICON } from '../../../themes/icons'
import PurchaseOrderFormCreateOrEdit from './PurchaseOrderFormCreateOrEdit'

const PurchaseOrderCard = ({
  selectedPurchaseOrder,
  purchaseOrderDetail,
  isEdit,
  onChangePurchaseOrder
}: {
  selectedPurchaseOrder: PurChaseOrder | null
  purchaseOrderDetail: PurchaseOrderDetail[],
  isEdit?: boolean,
  onChangePurchaseOrder?: (index: number, orderDetail: PurchaseOrderDetail, type: string, value: string) => void
}) => {
  const { t } = useTranslation()
  const [openModal, setOpenModal] = useState(false);
 
  const getRecyName = (podetail: PurchaseOrderDetail) => {
    var name = ''
    switch (i18n.language) {
      case 'enus':
        name = podetail.recyclableNameEng
        break
      case 'zhch':
        name = podetail.recyclableNameSchi
        break
      case 'zhhk':
        name = podetail.recyclableNameTchi
        break
      default:
        name = podetail.recyclableNameTchi
        break
    }

    return name
  }

  const getRecySubName = (podetail: PurchaseOrderDetail) => {
    var name = ''
    switch (i18n.language) {
      case 'enus':
        name = podetail.recyclableSubNameEng
        break
      case 'zhch':
        name = podetail.recyclableSubNameSchi
        break
      case 'zhhk':
        name = podetail.recyclableSubNameTchi
        break
      default:
        name = podetail.recyclableSubNameTchi
        break
    }

    return name
  }

  const handleEdit = () => {
    setOpenModal(true)
  }

  const handleCloses =() => {
    setOpenModal(false)
  }

  return (
    <>
      {purchaseOrderDetail.map((podetail, index) => (
        <Stack
          key={index}
          borderColor="#e2e2e2"
          p={2}
          borderRadius="12px"
          sx={{ borderWidth: '1px', borderStyle: 'solid' }}
          spacing={1}
        >
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Box key={index}>
                <CustomField
                  label={t('pick_up_order.card_detail.main_category')}
                >
                  <Typography sx={localstyles.typo_fieldContent}>
                    {getRecyName(podetail)}
                  </Typography>
                </CustomField>
                <CustomField
                  label={t('pick_up_order.card_detail.subcategory')}
                  style={{ marginTop: '12px' }}
                >
                  <Typography sx={localstyles.typo_fieldContent}>
                    {getRecySubName(podetail)}
                  </Typography>
                </CustomField>
              </Box>
            </Box>
          </Box>
          <Box display="flex" mt={'15px !important'}>
            <Box display="flex" width={'150px'}>
              <Icon
                sx={{
                  justifySelf: 'center',
                  display: 'flex',
                  mr: '5px',
                  color: '#acacac'
                }}
              >
                <AccessTimeIcon />
              </Icon>
              <Typography style={localstyles.mini_title}>
                {t('pick_up_order.card_detail.shipping_time')}
              </Typography>
            </Box>
            <Typography ml="60px" style={localstyles.mini_value}>
              {selectedPurchaseOrder?.createdAt
                ? displayCreatedDate(selectedPurchaseOrder.createdAt)
                : ''}
            </Typography>
          </Box>
          <Box display="flex">
            <Box display="flex" width={'150px'}>
              <Icon
                sx={{
                  justifySelf: 'center',
                  display: 'flex',
                  mr: '5px',
                  color: '#acacac'
                }}
              >
                <MonitorWeightOutlinedIcon />
              </Icon>
              <Typography style={localstyles.mini_title}>
                {t('pick_up_order.card_detail.weight')}
              </Typography>
            </Box>
            <Typography ml="60px" style={localstyles.mini_value}>
              {podetail.weight} kg
            </Typography>
          </Box>
          <Box display="flex">
            <Box display="flex" width={'150px'} height={'30px'} flexShrink={0}>
              <Icon
                sx={{
                  justifySelf: 'center',
                  display: 'flex',
                  mr: '5px',
                  color: '#acacac'
                }}
              >
                <PlaceOutlinedIcon />
              </Icon>
              <Typography style={localstyles.mini_title}>
                {t('pick_up_order.card_detail.deliver_location')}
              </Typography>
            </Box>
            <Box
              ml={'60px'}
              width={'400px'}
              sx={{ overflowWrap: 'break-word' }}
            >
              <Typography style={localstyles.mini_value}>
                {selectedPurchaseOrder?.receiverAddr}
              </Typography>
            </Box>
          </Box>

          { isEdit && 
            (
              <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
                <Typography>
                  <EDIT_OUTLINED_ICON
                    className='hover:cursor-pointer'
                    onClick={() => handleEdit()}
                  />
                </Typography>
                <Typography>
                  {t('purchase_order_customer.createOrEdit.edit')}
                </Typography>
              </Box>
            )
          }

        <Modal open={openModal} onClose={handleCloses}>
          <PurchaseOrderFormCreateOrEdit
            onClose={handleCloses}
            selectedRow={podetail}
            isEdit={isEdit}
            createdDate={selectedPurchaseOrder?.createdAt}
            arrived={selectedPurchaseOrder?.receiverAddr}
            index={index}
            onChangePurchaseOrder={onChangePurchaseOrder}
          />
        </Modal>
       
        </Stack>
      ))}
    </>
  )
}

export default PurchaseOrderCard

const localstyles = {
  typo_fieldContent: {
    fontSize: '15px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    marginTop: '2px'
  },
  mini_title: {
    fontSize: '12px',
    color: '#acacac',
    letterSpacing: '1px'
  },
  mini_value: {
    fontSize: '13px',
    color: '#535353',
    letterSpacing: '1px'
  }
}
