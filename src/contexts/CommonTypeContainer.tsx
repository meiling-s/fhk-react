import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next';
import { colPointType, collectorList, contract, logisticList, manuList, premiseType, recycType, siteType, vehicleType, PackageType } from '../interfaces/common';
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs';
import { GET_COLLECTIONPOINT_TYPE, GET_COLLECTORLIST, GET_CONTRACT, GET_LOGISTICLIST, GET_MANULIST, GET_PREMISE_TYPE, GET_RECYC_TYPE, GET_SITE_TYPE, GET_VEHICLE_TYPE, GET_PACKAGE_LIST } from '../constants/requests';
import { returnApiToken } from '../utils/utils';
import axiosInstance from '../constants/axiosInstance'
import { AnyARecord } from 'dns';

const CommonType = () => { 
    const [colPointType,setColPointType] =useState<colPointType[]>()
    const [premiseType,setPremiseType] =useState<premiseType[]>()
    const [siteType,setSiteType] =useState<siteType[]>()
    const [recycType,setRecycType] =useState<recycType[]>()
    const [contractType,setContractType] =useState<contract[]>()
    const [logisticList,setLogisticList] = useState<logisticList[]>()
    const [manuList,setManuList] = useState<manuList[]>()
    const [collectorList,setCollectorList] = useState<collectorList[]>()
    const [vehicleType,setVehicleType] = useState<vehicleType[]>()
    const [packageType,setPackageType] = useState<PackageType[]>()

const getColPointType = async () => {
    
        var colPointType = [];
        try {
            
            var response = await axiosInstance({
                baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
                ...GET_COLLECTIONPOINT_TYPE,
                // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
            });
            //console.log('Get collection point type success:', JSON.stringify(response.data));
            colPointType = response.data;
            setColPointType(colPointType)
    
        }catch (e) {
            // console.error('Get collection point type failed:', e);
            return null;
        }
    }
    
const getPremiseType = async () => {
    
        var premiseType = [];
        try {
    
            var response = await axiosInstance({
                baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
                ...GET_PREMISE_TYPE,
                // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
            });
            // console.log('Get premise type success:', JSON.stringify(response.data));
            premiseType = response.data;
            setPremiseType(premiseType)
        }catch (e) {
            // console.error('Get premise type failed:', e);
            return null;
        }
    }
    
const getSiteType = async () => {
        
        var siteType = []
        try {
    
            var response = await axiosInstance({
                baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
                ...GET_SITE_TYPE,
                // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
            });
            // console.log('Get site type success:', JSON.stringify(response.data));
            siteType = response.data;
            setSiteType(siteType)
        }catch (e) {
            // console.error('Get site type failed:', e);
            return null;
        }
    }
    
  
    
    
   const getRecycType = async () => {
        
        var RecycType = []
        try {
    
            var response = await axiosInstance({
                baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
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
        const token = returnApiToken()

        try {
      
            var response = await axiosInstance({
                ...GET_LOGISTICLIST(token.decodeKeycloack),
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
         
    const getManuList = async () => {
        const token = returnApiToken()
        try {

            var response = await axiosInstance({
                ...GET_MANULIST(token.decodeKeycloack),
                baseURL:AXIOS_DEFAULT_CONFIGS.baseURL.collector
                // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
            });
            console.log('Get manu list success:', JSON.stringify(response.data));
            
            const manu= response.data
            setManuList(manu)
        }catch (e) {
            console.error('Get manu list failed:', e);
            return null;
        }
      }
      const getCollectorList = async () => {
        const token = returnApiToken()
        try {

            var response = await axiosInstance({
                ...GET_COLLECTORLIST(token.decodeKeycloack),
                baseURL:AXIOS_DEFAULT_CONFIGS.baseURL.collector
                // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
            });
            console.log('Get collector list success:', JSON.stringify(response.data));
            
            const collector= response.data
            setCollectorList(collector)
        }catch (e) {
            console.error('Get collector list failed:', e);
            return null;
        }
      }

    const getContractList = async () => {
        const token = returnApiToken()
        try {
      
            var response = await axiosInstance({
                ...GET_CONTRACT(token.tenantId),
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
      
            var response = await axiosInstance({
                baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
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

    const getPackageList = async () => {
        try {
          
          const response = await axiosInstance({
              baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
            ...GET_PACKAGE_LIST
            
          })
      
          const packageList = response.data
          setPackageType(packageList)
          
        } catch (e) {
          console.error('Get package record failed:', e)
          return null
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
        getCollectorList();
        getManuList();
        getPackageList();
},[])
 

  return {
    colPointType,
    premiseType,
    siteType,
    recycType,
    logisticList,
    contractType,
    vehicleType,
    collectorList,
    manuList,
    packageType

}

}


const CommonTypeContainer = createContainer(CommonType);

export default CommonTypeContainer
