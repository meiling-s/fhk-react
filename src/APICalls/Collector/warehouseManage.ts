import axios from 'axios';
import { GET_ALL_CHECKIN_REQUESTS, UPDATE_CHECK_IN_STATUS } from '../../constants/requests';
import { updateStatus} from '../../interfaces/warehouse';
import {localStorgeKeyName} from '../../constants/constant'
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import { returnApiToken } from '../../utils/utils';

const warehouseAPI = {
    baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
}

export const getAllCheckInRequests = async () => {
  try {
    const token = returnApiToken()

    const response = await axios({
      ...GET_ALL_CHECKIN_REQUESTS(token.decodeKeycloack),
      baseURL: warehouseAPI.baseURL,
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    console.error('Get all check-in request failed:', e)
    return null
  }
}

export const updateCheckinStatus = async (
  chkInId: number,
  data: updateStatus
) => {

  const token = returnApiToken()
 
  try {
    const response = await axios({
      ...UPDATE_CHECK_IN_STATUS(chkInId, token.decodeKeycloack),
      baseURL: warehouseAPI.baseURL,
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    console.error('Update check-in request status failed:', e)
    return null
  }
}

