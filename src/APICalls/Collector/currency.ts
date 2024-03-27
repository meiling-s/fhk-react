import { AXIOS_DEFAULT_CONFIGS } from "../../constants/configs";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from "../../constants/axiosInstance";
import { UPDATE_TENANT_REGISTER } from "../../constants/requests";
import { Currency } from "../../interfaces/currency";


export const updateUserCurrency = async (data: Currency, tenantId: number) => {
    try {
        const token = returnApiToken()

        const response = await axiosInstance({
            baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.account,
            ...UPDATE_TENANT_REGISTER(tenantId),
            data: data,
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