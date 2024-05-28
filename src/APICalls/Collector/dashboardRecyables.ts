import { getBaseUrl, returnApiToken } from "../../utils/utils";
import axiosInstance from "../../constants/axiosInstance";
import { 
    GET_COLPOINTRECYCABLES_DASHBOARD, 
    GET_WEIGHT_RECYCABLES_DASHBOARD,
    GET_SALES_PRODUCT_ANALYSIS,
    GET_RECYC_PROCESS_ANALYSIS,
    GET_TOTAL_SALES_PRODUCT_ANALYSIS,
    GET_TOTAL_SALES_PRODUCT_BY_DISTRICT_ANALYSIS,
    GET_WEIGHT_RECYCABLES_DASHBOARD_ASTD
 } from "../../constants/requests";

export const getcolPointRecyclablesDashboard = async (frmDate: string, toDate: string, colId?: number | null) => {
    try {
        const token = returnApiToken()

        const response = await axiosInstance({
            baseURL: getBaseUrl(),
            ...GET_COLPOINTRECYCABLES_DASHBOARD(token.tenantId, token.realmApiRoute),
            params: {
                frmDate: frmDate,
                toDate: toDate,
                colId
              },
            headers: {
                AuthToken: token.authToken
            }
        })
        return response
    } catch (e) {
        console.error('getcolPointRecyclablesDashboard failed:', e)
      return null
    }
}

export const getWeightRecyclablesColPointDashboard = async (frmDate: string, toDate: string) => {
    try {
        const token = returnApiToken()

        const response = await axiosInstance({
            baseURL: getBaseUrl(),
            ...GET_WEIGHT_RECYCABLES_DASHBOARD(token.decodeKeycloack, frmDate, toDate),
            headers: {
                AuthToken: token.authToken
            }
        })
        return response.data
    } catch (e) {
        console.error('getWeightRecyclablesColPointDashboard failed:', e)
      return null
    }
}

export const getSalesProductAnalysis = async (frmDate: string, toDate: string) => {
    try {
        const token = returnApiToken()

        const response = await axiosInstance({
            baseURL: getBaseUrl(),
            ...GET_SALES_PRODUCT_ANALYSIS(token.tenantId, frmDate, toDate),
            headers: {
                AuthToken: token.authToken
            }
        })
        return response?.data
    } catch (e) {
        console.error('getSalesProductAnalysis failed:', e)
      return null
    }
}

export const getRecycProcessAnalysis = async (frmDate: string, toDate: string) => {
    try {
        const token = returnApiToken()

        const response = await axiosInstance({
            baseURL: getBaseUrl(),
            ...GET_RECYC_PROCESS_ANALYSIS(token.decodeKeycloack, frmDate, toDate),
            headers: {
                AuthToken: token.authToken
            }
        })
        return response?.data
    } catch (e) {
        console.error('getrecycProcessAnalysis failed:', e)
      return null
    }
}

export const getTotalSalesProductAnalysis = async (frmDate: string, toDate: string) => {
    try {
        const token = returnApiToken()

        const response = await axiosInstance({
            baseURL: getBaseUrl(),
            ...GET_TOTAL_SALES_PRODUCT_ANALYSIS(token.tenantId, frmDate, toDate),
            headers: {
                AuthToken: token.authToken
            }
        })
        return response?.data
    } catch (e) {
        console.error('getrecycProcessAnalysis failed:', e)
      return null
    }
}

export const getTotalSalesProductByDistrictAnalysis = async (frmDate: string, toDate: string) => {
    try {
        const token = returnApiToken()

        const response = await axiosInstance({
            baseURL: getBaseUrl(),
            ...GET_TOTAL_SALES_PRODUCT_BY_DISTRICT_ANALYSIS(token.tenantId, frmDate, toDate),
            headers: {
                AuthToken: token.authToken
            }
        })
        return response?.data
    } catch (e) {
        console.error('getTotalSalesProductByDistrictAnalysis failed:', e)
      return null
    }
}

export const getWeightRecyclablesColPointAstd = async (tenandId: string, frmDate: string, toDate: string) => {
    try {
        const token = returnApiToken()

        const response = await axiosInstance({
            baseURL: getBaseUrl(),
            ...GET_WEIGHT_RECYCABLES_DASHBOARD_ASTD(tenandId, frmDate, toDate),
            headers: {
                AuthToken: token.authToken
            }
        })
        return response
    } catch (error:any) {
        console.log('getWeightRecyclablesColPointDashboard', error?.response.data.message)
      return error
    }
}