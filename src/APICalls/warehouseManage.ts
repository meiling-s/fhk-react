import axios from "axios";
// import { localStorgeKeyName } from '../constants/constant';
// import { RegisterItem, Tenant } from '../interfaces/account';
// import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs';
import {
    GET_ALL_WAREHOUSE,
    GET_WAREHOUSE_BY_ID,
    ADD_WAREHOUSE,
    UPDATE_WAREHOUSE_BY_ID,
    UPDATE_RECYCLE_CAPACITY_BY_ID,
    UPDATE_WAREHOUSE_STATUS_BY_ID,
} from "../constants/requests";

const collectionPointAPI = {
    baseURL: "http://10.166.22.107:8003/",
};

//get all warehouse
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

//get warehouse by id
export const getWarehouseById = async (warehouseId: number) => {
    try {
        const response = await axios({
            ...GET_WAREHOUSE_BY_ID,
            baseURL: collectionPointAPI.baseURL,
            params: {
                warehouseId: warehouseId,
            },
        });
        return response;
    } catch (e) {
        console.error("Get a warehouse failed:", e);
        return null;
    }
};

//create warehouse
export const createWarehouse = async (data: any) => {
    try {
        const response = await axios({
            ...ADD_WAREHOUSE,
            baseURL: collectionPointAPI.baseURL,
            data: data,
        });
        return response;
    } catch (e) {
        console.error("Create a warehouse failed:", e);
        return null;
    }
};

//edit warehouse
export const editWarehouse = async (data: any, warehouseId: number) => {
    try {
        const response = await axios({
            ...UPDATE_WAREHOUSE_BY_ID,
            baseURL: collectionPointAPI.baseURL,
            data: data,
            params: {
                warehouseId: warehouseId,
            },
        });
        return response;
    } catch (e) {
        console.error("Edit a warehouse failed:", e);
        return null;
    }
};

//edit warehouse recycle capacity by id
export const editWarehouseRecycleCapacity = async (
    data: any,
    warehouseRecycId: number
) => {
    try {
        const response = await axios({
            ...UPDATE_RECYCLE_CAPACITY_BY_ID,
            baseURL: collectionPointAPI.baseURL,
            data: data,
            params: {
                warehouseRecycId: warehouseRecycId,
            },
        });
        return response;
    } catch (e) {
        console.error("Edit a warehouse recycle capacity failed:", e);
        return null;
    }
};

//edit warehouse status by id
export const editWarehouseStatus = async (data: any, warehouseId: number) => {
    try {
        const response = await axios({
            ...UPDATE_WAREHOUSE_STATUS_BY_ID,
            baseURL: collectionPointAPI.baseURL,
            data: data,
            params: {
                warehouseId: warehouseId,
            },
        });
        return response;
    } catch (e) {
        console.error("Edit a warehouse status failed:", e);
        return null;
    }
};
