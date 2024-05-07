import axiosInstance from '../../constants/axiosInstance'
import {
    GET_DATE_FORMAT, UPDATE_DATE_FORMAT,
} from '../../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import { returnApiToken } from '../../utils/utils';

export const getDateFormat = async () => {
  try {
    const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
      ...GET_DATE_FORMAT,
    });

    return response
  } catch (e: any) {
    console.error('Get Currency Failed:', e)
    return null
  }
}

export const updateDateFormat = async (dateFormatId: number, data: any) => {
    try {
        const response = await axiosInstance({
            baseURL: window.baseURL.administrator,
            ...UPDATE_DATE_FORMAT(dateFormatId),
            data: data
        })

        return response
    } catch (error) {
        console.error('Get Currency Failed:', error)
        return null
    }
}