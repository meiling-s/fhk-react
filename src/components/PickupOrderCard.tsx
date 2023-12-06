import { Box, Icon, Stack, Typography } from '@mui/material'
import React from 'react'
import CustomField from './FormComponents/CustomField'
import StatusCard from './StatusCard'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { PickupOrderDetail } from '../interfaces/pickupOrder';

const PickupOrderCard = ({pickupOrderDetail}:{pickupOrderDetail:PickupOrderDetail[]}) => {
  return (
    <Stack borderColor='#ACACAC'p={2} borderRadius='10px' sx={{borderWidth:'1px',borderStyle:'solid'}} spacing={1}>
        <Box display='flex' justifyContent='space-between'>
            <Box>
            <CustomField label='主类别' >
                <Typography>废纸</Typography>
            </CustomField >
            <CustomField label='次类别'>
                <Typography>纸皮</Typography>
            </CustomField>
                </Box>
            <Box  >
            <StatusCard status={pickupOrderDetail[0]?.status}/>
            </Box>
        </Box>
        <Box display='flex'>
          <Box display='flex' width={'150px'} >
           <Icon sx={{justifySelf:'center',display:'flex',mr:'5px'}}><AccessTimeIcon/></Icon>
          <Typography>预计运送时间</Typography>
          </Box>
          <Typography  ml='60px' >2023/10/0118:00</Typography>
        </Box>
        <Box display='flex'>
        <Box display='flex' width={'150px'} >
        <Icon sx={{justifySelf:'center',display:'flex',mr:'5px'}}><MonitorWeightOutlinedIcon/></Icon>
          <Typography>重量</Typography>
          </Box>
          <Typography ml="60px">20Kg</Typography>
        </Box>
        <Box display='flex'>
        <Box display='flex' width={'150px'} >
        <Icon sx={{justifySelf:'center',display:'flex',mr:'5px'}}><Inventory2OutlinedIcon/></Icon>
          <Typography>寄件及收件公司</Typography>
          </Box>
          <Box ml={'60px'} width={'400px'}  sx={{ overflowWrap: 'break-word' }}>
          <Typography sx={{ overflowWrap: 'break-word' }}>{pickupOrderDetail[0]?.senderName} - {pickupOrderDetail[0]?.receiverName}</Typography>
          </Box>
        </Box>
        <Box display='flex' >
        <Box display='flex' width={'150px'} height={'30px'}>
        <Icon sx={{justifySelf:'center',display:'flex',mr:'5px'}}><PlaceOutlinedIcon/></Icon>
          <Typography>送出及到达地点</Typography>
          </Box>
          <Box ml={'60px'} width={'400px'}  sx={{ overflowWrap: 'break-word' }}>
          <Typography   >{pickupOrderDetail[0]?.senderAddr} --- {pickupOrderDetail[0]?.receiverAddr}</Typography>
          </Box>
        </Box>
        
    </Stack>
  )
}

export default PickupOrderCard