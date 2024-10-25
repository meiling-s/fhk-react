import axiosInstance from '../../../constants/axiosInstance';
import {
  CREATE_PRODUCT_TYPE,
  EDIT_PRODUCT_TYPE,
  GET_PRODUCT_TYPE_LIST,
  CREATE_PRODUCT_SUBTYPE,
  EDIT_PRODUCT_SUBTYPE,
  GET_PRODUCT_SUBTYPE_LIST,
  CREATE_PRODUCT_ADDON_TYPE,
  EDIT_PRODUCT_ADDON_TYPE,
  GET_PRODUCT_ADDON_TYPE_LIST,
} from '../../../constants/settingsRequest';

// Product Type APIs
export const getProductTypeList = async () => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...GET_PRODUCT_TYPE_LIST,
    });

    return response;
  } catch (e: any) {
    console.error('Get Product Type List Failed:', e);
    throw e;
  }
};

export const createProductType = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...CREATE_PRODUCT_TYPE,
      data: data,
    });

    return response;
  } catch (error) {
    console.error('Create Product Type Failed:', error);
    throw error;
  }
};

export const editProductType = async (productTypeId: number, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...EDIT_PRODUCT_TYPE(productTypeId),
      data: data,
    });

    return response;
  } catch (error) {
    console.error('Edit Product Type Failed:', error);
    throw error;
  }
};

// Product Subtype APIs
export const getProductSubtypeList = async () => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...GET_PRODUCT_SUBTYPE_LIST,
    });

    return response;
  } catch (e: any) {
    console.error('Get Product Subtype List Failed:', e);
    throw e;
  }
};

export const createProductSubtype = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...CREATE_PRODUCT_SUBTYPE,
      data: data,
    });

    return response;
  } catch (error) {
    console.error('Create Product Subtype Failed:', error);
    throw error;
  }
};

export const editProductSubtype = async (productSubtypeId: number, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...EDIT_PRODUCT_SUBTYPE(productSubtypeId),
      data: data,
    });

    return response;
  } catch (error) {
    console.error('Edit Product Subtype Failed:', error);
    throw error;
  }
};

// Product Addon Type APIs
export const getProductAddonTypeList = async () => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...GET_PRODUCT_ADDON_TYPE_LIST,
    });

    return response;
  } catch (e: any) {
    console.error('Get Product Addon Type List Failed:', e);
    throw e;
  }
};

export const createProductAddonType = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...CREATE_PRODUCT_ADDON_TYPE,
      data: data,
    });

    return response;
  } catch (error) {
    console.error('Create Product Addon Type Failed:', error);
    throw error;
  }
};

export const editProductAddonType = async (productAddonTypeId: number, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...EDIT_PRODUCT_ADDON_TYPE(productAddonTypeId),
      data: data,
    });

    return response;
  } catch (error) {
    console.error('Edit Product Addon Type Failed:', error);
    throw error;
  }
};
