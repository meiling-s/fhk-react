import { CreateContract } from "../../interfaces/contract";
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import {
  CREATE_CONTRACT,
   CREATE_VEHICLE, DELETE_VEHICLE, EDIT_VEHICLE, GET_CONTRACT, GET_CONTRACT_LIST
} from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from '../../constants/axiosInstance'

//get all contract
export const getAllContract = async (page: number, size: number) => {
    try {
      const token = returnApiToken()

      const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
        ...GET_CONTRACT_LIST(token.tenantId),
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
  //create contract
export const createContract = async (data: CreateContract) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...CREATE_CONTRACT,
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
      console.error('Create a Contract failed:', e)
      return null
  }
}
//   export const createVehicles = async (data: CreateVehicle) => {
//     try {
//       const token = returnApiToken()

//       const response = await axiosInstance({
//         baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
//         ...CREATE_VEHICLE(token.decodeKeycloack),
//         data: data,
//         headers: {
//           AuthToken: token.authToken
//         }
//       })
//       return response
//     } catch (e) {
//       console.error('Create a vehicle failed:', e)
//       return null
//     }
//   }

//   export const editVehicle = async (data: CreateVehicle, vehicleId: number) => {
//     try {
//       const token = returnApiToken()

//       const response = await axiosInstance({
//         baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
//         ...EDIT_VEHICLE(token.decodeKeycloack, vehicleId),
//         data: data,
//         headers: {
//           AuthToken: token.authToken,
//           'Content-Type': 'application/json'
//         }
//       })
//       return response
//     } catch (e) {
//       console.error('Edit a vehicle failed:', e)
//       return null
//     }
//   }
  
//   //edit vehicle status
//   export const deleteVehicle = async (data: string, vehicleId: number) => {
//     try {
//       const token = returnApiToken()

//       const response = await axiosInstance({
//         baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
//         ...DELETE_VEHICLE(token.decodeKeycloack, vehicleId),
//         data: data,
//         headers: {
//           AuthToken: token.authToken,
//           'Content-Type': 'application/json'
//         }
//       })
//       return response
//     } catch (e) {
//       console.error('Edit a vehicle failed:', e)
//       return null
//     }
//   }
  
