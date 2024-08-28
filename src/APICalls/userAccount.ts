import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs';
import {
  GET_USER_ACCOUNT_LIST,
  CREATE_USER_ACCOUNT,
  UPDATE_USER_ACCOUNT,
  DELETE_USER_ACCOUNT,
  CREATE_USER_ACTIVITY,
  GET_USER_ACCOUNT_LIST_PAGING
} from "../constants/requests";
import { returnApiToken } from "../utils/utils";
import axiosInstance from '../constants/axiosInstance'
import { UserActivity } from '../interfaces/common';

// get all the user account
export const getAllUserAccount = async () => {
  const token = returnApiToken()
    try {
        const response = await axiosInstance({
            baseURL: window.baseURL.collector,
            ...GET_USER_ACCOUNT_LIST(token.tenantId),
        });
        return response;
    } catch (e) {
        console.error("Get all User Account failed:", e);
        throw(e)
    }
};

export const getUserAccountPaging = async (page: number, size: number) => {
    const token = returnApiToken()
      try {
          const response = await axiosInstance({
              baseURL: window.baseURL.collector,
              ...GET_USER_ACCOUNT_LIST_PAGING(token.tenantId),
              params: {
                page,
                size
            }
          });
          return response;
      } catch (e) {
          console.error("Get all User Account failed:", e);
          throw(e)
      }
  };

export const postUserAccount = async (data: any) => {
    try {
        const response = await axiosInstance({
            baseURL: window.baseURL.collector,
            ...CREATE_USER_ACCOUNT,
            data: data
        });
        return response;
    } catch (e: any) {
        if (e.response) {
            const response = e.response.data.status
            return response
          } else {
            console.error(" create User Account failed:", e);
            return null;
          }
    }
};

export const updateUserAccount = async (loginId: string, data: any) => {
  const token = returnApiToken()
    try {
        const response = await axiosInstance({
            baseURL: window.baseURL.collector,
            ...UPDATE_USER_ACCOUNT(loginId),
            data: data
        });
        return response;
    } catch (e) {
        console.error("update User Account failed:", e);
        return null;
    }
};

export const deleteUserAccount = async (loginId: string, data: any) => {
  const token = returnApiToken()
    try {
        const response = await axiosInstance({
            baseURL: window.baseURL.collector,
            ...DELETE_USER_ACCOUNT(loginId),
            data: data
        });
        return response;
    } catch (e) {
        console.error("delete User Account failed:", e);
        return null;
    }
};

export const createUserActivity = async (loginId: string, data: UserActivity) => {
    const token = returnApiToken()
      try {
          const response = await axiosInstance({
              baseURL: window.baseURL.administrator,
              ...CREATE_USER_ACTIVITY(loginId),
              data: data
          });
          return response;
      } catch (e) {
          console.error("createUserActivityfailed:", e);
          return null;
      }
  };
