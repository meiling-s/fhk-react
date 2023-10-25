import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  DOCUMENT_ICON,
  PLACE_ICON,
  SHIPPING_CAR_ICON,
  STAFF_ICON,
} from "../themes/icons";
import logo_company from "../logo_company.png";
import { useNavigate } from "react-router-dom";

const drawerWidth = 225;


const MainDrawer = () => {
  const navigate = useNavigate();
  let drawerMenus: { name: string; icon: any;onclick:()=>void;}[] = [
    { name: "回收點", icon: <PLACE_ICON />, onclick: () =>  navigate("/homepage")},
    { name: "回收運單", icon: <SHIPPING_CAR_ICON />,onclick: () =>  navigate("/homepage/collectionorder")},
    { name: "報表", icon: <DOCUMENT_ICON />,onclick: () =>  navigate("/homepage") },
    { name: "員工", icon: <STAFF_ICON />,onclick: () =>  navigate("/homepage/staff") },
  ];
  
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          padding: "10px"
        },
      }}
      variant="permanent"
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
          <ListItem sx={{ marginTop: 2 }} key={drawerMenu.name} onClick={drawerMenu.onclick} disablePadding>
            <ListItemButton
                   sx={{
                    '&:hover .MuiSvgIcon-root': {
                      color: '#79ca25' // Change the color to your desired hover color
                    },
                  }}
            >
              <ListItemIcon>{drawerMenu.icon}</ListItemIcon>
              <ListItemText sx={{ marginLeft: -2 }} primary={drawerMenu.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default MainDrawer;
