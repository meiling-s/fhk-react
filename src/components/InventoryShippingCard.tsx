import { Box, Icon, Stack, Typography } from "@mui/material"
import EastIcon from '@mui/icons-material/East';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { t } from "i18next";
import dayjs from "dayjs";
import { format } from "../constants/constant";

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

const InventoryShippingCard = ({shippingData}: {shippingData: ShippingDataType[]}) => {
  return (
    <>
      {shippingData.map((shipping, index) => (
        <Stack
          key={index}
          borderColor="#e2e2e2"
          p={2}
          borderRadius="12px"
          sx={{ borderWidth: '1px', borderStyle: 'solid'}}
          mt={1}
          spacing={1}
        >
          <Box display="flex">
            <Typography style={localstyles.name}>
              {shipping.senderName}
            </Typography>
            <Icon
              sx={{
                justifySelf: 'center',
                display: 'flex',
                mx: '5px',
                color: '#acacac'
              }}
            >
              <EastIcon />
            </Icon>
            <Typography style={localstyles.name}>
              {shipping.receiverName}
            </Typography>
          </Box>
          <Typography style={localstyles.poNumber}>
            {shipping.picoId}
          </Typography>
          <Box>
            <Box display='flex' alignItems={'center'}>
              <Icon
                sx={{
                  justifySelf: 'center',
                  display: 'flex',
                  mr: '10px',
                  color: '#acacac'
                }}
              >
                <LocalShippingOutlinedIcon />
              </Icon>
              <Typography style={localstyles.logisticName}>
                {shipping.logisticName}
              </Typography>
            </Box>
            <Box display='flex' alignItems={'center'}>
              <Icon
                sx={{
                  justifySelf: 'center',
                  display: 'flex',
                  mr: '10px',
                  color: '#acacac'
                }}
              >
                <LocationOnOutlinedIcon />
              </Icon>
              <Typography style={localstyles.logisticName}>
                {shipping.senderAddr}
              </Typography>
              <Icon
                sx={{
                  justifySelf: 'center',
                  display: 'flex',
                  mx: '5px',
                  color: '#acacac'
                }}
              >
                <EastIcon />
              </Icon>
              <Typography style={localstyles.logisticName}>
                {shipping.receiverAddr}
              </Typography>
            </Box>
            <Box style={localstyles.informationContainer}>
              <Typography style={localstyles.information}>{t('inventory.at')} {dayjs(new Date(shipping.pickupAt)).format(format.dateFormat1)} {t('inventory.handover')}【{shipping.driverName} {shipping.plateNo}】</Typography>
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
    fontWeight: 700,
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
  }
}