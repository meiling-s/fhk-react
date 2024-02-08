import axios from "axios";
import { localStorgeKeyName } from '../../constants/constant';
// import { CreateVehicle } from "../../interfaces/vehicles";
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import { GET_INVENTORY } from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";

const request = axios.create({
    baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
  })

//get all inventory
export const getAllInventory = async (page: number, size: number) => {
    try {
      const token = returnApiToken()

      const response = await request({
        ...GET_INVENTORY(token.decodeKeycloack),
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