import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs'
import {
  GET_DRIVER_DETAIL,
  GET_DRIVER_PICKUP_POINT,
  GET_DRIVER_DROPOFF_POINT
} from '../../constants/requestsLogistic'
import { returnApiToken } from '../../utils/utils'
import axiosInstance from '../../constants/axiosInstance'

export const getDriverDetail = async (table: string, driverId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_DRIVER_DETAIL(table, driverId)
    })
    return response
  } catch (e) {
    console.error('Get driver detail failed:', e)
    return null
  }
}

export const getDriverPickupPoint = async (
  table: string,
  driverId: number,
  frmDate: string,
  toDate: string
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_DRIVER_PICKUP_POINT(
        table,
        driverId,
        frmDate,
        toDate,
        token.realmApiRoute
      )
    })
    return response
  } catch (e) {
    console.error('Get driver pickup point failed:', e)
    return null
  }
}

export const getDriverDropOffPoint = async (
  table: string,
  driverId: number,
  frmDate: string,
  toDate: string
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_DRIVER_DROPOFF_POINT(
        table,
        driverId,
        frmDate,
        toDate,
        token.realmApiRoute
      )
    })
    return response
  } catch (e) {
    console.error('Get driver drop off point failed:', e)
    return null
  }
}
