import axios from 'axios';
import { GET_ALL_CHECKIN_REQUESTS, UPDATE_CHECK_IN_STATUS } from '../../constants/requests';
import { updateStatus} from '../../interfaces/warehouse';
import {localStorgeKeyName} from '../../constants/constant'
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import { returnApiToken } from '../../utils/utils';
import { queryCheckIn } from '../../interfaces/checkin';

const warehouseAPI = {
    baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
}

export const getAllCheckInRequests = async (page: number, size: number, query?: queryCheckIn ) => {
  try {
    const token = returnApiToken()

    const response = await axios({
      ...GET_ALL_CHECKIN_REQUESTS(token.decodeKeycloack),
      baseURL: warehouseAPI.baseURL,
      params:{
        page: page,
        size: size,
        table: token.decodeKeycloack,
        picoId: query?.picoId,
        senderName: query?.senderName,
        senderAddr: query?.senderAddr
      }
      // headers: {
      //   AuthToken: token.authToken
      // }
    })
    return response
  } catch (e: any) {
    if (e.response.status == '401') {
      //return 401 if token already invalid
      const unauthorized = e.response.status 
      return unauthorized
    }
    // console.error('Get all check-in request failed:', e)
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
    // console.error('Update check-in request status failed:', e)
    return null
  }
}

