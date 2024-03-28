import { CreateContract } from "../../interfaces/contract";
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import {
  CREATE_CONTRACT,
   CREATE_VEHICLE, DELETE_VEHICLE, EDIT_CONTRACT, EDIT_VEHICLE, GET_CONTRACT, GET_CONTRACT_LIST
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
      console.error('Get all contract failed:', e)
      return null
    }
  }
  //create contract
export const createContract = async (data: CreateContract) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.logistic,
      ...CREATE_CONTRACT,
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
export const editContract = async (data: CreateContract) => {
  try {
    const token = returnApiToken()

    const response = axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.logistic,
      ...EDIT_CONTRACT(data.tenantId, data.contractNo),
      data: data,
      headers: {
        AuthToken: token.authToken,
        'Content-Type': 'application/json'
      }
    })
    return response
  } catch (e) {
    console.error('Create a contract failed:', e)
    return null
  }
}