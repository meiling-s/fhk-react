import { AxiosRequestConfig } from 'axios';

//tenant manage
export const LOGIN: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/account/login',
};

export const ADD_TENANT: AxiosRequestConfig = {
  method: 'patch',
  url: 'api/v1/account/tenant/astd/addTenant',
};

export const GET_ALL_TENANT: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/account/tenant/astd/tenant'
}

export const GET_TENANT_BY_TENANT_ID: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/account/tenantInvite'
}

export const UPDATE_TENANT_REGISTER: AxiosRequestConfig = {
  method: 'patch',
  url: 'api/v1/account/tenantInvite'
}

//collection point
export const GET_ALL_COLLECTIONPOINT: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/collectors/collectionPoint'
}

export const CREATE_COLLECTIONPOINT: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/collectors/collectionPoint'
}

export const UPDATE_COLLECTIONPOINT: AxiosRequestConfig = {
  method: 'put',
  url: 'api/v1/collectors/collectionPoint'
}

export const FIND_COLLECTIONPOINT_EXIST_BYADDRESS: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/collectors/collectionPoint/byAddress'
}

export const GET_CONTRACT: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/collectors/contract'
}

//common
export const GET_COLLECTIONPOINT_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/administrator/colPointType'
}

export const ADD_COLLECTIONPOINT_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/administrator/colPointType'
}

export const GET_PREMISE_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/administrator/premiseType'
}

export const ADD_PREMISE_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/administrator/premiseType'
}

export const GET_SITE_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/administrator/siteType'
}

export const ADD_SITE_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/administrator/siteType'
}

export const GET_RECYC_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/administrator/recycType'
}

export const ADD_RECYC_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/administrator/recycType'
}