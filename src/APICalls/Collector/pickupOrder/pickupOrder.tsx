import React, { useEffect } from 'react'
import { AXIOS_DEFAULT_CONFIGS } from '../../../constants/configs'
import axios from 'axios'
import { CREATE_PICK_UP_ORDER, GET_ALL_PICK_UP_ORDER, GET_LOGISTICLIST, GET_PICK_UP_ORDER_DETAIL, UPDATE_PICK_UP_ORDER_STATUS } from '../../../constants/requests'
import { CreatePO, EditPo, PickupOrder, PoStatus } from '../../../interfaces/pickupOrder'
import { createCP } from '../../../interfaces/collectionPoint'

  const request = axios.create({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator
    })

  export const getAllPickUpOrder = async () => {

      try {
        const response = await request({
          ...GET_ALL_PICK_UP_ORDER
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
          // },
        });
        console.log('Get all pick up order:', JSON.stringify(response.data));
        return response
      } catch (e) {
        console.error('Get all collection point failed:', e);
        return null;
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


export const editPickupOrder = async (pickupOrderId: number, data:EditPo) => {

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
      console.log('Update pickup order success:', JSON.stringify(response.data));
      return response
  } catch (e) {
      console.error('Update pickup order  failed:', e);
      return null;
  }

}

export const editPickupOrderStatus = async (pickupOrderId: number, data:PoStatus) => {

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








  

