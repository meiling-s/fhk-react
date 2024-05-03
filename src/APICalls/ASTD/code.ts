import axiosInstance from '../../constants/axiosInstance'
import {
    CREATE_RECYC_CODE,
    DELETE_RECYC_CODE,
    GET_DATE_FORMAT, UPDATE_DATE_FORMAT, UPDATE_RECYC_CODE,
} from '../../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import { returnApiToken } from '../../utils/utils';

export const createCodeData = async (data: any) => {
  try {
    const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...CREATE_RECYC_CODE,
      data: data
    });

    return response
  } catch (e: any) {
    console.error('Get Currency Failed:', e)
    return null
  }
}

export const updateCodeData = async (data: any, codeId: number) => {
    try {
      const response = await axiosInstance({
          baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
        ...UPDATE_RECYC_CODE(codeId),
        data: data
      });
  
      return response
    } catch (e: any) {
      console.error('Get Currency Failed:', e)
      return null
    }
  }

  export const deleteCodeData = async (data: any, codeId: number) => {
    try {
      const response = await axiosInstance({
          baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
        ...DELETE_RECYC_CODE(codeId),
        data: data
      });
  
      return response
    } catch (e: any) {
      console.error('Get Currency Failed:', e)
      return null
    }
  }