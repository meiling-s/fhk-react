import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
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
  ProcessType,
  weightUnit,
  Company,
  PackagingList,
} from "../interfaces/common";
import { AXIOS_DEFAULT_CONFIGS } from "../constants/configs";
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
  GET_DECIMAL_VAL,
  GET_DATE_FORMAT,
  GET_PROCESS_TYPE_DATA,
} from "../constants/requests";
import { randomBackgroundColor, returnApiToken } from "../utils/utils";
import axiosInstance from "../constants/axiosInstance";
import { getWeightUnit } from "../APICalls/ASTD/recycling";
import { getAllTenant, getTenantById } from "../APICalls/tenantManage";
import { localStorgeKeyName } from "../constants/constant";
import { getAllPackagingUnit } from "../APICalls/Collector/packagingUnit";
import { getProductTypeList } from "../APICalls/ASTD/settings/productType";
import { Products } from "../interfaces/productType";

const CommonType = () => {
  const [colPointType, setColPointType] = useState<colPointType[]>();
  const [premiseType, setPremiseType] = useState<premiseType[]>();
  const [siteType, setSiteType] = useState<siteType[]>();
  const [recycType, setRecycType] = useState<recycType[]>();
  const [contractType, setContractType] = useState<contract[]>();
  const [logisticList, setLogisticList] = useState<logisticList[]>();
  const [manuList, setManuList] = useState<manuList[]>();
  const [collectorList, setCollectorList] = useState<collectorList[]>();
  const [vehicleType, setVehicleType] = useState<vehicleType[]>();
  const [processType, setProcessType] = useState<ProcessType[]>();
  const [processTypeListData, setProcessTypeList] = useState<ProcessType[]>();
  const [contractLogistic, setContractLogistic] = useState<contract[]>();
  const [imgSettings, setImgSettings] = useState<{
    ImgQuantity: number;
    ImgSize: number;
  }>({
    ImgQuantity: 3,
    ImgSize: 3 * 1000 * 1000,
  });
  const [weightUnits, setWeightUnits] = useState<weightUnit[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [decimalVal, setDecimalVal] = useState<number>(0);
  const [dateFormat, setDateFormat] = useState<string>("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Company | null>(null);
  const [packagingList, setPackagingList] = useState<PackagingList[]>([]);
  const [productType, setProductType] = useState<Products[]>([]);
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId);

  const getColPointType = async () => {
    var colPointType = [];
    try {
      var response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_COLLECTIONPOINT_TYPE,
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      });
      //console.log('Get collection point type success:', JSON.stringify(response.data));
      colPointType = response.data;
      setColPointType(colPointType);
    } catch (e) {
      // console.error('Get collection point type failed:', e);
      return null;
    }
  };

  const getPremiseType = async () => {
    var premiseType = [];
    try {
      var response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_PREMISE_TYPE,
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      });
      // console.log('Get premise type success:', JSON.stringify(response.data));
      premiseType = response.data;
      setPremiseType(premiseType);
    } catch (e) {
      // console.error('Get premise type failed:', e);
      return null;
    }
  };

  const getSiteType = async () => {
    var siteType = [];
    try {
      var response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_SITE_TYPE,
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      });
      // console.log('Get site type success:', JSON.stringify(response.data));
      siteType = response.data;
      setSiteType(siteType);
    } catch (e) {
      // console.error('Get site type failed:', e);
      return null;
    }
  };

  const getRecycType = async () => {
    var RecycType = [];
    try {
      var response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_RECYC_TYPE,
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      });
      // console.log('Get site type success:', JSON.stringify(response.data))
      RecycType = response.data.map((item: recycType) => {
        return {
          ...item,
          backgroundColor: randomBackgroundColor(),
        };
      });
      setRecycType(RecycType);
    } catch (e) {
      console.error("Get site type failed:", e);
      return null;
    }
  };

  const getLogisticlist = async () => {
    const token = returnApiToken();

    try {
      var response = await axiosInstance({
        ...GET_LOGISTICLIST(token.realmApiRoute, token.decodeKeycloack),
        baseURL: window.baseURL.collector,
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      });
      // console.log('Get logistic list success:', JSON.stringify(response.data))

      const logistic = response.data.content;
      setLogisticList(logistic);
    } catch (e) {
      // console.error('Get logistic list failed:', e)
      return null;
    }
  };

  const getManuList = async () => {
    const token = returnApiToken();
    try {
      var response = await axiosInstance({
        ...GET_MANULIST(token.realmApiRoute, token.decodeKeycloack),
        baseURL: window.baseURL.collector,
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      });
      // console.log('Get manu list success:', JSON.stringify(response.data))

      const manu = response.data.content;
      setManuList(manu);
    } catch (e) {
      // console.error('Get manu list failed:', e)
      return null;
    }
  };
  const getCollectorList = async () => {
    const token = returnApiToken();
    try {
      var response = await axiosInstance({
        ...GET_COLLECTORLIST(token.realmApiRoute, token.decodeKeycloack),
        baseURL: window.baseURL.collector,
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      });
      // console.log('Get collector list success:', JSON.stringify(response.data))

      const collector = response.data.content;
      setCollectorList(collector);
    } catch (e) {
      // console.error('Get collector list failed:', e)
      return null;
    }
  };

  const getContractList = async () => {
    const token = returnApiToken();
    try {
      if (
        token.realmApiRoute !== "customer" &&
        token.realmApiRoute !== "account"
      ) {
        var response = await axiosInstance({
          ...GET_CONTRACT(token.realmApiRoute, token.tenantId),
          baseURL: window.baseURL.collector,
          // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
        });
        // console.log('Get contract list success:', JSON.stringify(response.data))

        const contract = response.data.content;
        setContractType(contract);
      }
    } catch (e) {
      // console.error('Get contract list failed:', e)
      return null;
    }
  };
  const getvehicleType = async () => {
    try {
      var response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_VEHICLE_TYPE,
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      });
      // console.log('Get vehicle list success:', JSON.stringify(response.data))

      const vehicle = response.data;
      setVehicleType(vehicle);
    } catch (e) {
      console.error("Get vehicle list failed:", e);
      return null;
    }
  };

  const getProcessList = async () => {
    try {
      const response = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...GET_PROCESS_LIST,
      });

      const processList = response.data;
      setProcessType(processList);
    } catch (e) {
      console.error("Get process record failed:", e);
      return null;
    }
  };

  const getProcessTypeList = async () => {
    try {
      const token = returnApiToken();
      if (
        token.realmApiRoute !== "logistic" &&
        token.realmApiRoute !== "customer" &&
        token.realmApiRoute !== "account"
      ) {
        const response = await axiosInstance({
          baseURL: window.baseURL.collector,
          ...GET_PROCESS_TYPE_DATA(token.realmApiRoute),
          params: {
            page: 0,
            size: 1000,
          },
          headers: {
            AuthToken: token.authToken,
          },
        });

        const processTypeListData = response.data.content;
        setProcessTypeList(processTypeListData);
      }
    } catch (error) {
      setProcessTypeList([]);
    }
  };

  const getContractLogistic = async () => {
    const token = returnApiToken();
    try {
      var response = await axiosInstance({
        ...GET_CONTRACT_LOGISTIC(token.tenantId),
        baseURL: window.baseURL.collector,
      });
      const contract = response.data.content;
      setContractLogistic(contract);
    } catch (e) {
      // console.error('Get contract list failed:', e)
      return null;
    }
  };

  const getImgSettings = async () => {
    const token = returnApiToken();
    try {
      var response = await axiosInstance({
        ...GET_IMG_SETTINGS(token.tenantId),
        baseURL: window.baseURL.account,
      });
      const imgSettings = response.data;
      if (imgSettings.ImgSize) {
        imgSettings.ImgSize *= 1000 * 1000;
      }
      setImgSettings(imgSettings);
    } catch (e) {
      return null;
    }
  };

  const initWeightUnit = async () => {
    try {
      const result = await getWeightUnit(page - 1, 1000);
      const data = result?.data;
      setWeightUnits(data);
    } catch (error) {
      return null;
    }
  };

  const getDecimalVal = async () => {
    try {
      const response = await axiosInstance({
        ...GET_DECIMAL_VAL(),
        baseURL: window.baseURL.administrator,
      });
      setDecimalVal(response?.data?.decimalVal || 0);
    } catch (e) {
      return null;
    }
  };

  const getDateFormat = async () => {
    try {
      const response = await axiosInstance({
        ...GET_DATE_FORMAT,
        baseURL: window.baseURL.administrator,
      });
      setDateFormat(response.data.dateFormat);
    } catch (error) {
      return null;
    }
  };

  const initCompaniesData = async () => {
    try {
      const result = await getAllTenant(1 - 1, 1000);
      if (result) {
        const data = result?.data.content;
        const mappingData: Company[] = data.map((item: any) => {
          return {
            id: item?.tenantId,
            nameEng: item?.companyNameEng,
            nameSchi: item?.companyNameSchi,
            nameTchi: item?.companyNameTchi,
          };
        });
        if (data.length > 0) {
          setCompanies(mappingData);
        }
      }
    } catch (error: any) {
      return null;
    }
  };

  const getTenantLogin = async () => {
    try {
      if (!tenantId) return;
      const response = await getTenantById(Number(tenantId));
      if (response.data) {
        const tenant: Company = {
          nameEng:
            response.data.companyNameEng ?? response.data.companyNameEng ?? "",
          nameSchi: response.data.companyNameSchi ?? "",
          nameTchi: response.data.companyNameTchi ?? "",
        };
        setCurrentTenant(tenant);
      }
    } catch (error) {
      return null;
    }
  };

  const getPackagingUnitList = async () => {
    try {
      const result = await getAllPackagingUnit(1 - 1, 1000);
      if (result.data) {
        setPackagingList(result.data.content);
      }
    } catch (error) {
      return null;
    }
  };

  const getProductType = async () => {
    const response = await getProductTypeList();
    const data = response.data;

    if (data) {
      setProductType(data);
    }
  };

  const updateCommonTypeContainer = () => {
    getColPointType();
    getPremiseType();
    getSiteType();
    getRecycType();
    getLogisticlist();
    getContractList();
    getvehicleType();
    getCollectorList();
    getManuList();
    getProcessList();
    getProcessTypeList();
    getContractLogistic();
    getImgSettings();
    getDecimalVal();
    getDateFormat();
    initCompaniesData();
    getTenantLogin();
    getPackagingUnitList();
    getProductType();
  };

  useEffect(() => {
    if (returnApiToken().authToken) {
      getColPointType();
      getPremiseType();
      getSiteType();
      getRecycType();
      getLogisticlist();
      getContractList();
      getvehicleType();
      getCollectorList();
      getManuList();
      getProcessList();
      getProcessTypeList();
      getContractLogistic();
      getImgSettings();
      getDecimalVal();
      initWeightUnit();
      getDateFormat();
      initCompaniesData();
      getTenantLogin();
      getPackagingUnitList();
      getProductType();
    }
  }, []);

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
    processTypeListData,
    contractLogistic,
    imgSettings,
    decimalVal,
    weightUnits,
    dateFormat,
    companies,
    currentTenant,
    packagingList,
    productType,
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
    getProcessTypeList,
    getContractLogistic,
    getImgSettings,
    getDecimalVal,
    getDateFormat,
    getProductType,
    initWeightUnit,
    initCompaniesData,
    getPackagingUnitList,
  };
};

const CommonTypeContainer = createContainer(CommonType);

export default CommonTypeContainer;
