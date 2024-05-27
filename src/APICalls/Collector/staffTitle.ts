import { AXIOS_DEFAULT_CONFIGS } from "../../constants/configs";
import {
  GET_STAFF_TITLE,
  CREATE_STAFF_TITLE,
  UPDATE_STAFF_TITLE,
} from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from "../../constants/axiosInstance";
import { CreateStaffTitle, UpdateStaffTitle } from "../../interfaces/staffTitle";

//get all staff title
export const getAllStaffTitle = async (page: number, size: number) => {
  try {
    const token = returnApiToken();

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_STAFF_TITLE(token.realmApiRoute, token.decodeKeycloack),
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
    console.error("Get all staff title failed:", e);
    throw(e)
  }
};

// create staff title
export const createStaffTitle = async (data: CreateStaffTitle) => {
  try {
    // const userAccount = await getUserAccount();
    const token = returnApiToken();

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...CREATE_STAFF_TITLE(token.realmApiRoute, token.decodeKeycloack),
      data: data
    });

    return response;
  } catch (e) {
    console.error("create staff title failed:", e);
    throw(e)
  }
};

// update staff title
export const editStaffTitle = async (titleId: string, data: UpdateStaffTitle) => {
  try {
    const token = returnApiToken();
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...UPDATE_STAFF_TITLE(token.realmApiRoute, token.decodeKeycloack, titleId),
      data: data,
    });

    return response;
  } catch (e) {
    console.error("update staff title failed:", e);
    throw(e)
  }
};
