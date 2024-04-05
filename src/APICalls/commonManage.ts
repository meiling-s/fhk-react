import axiosInstance from '../constants/axiosInstance'
import { GET_COLLECTIONPOINT_TYPE, GET_CONTRACT, GET_PREMISE_TYPE, GET_RECYC_TYPE, GET_SITE_TYPE, GET_USER_GROUP, ADD_USER_ACCOUNT } from '../constants/requests';
import { colPointType, contract, premiseType, recycType, siteType } from '../interfaces/common';
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs';
import { returnApiToken } from '../utils/utils';

const token = returnApiToken()

export const getColPointType = async () => {

    var colPointType = [];
    try {
        
        var response = await axiosInstance({
            baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
            ...GET_COLLECTIONPOINT_TYPE,
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        //console.log('Get collection point type success:', JSON.stringify(response.data));
        colPointType = response.data;
        return colPointType;

    }catch (e) {
        console.error('Get collection point type failed:', e);
        return null;
    }
}

export const getUserGroup = async () => {
    const token = returnApiToken()
    try {
        var response = await axiosInstance({
            baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
            ...GET_USER_GROUP(token.tenantId),
        });
        //console.log('Get collection point type success:', JSON.stringify(response.data));
        
        return response.data;
    }catch (e) {
        console.error('Get user group data failed:', e);
        return null;
    }
}

export const addTheUserAccount = async (data: any) => {
    var userAccount = [];
    try {
        var response = await axiosInstance({
            baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
            ...ADD_USER_ACCOUNT,
            data: data,
        });
        // console.log('Add user account success:', JSON.stringify(response.data));
        userAccount = response.data;
        return userAccount;
    }catch (e) {
        console.error('Add user account data failed:', e);
        return null;
    }
}

export const getPremiseType = async () => {

    var premiseType = [];
    try {

        var response = await axiosInstance({
            baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
            ...GET_PREMISE_TYPE,
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        // console.log('Get premise type success:', JSON.stringify(response.data));
        premiseType = response.data;
        return premiseType;
    }catch (e) {
        console.error('Get premise type failed:', e);
        return null;
    }
}

export const getSiteType = async () => {
    
    var siteType = []
    try {

        var response = await axiosInstance({
            baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
            ...GET_SITE_TYPE,
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        // console.log('Get site type success:', JSON.stringify(response.data));
        siteType = response.data;
        return siteType;
    }catch (e) {
        console.error('Get site type failed:', e);
        return null;
    }
}

export const getCommonTypes = async () => {
    var types: { colPoint: colPointType[], premise: premiseType[], site: siteType[], recyc: recycType[], contract: contract[]} = {
        colPoint: [],
        premise: [],
        site: [],
        recyc: [],
        contract: []
    }

    try {

        var response = await axiosInstance({
            baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
            ...GET_COLLECTIONPOINT_TYPE,
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        //console.log('Get collection point type success:', JSON.stringify(response.data));
        types.colPoint = response.data;

        response = await axiosInstance({
            baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
            ...GET_PREMISE_TYPE,
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        //console.log('Get premise type success:', JSON.stringify(response.data));
        types.premise = response.data;

        response = await axiosInstance({
            baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
            ...GET_SITE_TYPE,
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        //console.log('Get site type success:', JSON.stringify(response.data));
        types.site = response.data;

        response = await axiosInstance({
            baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
            ...GET_RECYC_TYPE,
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        //console.log('Get recyc type success:', JSON.stringify(response.data));
        types.recyc = response.data;
        const auth = returnApiToken()

        response = await axiosInstance({
            ...GET_CONTRACT(auth.tenantId),
            baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        console.log('Get contract success:', JSON.stringify(response));
        types.contract = response.data.content;

        return types;

    } catch (e) {
        console.error('Get common types failed:', e);
        return null;
    }
  
}

export const getRecycType = async () => {
    
    var RecycType = []
    try {

        var response = await axiosInstance({
            baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
            ...GET_RECYC_TYPE,
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        // console.log('Get site type success:', JSON.stringify(response.data));
        RecycType = response.data;
        return RecycType;
    }catch (e) {
        console.error('Get site type failed:', e);
        return null;
    }
}
