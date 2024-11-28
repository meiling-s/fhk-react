import { AxiosRequestConfig } from 'axios'

export const CREATE_TENANT = (
  realmApiRoute: string,
): AxiosRequestConfig => ({
  method: 'post',
  url: `api/${realmApiRoute}/tenant`,
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
  },
})