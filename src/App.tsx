import { ThemeProvider } from '@mui/material/styles'
import Router from './Router'
import NotifContainerContext from './contexts/NotifContainer'
import CommonTypeContainer from './contexts/CommonTypeContainer'
import TokenContainer from './contexts/TokenContainer'
import axiosSetup from './setups/axiosSetup'
import './setups/i18n'
import theme from './themes/palette'
import { ToastContainer } from 'react-toastify'

function App() {
  axiosSetup()

  return (
    <ThemeProvider theme={theme}>
      <CommonTypeContainer.Provider>
        <NotifContainerContext.Provider>
          <ToastContainer />
          <Router />
        </NotifContainerContext.Provider>
      </CommonTypeContainer.Provider>
    </ThemeProvider>
  )
}

export default App
