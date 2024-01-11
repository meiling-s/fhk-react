import axios from "axios";
// import { localStorgeKeyName } from '../constants/constant';
import { GET_ALL_USERNAME, GET_ALL_WAREHOUSE } from "../constants/requests";
// import { RegisterItem, Tenant } from '../interfaces/account';
// import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs';

// const collectionPointAPI = {
//     baseURL: "https://jsonplaceholder.typicode.com/",
// };

const collectionPointAPI = {
    //baseURL: "http://10.166.22.107:8003/",
    baseURL: 'http://www.greenhoopapp.com/'
};

export const getAllUsers = async () => {
    try {
        const response = await axios({
            ...GET_ALL_USERNAME,
            baseURL: collectionPointAPI.baseURL,
        });
        return response;
    } catch (e) {
        console.error("Get all users failed:", e);
        return null;
    }
};

export const getAllWarehouse = async (page: number, size: number) => {
    try {
        const response = await axios({
            ...GET_ALL_WAREHOUSE,
            baseURL: collectionPointAPI.baseURL,
            params: {
                page: page,
                size: size,
            },
        });
        return response;
    } catch (e) {
        console.error("Get all warehouse failed:", e);
        return null;
    }
};

// const axiosConfig = GET_ALL_USERNAME;
// axiosConfig.url = GET_TENANT_BY_TENANT_ID.url+`/${tenantId}`;

// try {
//     const response = await axios({
//     ...axiosConfig
//     });
//     console.log('Get tenant by id success:', JSON.stringify(response.data));
//     return response
// } catch (e) {
//     console.error('Get tenant by id failed:', e);
//     return null;
// }

// try {
//     const response = await axios({
//       ...GET_ALL_COLLECTIONPOINT,
//       baseURL: collectionPointAPI.baseURL,
//       params:{
//         page: page,
//         size: size
//       }
//       // headers: {
//       //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
//       // },
//     });
//     console.log('Get all collection point success:', JSON.stringify(response.data));
//     return response
//   } catch (e) {
//     console.error('Get all collection point failed:', e);
//     return null;
//   }
