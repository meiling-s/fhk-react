import axiosInstance from '../../constants/axiosInstance'
import {
  GET_ALL_CHECKIN_REQUESTS,
  GET_CHECKIN_REASON,
  GET_INTERNAL_TRANSFER_REQUEST,
  NEW_GET_ALL_HEADER_CHECKIN_REQUESTS,
  NEW_GET_DETAIL_CHECKIN_REQUESTS,
  UPDATE_CHECK_IN,
  UPDATE_CHECK_IN_STATUS,
  UPDATE_INTERNAL_TRANSFER_REQUEST_STATUS
} from '../../constants/requests'
import { CheckInWarehouse, updateStatus } from '../../interfaces/warehouse'
import { localStorgeKeyName } from '../../constants/constant'
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs'
import { returnApiToken } from '../../utils/utils'
import { queryCheckIn } from '../../interfaces/checkin'
import { queryInternalTransfer } from 'src/interfaces/internalTransferRequests'

const warehouseAPI = {
  baseURL: window.baseURL.collector
}

export const getAllCheckInRequests = async (
  page: number,
  size: number,
  query?: queryCheckIn
) => {
  try {
    const token = returnApiToken()
    let realmBaseURL = warehouseAPI.baseURL
    if(token.realmApiRoute.includes("manufacturer")){
      realmBaseURL = window.baseURL.manufacturer
    }
    let response
    response = await axiosInstance({
      ...NEW_GET_ALL_HEADER_CHECKIN_REQUESTS(
        token.realmApiRoute,
        token.decodeKeycloack
      ),
      baseURL: realmBaseURL,
      params: {
        page: page,
        size: size,
        table: token.decodeKeycloack,
        picoId: query?.picoId,
        senderName: query?.senderName,
        senderAddr: query?.senderAddr
      }
    })
    return response
  } catch (e: any) {
    // console.error('Get all check-in request failed:', e)
    return null
  }
}

export const getDetailCheckInRequests = async (checkinId: number) => {
  try {
    const token = returnApiToken()
    let realmBaseURL = warehouseAPI.baseURL
    if(token.realmApiRoute.includes("manufacturer")){
      realmBaseURL = window.baseURL.manufacturer
    }
    const response = await axiosInstance({
      ...NEW_GET_DETAIL_CHECKIN_REQUESTS(
        token.realmApiRoute,
        token.decodeKeycloack,
        checkinId
      ),
      baseURL: realmBaseURL
    })
    return response
  } catch (e: any) {
    // console.error('Get all check-in request failed:', e)
    throw e
  }
}

export const updateCheckin = async (
  chkInId: number,
  data: CheckInWarehouse,
  picoDtlId: number
) => {
  const token = returnApiToken()
  let realmBaseURL = warehouseAPI.baseURL
  if(token.realmApiRoute.includes("manufacturer")){
    realmBaseURL = window.baseURL.manufacturer
  }
  try {
    const response = await axiosInstance({
      ...UPDATE_CHECK_IN(
        token.realmApiRoute,
        chkInId,
        token.decodeKeycloack,
        picoDtlId
      ),
      baseURL: realmBaseURL,
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    // console.error('Update check-in request status failed:', e)
    return null
  }
}

export const updateCheckinStatus = async (
  chkInId: number,
  data: updateStatus
) => {
  const token = returnApiToken()
  let realmBaseURL = warehouseAPI.baseURL
  if(token.realmApiRoute.includes("manufacturer")){
    realmBaseURL = window.baseURL.manufacturer
  }
  try {
    const response = await axiosInstance({
      ...UPDATE_CHECK_IN_STATUS(
        token.realmApiRoute,
        chkInId,
        token.decodeKeycloack
      ),
      baseURL: realmBaseURL,
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    // console.error('Update check-in request status failed:', e)
    throw (e)
  }
}

export const getCheckinReasons = async () => {
  try {
    const token = returnApiToken()
    const keyRole = token.realmApiRoute

    const functId: { [key: string]: number } = {
      collectors: 4,
      manufacturer: 36,
      logistic: 4,
      customer: 4,
      account: 4
    }

    let realmBaseURL = warehouseAPI.baseURL
    if(token.realmApiRoute.includes("manufacturer")){
      realmBaseURL = window.baseURL.manufacturer
    }

    const response = await axiosInstance({
      ...GET_CHECKIN_REASON(
        token.realmApiRoute,
        token.tenantId,
        functId[keyRole]
      ),
      baseURL: realmBaseURL
    })
    return response
  } catch (e) {
    console.error('get checkin reasons failed:', e)
    throw e
  }
}

export const getInternalRequest = async (
  page: number,
  size: number,
  query?: queryInternalTransfer
) => {
  try {
    const token = returnApiToken()
    let response = await axiosInstance({
      ...GET_INTERNAL_TRANSFER_REQUEST(
        token.tenantId
      ),
      baseURL: window.baseURL.administrator,
      params: {
        page: page,
        size: size,
        recycTypeId: query?.recycTypeId,
        recycSubTypeId: query?.recycSubTypeId
      }
    })
    return response
  } catch (e: any) {
    // console.error('Get all check-in request failed:', e)
    throw (e)
  }
}

export const updateInternalRequestStatus = async (
  item: any
) => {
  try {
    const token = returnApiToken()
    let response = await axiosInstance({
      ...UPDATE_INTERNAL_TRANSFER_REQUEST_STATUS(
        token.tenantId
      ),
      baseURL: window.baseURL.administrator,
      data: item
    })
    return response
  } catch (e: any) {
    // console.error('Get all check-in request failed:', e)
    throw (e)
  }
}
