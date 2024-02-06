import { ThemeProvider } from 'styled-components'
import Router from './Router'
import NotifContainerContext from './contexts/NotifContainer'
import CommonTypeContainer from './contexts/CommonTypeContainer'
import axiosSetup from './setups/axiosSetup'
import './setups/i18n'
import theme from './themes/palette'




function App() {
  axiosSetup()

  return (

    <ThemeProvider theme={theme}>
      <CommonTypeContainer.Provider>
          <NotifContainerContext.Provider>
            <Router />
          </NotifContainerContext.Provider>
      </CommonTypeContainer.Provider>
    </ThemeProvider>
  
  )
}

export default App
