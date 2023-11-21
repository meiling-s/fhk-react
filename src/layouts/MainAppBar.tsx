import {
  AppBar,
  Box,
  Button,
  Fade,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const MainAppBar = () => {

  const [keywords, setKeywords] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const drawerWidth = 246;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
 
  const handleLanguageChange = (lng: string) => {
    console.log("change language: ",lng);
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

  return (
    //<Box flexDirection={"row"} sx={{ flexGrow: 1 }}>
      <AppBar
        elevation={5}
        position="fixed"
        sx={{ width: `calc(100% - ${isMobile? 0 :drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar style={{ background: "white"}} sx={{height:{sm:'100px',lg:'64px'}}}>
          <Box display="flex" sx={{ ml: 5 ,width:{sm:'50%',lg:'20%'}}}>
            
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex" }}>
            <IconButton>
              <NOTIFICATION_ICON />
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
              open={anchorEl? true : false}
              onClose={handleClose}
              TransitionComponent={Fade}
              style={{padding:'16px'}}
            >
              <MenuItem divider={true} onClick={() => handleLanguageChange('zhch')}><Typography >簡體中文</Typography></MenuItem>
              <MenuItem divider={true}onClick={() => handleLanguageChange('zhhk')}><Typography>繁體中文</Typography></MenuItem>
              <MenuItem onClick={() => handleLanguageChange('enus')}><Typography>English</Typography></MenuItem>
            </Menu>
            <Box sx={{ display: "flex", flexDirection: "row", ml: 3 }}>
              <IconButton>
                <BackgroundLetterAvatars name="Cawin Pan" backgroundColor='#79ca25'/>
              </IconButton>
              <Box flexDirection={"column"} sx={{ flex: 3.5, pt: 0.4 }}>
                <Typography
                  sx={{ flex: 1, color: "black", fontWeight: "bold" }}
                >
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
                  {t('signOut')}
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
