import React from 'react'
import { AXIOS_DEFAULT_CONFIGS } from '../../../constants/configs'
import axios from 'axios'
import { GET_ALL_PICK_UP_ORDER } from '../../../constants/requests'

    const request = axios.create({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.collector
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
    

