import { CREATE_COLLECTIONPOINT, GET_ALL_COLLECTIONPOINT, UPDATE_COLLECTIONPOINT } from '../../constants/requests';
import { createCP, updateCP } from '../../interfaces/collectionPoint';
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import { returnApiToken } from '../../utils/utils';
import axiosInstance from '../../constants/axiosInstance'


export const getAllCollectionPoint = async () => {
    const auth = returnApiToken()
    try {
      const response = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...GET_ALL_COLLECTIONPOINT(auth.tenantId)
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
        // },
      });
      // console.log('Get all collection point success:', JSON.stringify(response.data));
      return response
    } catch (e) {
      // console.error('Get all collection point failed:', e);
      return e;
    }
  
}

export const getCollectionPoint = async (page: number, size: number) => {
  const auth = returnApiToken()
  try {
    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...GET_ALL_COLLECTIONPOINT(auth.tenantId),
      params:{
        page: page,
        size: size
      }
    });
    // console.log('Get all collection point success:', JSON.stringify(response.data));
    return response
  } catch (e) {
    // console.error('Get all collection point failed:', e);
    return null;
  }

}

export const createCollectionPoint = async (data: createCP) => {

    try{
        const response = await axiosInstance({
        baseURL: window.baseURL.collector,
            ...CREATE_COLLECTIONPOINT,
            data: data
            // headers: {
            //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
            // },
        });
        // console.log('Create collection point success:', JSON.stringify(response.data));
        return response
    } catch (e) {
        // console.error('Create collection point failed:', e);
        return null;
    }

}

export const updateCollectionPoint = async (collectionPointId: string, data: updateCP) => {
  const auth = returnApiToken()
  const tenantId = auth.tenantId
  const axiosConfig = Object.assign({},UPDATE_COLLECTIONPOINT);
  axiosConfig.url = UPDATE_COLLECTIONPOINT.url+`/${tenantId}/${collectionPointId}`;

  try{
      const response = await axiosInstance({
        baseURL: window.baseURL.collector,
          ...axiosConfig,
          data: data
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
          // },
      });
      // console.log('Update collection point success:', JSON.stringify(response.data));
      return response
  } catch (e) {
      // console.error('Update collection point failed:', e);
      return null;
  }

}




// export const getAllRecyc = async () => {

//   try{
//     const response = await axiosInstance({
//        baseURL: window.baseURL.collector,
//         ...GET_ALL_RECYC,
//         
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
