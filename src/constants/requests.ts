import { AxiosRequestConfig } from 'axios';

export const LOGIN: AxiosRequestConfig = {
  method: 'post',
  url: '/api/v1/login',
};

export const ADD_TENANT: AxiosRequestConfig = {
  method: 'patch',
  url: 'api/v1/tenant/astd/addTenant',
};

export const GET_ALL_TENANT: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/tenant/astd/tenant'
}

export const GET_TENANT_BY_TENANT_ID: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/tenantInvite'
}

export const UPDATE_TENANT_REGISTER: AxiosRequestConfig = {
  method: 'patch',
  url: 'api/v1/tenantInvite'
}