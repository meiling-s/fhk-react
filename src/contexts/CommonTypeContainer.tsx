import React, { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next';
import { colPointType, contract, logisticList, premiseType, recycType, siteType, vehicleType } from '../interfaces/common';
import axios from 'axios';
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs';
import { GET_COLLECTIONPOINT_TYPE, GET_CONTRACT, GET_LOGISTICLIST, GET_PREMISE_TYPE, GET_RECYC_TYPE, GET_SITE_TYPE, GET_VEHICLE_TYPE } from '../constants/requests';


const CommonType = () => { 
    const [colPointType,setColPointType] =useState<colPointType[]>()
    const [premiseType,setPremiseType] =useState<premiseType[]>()
    const [siteType,setSiteType] =useState<siteType[]>()
    const [recycType,setRecycType] =useState<recycType[]>()
    const [contractType,setContractType] =useState<contract[]>()
    const [logisticList,setLogisticList] = useState<logisticList[]>()
    const [vehicleType,setVehicleType] = useState<vehicleType[]>()
    const request = axios.create({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator
    })

 

    
const getColPointType = async () => {
    
        var colPointType = [];
        try {
            
            var response = await request({
                ...GET_COLLECTIONPOINT_TYPE,
                // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
            });
            //console.log('Get collection point type success:', JSON.stringify(response.data));
            colPointType = response.data;
            setColPointType(colPointType)
    
        }catch (e) {
            console.error('Get collection point type failed:', e);
            return null;
        }
    }
    
const getPremiseType = async () => {
    
        var premiseType = [];
        try {
    
            var response = await request({
                ...GET_PREMISE_TYPE,
                // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
            });
            console.log('Get premise type success:', JSON.stringify(response.data));
            premiseType = response.data;
            setPremiseType(premiseType)
        }catch (e) {
            console.error('Get premise type failed:', e);
            return null;
        }
    }
    
const getSiteType = async () => {
        
        var siteType = []
        try {
    
            var response = await request({
                ...GET_SITE_TYPE,
                // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
            });
            console.log('Get site type success:', JSON.stringify(response.data));
            siteType = response.data;
            setSiteType(siteType)
        }catch (e) {
            console.error('Get site type failed:', e);
            return null;
        }
    }
    
  
    
    
   const getRecycType = async () => {
        
        var RecycType = []
        try {
    
            var response = await request({
                ...GET_RECYC_TYPE,
                // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
            });
            console.log('Get site type success:', JSON.stringify(response.data));
            RecycType = response.data;
            setRecycType(RecycType)
        }catch (e) {
            console.error('Get site type failed:', e);
            return null;
        }
    }
    
    const getLogisticlist = async () => {

        try {
      
            var response = await request({
                ...GET_LOGISTICLIST,
                baseURL:AXIOS_DEFAULT_CONFIGS.baseURL.collector
                // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
            });
            console.log('Get logistic list success:', JSON.stringify(response.data));
            
            const logistic= response.data
            setLogisticList(logistic)
        }catch (e) {
            console.error('Get logistic list failed:', e);
            return null;
        }
      }
      const getContractList = async () => {

        try {
      
            var response = await request({
                ...GET_CONTRACT,
                baseURL:AXIOS_DEFAULT_CONFIGS.baseURL.collector
                // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
            });
            console.log('Get contract list success:', JSON.stringify(response.data));
            
            const contract= response.data
            setContractType(contract)
        }catch (e) {
            console.error('Get contract list failed:', e);
            return null;
        }
      }
      const getvehicleType = async () => {

        try {
      
            var response = await request({
                ...GET_VEHICLE_TYPE,
                // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
            });
            console.log('Get vehicle list success:', JSON.stringify(response.data));
            
            const vehicle= response.data
            setVehicleType(vehicle)
        }catch (e) {
            console.error('Get vehicle list failed:', e);
            return null;
        }
      }
    
      

    useEffect(()=>{
        getColPointType();
        getPremiseType();
        getSiteType();
        getRecycType();
        getLogisticlist();
        getContractList();
        getvehicleType();
},[])
 

  return {
    colPointType,
    premiseType,
    siteType,
    recycType,
    logisticList,
    contractType,
    vehicleType

}

}


const CommonTypeContainer = createContainer(CommonType);

export default CommonTypeContainer
