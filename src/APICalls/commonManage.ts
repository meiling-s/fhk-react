import axios from 'axios';
import { localStorgeKeyName } from '../constants/constant';
import { GET_COLLECTIONPOINT_TYPE, GET_CONTRACT, GET_PREMISE_TYPE, GET_RECYC_TYPE, GET_SITE_TYPE } from '../constants/requests';
import { colPointType, contract, premiseType, recycType, siteType } from '../interfaces/common';

const commonAPI = {
    baseURL: 'http://localhost:8002/'
}

const collectionPointAPI = {
    baseURL: 'http://10.166.22.107:30001/'
}

export const getColPointType = async () => {

    var colPointType = [];
    try {
        
        var response = await axios({
            ...GET_COLLECTIONPOINT_TYPE,
            baseURL: commonAPI.baseURL
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        console.log('Get collection point type success:', JSON.stringify(response.data));
        colPointType = response.data;
        return colPointType;

    }catch (e) {
        console.error('Get collection point type failed:', e);
        return null;
    }
}

export const getPremiseType = async () => {

    var premiseType = [];
    try {

        var response = await axios({
            ...GET_PREMISE_TYPE,
            baseURL: commonAPI.baseURL
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        console.log('Get premise type success:', JSON.stringify(response.data));
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

        var response = await axios({
            ...GET_SITE_TYPE,
            baseURL: commonAPI.baseURL
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        console.log('Get site type success:', JSON.stringify(response.data));
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

        var response = await axios({
            ...GET_COLLECTIONPOINT_TYPE,
            baseURL: commonAPI.baseURL
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        //console.log('Get collection point type success:', JSON.stringify(response.data));
        types.colPoint = response.data;

        response = await axios({
            ...GET_PREMISE_TYPE,
            baseURL: commonAPI.baseURL
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        //console.log('Get premise type success:', JSON.stringify(response.data));
        types.premise = response.data;

        response = await axios({
            ...GET_SITE_TYPE,
            baseURL: commonAPI.baseURL
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        //console.log('Get site type success:', JSON.stringify(response.data));
        types.site = response.data;

        response = await axios({
            ...GET_RECYC_TYPE,
            baseURL: collectionPointAPI.baseURL
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        //console.log('Get recyc type success:', JSON.stringify(response.data));
        types.recyc = response.data;

        response = await axios({
            ...GET_CONTRACT,
            baseURL: collectionPointAPI.baseURL
            // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        console.log('Get contract success:', JSON.stringify(response.data));
        types.contract = response.data;

        return types;

    } catch (e) {
        console.error('Get common types failed:', e);
        return null;
    }
  
}