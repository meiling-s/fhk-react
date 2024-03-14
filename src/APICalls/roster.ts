import axios from 'axios'

import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import { GET_ROSTER_LIST } from '../constants/requests'
import { returnApiToken } from '../utils/utils'

const request = axios.create({
  baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
})

//get all roster by tenant
export const getRosterList = async () => {
  try {
    const token = returnApiToken()

    const response = await request({
      ...GET_ROSTER_LIST(token.tenantId),
      params: {
        page: 0,
        size: 20 // change size as needed
      }
    })

    return response
  } catch (e) {
    console.error('Get all roster failed:', e)
    return null
  }
}
