import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import {CREATE_PACKAGING, EDIT_PACKAGING, GET_PACKAGING_LIST} from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from '../../constants/axiosInstance'
import { CreatePackagingUnit } from "../../interfaces/packagingUnit";

export const getAllPackagingUnit = async (page: number, size: number) => {
    try {
      const token = returnApiToken()

      const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.logistic,
        ...GET_PACKAGING_LIST(token.tenantId),
        headers: {
          AuthToken: token.authToken
        }
      })
      return response
    } catch (e) {
      console.error('Get all packaging unit failed:', e)
      return null
    }
  }

export const createPackaging = async (data: CreatePackagingUnit) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.logistic,
      ...CREATE_PACKAGING,
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    console.error('Get all packaging unit failed:', e)
    return null
  }
}

export const editPackaging = async (data: CreatePackagingUnit, packagingTypeId: string) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.logistic,
      ...EDIT_PACKAGING(data.tenantId, packagingTypeId),
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    console.error('Get all packaging unit failed:', e)
    return null
  }
}
// export const createContract = async (data: CreateContract) => {
//   try {
//     const token = returnApiToken()

//     const response = await axiosInstance({
//       baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.logistic,
//       ...CREATE_CONTRACT,
//       data: data,
//       headers: {
//         AuthToken: token.authToken
//       }
//     })
//     return response

//   } catch (e) {
//       console.error('Create a contract failed:', e)
//       return null
//   }
// }
// export const editContract = async (data: CreateContract) => {
//   try {
//     const token = returnApiToken()

//     const response = axiosInstance({
//       baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.logistic,
//       ...EDIT_CONTRACT(data.tenantId, data.contractNo),
//       data: data,
//       headers: {
//         AuthToken: token.authToken,
//         'Content-Type': 'application/json'
//       }
//     })
//     return response
//   } catch (e) {
//     console.error('Create a contract failed:', e)
//     return null
//   }
// }