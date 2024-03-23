import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import {
  ASSIGN_DRIVER, REJECT_DRIVER
} from '../constants/requests'
import { returnApiToken } from '../utils/utils'
import axiosInstance from '../constants/axiosInstance'
import { AssignJobDriver, RejectJobDriver } from '../interfaces/pickupOrder'


export const assignDriver = async (data: AssignJobDriver) => {
  try {
    const token = returnApiToken()
    
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...ASSIGN_DRIVER(token.decodeKeycloack),
      data
    })

    return response
  } catch (e) {
    return null
  }
}

export const rejectDriver = async (data: RejectJobDriver, id: any) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...REJECT_DRIVER(token.decodeKeycloack, id),
      data
    })

    return response
  } catch (e) {
    return null
  }
}
