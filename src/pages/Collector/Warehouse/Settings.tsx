import { FunctionComponent, useCallback, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../../../components/Tabs";
import Warehouse from "./Warehouse";
import Vehicle from "../Vehicles/Vechicles";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
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
    t("top_menu.vehicles"),
    t("top_menu.company"),
    t("top_menu.waste_disposal"),
    t("top_menu.staff_positions"),
    t("top_menu.denial_reason"),
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
        {selectedTab === 0 ? (
          <></>
        ) : selectedTab === 1 ? (
          <></>
        ) : selectedTab === 2 ? (
          <Warehouse />
        ) :  selectedTab === 3 ? (
          <Vehicle />
        ) : selectedTab === 4 ? (
          <></>
        ) : selectedTab === 5 ? (
          <></>
        ) : selectedTab === 6 ? (
          <></>
        ) : selectedTab === 7 ? (
          <DenialReason />
        ) : (
          <div className="p-4 text-center">content not available</div>
        )}
      </div>
    </Box>
  );
};

export default Settings;
