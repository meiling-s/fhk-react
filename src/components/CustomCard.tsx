import { Box, Card, CardContent, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { CollectionPointType } from '../utils/collectionPointType'
import { collectionPoint } from '../interfaces/collectionPoint'

type props = {
  collectionPoints: collectionPoint[]
}

const returnBgColor = (type: string) => {
  var bgColor = "";
  switch(type){
    case "固定服務點":
      bgColor = '#e4f6dc';
      break;
    case "流動服務點":
      bgColor = '#fff0f4';
      break;
    case '上門服務點':
      bgColor = '#e1f4ff';
      break;
    default:
      break;
  }
  return bgColor;
}

const returnFontColor = (type: string) => {
  var bgColor = "";
  switch(type){
    case "固定服務點":
      bgColor = '#9bd85e';
      break;
    case "流動服務點":
      bgColor = '#f7b4c4';
      break;
    case '上門服務點':
      bgColor = '#71c9ff';
      break;
    default:
      break;
  }
  return bgColor;
}

const CustomCard = ({
  collectionPoints
}:props) => {

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
            <Typography  fontWeight='bold'>{collectionPoint.colName}</Typography>
            <Box
              sx={{
                pt:'4px',
                pm:'4px',
                pl:'8px',
                pr:'8px',
                mb:'5px',
                ml:'7px',
                borderRadius: "10px",
                bgcolor: returnBgColor(collectionPoint.colPointTypeId)
              }}
            >
              <Typography color={returnFontColor(collectionPoint.colPointTypeId)} fontSize={12}>{collectionPoint.colPointTypeId}</Typography>
            </Box>
            </Box>              
            <Typography >{collectionPoint.address}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
    )
  }

export default CustomCard
