import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs'
import {
  GET_PURCHASE_ORDER,
  SEARCH_PURCHASE_ORDER,
  GET_PURCHASE_ORDER_BY_ID,
} from '../../constants/requestsCustomer'
import { UPDATE_PURCHASE_ORDER } from '../../constants/requests'

import { returnApiToken } from '../../utils/utils'
import { PurChaseOrder, queryPurchaseOrder } from '../../interfaces/purchaseOrder'
import axiosInstance from '../../constants/axiosInstance'
import dayjs from 'dayjs'

export const getAllPurchaseOrder = async ( page: number, size: number, query?: queryPurchaseOrder) => {
  const auth = returnApiToken()
  try {
    const params: any = {
      page: page,
      size: size
    }

    if (query?.poId) params.poId = query.poId
    if (query?.fromCreatedAt) params.fromCreatedAt = dayjs(query.fromCreatedAt).format('YYYY-MM-DD')
    if (query?.toCreatedAt) params.toCreatedAt = dayjs(query.toCreatedAt).format('YYYY-MM-DD')
    if (query?.receiverAddr) params.receiverAddr = query.receiverAddr
    if (query?.recycType) params.recycType = query.recycType
    if (query?.status) params.status = query.status

    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...GET_PURCHASE_ORDER(auth.tenantId),
      params: params
    })

    return response
  } catch (e) {
    return null
  }
}

export const searchPurchaseOrder = async ( page: number, size: number, query?: queryPurchaseOrder) => {
  const auth = returnApiToken()
  try {
    const params: any = {
      page: page,
      size: size
    }

    if (query?.poId) params.poId = query.poId
    if (query?.fromCreatedAt) params.fromCreatedAt = query.fromCreatedAt
    if (query?.toCreatedAt) params.toCreatedAt = query.toCreatedAt
    if (query?.receiverAddr) params.receiverAddr = query.receiverAddr
    if (query?.recycType) params.recycType = query.recycType
    if (query?.status) params.status = query.status

    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...SEARCH_PURCHASE_ORDER(auth.tenantId),
      params: params
    })

    return response
  } catch (e) {
    return null
  }
}

export const getPurchaseOrderById = async (poId: string) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...GET_PURCHASE_ORDER_BY_ID(poId)
    })

    return response
  } catch (e) {
    return null
  }
}

export const UpdatePurchaseOrder = async (poId: string, data: PurChaseOrder) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...UPDATE_PURCHASE_ORDER(poId),
      data
    })

    return response
  } catch (e) {
    return null
  }
}
