import {
  GET_PROCESS_ORDER,
  CREATE_PROCESSE_ORDER,
  GET_PROCESS_ORDER_BY_ID,
  DELETE_PROCESS_ORDER,
  GET_PROCESS_ORDER_ESTENDDATETIME,
  GET_FACTORIES_LIST
} from '../constants/processOrder'
import { getFormatId, returnApiToken } from '../utils/utils'
import axiosInstance from '../constants/axiosInstance'
import {
  PorQuery,
  CancelFormPor,
  QueryEstEndDatetime
} from '../interfaces/processOrderQuery'

export const getProcessOrder = async (
  page: number,
  size: number,
  query: PorQuery | null,
  sort?: string[]
) => {
  try {
    const token = returnApiToken()
    const tenantId = getFormatId(token.tenantId)

    const params: any = {
      page: page,
      size: size,
      sort: sort
    }
    if (query?.labelId) params.labelId = query.labelId
    if (query?.frmCreatedDate) params.frmCreatedDate = query.frmCreatedDate
    if (query?.toCreatedDate) params.toCreatedDate = query.toCreatedDate
    if (query?.status) params.status = query.status
    if (query?.processTypeId) params.processTypeId = query.processTypeId
    if (query?.productTypeId) params.productTypeId = query.productTypeId

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_PROCESS_ORDER(tenantId),
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
      baseURL: window.baseURL.factory,
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
    const tenantId = getFormatId(token.tenantId)

    const response = await axiosInstance({
      baseURL: window.baseURL.factory,
      ...CREATE_PROCESSE_ORDER(tenantId),
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
    const tenantId = getFormatId(token.tenantId)

    const response = await axiosInstance({
      baseURL: window.baseURL.factory,
      ...DELETE_PROCESS_ORDER(tenantId, processOrderId),
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
  const tenantId = getFormatId(token.tenantId)
  const params: any = {
    tenantId: tenantId,
    processTypeId: queryEstEndDatetime.processTypeId,
    estInWeight: queryEstEndDatetime.estInWeight,
    plannedStartAt: queryEstEndDatetime.plannedStartAt
  }

  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.factory,
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
  const tenantId = getFormatId(token.tenantId)

  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.factory,
      ...GET_FACTORIES_LIST(tenantId),
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
