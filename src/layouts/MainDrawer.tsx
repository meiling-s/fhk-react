import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import {
  DOCUMENT_ICON,
  FOLDER_ICON,
  PLACE_ICON,
  SHIPPING_CAR_ICON,
  STAFF_ICON,
  SETTINGS_ICON,
  INBOX_OUTLINE_ICON
} from "../themes/icons";
import logo_company from "../logo_company.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Collapse, createTheme } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import '../styles/MainDrawer.css';




type MainDrawer = {
  role: string;
}

type DrawerItem = {
  name: string,
  icon?: JSX.Element,
  onClick: () => void,
  collapse: boolean,
  collapseGroup?: boolean
}

const drawerWidth = 225;

function MainDrawer() {

  const navigate = useNavigate();
  const [CPDrawer, setCPDrawer] = useState<boolean>(false);   //CP = collection point, this state determine collection point drawer group expand or not
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedIndex, setSelectedIndex] = useState<number | 0>(0);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };


  var role = "warehouse";

  let drawerMenus_collector: DrawerItem[] = [
    { name: t('collection_Point'), icon: <PLACE_ICON />, onClick: () =>  setCPDrawer(!CPDrawer), collapse: false, collapseGroup: CPDrawer },
    { name: t('all_Collection_Point'), onClick: () =>  navigate("/collector/collectionPoint"), collapse: true, collapseGroup: CPDrawer },
    { name: t('process_Records'), onClick: () =>  navigate("/collector/processRecord"), collapse: true, collapseGroup: CPDrawer },
    { name: t('recycle_Shipment'), icon: <SHIPPING_CAR_ICON />,onClick: () =>  navigate("/collector/shipment"), collapse: false },
    { name: t('reports'), icon: <DOCUMENT_ICON />,onClick: () =>  navigate("/collector/report"), collapse: false },
    { name: t('staff'), icon: <STAFF_ICON />,onClick: () =>  navigate("/collector/staff"), collapse: false },
    { name: t('settings'), icon: <SETTINGS_ICON />,onClick: () =>  navigate("/warehouse/settings"), collapse: false },
  ];

  let drawerMenus_astd: DrawerItem[] = [
    { name: t('company'), icon: <FOLDER_ICON />, onClick: () =>  navigate("/astd"), collapse: false },
    { name: t('collection_Point'), icon: <PLACE_ICON />, onClick: () =>  navigate("/astd/collectionPoint"), collapse: false },
    { name: t('recycle_Shipment'), icon: <SHIPPING_CAR_ICON />,onClick: () =>  navigate("/astd/collectionorder"), collapse: false },
    { name: t('reports'), icon: <DOCUMENT_ICON />,onClick: () =>  navigate("/astd/report"), collapse: false },
    { name: t('staff'), icon: <STAFF_ICON />,onClick: () =>  navigate("/astd/staff"), collapse: false },
    { name: t('settings'), icon: <SETTINGS_ICON />,onClick: () =>  navigate("/warehouse/settings"), collapse: false },
  ];

  let drawerMenus_warehouse: DrawerItem[] = [
    { name: t('recycle_Shipment'), icon: <SHIPPING_CAR_ICON />, onClick: () =>  navigate("/warehouse/shipment"), collapse: false },
    { name: t('collection_Point'), icon: <INBOX_OUTLINE_ICON />, onClick: () =>  navigate("/warehouse/overview"), collapse: false },
    { name: t('reports'), icon: <DOCUMENT_ICON />,onClick: () =>  navigate("/warehouse/process"), collapse: false },
    { name: t('staff'), icon: <STAFF_ICON />,onClick: () =>  navigate("/warehouse/staff"), collapse: false },
    { name: t('settings'), icon: <SETTINGS_ICON />,onClick: () =>  navigate("/warehouse/settings"), collapse: false },
  ];

  var drawerMenus;

  switch(role){
    case "warehouse":
      drawerMenus = drawerMenus_astd;
      break;
    case "collector":
      drawerMenus = drawerMenus_collector;
      break;
    case "warehouse":
      drawerMenus = drawerMenus_warehouse;
      break;
    default:
      drawerMenus = drawerMenus_astd;
  }
  
  return (
    <>
      {isMobile ? (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={open ? handleDrawerClose : handleDrawerOpen}
        >
          <MenuIcon  className="menu-button" />
        </IconButton>
      ) : null}
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          padding: "10px"
        },
      }}
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={handleDrawerClose}
      anchor="left"
    >
      <List>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt:2
          }}
        >
          <img src={logo_company} alt="logo_company" style={{width:'90px'}} />
        </Box>
        {drawerMenus.map((drawerMenu, index) => (
          drawerMenu.collapse?
            <Collapse sx={[styles.drawerSubItem]} in={drawerMenu.collapseGroup} timeout="auto" unmountOnExit>
              <ListItem sx={{ marginTop: 2 }} 
                key={drawerMenu.name} onClick={drawerMenu.onClick}  selected={selectedIndex === index} disablePadding>
                <ListItemButton
                      sx={{
                        '&:hover .MuiSvgIcon-root': {
                          color: '#79ca25'
                        },
                      }}
                      selected={selectedIndex === index}
                      onClick={(event) => handleListItemClick(index)}
                >
                  <ListItemText sx={{ marginLeft: -2 }} primary={drawerMenu.name} />
                </ListItemButton>
              </ListItem>
            </Collapse> :
            <ListItem sx={{ marginTop: 2 }} key={drawerMenu.name} onClick={drawerMenu.onClick} disablePadding>
              <ListItemButton
              selected={selectedIndex === index}
              onClick={(event) => handleListItemClick(index)}
              sx={{
                '&:hover': {
                  '.MuiSvgIcon-root': {
                    color: '#79ca25', // Change color on hover
                  },
                },
              }}
              >
                <ListItemIcon  className={selectedIndex === index ? 'icon-menu-active' : ''}>{drawerMenu.icon}</ListItemIcon>
                <ListItemText sx={{ marginLeft: -2 }} primary={drawerMenu.name} />
                {(drawerMenu.collapseGroup!=undefined)&& (drawerMenu.collapseGroup ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
        ))}
      </List>
    </Drawer>
    </>
  );
};

const styles = {
  drawerSubItem: {
    ml: 3,
    pl: 3,
    borderLeft: 3,
    borderLeftColor: "#F4F4F4"
  }
}

export default MainDrawer;
