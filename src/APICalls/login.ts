import axios from 'axios'
import { LOGIN } from '../constants/requests'
import { LoginItem } from '../interfaces/account'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'

const request = axios.create({
  baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.account
})

export const login = async (item: LoginItem) => {
  const axiosConfig = Object.assign({}, LOGIN)
  // axiosConfig.url = LOGIN.url+`/${item.realm}/`+"login";
  axiosConfig.url = LOGIN.url

  try {
    const response = await request({
      ...axiosConfig,
      data: {
        loginId: item.username,
        password: item.password
      }
    })
    console.log('Login user Success:', JSON.stringify(response.data))
    if (response.status === 200) {
      return {
        access_token: response.data?.access_token,
        username: response.data?.username,
        status: response.status
      }
    }
  } catch (e) {
    console.error('Login user Failed:', e)
  }
}
