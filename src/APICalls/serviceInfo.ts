import axios from 'axios'
import { CREATE_SERVICE_INFO } from '../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import { localStorgeKeyName } from '../constants/constant';

const request = axios.create({
  baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.account
})

const tenantId =
  localStorage.getItem(localStorgeKeyName.decodeKeycloack) || ''

export const createServiceInfo = async (data: any) => {
  try {
    const response = await request({
      ...CREATE_SERVICE_INFO(tenantId),
      data: data
    })
    console.log('creates service user Success:', JSON.stringify(response.data))
    return response.data
  
  } catch (e) {
    console.error('Login user Failed:', e)
  }
}
