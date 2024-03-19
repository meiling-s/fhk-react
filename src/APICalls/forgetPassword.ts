import { CREATE_FORGET_PASSWORD } from '../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import { forgetPasswordForm } from '../interfaces/forgetPassword'
import axiosInstance from '../constants/axiosInstance'

export const forgetPassword = async (data: forgetPasswordForm) => {
  const isProd = AXIOS_DEFAULT_CONFIGS.baseURL.administrator == 'https://www.greenhoopapp.com/' ? true : false 
  const token = {
    decodeKeyCloack :  isProd?  'company888888':'company861341' // remove when api changed
  }
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...CREATE_FORGET_PASSWORD(token.decodeKeyCloack),
      data: data
    })
    return response
  } catch (e) {
    console.error('request forget password failed:', e)
    return null
  }
}
