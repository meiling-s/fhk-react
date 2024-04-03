import { FunctionComponent, useState } from 'react'
import Tabs from '../../../components/Tabs'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import BasicServicePicture from './BasicServicePict'
import AdditionalServicePict from './AdditionalServicePict'
import OtherPict from './OtherPict'
import DownloadArea from './DownloadArea'

const Report: FunctionComponent = () => {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState(0)

  const handleTabChange = (value: number) => {
    setSelectedTab(value)
  }

  const titlePage = t('report.report')
  const tabSettings = [
    t('report.downloadArea'),
    t('report.basicServicePictures'),
    t('report.additionalServicePictures'),
    t('report.otherPictures')
  ];

  let activeTab = <DownloadArea />
  switch (selectedTab){
    case 1 :
      activeTab = <BasicServicePicture />;
      break;
    case 2:
      activeTab =  <AdditionalServicePict />
      break;
    case 3:
      activeTab =  <OtherPict />
      break;
    default:
      break
  }

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
        { activeTab }
      </div>
    </Box>
  )
}

export default Report
