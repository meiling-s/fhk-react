import axiosInstance from '../../constants/axiosInstance'
import {
    GET_DATE_FORMAT, GET_WEIGHT_TOLERANCE, UPDATE_DATE_FORMAT, UPDATE_WEIGHT_TOLERANCE,
} from '../../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import { returnApiToken } from '../../utils/utils';

export const getWeightTolerance = async () => {
  try {
    const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
      ...GET_WEIGHT_TOLERANCE,
    });

    return response
  } catch (e: any) {
    console.error('Get Currency Failed:', e)
    throw(e)
  }
}

export const updateWeightTolerance = async (weightId: number, data: any) => {
    try {
        const response = await axiosInstance({
            baseURL: window.baseURL.administrator,
            ...UPDATE_WEIGHT_TOLERANCE(weightId),
            data: data
        })

        return response
    } catch (error) {
        console.error('Get Currency Failed:', error)
        return null
    }
}