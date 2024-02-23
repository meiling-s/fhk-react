import axios from 'axios'
import { localStorgeKeyName } from '../constants/constant'
import {
  ADD_TENANT,
  GET_ALL_TENANT,
  GET_TENANT_BY_TENANT_ID,
  UPDATE_TENANT_REGISTER,
  UPDATE_TENANT_STATUS
} from '../constants/requests'
import { RegisterItem, Tenant } from '../interfaces/account'
import { CreateTenant, UpdateStatus } from '../interfaces/tenant'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import { returnApiToken } from '../utils/utils'

const request = axios.create({
  baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.account
})

export const createInvitation = async (item: CreateTenant) => {
  console.log(
    `Token: ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`
  )

  try {
    const response = await request({
      ...ADD_TENANT('collector'),
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

export const getAllTenant = async (page: number, size: number, tenantId?: string ) => {
  const token = returnApiToken()
  try {
    const response = await request({
      ...GET_ALL_TENANT(token.tenantId),
      params: {
        page: page,
        size: size,
        tenantId: token.tenantId
      },
      headers: {}
    })
    console.log('Get all tenant success:', JSON.stringify(response.data))
    return response
  } catch (e) {
    console.error('Get all tenant failed:', e)
    return null
  }
}

//Don't require Authorization token
export const getTenantById = async (tenantId: number) => {
  try {
    const response = await request({
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
    const response = await request({
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
    const response = await request({
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
