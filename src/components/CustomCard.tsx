import { Box, Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import { CollectionPointType } from '../utils/collectionPointType'



const CustomCard = ({ collectionPoints}:{collectionPoints:CollectionPointType[]}) => {
    
  return (
    <>
    {collectionPoints.map((collectionPoint)=>(<Card
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
              pt:'3px',
              pm:'3px',
              pl:'6px',
              pr:'6px',
              mb:'5px',
              ml:'7px',
              borderRadius: "10px",
              bgcolor: "#e4f6dc",
            }}
          >
            <Typography color='#9bd85e' fontSize={12}>{collectionPoint.collectionType}</Typography>
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