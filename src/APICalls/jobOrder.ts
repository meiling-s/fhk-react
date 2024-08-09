import {
  ASSIGN_DRIVER, REJECT_REASSIGN_DRIVER, GET_DRIVER, GET_VEHICLE_LOGISTIC, GET_ALL_JOB_ORDER, UPDATE_JOB_ORDER_STATUS, GET_DRIVER_DETAIL_BY_ID,
  GET_VEHICLE_PLATE_LIST,
  GET_DRIVER_DATA
} from '../constants/requests'
import { returnApiToken } from '../utils/utils'
import axiosInstance from '../constants/axiosInstance'
import { AssignJobDriver, GetDriver, RejectJobDriver } from '../interfaces/pickupOrder'
import { JoStatus, queryJobOrder } from '../interfaces/JobOrderInterfaces'

export const getAllJobOrder = async (query?: queryJobOrder) => {
  const auth = returnApiToken()
  try {
    const response = await axiosInstance({
    baseURL: window.baseURL.administrator,
      ...GET_ALL_JOB_ORDER(auth.decodeKeycloack),
      params: query
    });
    return response
  } catch (e) {
    throw(e)
  }

}

export const editJobOrderStatus = async (joId: string, data: JoStatus) => {
const auth = returnApiToken()
try{
    const response = await axiosInstance({
        ...UPDATE_JOB_ORDER_STATUS(auth.decodeKeycloack, joId),
        baseURL: window.baseURL.administrator,
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
        baseURL: window.baseURL.administrator,
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
      baseURL: window.baseURL.collector,
      ...ASSIGN_DRIVER(token.decodeKeycloack),
      data
    })

    return response
  } catch (e) {
    return null
  }
}

export const rejectAssginDriver = async (data: AssignJobDriver, id: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...REJECT_REASSIGN_DRIVER(token.decodeKeycloack, id),
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
      baseURL: window.baseURL.collector,
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
    throw(e)
  }
}


export const getAllVehiclesLogistic = async (page: number, size: number) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
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
    throw(e)
  }
}

export const getVehiclePlateList = async () => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_VEHICLE_PLATE_LIST(token.tenantId),
      headers: {
        AuthToken: token.authToken
      }
    })
    
    return response

  } catch (error) {
    throw(error)
  }
}

export const getVehicleDriverList = async () => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_DRIVER_DATA(token.tenantId),
      headers: {
        AuthToken: token.authToken
      }
    })
    
    return response
  } catch (error) {
    throw(error)
  }
}