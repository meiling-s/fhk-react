import axiosInstance from '../../constants/axiosInstance'
import {
  GET_ALL_CHECKOUT_REQUEST,
  GET_CHECKOUT_REQUEST_BY_ID,
  UPDATE_CHECKOUT_REQUEST_STATUS
} from '../../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import { queryCheckout } from '../../interfaces/checkout'
import { returnApiToken } from '../../utils/utils';

const checkoutAPI = {
  baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
}

export const getAllCheckoutRequest = async (page: number, size: number, query: queryCheckout ) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      ...GET_ALL_CHECKOUT_REQUEST(token.realmApiRoute, token.decodeKeycloack),
      baseURL: checkoutAPI.baseURL,
      params: {
        page: page,
        size: size,
        table: token.decodeKeycloack,
        picoId: query.picoId,
        receiverName: query.receiverName,
        receiverAddr: query.receiverAddr
      },
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
    console.error('Get all checkout failed:', e)
    return null
  }
}
export const getCheckoutRequestById = async (chkOutId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      ...GET_CHECKOUT_REQUEST_BY_ID(chkOutId, token.decodeKeycloack),
      baseURL: checkoutAPI.baseURL,
      headers: {
        AuthToken: token.authToken
      }
    })
    console.log(
      'Get all check-out request success:',
      JSON.stringify(response.data)
    )
    return response
  } catch (e) {
    console.error('Get all check-out request failed:', e)
    return null
  }
}

export const updateCheckoutRequestStatus = async (
  chkOutId: number,
  data: any
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      ...UPDATE_CHECKOUT_REQUEST_STATUS(chkOutId, token.decodeKeycloack),
      baseURL: checkoutAPI.baseURL,
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    console.error('Update checkout request status failed:', e)
    return null
  }
}
