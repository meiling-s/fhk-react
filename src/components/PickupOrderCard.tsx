import { Box, Icon, Stack, Typography } from '@mui/material'
import React from 'react'
import CustomField from './FormComponents/CustomField'
import StatusCard from './StatusCard'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const PickupOrderCard = () => {
  return (
    <Stack borderColor='#ACACAC'p={2} borderRadius='10px' height='230px'sx={{borderWidth:'1px',borderStyle:'solid'}} spacing={1}>
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
            <StatusCard status='已拒绝'/>
            </Box>
        </Box>
        <Box display='flex'>
           <Icon sx={{justifySelf:'center',display:'flex',mr:'5px'}}><AccessTimeIcon/></Icon>
          <Typography>预计运送时间</Typography>
          <Typography  ml='76px' >2023/10/01 18:00</Typography>
        </Box>
        <Box display='flex'>
        <Icon sx={{justifySelf:'center',display:'flex',mr:'5px'}}><MonitorWeightOutlinedIcon/></Icon>
          <Typography>重量</Typography>
          <Typography ml="140px">20Kg</Typography>
        </Box>
        <Box display='flex'>
        <Icon sx={{justifySelf:'center',display:'flex',mr:'5px'}}><Inventory2OutlinedIcon/></Icon>
          <Typography>寄件及收件公司</Typography>
          <Typography ml="60px">寄件公司 - 收件公司</Typography>
        </Box>
        <Box display='flex'>
        <Icon sx={{justifySelf:'center',display:'flex',mr:'5px'}}><PlaceOutlinedIcon/></Icon>
          <Typography>送出及到达地点</Typography>
          <Typography ml="60px">送出地点 - 到达地点</Typography>
        </Box>
        
    </Stack>
  )
}

export default PickupOrderCard