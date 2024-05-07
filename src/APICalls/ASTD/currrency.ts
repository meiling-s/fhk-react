import axiosInstance from '../../constants/axiosInstance'
import {
  CREATE_CURRENCY,
    DELETE_CURRENCY,
    EDIT_CURRENCY,
    GET_CURRENCY_LIST,
} from '../../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import { returnApiToken } from '../../utils/utils';

export const getCurrencyList = async () => {
  try {
    const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
      ...GET_CURRENCY_LIST,
    });

    return response
  } catch (e: any) {
    console.error('Get Currency Failed:', e)
    return null
  }
}


export const createCurrency = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...CREATE_CURRENCY,
      data: data
    })

    return response
  } catch (error) {
    console.error('Create Currency Failed:', error)
    return null
  }
}

export const editCurrency = async (currencyId: number, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...EDIT_CURRENCY(currencyId),
      data: data
    })

    return response
  } catch (error) {
    console.error('Create Currency Failed:', error)
    return null
  }
}

export const deleteCurrency = async (currencyId: number, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...DELETE_CURRENCY(currencyId),
      data: data
    })

    return response
  } catch (error) {
    console.error('Create Currency Failed:', error)
    return null
  }
}