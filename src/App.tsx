import Router from './Router';
import axiosSetup from './setups/axiosSetup';

function App() {
  axiosSetup();

  return (
    <Router/>
  );
}

export default App;
