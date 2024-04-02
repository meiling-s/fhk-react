import { FunctionComponent, useCallback, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Tabs from '../../components/Tabs'
// import Warehouse from './Warehouse'
// import Vehicle from '../Vehicles/Vechicles'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import UserAccount from '../Collector/UserAccount/UserAccount'
import UserGroup from '../Collector/UserGroup/UserGroup'

const Settings: FunctionComponent = () => {
  // const navigate = useNavigate()
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState(0)
  const handleTabChange = (value: number, label: string) => {
    // console.log(`Navigated to ${value} ${label}`)
    setSelectedTab(value)
  }

  const titlePage = t('processRecord.userGroup')
  const tabSettings = [
    t('userAccount.user'),
    t('staffManagement.userGroup'),
  ]

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
        { selectedTab === 0 ? (
          <UserAccount />
        ) : selectedTab === 1 ? (
            <UserGroup />
        ) : (
          <div className="p-4 text-center">content not available</div>
        )}
      </div>
    </Box>
  )
}

export default Settings
