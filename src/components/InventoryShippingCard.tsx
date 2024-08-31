import { Box, Icon, Stack, Typography } from '@mui/material'
import EastIcon from '@mui/icons-material/East'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import { t } from 'i18next'
import dayjs from 'dayjs'
import { format } from '../constants/constant'

export interface ShippingDataType {
  senderName: string
  receiverName: string
  picoId: string
  logisticName: string
  senderAddr: string
  receiverAddr: string
  pickupAt: string
  driverName: string
  plateNo: string
}

const InventoryShippingCard = ({
  shippingData
}: {
  shippingData: ShippingDataType[]
}) => {
  return (
    <>
      {shippingData.map((shipping, index) => (
        <Stack
          key={shipping.picoId}
          borderColor="#e2e2e2"
          p={2}
          borderRadius="12px"
          sx={{ borderWidth: '1px', borderStyle: 'solid' }}
          mt={1}
          spacing={1}
        >
          <Box display="flex" alignItems={'center'} className="po-number">
            <Typography style={localstyles.name} width={'150px'}>
              {t('pick_up_order.table.pico_id')}
            </Typography>
            <Typography style={{ ...localstyles.poNumber, marginLeft: '60px' }}>
              {shipping.picoId}
            </Typography>
          </Box>
          <Box display="flex" alignItems={'center'}>
            <Box display="flex" width={'150px'} flexShrink={0}>
              <Icon
                sx={{
                  justifySelf: 'center',
                  display: 'flex',
                  mr: '5px',
                  color: '#acacac'
                }}
              >
                <LocalShippingOutlinedIcon />
              </Icon>
              <Typography style={localstyles.mini_title}>
                {t('check_out.logistic_company')}
              </Typography>
            </Box>
            <Box
              ml={'60px'}
              width={'400px'}
              sx={{ overflowWrap: 'break-word' }}
            >
              <Typography style={localstyles.mini_value}>
                {shipping?.logisticName}
              </Typography>
            </Box>
          </Box>
          <Box display="flex">
            <Box display="flex" width={'150px'} flexShrink={0}>
              <Icon
                sx={{
                  justifySelf: 'center',
                  display: 'flex',
                  mr: '5px',
                  color: '#acacac'
                }}
              >
                <Inventory2OutlinedIcon />
              </Icon>
              <Typography style={localstyles.mini_title}>
                {t('pick_up_order.card_detail.sender_and_receiver_company')}
              </Typography>
            </Box>
            <Box
              ml={'60px'}
              width={'400px'}
              sx={{ overflowWrap: 'break-word' }}
            >
              <Typography
                sx={{ overflowWrap: 'break-word' }}
                style={localstyles.mini_value}
              >
                {shipping?.senderName} → {shipping?.receiverName}
              </Typography>
            </Box>
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
                {t('pick_up_order.card_detail.sender_and_receiver_location')}
              </Typography>
            </Box>
            <Box
              ml={'60px'}
              width={'400px'}
              sx={{ overflowWrap: 'break-word' }}
            >
              <Typography style={localstyles.mini_value}>
                {shipping?.senderAddr} → {shipping.receiverAddr}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box style={localstyles.informationContainer}>
              <Typography style={localstyles.information}>
                {t('inventory.at')}{' '}
                {dayjs(new Date(shipping.pickupAt)).format(format.dateFormat1)}{' '}
                {t('inventory.handover')}【{shipping.driverName}{' '}
                {shipping.plateNo}】
              </Typography>
            </Box>
          </Box>
        </Stack>
      ))}
    </>
  )
}

export default InventoryShippingCard

const localstyles = {
  name: {
    fontSize: 15,
    fontWeight: 700
  },
  poNumber: {
    fontSize: 13,
    fontWeight: 400,
    color: '#717171'
  },
  logisticName: {
    fontSize: 12,
    color: '#717171',
    fontWeight: 400
  },
  informationContainer: {
    marginTop: 10,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    padding: '4px 8px'
  },
  information: {
    fontSize: 12,
    fontWeight: 400,
    color: '#79CA25'
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
