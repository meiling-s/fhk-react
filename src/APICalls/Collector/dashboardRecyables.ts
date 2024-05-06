import { AXIOS_DEFAULT_CONFIGS } from "../../constants/configs";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from "../../constants/axiosInstance";
import { GET_COLPOINTRECYCABLES_DASHBOARD } from "../../constants/requests";

export const getcolPointRecyclablesDashboard = async (frmDate: string, toDate: string, colId?: number) => {
    try {
        const token = returnApiToken()

        const response = await axiosInstance({
            baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
            ...GET_COLPOINTRECYCABLES_DASHBOARD(token.tenantId),
            params: {
                frmDate: frmDate,
                toDate: toDate,
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
