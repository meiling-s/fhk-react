import { FunctionComponent, useCallback, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Tabs from '../../../components/Tabs'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import StaffManagement from './StaffManagement'
import Rosters from '../Rosters/Rosters'

const Settings: FunctionComponent = () => {
  // const navigate = useNavigate()
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState(0)
  const handleTabChange = (value: number, label: string) => {
    console.log(`Navigated to ${value} ${label}`)
    setSelectedTab(value)
  }

  const titlePage = t('settings_page.title')
  const tabSettings = [
    t('staffManagement.list'),
     t('staffManagement.schedule')
  ]

  return (
    <Box className="container-wrapper w-full">
      <div className="settings-page bg-bg-primary">
      <Box>
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t('staffManagement.staff')}
          </Typography>
        </Box>
        <Tabs
          tabs={tabSettings}
          navigate={handleTabChange}
          selectedProp={selectedTab}
          className="lg:px-10 sm:px-4 bg-bg-primary"
        />
        {/* rendering content base on tab index */}
        {selectedTab === 0 ? (
          <StaffManagement />
        ) : selectedTab === 1 ? (
          <Rosters />
        ): (
            <div></div>
        )}
      </div>
    </Box>
  )
}

export default Settings
