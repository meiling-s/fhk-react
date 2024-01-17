import axios from 'axios';
import { GET_ALL_CHECKIN_REQUESTS, UPDATE_CHECK_IN_STATUS } from '../../constants/requests';
import { updateStatus} from '../../interfaces/warehouse';
import {localStorgeKeyName} from '../../constants/constant'
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
 

const warehouseAPI = {
    baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
}

const decodeKeycloack =
  localStorage.getItem(localStorgeKeyName.decodeKeycloack) || ''

const authToken = localStorage.getItem(localStorgeKeyName.keycloakToken || '')

export const getAllCheckInRequests = async () => {
  try {
    const response = await axios({
      ...GET_ALL_CHECKIN_REQUESTS(decodeKeycloack),
      baseURL: warehouseAPI.baseURL,
      headers: {
        AuthToken: authToken
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
 
  try {
    const response = await axios({
      ...UPDATE_CHECK_IN_STATUS(chkInId, decodeKeycloack),
      baseURL: warehouseAPI.baseURL,
      data: data,
      headers: {
        AuthToken: authToken
      }
    })
    return response
  } catch (e) {
    console.error('Update check-in request status failed:', e)
    return null
  }
}

