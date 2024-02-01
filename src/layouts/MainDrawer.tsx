import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'

import {
  DOCUMENT_ICON,
  FOLDER_ICON,
  PLACE_ICON,
  SHIPPING_CAR_ICON,
  STAFF_ICON,
  SETTINGS_ICON,
  INBOX_OUTLINE_ICON,
  TEMPLATE_ICON,
  STATISTIC_ICON,
  PERSON_ICON
} from '../themes/icons'
import logo_company from '../logo_company.png'
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { Collapse, createTheme } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import '../styles/MainDrawer.css'
import { localStorgeKeyName } from '../constants/constant'

type MainDrawer = {
  role: string
}

type DrawerItem = {
  name: string
  icon?: JSX.Element
  onClick: () => void
  collapse: boolean
  collapseGroup?: boolean
}

const drawerWidth = 225

function MainDrawer() {
  const navigate = useNavigate()
  const [CPDrawer, setCPDrawer] = useState<boolean>(false) //CP = collection point, this state determine collection point drawer group expand or not
  const [ASTDStatsDrawer, setASTDStatsDrawer] = useState<boolean>(false)
  const [WHManageDrawer, setWHManageDrawer] = useState<boolean>(false)
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [selectedIndex, setSelectedIndex] = useState<number | 0>(0)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index)
    localStorage.setItem('selectedIndex', String(index))
  }

  useEffect(() => {
    // Retrieve the selected index from localStorage on component mount
    const storedIndex = localStorage.getItem('selectedIndex')
    if (storedIndex !== null) {
      setSelectedIndex(parseInt(storedIndex, 10))
    }
  }, [])

  var role = localStorage.getItem(localStorgeKeyName.role)
  
  interface func {
    [key: string]: object;
  }

  // 20240129 add function list daniel keung start 
  const defaultFunctionList: func[] = [{
    "Tenant management": {
      name: t('all_Collection_Point'),
      onClick: () => navigate('/collector/collectionPoint'),
      collapse: false
    },
    "Collection point": {
      name: t('all_Collection_Point'),
      onClick: () => navigate('/collector/collectionPoint'),
      collapse: false
    },
    "Pickup order": {
      name: t('pick_up_order.enquiry_pickup_order'),
      onClick: () => navigate('/collector/pickupOrder'),
      collapse: false
    },
    "Request check-in": {
      name: t('check_in.request_check_in'),
      onClick: () => navigate('/warehouse/shipment'),
      collapse: false
    },
    "Request checkout": {
      name: t('check_out.request_check_out'),
      onClick: () => navigate('/warehouse/overview'),
      collapse: false
    },
    "Warehouse": {
      name: t('settings'),
      icon: <SETTINGS_ICON />,
      onClick: () => navigate('/astd/setting'),
      collapse: false
    },
    "Vehicles": {
      name: t('vehicle.vehicle'),
      onClick: () => navigate('/warehouse/setting'),
      collapse: false
    },
    "Reports": {
      name: t('all_Collection_Point'),
      onClick: () => navigate('/collector/collectionPoint'),
      collapse: false
    },
    "Inventory": {
      name: t('all_Collection_Point'),
      onClick: () => navigate('/collector/collectionPoint'),
      collapse: false
    },
  }]
  // 20240129 add function list daniel keung end 
  // 20240129 add function list daniel keung start
