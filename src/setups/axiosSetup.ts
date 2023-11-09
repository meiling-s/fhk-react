import axios from "axios";
import { AXIOS_DEFAULT_CONFIGS } from "../constants/configs";

const axiosSetup = () => {
  console.log('axiosSetup completed');
  //axios.defaults.baseURL = AXIOS_DEFAULT_CONFIGS.baseURL;
  axios.defaults.timeout = AXIOS_DEFAULT_CONFIGS.timeout;
  axios.defaults.headers.post['Content-Type'] = AXIOS_DEFAULT_CONFIGS.headers.post['Conetent-Type'];
};
 
export default axiosSetup;