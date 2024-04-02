import { AXIOS_DEFAULT_CONFIGS } from "../../constants/configs";
import {
  GET_DENIAL_REASON,
  CREATE_DENIAL_REASON,
  UPDATE_DENIAL_REASON,
} from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from "../../constants/axiosInstance";
import { CreateDenialReason } from "../../interfaces/denialReason";

//get all denial reasons
export const getAllDenialReason = async (page: number, size: number) => {
  try {
    const token = returnApiToken();

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...GET_DENIAL_REASON(token.realmApiRoute, token.tenantId),
      params: {
        page: page,
        size: size,
      },
      headers: {
        AuthToken: token.authToken,
      },
    });

    return response;
  } catch (e) {
    console.error("Get all denial reason failed:", e);
    return null;
  }
};

// create denial reason
export const createDenialReason = async (data: CreateDenialReason) => {
  try {
    // const userAccount = await getUserAccount();
    const token = returnApiToken();

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...CREATE_DENIAL_REASON(token.realmApiRoute, ),
      data: { ...data, tenantId: token.tenantId, status: "ACTIVE" },
      headers: {
        AuthToken: token.authToken,
      },
    });

    return response;
  } catch (e) {
    console.error("create denial reason failed:", e);
    return null;
  }
};

// update denial reason
export const editDenialReason = async (reasonId: number, data: CreateDenialReason) => {
  try {
    const token = returnApiToken();
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...UPDATE_DENIAL_REASON(token.realmApiRoute, token.tenantId, reasonId),
      data: data,
    });

    return response;
  } catch (e) {
    console.error("update denial reason failed:", e);
    return null;
  }
};
