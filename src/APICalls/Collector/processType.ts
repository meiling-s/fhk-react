import { CREATE_PROCESS_TYPE_DATA, DELETE_PROCESS_TYPE_DATA, GET_PROCESS_TYPE_DATA, UPDATE_PROCESS_TYPE_DATA } from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from '../../constants/axiosInstance'
import { CreateProcessTypeProps } from "../../interfaces/processType";

export const createProcessTypeData = async (data: CreateProcessTypeProps) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...CREATE_PROCESS_TYPE_DATA(token.realmApiRoute),
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    throw (e)
  }
}

export const getProcessTypeData = async (page: number, pageSize: number) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_PROCESS_TYPE_DATA(token.realmApiRoute),
      params: {
        page: page,
        size: pageSize
      },
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (error) {
    throw (error)
  }
}

export const updateProcessTypeData = async (data: CreateProcessTypeProps, processTypeId: string) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...UPDATE_PROCESS_TYPE_DATA(token.realmApiRoute, processTypeId),
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    throw (e)
  }
}

export const deleteProcessTypeData = async (processTypeId: string) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...DELETE_PROCESS_TYPE_DATA(token.realmApiRoute, processTypeId),
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (error) {
    throw (error)
  }
}