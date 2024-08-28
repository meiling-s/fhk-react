import axiosInstance from '../../constants/axiosInstance'
import {
  ADD_PREMISE_TYPE,
    ADD_RECYC_TYPE, ADD_SITE_TYPE, ADD_SUB_RECYC_TYPE, CREATE_PACKAGING, CREATE_VEHICLE_TYPE, CREATE_WEIGHT_UNIT, DELETE_PREMISE_TYPE, DELETE_RECYC_TYPE, DELETE_SITE_TYPE, DELETE_SUB_RECYC_TYPE, DELETE_VEHICLE_TYPE, DELETE_WEIGHT_UNIT, EDIT_PACKAGING, EDIT_PREMISE_TYPE, EDIT_SITE_TYPE, GET_PACKAGING_LIST, GET_PREMISE_TYPE, GET_RECYC_CODE, GET_SITE_TYPE, GET_VEHICLE_DETAIL, GET_VEHICLE_TYPE, GET_WEIGHT_UNIT, UPDATE_RECYC_TYPE, UPDATE_SUB_RECYC_TYPE, UPDATE_VEHICLE_TYPE, UPDATE_WEIGHT_UNIT
} from '../../constants/requests'
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import { returnApiToken } from '../../utils/utils';

export const createRecyc = async (data: any) => {
  try {
    const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
      ...ADD_RECYC_TYPE,
      data: data
    });

    return response
  } catch (e: any) {
    console.error('Post Recycling Failed:', e)
    throw(e)
  }
}

export const editRecyc = async (data: any) => {
    try {
      const response = await axiosInstance({
          baseURL: window.baseURL.administrator,
        ...ADD_RECYC_TYPE,
        data: data
      });
  
      return response
    } catch (e: any) {
      console.error('Post Recycling Failed:', e)
      return null
    }
}

export const updateRecyc = async (data: any, recycTypeId: string) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
    ...UPDATE_RECYC_TYPE(recycTypeId),
    data: data
  });

  return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const deleteRecyc = async (data: any, recycTypeId: string) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
    ...DELETE_RECYC_TYPE(recycTypeId),
    data: data
  });

  return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const createSubRecyc = async (data: any, recycTypeId: string) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
    ...ADD_SUB_RECYC_TYPE(recycTypeId),
    data: data
  });

  return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    return null
  }
}

export const updateSubRecyc = async (data: any, recycTypeId: string) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
    ...UPDATE_SUB_RECYC_TYPE(recycTypeId),
    data: data
  });

  return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const deleteSubRecyc = async (data: any, recycTypeId: string) => {
    try {
      const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
      ...DELETE_SUB_RECYC_TYPE(recycTypeId),
      data: data
    });
  
    return response
    } catch (error) {
      console.error('Post Recycling Failed:', error)
      throw(error)
    }
}

export const getAllPackagingUnit = async (page: number, size: number) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
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
    throw(e)
  }
}

export const createPackagingUnit = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
      ...CREATE_PACKAGING('account'),
      data: data
    })
    return response
  } catch (e) {
    console.error('Get all packaging unit failed:', e)
    throw(e)
  }
}

export const editPackagingUnit = async (data: any, packagingId: string) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
      ...EDIT_PACKAGING('account', token.tenantId, packagingId),
      data: data
    })
    return response
  } catch (e) {
    console.error('Get all packaging unit failed:', e)
   throw(e)
  }
}

export const getRecycCode = async (page: number, size: number) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
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
    throw(e)
  }
}

export const getWeightUnit = async (page: number, size: number) => {
  try {
    const token = returnApiToken()
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
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
    throw(e)
  }
}

export const sendWeightUnit = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...CREATE_WEIGHT_UNIT,
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const deleteWeightUnit = async (unitId: number, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...DELETE_WEIGHT_UNIT(unitId),
      data: data
    })
    

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const editWeightUnit = async (unitId: number, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...UPDATE_WEIGHT_UNIT(unitId),
      data: data
    })
    
    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const getSiteTypeData = async () => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...GET_SITE_TYPE
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const createSiteType = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
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
      baseURL: window.baseURL.administrator,
      ...GET_PREMISE_TYPE,
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const sendEngineData = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...ADD_PREMISE_TYPE,
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const editEngineData = async (siteTypeId: string, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...EDIT_PREMISE_TYPE(siteTypeId),
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const deleteEngineData = async (siteTypeId: string, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...DELETE_PREMISE_TYPE(siteTypeId),
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const getVehicleData = async () => {
  try {
      const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_VEHICLE_TYPE,
      })

      return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    return null
  }
}

export const createVehicleData = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...CREATE_VEHICLE_TYPE,
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const updateVehicleData = async (vehicleId: string, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...UPDATE_VEHICLE_TYPE(vehicleId),
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const deleteVehicleData = async (vehicleId: string, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...DELETE_VEHICLE_TYPE(vehicleId),
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const createRecyclingPoint = async (data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...ADD_SITE_TYPE,
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const editRecyclingPoint = async (siteTypeId: string, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...EDIT_SITE_TYPE(siteTypeId),
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const deleteRecyclingPoint = async (siteTypeId: string, data: any) => {
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.administrator,
      ...DELETE_SITE_TYPE(siteTypeId),
      data: data
    })

    return response
  } catch (error) {
    console.error('Post Recycling Failed:', error)
    throw(error)
  }
}

export const getVehicleDetail = async (vehicleId: string) => {
  try {
      const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_VEHICLE_DETAIL(vehicleId),
      })

      return response
  } catch (error) {
    console.error('getVehicleDetail Failed:', error)
    throw(error)
  }
}