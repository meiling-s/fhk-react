import axios from 'axios';
import { CREATE_COLLECTIONPOINT, FIND_COLLECTIONPOINT_EXIST_BYADDRESS, FIND_COLLECTIONPOINT_EXIST_BYNAME, GET_ALL_COLLECTIONPOINT, UPDATE_COLLECTIONPOINT } from '../constants/requests';
import { createCP, updateCP } from '../interfaces/collectionPoint';

const collectionPointAPI = {
    baseURL: 'http://localhost:8001/'
}

export const getAllCollectionPoint = async () => {

    try {
      const response = await axios({
        ...GET_ALL_COLLECTIONPOINT,
        baseURL: collectionPointAPI.baseURL
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
    const response = await axios({
      ...GET_ALL_COLLECTIONPOINT,
      baseURL: collectionPointAPI.baseURL,
      params:{
        page: page,
        size: size
      }
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

export const createCollectionPoint = async (data: createCP) => {

    try{
        const response = await axios({
            ...CREATE_COLLECTIONPOINT,
            baseURL: collectionPointAPI.baseURL,
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

  const axiosConfig = Object.assign({},UPDATE_COLLECTIONPOINT);
  axiosConfig.url = UPDATE_COLLECTIONPOINT.url+`/${collectionPointId}`;

  try{
      const response = await axios({
          ...axiosConfig,
          baseURL: collectionPointAPI.baseURL,
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

  const axiosConfig = Object.assign({},FIND_COLLECTIONPOINT_EXIST_BYNAME);
  axiosConfig.url = FIND_COLLECTIONPOINT_EXIST_BYNAME.url+`/${colName}`;

  try{
      const response = await axios({
          ...axiosConfig,
          baseURL: collectionPointAPI.baseURL
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

export const findCollectionPointExistByAddress = async (address: string) => {

  const axiosConfig = Object.assign({},FIND_COLLECTIONPOINT_EXIST_BYADDRESS);
  axiosConfig.url = FIND_COLLECTIONPOINT_EXIST_BYADDRESS.url+`/${address}`;

  try{
      const response = await axios({
          ...axiosConfig,
          baseURL: collectionPointAPI.baseURL
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
          // },
      });
      console.log('find collection point exist by address success:', JSON.stringify(response.data));
      return response;
  } catch (e) {
      console.error('find collection point exist by address failed:', e);
      return null;
  }

}