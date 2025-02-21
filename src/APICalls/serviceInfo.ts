import { CREATE_SERVICE_INFO } from '../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import { returnApiToken } from '../utils/utils';
import axiosInstance from '../constants/axiosInstance'

export const createServiceInfo = async (data: any) => {
  try {

    const tenantId = returnApiToken().decodeKeycloack

    const response = await axiosInstance({
      baseURL: window.baseURL.account,
      ...CREATE_SERVICE_INFO(tenantId),
      data: data
    })
    console.log('creates service user Success:')
    return response.data
  
  } catch (e:any) {
    console.error('Login user Failed:', e)
    throw(e)
  }
}
