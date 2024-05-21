import { ASTD_GET_INVENTORY, GET_INVENTORY, GET_ITEM_TRACK_INVENTORY } from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from '../../constants/axiosInstance'

//get all inventory
export const getAllInventory = async (page: number, size: number) => {
    try {
      const token = returnApiToken()

      const response = await axiosInstance({
        baseURL: window.baseURL.collector,
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

export const getItemTrackInventory = async (realmApiRoute: string, table: string, itemId: number) => {
  try {
      const response = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...GET_ITEM_TRACK_INVENTORY(realmApiRoute, table, itemId)
      })

      return response
  } catch (error) {
    console.error('Get all vehicle failed:', error)
    return null
  }
}
  export const astdGetAllInventory = async (page: number, size: number, table: string) => {
    try {
      const token = returnApiToken()

      const response = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...ASTD_GET_INVENTORY(token.realmApiRoute, table),
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
