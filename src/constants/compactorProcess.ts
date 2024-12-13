import { AxiosRequestConfig } from 'axios'

export const GET_PLATE_NO_LIST = (
  table: string,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/checkin/${table}/process/plate`
})

export const GET_COMPACTOR_PROCESS_IN = (
  table: string,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/checkin/${table}/process`
})

export const GET_COMPACTOR_PROCESS_IN_ITEM = (
  table: string,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/checkin/${table}/process/item`
})

export const CREATE_COMPACTOR_PROCESS_OUT = (
  table: string,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/${realmApiRoute}/compactorProcessRequest/${table}`
})
