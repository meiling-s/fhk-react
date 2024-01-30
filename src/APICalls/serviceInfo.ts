import axios from 'axios'
import { CREATE_SERVICE_INFO } from '../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'

const request = axios.create({
  baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.account
})

export const createServiceInfo = async (data: any) => {
  try {
    const response = await request({
      ...CREATE_SERVICE_INFO,
      data: data
    })
    console.log('creates service user Success:', JSON.stringify(response.data))
    return response.data
  
  } catch (e) {
    console.error('Login user Failed:', e)
  }
}
