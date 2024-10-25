import { AxiosRequestConfig } from 'axios';

export const CREATE_PRODUCT_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: `api/v1/administrator/productTypeList`,
};

export const EDIT_PRODUCT_TYPE = (productTypeId: number): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/administrator/productTypeList/${productTypeId}`,
});

export const DELETE_PRODUCT_TYPE = (productTypeId: number): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/productTypeList/${productTypeId}`,
});

export const GET_PRODUCT_TYPE_LIST: AxiosRequestConfig = {
  method: 'get',
  url: `api/v1/administrator/productTypes`,
};
