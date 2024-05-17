import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import {
  GET_CAPACITY_WAREHOUSE,
  GET_WEIGHT_BY_SUBTYPE_ID,
  GET_CHECKIN_WAREHOUSE,
  GET_CHECKOUT_WAREHOUSE,
  GET_CHECK_IN_OUT_WAREHOUSE,
  GET_RECYC_SUB_TYPE_WEIGHT
} from '../constants/requests'
import { returnApiToken } from '../utils/utils'
import axiosInstance from '../constants/axiosInstance'

export const getCapacityWarehouse = async (
  warehouseId: number,
  table: string,
) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...GET_CAPACITY_WAREHOUSE(token.realmApiRoute, table, warehouseId)
    })

    return response
  } catch (e) {
    console.error(`Get capacity warehouse ${warehouseId} failed:`, e)
    return null
  }
}

export const getWeightbySubtype = async (
  warehouseId: number,
  table: string
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...GET_WEIGHT_BY_SUBTYPE_ID(
        token.realmApiRoute,
        table,
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

export const getCheckInWarehouse = async (warehouseId: number, table: string) => {
  console.log(table, 'table checkin')
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_CHECKIN_WAREHOUSE(token.realmApiRoute, table, warehouseId)
    })

    return response
  } catch (e) {
    console.error(`Get capacity warehouse ${warehouseId} checkin  failed:`, e)
    return null
  }
}

export const getCheckOutWarehouse = async (warehouseId: number, table: string) => {
  console.log(table, 'table checkout')
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...GET_CHECKOUT_WAREHOUSE(token.realmApiRoute, table, warehouseId)
    })

    return response
  } catch (e) {
    console.error(`Get capacity warehouse ${warehouseId} checkout failed:`, e)
    return null
  }
}

export const getCheckInOutWarehouse = async (warehouseId: number, table: string) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...GET_CHECK_IN_OUT_WAREHOUSE(token.realmApiRoute, table, warehouseId)
    })

    return response
  } catch (e) {
    console.error(`Get capacity warehouse ${warehouseId} checkinout failed:`, e)
    return null
  }
}

export const getRecycSubTypeWeight = async (warehouseId: number, table: string) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...GET_RECYC_SUB_TYPE_WEIGHT(token.realmApiRoute, table, warehouseId)
    })

    return response
  } catch (e) {
    console.error(`Get capacity warehouse ${warehouseId} checkinout failed:`, e)
    return null
  }
}
