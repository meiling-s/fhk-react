import { AXIOS_DEFAULT_CONFIGS } from "../../constants/configs";
import {
    GET_FACTORY_LIST_DATA,
    CREATE_FACTORY_DATA,
    UPDATE_FACTORY_DATA,
    DELETE_FACTORY_DATA,
    GET_FACTORY_WAREHOUSE_LIST_DATA,
    GET_ALL_FACTORY_WAREHOUSE_LIST_DATA
} from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from "../../constants/axiosInstance";
import { CreateCompany, UpdateCompany } from "../../interfaces/company";
import { FactoryData } from "../../interfaces/factory";
import { factory } from "typescript";

export const getAllFactories = async (page?: number, size?: number) => {
    const auth = returnApiToken()
    const tenantId = auth.tenantId
    try {
        const token = returnApiToken();
        const response = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...GET_FACTORY_LIST_DATA(tenantId),
        params: {
            page: page,
            size: size,
        },
        headers: {
            AuthToken: token.authToken,
        },
        });

        return response;
    } catch (e) {
        console.error("Get all company failed:", e);
        throw(e)
    }
};

export const getFactoriesWarehouse = async (factoryId?: string) => {
    const auth = returnApiToken()
    const tenantId = auth.tenantId
    const params: any = {}
    if (tenantId) params.tenantId = tenantId
    if (factoryId) params.factoryId = factoryId
    
    try {
        const token = returnApiToken();
        const response = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...GET_FACTORY_WAREHOUSE_LIST_DATA(),
        params: params,
        headers: {
            AuthToken: token.authToken,
        },
        });

        return response;
    } catch (e) {
        console.error("Get all company failed:", e);
        throw(e)
    }
};

export const getAllFactoriesWarehouse = async (factoryId?: string) => {
    const auth = returnApiToken()
    const tenantId = auth.tenantId
    try {
        const token = returnApiToken();
        const response = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...GET_ALL_FACTORY_WAREHOUSE_LIST_DATA(tenantId),
        headers: {
            AuthToken: token.authToken,
        },
        });

        return response;
    } catch (e) {
        console.error("Get all company failed:", e);
        throw(e)
    }
};

export const createFactory = async (data: FactoryData) => {
    try {
        const response = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...CREATE_FACTORY_DATA(),
        data: data
        });

        return response;
    } catch (e) {
        console.error("create company failed:", e);
        throw(e)
    }
};

export const editFactory = async ( factoryId: string, data: FactoryData) => {
    try {
        const response = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...UPDATE_FACTORY_DATA(factoryId),
        data: data,
        });

        return response;
    } catch (e) {
        console.error("update company failed:", e);
        throw(e)
    }
};

export const deleteFactory = async ( factoryId: string) => {
    try {
        const response = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...DELETE_FACTORY_DATA(factoryId),
        });

        return response;
    } catch (e) {
        console.error("update company failed:", e);
        throw(e)
    }
};

