import { localStorgeKeyName } from '../constants/constant'
import {
  ADD_TENANT,
  GET_ALL_TENANT,
  SEARCH_TENANT,
  GET_TENANT_BY_TENANT_ID,
  UPDATE_TENANT_REGISTER,
  UPDATE_TENANT_STATUS,
  SEND_EMAIL_INVITATION,
  UPDATE_TENANT_INFO,
  GET_REGISTER_LINK_STATUS,
} from '../constants/requests'
import { CREATE_TENANT } from 'src/constants/requestsSocif'
import { RegisterItem } from '../interfaces/account'
import { CreateTenant, UpdateStatus } from '../interfaces/tenant'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import { returnApiToken } from '../utils/utils'
import axiosInstance, { cleanAxiosInstance } from '../constants/axiosInstance'

export const createInvitation = async (
  item: CreateTenant,
  tenantType: string
) => {
  console.log(
    `Token: ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`
  )

  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
      ...ADD_TENANT(tenantType),
      data: item,
      headers: {}
    })
    console.log('Insert tenant success:', JSON.stringify(response.data))
    return response
  } catch (e: any) {
    console.error('Insert tenant Failed:', e)
    throw e
  }
}

export const getAllTenant = async (page: number, size: number) => {
  const token = returnApiToken()
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
      ...GET_ALL_TENANT,
      params: {
        page: page,
        size: size
        //tenantId: token.tenantId
      },
      headers: {}
    })
    //console.log('Get all tenant success:', JSON.stringify(response.data))
    return response
  } catch (e) {
    console.error('Get all tenant failed:', e)
    throw e
  }
}

export const searchTenantById = async (
  page: number,
  size: number,
  tenantId: number
) => {
  const token = returnApiToken()
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
      ...SEARCH_TENANT(tenantId),
      params: {
        page: page,
        size: size,
        tenantId: token.tenantId
      },
      headers: {}
    })
    //console.log('Get all tenant success:', JSON.stringify(response.data))
    return response
  } catch (e) {
    console.error('Get all tenant failed:', e)
    throw e
  }
}

//Don't require Authorization token
export const getTenantById = async (tenantId: number) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
      ...GET_TENANT_BY_TENANT_ID(tenantId),
      headers: {}
    })
    //console.log('Get tenant by id success:', JSON.stringify(response.data))
    return response
  } catch (e) {
    console.error('Get tenant by id failed:', e)
    throw e
  }
}

export const updateTenantRegInfo = async (
  item: RegisterItem,
  tenantId: number
) => {
  // const axiosConfig = UPDATE_TENANT_REGISTER
  // axiosConfig.url = UPDATE_TENANT_REGISTER.url + `/${tenantId}`

  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
      ...UPDATE_TENANT_REGISTER(tenantId),
      data: item
    })
    // console.log(
    //   'Tenant register info update success:',
    //   JSON.stringify(response.data)
    // )
    return response
  } catch (e) {
    console.error('Tenant register info update failed:', e)
    return null
  }
}

export const updateTenantStatus = async (item: any, tenantId: number) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
      ...UPDATE_TENANT_STATUS(tenantId),
      data: item
    })
    // console.log(
    //   'Tenant register status update success:',
    //   JSON.stringify(response.data)
    // )
    return response
  } catch (e: any) {
    console.error('Tenant register status update failed:', e)
    throw e
  }
}

export const createNewTenant = async (item: any) => {
  try {
    const response = await cleanAxiosInstance({
      baseURL: window.baseURL.socif,
      ...CREATE_TENANT('astd'),
      data: item,
    })
    return response
  } catch (e: any) {
    console.error('Tenant register status update failed:', e)
    throw e
  }
}

export const sendEmailInvitation = async (
  memberEmail: string,
  tenantId: string
) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
      ...SEND_EMAIL_INVITATION,
      params: {
        to: memberEmail,
        tenantId
      }
    })
    console.log(
      'send tenant invitation success:',
      JSON.stringify(response.data)
    )
    return response
  } catch (e) {
    console.error('send tenant invitation Failed:', e)
    return null
  }
}

export const updateTenantDetail = async (data: any, tenantId: string) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
      ...UPDATE_TENANT_INFO(tenantId),
      data: data
    })
    // console.log(
    //   'Tenant info details update success:',
    //   JSON.stringify(response.data)
    // )
    return response
  } catch (e) {
    console.error('Tenant info details update failed:', e)
    throw (e)
  }
}

export const getRegisterLinkStatus = async (tenantId: string) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
      ...GET_REGISTER_LINK_STATUS(tenantId)
    })

    return response
  } catch (error) {
    throw (error)
  }
}