import {
  GET_DENIAL_REASON_COLLECTORS,
  GET_DENIAL_REASON_BY_FUNCTION_ID_COLLECTORS,
  CREATE_DENIAL_REASON_COLLECTORS,
  UPDATE_DENIAL_REASON_COLLECTORS
} from '../../constants/requests'
import { returnApiToken } from '../../utils/utils'
import axiosInstance from '../../constants/axiosInstance'
import { CreateDenialReasonCollectors, UpdateDenialReasonCollectors } from '../../interfaces/denialReason'

export const getDenialReasonCollectors = async (page: number, size: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_DENIAL_REASON_COLLECTORS(token.tenantId),
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
    console.error('Get all denial reason collectors failed:', e)
    throw e
  }
}

export const getDenialReasonByFunctionIdCollectors = async (
  page: number,
  size: number,
  functionId: number
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_DENIAL_REASON_BY_FUNCTION_ID_COLLECTORS(
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
    console.error('Get all denial reason collectors failed:', e)
    throw e
  }
}

export const createDenialReasonCollectors = async (
  data: CreateDenialReasonCollectors
) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...CREATE_DENIAL_REASON_COLLECTORS,
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })

    return response
  } catch (e) {
    console.error('create denial reason collectors failed:', e)
    throw e
  }
}

export const editDenialReasonCollectors = async (
  reasonId: number,
  data: UpdateDenialReasonCollectors
) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...UPDATE_DENIAL_REASON_COLLECTORS(token.tenantId, reasonId),
      data: data
    })

    return response
  } catch (e) {
    console.error('update denial reason collectors failed:', e)
    throw e
  }
}
