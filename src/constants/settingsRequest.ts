import { AxiosRequestConfig } from 'axios';

export const CREATE_PRODUCT_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: `api/v1/administrator/productType`,
};

export const EDIT_PRODUCT_TYPE = (productTypeId: string): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/productType/${productTypeId}`,
});

export const GET_PRODUCT_TYPE_LIST: AxiosRequestConfig = {
  method: 'get',
  url: `api/v1/administrator/productTypes`,
};

export const CREATE_PRODUCT_SUBTYPE: AxiosRequestConfig = {
  method: 'post',
  url: `api/v1/administrator/productSubType`,
};

export const EDIT_PRODUCT_SUBTYPE = (productSubtypeId: string): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/productSubType/${productSubtypeId}`,
});

export const GET_PRODUCT_SUBTYPE_LIST: AxiosRequestConfig = {
  method: 'get',
  url: `api/v1/administrator/productSubtypes`,
};

export const CREATE_PRODUCT_ADDON_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: `api/v1/administrator/productAddonType`,
};

export const EDIT_PRODUCT_ADDON_TYPE = (productAddonTypeId: string): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/productAddonType/${productAddonTypeId}`,
});

export const GET_PRODUCT_ADDON_TYPE_LIST: AxiosRequestConfig = {
  method: 'get',
  url: `api/v1/administrator/productAddonTypes`,
};

export const GET_PRODUCT_TYPE = (productTypeId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/productType/${productTypeId}`,
});

export const GET_PRODUCT_SUBTYPE = (productSubtypeId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/productSubType/${productSubtypeId}`,
});

export const GET_PRODUCT_ADDON_TYPE = (productAddonTypeId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/productAddonType/${productAddonTypeId}`,
});