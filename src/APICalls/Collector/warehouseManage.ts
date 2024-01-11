import axios from 'axios';
import { GET_ALL_CHECKIN_REQUESTS, UPDATE_CHECK_IN_STATUS } from '../../constants/requests';
import { updateStatus} from '../../interfaces/warehouse';


const warehouseAPI = {
    //baseURL: 'http://10.166.22.107:8003/'
    baseURL: 'http://www.greenhoopapp.com/'
}

export const getAllCheckInRequests = async () => {

    try {
      const response = await axios({
        ...GET_ALL_CHECKIN_REQUESTS,
        baseURL: warehouseAPI.baseURL,
        // params:{
        //   page: page,
        //   size: size
        // }
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
        // },
      });
      console.log('Get all check-in request success:', JSON.stringify(response.data));
      return response
    } catch (e) {
      console.error('Get all check-in request failed:', e);
      return null;
    }
  
  }

  export const updateCheckinStatus = async (chkInId: number, data: updateStatus) => {

    const axiosConfig = Object.assign({},UPDATE_CHECK_IN_STATUS);
    axiosConfig.url = UPDATE_CHECK_IN_STATUS.url+ `status/`+`${chkInId}`;

    try {
      const response = await axios({
        ...axiosConfig,
        baseURL: warehouseAPI.baseURL,
        data: data
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
        // },
      });
      console.log('Update check-in request status success:', JSON.stringify(response.data));
      return response
    } catch (e) {
      console.error('Update check-in request status failed:', e);
      return null;
    }
  
  }
