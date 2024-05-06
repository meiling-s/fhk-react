import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import {
  GET_CAPACITY_WAREHOUSE,
  GET_WEIGHT_BY_SUBTYPE_ID,
  GET_CHECKIN_WAREHOUSE,
  GET_CHECKOUT_WAREHOUSE,
  GET_CHECK_IN_OUT_WAREHOUSE
} from '../constants/requests'
import { returnApiToken } from '../utils/utils'
import axiosInstance from '../constants/axiosInstance'

export const getCapacityWarehouse = async (
  warehouseId: number
) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...GET_CAPACITY_WAREHOUSE(token.realmApiRoute, token.decodeKeycloack, warehouseId)
    })

    return response
  } catch (e) {
    console.error(`Get capacity warehouse ${warehouseId} failed:`, e)
    return null
  }
}

export const getWeightbySubtype = async (
  warehouseId: number
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...GET_WEIGHT_BY_SUBTYPE_ID(
        token.realmApiRoute,
        token.decodeKeycloack,
        warehouseId
      ),
      headers: {
        AuthToken: token.authToken
      }
    })

    return response
  } catch (e: any) {
    return null
  }
}

export const getCheckInWarehouse = async (warehouseId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...GET_CHECKIN_WAREHOUSE(token.realmApiRoute, token.decodeKeycloack, warehouseId)
    })

    return response
  } catch (e) {
    console.error(`Get capacity warehouse ${warehouseId} checkin  failed:`, e)
    return null
  }
}

export const getCheckOutWarehouse = async (warehouseId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...GET_CHECKOUT_WAREHOUSE(token.realmApiRoute, token.decodeKeycloack, warehouseId)
    })

    return response
  } catch (e) {
    console.error(`Get capacity warehouse ${warehouseId} checkout failed:`, e)
    return null
  }
}

export const getCheckInOutWarehouse = async (warehouseId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...GET_CHECK_IN_OUT_WAREHOUSE(token.realmApiRoute, token.decodeKeycloack, warehouseId)
    })

    return response
  } catch (e) {
    console.error(`Get capacity warehouse ${warehouseId} checkinout failed:`, e)
    return null
  }
}
