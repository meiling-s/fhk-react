import { AXIOS_DEFAULT_CONFIGS } from "../constants/configs";
import {
  GET_STAFF_ENQUIRY,
  CREATE_STAFF_ENQUIRY,
  EDIT_STAFF_ENQUIRY,
  DELETE_STAFF_ENQUIRY,
} from "../constants/requests";
import { returnApiToken } from "../utils/utils";
import axiosInstance from "../constants/axiosInstance";

//get all staff
export const getStaffEnquiryList = async (page: number, size: number) => {
  try {
    const token = returnApiToken();

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_STAFF_ENQUIRY(token.tenantId),
      params: {
        page: page,
        size: size,
      },
    });

    return response;
  } catch (e) {
    console.error("Get all staff failed:", e);
    return null;
  }
};
//create staff
export const createStaffEnquiry = async (data: any) => {
  try {
    const token = returnApiToken();

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...CREATE_STAFF_ENQUIRY,
      data: data,
    });
    console.log("response", response);
    return response;
  } catch (e) {
    console.error("Create a staff failed:", e);
    return null;
  }
};

//edit staff
export const editStaffEnquiry = async (data: any, staffId: string) => {
  try {
    const token = returnApiToken();

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...EDIT_STAFF_ENQUIRY(token.tenantId, staffId),
      data: data,
    });
    return response;
  } catch (e) {
    console.error(`Edit staff ${staffId} failed:`, e);
    return null;
  }
};

//delete staff
export const deleteStaffEnquiry = async (data: any, staffId: string) => {
  try {
    const token = returnApiToken();

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...DELETE_STAFF_ENQUIRY(token.tenantId, staffId),
      data: data,
    });
    return response;
  } catch (e) {
    console.error(`Delete staff ${staffId} failed:`, e);
    return null;
  }
};

// //get login id list
// export const getLoginIdList = async () => {
//   try {
//     const token = returnApiToken()

//     const response = await axiosInstance({
//         baseURL: window.baseURL.collector,
//       ...GET_LOGINID_LIST(token.tenantId),
//       params: {
//         page: 0,
//         size: 20
//       }
//     })

//     return response
//   } catch (e) {
//     console.error('Get all loginId list failed:', e)
//     return null
//   }
// }

// //get login id list
// export const getStaffTitle = async () => {
//   try {
//     const token = returnApiToken()

//     const response = await axiosInstance({
//         baseURL: window.baseURL.collector,
//       ...GET_TITLE_LIST(token.decodeKeycloack),
//       params: {
//         page: 0,
//         size: 20
//       }
//     })

//     return response
//   } catch (e) {
//     console.error('Get all loginId list failed:', e)
//     return null
//   }
// }
