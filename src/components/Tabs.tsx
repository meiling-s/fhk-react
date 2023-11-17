import React from 'react'
import { Tabs as MuiTabs, Tab, useMediaQuery, useTheme } from '@mui/material'

type TabsProps = {
  tabs: string[]
  navigate: (value: number, label: string) => void
  selectedProp?: number | 0
  className?: string
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  navigate,
  selectedProp,
  className
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const activeTab = '#79ca25'

  const [selected, setSelectedValue] = React.useState<number>(
    selectedProp !== undefined ? selectedProp : 0
  )
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedValue(newValue)
    navigate(newValue, tabs[newValue])
  }

  return (
    <MuiTabs
      value={selected}
      onChange={handleChange}
      variant={isMobile ? 'scrollable' : 'standard'}
      scrollButtons="auto"
      className={`${className}`}
      sx={{ borderBottom: '1px solid #E2E2E2;' }}
      TabIndicatorProps={{
        style: {
          backgroundColor: activeTab
        }
      }}
    >
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          label={
            <span
              style={{
                fontWeight: selected === index ? 'bold' : 'normal',
                color: 'black'
              }}
            >
              {tab}
            </span>
          }
          value={index}
        />
      ))}
    </MuiTabs>
  )
}

export default Tabs
