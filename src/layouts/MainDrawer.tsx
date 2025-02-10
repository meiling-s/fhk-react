import { useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

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
  PERSON_OUTLINE_ICON,
} from "../themes/icons";
import logo_company from "../logo_company.png";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Collapse, createTheme } from "@mui/material";
import {
  CalendarTodayOutlined,
  ExpandLess,
  ExpandMore,
  FmdGoodOutlined,
  Login,
  StarBorder,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import "../styles/MainDrawer.css";
import {
  MAINTENANCE_STATUS,
  Realm,
  Roles,
  localStorgeKeyName,
} from "../constants/constant";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import VerticalAlignCenterRoundedIcon from "@mui/icons-material/VerticalAlignCenterRounded";
import InventoryIcon from "@mui/icons-material/Inventory";
import RecyclingIcon from "@mui/icons-material/Recycling";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import ViewQuiltOutlinedIcon from "@mui/icons-material/ViewQuiltOutlined";
import FolderCopyOutlinedIcon from "@mui/icons-material/FolderCopyOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ScreenRotationAltIcon from "@mui/icons-material/ScreenRotationAlt";
import BarChartIcon from "@mui/icons-material/BarChart";
import { dynamicpath, returnApiToken, creatioPageList } from "../utils/utils";
import { useContainer } from "unstated-next";
import NotifContainer from "../contexts/NotifContainer";
import { createUserActivity } from "../APICalls/userAccount";
import axios from "axios";
import { UserActivity } from "../interfaces/common";
import ConfirmModal from "../components/SpecializeComponents/ConfirmationModal";
import { getAllFunction } from "src/APICalls/Collector/userGroup";

type MainDrawer = {
  role: string;
};

type DrawerItem = {
  name: string;
  icon?: JSX.Element;
  onClick: () => void;
  collapse: boolean;
  collapseGroup?: boolean;
  path?: string;
  functionName: string;
  datatestId?: string;
};

type subMenuItem = {
  name: string;
  value: string;
  path: string;
  functionName: string;
};

type functionList = {
  createdAt: string;
  createdBy: string;
  description: string;
  functionId: number;
  functionNameEng: string;
  functionNameSChi: string;
  functionNameTChi: string;
  hasReason: boolean;
  tenantTypeId: string;
  updatedAt: string;
  updatedBy: string;
  version: number;
};
const drawerWidth = 225;

function MainDrawer() {
  const navigate = useNavigate();
  const [dashboardGroup, setDashboardGroup] = useState<boolean>(false);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedIndex, setSelectedIndex] = useState<number | 0>(0);
  const [selectedISubIndex, setSelectedSubIndex] = useState<number | 0>(0);
  const { realmApiRoute, loginId } = returnApiToken();
  const { broadcast, showBroadcast } = useContainer(NotifContainer);
  const ipAddress = localStorage.getItem("ipAddress");
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [drawerMenuToNavigate, setDrawerMenuToNavigate] =
    useState<DrawerItem | null>(null);
  const [currentDrawerMenu, setcurrentDrawerMenu] = useState<number | 0>(0);
  const [subMenuToNavigate, setSubMenuToNavigate] =
    useState<subMenuItem | null>(null);
  const [currentIdxSubMenu, setcurrentIdxSubMenu] = useState<number | 0>(0);
  const restrictPage = creatioPageList();
  const [APIFunctionList, setAllFunction] = useState<functionList[]>([]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  var role = localStorage.getItem(localStorgeKeyName.role);
  var realm = localStorage.getItem(localStorgeKeyName.realm);

  interface func {
    [key: string]: object;
  }

  // 20240129 add function list daniel keung start
  // need to add path & functionName property in order to tracking user activity
  const defaultFunctionList: func[] = [
    {
      "Tenant management": {
        name: t("tenant.company"),
        icon: <FolderCopyOutlinedIcon />,
        onClick: () => navigate("/astd"),
        collapse: false,
        path: "/astd",
        functionName: "Tenant management",
      },
      "User account": {
        name: t("processRecord.userGroup"),
        icon: <PERSON_OUTLINE_ICON />,
        onClick: () => navigate(`/${realm}/account`),
        collapse: false,
        path: `/${realm}/account`,
        datatestId: "astd-user-group-menu-list-6766",
        functionName: "User account",
      },
      "Collection point": {
        name: t("all_Collection_Point"),
        icon: <PLACE_ICON />,
        onClick: async () => navigate("/collector/collectionPoint"),
        collapse: false,
        path: "/collector/collectionPoint",
        functionName: "Collection point",
      },
      "Pickup order": {
        name: t("pick_up_order.pickup_order"),
        icon: <SHIPPING_CAR_ICON />,
        onClick: () => navigate(`/${realm}/pickupOrder`),
        collapse: false,
        path: `/${realm}/pickupOrder`,
        functionName: "Pickup order",
      },
      "process order": {
        name: t("processOrder.title"),
        icon: <RecyclingIcon />,
        onClick: () => navigate(`/${realm}/processOrder`),
        collapse: false,
        path: `/${realm}/processOrder`,
        functionName: "Process order",
      },
      "Purchase order": {
        name: t("purchase_order.enquiry_po"),
        icon: <ShoppingCartOutlinedIcon />,
        onClick: () => navigate(`/${realm}/purchaseOrder`),
        collapse: false,
        path: `/${realm}/purchaseOrder`,
        functionName: "Purchase order",
      },
      "Job order": {
        name: t("job_order.item.detail"),
        icon: <SHIPPING_CAR_ICON />,
        onClick: () => navigate(`/${realm}/jobOrder`),
        collapse: false,
        path: `/${realm}/jobOrder`,
        functionName: "Job order",
      },
      "Vehicle mapping": {
        name: t("common.vehicleRouteTracker"),
        icon: <FmdGoodOutlined />,
        onClick: () => navigate(`/${realm}/vehicleRouteTracker`),
        collapse: false,
        path: `/${realm}/vehicleRouteTracker`,
        functionName: "Vehicle mapping",
      },
      "Schedule board": {
        name: t("common.jobOrderScheduleBoard"),
        icon: <CalendarTodayOutlined />,
        onClick: () => navigate(`/${realm}/jobOrderScheduleBoard`),
        collapse: false,
        path: `/${realm}/jobOrderScheduleBoard`,
        functionName: "Schedule board",
      },
      "Request check-in": {
        name: t("check_in.request_check_in"),
        icon: <LoginIcon />,
        onClick: () => navigate("/warehouse/shipment"),
        collapse: false,
        path: "/warehouse/shipment",
        functionName: "Request check-in",
      },
      "Request checkout": {
        name: t("check_out.request_check_out"),
        icon: <LogoutIcon />,
        onClick: () => navigate("/warehouse/checkout"),
        collapse: false,
        path: "/warehouse/checkout",
        functionName: "Request checkout",
      },
      "Internal transfer request": {
        name: t("internalTransfer.internal_transfer_request"),
        icon: <ScreenRotationAltIcon />,
        onClick: () => navigate("/warehouse/InternalTransferRequest"),
        collapse: false,
        path: "/warehouse/InternalTransferRequest",
        functionName: "Internal transfer request",
      },
      "Check-in and check-out": {
        name: t("checkinandcheckout.checkinandcheckout"),
        icon: <LogoutIcon />,
        onClick: () => navigate(`/${realm}/checkInAndCheckout`),
        collapse: false,
        path: `/${realm}/checkInAndCheckout`,
        functionName: "Check-in and check-out",
      },
      Settings: {
        name: t("settings"),
        icon: <SETTINGS_ICON />,
        onClick: () => navigate("/astd/setting"),
        collapse: false,
        path: "/astd/setting",
        functionName: "Settings",
        datatestId: "astd-menu-list-settings-1869",
      },
      Reports: {
        name: t("reports"),
        icon: <DOCUMENT_ICON />,
        onClick: () => navigate(`/${realm}/report`),
        collapse: false,
        path: `/${realm}/report`,
        functionName: "Reports",
        datatestId: "astd-reports-menu-list-6697",
      },
      "Process out recyclables": {
        name: t("processRecord.processingRecords"),
        icon: <DOCUMENT_ICON />,
        onClick: () => navigate(`/${realmApiRoute}/processRecord`),
        collapse: false,
        path: `/${realmApiRoute}/processRecord`,
        functionName: "Process out recyclables",
      },
      Staff: {
        name: t("staffManagement.staff"),
        icon: <AccountBoxOutlinedIcon />,
        onClick: () => navigate(`/${realm}/staff`),
        collapse: false,
        path: `/${realm}/staff`,
        functionName: "Staff",
      },
      StaffEnquiry: {
        name: t("staffEnquiry.title"),
        icon: <AccountBoxOutlinedIcon />,
        onClick: () => navigate("/warehouse/staff-enquiry"),
        collapse: false,
        path: "/warehouse/staff-enquiry",
        functionName: "StaffEnquiry",
      },
      "Notification template": {
        name: t("notification.notification_menu"),
        icon: <ViewQuiltOutlinedIcon />,
        onClick: () => navigate(`/${realm}/notice`),
        collapse: false,
        path: `/${realm}/notice`,
        functionName: "Notification template",
      },
      Driver: {
        name: t("driver.sideBarName"),
        icon: <SHIPPING_CAR_ICON />,
        onClick: () => navigate("/logistic/driver"),
        collapse: false,
        path: "/logistic/driver",
        functionName: "Driver",
      },
      Dashboard: {
        name: t("dashboard_recyclables.data"),
        icon: <BarChartIcon />,
        onClick: () => setDashboardGroup((prev) => !prev),
        collapse: true,
        collapseGroup: dashboardGroup,
        path: "dashboard_recyclables.data",
        functionName: "Dashboard",
      },
      "Compactor processing": {
        name: t("compactor.compactorTruckHandling"),
        icon: <VerticalAlignCenterRoundedIcon />,
        onClick: () => navigate(`/${realm}/compactorDashboard`),
        collapse: false,
        path: `/${realm}/compactorDashboard`,
        functionName: "Compactor processing",
      },
    },
  ];
  // 20240129 add function list daniel keung end
  // 20240129 add function list daniel keung start
  var drawerMenus;
  let drawerMenusTmp: DrawerItem[] = [];
  var functionListTmp = JSON.parse(
    localStorage.getItem(localStorgeKeyName.functionList) || "[]"
  );
  functionListTmp.sort();
  if (functionListTmp) {
    for (var functionItem of functionListTmp) {
      for (let deKey in defaultFunctionList[0]) {
        if (functionItem == deKey) {
          drawerMenusTmp.push(defaultFunctionList[0][deKey] as DrawerItem);
        }
      }
    }
  }

  //set submenu dashboard
  var subMenuDashboard: any[];
  let subMenuDashboardTmp: subMenuItem[] = [];
  // Base items
  // need to add path & functionName property in order to tracking user activity
  const baseItems = [
    {
      name: "inventory",
      value: t("inventory.inventory"),
      path: `/${realm}/inventory`,
      functionName: "inventory",
    },
    {
      name: "dashboard",
      value:
        realm === Realm.astd
          ? t("dashboard_recyclables.collector")
          : t("dashboard_recyclables.warehouse"),
      path: `/${realm}/dashboard`,
      functionName: "dashboard",
    },
    {
      name: "warehouse",
      value: t("warehouseDashboard.warehouse"),
      path: `/${realm}/warehouse`,
      functionName: "warehouse",
    },
  ];

  // Adjust items based on role
  if (role === "collector" || role === "manufacturer") {
    subMenuDashboardTmp = [...baseItems];
  } else if (role === "astd") {
    subMenuDashboardTmp = [
      ...baseItems,
      {
        name: "globalItemID",
        value: t("globalItemId.globalItemId"),
        path: `/${realm}/globalItemId`,
        functionName: "globalItemId",
      },
      {
        name: "vehicleDashboard",
        value: t("vehicle.vehicle"),
        path: `/${realm}/vehicleDashboard`,
        functionName: "vehicleDashboard",
      },
    ];
  } else if (role === "logistic") {
    subMenuDashboardTmp = [
      {
        name: "vehicleDashboard",
        value: t("vehicle.vehicle"),
        path: `/${realm}/vehicleDashboard`,
        functionName: "vehicleDashboard",
      },
      {
        name: "weightOfRecyclables",
        value: t("dashboard_weight_of_recyclables.record"),
        path: `/logistic/weightOfRecyclables`,
        functionName: "weightOfRecyclables",
      },
    ];
  }

  const previousPath = localStorage.getItem("previousPath");
  const currentPath = window.location.pathname as string;
  const currentMenu = drawerMenusTmp.find((item) => item.path === currentPath);
  const currentSubMenu = subMenuDashboardTmp.find(
    (item) => item.path === currentPath
  );

  if (
    (!previousPath && currentMenu) ||
    (previousPath !== currentPath && currentMenu && ipAddress)
  ) {
    localStorage.setItem("previousPath", currentPath);
    if (ipAddress) {
      const selectedFunction = APIFunctionList.find(
        (value) =>
          value.functionNameEng.toLowerCase() ===
          currentMenu.functionName.toLowerCase()
      );
      const userActivity: UserActivity = {
        operation:
          selectedFunction?.functionNameTChi ?? currentMenu.functionName,
        ip: ipAddress,
        createdBy: loginId,
        updatedBy: loginId,
      };
      createUserActivity(loginId, userActivity);
    }
  } else if (
    (!previousPath && currentSubMenu) ||
    (previousPath !== currentPath && currentSubMenu)
  ) {
    localStorage.setItem("previousPath", currentPath);
    const selectedFunction = APIFunctionList.find(
      (value) =>
        value.functionNameEng.toLowerCase() ===
        currentSubMenu.value.toLowerCase()
    );
    if (ipAddress) {
      const userActivity: UserActivity = {
        operation:
          currentSubMenu.functionName === "vehicleDashboard" ||
          currentSubMenu.functionName === "weightOfRecyclables"
            ? "儀錶板"
            : selectedFunction?.functionNameTChi
            ? selectedFunction?.functionNameTChi
            : currentSubMenu.name === "warehouse"
            ? "概覽"
            : currentSubMenu.name,
        ip: ipAddress,
        createdBy: loginId,
        updatedBy: loginId,
      };
      createUserActivity(loginId, userActivity);
    }
  }

  drawerMenus = drawerMenusTmp;
  subMenuDashboard = subMenuDashboardTmp;

  const getAllUserFunction = async () => {
    const result = await getAllFunction();
    if (result) {
      setAllFunction(result.data);
    }
  };

  useEffect(() => {
    const storedIndex = localStorage.getItem("selectedIndex");
    const selectedIdxCurrentPath = drawerMenusTmp.findIndex(
      (item) => item.path === currentPath
    );
    if (selectedIdxCurrentPath !== -1) {
      setSelectedIndex(selectedIdxCurrentPath);
    } else if (storedIndex !== null) {
      setSelectedIndex(parseInt(storedIndex, 10));
    }
  }, [currentPath, drawerMenusTmp]);

  useEffect(() => {
    getAllUserFunction();
  }, []);

  const handleNavigateMenu = (drawerItem: DrawerItem, index: number) => {
    if (drawerItem.collapse) {
      return drawerItem.onClick();
    }
    if (restrictPage.includes(currentPath)) {
      setOpenConfirmModal(true);
      setDrawerMenuToNavigate(drawerItem);
      setcurrentDrawerMenu(index);
    } else {
      drawerItem.onClick();
      setSelectedIndex(index);
      localStorage.setItem("selectedIndex", String(index));
      setDrawerMenuToNavigate(null);
    }
  };

  const handleSubItemMenu = (item: subMenuItem, index: number) => {
    if (restrictPage.includes(currentPath)) {
      setOpenConfirmModal(true);
      setSubMenuToNavigate(item);
      setcurrentDrawerMenu(index);
    } else {
      navigate(`${realm}/${item.name}`);
      setSelectedSubIndex(index);
    }
  };

  const onConfirmNavigate = () => {
    if (drawerMenuToNavigate) {
      drawerMenuToNavigate.onClick();
      setSelectedIndex(currentDrawerMenu);
      localStorage.setItem("selectedIndex", String(currentDrawerMenu));
      setDrawerMenuToNavigate(null);
      setSelectedSubIndex(0);
      setDashboardGroup(false);
    } else {
      setDashboardGroup(true);
      navigate(`${realm}/${subMenuToNavigate?.name}`);
      setSelectedSubIndex(currentIdxSubMenu);
      setSubMenuToNavigate(null);
    }

    setOpenConfirmModal(false);
  };

  const getMenuActiveColor = () => {
    const color =
      role === "manufacturer"
        ? "#6BC7FF"
        : role === "customer"
        ? "#199BEC"
        : role === "logistic"
        ? "#63D884"
        : role === "collector"
        ? "#79CA25"
        : "#79CA25";

    return color;
  };

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
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            padding: "10px",
            marginTop: `${broadcast && showBroadcast ? "30px" : ""}`,
          },
        }}
        variant={isMobile ? "temporary" : "permanent"}
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
              mt: 2,
            }}
          >
            <img
              src={logo_company}
              alt="logo_company"
              style={{ width: "90px" }}
            />
          </Box>
          {drawerMenus.map((drawerMenu, index) =>
            drawerMenu.collapse ? (
              <>
                <ListItem
                  sx={{
                    marginTop: 2,
                    paddingBottom:
                      index === drawerMenus.length - 1 ? "48px" : "0px",
                  }}
                  key={drawerMenu.name}
                  data-testid={drawerMenu.datatestId || ""}
                  onClick={() => handleNavigateMenu(drawerMenu, index)}
                  disablePadding
                >
                  <ListItemButton
                    selected={selectedIndex === index}
                    sx={{
                      "&:hover": {
                        ".MuiSvgIcon-root": {
                          color: getMenuActiveColor(),
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color:
                          selectedIndex === index ? getMenuActiveColor() : "",
                      }}
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
                      subMenuDashboard.map((item, subMenuIndex) => {
                        return (
                          <ListItemButton
                            key={subMenuIndex}
                            sx={{ pl: 7 }}
                            selected={true}
                            onClick={() => {
                              handleSubItemMenu(item, subMenuIndex);
                            }}
                          >
                            <ListItemText
                              className={
                                subMenuIndex === selectedISubIndex
                                  ? `text-[${getMenuActiveColor()}]`
                                  : ""
                              }
                              primary={item.value}
                            />
                          </ListItemButton>
                        );
                      })}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem
                sx={{
                  marginTop: 2,
                  paddingBottom:
                    index === drawerMenus.length - 1 ? "48px" : "0px",
                }}
                key={index}
                data-testid={drawerMenu.datatestId || ""}
                onClick={() => handleNavigateMenu(drawerMenu, index)}
                disablePadding
              >
                <ListItemButton
                  selected={selectedIndex === index}
                  sx={{
                    "&:hover": {
                      ".MuiSvgIcon-root": {
                        color: getMenuActiveColor(),
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color:
                        selectedIndex === index ? getMenuActiveColor() : "",
                    }}
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
          <ConfirmModal
            isOpen={openConfirmModal}
            onConfirm={() => onConfirmNavigate()}
            onCancel={() => setOpenConfirmModal(false)}
          />
        </List>
      </Drawer>
    </>
  );
}

const styles = {
  drawerSubItem: {
    ml: 3,
    pl: 3,
    borderLeft: 3,
    borderLeftColor: "#F4F4F4",
  },
};

export default MainDrawer;
