import {
  CREATE_FORGET_PASSWORD,
  GET_FORGET_PASSWORD_REQUEST,
  APPROVE_FORGET_PASSWORD_REQUEST,
  REJECT_FORGET_PASSWORD_REQUEST
} from '../constants/requests'
import { forgetPasswordForm } from '../interfaces/forgetPassword'
import axiosInstance from '../constants/axiosInstance'
import { returnApiToken } from '../utils/utils'
import { getUserAccountById } from './Collector/userGroup'

export const forgetPassword = async (data: forgetPasswordForm) => {
  const resUserAccount = await getUserAccountById(data.loginId)
  const tenantId = resUserAccount?.data?.tenantId || '';
  const token = {
    decodeKeyCloack: 'company' + tenantId
  }
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...CREATE_FORGET_PASSWORD(token.decodeKeyCloack),
      data: data
    })
    return response
  } catch (e) {
    console.error('request forget password failed:', e)
    return null
  }
}

export const getForgetPasswordRequest = async () => {
  const token = returnApiToken()
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...GET_FORGET_PASSWORD_REQUEST(token.decodeKeycloack),
      params: {
        page: 0,
        size: 100
      }
    })
    return response
  } catch (e) {
    console.error('get forget password request list failed:', e)
    throw(e)
  }
}

export const approveForgetPasswordRequest = async (data: any) => {
  const token = returnApiToken()
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...APPROVE_FORGET_PASSWORD_REQUEST(token.decodeKeycloack),
      data: data
    })
    return response
  } catch (e) {
    console.error('aprrove forget password request failed:', e)
    return null
  }
}

export const rejectForgetPasswordRequest = async (data: any) => {
  const token = returnApiToken()
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...REJECT_FORGET_PASSWORD_REQUEST(token.decodeKeycloack),
      data: data
    })
    return response
  } catch (e) {
    console.error('aprrove forget password request failed:', e)
    return null
  }
}
