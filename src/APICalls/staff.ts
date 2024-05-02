import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import {
  GET_STAFF,
  CREATE_STAFF,
  EDIT_STAFF,
  GET_LOGINID_LIST,
  GET_TITLE_LIST,
  GET_STAFF_LOGISTIC
} from '../constants/requests'
import { returnApiToken } from '../utils/utils'
import axiosInstance from '../constants/axiosInstance'

//get all staff
export const getStaffList = async (page: number, size: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...GET_STAFF(token.tenantId, token.realmApiRoute),
      params: {
        page: page,
        size: size
      }
    })

    return response
  } catch (e) {
    console.error('Get all staff failed:', e)
    return null
  }
}

export const getStaffListLogistic = async (page: number, size: number) => {
  try {
   
    const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...GET_STAFF_LOGISTIC,
      params: {
        page: page,
        size: size
      }
    })

    return response
  } catch (e) {
    console.error('Get all staff logistic failed:', e)
    return null
  }
}

//create staff
export const createStaff = async (data: any) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...CREATE_STAFF(token.realmApiRoute),
      data: data
    })
    console.log("response", createStaff)
    return response
  } catch (e) {
    console.error('Create a staff failed:', e)
    return null
  }
}

//edit staff
export const editStaff = async (data: any, staffId: string) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...EDIT_STAFF(token.tenantId, staffId, token.realmApiRoute),
      data: data
    })
    return response
  } catch (e) {
    console.error(`Edit staff ${staffId} failed:`, e)
    return null
  }
}

//get login id list
export const getLoginIdList = async () => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...GET_LOGINID_LIST(token.tenantId),
      params: {
        page: 0,
        size: 1000
      }
    })

    return response
  } catch (e) {
    console.error('Get all loginId list failed:', e)
    return null
  }
}

//get login id list
export const getStaffTitle = async () => {
  try {
    const token = returnApiToken()
  
    const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...GET_TITLE_LIST(token.decodeKeycloack, token.realmApiRoute),
      params: {
        page: 0,
        size: 1000
      }
    })

    return response
  } catch (e) {
    console.error('Get all loginId list failed:', e)
    return null
  }
}
