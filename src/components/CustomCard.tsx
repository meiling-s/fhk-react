import { Box, Card, CardContent, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { CollectionPointType } from '../utils/collectionPointType'



const CustomCard = ({ collectionPoints}:{collectionPoints:CollectionPointType[]}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
        document.body.style.overflow = "scroll"
    };
}, []);
    
return (
  <>
  {collectionPoints.map((collectionPoint)=>(
      <Card
        sx={{
          display: "flex",
          marginRight: "150px",
          borderRadius:'10px',
          marginTop:'20px'
        }}
      >
        <CardContent sx={{ display: "flex", alignItems: "flex-start",flexDirection:'column' }}>
          <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
          <Typography  fontWeight='bold'>{collectionPoint.collectionName}</Typography>
          <Box
            sx={{
              pt:'4px',
              pm:'4px',
              pl:'8px',
              pr:'8px',
              mb:'5px',
              ml:'7px',
              borderRadius: "10px",
              bgcolor: collectionPoint.collectionBgColor
            }}
          >
            <Typography color={collectionPoint.collectionFontColor} fontSize={12}>{collectionPoint.collectionType}</Typography>
          </Box>
          </Box>              
          <Typography >{collectionPoint.collectionAddress}</Typography>
        </CardContent>
      </Card>
    ))}
  </>
  )
}

export default CustomCard
