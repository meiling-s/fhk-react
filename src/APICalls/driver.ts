import axiosInstance from "../constants/axiosInstance"
import { AXIOS_DEFAULT_CONFIGS } from "../constants/configs"
import { returnApiToken } from "../utils/utils"
import {GET_DRIVER_LIST} from '../constants/requests'

export const getDriverList = async(page:number,size:number)=>{
    try {
        const token = returnApiToken()
        return await axiosInstance({
            baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector,
            ...GET_DRIVER_LIST(),
            params:{
                page,
                size,
                table: token.decodeKeycloack
            }
        })
    } catch (error) {
        console.error(error)
    }
}