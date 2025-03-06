import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs'
import {
  GET_DENIAL_REASON,
  GET_DENIAL_REASON_BY_FUNCTION_ID,
  CREATE_DENIAL_REASON,
  UPDATE_DENIAL_REASON
} from '../../constants/requests'
import { returnApiToken } from '../../utils/utils'
import axiosInstance from '../../constants/axiosInstance'
import { CreateDenialReason } from '../../interfaces/denialReason'

//get all denial reasons
export const getAllDenialReason = async (page: number, size: number) => {
  try {
    const token = returnApiToken()

    let realmBaseURL = window.baseURL.account
    if(token.realmApiRoute.includes("collectors")){
      realmBaseURL = window.baseURL.collector
    }
    else if(token.realmApiRoute.includes("manufacturer")){
      realmBaseURL = window.baseURL.manufacturer
    }
    else if(token.realmApiRoute.includes("logistic")){
      realmBaseURL = window.baseURL.logistic
    }

    const response = await axiosInstance({
      baseURL: realmBaseURL,
      ...GET_DENIAL_REASON(token.realmApiRoute, token.tenantId),
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
    console.error('Get all denial reason failed:', e)
    throw e
  }
}

//get all denial reasons
export const getAllDenialReasonByFunctionId = async (
  page: number,
  size: number,
  functionId: number
) => {
  try {
    const token = returnApiToken()

    let realmBaseURL = window.baseURL.account
    if(token.realmApiRoute.includes("collectors")){
      realmBaseURL = window.baseURL.collector
    }
    else if(token.realmApiRoute.includes("manufacturer")){
      realmBaseURL = window.baseURL.manufacturer
    }
    else if(token.realmApiRoute.includes("logistic")){
      realmBaseURL = window.baseURL.logistic
    }

    const response = await axiosInstance({
      baseURL:realmBaseURL,
      ...GET_DENIAL_REASON_BY_FUNCTION_ID(
        token.realmApiRoute,
        token.tenantId,
        functionId
      ),
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
    console.error('Get all denial reason failed:', e)
    throw e
  }
}

export const getReasonTenant = async (
  page: number,
  size: number,
  tenantId: string,
  functionId: number
) => {
  try {
    const token = returnApiToken()

    let realmBaseURL = window.baseURL.account
    if(token.realmApiRoute.includes("collectors")){
      realmBaseURL = window.baseURL.collector
    }
    else if(token.realmApiRoute.includes("manufacturer")){
      realmBaseURL = window.baseURL.manufacturer
    }
    else if(token.realmApiRoute.includes("logistic")){
      realmBaseURL = window.baseURL.logistic
    }

    const response = await axiosInstance({
      baseURL: realmBaseURL,
      ...GET_DENIAL_REASON_BY_FUNCTION_ID('account', tenantId, functionId),
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
    console.error('Get all denial reason failed:', e)
    return null
  }
}

// create denial reason
export const createDenialReason = async (data: CreateDenialReason) => {
  try {
    const token = returnApiToken()

    let realmBaseURL = window.baseURL.account
    if(token.realmApiRoute.includes("collectors")){
      realmBaseURL = window.baseURL.collector
    }
    else if(token.realmApiRoute.includes("manufacturer")){
      realmBaseURL = window.baseURL.manufacturer
    }
    else if(token.realmApiRoute.includes("logistic")){
      realmBaseURL = window.baseURL.logistic
    }

    const response = await axiosInstance({
      baseURL: realmBaseURL,
      ...CREATE_DENIAL_REASON(token.realmApiRoute),
      params: {
        tenantId: data.tenantId,
        reasonNameTchi: data.reasonNameTchi,
        reasonNameSchi: data.reasonNameSchi,
        reasonNameEng: data.reasonNameEng,
        description: data.description,
        remark: data.remark,
        functionId: data.functionId,
        status: data.status,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy
      },
      headers: {
        AuthToken: token.authToken
      }
    })

    return response
  } catch (e) {
    console.error('create denial reason failed:', e)
    throw e
  }
}

// update denial reason
export const editDenialReason = async (
  reasonId: number,
  data: CreateDenialReason
) => {
  try {
    const token = returnApiToken()

    let realmBaseURL = window.baseURL.account
    if(token.realmApiRoute.includes("collectors")){
      realmBaseURL = window.baseURL.collector
    }
    else if(token.realmApiRoute.includes("manufacturer")){
      realmBaseURL = window.baseURL.manufacturer
    }
    else if(token.realmApiRoute.includes("logistic")){
      realmBaseURL = window.baseURL.logistic
    }

    const response = await axiosInstance({
      baseURL: realmBaseURL,
      ...UPDATE_DENIAL_REASON(token.realmApiRoute, token.tenantId, reasonId),
      data: data
    })

    return response
  } catch (e: any) {
    console.error('update denial reason failed:', e)
    console.error('e?.status', e?.status)
    if (e?.status === 404) return null
    throw e
  }
}
