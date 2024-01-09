import { Box, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'


const StatusCard = ({status}:{status:string|undefined}) => {
  const { t } = useTranslation()

  var bgColor = "";
  var fontColor =''
  var name = ''
  switch (status) {
    case "STARTED":
      bgColor = '#ECF5EE';
      fontColor ='#7CE495';
      name =  t('status.started')
      break;
    case "CONFIRMED":
      bgColor = '#7CE495';   
      fontColor = '#FFFFFF';
      name = t('status.confirmed')
      break;
    case 'CREATED':
      bgColor = '#E4F6DC';
      fontColor = '#79CA25';
      name =  t('status.created')
      break;
    case 'REJECTED':
      bgColor = '#FFF0F4';
      fontColor = '#FF4242';
      name =  t('status.rejected')
      break;
    case 'COMPLETED':
      bgColor = '#6BC7FF';
      fontColor = '#FFFFFF';
      name = t('status.completed')

      break;
    case 'CLOSED':
      bgColor = '#ACACAC';
      fontColor = '#FFFFFF';
      name = t('status.closed')
      break;
    case 'OUTSTANDING':
      bgColor = '#F4F4F4';
      fontColor = '#ACACAC';
      name =  t('status.outstanding')
      break;
    default:
      break;
  }
  return (
    <Box bgcolor={bgColor} width="70px" height='20px'p={1} borderRadius='10px'>
    <Typography fontSize={15} textAlign='center' fontWeight='bold' color={fontColor}>{name}</Typography>
  </Box>
  )
}

export default StatusCard