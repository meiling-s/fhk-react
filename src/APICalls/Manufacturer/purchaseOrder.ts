import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs'
import {
  GET_PURCHASE_ORDER,
  SEARCH_PURCHASE_ORDER,
  UPDATE_PURCHASE_ORDER_STATUS
} from '../../constants/requests'

import { returnApiToken } from '../../utils/utils'
import { queryPickupOrder } from '../../interfaces/pickupOrder'
import axiosInstance from '../../constants/axiosInstance'

export const getAllPurchaseOrder = async (page: number, size: number) => {
  const auth = returnApiToken()
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...GET_PURCHASE_ORDER(auth.tenantId),
      params: {
        page: page,
        size: size
      }
    })

    return response
  } catch (e) {
    return null
  }
}

export const searchPurchaseOrder = async (
  page: number,
  size: number,
  query?: any
) => {
  const auth = returnApiToken()
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...SEARCH_PURCHASE_ORDER(auth.tenantId),
      params: {
        page: page,
        size: size,
        poId: '',
        fromCreatedAt: '',
        toCreatedAt: '',
        receiverAddr: '',
        recycType: '',
        status: '',
        sellerTenantId: auth.tenantId
      }
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
