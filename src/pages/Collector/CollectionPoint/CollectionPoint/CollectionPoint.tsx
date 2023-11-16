import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react'
import CustomCard from '../../../../components/CustomCard';
import { styles } from '../../../../constants/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import MyMap from '../../../../components/MyMap';
import { getCollectionPoint } from '../../../../APICalls/collectionPointManage';
import { collectionPoint } from '../../../../interfaces/collectionPoint';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Position } from '../../../../interfaces/map';

const CollectionPoint = () => {

  const location = useLocation();
  const action: string = location.state;

  const [colsType, setColsType] = useState<string>('');
  const [colsName, setColsName] = useState<string>('');
  const [colsAddress,setColsAddress] = useState<string>('');
  const [colList, setColList] = useState<collectionPoint[]>([]);
  const [hoveredCard, setHoveredCard] = useState<Position| null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    const type = localStorage.getItem('selectedCollectionType');
    if(type){
      setColsType(type)
    }
    const Name = localStorage.getItem('selectedCollectionName');
    if(Name){
      setColsName(Name)
    }
    const address = localStorage.getItem('selectedCollectionAddress');
    if(address){
      setColsAddress(address)
    }

    initCollectionPoint();

    if(action){
      var toastMsg = "";
      switch(action){
        case "created":
          toastMsg = t("col.collectionPoint_created");
          break;
        case "updated":
          toastMsg = t("col.collectionPoint_updated");
          break;
      }
      toast.info(toastMsg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    
    navigate(location.pathname, { replace: true });
   
  }, []);

  async function initCollectionPoint() {
    const result = await getCollectionPoint(0, 10);
    const data = result?.data.content;
    if(data && data.length>0){
        console.log("all collection point: ",data);
        setColList(data);
    }
  }

  const navigate = useNavigate();
  
  return (
    <>
    <ToastContainer/>
      <Box sx={{display: "flex", width: "100%"}}>
        <Box
          sx={{
            width: {sm:'45%',lg:'50%'},
            height: "100%",
          }}
        >
          <Box sx={{display:'flex',alignItems:'center',mb:'4+-0px'}}>
            <Typography fontSize={20} color='black' fontWeight='bold'>{t("collection_Point")}</Typography>
            <Button
              onClick={() => navigate("/collector/createCollectionPoint")}
              sx={{
                borderRadius: "20px",
                backgroundColor: "#79ca25",
                '&.MuiButton-root:hover':{bgcolor: '#79ca25'},
                width:'fit-content',
                height: "40px",
                marginLeft:'20px'
              }}
              variant='contained'>
                + {t("col.create")}
            </Button>
          </Box>
          <Box/>
          <CustomCard collectionPoints ={colList} hoveredCard = {hoveredCard} setHoveredCard ={setHoveredCard} />
        </Box>
        <Box
          sx={styles.mapRightContainer}>
          <MyMap collectionPoints ={colList}  hoveredCard = {hoveredCard} />
        </Box>
      </Box>
    </>
  )
}

export default CollectionPoint