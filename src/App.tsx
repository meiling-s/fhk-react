import Router from './Router';
import axiosSetup from './setups/axiosSetup';
import './setups/i18n'

function App() {
  axiosSetup();

  return (
    <Router/>
  );
}

export default App;
