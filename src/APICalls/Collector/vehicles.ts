import { CreateVehicle } from "../../interfaces/vehicles";
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import {
   GET_VEHICLE, CREATE_VEHICLE, DELETE_VEHICLE, EDIT_VEHICLE
} from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from '../../constants/axiosInstance'

//get all warehouse
export const getAllVehicles = async (page: number, size: number) => {
    try {
      const token = returnApiToken()

      const response = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...GET_VEHICLE(token.realmApiRoute, token.decodeKeycloack),
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
  //create warehouse
  export const createVehicles = async (data: CreateVehicle) => {
    try {
      const token = returnApiToken()

      const response = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...CREATE_VEHICLE(token.realmApiRoute, token.decodeKeycloack),
        data: data,
        headers: {
          AuthToken: token.authToken
        }
      })
      return response
    } catch (e) {
      console.error('Create a vehicle failed:', e)
      return null
    }
  }

  export const editVehicle = async (data: CreateVehicle, vehicleId: number) => {
    try {
      const token = returnApiToken()

      const response = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...EDIT_VEHICLE(token.realmApiRoute, token.decodeKeycloack, vehicleId),
        data: data,
        headers: {
          AuthToken: token.authToken,
          'Content-Type': 'application/json'
        }
      })
      return response
    } catch (e) {
      console.error('Edit a vehicle failed:', e)
      return null
    }
  }
  
  //edit vehicle status
  export const deleteVehicle = async (data: string, vehicleId: number) => {
    try {
      const token = returnApiToken()

      const response = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...DELETE_VEHICLE(token.realmApiRoute, token.decodeKeycloack, vehicleId),
        data: data,
        headers: {
          AuthToken: token.authToken,
          'Content-Type': 'application/json'
        }
      })
      return response
    } catch (e) {
      console.error('Edit a vehicle failed:', e)
      return null
    }
  }
  
