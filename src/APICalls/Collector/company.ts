import { AXIOS_DEFAULT_CONFIGS } from "../../constants/configs";
import {
  GET_COMPANY,
  CREATE_COMPANY,
  UPDATE_COMPANY,
} from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from "../../constants/axiosInstance";
import { CreateCompany, UpdateCompany } from "../../interfaces/company";

//get all company
export const getAllCompany = async (companyType: string, page: number, size: number) => {
  try {
    const token = returnApiToken();
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...GET_COMPANY(token.realmApiRoute, token.decodeKeycloack, companyType),
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
    console.error("Get all company failed:", e);
    return null;
  }
};

// create company
export const createCompany = async ( companyType: string, data: CreateCompany) => {
  try {
    // const userAccount = await getUserAccount();
    const token = returnApiToken();

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...CREATE_COMPANY(token.realmApiRoute, token.decodeKeycloack, companyType),
      data: data
    });

    return response;
  } catch (e) {
    console.error("create company failed:", e);
    return null;
  }
};

// update company
export const editCompany = async ( companyType: string, companyId: string, data: UpdateCompany) => {
  try {
    const token = returnApiToken();
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...UPDATE_COMPANY(token.realmApiRoute, token.decodeKeycloack, companyType, companyId),
      data: data,
    });

    return response;
  } catch (e) {
    console.error("update company failed:", e);
    return null;
  }
};
