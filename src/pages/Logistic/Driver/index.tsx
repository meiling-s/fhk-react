import { Box } from "@mui/material"
import Tabs from '../../../components/Tabs'
import { useTranslation } from "react-i18next"
import { useState } from "react"
import Vehicles from "./Vehicles/Vehicles"

const Driver = () => {
    const { t } = useTranslation()
    const [selectedTab, setSelectedTab] = useState(0)

    const handleTabChange = (value: number) => {
        setSelectedTab(value)
    }

    const tabSettings = [t('driver.tabs.driver'), t('driver.tabs.cars')]
    return <Box className="container-wrapper w-full">
        <div className="settings-page bg-bg-primary">
            <div className="title font-bold text-3xl mb-10">{t('driver.title')}</div>
            <Tabs
                tabs={tabSettings}
                navigate={handleTabChange}
                selectedProp={selectedTab}
                className="lg:px-10 sm:px-4 bg-bg-primary"
            />
            {selectedTab === 0 ? (
                <></>
            ) : 
                <Vehicles/>
            }
        </div>
    </Box>
}
export default Driver