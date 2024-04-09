import React from 'react'
import {
  Tabs as MuiTabs,
  Tab,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { styles, primaryColor } from '../constants/styles'

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
  const activeTab = primaryColor

  const [selected, setSelectedValue] = React.useState<number>(
    selectedProp !== undefined ? selectedProp : 0
  )
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedValue(newValue)
    navigate(newValue, tabs[newValue])
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { sm: 480, md: '100%' }
      }}
    >
      <MuiTabs
        value={selected}
        onChange={handleChange}
        variant={isMobile ? 'scrollable' : 'standard'}
        scrollButtons
        allowScrollButtonsMobile
        className={`${className}`}
        sx={{
          borderBottom: '1px solid #E2E2E2;'
        }}
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
    </Box>
  )
}

export default Tabs
