import { AxiosRequestConfig } from 'axios'

//PURCHASE ORDER CUSTOMER
export const GET_PURCHASE_ORDER = (tenantId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/po/cus/${tenantId}`
})

export const SEARCH_PURCHASE_ORDER = (tenantId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/po/cus/search/${tenantId}`
})

export const GET_PURCHASE_ORDER_BY_ID = (poId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/po/${poId}`
})

