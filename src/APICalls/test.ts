import axiosInstance from '../constants/axiosInstance';
// import { localStorgeKeyName } from '../constants/constant';
import { GET_ALL_USERNAME, GET_ALL_WAREHOUSE } from "../constants/requests";
// import { RegisterItem, Tenant } from '../interfaces/account';
// import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs';

// const collectionPointAPI = {
//     baseURL: "https://jsonplaceholder.typicode.com/",
// };

const collectionPointAPI = {
    //baseURL: "http://10.166.22.107:8003/",
    baseURL: 'https://www.greenhoopapp.com/'
};

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance({
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
        const response = await axiosInstance({
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
