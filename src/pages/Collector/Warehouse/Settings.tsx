import { FunctionComponent, useCallback, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../../../components/Tabs";
import Warehouse from "./Warehouse";
import Vehicle from "../Vehicles/Vechicles";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import UserAccount from "../UserAccount/UserAccount";
import DenialReason from "../DenialReason/DenialReason";

const Settings: FunctionComponent = () => {
  // const navigate = useNavigate()
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(2);
  const handleTabChange = (value: number, label: string) => {
    console.log(`Navigated to ${value} ${label}`);
    setSelectedTab(value);
  };

  const titlePage = t("settings_page.title");
  const tabSettings = [
    t("top_menu.general_settings"),
    t("top_menu.packaging_unit"),
    t("top_menu.workshop"),
    t("vehicle.vehicle"),
    t("top_menu.staff_positions"),
    t("top_menu.denial_reason"),
    t("userAccount.user"),
  ];

  return (
    <Box className="container-wrapper w-full">
      <div className="settings-page bg-bg-primary">
        <div className="title font-bold text-3xl mb-10">{titlePage}</div>
        <Tabs
          tabs={tabSettings}
          navigate={handleTabChange}
          selectedProp={selectedTab}
          className="lg:px-10 sm:px-4 bg-bg-primary"
        />
        {/* rendering content base on tab index */}
        {selectedTab === 2 ? (
          <Warehouse />
        ) : selectedTab === 3 ? (
          <Vehicle />
        ) : selectedTab === 5 ? (
          <DenialReason />
        ) : selectedTab === 6 ? (
          <UserAccount />
        ) : (
          <div className="p-4 text-center">content not available</div>
        )}
      </div>
    </Box>
  );
};

export default Settings;
