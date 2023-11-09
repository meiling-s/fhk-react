import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { CollectionPointType } from '../../utils/collectionPointType';
import CustomCard from '../../components/CustomCard';
import { styles } from '../../constants/styles';
import { useNavigate } from 'react-router-dom';
import MyMap from '../../components/MyMap';
import { getAllCollectionPoint } from '../../APICalls/collectionPointManage';
import { collectionPoint } from '../../interfaces/collectionPoint';

const CollectionPoint = () => {

  const [cpsType, setCPSType] = useState<string>('');
  const [cpsName, setCPSName] = useState<string>('');
  const [cpsAddress,setCPSAddress] = useState<string>('');
  const [cpList, setCPList] = useState<collectionPoint[]>([]);

  useEffect(() => {
    const type = localStorage.getItem('selectedCollectionType');
    if(type){
      setCPSType(type)
    }
    const Name = localStorage.getItem('selectedCollectionName');
    if(Name){
      setCPSName(Name)
    }
    const address = localStorage.getItem('selectedCollectionAddress');
    if(address){
      setCPSAddress(address)
    }

    initCollectionPoint();
   
  }, []);

  const initCollectionPoint = async () => {
    const result = await getAllCollectionPoint();
    const data = result?.data;
    if(data && data.length>0){
        console.log("all collection point: ",data);
        setCPList(data);
    }
  }

  const navigate = useNavigate();

  const collectionPoints : CollectionPointType[] = [
    {collectionName:'緣在堅城',collectionType:'固定服務點',collectionAddress:'中環堅道99號豐藥閣對出行人路 (近鴨巴甸街）',collectionLatitude:{latitude:22.3760,longitude:114.1751},markerColor:'abcdef',collectionFontColor:'#9bd85e',collectionBgColor:'#e4f6dc'},
    {collectionName:'緣在堅城',collectionType:'流動服務點',collectionAddress:'中環堅道99號豐藥閣對出行人路 (近鴨巴甸街）',collectionLatitude:{latitude:22.3500,longitude:114.2000},markerColor:'e85141',collectionFontColor:'#f7b4c4',collectionBgColor:'#fff0f4'},
    {collectionName:'緣在堅城',collectionType:'上門服務點',collectionAddress:'中環堅道99號豐藥閣對出行人路 (近鴨巴甸街）',collectionLatitude:{latitude:22.3202,longitude:114.2128},markerColor:'abcdef',collectionFontColor:'#71c9ff',collectionBgColor:'#e1f4ff'},
    {collectionName:'緣在堅城',collectionType:'固定服務點',collectionAddress:'中環堅道99號豐藥閣對出行人路 (近鴨巴甸街）',collectionLatitude:{latitude:22.3375,longitude:114.2634},markerColor:'2ecc71',collectionFontColor:'#9bd85e',collectionBgColor:'#e4f6dc'},
  ]

  
  return (
    <Box sx={{display: "flex", width: "100%"}}>
      <Box
        sx={{
          width: "45%",
          height: "100%",
        }}
      >
        <Box sx={{display:'flex',alignItems:'center',mb:'4+-0px'}}>
          <Typography fontSize={20} color='black' fontWeight='bold'>回收點</Typography>
          <Button
            onClick={() => navigate("/collector/createCollectionPoint")}
            sx={{
              borderRadius: "20px",
              backgroundColor: "#79ca25",
              '&.MuiButton-root:hover':{bgcolor: '#79ca25'},
              width:'90px',
              height: "40px",
              marginLeft:'20px'
            }}
            variant='contained'>
              + 建立
          </Button>
        </Box>
        <Box/>
        <CustomCard collectionPoints ={cpList}/>
      </Box>
      <Box
        sx={styles.mapRightContainer}>
        <MyMap collectionPoints ={collectionPoints} />
      </Box>
    </Box>
  )
}

export default CollectionPoint