import axiosInstance from '../../../constants/axiosInstance';
import {
  CREATE_PRODUCT_TYPE,
  EDIT_PRODUCT_TYPE,
  GET_PRODUCT_TYPE_LIST,
  GET_PRODUCT_TYPE,
  CREATE_PRODUCT_SUBTYPE,
  EDIT_PRODUCT_SUBTYPE,
  GET_PRODUCT_SUBTYPE_LIST,
  GET_PRODUCT_SUBTYPE,
  CREATE_PRODUCT_ADDON_TYPE,
  EDIT_PRODUCT_ADDON_TYPE,
  GET_PRODUCT_ADDON_TYPE_LIST,
  GET_PRODUCT_ADDON_TYPE,
  GET_PRODUCT_SUBTYPES_BY_PRODUCT_TYPE,
  GET_PRODUCT_ADDON_TYPES_BY_PRODUCT_SUBTYPE
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

export const getProductType = async (productTypeId: string) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...GET_PRODUCT_TYPE(productTypeId),
    });

    return response;
  } catch (e: any) {
    console.error('Get Product Type Failed:', e);
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

export const editProductType = async (productTypeId: string, data: any) => {
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

export const getProductSubtype = async (productSubtypeId: string) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...GET_PRODUCT_SUBTYPE(productSubtypeId),
    });

    return response;
  } catch (e: any) {
    console.error('Get Product Subtype Failed:', e);
    throw e;
  }
};

export const createProductSubtype = async (productTypeId: string, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...CREATE_PRODUCT_SUBTYPE(productTypeId),
      data: data,
    });

    return response;
  } catch (error) {
    console.error('Create Product Subtype Failed:', error);
    throw error;
  }
};

export const editProductSubtype = async (productSubtypeId: string, data: any) => {
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

export const getProductAddonType = async (productAddonTypeId: string) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...GET_PRODUCT_ADDON_TYPE(productAddonTypeId),
    });

    return response;
  } catch (e: any) {
    console.error('Get Product Addon Type Failed:', e);
    throw e;
  }
};

export const createProductAddonType = async (productSubtypeId: string, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...CREATE_PRODUCT_ADDON_TYPE(productSubtypeId),
      data: data,
    });

    return response;
  } catch (error) {
    console.error('Create Product Addon Type Failed:', error);
    throw error;
  }
};

export const editProductAddonType = async (productAddonTypeId: string, data: any) => {
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

export const getProductSubtypesByProductType = async (productTypeId: string) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...GET_PRODUCT_SUBTYPES_BY_PRODUCT_TYPE(productTypeId),
    });

    return response;
  } catch (e: any) {
    console.error('Get Product Subtypes by Product Type Failed:', e);
    throw e;
  }
};

export const getProductAddonTypesByProductSubtype = async (productSubtypeId: string) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...GET_PRODUCT_ADDON_TYPES_BY_PRODUCT_SUBTYPE(productSubtypeId),
    });

    return response;
  } catch (e: any) {
    console.error('Get Product Addon Types by Product Subtype Failed:', e);
    throw e;
  }
};
