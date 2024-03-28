import { AXIOS_DEFAULT_CONFIGS } from "../../constants/configs";
import {
  GET_STAFF_TITLE,
  CREATE_STAFF_TITLE,
  UPDATE_STAFF_TITLE,
} from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from "../../constants/axiosInstance";
import { CreateStaffTitle } from "../../interfaces/staffTitle";

//get all staff title
export const getAllStaffTitle = async (page: number, size: number) => {
  try {
    const token = returnApiToken();

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...GET_STAFF_TITLE(token.decodeKeycloack),
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
    return null;
  }
};

// create staff title
export const createStaffTitle = async (data: CreateStaffTitle) => {
  try {
    // const userAccount = await getUserAccount();
    const token = returnApiToken();

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...CREATE_STAFF_TITLE(),
      data: { ...data, status: "ACTIVE" },
      headers: {
        AuthToken: token.authToken,
      },
    });

    return response;
  } catch (e) {
    console.error("Get all vehicle failed:", e);
    return null;
  }
};

// update staff title
export const editStaffTitle = async (reasonId: number, data: CreateStaffTitle) => {
  try {
    const token = returnApiToken();
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...UPDATE_STAFF_TITLE(token.decodeKeycloack, reasonId),
      data: data,
    });

    return response;
  } catch (e) {
    console.error("Get all staff title failed:", e);
    return null;
  }
};
