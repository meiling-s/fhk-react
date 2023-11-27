import Router from './Router';
import CheckInRequestContext from './contexts/CheckInRequestContext';
import axiosSetup from './setups/axiosSetup';
import './setups/i18n'

function App() {
  axiosSetup();

  return (
    <CheckInRequestContext.Provider>
    <Router/>
    </CheckInRequestContext.Provider>
  );
}

export default App;
