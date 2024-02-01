import axios from "axios";
import { localStorgeKeyName } from '../../constants/constant';
import { CreateVehicle } from "../../interfaces/vehicles";
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import {
   GET_VEHICLE, CREATE_VEHICLE, DELETE_VEHICLE, EDIT_VEHICLE
} from "../../constants/requests";

const request = axios.create({
    baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
  })


const decodeKeycloack =
  localStorage.getItem(localStorgeKeyName.decodeKeycloack) || ''

const authToken = localStorage.getItem(
  localStorgeKeyName.keycloakToken || ''
)

//get all warehouse
export const getAllVehicles = async (page: number, size: number) => {
    try {
      const response = await request({
        ...GET_VEHICLE(decodeKeycloack),
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
  //create warehouse
  export const createVehicles = async (data: CreateVehicle) => {
    try {
      const response = await request({
        ...CREATE_VEHICLE(decodeKeycloack),
        data: data,
        headers: {
          AuthToken: authToken
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
      const response = await request({
        ...EDIT_VEHICLE(decodeKeycloack, vehicleId),
        data: data,
        headers: {
          AuthToken: authToken,
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
      const response = await request({
        ...DELETE_VEHICLE(decodeKeycloack, vehicleId),
        data: data,
        headers: {
          AuthToken: authToken,
          'Content-Type': 'application/json'
        }
      })
      return response
    } catch (e) {
      console.error('Edit a vehicle failed:', e)
      return null
    }
  }
  
