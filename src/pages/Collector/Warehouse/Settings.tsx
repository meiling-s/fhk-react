import { FunctionComponent, useEffect, useState } from "react";
import Tabs from "../../../components/Tabs";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import GeneralSettings from '../GeneralSettings/GeneralSettings'
import PackagingUnit from '../PackagingUnit/PackagingUnit'
import Warehouse from "./Warehouse";
import Vehicle from "../Vehicles/Vechicles";
import DisposalLocation from "../DisposalLocation/DisposalLocation";
import DenialReason from "../DenialReason/DenialReason";
import StaffTitle from "../StaffTitle/StaffTitle";
import Company from "../Company/Company";
import { STATUS_CODE, localStorgeKeyName } from "../../../constants/constant";
import ASTDSettings from "../../ASTD/GeneralSettings/GeneralSettings";
import RecyclingUnit from "../../ASTD/RecyclingUnit/RecyclingUnit";
import RecyclingPoint from "../../ASTD/RecyclingPoint/RecyclingPoint";
import ASTDVehicle from '../../ASTD/Vehicle/Vehicle'
import ASTDStaff from '../../ASTD/Staff/Staff'
import ASTDDenialReason from '../../ASTD/DenialReason/DenialReason'
import CustomerGeneralSettings from '../../Customer/GeneralSettings/GeneralSettings'
import { useNavigate } from "react-router-dom";
import { extractError } from "../../../utils/utils";

const Settings: FunctionComponent = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (value: number, label: string) => {
    setSelectedTab(value);
  };

  const titlePage = t("settings_page.title");
  const defaultTabList = [
    t("top_menu.general_settings"),
    t("top_menu.packaging_unit"),
    t("top_menu.workshop"),
    t("top_menu.vehicles"),
    t("top_menu.company"),
    t("top_menu.waste_disposal"),
    t("top_menu.staff_positions"),
    t("top_menu.denial_reason"),
  ];
  const astdTabList = [
    t("top_menu.general_settings"),
    t("recycling_unit.recycling_and_related_units"),
    t("recycling_point.recycling_point"),
    t("vehicle.vehicle"),
    t("top_menu.company"),
    t("top_menu.staff_positions"),
    t("top_menu.denial_reason"),
  ]

  const role = localStorage.getItem(localStorgeKeyName.role)
  const [tabList, setTabList] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const getTabList = () => {
    let updatedTabList = [...defaultTabList]

    if (role === 'logistic') {
      const hideTabIndexArr = [2, 3, 5]
      updatedTabList = updatedTabList.filter((_, index) => !hideTabIndexArr.includes(index))
    } else if (role === 'customer') {
      const hideTabIndexArr = [1,2,3,5,7]
      updatedTabList = updatedTabList.filter((_,index) => !hideTabIndexArr.includes(index))
    } else if(role === 'manufacturer') {
      const hideTabIndexArr = [3]
      updatedTabList = updatedTabList.filter((_, index) => !hideTabIndexArr.includes(index))
    }

    setTabList(updatedTabList)
  }

  const getASTDTabList = () => {
    let updatedTabList = [...astdTabList]

    const hideTabIndexArr: number[] = []
    updatedTabList = updatedTabList.filter((_, index) => !hideTabIndexArr.includes(index))
    setTabList(updatedTabList)
  }

  useEffect(() => {
    if (role === 'astd') {
      getASTDTabList()
    } else {
      getTabList()
    }
  }, [t, role])

  const collectorSettingTab = () => {
    return (
      selectedTab === 0 ? (
        <GeneralSettings/>
      ) : selectedTab === 1 ? (
        <PackagingUnit/>
      ) : selectedTab === 2 ? (
        <Warehouse />
      ) : selectedTab === 3 ? (
        <Vehicle />
      ) : selectedTab === 4 ? (
        <Company />
      ) : selectedTab === 5 ? (
        <DisposalLocation />
      ) : selectedTab === 6 ? (
        <StaffTitle />
      ) : selectedTab === 7 ? (
        <DenialReason />
      ) : (
        <div className="p-4 text-center">content not available</div>
      )
    )
  }

  const logisticSettingTab = () => {
    return (
      selectedTab === 0 ? (
        <GeneralSettings/>
      ) : selectedTab === 1 ? (
        <PackagingUnit/>
      ) : selectedTab === 2 ? (
        <Company />
      ) : selectedTab === 3 ? (
        <StaffTitle />
      ) : selectedTab === 4 ? (
        <DenialReason />
      ) : (
        <div className="p-4 text-center">content not available</div>
      )
    )
  }

  const astdSettingTab = () => {
    return (
      selectedTab === 0 ? (
        <ASTDSettings/> 
      ) : 
        selectedTab === 1 ? (
          <RecyclingUnit/>
        ) : selectedTab === 2 ? (
          <RecyclingPoint/>
        ) : selectedTab === 3 ? (
          <ASTDVehicle/>
        ) : selectedTab === 4 ? (
          <Company />
        ) : selectedTab === 5 ? (
          <ASTDStaff />
        ) : selectedTab === 6 ? (
          <ASTDDenialReason/>
        ) :
      (
          <div className="p-4 text-center">content not available</div>
        )
      )
  }
  const customerSettingTab = () => {
    return (
      selectedTab === 0 ? (
        <CustomerGeneralSettings/>
      ): selectedTab === 1 ? (
        <Company/>
      ) : selectedTab === 2 ? (
        <StaffTitle/>
      ) :
      (
        <div className="p-4 text-center">content not available</div>
      )
    )
  }

  const manufacturerSettingTab = () => {
    return (
      selectedTab === 0 ? (
        <GeneralSettings/>
      ) : selectedTab === 1 ? (
        <PackagingUnit/>
      ) : selectedTab === 2 ? (
        <Warehouse />
      ) : selectedTab === 3 ? (
        <Company />
      ) : selectedTab === 4 ? (
        <DisposalLocation />
      ) : selectedTab === 5 ? (
        <StaffTitle />
      ) : selectedTab === 6? (
        <DenialReason />
      ) : (
        <div className="p-4 text-center">content not available</div>
      )
    )
  }

  return (
    <Box className="container-wrapper w-full">
      <div className="settings-page bg-bg-primary">
        <div className="title font-bold text-3xl mb-10">{titlePage}</div>
        <Tabs
          tabs={tabList}
          navigate={handleTabChange}
          selectedProp={selectedTab}
          className="lg:px-10 sm:px-4 bg-bg-primary"
        />
        {/* rendering content base on tab index */}
        { role === 'logistic' ? 
            logisticSettingTab() : 
          role === 'astd' ? 
            astdSettingTab() : 
          role === 'customer' ? 
            customerSettingTab() :
          role === 'manufacturer' ? 
            manufacturerSettingTab() :
            collectorSettingTab()
        }
      </div>
    </Box>
  );
};

export default Settings;
