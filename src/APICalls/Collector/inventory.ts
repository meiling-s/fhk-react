import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import { GET_INVENTORY } from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from '../../constants/axiosInstance'

//get all inventory
export const getAllInventory = async (page: number, size: number) => {
    try {
      const token = returnApiToken()

      const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
        ...GET_INVENTORY(token.realmApiRoute, token.decodeKeycloack),
        params: {
          page: page,
          size: size
        },
        headers: {
          AuthToken: token.authToken
        }
      })
      
      return response
    } catch (e) {
      console.error('Get all vehicle failed:', e)
      return null
    }
  }