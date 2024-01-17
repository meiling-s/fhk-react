import axios from "axios";
import { localStorgeKeyName } from '../constants/constant';
// import { RegisterItem, Tenant } from '../interfaces/account';
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs';
import {
    GET_ALL_WAREHOUSE,
    GET_WAREHOUSE_BY_ID,
    ADD_WAREHOUSE,
    UPDATE_WAREHOUSE_BY_ID,
    UPDATE_RECYCLE_CAPACITY_BY_ID,
    UPDATE_WAREHOUSE_STATUS_BY_ID,
    GET_RECYCLE_TYPE,
    GET_RECYCLE_TYPE_BY_ID,
} from "../constants/requests";

const collectionPointAPI = {
    baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
};

const administratorAPI = {
    baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
};

const request = axios.create({
    baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
  })


const decodeKeycloack =
  localStorage.getItem(localStorgeKeyName.decodeKeycloack) || ''

const authToken = localStorage.getItem(
  localStorgeKeyName.keycloakToken || ''
)

//get all warehouse
export const getAllWarehouse = async (page: number, size: number) => {
    try {
      const response = await request({
        ...GET_ALL_WAREHOUSE(decodeKeycloack),
        headers: {
          AuthToken: authToken
        }
      })
      
      return response
    } catch (e) {
      console.error('Get all warehouse failed:', e)
      return null
    }
  }
  
  //get warehouse by id
  export const getWarehouseById = async (warehouseId: number) => {
    try {
      const response = await request({
        ...GET_WAREHOUSE_BY_ID(warehouseId, decodeKeycloack),
        // baseURL: collectionPointAPI.baseURL,
        headers: {
          AuthToken: authToken
        }
      })
      return response
    } catch (e) {
      console.error('Get a warehouse failed:', e)
      return null
    }
  }
  
  //create warehouse
  export const createWarehouse = async (data: any) => {
    try {
      const response = await axios({
        ...ADD_WAREHOUSE(decodeKeycloack),
        baseURL: collectionPointAPI.baseURL,
        data: data,
        headers: {
          AuthToken: authToken
        }
      })
      return response
    } catch (e) {
      console.error('Create a warehouse failed:', e)
      return null
    }
  }
  
  //edit warehouse
  export const editWarehouse = async (data: any, warehouseId: number) => {
    try {
      const response = await axios({
        ...UPDATE_WAREHOUSE_BY_ID(warehouseId, decodeKeycloack),
        baseURL: collectionPointAPI.baseURL,
        data: data,
        headers: {
          AuthToken: authToken
        }
      })
      return response
    } catch (e) {
      console.error('Edit a warehouse failed:', e)
      return null
    }
  }
  
  //edit warehouse recycle capacity by id
  export const editWarehouseRecycleCapacity = async (
    data: any,
    warehouseRecycId: number
  ) => {
    try {
      const response = await axios({
        ...UPDATE_RECYCLE_CAPACITY_BY_ID(warehouseRecycId, decodeKeycloack),
        baseURL: collectionPointAPI.baseURL,
        data: data,
        headers: {
          AuthToken: authToken
        }
      })
      return response
    } catch (e) {
      console.error('Edit a warehouse recycle capacity failed:', e)
      return null
    }
  }
  
  //edit warehouse status by id
  export const editWarehouseStatus = async (data: any, warehouseId: number) => {
    try {
      const response = await axios({
        ...UPDATE_WAREHOUSE_STATUS_BY_ID(warehouseId, decodeKeycloack),
        baseURL: collectionPointAPI.baseURL,
        data: data,
        headers: {
          AuthToken: authToken
        }
      })
      return response
    } catch (e) {
      console.error('Edit a warehouse status failed:', e)
      return null
    }
  }

//get recycle type
export const getRecycleType = async () => {
    try {
        const response = await axios({
            ...GET_RECYCLE_TYPE,
            baseURL: administratorAPI.baseURL,
        });
        return response;
    } catch (e) {
        console.error("Get recycle type failed:", e);
        return null;
    }
};

//get recycle type by id
export const getRecycleTypeById = async (recycTypeId: string) => {
    try {
        const response = await axios({
            ...GET_RECYCLE_TYPE_BY_ID(recycTypeId),
            baseURL: administratorAPI.baseURL,
        });
        return response;
    } catch (e) {
        console.error("Get recycle type by id failed:", e);
        return null;
    }
};
