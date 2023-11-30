import Router from './Router';
import CheckInRequestContainer from './contexts/CheckInRequestContainer';
import CommonTypeContainer from './contexts/CommonTypeContainer';
import axiosSetup from './setups/axiosSetup';
import './setups/i18n'

function App() {
  axiosSetup();

  return (
    <CommonTypeContainer.Provider>
    <CheckInRequestContainer.Provider>
      <Router/>
    </CheckInRequestContainer.Provider>
    </CommonTypeContainer.Provider>
  );
}

export default App;
