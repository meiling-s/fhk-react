import axiosInstance from '../../constants/axiosInstance'
import { GET_CHECKIN_CHECKOUT_LIST } from '../../constants/requests'
import { queryCheckInOut } from '../../interfaces/checkInOut'
import { returnApiToken } from '../../utils/utils'

export const getAllCheckInOutRequest = async (
  page: number,
  size: number,
  query: queryCheckInOut
) => {
  try {
    const token = returnApiToken()
    const table = token.decodeKeycloack

    const params: any = {
      page: page,
      size: size,
      table: table
    }

    if (query?.picoId) params.picoId = query.picoId
    if (query?.company) params.company = query.company
    if (query?.addr) params.addr = query.addr
    if (query?.inout) params.inout = query.inout

    const response = await axiosInstance({
      ...GET_CHECKIN_CHECKOUT_LIST(table, token.realmApiRoute),
      baseURL: window.baseURL.collector,
      params: params
    })
    return response
  } catch (e: any) {
    console.error('Get all checkoutout data failed:', e)
    return null
  }
}
