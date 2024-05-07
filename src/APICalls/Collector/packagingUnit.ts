import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import {CREATE_PACKAGING, EDIT_PACKAGING, GET_PACKAGING_LIST} from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from '../../constants/axiosInstance'
import { CreatePackagingUnit } from "../../interfaces/packagingUnit";

export const getAllPackagingUnit = async (page: number, size: number) => {
    try {
      const token = returnApiToken()
      const response = await axiosInstance({
        baseURL: window.baseURL.logistic,
        ...GET_PACKAGING_LIST(token.realmApiRoute, token.tenantId),
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
      console.error('Get all packaging unit failed:', e)
      return null
    }
  }

export const createPackaging = async (data: CreatePackagingUnit) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: window.baseURL.logistic,
      ...CREATE_PACKAGING(token.realmApiRoute),
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
      baseURL: window.baseURL.logistic,
      ...EDIT_PACKAGING(token.realmApiRoute, data.tenantId, packagingTypeId),
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