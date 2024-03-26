import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import { GET_ALL_JOB_ORDER,  GET_DRIVER_DETAIL_BY_ID,  UPDATE_JOB_ORDER_STATUS } from '../constants/requests'
import {  JoStatus, queryJobOrder } from '../interfaces/JobOrderInterfaces'
import { returnApiToken } from '../utils/utils';
import axiosInstance from '../constants/axiosInstance'

  export const getAllJobOrder = async (query?: queryJobOrder) => {
      const auth = returnApiToken()
      try {
        const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
          ...GET_ALL_JOB_ORDER(auth.decodeKeycloack),
          params: query
        });
        return response
      } catch (e) {
        return null;
      }
    
  }

export const editJobOrderStatus = async (joId: string, data: JoStatus) => {
  const auth = returnApiToken()
  try{
      const response = await axiosInstance({
          ...UPDATE_JOB_ORDER_STATUS(auth.decodeKeycloack, joId),
          baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
          data: data
      });
      return response
  } catch (e) {
      return null;
  }

}

export const getDriverDetailById = async (driverId: string) => {
  const auth = returnApiToken()
  try{
      const response = await axiosInstance({
          ...GET_DRIVER_DETAIL_BY_ID(auth.decodeKeycloack, driverId),
          baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      });
      return response
  } catch (e) {
      return null;
  }

}








