import { CHANGE_PASSWORD } from '../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import axiosInstance from '../constants/axiosInstance'

export const changePassword = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
      ...CHANGE_PASSWORD,
      data: data
    })
    return response
  } catch (e) {
    console.error('change password failed:', e)
    throw(e)
  }
}
