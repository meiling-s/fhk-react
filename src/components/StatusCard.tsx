import { Box, Typography } from '@mui/material'
import React from 'react'

const StatusCard = ({status}:{status:string}) => {
   
  var bgColor = "";
  var fontColor =''
  switch (status) {
    case "处理中":
      bgColor = '#ECF5EE';
      fontColor ='#7CE495';
      break;
    case "已确认":
      bgColor = '#7CE495';   
      fontColor = '#FFFFFF';
      break;
    case '待处理':
      bgColor = '#E4F6DC';
      fontColor = '#79CA25';
      break;
    case '已拒绝':
      bgColor = '#FFF0F4';
      fontColor = '#FF4242';
      break;
    case '已完成':
      bgColor = '#6BC7FF';
      fontColor = '#FFFFFF';
      break;
    case '已取消':
      bgColor = '#ACACAC';
      fontColor = '#FFFFFF';
      break;
    case '已逾期':
      bgColor = '#F4F4F4';
      fontColor = '#ACACAC';
      break;
    default:
      break;
  }
  return (
    <Box bgcolor={bgColor} width="70px" height='20px'p={1} borderRadius='10px'>
    <Typography fontSize={15} textAlign='center' fontWeight='bold' color={fontColor}>{status}</Typography>
  </Box>
  )
}

export default StatusCard