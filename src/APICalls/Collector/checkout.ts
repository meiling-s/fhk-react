import axios from 'axios'
import {
  GET_ALL_CHECKOUT_REQUEST,
  GET_CHECKOUT_REQUEST_BY_ID,
  UPDATE_CHECKOUT_REQUEST_STATUS
} from '../../constants/requests'
import { updateStatus } from '../../interfaces/warehouse'

const checkoutAPI = {
  //baseURL: 'http://10.166.22.107:8003/'
  baseURL: 'http://www.greenhoopapp.com/'
}

export const getAllCheckoutRequest = async () => {
  try {
    const response = await axios({
      ...GET_ALL_CHECKOUT_REQUEST,
      baseURL: checkoutAPI.baseURL
      //   params: {
      //     page: page,
      //     size: size
      //   }
    })
    return response
  } catch (e) {
    console.error('Get all warehouse failed:', e)
    return null
  }
}
export const getCheckoutRequestById = async (chkOutId: number) => {
  try {
    const response = await axios({
      ...GET_CHECKOUT_REQUEST_BY_ID(chkOutId),
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

export const updateCheckoutRequestStatus = async (
  chkOutId: number,
  data: any
) => {
  try {
    const response = await axios({
      ...UPDATE_CHECKOUT_REQUEST_STATUS(chkOutId),
      baseURL: checkoutAPI.baseURL,
      data: data
    })
    return response
  } catch (e) {
    console.error('Update checkout request status failed:', e)
    return null
  }
}
