import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs'
import {
  SEARCH_PURCHASE_ORDER,
  UPDATE_PURCHASE_ORDER_STATUS,
  GET_PURCHASE_ORDER_BY_ID,
  GET_ALL_REASON_MANUFACTURER,
  CREATE_PICK_UP_ORDER,
  GET_MANULIST,
  GET_CUSTOMERLIST,
  SEARCH_TENANT_BY_COMPANY_NAME
} from '../../constants/requests'

import { getBaseUrl, returnApiToken } from '../../utils/utils'
import { PurChaseOrder, PurchaseOrderDetail, queryPurchaseOrder } from '../../interfaces/purchaseOrder'
import axiosInstance from '../../constants/axiosInstance'
import { Roles, localStorgeKeyName } from '../../constants/constant'
import { CREATE_PURCHASE_ORDER, UPDATE_PURCHASE_ORDER } from '../../constants/purcahseOrder'
import dayjs from 'dayjs'

export const getAllPurchaseOrder = async (
  page: number,
  size: number,
  query?: queryPurchaseOrder
) => {
  const auth = returnApiToken()
  try {
    let path : string = '';
    const userRole = localStorage.getItem(localStorgeKeyName.role);

    switch(userRole){
      case(Roles.manufacturerAdmin):
        path = 'seller';
        break;
      case(Roles.customerAdmin):
      path = 'cus';
        break;
      default:
        break;
    }


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
      ...SEARCH_PURCHASE_ORDER(auth.tenantId, path),
      params: params
    })

    return response
  } catch (e) {
    throw(e)
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

export const updateStatusPurchaseOrder = async (poId: string, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...UPDATE_PURCHASE_ORDER_STATUS(poId),
      data: data
    })

    return response
  } catch (e) {
    throw (e)
  }
}

export const getPurchaseOrderReason = async () => {
  const auth = returnApiToken()
  try {
    const response = await axiosInstance({
      baseURL: getBaseUrl(),
      ...GET_ALL_REASON_MANUFACTURER(auth.tenantId)
    })

    return response
  } catch (e) {
    throw(e)
  }
}

export const postPurchaseOrder = async (data:PurChaseOrder) => {
  const auth = returnApiToken()
  try{
      const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
          ...CREATE_PURCHASE_ORDER(auth.tenantId),
          data: data
      });
      return response
  } catch (e) {
      throw(e)
  }

}

export const updatetPurchaseOrder = async (data:PurChaseOrder) => {
  const auth = returnApiToken()
  try{
      const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
          ...UPDATE_PURCHASE_ORDER(auth.tenantId),
          data: data
      });
      return response
  } catch (e) {
      return null;
  }

}

export const getManuList = async () => {
  const auth = returnApiToken()
  try{
      const response = await axiosInstance({
      baseURL: getBaseUrl(),
          ...GET_MANULIST(auth.realmApiRoute, auth.decodeKeycloack),
      });
      return response
  } catch (e) {
      return null;
  }
}

export const getCustomerList = async () => {
  const auth = returnApiToken()
  try {
    const response = await axiosInstance({
      baseURL: getBaseUrl(),
      ...GET_CUSTOMERLIST(auth.realmApiRoute, auth.decodeKeycloack)
    })
    return response
  } catch (error) {
    return null
  }
}

export const getCompanyData = async (companyName: string) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
          ...SEARCH_TENANT_BY_COMPANY_NAME(companyName),
      });
      return response
  } catch (error) {
    return null
  }
}