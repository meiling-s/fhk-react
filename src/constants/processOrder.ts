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

export const CREATE_PROCESSE_ORDER = (
  tenantId: number
): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/factory/processOrder/in/${tenantId}`
})


export const DELETE_PROCESS_ORDER = (
  tenantId: number,
  processOrderId: number
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/factory/processOrder/${tenantId}/${processOrderId}`
})