/*   let drawerMenus_collector: DrawerItem[] = [
    {
      name: t('collection_Point'),
      icon: <PLACE_ICON />,
      onClick: () => setCPDrawer(!CPDrawer),
      collapse: false,
      collapseGroup: CPDrawer
    },
    {
      name: t('all_Collection_Point'),
      onClick: () => navigate('/collector/collectionPoint'),
      collapse: true,
      collapseGroup: CPDrawer
    },
    {
      name: t('process_Records'),
      onClick: () => navigate('/collector/processRecord'),
      collapse: true,
      collapseGroup: CPDrawer
    },
    {
      name: t('recycle_Shipment'),
      icon: <SHIPPING_CAR_ICON />,
      onClick: () => navigate('/collector/pickupOrder'),
      collapse: false
    },
    {
      name: t('reports'),
      icon: <DOCUMENT_ICON />,
      onClick: () => navigate('/collector/report'),
      collapse: false
    },
    {
      name: t('staff'),
      icon: <STAFF_ICON />,
      onClick: () => navigate('/collector/staff'),
      collapse: false
    }
  ]

  let drawerMenus_astd: DrawerItem[] = [
    {
      name: t('company'),
      icon: <FOLDER_ICON />,
      onClick: () => navigate('/astd'),
      collapse: false
    },
    {
      name: t('noticeTemplate'),
      icon: <TEMPLATE_ICON />,
      onClick: () => navigate('/astd/notice'),
      collapse: false
    },
    {
      name: t('reports'),
      icon: <DOCUMENT_ICON />,
      onClick: () => navigate('/astd/report'),
      collapse: false
    },
    {
      name: t('statistics'),
      icon: <STATISTIC_ICON />,
      onClick: () => setASTDStatsDrawer(!ASTDStatsDrawer),
      collapse: false,
      collapseGroup: ASTDStatsDrawer
    },
    {
      name: t('recyclables'),
      onClick: () => navigate('/astd/statistics/recyclables'),
      collapse: true,
      collapseGroup: ASTDStatsDrawer
    },
    {
      name: t('convoy'),
      onClick: () => navigate('/astd/statistics/convoy'),
      collapse: true,
      collapseGroup: ASTDStatsDrawer
    },
    {
      name: t('recycleCompany'),
      onClick: () => navigate('/astd/statistics/recycleCompany'),
      collapse: true,
      collapseGroup: ASTDStatsDrawer
    },
    {
      name: t('recyclePlant'),
      onClick: () => navigate('/astd/statistics/recyclePlant'),
      collapse: true,
      collapseGroup: ASTDStatsDrawer
    },
    {
      name: t('settings'),
      icon: <SETTINGS_ICON />,
      onClick: () => navigate('/astd/setting'),
      collapse: false
    },
    {
      name: t('account'),
      icon: <PERSON_ICON />,
      onClick: () => navigate('/astd/account'),
      collapse: false
    }
  ]

  let drawerMenus_warehouse: DrawerItem[] = [
    {
      name: t('recycle_Shipment'),
      icon: <SHIPPING_CAR_ICON />,
      onClick: () => navigate('/warehouse/shipment'),
      collapse: false
    },
    {
      name: t('manage'),
      icon: <INBOX_OUTLINE_ICON />,
      onClick: () => setWHManageDrawer(!WHManageDrawer),
      collapse: false,
      collapseGroup: WHManageDrawer
    },
    {
      name: t('overView'),
      onClick: () => navigate('/warehouse/overview'),
      collapse: true,
      collapseGroup: WHManageDrawer
    },
    {
      name: t('reports'),
      onClick: () => navigate('/warehouse/process'),
      collapse: true,
      collapseGroup: WHManageDrawer
    },
    {
      name: t('staff'),
      icon: <STAFF_ICON />,
      onClick: () => navigate('/warehouse/staff'),
      collapse: false
    }
  ]

  let drawerMenus_collectorAdmin: DrawerItem[] = [
    {
      name: t('all_Collection_Point'),
      onClick: () => navigate('/collector/collectionPoint'),
      collapse: false
    },
    {
      name: t('check_in.request_check_in'),
      onClick: () => navigate('/warehouse/shipment'),
      collapse: false
    },
    {
      name: t('check_out.request_check_out'),
      onClick: () => navigate('/warehouse/overview'),
      collapse: false
    },
    {
      name: t('pick_up_order.enquiry_pickup_order'),
      onClick: () => navigate('/collector/pickupOrder'),
      collapse: false
    },
    {
      name: t('settings'),
      icon: <SETTINGS_ICON />,
      onClick: () => navigate('/astd/setting'),
      collapse: false
    }
  ] */
  // 20240129 add function list daniel keung end
  // 20240129 add function list daniel keung start 
  var drawerMenus;
  let drawerMenusTmp: DrawerItem[] = [];
  var functionListTmp = JSON.parse(localStorage.getItem(localStorgeKeyName.functionList)||"[]");
  if(functionListTmp){
    for (var functionItem of functionListTmp) {
      for (let deKey in defaultFunctionList[0]) {
        if(functionItem == deKey){
          drawerMenusTmp.push(defaultFunctionList[0][deKey] as DrawerItem)
        }
      }
    }
  }
  // 20240129 add function list daniel keung end 
  console.log(role)
  // 20240129 add function list daniel keung start
