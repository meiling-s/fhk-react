import { AXIOS_DEFAULT_CONFIGS } from '../../../constants/configs'
import { CREATE_PICK_UP_ORDER, GET_ALL_PICK_UP_ORDER, GET_ALL_LOGISTICS_PICK_UP_ORDER, GET_PICK_UP_ORDER_BY_ID, GET_PICK_UP_ORDER_DETAIL, UPDATE_PICK_UP_ORDER, UPDATE_PICK_UP_ORDER_DETAIL_STATUS, UPDATE_PICK_UP_ORDER_STATUS, GET_ALL_REASON } from '../../../constants/requests'
import { CreatePO, EditPo, PoDtlStatus, PoStatus } from '../../../interfaces/pickupOrder'
import { returnApiToken } from '../../../utils/utils';
import { queryPickupOrder } from '../../../interfaces/pickupOrder'
import axiosInstance from '../../../constants/axiosInstance'


  export const getAllPickUpOrder = async (page: number, size: number, query?: queryPickupOrder) => {
      const auth = returnApiToken()
      try {
        const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
          ...GET_ALL_PICK_UP_ORDER(auth.tenantId),
          params: {
            page: page,
            size: size,
            tenantId: auth.tenantId,
            picoId: query?.picoId,
            effFromDate: query?.effFromDate,
            effToDate: query?.effToDate,
            logisticName: query?.logisticName,
            recycType: query?.recycType,
            senderName: query?.senderName,
            status: query?.status
          },
        });
        // console.log('Get all pick up order:', JSON.stringify(response.data));
        return response
      } catch (e) {
        // console.error('Get all collection point failed:', e);
        throw(e);
      }
    
  }

  export const getAllLogisticsPickUpOrder = async (
    page: number,
    size: number,
    query?: queryPickupOrder
  ) => {
    const auth = returnApiToken();
    try {
      const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_ALL_LOGISTICS_PICK_UP_ORDER(auth.tenantId),
        params: {
          page: page,
          size: size,
          tenantId: auth.tenantId,
          picoId: query?.picoId,
          effFromDate: query?.effFromDate,
          effToDate: query?.effToDate,
          logisticName: query?.logisticName,
          recycType: query?.recycType,
          senderName: query?.senderName,
          status: query?.status,
        },
      });
      // console.log('Get all pick up order:', JSON.stringify(response.data));
      return response;
    } catch (e) {
      // console.error('Get all collection point failed:', e);
      throw(e);
    }
  };
  
  export const getPicoById = async (picoId: string) => {
    try {
      const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_PICK_UP_ORDER_BY_ID(picoId)
      })
      
      return response
    } catch (e) {
      // console.error('Get all vehicle failed:', e)
      return null
    }
  }

  
  


  export const getDtlById = async () => {

    try {
      const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_PICK_UP_ORDER_DETAIL,
      });
      // console.log('Get pick up order detail:', JSON.stringify(response.data));
      return response.data
    } catch (e) {
      // console.error('Get pick up order detail::', e);
      return null;
    }
  
}

  export const createPickUpOrder = async (data:CreatePO) => {

    try{
        const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
            ...CREATE_PICK_UP_ORDER,
            data: data
            // headers: {
            //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
            // },
        });
        // console.log('Create pick up order success:', JSON.stringify(response.data));
        return response
    } catch (e) {
        // console.error('Create pick up order failed:', e);
        return null;
    }

}


export const editPickupOrder = async (pickupOrderId: string, data:EditPo) => {

  const axiosConfig = Object.assign({},UPDATE_PICK_UP_ORDER);
  axiosConfig.url = UPDATE_PICK_UP_ORDER.url+`/${pickupOrderId}`;

  try{
      const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
          ...axiosConfig,
          data: data
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
          // },
      });
      // console.log('Update pickup order success:', JSON.stringify(response.data));
      return response
  } catch (e) {
      // console.error('Update pickup order  failed:', e);
      return null;
  }

}

export const editPickupOrderStatus = async (pickupOrderId: string, data:PoStatus) => {

  const axiosConfig = Object.assign({},UPDATE_PICK_UP_ORDER_STATUS);
  axiosConfig.url = UPDATE_PICK_UP_ORDER_STATUS.url+`/${pickupOrderId}`;

  try{
      const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
          ...axiosConfig,
          data: data
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
          // },
      });
      // console.log('Update pickup order status success:', JSON.stringify(response.data));
      return response
  } catch (e) {
      // console.error('Update pickup order status failed:', e);
      return null;
  }

}

export const editPickupOrderDetailStatus = async (pickupOrderDtlId: string, data:PoDtlStatus) => {

  const axiosConfig = Object.assign({},UPDATE_PICK_UP_ORDER_DETAIL_STATUS);
  axiosConfig.url = UPDATE_PICK_UP_ORDER_DETAIL_STATUS.url+`/${pickupOrderDtlId}`;

  try{
      const response = await axiosInstance({
        baseURL: window.baseURL.administrator,
          ...axiosConfig,
          data: data
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
          // },
      });
      // console.log('Update pickup order detail status success:', JSON.stringify(response.data));
      return response
  } catch (e) {
      // console.error('Update pickup order detail status failed:', e);
      return null;
  }

}


export const getAllReason = async () => {
  const auth = returnApiToken();
  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_ALL_REASON(auth.tenantId, '24')
    })
    
    return response
  } catch (e) {
    // console.error('Get all vehicle failed:', e)
    return null
  }
}






