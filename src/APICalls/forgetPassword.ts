import axios from 'axios'
import { CREATE_FORGET_PASSWORD } from '../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import { forgetPasswordForm } from '../interfaces/forgetPassword'

const request = axios.create({
  baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator
})

export const forgetPassword = async (data: forgetPasswordForm) => {
  try {
    const response = await request({
      ...CREATE_FORGET_PASSWORD,
      data: data
    })
    return response
  } catch (e) {
    console.error('request forget password failed:', e)
    return null
  }
}
