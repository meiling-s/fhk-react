import { FunctionComponent, useCallback, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Tabs from '../components/Tabs'
import Warehouse from '../components/Warehouse'

const Settings: FunctionComponent = () => {
  // const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState(2)
  const handleTabChange = (value: number, label: string) => {
    console.log(`Navigated to ${value} ${label}`)
    setSelectedTab(value)
  }

  const titlePage = '設定'
  const tabSettings = [
    '一般設定',
    '包裝單位',
    '工場',
    '公司',
    '員工職位',
    '拒絕原因'
  ]

  return (
    <div className="settings-page bg-bg-primary">
      <div className="title font-bold text-3xl px-10 mb-10">{titlePage}</div>
      <Tabs
        tabs={tabSettings}
        navigate={handleTabChange}
        selectedProp={selectedTab}
        className="lg:px-10 sm:px-4 bg-bg-primary"
      />
      {/* rendering content base on tab index */}
      {selectedTab === 2 ? (
        <Warehouse />
      ) : (
        <div className="p-4 text-center">content not available</div>
      )}
    </div>
  )
}

export default Settings
