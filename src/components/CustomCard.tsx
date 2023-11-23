import { Box, ButtonBase, Card, CardContent, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { collectionPoint } from '../interfaces/collectionPoint'
import { useNavigate } from 'react-router-dom'
import { getColPointType } from '../APICalls/commonManage'
import { useTranslation } from 'react-i18next'
import { colPointType } from '../interfaces/common'
import { useMap } from 'react-leaflet'
import { Position } from '../interfaces/map'

type props = {
  collectionPoints: collectionPoint[]
  hoveredCard:Position|null
  setHoveredCard: React.Dispatch<React.SetStateAction<Position| null>>
}

const returnBgColor = (type: string) => {
  var bgColor = "";
  switch (type) {
    case "CPT00001":
      bgColor = '#e4f6dc';
      break;
    case "CPT00002":
      bgColor = '#fff0f4';
      break;
    case 'CPT00003':
      bgColor = '#e1f4ff';
      break;
    default:
      break;
  }
  return bgColor;
}

const returnFontColor = (type: string) => {

  var bgColor = "";
  switch (type) {
    case "CPT00001":
      bgColor = '#9bd85e';
      break;
    case "CPT00002":
      bgColor = '#f7b4c4';
      break;
    case 'CPT00003':
      bgColor = '#71c9ff';
      break;
    default:
      break;
  }
  return bgColor;
}

const CustomCard = ({
  collectionPoints,
  hoveredCard,
  setHoveredCard
}: props) => {

  const [colType, setColType] = useState<colPointType[]>([]);

  const navigate = useNavigate();

  const { i18n } = useTranslation();

  useEffect(() => {
    initTypes();
  }, []);

  const initTypes = async () => {
    const result = await getColPointType();
    const data = result;
    if(data){
      setColType(data);
    }
  }

  const handleCardOnClick = (col: collectionPoint) => {
    navigate("/collector/editCollectionPoint", { state: col })
  }

  const getColPointNameById = (id: string) => {
    var name: string = "";
    colType.map((col) => {
      //console.log(id,col.colPointTypeId);
      if(id == col.colPointTypeId){
        switch(i18n.language){
          case "enus":
              name = col.colPointTypeEng;
              break;
          case "zhch":
              name = col.colPointTypeSchi;
              break;
          case "zhhk":
              name = col.colPointTypeTchi;
              break;
          default:
              name = col.colPointTypeTchi;        //default fallback language is zhhk
              break;
        }
      }
    })
    //console.log("name: ",name)
    return name;
  }

  return (
    <>
      {collectionPoints.map((collectionPoint) => {
        var posistion = JSON.parse("[" + collectionPoint.gpsCode + "]");
        
        return (
          <Card
            onMouseEnter={() => setHoveredCard({ lat: posistion[0], lon:posistion[1] })}
            onMouseLeave={() => {/*setHoveredCard(null)*/}}
            sx={{
              display: "flex",
              marginRight: "150px",
              borderRadius: '10px',
              marginTop: '20px',
              width: {
                sm: '80%',
                lg: '515px'
              }
            }}
            key={collectionPoint.colName}
          >
            <ButtonBase onClick={() => handleCardOnClick(collectionPoint)}>
              <CardContent sx={{ display: "flex", flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Typography fontWeight='bold'>{collectionPoint.colName}</Typography>
                  <Box
                    sx={{
                      ...localstyles.colPointType,
                      bgcolor: returnBgColor(collectionPoint.colPointTypeId)
                    }}
                  >
                    <Typography color={returnFontColor(collectionPoint.colPointTypeId)} fontSize={12}>{getColPointNameById(collectionPoint.colPointTypeId)}</Typography>
                  </Box>
                </Box>
                <Typography sx={localstyles.address}>{collectionPoint.address}</Typography>
              </CardContent>
            </ButtonBase>
          </Card>
        );
      })}
    </>
  )};
  
  const localstyles = {
    colPointType: {
      pt: '4px',
      pm: '4px',
      pl: '8px',
      pr: '8px',
      mb: '5px',
      ml: '7px',
      borderRadius: "10px"
    },
    address: {
      textAlign: "left",
      color: "#717171"
    }
  };

export default CustomCard
