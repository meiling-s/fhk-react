import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import {
  GET_ALL_STATUS,
  GET_STATUS_DETAIL,
} from '../constants/requests'
import axiosInstance from '../constants/axiosInstance'

//get all status
export const getStatusList = async (page: number, size: number) => {
  try {
    const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
      ...GET_ALL_STATUS(),
    })

    return response
  } catch (e) {
    console.error('Get all status failed:', e)
    return null
  }
}
//get status detail
export const getStatusDetail = async (status: string) => {
  try {
    const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
      ...GET_STATUS_DETAIL(status),
    })
    return response
  } catch (e) {
    console.error('get status detail failed:', e)
    return null
  }
}
