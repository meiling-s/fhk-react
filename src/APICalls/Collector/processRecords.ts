import axios from 'axios'
import { localStorgeKeyName } from '../../constants/constant'
// import { CreateVehicle } from "../../interfaces/vehicles";
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs'
import {
  GET_PROCESS_OUT,
  CREATE_PROCESS_OUT_ITEM,
  DELETE_PROCESS_OUT_ITEM
} from '../../constants/requests'
import { returnApiToken } from '../../utils/utils'

const request = axios.create({
  baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
})

//get all inventory
export const getAllProcessRecord = async (page: number, size: number) => {
  try {
    const token = returnApiToken()

    const response = await request({
      ...GET_PROCESS_OUT(token.decodeKeycloack),
      params: {
        page: page,
        size: size
      }
    })

    return response
  } catch (e) {
    console.error('Get all vehicle failed:', e)
    return null
  }
}

export const createProcessRecordItem = async (
  data: any,
  processOutId: number
) => {
  try {
    const token = returnApiToken()

    const response = await request({
      ...CREATE_PROCESS_OUT_ITEM(token.decodeKeycloack, processOutId),
      data: data
    })

    return response
  } catch (e) {
    console.error('Get all vehicle failed:', e)
    return null
  }
}

export const deleteProcessRecord = async (
  page: number,
  size: number,
  data: any,
  processOutId: number
) => {
  try {
    const token = returnApiToken()

    const response = await request({
      ...DELETE_PROCESS_OUT_ITEM(token.decodeKeycloack, processOutId),
      params: {
        page: page,
        size: size
      }
    })

    return response
  } catch (e) {
    console.error('Get all vehicle failed:', e)
    return null
  }
}
