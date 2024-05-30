import { CreateVehicle } from "../../interfaces/vehicles";
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs';
import {
  CREATE_VEHICLE, DELETE_VEHICLE, EDIT_VEHICLE, GET_USER_GROUP, GET_USER_ACCOUNT, GET_FUNCTION, CREATE_USER_GROUP, EDIT_USER_GROUP, DELETE_USER_GROUP
} from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";
import { CreateUserGroupProps, DeleteUserGroupProps, EditUserGroupProps } from "../../interfaces/userGroup";
import axiosInstance from '../../constants/axiosInstance'

//get all warehouse
export const getUserAccount = async () => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...GET_USER_ACCOUNT(token.loginId),
      headers: {
        AuthToken: token.authToken
      }
    })
    
    return response
  } catch (e) {
    console.error('Get user group failed:', e)
    return null
  }
}

export const getUserAccountById = async (loginId: string) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...GET_USER_ACCOUNT(loginId),
      headers: {
        AuthToken: token.authToken
      }
    })
    
    return response
  } catch (e) {
    console.error('Get user group failed:', e)
    return null
  }
}

//get all user group
export const getAllUserGroup = async () => {
  try {
    // const userAccount = await getUserAccount();
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      // ...GET_USER_GROUP(userAccount?.data?.userGroup?.groupId),
      ...GET_USER_GROUP(token.tenantId),
      headers: {
        AuthToken: token.authToken
      }
    })
    
    return response
  } catch (e) {
    console.error('Get all vehicle failed:', e)
    throw(e)
  }
}

//get all function
export const getAllFunction = async () => {
  try {
    // const userAccount = await getUserAccount();
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      // ...GET_USER_GROUP(userAccount?.data?.userGroup?.groupId),
      ...GET_FUNCTION(),
      headers: {
        AuthToken: token.authToken
      }
    })
    
    return response
  } catch (e) {
    console.error('Get all vehicle failed:', e)
    throw(e)
  }
}

// create userGroup
export const createUserGroup = async (data: CreateUserGroupProps) => {
  try {
    // const userAccount = await getUserAccount();
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      // ...GET_USER_GROUP(userAccount?.data?.userGroup?.groupId),
      ...CREATE_USER_GROUP(),
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    
    return response
  } catch (e:any) {
    console.error('Get all vehicle failed:', e)
    throw(e)
  }
}

// edit userGroup
export const editUserGroup = async (data: EditUserGroupProps, groupId: number) => {
  try {
    // const userAccount = await getUserAccount();
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...EDIT_USER_GROUP(groupId),
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    
    return response
  } catch (e:any) {
    console.error('Edit user group failed:', e)
    throw(e)
  }
}

// delete userGroup
export const deleteUserGroup = async (data: DeleteUserGroupProps, groupId: number) => {
  try {
    // const userAccount = await getUserAccount();
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...DELETE_USER_GROUP(groupId),
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    
    return response
  } catch (e: any) {
    if (e.response) {
      const response = e.response.data.status
      return response
    } else {
      console.error('Edit user group failed:', e)
      return null;
    }
  }
}

//create warehouse
export const createVehicles = async (data: CreateVehicle) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...CREATE_VEHICLE(token.realmApiRoute, token.decodeKeycloack),
      data: data,
      headers: {
        AuthToken: token.authToken
      }
    })
    return response
  } catch (e) {
    console.error('Create a vehicle failed:', e)
    return null
  }
}

export const editVehicle = async (data: CreateVehicle, vehicleId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...EDIT_VEHICLE(token.realmApiRoute, token.decodeKeycloack, vehicleId),
      data: data,
      headers: {
        AuthToken: token.authToken,
        'Content-Type': 'application/json'
      }
    })
    return response
  } catch (e) {
    console.error('Edit a vehicle failed:', e)
    return null
  }
}

//edit vehicle status
export const deleteVehicle = async (data: string, vehicleId: number) => {
  try {
    const token = returnApiToken()

    const response = await axiosInstance({
        baseURL: window.baseURL.collector,
      ...DELETE_VEHICLE(token.realmApiRoute, token.decodeKeycloack, vehicleId),
      data: data,
      headers: {
        AuthToken: token.authToken,
        'Content-Type': 'application/json'
      }
    })
    return response
  } catch (e) {
    console.error('Edit a vehicle failed:', e)
    return null
  }
}
  
