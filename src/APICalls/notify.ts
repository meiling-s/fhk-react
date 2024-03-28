import axiosInstance from '../constants/axiosInstance'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import {
  GET_NUM_UNREAD_NOTIF,
  GET_NOTIF_BY_USER_ID,
  UPDATE_FLAG_NOTIF,
  GET_LIST_NOTIF_TEMPLATE_PO,
  GET_LIST_NOTIF_TEMPLATE_STAFF,
  GET_DETAIL_NOTIF_TEMPLATE,
  UPDATE_NOTIF_TEMPLATE,
  UPDATE_NOTIF_TEMPLATE_BROADCAST
} from '../constants/requests'
import { UpdateNotifTemplate, UpdateNotifTemplateBroadcast } from '../interfaces/notif'
import { returnApiToken } from '../utils/utils'

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

export const getListNotifTemplatePO = async (path: string) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      ...GET_LIST_NOTIF_TEMPLATE_PO(token.tenantId, path),
      baseURL: administratorAPI.baseURL
    })
    return response
  } catch (e) {
    return null
  }
}

export const getListNotifTemplateStaff = async (path: string) => {
  try {
    const token = returnApiToken();
    const response = await axiosInstance({
      ...GET_LIST_NOTIF_TEMPLATE_STAFF(token.tenantId, path),
      baseURL: administratorAPI.baseURL
    })
    return response
  } catch (e) {
    return null
  }
}

export const getDetailNotifTemplate = async (templateId: string, path: string) => {
  try {
    const token = returnApiToken();
    const response = await axiosInstance({
      ...GET_DETAIL_NOTIF_TEMPLATE(token.tenantId, templateId, path),
      baseURL: administratorAPI.baseURL
    })
    return response.data
  } catch (e) {
    return null
  }
}

export const updateNotifTemplate = async (templateId: string, data: UpdateNotifTemplate, path: string) => {
  try {
    const token = returnApiToken();
    const response = await axiosInstance({
      ...UPDATE_NOTIF_TEMPLATE(token.tenantId, templateId, path),
      baseURL: administratorAPI.baseURL,
      data
    })
    return response.data
  } catch (e) {
    return null
  }
}

export const updateNotifTemplateBroadcast = async (templateId: string, data: UpdateNotifTemplateBroadcast, path: string) => {
  try {
    const token = returnApiToken();
    const response = await axiosInstance({
      ...UPDATE_NOTIF_TEMPLATE_BROADCAST(token.tenantId, templateId, path),
      baseURL: administratorAPI.baseURL,
      data
    })
    return response.data
  } catch (e) {
    return null
  }
}
