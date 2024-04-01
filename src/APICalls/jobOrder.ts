import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import {
  ASSIGN_DRIVER, REJECT_DRIVER, GET_DRIVER, GET_VEHICLE_LOGISTIC, GET_ALL_JOB_ORDER, UPDATE_JOB_ORDER_STATUS, GET_DRIVER_DETAIL_BY_ID
} from '../constants/requests'
import { returnApiToken } from '../utils/utils'
import axiosInstance from '../constants/axiosInstance'
import { AssignJobDriver, GetDriver, RejectJobDriver } from '../interfaces/pickupOrder'
import { JoStatus, queryJobOrder } from '../interfaces/JobOrderInterfaces'


export const getAllJobOrder = async (query?: queryJobOrder) => {
  const auth = returnApiToken()
  try {
    const response = await axiosInstance({
    baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...GET_ALL_JOB_ORDER(auth.decodeKeycloack),
      params: query
    });
    return response
  } catch (e) {
    return null;
  }

}

export const editJobOrderStatus = async (joId: string, data: JoStatus) => {
const auth = returnApiToken()
try{
    const response = await axiosInstance({
        ...UPDATE_JOB_ORDER_STATUS(auth.decodeKeycloack, joId),
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
        data: data
    });
    return response
} catch (e) {
    return null;
}

}

export const getDriverDetailById = async (driverId: string) => {
const auth = returnApiToken()
try{
    const response = await axiosInstance({
        ...GET_DRIVER_DETAIL_BY_ID(auth.decodeKeycloack, driverId),
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
    });
    return response
} catch (e) {
    return null;
}

}

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
      ...GET_DRIVER(token.decodeKeycloack),
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
      ...GET_VEHICLE_LOGISTIC(token.decodeKeycloack),
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