import { AxiosRequestConfig } from 'axios';

//tenant manage
export const LOGIN: AxiosRequestConfig = {
  method: 'post',
  url: 'api/ac/login',
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

//collection point
export const GET_ALL_COLLECTIONPOINT: AxiosRequestConfig = {
  method: 'get',
  url: 'api/collectors/collectionPoint'
}

export const CREATE_COLLECTIONPOINT: AxiosRequestConfig = {
  method: 'post',
  url: 'api/collectors/collectionPoint'
}

export const UPDATE_COLLECTIONPOINT: AxiosRequestConfig = {
  method: 'put',
  url: 'api/collectors/collectionPoint'
}

export const GET_RECYC_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/collectors/recycType'
}

export const GET_CONTRACT: AxiosRequestConfig = {
  method: 'get',
  url: 'api/collectors/contract'
}

//common
export const GET_COLLECTIONPOINT_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/common/colPointType'
}

export const ADD_COLLECTIONPOINT_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: 'api/common/colPointType'
}

export const GET_PREMISE_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/common/premiseType'
}

export const ADD_PREMISE_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: 'api/common/premiseType'
}

export const GET_SITE_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/common/siteType'
}

export const ADD_SITE_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: 'api/common/siteType'
}