/*   switch (role) {
    case 'astd':
      drawerMenus = drawerMenus_astd
      break
    case 'collector':
      drawerMenus = drawerMenus_collector
      break
    case 'warehouse':
      drawerMenus = drawerMenus_warehouse
      break
    case 'collectoradmin':
      drawerMenus = drawerMenus_collectorAdmin
      break
    case 'ckadm01':
      drawerMenus = drawerMenus_collectorAdmin
      break
    case 'oriontadmin':
      drawerMenus = drawerMenus_collectorAdmin
      break
    default:
      drawerMenus = drawerMenus_astd
  } */
  // 20240129 add function list daniel keung end
  // 20240129 add function list daniel keung start
  drawerMenus = drawerMenusTmp;
  // 20240129 add function list daniel keung end 
  return (
    <>
      {isMobile ? (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={open ? handleDrawerClose : handleDrawerOpen}
        >
          <MenuIcon className="menu-button" />
        </IconButton>
      ) : null}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            padding: '10px'
          }
        }}
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? open : true}
        onClose={handleDrawerClose}
        anchor="left"
      >
        <List>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 2
            }}
          >
            <img
              src={logo_company}
              alt="logo_company"
              style={{ width: '90px' }}
            />
          </Box>
          {drawerMenus.map((drawerMenu, index) =>
            drawerMenu.collapse ? (
              <Collapse
                key={index}
                sx={[styles.drawerSubItem]}
                in={drawerMenu.collapseGroup}
                timeout="auto"
                unmountOnExit
              >
                <ListItem
                  sx={{ marginTop: 2 }}
                  key={drawerMenu.name}
                  onClick={drawerMenu.onClick}
                  selected={selectedIndex === index}
                  disablePadding
                >
                  <ListItemButton
                    sx={{
                      '&:hover .MuiSvgIcon-root': {
                        color: '#79ca25'
                      }
                    }}
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemClick(index)}
                  >
                    <ListItemText
                      sx={{ marginLeft: -2 }}
                      primary={drawerMenu.name}
                    />
                  </ListItemButton>
                </ListItem>
              </Collapse>
            ) : (
              <ListItem
                sx={{ marginTop: 2 }}
                key={drawerMenu.name}
                onClick={drawerMenu.onClick}
                disablePadding
              >
                <ListItemButton
                  selected={selectedIndex === index}
                  onClick={(event) => handleListItemClick(index)}
                  sx={{
                    '&:hover': {
                      '.MuiSvgIcon-root': {
                        color: '#79ca25' // Change color on hover
                      }
                    }
                  }}
                >
                  <ListItemIcon
                    className={
                      selectedIndex === index ? 'icon-menu-active' : ''
                    }
                  >
                    {drawerMenu.icon}
                  </ListItemIcon>
                  <ListItemText
                    sx={{ marginLeft: -2 }}
                    primary={drawerMenu.name}
                  />
                  {drawerMenu.collapseGroup != undefined &&
                    (drawerMenu.collapseGroup ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    ))}
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Drawer>
    </>
  )
}

const styles = {
  drawerSubItem: {
    ml: 3,
    pl: 3,
    borderLeft: 3,
    borderLeftColor: '#F4F4F4'
  }
}

export default MainDrawer
