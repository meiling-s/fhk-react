import axiosInstance from '../../constants/axiosInstance'
import {
  ADD_PREMISE_TYPE,
    ADD_RECYC_TYPE, ADD_SITE_TYPE, CREATE_WEIGHT_UNIT, DELETE_PREMISE_TYPE, DELETE_SITE_TYPE, DELETE_WEIGHT_UNIT, EDIT_PREMISE_TYPE, EDIT_SITE_TYPE, GET_PACKAGING_LIST, GET_PREMISE_TYPE, GET_RECYC_CODE, GET_SITE_TYPE, GET_VEHICLE_TYPE, GET_WEIGHT_UNIT, UPDATE_WEIGHT_UNIT
} from '../../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import { returnApiToken } from '../../utils/utils';

export const createRecyc = async (data: any) => {
  try {
    const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...ADD_RECYC_TYPE,
      data: data
    });

    return response
  } catch (e: any) {
    console.error('Post Recycling Failed:', e)
    return null
  }
}

export const editRecyc = async (data: any) => {
    try {
      const response = await axiosInstance({
          baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
        ...ADD_RECYC_TYPE,
        data: data
      });
  
      return response
    } catch (e: any) {
      console.error('Post Recycling Failed:', e)
      return null
    }
  }

export const getAllPackagingUnit = async (page: number, size: number) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.account,
      ...GET_PACKAGING_LIST('account', token.tenantId),
      params: {
        page: page,
        size: size,
      },
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    console.error('Get all packaging unit failed:', e)
    return null
  }
}

export const getRecycCode = async (page: number, size: number) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...GET_RECYC_CODE,
      params: {
        page: page,
        size: size,
      },
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    console.error('Get all packaging unit failed:', e)
    return null
  }
}

export const getWeightUnit = async (page: number, size: number) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...GET_WEIGHT_UNIT,
      params: {
        page: page,
        size: size,
      },
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    console.error('Get all packaging unit failed:', e)
    return null
  }
}

export const sendWeightUnit = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...CREATE_WEIGHT_UNIT,
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    return null
  }
}

export const deleteWeightUnit = async (unitId: number, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...DELETE_WEIGHT_UNIT(unitId),
      data: data
    })
    

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    return null
  }
}

export const editWeightUnit = async (unitId: number, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...UPDATE_WEIGHT_UNIT(unitId),
      data: data
    })
    
    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    return null
  }
}

export const getSiteTypeData = async () => {
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...GET_SITE_TYPE
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    return null
  }
}

export const createSiteType = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...ADD_SITE_TYPE,
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    return null
  }
}

export const getEngineData = async () => {
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...GET_PREMISE_TYPE,
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    return null
  }
}

export const sendEngineData = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...ADD_PREMISE_TYPE,
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    return null
  }
}

export const editEngineData = async (siteTypeId: string, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...EDIT_PREMISE_TYPE(siteTypeId),
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    return null
  }
}

export const deleteEngineData = async (siteTypeId: string, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...DELETE_PREMISE_TYPE(siteTypeId),
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    return null
  }
}

export const getVehicleData = async () => {
  try {
      const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
        ...GET_VEHICLE_TYPE,
      })

      return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    return null
  }
}

export const createRecyclingPoint = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...ADD_SITE_TYPE,
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    return null
  }
}

export const editRecyclingPoint = async (siteTypeId: string, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...EDIT_SITE_TYPE(siteTypeId),
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    return null
  }
}

export const deleteRecyclingPoint = async (siteTypeId: string, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...DELETE_SITE_TYPE(siteTypeId),
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    return null
  }
}