import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from 'react-i18next'
import CustomTabs from '../../../components/Tabs'
import CurrentMenu from './CurrentMenu';

const Notice = () => {
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState(0)

    const handleTabChange = (value: number) => {
      setSelectedTab(value)
    }

    const tabSettings = [
        t('notification.menu_recycling_materials_and_waybills.tab_name'),
        t('notification.menu_staff.tab_name'),
    ];
    
    return(
        <Box className="container-wrapper w-full">
            <div className="settings-page bg-bg-primary">
                <Box>
                    <Typography style={{fontWeight: '700', fontSize: '22px'}} color="black" fontWeight="bold">
                        {t('notification.notification_title')}
                    </Typography>
                </Box>
               <CustomTabs 
                    tabs={tabSettings}
                    navigate={handleTabChange}
                    selectedProp={selectedTab}
                    className="lg:px-10 sm:px-4 bg-bg-primary"
               />
               <CurrentMenu 
                    selectedTab={selectedTab}
               />
            </div>
        </Box>
    )
}

export default Notice;