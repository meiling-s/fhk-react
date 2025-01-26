import { FunctionComponent, useState } from "react";
import Tabs from "../../../components/Tabs";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import BasicServicePicture from "../../Collector/EventRecording/BasicServicePict";
import AdditionalServicePict from "../../Collector/EventRecording/AdditionalServicePict";
import OtherPict from "../../Collector/EventRecording/OtherPict";
import DownloadArea from "../DownloadArea/DownloadArea";
import { Roles, localStorgeKeyName } from "../../../constants/constant";

const Report: FunctionComponent = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);
  const role = localStorage.getItem(localStorgeKeyName.role) || "";

  const handleTabChange = (value: number) => {
    setSelectedTab(value);
  };

  const titlePage = t("report.report");
  let tabSettings = [
    t("report.downloadArea"),
    t("report.basicServicePictures"),
    t("report.additionalServicePicturesTitle"),
    t("report.otherPictures"),
  ];

  if (role === Roles.logisticAdmin || role === Roles.astd) {
    tabSettings = [t("report.downloadArea")];
  }

  let activeTab = <DownloadArea />;
  switch (selectedTab) {
    case 1:
      activeTab = <BasicServicePicture />;
      break;
    case 2:
      activeTab = <AdditionalServicePict />;
      break;
    case 3:
      activeTab = <OtherPict />;
      break;
    default:
      break;
  }

  return (
    <Box className="container-wrapper">
      <div className="settings-page bg-bg-primary">
        <div className="title font-bold text-3xl mb-10">{titlePage}</div>
        <Tabs
          tabs={tabSettings}
          navigate={handleTabChange}
          selectedProp={selectedTab}
          className="bg-bg-primary"
        />
        {activeTab}
      </div>
    </Box>
  );
};

export default Report;
