import axios from 'axios'
import { localStorgeKeyName } from '../constants/constant'
// import { CreateVehicle } from "../../interfaces/vehicles";
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import {
  GET_CAPACITY_WAREHOUSE,
  GET_CAPACITY_WAREHOUSE_SUBTYPE_ITEM,
  GET_CHECKIN_WAREHOUSE,
  GET_CHECKOUT_WAREHOUSE,
  GET_CHECK_IN_OUT_WAREHOUSE
} from '../constants/requests'
import { returnApiToken } from '../utils/utils'

const request = axios.create({
  baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
})

export const getCapacityWarehouse = async (
  page: number,
  size: number,
  warehouseId: number
) => {
  try {
    const token = returnApiToken()

    const response = await request({
      ...GET_CAPACITY_WAREHOUSE(token.decodeKeycloack, warehouseId),
      params: {
        page: page,
        size: size
      }
    })

    return response
  } catch (e) {
    console.error(`Get capacity warehouse ${warehouseId} failed:`, e)
    return null
  }
}

export const getCapacityWarehouseSubtype = async (
  warehouseId: number,
  recySubTypeId: string
) => {
  try {
    const token = returnApiToken()

    const response = await request({
      ...GET_CAPACITY_WAREHOUSE_SUBTYPE_ITEM(
        token.decodeKeycloack,
        warehouseId,
        recySubTypeId
      )
    })

    return response
  } catch (e) {
    console.error(`Get capacity warehouse subtype ${recySubTypeId} failed:`, e)
    return null
  }
}

export const getCheckInWarehouse = async (warehouseId: number) => {
  try {
    const token = returnApiToken()

    const response = await request({
      ...GET_CHECKIN_WAREHOUSE(token.decodeKeycloack, warehouseId)
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

    const response = await request({
      ...GET_CHECKOUT_WAREHOUSE(token.decodeKeycloack, warehouseId)
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

    const response = await request({
      ...GET_CHECK_IN_OUT_WAREHOUSE(token.decodeKeycloack, warehouseId)
    })

    return response
  } catch (e) {
    console.error(`Get capacity warehouse ${warehouseId} checkinout failed:`, e)
    return null
  }
}
