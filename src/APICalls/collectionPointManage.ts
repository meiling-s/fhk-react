import { CREATE_COLLECTIONPOINT, FIND_COLLECTIONPOINT_EXIST_BYCONTRACT_ADDRESS, FIND_COLLECTIONPOINT_EXIST_BYNAME, GET_ALL_COLLECTIONPOINT, GET_COLLECTIONPOINT_BY_COLID, UPDATE_COLLECTIONPOINT } from '../constants/requests';
import { createCP, updateCP } from '../interfaces/collectionPoint';
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs';
import { returnApiToken } from '../utils/utils';
import axiosInstance from '../constants/axiosInstance'

const token = returnApiToken()

export const getAllCollectionPoint = async () => {

  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...GET_ALL_COLLECTIONPOINT(token.tenantId),
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
      // },
    });
    console.log('Get all collection point success:', JSON.stringify(response.data));
    return response
  } catch (e) {
    console.error('Get all collection point failed:', e);
    return null;
  }

}

export const getCollectionPoint = async (page: number, size: number) => {

  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...GET_ALL_COLLECTIONPOINT(token.tenantId),
      params: {
        page: page,
        size: size
      }
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
      // },
    });
    // console.log('Get all collection point success:', JSON.stringify(response.data));
    return response
  } catch (e) {
    // console.error('Get all collection point failed:', e);
    return null;
  }

}

export const createCollectionPoint = async (data: createCP) => {

  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...CREATE_COLLECTIONPOINT,
      data: data
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
      // },
    });
    console.log('Create collection point success:', JSON.stringify(response.data));
    return response
  } catch (e) {
    console.error('Create collection point failed:', e);
    return null;
  }

}

export const updateCollectionPoint = async (collectionPointId: string, data: updateCP) => {
  const auth = returnApiToken()
  const tenantId = auth.tenantId
  const axiosConfig = Object.assign({}, UPDATE_COLLECTIONPOINT);
  axiosConfig.url = UPDATE_COLLECTIONPOINT.url + `/${tenantId}/${collectionPointId}`;

  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...axiosConfig,
      data: data
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
      // },
    });
    console.log('Update collection point success:', JSON.stringify(response.data));
    return response
  } catch (e) {
    console.error('Update collection point failed:', e);
    return null;
  }

}

export const findCollectionPointExistByName = async (colName: string) => {

  const axiosConfig = Object.assign({}, FIND_COLLECTIONPOINT_EXIST_BYNAME);
  axiosConfig.url = FIND_COLLECTIONPOINT_EXIST_BYNAME.url + `/${colName}`;

  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...axiosConfig,
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
      // },
    });
    console.log('find collection point exist by name success:', JSON.stringify(response.data));
    return response;
  } catch (e) {
    console.error('find collection point exist by name failed:', e);
    return null;
  }

}

export const findCollectionPointExistByContractAndAddress = async (contract: string, address: string) => {

  console.log("test: ", contract, address)
  const axiosConfig = Object.assign({}, FIND_COLLECTIONPOINT_EXIST_BYCONTRACT_ADDRESS);
  axiosConfig.url = FIND_COLLECTIONPOINT_EXIST_BYCONTRACT_ADDRESS.url + `/${contract}` + `/${address}`;

  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...axiosConfig,
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
      // },
    });
    console.log('find collection point exist by contract and address success:', JSON.stringify(response.data));
    return response;
  } catch (e) {
    console.error('find collection point exist by contract and address failed:', e);
    return null;
  }

}


export const getCollectionPointDetail = async (colId: number) => {
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...GET_COLLECTIONPOINT_BY_COLID(token.tenantId, colId),
    });
    return response
  } catch (e) {
    return null;
  }
}