import axiosInstance from '../../constants/axiosInstance'
import {
    GET_DECIMAL_VALUE, UPDATE_DECIMAL_VALUE,
} from '../../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import { returnApiToken } from '../../utils/utils';

export const getDecimalValue = async () => {
  try {
    const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
      ...GET_DECIMAL_VALUE,
    });

    return response
  } catch (e: any) {
    console.error('Get Currency Failed:', e)
    return null
  }
}

export const updateDecimalValue = async (data: any, decimalValId: number) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...UPDATE_DECIMAL_VALUE(decimalValId),
      data: data
    })

    return response
  } catch (e: any) {
    console.error('Update Decimal Failed:', e)
    return null
  }
}