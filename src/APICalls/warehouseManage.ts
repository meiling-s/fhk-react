import {
  GET_ALL_WAREHOUSE,
  GET_WAREHOUSE_BY_ID,
  ADD_WAREHOUSE,
  ADD_WAREHOUSE_V2,
  UPDATE_WAREHOUSE_BY_ID,
  UPDATE_WAREHOUSE_BY_ID_V2,
  UPDATE_RECYCLE_CAPACITY_BY_ID,
  UPDATE_WAREHOUSE_STATUS_BY_ID,
  GET_RECYCLE_TYPE,
  GET_RECYCLE_TYPE_BY_ID,
  MANUFACTURER_GET_ALL_WAREHOUSE
} from '../constants/requests'
import { returnApiToken } from '../utils/utils'
import axiosInstance from '../constants/axiosInstance'

const collectionPointAPI = {
  baseURL: window.baseURL.collector
}

const administratorAPI = {
  baseURL: window.baseURL.collector
}

//get all warehouse
export const getAllWarehouse = async (page: number, size: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_ALL_WAREHOUSE(token.realmApiRoute, token.decodeKeycloack),
      params: {
        page: page,
        size: size
      }
    })

    return response
  } catch (e: any) {
    throw e
  }
}

//get warehouse by id
export const getWarehouseById = async (warehouseId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_WAREHOUSE_BY_ID(
        token.realmApiRoute,
        warehouseId,
        token.decodeKeycloack
      ),
      headers: {
        AuthToken: token.authToken
      }
      // baseURL: collectionPointAPI.baseURL,
    })
    return response
  } catch (e: any) {
    console.error('Get a warehouse failed:', e)
    throw e
  }
}

//create warehouse
export const createWarehouse = async (data: any) => {
  try {
    const token = returnApiToken()
    const role = token.realmApiRoute
    const apiUrl =
      role === 'collectors'
        ? ADD_WAREHOUSE_V2(token.realmApiRoute, token.decodeKeycloack)
        : ADD_WAREHOUSE(token.realmApiRoute, token.decodeKeycloack)

    const response = await axiosInstance({
      ...apiUrl,
      baseURL: collectionPointAPI.baseURL,
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    console.error('Create a warehouse failed:', e)
    throw e
  }
}

//edit warehouse
export const editWarehouse = async (data: any, warehouseId: number) => {
  try {
    const token = returnApiToken()
    const role = token.realmApiRoute
    const apiUrl =
      role === 'collectors'
        ? UPDATE_WAREHOUSE_BY_ID_V2(
            token.realmApiRoute,
            warehouseId,
            token.decodeKeycloack
          )
        : UPDATE_WAREHOUSE_BY_ID(
            token.realmApiRoute,
            warehouseId,
            token.decodeKeycloack
          )

    const response = await axiosInstance({
      ...apiUrl,
      baseURL: collectionPointAPI.baseURL,
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    console.error('Edit a warehouse failed:', e)
    throw e
  }
}

//edit warehouse recycle capacity by id
export const editWarehouseRecycleCapacity = async (
  data: any,
  warehouseRecycId: number
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      ...UPDATE_RECYCLE_CAPACITY_BY_ID(warehouseRecycId, token.decodeKeycloack),
      baseURL: collectionPointAPI.baseURL,
      data: data
    })
    return response
  } catch (e) {
    console.error('Edit a warehouse recycle capacity failed:', e)
    return null
  }
}

//edit warehouse status by id
export const editWarehouseStatus = async (data: any, warehouseId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      ...UPDATE_WAREHOUSE_STATUS_BY_ID(warehouseId, token.decodeKeycloack),
      baseURL: collectionPointAPI.baseURL,
      data: data
    })
    return response
  } catch (e) {
    console.error('Edit a warehouse status failed:', e)
    return null
  }
}

//get recycle type
export const getRecycleType = async () => {
  try {
    const response = await axiosInstance({
      ...GET_RECYCLE_TYPE,
      baseURL: administratorAPI.baseURL
    })
    return response
  } catch (e) {
    console.error('Get recycle type failed:', e)
    throw e
  }
}

//get recycle type by id
export const getRecycleTypeById = async (recycTypeId: string) => {
  try {
    const response = await axiosInstance({
      ...GET_RECYCLE_TYPE_BY_ID(recycTypeId),
      baseURL: administratorAPI.baseURL
    })
    return response
  } catch (e) {
    console.error('Get recycle type by id failed:', e)
    return null
  }
}

export const manufacturerGetAllWarehouse = async (
  page: number,
  size: number
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.manufacturer,
      ...MANUFACTURER_GET_ALL_WAREHOUSE(token.decodeKeycloack),
      params: {
        page: page,
        size: size
      },
      headers: {
        AuthToken: token.authToken
      }
    })

    return response
  } catch (e: any) {
    console.error('Get all warehouse failed:', e)

    const errCode = e?.response.status
    if (errCode === 401) {
      localStorage.clear()
      window.location.href = '/'
    }

    return null
  }
}

export const astdSearchWarehouse = async (
  page: number,
  size: number,
  searchValue: string
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_ALL_WAREHOUSE(token.realmApiRoute, searchValue),
      params: {
        page: page,
        size: size
      }
    })

    return response
  } catch (error: any) {
    console.error('Get all warehouse failed:', error)

    const errCode = error?.response.status
    if (errCode === 401) {
      localStorage.clear()
      window.location.href = '/'
    }

    throw error
  }
}
