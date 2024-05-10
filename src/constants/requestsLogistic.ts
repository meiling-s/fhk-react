import { AxiosRequestConfig } from 'axios'

//LOGISTIC DASHBOARD
export const GET_DRIVER_DETAIL = (
  table: string,
  driverId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/driver/${table}/${driverId}`
})

export const GET_DRIVER_PICKUP_POINT = (
  table: string,
  driverId: number,
  frmDate: string,
  toDate: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/pu/driver/${table}/${driverId}/${frmDate}/${toDate}`
})

export const GET_DRIVER_DROPOFF_POINT = (
  table: string,
  driverId: number,
  frmDate: string,
  toDate: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/drop/driver/${table}/${driverId}/${frmDate}/${toDate}`
})
