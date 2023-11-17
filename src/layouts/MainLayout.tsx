import MainDrawer from './MainDrawer'
import MainAppBar from './MainAppBar'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { styles } from '../constants/styles'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Toast from '../components/Toast'

function MainLayout() {
  const theme = useTheme()
  //todo move to global utils
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
      <MainDrawer />
      <MainAppBar />
      <Box sx={isMobile ? styles.mobileScreen : styles.innerScreen}>
        <Outlet />
      </Box>
    </>
  )
}

export default MainLayout
