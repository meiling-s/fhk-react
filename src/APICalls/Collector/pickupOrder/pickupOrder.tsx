import React, { useEffect } from 'react'
import { AXIOS_DEFAULT_CONFIGS } from '../../../constants/configs'
import axios from 'axios'
import { CREATE_PICK_UP_ORDER, GET_ALL_PICK_UP_ORDER, GET_PICK_UP_ORDER_BY_ID, GET_LOGISTICLIST, GET_PICK_UP_ORDER_DETAIL, UPDATE_PICK_UP_ORDER, UPDATE_PICK_UP_ORDER_DETAIL_STATUS, UPDATE_PICK_UP_ORDER_STATUS } from '../../../constants/requests'
import { CreatePO, EditPo, PickupOrder, PoDtlStatus, PoStatus } from '../../../interfaces/pickupOrder'
import { createCP } from '../../../interfaces/collectionPoint'
import { returnApiToken } from '../../../utils/utils';

  const request = axios.create({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator
    })
  
  const token = returnApiToken()

  export const getAllPickUpOrder = async (page: number, size: number) => {

      try {
        const response = await request({
          ...GET_ALL_PICK_UP_ORDER,
          params: {
            page: page,
            size: size
          },
        });
        console.log('Get all pick up order:', JSON.stringify(response.data));
        return response
      } catch (e) {
        console.error('Get all collection point failed:', e);
        return null;
      }
    
  }

  export const getPicoById = async (picoId: string) => {
    try {
      const response = await request({
        ...GET_PICK_UP_ORDER_BY_ID(picoId)
      })
      
      return response
    } catch (e) {
      console.error('Get all vehicle failed:', e)
      return null
    }
  }

  
  

  export const getDtlById = async (picoDtlId:number) => {
    
      const axiosConfig = Object.assign({},GET_PICK_UP_ORDER_DETAIL);
      axiosConfig.url = GET_PICK_UP_ORDER_DETAIL.url+`/${picoDtlId}`;

    try {
      const response = await request({
        ...axiosConfig,
      });
      console.log('Get pick up order detail:', JSON.stringify(response.data));
      return response.data
    } catch (e) {
      console.error('Get pick up order detail::', e);
      return null;
    }
  
}

  export const createPickUpOrder = async (data:CreatePO) => {

    try{
        const response = await request({
            ...CREATE_PICK_UP_ORDER,
            data: data
            // headers: {
            //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
            // },
        });
        console.log('Create pick up order success:', JSON.stringify(response.data));
        return response
    } catch (e) {
        console.error('Create pick up order failed:', e);
        return null;
    }

}


export const editPickupOrder = async (pickupOrderId: string, data:EditPo) => {

  const axiosConfig = Object.assign({},UPDATE_PICK_UP_ORDER);
  axiosConfig.url = UPDATE_PICK_UP_ORDER.url+`/${pickupOrderId}`;

  try{
      const response = await request({
          ...axiosConfig,
          data: data
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
          // },
      });
      console.log('Update pickup order success:', JSON.stringify(response.data));
      return response
  } catch (e) {
      console.error('Update pickup order  failed:', e);
      return null;
  }

}

export const editPickupOrderStatus = async (pickupOrderId: string, data:PoStatus) => {

  const axiosConfig = Object.assign({},UPDATE_PICK_UP_ORDER_STATUS);
  axiosConfig.url = UPDATE_PICK_UP_ORDER_STATUS.url+`/${pickupOrderId}`;

  try{
      const response = await request({
          ...axiosConfig,
          data: data
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
          // },
      });
      console.log('Update pickup order status success:', JSON.stringify(response.data));
      return response
  } catch (e) {
      console.error('Update pickup order status failed:', e);
      return null;
  }

}

export const editPickupOrderDetailStatus = async (pickupOrderDtlId: string, data:PoDtlStatus) => {

  const axiosConfig = Object.assign({},UPDATE_PICK_UP_ORDER_DETAIL_STATUS);
  axiosConfig.url = UPDATE_PICK_UP_ORDER_DETAIL_STATUS.url+`/${pickupOrderDtlId}`;

  try{
      const response = await request({
          ...axiosConfig,
          data: data
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
          // },
      });
      console.log('Update pickup order detail status success:', JSON.stringify(response.data));
      return response
  } catch (e) {
      console.error('Update pickup order detail status failed:', e);
      return null;
  }

}







