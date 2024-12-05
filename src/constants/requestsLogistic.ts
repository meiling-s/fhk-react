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
  toDate: string,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/pu/driver/${table}/${driverId}/${frmDate}/${toDate}`
})

export const GET_DRIVER_DROPOFF_POINT = (
  table: string,
  driverId: number,
  frmDate: string,
  toDate: string,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/drop/driver/${table}/${driverId}/${frmDate}/${toDate}`
})

export const GET_DRIVER_PICKUP_WEIGHT = (
  realmApiRoute: string,
  tenantId: string,
  vehicleId: string
): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/${realmApiRoute}/driver/pickup-weight/${tenantId}/${vehicleId}`
})

export const GET_DRIVER_DROPOFF_WEIGHT = (
  realmApiRoute: string,
  tenantId: string,
  vehicleId: string
): AxiosRequestConfig => ({
  method: "post",
  url: `api/v1/${realmApiRoute}/driver/dropoff-weight/${tenantId}/${vehicleId}`
});
