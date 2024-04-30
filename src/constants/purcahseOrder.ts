import { Axios, AxiosRequestConfig } from 'axios'

export const CREATE_PURCHASE_ORDER = (tenantId: string): AxiosRequestConfig => ({
  method: "post",
  url: `api/v1/administrator/po/${tenantId}`,
});

export const UPDATE_PURCHASE_ORDER = (tenantId: string): AxiosRequestConfig => ({
  method: "put",
  url: `api/v1/administrator/po/${tenantId}`,
});
