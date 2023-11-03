import { Box, Button, Typography } from '@mui/material';
import React from 'react'
import { CollectionPointType } from '../../utils/collectionPointType';
import CustomCard from '../../components/CustomCard';
import { styles } from '../../constants/styles';
import { useNavigate } from 'react-router-dom';

function CollectionPoint() {

  console.log("testing testing 123")

  const navigate = useNavigate();

  const collectionPoints : CollectionPointType[] = [
    {id: "1", collectionName:'緣在堅城',collectionType:'固定服務點',collectionAddress:'中環堅道99號豐藥閣對出行人路 (近鴨巴甸街）'},
    {id: "2",collectionName:'緣在堅城',collectionType:'流動服務點',collectionAddress:'中環堅道99號豐藥閣對出行人路 (近鴨巴甸街）'},
    {id: "3",collectionName:'緣在堅城',collectionType:'上門服務點',collectionAddress:'中環堅道99號豐藥閣對出行人路 (近鴨巴甸街）'},
    {id: "4",collectionName:'緣在堅城',collectionType:'固定服務點',collectionAddress:'中環堅道99號豐藥閣對出行人路 (近鴨巴甸街）'},
  ]
  
  return (
    <Box sx={styles.innerScreen}>
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
        <CustomCard collectionPoints ={collectionPoints}/>
      </Box>
    <Box sx={{ width: "55%", height: "100%" }}>
    
    </Box>
  </Box>
  )
}

export default CollectionPoint