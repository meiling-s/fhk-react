import MainDrawer from './MainDrawer'
import MainAppBar from './MainAppBar'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { styles } from '../constants/styles'
import Toast from '../components/Toast'


function MainLayout() {

  return (
    <>
      <MainDrawer />
      <MainAppBar/>
      <Box sx={styles.innerScreen} >
        <Outlet/>
      </Box>
    </>
  )
}

export default MainLayout