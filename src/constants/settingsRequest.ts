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

export const CREATE_PRODUCT_SUBTYPE = (productTypeId: string): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/administrator/productSubType/${productTypeId}`,
});

export const EDIT_PRODUCT_SUBTYPE = (productSubtypeId: string): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/productSubType/${productSubtypeId}`,
});

export const GET_PRODUCT_SUBTYPE_LIST: AxiosRequestConfig = {
  method: 'get',
  url: `api/v1/administrator/productSubTypes`,
};

export const CREATE_PRODUCT_ADDON_TYPE = (productSubtypeId: string): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/administrator/productAddonType/${productSubtypeId}`,
});

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

export const GET_PRODUCT_SUBTYPES_BY_PRODUCT_TYPE = (productTypeId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/productSubTypesByProductType/${productTypeId}`,
});

export const GET_PRODUCT_ADDON_TYPES_BY_PRODUCT_SUBTYPE = (productSubTypeId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/productAddonTypesByProductSubType/${productSubTypeId}`,
});
