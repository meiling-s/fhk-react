import axios from "axios";
import { localStorgeKeyName } from '../../constants/constant';
// import { CreateVehicle } from "../../interfaces/vehicles";
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import { GET_INVENTORY } from "../../constants/requests";

const request = axios.create({
    baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
  })


const decodeKeycloack =
  localStorage.getItem(localStorgeKeyName.decodeKeycloack) || ''

const authToken = localStorage.getItem(
  localStorgeKeyName.keycloakToken || ''
)

//get all inventory
export const getAllInventory = async (page: number, size: number) => {
    try {
      const response = await request({
        ...GET_INVENTORY(decodeKeycloack),
        params: {
          page: page,
          size: size
        },
        headers: {
          AuthToken: authToken
        }
      })
      
      return response
    } catch (e) {
      console.error('Get all vehicle failed:', e)
      return null
    }
  }