import { AxiosRequestConfig } from 'axios';

export const LOGIN: AxiosRequestConfig = {
  method: 'post',
  url: '/api/ac/login',
};

export const ADD_TENANT: AxiosRequestConfig = {
  method: 'patch',
  url: 'api/ac/tenant/astd/addTenant',
};

export const GET_ALL_TENANT: AxiosRequestConfig = {
  method: 'get',
  url: 'api/ac/tenant/astd/tenant'
}

export const GET_TENANT_BY_TENANT_ID: AxiosRequestConfig = {
  method: 'get',
  url: 'api/ac/tenantInvite'
}

export const UPDATE_TENANT_REGISTER: AxiosRequestConfig = {
  method: 'patch',
  url: 'api/ac/tenantInvite'
}

export const GET_ALL_COLLECTIONPOINT: AxiosRequestConfig = {
  method: 'get',
  url: 'api/collectors/collectionPoint'
}

export const CREATE_COLLECTIONPOINT: AxiosRequestConfig = {
  method: 'post',
  url: 'api/collectors/collectionPoint'
}