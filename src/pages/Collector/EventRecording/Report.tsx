import { FunctionComponent, useCallback, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Tabs from '../../../components/Tabs'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import BasicServicePicture from './BasicServicePict'
import AdditionalServicePict from './AdditionalServicePict'
import OtherPict from './OtherPict'

const Report: FunctionComponent = () => {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState(0)
  const handleTabChange = (value: number, label: string) => {
    console.log(`Navigated to ${value} ${label}`)
    setSelectedTab(value)
  }

  const titlePage = t('report.report')
  const tabSettings = [
    t('report.basicServicePictures'),
    t('report.additionalServicePictures'),
    t('report.otherPictures')
  ]

  return (
    <Box className="container-wrapper w-full">
      <div className="settings-page bg-bg-primary">
        <div className="title font-bold text-3xl mb-10">{titlePage}</div>
        <Tabs
          tabs={tabSettings}
          navigate={handleTabChange}
          selectedProp={selectedTab}
          className="bg-bg-primary"
        />
        {/* rendering content base on tab index */}
        {selectedTab === 0 ? (
          <BasicServicePicture />
        ) : selectedTab === 1 ? (
          <AdditionalServicePict />
        ) : (
          <OtherPict />
        )}
      </div>
    </Box>
  )
}

export default Report
