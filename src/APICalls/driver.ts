import axiosInstance from "../constants/axiosInstance"
import { AXIOS_DEFAULT_CONFIGS } from "../constants/configs"
import { returnApiToken } from "../utils/utils"
import { GET_DRIVER_LIST, CREATE_DRIVER, EDIT_DRIVER, DELETE_DRIVER } from '../constants/requests'

export const getDriverList = async (page: number, size: number, company?: string) => {
    try {
        const token = returnApiToken()
        return await axiosInstance({
            baseURL: window.baseURL.logistic,
            ...GET_DRIVER_LIST(company? company : token.decodeKeycloack),
            params: {
                page,
                size,
                table: token.decodeKeycloack
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export const createDriver = async (data: any) => {
    try {
        const token = returnApiToken()
        return await axiosInstance({
            baseURL: window.baseURL.logistic,
            ...CREATE_DRIVER(token.decodeKeycloack),
            data
        })
    } catch (error) {
        throw(error)
    }
}

export const editDriver = async (data: any,driverId: string) => {
    try {
        const token = returnApiToken()
        return await axiosInstance({
            baseURL: window.baseURL.logistic,
            ...EDIT_DRIVER(token.decodeKeycloack,driverId),
            data
        })
    } catch (error) {
        throw(error)
    }
}

export const deleteDriver = async (data: any,driverId: string) => {
    try {
        const token = returnApiToken()
        return await axiosInstance({
            baseURL: window.baseURL.logistic,
            ...DELETE_DRIVER(token.decodeKeycloack,driverId),
            data
        })
    } catch (error) {
        console.error(error)
    }
}