import { CreateContract } from "../../interfaces/contract";
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import { CREATE_CONTRACT, EDIT_CONTRACT, GET_CONTRACT_LIST, DELETE_CONTRACT} from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from '../../constants/axiosInstance';

//get all contract
export const getAllContract = async (page: number, size: number) => {
    try {
      const token = returnApiToken()
      const response = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...GET_CONTRACT_LIST(token.realmApiRoute, token.tenantId),
        params: {
          page: page,
          size: size,
        },
        headers: {
          AuthToken: token.authToken
        }
      })
      return response
    } catch (e) {
      console.error('Get all contract failed:', e)
      throw(e)
    }
  }
  //create contract
export const createContract = async (data: CreateContract) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: window.baseURL.logistic,
      ...CREATE_CONTRACT(token.realmApiRoute),
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    return response

  } catch (e) {
      console.error('Create a contract failed:', e)
      throw(e)
  }
}
export const editContract = async (data: CreateContract) => {
  try {
    const token = returnApiToken()
    const response = axiosInstance({
      baseURL: window.baseURL.logistic,
      ...EDIT_CONTRACT(token.realmApiRoute, data.tenantId, data.contractNo),
      data: data,
      headers: {
        AuthToken: token.authToken,
        'Content-Type': 'application/json'
      }
    })
    return response
  } catch (e) {
    console.error('Create a contract failed:', e)
    throw(e)
  }
}

export const deleteContract = async (data: any, contractNo: string) => {
  try {
    const token = returnApiToken()
    const response = axiosInstance({
      baseURL: window.baseURL.logistic,
      ...DELETE_CONTRACT(token.realmApiRoute, token.tenantId, contractNo),
      data: data,
      headers: {
        AuthToken: token.authToken,
        'Content-Type': 'application/json'
      }
    })
    return response
  } catch (e) {
    console.error('Create a contract failed:', e)
    throw(e)
  }
}