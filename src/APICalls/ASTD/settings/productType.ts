import axiosInstance from '../../../constants/axiosInstance'
import {
  CREATE_PRODUCT_TYPE,
  DELETE_PRODUCT_TYPE,
  EDIT_PRODUCT_TYPE,
  GET_PRODUCT_TYPE_LIST,
} from '../../../constants/settingsRequest'


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
}

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
}

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
}

export const deleteProductType = async (productTypeId: number, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...DELETE_PRODUCT_TYPE(productTypeId),
      data: data,
    });

    return response;
  } catch (error) {
    console.error('Delete Product Type Failed:', error);
    throw error;
  }
}
