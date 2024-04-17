import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs'
import {
  SEARCH_PURCHASE_ORDER,
  UPDATE_PURCHASE_ORDER_STATUS
} from '../../constants/requests'

import { returnApiToken } from '../../utils/utils'
import { queryPurchaseOrder } from '../../interfaces/purchaseOrder'
import axiosInstance from '../../constants/axiosInstance'

export const getAllPurchaseOrder = async (
  page: number,
  size: number,
  query?: queryPurchaseOrder
) => {
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
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...SEARCH_PURCHASE_ORDER(auth.tenantId),
      params: params
    })

    return response
  } catch (e) {
    return null
  }
}

export const updateStatusPurchaseOrder = async (poId: string, data: any) => {
  const auth = returnApiToken()
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...UPDATE_PURCHASE_ORDER_STATUS(poId),
      data: data
    })

    return response
  } catch (e) {
    return null
  }
}
