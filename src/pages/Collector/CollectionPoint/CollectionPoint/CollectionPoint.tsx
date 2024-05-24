import { Box, Button, Typography, Pagination } from '@mui/material';
import { useEffect, useState } from 'react'
import CustomCard from '../../../../components/CustomCard';
import { styles } from '../../../../constants/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import MyMap from '../../../../components/MyMap';
import { getCollectionPoint } from '../../../../APICalls/Collector/collectionPointManage';
import { collectionPoint } from '../../../../interfaces/collectionPoint';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Position } from '../../../../interfaces/map';
import { STATUS_CODES } from 'http';
import { STATUS_CODE, localStorgeKeyName } from '../../../../constants/constant';
import { extractError } from '../../../../utils/utils';

const CollectionPoint = () => {

  const location = useLocation();
  const action: string = location.state;

  const [colList, setColList] = useState<collectionPoint[]>([]);
  const [hoveredCard, setHoveredCard] = useState<Position| null>(null);
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
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

  useEffect(() => {
    initCollectionPoint()
  }, [page])

  async function initCollectionPoint() {
    try {
      const result = await getCollectionPoint(page - 1, pageSize);
      if(result?.status === STATUS_CODE[200]){
        setColList([]);
        const data = result?.data.content;
        setTotalPages(result?.data.totalPages)
        if(data && data.length>0){
            setColList(data);
        }
      }
    } catch (error:any) {
      const {state, realm} =  extractError(error);
      if(state.code === STATUS_CODE[503]){
        navigate('/maintenance')
      } else {
        navigate(`/${realm}/error`, { state: state })
      }
      
    }
  }

  return (
    <>
    <ToastContainer/>
      <Box sx={{display: "flex", width: "100%", justifyContent: 'space-between',
          marginTop: {
            xs: '62px',
            sm: 0
          }}}>
        <Box
          sx={{
            width: {sm:'45%',lg:'50%'},
            height: "100%",
          }}
        >
          <Box sx={{display:'flex',alignItems:'center',mb:'4+-0px', paddingLeft: {xs: '22px'}}}>
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
          <Pagination
              className="mt-4"
              count={Math.ceil(totalPages)}
              page={page}
              onChange={(_, newPage) => {
                setPage(newPage)
              }}
            />
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