import axios from 'axios';
import { localStorgeKeyName } from '../../constants/constant';
import { CREATE_COLLECTIONPOINT, GET_ALL_COLLECTIONPOINT, UPDATE_COLLECTIONPOINT, GET_ALL_CHECKIN_REQUESTS } from '../../constants/requests';
import { collectionPoint, createCP, updateCP } from '../../interfaces/collectionPoint';

const collectionPointAPI = {
    baseURL: 'http://localhost:8003/'
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

// export const getAllRecyc = async () => {

//   try{
//     const response = await axios({
//         ...GET_ALL_RECYC,
//         baseURL: collectionPointAPI.baseURL,
//         // headers: {
//         //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
//         // },
//     });
//     console.log('Get all recyc success:', JSON.stringify(response.data));
//     return response
//   } catch (e) {
//     console.error('Get all recyc failed:', e);
//     return null;
//   }

// }
