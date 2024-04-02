import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import {
  DOWNLOAD_WORD_REPORT,
  DOWNLOAD_EXCEL_REPORT
} from '../constants/requestsReport'
import { returnApiToken } from '../utils/utils'
import axiosInstance from '../constants/axiosInstance'

export const getDownloadWord = async (from: string, to: string) => {
  try {
    const { decodeKeycloack } = returnApiToken()

    const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
      ...DOWNLOAD_WORD_REPORT(),
      params: {
        table: decodeKeycloack,
        from,
        to
      }
    })

    return response
  } catch (e) {
    return null
  }
}

export const getDownloadExcel = async (from: string, to: string) => {
    try {
      const { decodeKeycloack } = returnApiToken()
  
      const response = await axiosInstance({
          baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
        ...DOWNLOAD_EXCEL_REPORT(),
        params: {
          table: decodeKeycloack,
          from,
          to
        }
      })
  
      return response
    } catch (e) {
      return null
    }
}