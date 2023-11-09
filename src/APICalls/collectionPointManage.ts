import axios from 'axios';
import { localStorgeKeyName } from '../constants/constant';
import { CREATE_COLLECTIONPOINT, GET_ALL_COLLECTIONPOINT } from '../constants/requests';
import { createCP } from '../interfaces/collectionPoint';

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