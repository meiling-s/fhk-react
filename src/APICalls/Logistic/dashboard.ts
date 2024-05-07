import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs'
import {
  GET_DRIVER_DETAIL,
  GET_DRIVER_PICKUP_POINT,
  GET_DRIVER_DROPOFF_POINT
} from '../../constants/requestsLogistic'
import { returnApiToken } from '../../utils/utils'
import axiosInstance from '../../constants/axiosInstance'

export const getDriverDetail = async (driverId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_DRIVER_DETAIL(token.decodeKeycloack, driverId)
    })
    return response
  } catch (e) {
    console.error('Get driver detail failed:', e)
    return null
  }
}

export const getDriverPickupPoint = async (
  driverId: number,
  frmDate: string,
  toDate: string
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_DRIVER_PICKUP_POINT(
        token.decodeKeycloack,
        driverId,
        frmDate,
        toDate
      )
    })
    return response
  } catch (e) {
    console.error('Get driver pickup point failed:', e)
    return null
  }
}

export const getDriverDropOffPoint = async (
  driverId: number,
  frmDate: string,
  toDate: string
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_DRIVER_DROPOFF_POINT(
        token.decodeKeycloack,
        driverId,
        frmDate,
        toDate
      )
    })
    return response
  } catch (e) {
    console.error('Get driver drop off point failed:', e)
    return null
  }
}
