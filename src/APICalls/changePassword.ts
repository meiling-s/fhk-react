import axios from 'axios'
import { CHANGE_PASSWORD } from '../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'

const request = axios.create({
  baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
})

export const changePassword = async (data: any) => {
  try {
    const response = await request({
      ...CHANGE_PASSWORD,
      data: data
    })
    return response
  } catch (e) {
    console.error('change password failed:', e)
    return null
  }
}
