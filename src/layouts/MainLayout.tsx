import MainDrawer from './MainDrawer'
import MainAppBar from './MainAppBar'
import { Box, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { styles } from '../constants/styles'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Toast from '../components/Toast'
import { useContainer } from 'unstated-next'
import NotifContainer from '../contexts/NotifContainer'
import CloseIcon from '@mui/icons-material/Close';

function MainLayout() {
  const theme = useTheme()
  //todo move to global utils
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { broadcast, setBroadcast, setShowBroadcast, showBroadcast } =  useContainer(NotifContainer);

  const onCloseBroadcastMessage = () => {
    // setBroadcast(null)
    setShowBroadcast(false)
    styles.innerScreen.pt = '32px'
  };

  if(broadcast && showBroadcast) {
    styles.innerScreen.pt = '62px'
  }  else {
    styles.innerScreen.pt = '32px'
  }

  return (
    <Box>
      {showBroadcast && broadcast &&
        <Box sx={{...localStyle.broadcast, zIndex: 9999}}>
          <Box sx={{marginLeft: '30px', display: 'flex', gap: 2}}>
            <Typography style={{fontSize: '13px', color: '#FFFFFF'}}>{broadcast.title}</Typography>
            <Typography style={{fontSize: '13px', color: '#FFFFFF'}}>{broadcast.content}</Typography>
          </Box>
          <CloseIcon  
            style={{color: '#FFFFFF', marginRight: '30px'}} className='hover:cursor-pointer'
            onClick={onCloseBroadcastMessage}
          />
        </Box>
      }
      <MainDrawer />
      <MainAppBar  />
      <Box sx={isMobile ? styles.mobileScreen : styles.innerScreen}>
        <Outlet />
      </Box>
    </Box>
  )
}

const localStyle = {
  broadcast: {
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    height: '30px', 
    width: '100%', 
    backgroundColor: '#717171', 
    position: 'fixed', 
    top: 0, 
    left: 0
  }
}

export default MainLayout
