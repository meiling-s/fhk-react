
import MainDrawer from './MainDrawer'
import MainAppBar from './MainAppBar'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { styles } from '../constants/styles'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useContainer } from 'unstated-next'
import NotifContainer from '../contexts/NotifContainer'
import NotificationBar from './NotificationBar'

function MainLayout() {
  const theme = useTheme()
  //todo move to global utils
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const {
    broadcast,
    showBroadcast
} = useContainer(NotifContainer)

  return (
    <Box>
      {showBroadcast && broadcast && (
        <NotificationBar />
      )}
      <MainDrawer />
      <MainAppBar />
      <Box sx={isMobile ? styles.mobileScreen : styles.innerScreen}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout
