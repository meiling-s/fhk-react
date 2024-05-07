import { CREATE_COLLECTIONPOINT, CREATE_COLLECTORLIST, CUSTOMER_GET_COLLECTORLIST, EDIT_COLLECTORLIST, FIND_COLLECTIONPOINT_EXIST_BYCONTRACT_ADDRESS, FIND_COLLECTIONPOINT_EXIST_BYNAME, GET_ALL_COLLECTIONPOINT, GET_COLLECTIONPOINT_BY_COLID, GET_COLLECTORLIST, UPDATE_COLLECTIONPOINT } from '../../constants/requests';
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import { returnApiToken } from '../../utils/utils';
import axiosInstance from '../../constants/axiosInstance'


export const getAllPackagingUnit = async (page: number, pageSize: number) => {
  const token = returnApiToken()
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_COLLECTORLIST(token.realmApiRoute, token.decodeKeycloack),
      params: {
        page: page,
        size: pageSize
      }
    });
    console.log('Get all collection point success:', JSON.stringify(response.data));
    return response
  } catch (e) {
    console.error('Get all collection point failed:', e);
    return null;
  }
}

export const createPackagingUnit = async (data: any) => {
  const token = returnApiToken()
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...CREATE_COLLECTORLIST(token.realmApiRoute, token.decodeKeycloack),
      data: data
    })

    return response
  } catch (error) {
    console.error('Get all collection point failed:', error);
    return null;
  }
} 

export const editPackagingUnit = async (data: any, collectorId: string) => {
  const token = returnApiToken()
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...EDIT_COLLECTORLIST(token.realmApiRoute, token.decodeKeycloack, collectorId),
      data: data
    })

    return response
  } catch (error) {
    console.error('Get all collection point failed:', error);
    return null;
  }
} 