import { Box, Button, Typography } from '@mui/material';
import React from 'react'
import { CollectionPointType } from '../utils/collectionPointType';
import CustomCard from '../components/CustomCard';

const CollectionPoint = () => {
    const collectionPoints : CollectionPointType[] = [
        {collectionName:'緣在堅城',collectionType:'固定服務點',collectionAddress:'中環堅道99號豐藥閣對出行人路 (近鴨巴甸街）'},
        {collectionName:'緣在堅城',collectionType:'流動服務點',collectionAddress:'中環堅道99號豐藥閣對出行人路 (近鴨巴甸街）'},
        {collectionName:'緣在堅城',collectionType:'上門服務點',collectionAddress:'中環堅道99號豐藥閣對出行人路 (近鴨巴甸街）'},
        {collectionName:'緣在堅城',collectionType:'固定服務點',collectionAddress:'中環堅道99號豐藥閣對出行人路 (近鴨巴甸街）'},
      ]
      const drawerWidth = 246;
  return (
    <Box sx={{width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor:'#f4f5f7', height: "100vh", display: "flex" }}>
    <Box
      sx={{
        pt: "50px",
        pl:'40px',
        width: "45%",
        height: "100%",
      }}
    >
      <Box sx={{display:'flex',alignItems:'center',mb:'4+-0px'}}>
     <Typography fontSize={20} color='black' fontWeight='bold'>回收點</Typography>
     <Button sx={{
          borderRadius: "20px",
          backgroundColor: "#79ca25",
          '&.MuiButton-root:hover':{bgcolor: '#79ca25'},
          width:'90px',
          height: "40px",
          marginLeft:'20px'
        }}variant='contained'>+ 建立</Button>
        </Box>
        <Box/>
     <CustomCard collectionPoints ={collectionPoints}/>
    </Box>
    <Box sx={{ width: "55%", backgroundColor: "blue", height: "100%" }}>
    
    </Box>
  </Box>
  )
}

export default CollectionPoint