import { ASTD_GET_INVENTORY, GET_CHECKIN_BY_ID, GET_CHECKOUT_BY_ID, GET_INVENTORY, GET_ITEM_TRACK_INVENTORY } from "../../constants/requests";
import { returnApiToken } from "../../utils/utils";
import axiosInstance from '../../constants/axiosInstance'


export const getCheckInDetailByID = async (chkInId: number, realmApiRoute: string) => {
    try {
        const token = returnApiToken()
        const response = await axiosInstance({
            baseURL: window.baseURL.collector,
            ...GET_CHECKIN_BY_ID(token.decodeKeycloack, chkInId, realmApiRoute),
        })

        return response
    } catch (error) {
        console.error('Get Check in detail failed', error)
        return null
    }
}

export const getCheckOutDetailByID = async (chkOutId: number, realmApiRoute: string) => {
    try {
        const token = returnApiToken()
        
        const response = await axiosInstance({
            baseURL: window.baseURL.collector,
            ...GET_CHECKOUT_BY_ID(token.decodeKeycloack, chkOutId, realmApiRoute),
        })

        return response
    } catch (error) {
        console.error('Get Check in detail failed', error)
        return null
    }
}