import { AXIOS_DEFAULT_CONFIGS } from "../../constants/configs";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from "../../constants/axiosInstance";
import { UPDATE_TENANT_CURRENCY } from "../../constants/requests";
import { Currency } from "../../interfaces/currency";


export const updateUserCurrency = async (tenantId: string, monetaryValue: string, updatedBy: string) => {
    try {
        const token = returnApiToken()

        const response = await axiosInstance({
            baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.account,
            ...UPDATE_TENANT_CURRENCY(tenantId, monetaryValue, updatedBy),
            headers: {
                AuthToken: token.authToken
            }
        })
        return response
    } catch (e) {
        console.error('Create a contract failed:', e)
      return null
    }
}