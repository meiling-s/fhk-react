import axiosInstance from '../../constants/axiosInstance'
import {
  GET_ALL_CHECKIN_REQUESTS,
  GET_CHECKIN_REASON,
  NEW_GET_ALL_HEADER_CHECKIN_REQUESTS,
  NEW_GET_DETAIL_CHECKIN_REQUESTS,
  UPDATE_CHECK_IN,
  UPDATE_CHECK_IN_STATUS
} from '../../constants/requests'
import { CheckInWarehouse, updateStatus } from '../../interfaces/warehouse'
import { localStorgeKeyName } from '../../constants/constant'
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs'
import { returnApiToken } from '../../utils/utils'
import { queryCheckIn } from '../../interfaces/checkin'

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
    let response
    response = await axiosInstance({
      ...NEW_GET_ALL_HEADER_CHECKIN_REQUESTS(
        token.realmApiRoute,
        token.decodeKeycloack
      ),
      baseURL: warehouseAPI.baseURL,
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

    const response = await axiosInstance({
      ...NEW_GET_DETAIL_CHECKIN_REQUESTS(
        token.realmApiRoute,
        token.decodeKeycloack,
        checkinId
      ),
      baseURL: warehouseAPI.baseURL
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

  try {
    const response = await axiosInstance({
      ...UPDATE_CHECK_IN(
        token.realmApiRoute,
        chkInId,
        token.decodeKeycloack,
        picoDtlId
      ),
      baseURL: warehouseAPI.baseURL,
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

  try {
    const response = await axiosInstance({
      ...UPDATE_CHECK_IN_STATUS(
        token.realmApiRoute,
        chkInId,
        token.decodeKeycloack
      ),
      baseURL: warehouseAPI.baseURL,
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

    const response = await axiosInstance({
      ...GET_CHECKIN_REASON(
        token.realmApiRoute,
        token.tenantId,
        functId[keyRole]
      ),
      baseURL: warehouseAPI.baseURL
    })
    return response
  } catch (e) {
    console.error('get checkin reasons failed:', e)
    throw e
  }
}
