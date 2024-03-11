import axios from 'axios'
import { localStorgeKeyName } from '../constants/constant'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import {
  GET_STAFF,
  CREATE_STAFF,
  EDIT_STAFF,
  GET_LOGINID_LIST,
  GET_TITLE_LIST
} from '../constants/requests'
import { returnApiToken } from '../utils/utils'

const request = axios.create({
  baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
})

//get all staff
export const getStaffList = async (page: number, size: number) => {
  try {
    const token = returnApiToken()

    const response = await request({
      ...GET_STAFF(token.tenantId),
      params: {
        page: page,
        size: size
      }
    })

    return response
  } catch (e) {
    console.error('Get all staff failed:', e)
    return null
  }
}
//create staff
export const createStaff = async (data: any) => {
  try {
    const token = returnApiToken()

    const response = await request({
      ...CREATE_STAFF,
      data: data
    })
    console.log("response", createStaff)
    return response
  } catch (e) {
    console.error('Create a staff failed:', e)
    return null
  }
}

//edit staff
export const editStaff = async (data: any, staffId: string) => {
  try {
    const token = returnApiToken()

    const response = await request({
      ...EDIT_STAFF(token.tenantId, staffId),
      data: data
    })
    return response
  } catch (e) {
    console.error(`Edit staff ${staffId} failed:`, e)
    return null
  }
}

//get login id list
export const getLoginIdList = async () => {
  try {
    const token = returnApiToken()

    const response = await request({
      ...GET_LOGINID_LIST(token.tenantId),
      params: {
        page: 0,
        size: 20
      }
    })

    return response
  } catch (e) {
    console.error('Get all loginId list failed:', e)
    return null
  }
}

//get login id list
export const getStaffTitle = async () => {
  try {
    const token = returnApiToken()

    const response = await request({
      ...GET_TITLE_LIST(token.decodeKeycloack),
      params: {
        page: 0,
        size: 20
      }
    })

    return response
  } catch (e) {
    console.error('Get all loginId list failed:', e)
    return null
  }
}
