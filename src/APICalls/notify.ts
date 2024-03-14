import axiosInstance from '../constants/axiosInstance'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import {
  GET_NUM_UNREAD_NOTIF,
  GET_NOTIF_BY_USER_ID,
  UPDATE_FLAG_NOTIF
} from '../constants/requests'

const administratorAPI = {
  baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator
}

export const getNumUnreadNotif = async (loginId: string) => {
  try {
    const response = await axiosInstance({
      ...GET_NUM_UNREAD_NOTIF(loginId),
      baseURL: administratorAPI.baseURL
    })
    return response
  } catch (e) {
    console.error(`Get unread notif for loginId ${loginId} failed:`, e)
    return null
  }
}

export const getNotifByUserId = async (loginId: string) => {
  try {
    const response = await axiosInstance({
      ...GET_NOTIF_BY_USER_ID(loginId),
      baseURL: administratorAPI.baseURL
    })
    return response
  } catch (e) {
    console.error(`Get notif for loginId ${loginId} failed:`, e)
    return null
  }
}

export const updateFlagNotif = async (notiId: number) => {
  try {
    const response = await axiosInstance({
      ...UPDATE_FLAG_NOTIF(notiId),
      baseURL: administratorAPI.baseURL
    })
    return response
  } catch (e) {
    console.error(`update flag notif for notifId ${notiId} failed:`, e)
    return null
  }
}
