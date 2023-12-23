import React from 'react'
import { AXIOS_DEFAULT_CONFIGS } from '../../../constants/configs'
import axios from 'axios'
import {
  GET_ALL_PICK_UP_ORDER,
  ADD_PICK_UP_ORDER,
  UPDATE_PICK_UP_ORDER
} from '../../../constants/requests'

const request = axios.create({})

const picoBaseUrl = {
  baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator
}

export const getAllPickUpOrder = async () => {
  try {
    const response = await request({
      ...GET_ALL_PICK_UP_ORDER
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
      // },
    })
    console.log('Get all pick up order:', JSON.stringify(response.data))
    return response
  } catch (e) {
    console.error('Get all collection point failed:', e)
    return null
  }
}

export const createPickUpOrder = async (data: any) => {
  try {
    const response = await axios({
      ...ADD_PICK_UP_ORDER,
      baseURL: picoBaseUrl.baseURL,
      data: data
    })
    return response
  } catch (e) {
    console.error('Create a pickup order failed:', e)
    return null
  }
}

export const updatePickUpOrder = async (picoId: number, data: any) => {
  try {
    const response = await axios({
      ...UPDATE_PICK_UP_ORDER(picoId),
      baseURL: picoBaseUrl.baseURL,
      data: data
    })
    return response
  } catch (e) {
    console.error('Create a pickup order failed:', e)
    return null
  }
}
