import { FunctionComponent, useCallback, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Tabs from '../../../components/Tabs'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import StaffManagement from './StaffManagement'
import Rosters from '../Rosters/Rosters'
// import UserGroup from '../UserGroup/UserGroup'
import StaffManufacturer from '../StaffManufacturer/StaffManufacturer'
import { returnApiToken } from '../../../utils/utils'
import { localStorgeKeyName } from '../../../constants/constant'

const Settings: FunctionComponent = () => {
  const token = returnApiToken()
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState(0)
  const handleTabChange = (value: number, label: string) => {
    setSelectedTab(value)
  }
  const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'
  // const tabSettings = [
  //   t('staffManagement.list'),
  //   t('staffManagement.schedule'),
  //   t('staffManagement.manufacturer')
  // ]

  const tabSettingsCollectors = [
    t('staffManagement.list'),
    t('staffManagement.schedule'),
    // t('staffManagement.manufacturer')
  ]

  const tabSettingsNonCollectors = [
    t('staffManagement.list'),
    t('staffManagement.manufacturer')
  ]

  const tabSettings =
    role === 'collector' ? tabSettingsCollectors : tabSettingsNonCollectors

  return (
    <Box className="container-wrapper w-max">
      <div className="settings-page bg-bg-primary">
        <Box>
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t('staffManagement.staff')}
          </Typography>
        </Box>
        {token.realmApiRoute !== 'customer' ? (
          <Tabs
            tabs={tabSettings}
            navigate={handleTabChange}
            selectedProp={selectedTab}
            className="lg:px-10 sm:px-4 bg-bg-primary"
          />
        ) : null}
        {role === 'collector' ? (
          selectedTab === 0 ? (
            <StaffManagement />
          ) : selectedTab === 1 ? (
            <Rosters />
          ) : selectedTab === 2 ? (
            <StaffManufacturer />
          ) : (
            <div></div>
          )
        ) : selectedTab === 0 ? (
          <StaffManagement />
        ) : selectedTab === 1 ? (
          <StaffManufacturer />
        ) : (
          <div></div>
        )}
      </div>
    </Box>
  )
}

export default Settings
