import {
  GET_PLATE_NO_LIST,
  GET_COMPACTOR_PROCESS_IN,
  GET_COMPACTOR_PROCESS_IN_ITEM,
  CREATE_COMPACTOR_PROCESS_OUT
} from '../constants/compactorProcess'
import { returnApiToken } from '../utils/utils'
import axiosInstance from '../constants/axiosInstance'

export const getPlateNoList = async () => {
  const token = returnApiToken()
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_PLATE_NO_LIST(token.decodeKeycloack)
    })

    return response
  } catch (e) {
    console.error('getPlateNoList failed:', e)
    throw e
  }
}

export const getCompactorProcessIn = async (
  date?: string,
  plateNo?: string
) => {
  try {
    const token = returnApiToken()

    const params: any = {}
    if (date) params.labelId = date
    if (plateNo) params.frmCreatedDate = plateNo

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_COMPACTOR_PROCESS_IN(token.decodeKeycloack),
      params: params
    })

    return response
  } catch (e) {
    console.error('getCompactorProcessIn failed:', e)
    throw e
  }
}

export const getCompactorProcessInItem = async (
  page: number,
  size: number,
  id?: number[]
) => {
  try {
    const token = returnApiToken()

    const params: any = {
      page: page,
      size: size
    }
    if (id && id.length > 0) {
      params.id = id
    }

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_COMPACTOR_PROCESS_IN_ITEM(token.decodeKeycloack),
      params: params
    })

    return response
  } catch (e) {
    console.error('getCompactorProcessInItem failed:', e)
    throw e
  }
}

export const createCompactorProcessOut = async (data: any) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...CREATE_COMPACTOR_PROCESS_OUT(token.decodeKeycloack),
      data: data
    })

    return response
  } catch (e) {
    console.error('createCompactorProcessOut failed:', e)
    return null
  }
}
