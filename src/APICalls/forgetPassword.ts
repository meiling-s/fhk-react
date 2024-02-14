import axios from 'axios'
import { CREATE_FORGET_PASSWORD } from '../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import { returnApiToken } from "../utils/utils";
import { forgetPasswordForm } from '../interfaces/forgetPassword'

const request = axios.create({
  baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator
})

export const forgetPassword = async (data: forgetPasswordForm) => {
  const isProd = AXIOS_DEFAULT_CONFIGS.baseURL.administrator == 'https://www.greenhoopapp.com/' ? true : false 
  const token = {
    decodeKeyCloack :  isProd?  'company888888':'company861341' // remove when api changed
  }
  try {
    const response = await request({
      ...CREATE_FORGET_PASSWORD(token.decodeKeyCloack),
      data: data
    })
    return response
  } catch (e) {
    console.error('request forget password failed:', e)
    return null
  }
}
