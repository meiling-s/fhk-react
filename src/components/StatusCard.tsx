import { Box, Typography } from '@mui/material'
import React from 'react'

const StatusCard = ({status}:{status:string|undefined}) => {
   
  var bgColor = "";
  var fontColor =''
  var name = ''
  switch (status) {
    case "STARTED":
      bgColor = '#ECF5EE';
      fontColor ='#7CE495';
      name =  "处理中"
      break;
    case "CONFIRMED":
      bgColor = '#7CE495';   
      fontColor = '#FFFFFF';
      name =  "已确认"
      break;
    case 'CREATED':
      bgColor = '#E4F6DC';
      fontColor = '#79CA25';
      name =  "待处理"
      break;
    case 'REJJECTED':
      bgColor = '#FFF0F4';
      fontColor = '#FF4242';
      name =  "已拒绝"
      break;
    case 'COMPLETED':
      bgColor = '#6BC7FF';
      fontColor = '#FFFFFF';
      name ='已完成'

      break;
    case 'CLOSED':
      bgColor = '#ACACAC';
      fontColor = '#FFFFFF';
      name =  "已取消"
      break;
    case 'OUTSTANDING':
      bgColor = '#F4F4F4';
      fontColor = '#ACACAC';
      name =  "已逾期"
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