import { AXIOS_DEFAULT_CONFIGS } from "../../constants/configs";
import {
  GET_DISPOSAL_LOCATION,
  CREATE_DISPOSAL_LOCATION,
  UPDATE_DISPOSAL_LOCATION,
} from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from "../../constants/axiosInstance";
import { CreateDisposalLocation } from "../../interfaces/disposalLocation";

//get all disposal location
export const getAllDisposalLocation = async (page: number, size: number) => {
  try {
    const token = returnApiToken();

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...GET_DISPOSAL_LOCATION(token.realmApiRoute, token.decodeKeycloack),
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
    console.error("Get all disposal location failed:", e);
    return null;
  }
};

// create disposal location
export const createDisposalLocation = async (data: CreateDisposalLocation) => {
  try {
    // const userAccount = await getUserAccount();
    const token = returnApiToken();

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...CREATE_DISPOSAL_LOCATION(token.realmApiRoute, token.decodeKeycloack),
      data: data
    });

    return response;
  } catch (e) {
    console.error("create disposal location failed:", e);
    return null;
  }
};

// update disposal location
export const editDisposalLocation = async (disposalLocId: string, data: CreateDisposalLocation) => {
  try {
    const token = returnApiToken();
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...UPDATE_DISPOSAL_LOCATION(token.realmApiRoute, token.decodeKeycloack, disposalLocId),
      data: data,
    });

    return response;
  } catch (e) {
    console.error("update disposal location failed:", e);
    return null;
  }
};
