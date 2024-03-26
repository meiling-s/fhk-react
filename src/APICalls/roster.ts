import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import {
  GET_ROSTER_LIST,
  CREATE_ROSTER,
  ADD_STAFF_ROSTER,
  DELETE_STAFF_ROSTER,
  UPDATE_ROSTER,
  CANCEL_ROSTER
} from '../constants/requests'
import { returnApiToken } from '../utils/utils'
import axiosInstance from '../constants/axiosInstance'

//get all roster by tenant
export const getRosterList = async (startAt: string) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...GET_ROSTER_LIST(token.tenantId, startAt),
    })

    return response
  } catch (e) {
    console.error('Get all roster failed:', e)
    return null
  }
}

export const createRoster = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...CREATE_ROSTER,
      data: data
    })

    return response
  } catch (e) {
    console.error('create roster failed:', e)
    return null
  }
}

export const addRosterStaff = async (rosterId: any, staffId: string) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...ADD_STAFF_ROSTER(token.tenantId, rosterId, staffId)
    })

    return response
  } catch (e) {
    console.error('add roster staff failed:', e)
    return null
  }
}

export const deleteRosterStaff = async (rosterId: any, staffId: string) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...DELETE_STAFF_ROSTER(token.tenantId, rosterId, staffId)
    })

    return response
  } catch (e) {
    console.error('delete roster staff failed:', e)
    return null
  }
}

export const updateRoster = async (data: any, rosterId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...UPDATE_ROSTER(token.tenantId, rosterId),
      data: data
    })

    return response
  } catch (e) {
    console.error('Get all roster failed:', e)
    return null
  }
}

export const cancelRoster = async (data: any, rosterId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...CANCEL_ROSTER(token.tenantId, rosterId),
      data: data
    })

    return response
  } catch (e) {
    console.error('Get all roster failed:', e)
    return null
  }
}