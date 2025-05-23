import { AXIOS_DEFAULT_CONFIGS } from "../constants/configs";
import {
  GET_USER_MANUFACTURER_LIST,
  CREATE_USER_MANUFACTURER,
  UPDATE_USER_MANUFACTURER,
  DELETE_USER_MANUFACTURER,
} from "../constants/requests";
import { returnApiToken } from "../utils/utils";
import axiosInstance from "../constants/axiosInstance";
import { staffQuery } from "../interfaces/staff";

// get all the user account
export const getAllUserManufacturer = async (page: number, size: number, query: null | staffQuery ) => {
  const token = returnApiToken();
  const params: any = {
    page: page,
    size: size
  }
  if (query?.staffId) params.staffId = query.staffId
  if (query?.staffName) params.staffName = query.staffName

  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_USER_MANUFACTURER_LIST(token.tenantId),
      params: params
    });
    return response;
  } catch (e) {
    console.error("Get all User Account failed:", e);
    throw(e)
  }
};

export const postUserManufacturer = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...CREATE_USER_MANUFACTURER,
      data: data,
    });
    return response;
  } catch (e) {
    console.error(" create User Account failed:", e);
    return null;
  }
};

export const updateUserManufacturer = async (loginId: string, data: any) => {
  const token = returnApiToken();
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...UPDATE_USER_MANUFACTURER(token.tenantId, loginId),
      data: data,
    });
    return response;
  } catch (e) {
    console.error("update User Account failed:", e);
    return null;
  }
};

export const deleteUserAccount = async (loginId: string, data: any) => {
  const token = returnApiToken();
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...DELETE_USER_MANUFACTURER(loginId),
      data: data,
    });
    return response;
  } catch (e) {
    console.error("delete User Account failed:", e);
    return null;
  }
};
