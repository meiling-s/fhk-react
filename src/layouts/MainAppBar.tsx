import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Fade,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  LANGUAGE_ICON,
  NOTIFICATION_ICON,
  RIGHT_ARROW_ICON,
  SEARCH_ICON,
} from "../themes/icons";
import BackgroundLetterAvatars from "../components/CustomAvatar";
import { useNavigate } from "react-router-dom";
import { localStorgeKeyName } from "../constants/constant";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CircleIcon from '@mui/icons-material/Circle';
import { getAllCheckInRequests } from "../APICalls/Collector/warehouseManage";
import { CheckIn } from "../interfaces/checkin";
import RequestForm from "../components/FormComponents/RequestForm";


const MainAppBar = () => {
  const [keywords, setKeywords] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [checkInRequest,setCheckInRequest] = useState<CheckIn[]>([])
  const [selectedItem,setSelectedItem] = useState<CheckIn>()
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const drawerWidth = 246;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openModal,setOpenModal] =useState<boolean>(false)

  const handleLanguageChange = (lng: string) => {
    console.log("change language: ", lng);
    i18n.changeLanguage(lng);
  };
 

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onKeywordsChange = (k: string) => {
    setKeywords(k);
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  useEffect(()=>{
    initCheckInRequest()
    
   
},[]);

const handleItemClick = (checkIn:CheckIn) => {
  // Store the selected item's content or perform any actions
  setOpenModal(true)
  setSelectedItem(checkIn);
  // navigate('/collector/shipment', { state: checkIn })
};
const handleCloses = () =>{
  setOpenModal(false)
}
async function initCheckInRequest() {
  const result = await getAllCheckInRequests();
  const data = result?.data.content;
  if(data && data.length>0){
      console.log("all checkIn request ",data);
      setCheckInRequest(data);
  }
}

  return (
    //<Box flexDirection={"row"} sx={{ flexGrow: 1 }}>
    <AppBar
      elevation={5}
      position="fixed"
      sx={{
        width: `calc(100% - ${isMobile ? 0 : drawerWidth}px)`,
        ml: `${drawerWidth}px`,
      }}
    >
      <Toolbar
        style={{ background: "white" }}
        sx={{ height: { sm: "100px", lg: "64px" } }}
      >
        <Box
          display="flex"
          sx={{ ml: 5, width: { sm: "50%", lg: "20%" } }}
        ></Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex" }}>
          <IconButton onClick={toggleDrawer}>
            <Badge badgeContent={checkInRequest.length} color="error">
              <NOTIFICATION_ICON />

              <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer}>
                <Box width="500px">
                  <Box display="flex" p={4} alignItems="center">
                    <Typography
                      fontSize={20}
                      fontWeight="bold"
                      sx={{ mr: "10px" }}
                    >
                      通知
                    </Typography>
                    <BackgroundLetterAvatars
                      name={checkInRequest.length.toString()}
                      size={23}
                      backgroundColor="red"
                      fontColor="white"
                      fontSize="15px"
                      isBold={true}
                    />
                  </Box>
                  <Divider />
                  {checkInRequest.map((checkIn)=>(  
                    <>
                  <List key = {checkIn.chkInId}>
                    <ListItem onClick={() => handleItemClick(checkIn)}>
                      <ListItemButton >
                        <Stack>
                          <Stack spacing={-2} direction='row' alignItems='center'>
                        <ListItemIcon  style={{color:'red' }}>
                         <CircleIcon sx={{fontSize:'0.75rem'}} />
                        </ListItemIcon>
                       
                        <Typography fontWeight='bold'  sx={{ml:'40px'}}>
                            送入请求
                          </Typography>
                          </Stack>
                         
                          <Typography sx={{ml:'40px'}}>
                            你有一个新的送入请求
                          </Typography>
                        
                          <Typography sx={{ml:'40px',mt:'10px'}}>
                            2023-11-23
                          </Typography>
                         
                          </Stack>
                      </ListItemButton>
                    </ListItem>
                  </List>
                  <Divider 
                  />
                  </>))}
                </Box>
              </Drawer>
              {selectedItem&&(
                    <Modal open={openModal} onClose={handleCloses} >
                      <RequestForm onClose={handleCloses}selectedItem={selectedItem}/>
                    </Modal>
                  )}
            </Badge>
          </IconButton>
          <IconButton
            aria-controls={open ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <LANGUAGE_ICON />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={anchorEl ? true : false}
            onClose={handleClose}
            TransitionComponent={Fade}
            style={{ padding: "16px" }}
          >
            <MenuItem
              divider={true}
              onClick={() => handleLanguageChange("zhch")}
            >
              <Typography>簡體中文</Typography>
            </MenuItem>
            <MenuItem
              divider={true}
              onClick={() => handleLanguageChange("zhhk")}
            >
              <Typography>繁體中文</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange("enus")}>
              <Typography>English</Typography>
            </MenuItem>
          </Menu>
          <Box sx={{ display: "flex", flexDirection: "row", ml: 3 }}>
            <IconButton>
              <BackgroundLetterAvatars
                name="Cawin Pan"
                backgroundColor="#79ca25"
              />
            </IconButton>
            <Box flexDirection={"column"} sx={{ flex: 3.5, pt: 0.4 }}>
              <Typography sx={{ flex: 1, color: "black", fontWeight: "bold" }}>
                {localStorage.getItem(localStorgeKeyName.username)}
              </Typography>
              <Button
                onClick={() => navigate("/")}
                sx={{
                  flex: 1,
                  color: "black",
                  justifyContent: "flex-start",
                  width: "100%",
                  padding: 0,
                }}
                endIcon={<RIGHT_ARROW_ICON />}
              >
                {t("signOut")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>

    ////</Box>
  );
};

export default MainAppBar;
