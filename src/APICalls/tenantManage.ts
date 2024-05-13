import { localStorgeKeyName } from '../constants/constant'
import {
  ADD_TENANT,
  GET_ALL_TENANT,
  SEARCH_TENANT,
  GET_TENANT_BY_TENANT_ID,
  UPDATE_TENANT_REGISTER,
  UPDATE_TENANT_STATUS,
  SEND_EMAIL_INVITATION
} from '../constants/requests'
import { RegisterItem } from '../interfaces/account'
import { CreateTenant, UpdateStatus } from '../interfaces/tenant'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import { returnApiToken } from '../utils/utils'
import axiosInstance from '../constants/axiosInstance'

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
  } catch (e) {
    console.error('Insert tenant Failed:', e)
    return null
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
    return null
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
    return null
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
    console.log('Get tenant by id success:', JSON.stringify(response.data))
    return response
  } catch (e) {
    console.error('Get tenant by id failed:', e)
    return null
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
    console.log(
      'Tenant register info update success:',
      JSON.stringify(response.data)
    )
    return response
  } catch (e) {
    console.error('Tenant register info update failed:', e)
    return null
  }
}

export const updateTenantStatus = async (
  item: UpdateStatus,
  tenantId: number
) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
      ...UPDATE_TENANT_STATUS(tenantId),
      data: item
    })
    console.log(
      'Tenant register status update success:',
      JSON.stringify(response.data)
    )
    return response
  } catch (e) {
    console.error('Tenant register status update failed:', e)
    return null
  }
}

export const sendEmailInvitation = async (
  memberEmail: string,
  title: string,
  content: string
) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
      ...SEND_EMAIL_INVITATION,
      params: {
        to: memberEmail,
        title: title,
        content: content
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
