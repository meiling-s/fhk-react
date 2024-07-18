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
  PERSON_ICON,
  PERSON_OUTLINE_ICON
} from '../themes/icons'
import logo_company from '../logo_company.png'
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { Collapse, createTheme } from '@mui/material'
import { ExpandLess, ExpandMore, Login, StarBorder } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import '../styles/MainDrawer.css'
import { MAINTENANCE_STATUS, Realm, Roles, localStorgeKeyName } from '../constants/constant'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import InventoryIcon from '@mui/icons-material/Inventory'
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined'
import ViewQuiltOutlinedIcon from '@mui/icons-material/ViewQuiltOutlined'
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import BarChartIcon from '@mui/icons-material/BarChart'
import { dynamicpath, returnApiToken } from '../utils/utils'
import { useContainer } from 'unstated-next'
import NotifContainer from '../contexts/NotifContainer'
import { createUserActivity } from '../APICalls/userAccount'
import axios from 'axios'
import { UserActivity } from '../interfaces/common'

type MainDrawer = {
  role: string
}

type DrawerItem = {
  name: string
  icon?: JSX.Element
  onClick: () => void
  collapse: boolean
  collapseGroup?: boolean
  path?: string,
  functionName: string,
}

const drawerWidth = 225

function MainDrawer() {
  const navigate = useNavigate()
  const [CPDrawer, setCPDrawer] = useState<boolean>(false) //CP = collection point, this state determine collection point drawer group expand or not
  const [ASTDStatsDrawer, setASTDStatsDrawer] = useState<boolean>(false)
  const [WHManageDrawer, setWHManageDrawer] = useState<boolean>(false)
  const [dashboardGroup, setDashboardGroup] = useState<boolean>(false)
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [selectedIndex, setSelectedIndex] = useState<number | 0>(0)
  const [selectedISubIndex, setSelectedSubIndex] = useState<number | 0>(0)
  const { realmApiRoute, loginId } = returnApiToken()
  const { broadcast, showBroadcast } =  useContainer(NotifContainer);
  const ipAddress = localStorage.getItem('ipAddress');

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index)
    localStorage.setItem('selectedIndex', String(index))
    setSelectedSubIndex(0)
    setDashboardGroup(false)
  }

  useEffect(() => {
    // Retrieve the selected index from localStorage on component mount
    const storedIndex = localStorage.getItem('selectedIndex')
    if (storedIndex !== null) {
      setSelectedIndex(parseInt(storedIndex, 10))
    }
  }, [])

  var role = localStorage.getItem(localStorgeKeyName.role)
  var realm = localStorage.getItem(localStorgeKeyName.realm)

  interface func {
    [key: string]: object
  }

  // 20240129 add function list daniel keung start
  // need to add path & functionName property in order to tracking user activity
  const defaultFunctionList: func[] = [
    {
      'Tenant management': {
        name: t('tenant.company'),
        icon: <FolderCopyOutlinedIcon />,
        onClick: () => navigate('/astd'),
        collapse: false,
        path: '/astd',
        functionName: 'Tenant management'
      },
      'User account': {
        name: t('processRecord.userGroup'),
        icon: <PERSON_OUTLINE_ICON />,
        onClick: () => navigate(`/${realm}/account`),
        collapse: false,
        path: `/${realm}/account`,
        functionName: 'User account'
      },
      'Collection point': {
        name: t('all_Collection_Point'),
        icon: <PLACE_ICON />,
        onClick:async () => navigate('/collector/collectionPoint'),
        collapse: false,
        path: '/collector/collectionPoint',
        functionName: 'Collection point'
      },
      'Pickup order': {
        name: t('pick_up_order.pickup_order'),
        icon: <SHIPPING_CAR_ICON />,
        onClick: () => navigate(`/${realm}/pickupOrder`),
        collapse: false,
        path: `/${realm}/pickupOrder`,
        functionName: 'Pickup order'
      },
      'Purchase order': {
        name: t('purchase_order.enquiry_po'),
        icon: <ShoppingCartOutlinedIcon />,
        onClick: () => navigate(`/${realm}/purchaseOrder`),
        collapse: false,
        path: `/${realm}/purchaseOrder`,
        functionName: 'Purchase order'
      },
      'Job order': {
        name: t('job_order.item.detail'),
        icon: <SHIPPING_CAR_ICON />,
        onClick: () => navigate(`/${realm}/jobOrder`),
        collapse: false,
        path: `/${realm}/jobOrder`,
        functionName: 'Job order'
      },
      'Request check-in': {
        name: t('check_in.request_check_in'),
        icon: <LoginIcon />,
        onClick: () => navigate('/warehouse/shipment'),
        collapse: false,
        path: '/warehouse/shipment',
        functionName: 'Request check-in'
      },
      'Request checkout': {
        name: t('check_out.request_check_out'),
        icon: <LogoutIcon />,
        onClick: () => navigate('/warehouse/checkout'),
        collapse: false,
        path: '/warehouse/checkout',
        functionName: 'Request checkout'
      },
      'Check-in and check-out': {
        name: t('checkinandcheckout.checkinandcheckout'),
        icon: <LogoutIcon />,
        onClick: () => navigate(`/${realm}/checkInAndCheckout`),
        collapse: false,
        path: `/${realm}/checkInAndCheckout`,
        functionName: 'Check-in and check-out'
      },
      Settings: {
        name: t('settings'),
        icon: <SETTINGS_ICON />,
        onClick: () => navigate('/astd/setting'),
        collapse: false,
        path: '/astd/setting',
        functionName: 'Settings'
      },
      Reports: {
        name: t('reports'),
        icon: <DOCUMENT_ICON />,
        onClick: () => navigate(`/${realm}/report`),
        collapse: false,
        path: `/${realm}/report`,
        functionName: 'Reports'
      },
      'Process out recyclables': {
        name: t('processRecord.processingRecords'),
        icon: <DOCUMENT_ICON />,
        onClick: () => navigate(`/${realmApiRoute}/processRecord`),
        collapse: false,
        path: `/${realmApiRoute}/processRecord`,
        functionName: 'Process out recyclables'
      },
      Staff: {
        name: t('staffManagement.staff'),
        icon: <AccountBoxOutlinedIcon />,
        onClick: () => navigate(`/${realm}/staff`),
        collapse: false,
        path: `/${realm}/staff`,
        functionName: 'Staff'
      },
      StaffEnquiry: {
        name: t('staffEnquiry.title'),
        icon: <AccountBoxOutlinedIcon />,
        onClick: () => navigate('/warehouse/staff-enquiry'),
        collapse: false,
        path: '/warehouse/staff-enquiry',
        functionName: 'StaffEnquiry'
      },
      'Notification template': {
        name: t('notification.notification_menu'),
        icon: <ViewQuiltOutlinedIcon />,
        onClick: () =>  navigate(`/${realm}/notice`),
        collapse: false,
        path: `/${realm}/notice`,
        functionName: 'Notification template'
      },
      Driver: {
        name: t('driver.sideBarName'),
        icon: <SHIPPING_CAR_ICON />,
        onClick: () => navigate('/logistic/driver'),
        collapse: false,
        path: '/logistic/driver',
        functionName: 'Driver'
      },
      Dashboard: {
        name: t('dashboard_recyclables.data'),
        icon: <BarChartIcon />,
        onClick: () => setDashboardGroup((prev) => !prev),
        collapse: true,
        collapseGroup: dashboardGroup,
        path: 'dashboard_recyclables.data',
        functionName: 'Dashboard'
      }
    }
  ]
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
  var drawerMenus
  let drawerMenusTmp: DrawerItem[] = []
  var functionListTmp = JSON.parse(
    localStorage.getItem(localStorgeKeyName.functionList) || '[]'
  )
  functionListTmp.sort()
  if (functionListTmp) {
    for (var functionItem of functionListTmp) {
      for (let deKey in defaultFunctionList[0]) {
        if (functionItem == deKey) {
          drawerMenusTmp.push(defaultFunctionList[0][deKey] as DrawerItem)
        }
      }
    }
  }

  //set submenu dashboard
  var subMenuDashboard: any[]
  let subMenuDashboardTmp: { name: string; value: string, path: string, functionName: string }[] = []
  // Base items
  // need to add path & functionName property in order to tracking user activity
  const baseItems = [
    {
      name: 'inventory',
      value: t('inventory.inventory'),
      path: `/${realm}/inventory`,
      functionName: 'inventory'
    },
    {
      name: 'dashboard',
      value:
        realm === Realm.astd
          ? t('dashboard_recyclables.collector')
          : t('dashboard_recyclables.recyclable'),
      path: `/${realm}/dashboard`,
      functionName: 'dashboard'
    },
    {
      name: 'warehouse',
      value: t('warehouseDashboard.warehouse'),
      path: `/${realm}/warehouse`,
      functionName: 'warehouse'
    }
  ]

  // Adjust items based on role
  if (role === 'collector' || role === 'manufacturer') {
    subMenuDashboardTmp = [...baseItems]
  } else if (role === 'astd') {
    subMenuDashboardTmp = [
      ...baseItems,
      {
        name: 'vehicleDashboard',
        value: t('vehicle.vehicle'),
        path: `/${realm}/vehicleDashboard`,
        functionName: 'vehicleDashboard'
      }
    ]
  } else if (role === 'logistic') {
    subMenuDashboardTmp = [
      {
        name: 'vehicleDashboard',
        value: t('vehicle.vehicle'),
        path: `/${realm}/vehicleDashboard`,
        functionName: 'vehicleDashboard'
      }
    ]
  }

  const previousPath = localStorage.getItem('previousPath');
  const currentPath = window.location.pathname as string
  const currentMenu = drawerMenusTmp.find((item) => item.path === currentPath );
  const currentSubMenu = subMenuDashboardTmp.find(item => item.path === currentPath);
  
  if((!previousPath && currentMenu) || (previousPath !== currentPath && currentMenu && ipAddress)) {
    localStorage.setItem('previousPath', currentPath)
    if(ipAddress){
      const userActivity:UserActivity = {
        operation: currentMenu.functionName,
        ip: ipAddress,
        createdBy: loginId,
        updatedBy: loginId
      }
      createUserActivity(loginId, userActivity)
    }
  } else if((!previousPath && currentSubMenu) || (previousPath !== currentPath && currentSubMenu)) {
    localStorage.setItem('previousPath', currentPath);
    if(ipAddress){
      const userActivity:UserActivity = {
        operation: currentSubMenu.functionName,
        ip: ipAddress,
        createdBy: loginId,
        updatedBy: loginId
      }
      createUserActivity(loginId, userActivity)
    }
  }

  // 20240129 add function list daniel keung end
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
  drawerMenus = drawerMenusTmp
  subMenuDashboard = subMenuDashboardTmp
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
            padding: '10px',
            marginTop: `${broadcast && showBroadcast ? '30px' : ''}`
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
              <>
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
                          color: role === 'manufacturer' ? '#6BC7FF' : role === 'customer' ? "#199BEC" : role === 'logistic' ? '#63D884' : role === 'collector' ? '#79CA25' : '#79CA25'
                        }
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{color: selectedIndex === index ? role === 'manufacturer' ? '#6BC7FF' : role === 'customer' ? "#199BEC" : role === 'logistic' ? '#63D884' : role === 'collector' ? '#79CA25' : '#79CA25' : ''}}
                    >
                      {drawerMenu.icon}
                    </ListItemIcon>
                    <ListItemText 
                      sx={{ marginLeft: -2 }}
                      primary={drawerMenu.name}
                    />
                  </ListItemButton>
                </ListItem>
                <Collapse in={dashboardGroup} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {subMenuDashboard &&
                      subMenuDashboard.length > 0 &&
                      subMenuDashboard.map((item, index) => {
                        return (
                          <ListItemButton
                            key={index}
                            sx={{ pl: 7 }}
                            selected={true}
                            onClick={() => {
                              navigate(`${realm}/${item.name}`)
                              setSelectedSubIndex(index)
                            }}
                          >
                            <ListItemText
                              className={
                                index === selectedISubIndex
                                  ? 'text-menu-active'
                                  : ''
                              }
                              sx={{color: role === 'manufacturer' ? '#6BC7FF' : role === 'customer' ? "#199BEC" : role === 'logistic' ? '#63D884' : role === 'collector' ? '#79CA25' : '#79CA25'}}
                              primary={item.value}
                            />
                          </ListItemButton>
                        )
                      })}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem
                sx={{ marginTop: 2 }}
                key={index}
                onClick={drawerMenu.onClick}
                disablePadding
              >
                <ListItemButton
                  selected={selectedIndex === index}
                  onClick={(event) => handleListItemClick(index)}
                  sx={{
                    '&:hover': {
                      '.MuiSvgIcon-root': {
                        color: role === 'manufacturer' ? '#6BC7FF' : role === 'customer' ? "#199BEC" : role === 'logistic' ? '#63D884' : role === 'collector' ? '#79CA25' : '#79CA25'
                      }
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{color: selectedIndex === index ? role === 'manufacturer' ? '#6BC7FF' : role === 'customer' ? "#199BEC" : role === 'logistic' ? '#63D884' : role === 'collector' ? '#79CA25' : '#79CA25' : ''}}
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
