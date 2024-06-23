import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs'
import {
  GET_PROCESS_OUT,
  GET_PROCESS_IN_BY_ID,
  GET_PROCESS_OUT_DETAIL,
  CREATE_PROCESS_OUT_ITEM,
  EDIT_PROCESS_OUT_DETAIL_ITEM,
  DELETE_PROCESS_OUT_DETAIL_ITEM,
  DELETE_PROCESS_OUT_RECORD
} from '../../constants/requests'
import { returnApiToken } from '../../utils/utils'
import axiosInstance from '../../constants/axiosInstance'
import { queryProcessRecord } from '../../interfaces/processRecords'

export const getAllProcessRecord = async (page: number, size: number, query?:queryProcessRecord ) => {
  try {
    const token = returnApiToken()

    const params: any = {
      page: page,
      size: size
    }
    if (query?.processOutId) params.processOutId = query.processOutId
    if (query?.processType) params.processType = query.processType
    if (query?.processAddress) params.processAddress = query.processAddress

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...GET_PROCESS_OUT(token.decodeKeycloack, token.realmApiRoute),
      params: params
    })

    return response
  } catch (e:any) {
    console.error('Get all process record failed:', e)
    throw(e)
  }
}


export const getProcessRecordDetail = async (processOutId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...GET_PROCESS_OUT_DETAIL(token.decodeKeycloack, processOutId, token.realmApiRoute )
      
    })

    return response
  } catch (e) {
    console.error('Get process record detail failed:', e)
    return null
  }
}


export const getProcessIn = async (processInId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...GET_PROCESS_IN_BY_ID(token.decodeKeycloack, processInId, token.realmApiRoute )
      
    })

    return response
  } catch (e:any) {
    console.error('Get process record detail failed:', e)
    throw(e)
  }
}


export const createProcessRecordItem = async (
  data: any,
  processOutId: number
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...CREATE_PROCESS_OUT_ITEM(token.decodeKeycloack, processOutId, token.realmApiRoute),
      data: data
    })

    return response
  } catch (e) {
    console.error('create process item failed:', e)
    return null
  }
}

export const editProcessRecordItem = async (
  data: any,
  processOutId: number,
  processOutDtlId: number
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...EDIT_PROCESS_OUT_DETAIL_ITEM(token.decodeKeycloack, processOutId, processOutDtlId, token.realmApiRoute),
      data: data,
    })

    return response
  } catch (e) {
    console.error('create process item failed:', e)
    return null
  }
}

export const deleteProcessOutRecord = async (
  processOutId: number,
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...DELETE_PROCESS_OUT_RECORD(token.decodeKeycloack, processOutId, token.realmApiRoute)
    })

    return response
  } catch (e) {
    console.error('deleteProcessOutRecord failed:', e)
    return null
  }
}

export const deleteProcessOutItem = async (
  data: string,
  processOutDtlId: number,
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...DELETE_PROCESS_OUT_DETAIL_ITEM(token.decodeKeycloack, processOutDtlId, token.realmApiRoute),
      data: data,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response
  } catch (e) {
    console.error('Get all vehicle failed:', e)
    return null
  }
}

