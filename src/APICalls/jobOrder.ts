import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import {
  ASSIGN_DRIVER, REJECT_DRIVER, GET_DRIVER, GET_VEHICLE_LOGISTIC
} from '../constants/requests'
import { returnApiToken } from '../utils/utils'
import axiosInstance from '../constants/axiosInstance'
import { AssignJobDriver, GetDriver, RejectJobDriver } from '../interfaces/pickupOrder'


export const assignDriver = async (data: AssignJobDriver) => {
  try {
    const token = returnApiToken()
    
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...ASSIGN_DRIVER(token.decodeKeycloack),
      data
    })

    return response
  } catch (e) {
    return null
  }
}

export const rejectDriver = async (data: RejectJobDriver, id: any) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...REJECT_DRIVER(token.decodeKeycloack, id),
      data
    })

    return response
  } catch (e) {
    return null
  }
}

export const getDriver = async (page: number, size: number, sort: string) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...GET_DRIVER('company914351'),
      params: {
        page: page,
        size: size,
        sort: sort
      },
      headers: {
        AuthToken: token.authToken
      }
    })

    return response
  } catch (e) {
    return null
  }
}


export const getAllVehiclesLogistic = async (page: number, size: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...GET_VEHICLE_LOGISTIC('company914352'),
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
    return null
  }
}