import { AXIOS_DEFAULT_CONFIGS } from "../../constants/configs";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from "../../constants/axiosInstance";
import { GET_CURRENCY_LIST, UPDATE_TENANT_CURRENCY } from "../../constants/requests";
import { Currency } from "../../interfaces/currency";


export const getCurrencyList = async () => {
    try {
        const token = returnApiToken()

        const response = await axiosInstance({
            baseURL: window.baseURL.administrator,
            ...GET_CURRENCY_LIST,
            headers: {
                AuthToken: token.authToken
            }
        })
        return response
    } catch (e) {
      return null
    }
}


export const updateUserCurrency = async (tenantId: string, monetaryValue: string, updatedBy: string, version: number) => {
    try {
        const token = returnApiToken()

        const response = await axiosInstance({
            baseURL: window.baseURL.account,
            ...UPDATE_TENANT_CURRENCY(tenantId, monetaryValue, updatedBy, version),
            headers: {
                AuthToken: token.authToken
            }
        })
        return response
    } catch (e) {
      throw (e)
    }
}