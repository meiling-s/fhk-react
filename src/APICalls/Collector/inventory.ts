import {
  ASTD_GET_INVENTORY,
  CREATE_PROCESS_IN,
  CREATE_PROCESS_OUT,
  GET_INVENTORY,
  GET_INVENTORY_BY_LABEL,
  GET_ITEM_TRACK_INVENTORY
} from '../../constants/requests'
import { returnApiToken } from '../../utils/utils'
import axiosInstance from '../../constants/axiosInstance'
import { InventoryQuery, ProcessInType, ProcessOutType } from '../../interfaces/inventory'

//get all inventory
export const getAllInventory = async (
  page: number,
  size: number,
  query: InventoryQuery
) => {
  try {
    const token = returnApiToken()

    const params: any = {
      page: page,
      size: size
    }
    if (query?.labelId) params.labelId = query.labelId
    if (query?.warehouseId) params.warehouseId = query.warehouseId
    if (query?.recycTypeId) params.recycTypeId = query.recycTypeId
    if (query?.recycSubTypeId) params.recycSubTypeId = query.recycSubTypeId
    if (query?.idleDays) params.idleDays = query.idleDays

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_INVENTORY(token.realmApiRoute, token.decodeKeycloack),
      params: params,
      headers: {
        AuthToken: token.authToken
      }
    })

    return response
  } catch (e: any) {
    console.error('Get all vehicle failed:', e)
    throw e
  }
}

export const getItemTrackInventory = async (
  gid: string
) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...GET_ITEM_TRACK_INVENTORY(gid)
    })

    return response
  } catch (error) {
    console.error('Get all vehicle failed:', error)
    return null
  }
}
export const astdGetAllInventory = async (
  page: number,
  size: number,
  table: string,
  query: InventoryQuery
) => {
  try {
    const token = returnApiToken()

    const params: any = {
      page: page,
      size: size
    }
    if (query?.labelId) params.labelId = query.labelId
    if (query?.warehouseId) params.warehouseId = query.warehouseId
    if (query?.recycTypeId) params.recycTypeId = query.recycTypeId
    if (query?.recycSubTypeId) params.recycSubTypeId = query.recycSubTypeId

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...ASTD_GET_INVENTORY(token.realmApiRoute, table),
      params: params,
      headers: {
        AuthToken: token.authToken
      }
    })

    return response
  } catch (e) {
    console.error('Get all vehicle failed:', e)
    return null
  }
}

export const createProcessIn = async (data: ProcessInType, processOrderId: string, factoryId: string) => {
  try {
      const params: any = {}
      if (processOrderId) params.processOrderId = processOrderId
      if (factoryId) params.factoryId = factoryId

      const token = returnApiToken()
      return await axiosInstance({
          baseURL: window.baseURL.collector,
          ...CREATE_PROCESS_IN(token.realmApiRoute ,token.decodeKeycloack),
          params: params,
          data,
      })
  } catch (error) {
      console.error(error)
  }
}

export const createProcessOut = async (data: ProcessOutType, processOrderId: string, factoryId: string) => {
  try {
      const params: any = {}
        if (processOrderId) params.processOrderId = processOrderId
        if (factoryId) params.factoryId = factoryId

      const token = returnApiToken()
      return await axiosInstance({
          baseURL: window.baseURL.collector,
          ...CREATE_PROCESS_OUT(token.realmApiRoute ,token.decodeKeycloack),
          params: params,
          data,
      })
  } catch (error) {
      console.error(error)
  }
}


export const astdGetInventoryByGIDLabel = async (label: string) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...GET_INVENTORY_BY_LABEL(label)
    })

    return response
  } catch (error) {
    console.error(error)
  }
}