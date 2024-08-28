import axiosInstance from '../../constants/axiosInstance'
import {
  GET_ALL_CHECKOUT_REQUEST,
  GET_CHECKOUT_REASON,
  GET_CHECKOUT_REQUEST_BY_ID,
  NEW_GET_ALL_DETAIL_CHECKOUT_REQUESTS,
  NEW_GET_ALL_HEADER_CHECKOUT_REQUESTS,
  UPDATE_CHECK_OUT,
  UPDATE_CHECKOUT_REQUEST_STATUS
} from '../../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs'
import { queryCheckout } from '../../interfaces/checkout'
import { returnApiToken } from '../../utils/utils'
import { CheckOutWarehouse } from '../../interfaces/warehouse'

const checkoutAPI = {
  baseURL: window.baseURL.collector
}

export const getAllCheckoutRequest = async (
  page: number,
  size: number,
  query: queryCheckout
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      ...NEW_GET_ALL_HEADER_CHECKOUT_REQUESTS(
        token.realmApiRoute,
        token.decodeKeycloack
      ),
      baseURL: checkoutAPI.baseURL,
      params: {
        page: page,
        size: size,
        table: token.decodeKeycloack,
        picoId: query.picoId,
        receiverName: query.receiverName,
        receiverAddr: query.receiverAddr
      }
    })
    return response
  } catch (e: any) {
    console.error('Get all checkout failed:', e)
    return null
  }
}

export const getDetailCheckoutRequests = async (checkinId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      ...NEW_GET_ALL_DETAIL_CHECKOUT_REQUESTS(
        token.realmApiRoute,
        token.decodeKeycloack,
        checkinId
      ),
      baseURL: checkoutAPI.baseURL
    })
    return response
  } catch (e: any) {
    // console.error('Get all check-in request failed:', e)
    return null
  }
}

export const getCheckoutRequestById = async (chkOutId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      ...GET_CHECKOUT_REQUEST_BY_ID(chkOutId, token.decodeKeycloack),
      baseURL: checkoutAPI.baseURL
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

export const updateCheckout = async (
  chkOutId: number,
  data: CheckOutWarehouse,
  picoDtlId: number
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      ...UPDATE_CHECK_OUT(
        token.realmApiRoute,
        chkOutId,
        token.decodeKeycloack,
        picoDtlId
      ),
      baseURL: checkoutAPI.baseURL,
      data: data
    })
    return response
  } catch (e) {
    console.error('Update checkout request status failed:', e)
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
      ...UPDATE_CHECKOUT_REQUEST_STATUS(
        token.realmApiRoute,
        chkOutId,
        token.decodeKeycloack
      ),
      baseURL: checkoutAPI.baseURL,
      data: data
    })
    return response
  } catch (e) {
    console.error('Update checkout request status failed:', e)
    return null
  }
}

export const getCheckoutReasons = async () => {
  try {
    const token = returnApiToken()
    const keyRole = token.realmApiRoute
    const functId: { [key: string]: number } = {
      collectors: 5,
      manufacturer: 37,
      logistic: 4,
      customer: 4,
      account: 4
    }

    const response = await axiosInstance({
      ...GET_CHECKOUT_REASON(
        token.realmApiRoute,
        token.tenantId,
        functId[keyRole]
      ),
      baseURL: checkoutAPI.baseURL
    })
    return response
  } catch (e) {
    console.error('get checkout reasons failed:', e)
    throw e
  }
}
