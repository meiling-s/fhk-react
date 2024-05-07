import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import {
  colPointType,
  collectorList,
  contract,
  logisticList,
  manuList,
  premiseType,
  recycType,
  siteType,
  vehicleType,
  ProcessType
} from '../interfaces/common'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import {
  GET_COLLECTIONPOINT_TYPE,
  GET_COLLECTORLIST,
  GET_CONTRACT,
  GET_LOGISTICLIST,
  GET_MANULIST,
  GET_PREMISE_TYPE,
  GET_RECYC_TYPE,
  GET_SITE_TYPE,
  GET_VEHICLE_TYPE,
  GET_PROCESS_LIST,
  GET_CONTRACT_LOGISTIC,
  GET_IMG_SETTINGS,
} from '../constants/requests'
import { returnApiToken } from '../utils/utils'
import axiosInstance from '../constants/axiosInstance'

const CommonType = () => {
  const [colPointType, setColPointType] = useState<colPointType[]>()
  const [premiseType, setPremiseType] = useState<premiseType[]>()
  const [siteType, setSiteType] = useState<siteType[]>()
  const [recycType, setRecycType] = useState<recycType[]>()
  const [contractType, setContractType] = useState<contract[]>()
  const [logisticList, setLogisticList] = useState<logisticList[]>()
  const [manuList, setManuList] = useState<manuList[]>()
  const [collectorList, setCollectorList] = useState<collectorList[]>()
  const [vehicleType, setVehicleType] = useState<vehicleType[]>()
  const [processType, setProcessType] = useState<ProcessType[]>()
  const [contractLogistic, setContractLogistic] = useState<contract[]>()
  const [imgSettings, setImgSettings] = useState<{ImgQuantity:number, ImgSize: number}>({
    ImgQuantity: 3,
    ImgSize: 3 * 1000 * 1000
  })

  const getColPointType = async () => {
    var colPointType = []
    try {
      var response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_COLLECTIONPOINT_TYPE
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      })
      //console.log('Get collection point type success:', JSON.stringify(response.data));
      colPointType = response.data
      setColPointType(colPointType)
    } catch (e) {
      // console.error('Get collection point type failed:', e);
      return null
    }
  }

  const getPremiseType = async () => {
    var premiseType = []
    try {
      var response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_PREMISE_TYPE
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      })
      // console.log('Get premise type success:', JSON.stringify(response.data));
      premiseType = response.data
      setPremiseType(premiseType)
    } catch (e) {
      // console.error('Get premise type failed:', e);
      return null
    }
  }

  const getSiteType = async () => {
    var siteType = []
    try {
      var response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_SITE_TYPE
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      })
      // console.log('Get site type success:', JSON.stringify(response.data));
      siteType = response.data
      setSiteType(siteType)
    } catch (e) {
      // console.error('Get site type failed:', e);
      return null
    }
  }

  const getRecycType = async () => {
    var RecycType = []
    try {
      var response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_RECYC_TYPE
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      })
      // console.log('Get site type success:', JSON.stringify(response.data))
      RecycType = response.data
      setRecycType(RecycType)
    } catch (e) {
      console.error('Get site type failed:', e)
      return null
    }
  }

  const getLogisticlist = async () => {
    const token = returnApiToken()

    try {
      var response = await axiosInstance({
        ...GET_LOGISTICLIST(token.realmApiRoute, token.decodeKeycloack),
        baseURL: window.baseURL.collector
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      })
      // console.log('Get logistic list success:', JSON.stringify(response.data))

      const logistic = response.data.content
      setLogisticList(logistic)
    } catch (e) {
      // console.error('Get logistic list failed:', e)
      return null
    }
  }

  const getManuList = async () => {
    const token = returnApiToken()
    try {
      var response = await axiosInstance({
        ...GET_MANULIST(token.realmApiRoute, token.decodeKeycloack),
        baseURL: window.baseURL.collector
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      })
      // console.log('Get manu list success:', JSON.stringify(response.data))

      const manu = response.data.content
      setManuList(manu)
    } catch (e) {
      // console.error('Get manu list failed:', e)
      return null
    }
  }
  const getCollectorList = async () => {
    const token = returnApiToken()
    try {
      var response = await axiosInstance({
        ...GET_COLLECTORLIST(token.realmApiRoute, token.decodeKeycloack),
        baseURL: window.baseURL.collector
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      })
      // console.log('Get collector list success:', JSON.stringify(response.data))

      const collector = response.data.content
      setCollectorList(collector)
    } catch (e) {
      // console.error('Get collector list failed:', e)
      return null
    }
  }

  const getContractList = async () => {
    const token = returnApiToken()
    try {
      var response = await axiosInstance({
        ...GET_CONTRACT(token.realmApiRoute, token.tenantId),
        baseURL: window.baseURL.collector
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      })
      // console.log('Get contract list success:', JSON.stringify(response.data))

      const contract = response.data.content
      setContractType(contract)
    } catch (e) {
      // console.error('Get contract list failed:', e)
      return null
    }
  }
  const getvehicleType = async () => {
    try {
      var response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_VEHICLE_TYPE
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      })
      // console.log('Get vehicle list success:', JSON.stringify(response.data))

      const vehicle = response.data
      setVehicleType(vehicle)
    } catch (e) {
      console.error('Get vehicle list failed:', e)
      return null
    }
  }

  const getProcessList = async () => {
    try {
      const response = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...GET_PROCESS_LIST
      })

      const processList = response.data
      setProcessType(processList)
    } catch (e) {
      console.error('Get process record failed:', e)
      return null
    }
  }

  const getContractLogistic = async () => {
    const token = returnApiToken()
    try {
      var response = await axiosInstance({
        ...GET_CONTRACT_LOGISTIC(token.tenantId),
        baseURL: window.baseURL.collector
      })
      const contract = response.data.content
      setContractLogistic(contract)
    } catch (e) {
      // console.error('Get contract list failed:', e)
      return null
    }
  }

  
  const getImgSettings = async () => {
    const token = returnApiToken()
    try {
      var response = await axiosInstance({
        ...GET_IMG_SETTINGS(token.tenantId),
        baseURL: window.baseURL.account
      })
      const imgSettings = response.data
      if (imgSettings.ImgSize) {
        imgSettings.ImgSize *= 1000 * 1000
      }
      setImgSettings(imgSettings)
    } catch (e) {
      return null
    }
  }

  const updateCommonTypeContainer = () => {
    getColPointType()
    getPremiseType()
    getSiteType()
    getRecycType()
    getLogisticlist()
    getContractList()
    getvehicleType()
    getCollectorList()
    getManuList()
    getProcessList()
    getContractLogistic()
    getImgSettings()
  }

  useEffect(() => {
    if (returnApiToken().authToken) {
      getColPointType()
      getPremiseType()
      getSiteType()
      getRecycType()
      getLogisticlist()
      getContractList()
      getvehicleType()
      getCollectorList()
      getManuList()
      getProcessList()
      getContractLogistic()
      getImgSettings()
    }
  }, [])


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
    processType,
    contractLogistic,
    imgSettings,
    updateCommonTypeContainer,
    getColPointType,
    getPremiseType,
    getSiteType,
    getRecycType,
    getLogisticlist,
    getContractList,
    getvehicleType,
    getCollectorList,
    getManuList,
    getProcessList,
    getContractLogistic,
    getImgSettings
  }
}

const CommonTypeContainer = createContainer(CommonType)

export default CommonTypeContainer
