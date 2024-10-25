import { CreateLogisticVehicle, CreateVehicle } from '../../interfaces/vehicles'
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs'
import {
  CREATE_LOGISTIC_VEHICLE,
  DELETE_LOGISTIC_VEHICLE,
  DELETE_VEHICLE,
  EDIT_LOGISTIC_VEHICLE,
  EDIT_VEHICLE,
  GET_LOGISTIC_VEHICLE,
  SEARCH_LOGISTIC_VEHICLE,
  NEW_SEARCH_LOGISTIC_VEHICLE,
  GET_LOGISTIC_VEHICLE_BY_ID,
  GET_VEHICLE_PHOTO
} from '../../constants/requests'
import { returnApiToken } from '../../utils/utils'
import axiosInstance from '../../constants/axiosInstance'

//get all warehouse
export const getAllVehicles = async (page: number, size: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.logistic,
      ...GET_LOGISTIC_VEHICLE(token.decodeKeycloack),
      params: {
        page: page,
        size: size
      },
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

//create warehouse
export const createVehicles = async (data: CreateLogisticVehicle) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...CREATE_LOGISTIC_VEHICLE(token.decodeKeycloack),
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    console.error('Create a vehicle failed:', e)
    return null
  }
}

export const editVehicle = async (
  data: CreateLogisticVehicle,
  vehicleId: number
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...EDIT_LOGISTIC_VEHICLE(token.decodeKeycloack, vehicleId),
      data: data,
      headers: {
        AuthToken: token.authToken,
        'Content-Type': 'application/json'
      }
    })
    return response
  } catch (e) {
    console.error('Edit a vehicle failed:', e)
    throw (e)
  }
}

//edit vehicle status
export const deleteVehicle = async (data: {status: string, version: number}, vehicleId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...DELETE_LOGISTIC_VEHICLE(token.decodeKeycloack, vehicleId),
      data: data,
      headers: {
        AuthToken: token.authToken,
        'Content-Type': 'application/json'
      }
    })
    return response
  } catch (e) {
    console.error('Edit a vehicle failed:', e)
    return null
  }
}

export const searchVehicle = async (vehicleId: string) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.logistic,
      ...SEARCH_LOGISTIC_VEHICLE(token.decodeKeycloack, vehicleId),
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    console.error('Edit a vehicle failed:', e)
    return null
  }
}

export const searchVehicleNew = async (vehicleId?: string, deviceId?: string) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.logistic,
      ...NEW_SEARCH_LOGISTIC_VEHICLE(token.decodeKeycloack, vehicleId, deviceId),
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    console.error('Edit a vehicle failed:', e)
    return null
  }
}

export const getVehicleLogistic = async (vehicleId: number, table: string) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.logistic,
      ...GET_LOGISTIC_VEHICLE_BY_ID(table, vehicleId),
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    console.error('get a vehicle failed:', e)
    return null
  }
}


export const getVehicleImages = async (table: string, vehicleId: number) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.logistic,
      ...GET_VEHICLE_PHOTO(table, vehicleId)
    })

    return response
  } catch (error) {
    console.error('get a vehicle failed:', error)
    return null
  }
}