import { AxiosRequestConfig } from 'axios'

export const GET_PROCESS_ORDER = (tenantId: number): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/factory/processOrder/headers/${tenantId}`
})

export const GET_PROCESS_ORDER_BY_ID = (
  processOrderId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/factory/processOrder/details/${processOrderId}`
})

export const GET_PROCESS_ORDER_ESTENDDATETIME = (): AxiosRequestConfig => ({
  method: 'get',
  url: 'api/v1/factory/processOrder/estEndDatetime'
})

export const GET_FACTORIES_LIST = (tenantId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/factory/getFactories/${tenantId}`
})

export const CREATE_PROCESSE_ORDER = (
  tenantId: number
): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/factory/processOrder/header/${tenantId}`
})

export const DELETE_PROCESS_ORDER = (
  tenantId: number,
  processOrderId: number
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/factory/processOrder/${tenantId}/${processOrderId}`
})
