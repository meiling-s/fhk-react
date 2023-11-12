import axios from 'axios';
import { localStorgeKeyName } from '../constants/constant';
import { GET_COLLECTIONPOINT_TYPE, GET_PREMISE_TYPE, GET_SITE_TYPE } from '../constants/requests';
import { colPointType, premiseType, siteType } from '../interfaces/common';

const commonAPI = {
    baseURL: 'http://localhost:8002/'
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
    var types: { colPoint: colPointType[], premise: premiseType[], site: siteType[]} = {
        colPoint: [],
        premise: [],
        site: []
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
        return types;

    } catch (e) {
        console.error('Get common types failed:', e);
        return null;
    }
  
}