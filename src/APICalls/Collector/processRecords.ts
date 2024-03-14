import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs'
import {
  GET_PROCESS_OUT,
  GET_PROCESS_OUT_DETAIL,
  CREATE_PROCESS_OUT_ITEM,
  EDIT_PROCESS_OUT_DETAIL_ITEM,
  DELETE_PROCESS_OUT_DETAIL_ITEM,
  DELETE_PROCESS_OUT_RECORD
} from '../../constants/requests'
import { returnApiToken } from '../../utils/utils'
import axiosInstance from '../../constants/axiosInstance'

export const getAllProcessRecord = async (page: number, size: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...GET_PROCESS_OUT(token.decodeKeycloack),
      params: {
        page: page,
        size: size
      }
    })

    return response
  } catch (e) {
    console.error('Get all process record failed:', e)
    return null
  }
}

export const getProcessRecordDetail = async (processOutId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...GET_PROCESS_OUT_DETAIL(token.decodeKeycloack, processOutId )
      
    })

    return response
  } catch (e) {
    console.error('Get process record detail failed:', e)
    return null
  }
}


export const createProcessRecordItem = async (
  data: any,
  processOutDtlId: number
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...CREATE_PROCESS_OUT_ITEM(token.decodeKeycloack, processOutDtlId),
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
  processOutDtlId: number
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...EDIT_PROCESS_OUT_DETAIL_ITEM(token.decodeKeycloack, processOutDtlId),
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
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...DELETE_PROCESS_OUT_RECORD(token.decodeKeycloack, processOutId)
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
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...DELETE_PROCESS_OUT_DETAIL_ITEM(token.decodeKeycloack, processOutDtlId),
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
