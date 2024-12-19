import {
  GET_PROCESS_ORDER,
  CREATE_PROCESSE_ORDER,
  GET_PROCESS_ORDER_BY_ID,
  DELETE_PROCESS_ORDER,
  GET_PROCESS_ORDER_ESTENDDATETIME,
  GET_FACTORIES_LIST
} from '../constants/processOrder'
import { returnApiToken } from '../utils/utils'
import axiosInstance from '../constants/axiosInstance'
import {
  PorQuery,
  CancelFormPor,
  QueryEstEndDatetime
} from '../interfaces/processOrderQuery'

export const getProcessOrder = async (
  page: number,
  size: number,
  query: PorQuery | null
) => {
  try {
    const token = returnApiToken()

    const params: any = {
      page: page,
      size: size,
      sort: ''
    }
    if (query?.labelId) params.labelId = query.labelId
    if (query?.frmCreatedDate) params.frmCreatedDate = query.frmCreatedDate
    if (query?.toCreatedDate) params.toCreatedDate = query.toCreatedDate
    if (query?.status) params.status = query.status

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_PROCESS_ORDER(parseInt(token.tenantId)),
      params: params
    })

    return response
  } catch (e) {
    console.error('Get all POR failed:', e)
    throw e
  }
}

export const getProcessOrderById = async (processOrderId: number) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_PROCESS_ORDER_BY_ID(processOrderId)
    })

    return response
  } catch (e) {
    console.error('Get POR by Id failed:', e)
    throw e
  }
}

export const createProcessOrder = async (data: any) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...CREATE_PROCESSE_ORDER(parseInt(token.tenantId)),
      data: data
    })

    return response
  } catch (e) {
    console.error('Create POR failed:', e)
    return null
  }
}

export const deleteProcessOrder = async (
  data: CancelFormPor,
  processOrderId: number
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...DELETE_PROCESS_ORDER(parseInt(token.tenantId), processOrderId),
      data: data
    })
    return response
  } catch (e: any) {
    console.error('DELETE POR failed:', e)
    throw e
  }
}

export const getEstimateEndTime = async (
  queryEstEndDatetime: QueryEstEndDatetime
) => {
  const token = returnApiToken()
  const params: any = {
    tenantId: token.tenantId,
    processTypeId: queryEstEndDatetime.processTypeId,
    estInWeight: queryEstEndDatetime.estInWeight,
    plannedStartAt: queryEstEndDatetime.plannedStartAt
  }

  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_PROCESS_ORDER_ESTENDDATETIME(),
      params: params
    })

    return response
  } catch (e) {
    console.error('Get getEstimateWeight failed:', e)
    throw e
  }
}

export const getFactories = async (page: number, size: number) => {
  const token = returnApiToken()

  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_FACTORIES_LIST(token.tenantId),
      params: {
        page: page,
        size: size
      }
    })

    return response
  } catch (e) {
    console.error('Get factories failed:', e)
    throw e
  }
}
