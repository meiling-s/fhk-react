import { Axios, AxiosRequestConfig } from 'axios'
import { CreateDenialReason } from '../interfaces/denialReason'
import { RealmApi } from './constant'

//tenant manage
export const LOGIN: AxiosRequestConfig = {
  method: 'post',
  // url: 'api/v1/account/internal'
  url: 'api/v1/administrator/login'
}

export const CHANGE_PASSWORD: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/administrator/resetpassword'
}

// export const ADD_TENANT: AxiosRequestConfig = {
//   method: 'patch',
//   url: 'api/v1/account/tenant/astd/addTenant'
// }

export const ADD_TENANT = (realm: string): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/account/t/addTenant/${realm}`
})

export const SEND_EMAIL_INVITATION: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/account/t/email/'
}

export const GET_ALL_TENANT: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/account/t/'
}

export const SEARCH_TENANT = (tenantId: number): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/account/t/searching/${tenantId}`
})

export const SEARCH_TENANT_BY_COMPANY_NAME = (companyName: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/account/t/companyname/${companyName}`
})

// export const GET_TENANT_BY_TENANT_ID: AxiosRequestConfig = {
//   method: 'get',
//   url: 'api/v1/account/tenantInvite'
// }

export const UPDATE_TENANT_REGISTER = (
  tenantId: number
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/account/t/V2/updateInfo/${tenantId}`
})

export const UPDATE_TENANT_INFO = (tenantId: string): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/account/t/V2/${tenantId}`
})

export const GET_TENANT_BY_TENANT_ID = (
  tenantId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/account/t/${tenantId}`
})

export const UPDATE_TENANT_STATUS = (tenantId: number): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/account/t/V2/status/${tenantId}`
})

export const ASTD_UPDATE_TENANT_STATUS = (operatorId: string, tenantId: number): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/account/t/statusWithOperatorId/${operatorId}/${tenantId}`
})

export const GET_REGISTER_LINK_STATUS = (tenantId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/account/t/str/${tenantId}`
})

export const GET_CURRENCY_LIST: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/administrator/currencyList'
}

export const UPDATE_TENANT_CURRENCY = (
  tenantId: string,
  monetaryValue: string,
  updatedBy: string,
  version: number,
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/account/t/V2/monetary/${tenantId}?tenantId=${tenantId}&monetaryValue=${monetaryValue}&updatedBy=${updatedBy}&version=${version}`
})

//collection point
export const GET_ALL_COLLECTIONPOINT = (
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/collectionPoint/${tenantId}`
})

export const CREATE_COLLECTIONPOINT: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/collectors/collectionPoint'
}

export const UPDATE_COLLECTIONPOINT: AxiosRequestConfig = {
  method: 'put',
  url: 'api/v1/collectors/collectionPoint'
}

export const FIND_COLLECTIONPOINT_EXIST_BYNAME: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/collectors/collectionPoint/byName'
}

export const FIND_COLLECTIONPOINT_EXIST_BYCONTRACT_ADDRESS: AxiosRequestConfig =
  {
    method: 'get',
    url: 'api/v1/collectors/collectionPoint/byContractAndAddress'
  }

export const GET_COLLECTIONPOINT_BY_COLID = (
  tenantId: string,
  colId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/collectionPoint/${tenantId}/${colId}`
})

export const GET_CONTRACT = (
  realmApiRoute: string,
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/contract/${tenantId}`
})

export const NEW_GET_ALL_HEADER_CHECKIN_REQUESTS = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/checkinrequest/header/searching/${table}`
})

export const NEW_GET_DETAIL_CHECKIN_REQUESTS = (
  realmApiRoute: string,
  table: string,
  checkinId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/checkinrequest/detail/${table}/${checkinId}`
})
export const GET_ALL_CHECKIN_REQUESTS = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/checkinrequest/searching/${table}`
})

export const UPDATE_CHECK_IN = (
  realmApiRoute: string,
  chkInId: number,
  table: string,
  picoDtlId: number
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/${realmApiRoute}/checkin/${table}/pico/${chkInId}/${picoDtlId}`
})

export const UPDATE_CHECK_IN_STATUS = (
  realmApiRoute: string,
  chkInId: number,
  table: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/${realmApiRoute}/checkin/V2/${table}/status/${chkInId}`
})

//get checkin reason list
export const GET_CHECKIN_REASON = (
  realmApiRoute: string,
  tenantId: string,
  functionId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/reason/${tenantId}/${functionId}`
})

//collector/pickupOrder
export const GET_ALL_PICK_UP_ORDER = (
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/pico/search/${tenantId}`
})

export const GET_PICK_UP_ORDER_BY_ID = (
  picoId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/pico/${picoId}`
})

export const GET_PICK_UP_ORDER_DETAIL: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/administrator/pico/V2/details'
}
export const ADD_PICK_UP_ORDER: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/administrator/pico'
}

// export const UPDATE_PICK_UP_ORDER = (picoId: number): AxiosRequestConfig => ({
//   method: 'patch',
//   url: `api/v1/administrator/pico/${picoId}`
// })

export const CREATE_PICK_UP_ORDER: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/administrator/pico'
}

export const GET_LOGISTICLIST = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/logisticlist/${table}?size=1000`
})

export const GET_3RDPARTY_LOGISTICLIST = (realmApiRoute: string, table: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/logisticlistWithThirdParty/${table}?size=1000`
})

export const GET_COLLECTORLIST = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/collectorlist/${table}?size=1000`
})

export const CREATE_COLLECTORLIST = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/${realmApiRoute}/collectorlist/${table}`
})

export const EDIT_COLLECTORLIST = (
  realmApiRoute: string,
  table: string,
  collectorId: string
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/${realmApiRoute}/collectorlist/${table}/${collectorId}`
})

export const CUSTOMER_GET_COLLECTORLIST = (
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/collectorlist/${table}`
})

export const GET_MANULIST = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/manulist/${table}?size=1000`
})

export const GET_CUSTOMERLIST = (realmApiRoute: string, table: string) => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/customerlist/${table}?size=1000`
})
export const UPDATE_PICK_UP_ORDER: AxiosRequestConfig = {
  method: 'put',
  url: 'api/v1/administrator/pico/V3'
}
export const UPDATE_PICK_UP_ORDER_STATUS: AxiosRequestConfig = {
  method: 'patch',
  url: 'api/v1/administrator/pico/V2/status'
}
export const UPDATE_PICK_UP_ORDER_DETAIL_STATUS: AxiosRequestConfig = {
  method: 'patch',
  url: 'api/v1/administrator/pico/V2/details/status'
}
//common
export const GET_COLLECTIONPOINT_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/administrator/colPointType'
}

export const ADD_COLLECTIONPOINT_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/administrator/colPointType'
}

export const GET_PREMISE_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/administrator/premiseType'
}

export const ADD_PREMISE_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/administrator/premiseType'
}

export const EDIT_PREMISE_TYPE = (
  premiseTypeId: string
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/administrator/premiseType/V2/${premiseTypeId}`
})

export const DELETE_PREMISE_TYPE = (
  premiseTypeId: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/premiseType/V2/${premiseTypeId}`
})

export const GET_SITE_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/administrator/siteType'
}

export const ADD_SITE_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/administrator/siteType'
}

export const EDIT_SITE_TYPE = (siteTypeId: string): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/administrator/siteType/V2/${siteTypeId}`
})

export const DELETE_SITE_TYPE = (siteTypeId: string): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/siteType/V2/${siteTypeId}`
})

export const GET_RECYC_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/administrator/recycType'
}

export const ADD_RECYC_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/administrator/recycType'
}

export const UPDATE_RECYC_TYPE = (recycTypeId: string): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/administrator/recycType/V2/${recycTypeId}`
})

export const DELETE_RECYC_TYPE = (recycTypeId: string): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/recycType/V2/${recycTypeId}`
})

export const ADD_SUB_RECYC_TYPE = (
  recycTypeId: string
): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/administrator/recycType/${recycTypeId}`
})

export const UPDATE_SUB_RECYC_TYPE = (
  recycTypeId: string
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/administrator/recycSubType/V2/${recycTypeId}`
})

export const DELETE_SUB_RECYC_TYPE = (
  recycTypeId: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/recycSubType/V2/${recycTypeId}`
})

export const CREATE_VEHICLE_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/administrator/vehicleType'
}

export const GET_VEHICLE_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/administrator/vehicleType'
}

export const UPDATE_VEHICLE_TYPE = (vehicleId: string): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/administrator/vehicleType/V2/${vehicleId}`
})

export const DELETE_VEHICLE_TYPE = (vehicleId: string): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/vehicleType/V2/${vehicleId}`
})

export const GET_NUM_UNREAD_NOTIF = (loginId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/notification/NumOfUnread/${loginId}`
})
export const GET_NOTIF_BY_USER_ID = (loginId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/notification/unread/${loginId}`
})

export const UPDATE_FLAG_NOTIF = (notiId: number): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/notification/${notiId}`
})

export const CREATE_FORGET_PASSWORD = (table: string): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/administrator/forgetpassword/${table}`
})

export const GET_FORGET_PASSWORD_REQUEST = (
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/forgetpassword/${table}`
})

export const APPROVE_FORGET_PASSWORD_REQUEST = (
  table: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/forgetpassword/${table}/approve`
})

export const REJECT_FORGET_PASSWORD_REQUEST = (
  table: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/forgetpassword/${table}/reject`
})

//warehouse
export const GET_ALL_WAREHOUSE = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/warehouse/${table}`
})

export const GET_WAREHOUSE_BY_ID = (
  realmApiRoute: string,
  warehouseId: number,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/warehouse/${table}/${warehouseId}`
})

export const ADD_WAREHOUSE = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/${realmApiRoute}/warehouse/${table}`
})

export const UPDATE_WAREHOUSE_BY_ID = (
  realmApiRoute: string,
  warehouseId: number,
  table: string
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/${realmApiRoute}/warehouse/V2/${table}/${warehouseId}`
})

export const ADD_WAREHOUSE_V2 = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/${realmApiRoute}/warehouse/v2/${table}`
})

export const UPDATE_WAREHOUSE_BY_ID_V2 = (
  realmApiRoute: string,
  warehouseId: number,
  table: string
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/${realmApiRoute}/warehouse${realmApiRoute === 'collectors' ? `/V3/` : `/V2/`}${table}/${warehouseId}`
})

export const MANUFACTURER_GET_ALL_WAREHOUSE = (
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/manufacturer/warehouse/${table}`
})

export const UPDATE_RECYCLE_CAPACITY_BY_ID = (
  warehouseRecycId: number,
  table: string
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/collectors/warehouseRecyc/${table}/${warehouseRecycId}/status`
})

export const UPDATE_WAREHOUSE_STATUS_BY_ID = (
  warehouseId: number,
  table: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/collectors/warehouse/V2/${table}/${warehouseId}/status`
})

export const NEW_GET_ALL_HEADER_CHECKOUT_REQUESTS = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/checkoutrequest/header/searching/${table}`
})

export const NEW_GET_ALL_DETAIL_CHECKOUT_REQUESTS = (
  realmApiRoute: string,
  table: string,
  chckOutId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/checkoutrequest/detail/searching/${table}/${chckOutId}`
})

export const GET_ALL_CHECKOUT_REQUEST = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/checkoutrequest/searching/${table}`
})

export const GET_CHECKOUT_REQUEST_BY_ID = (
  chkOutId: number,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/checkout/${table}/${chkOutId}`
})

export const UPDATE_CHECK_OUT = (
  realmApiRoute: string,
  chkOutId: number,
  table: string,
  picoDtlId: number
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/${realmApiRoute}/checkout/${table}/pico/${chkOutId}/${picoDtlId}`
})

export const UPDATE_CHECKOUT_REQUEST_STATUS = (
  realmApiRoute: string,
  chkOutId: number,
  table: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/${realmApiRoute}/checkout/V2/${table}/status/${chkOutId}`
})

//get checkout reason list
export const GET_CHECKOUT_REASON = (
  realmApiRoute: string,
  tenantId: string,
  functId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/reason/${tenantId}/${functId}`
})

//recycle type
export const GET_RECYCLE_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/administrator/recycType'
}

export const GET_RECYCLE_TYPE_BY_ID = (recycTypeId: string) => ({
  method: 'get',
  url: `api/v1/administrator/recycType/${recycTypeId}`
})

//test
export const GET_ALL_USERNAME: AxiosRequestConfig = {
  method: 'get',
  url: 'users'
}

//service info
export const CREATE_SERVICE_INFO = (table: string): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/collectors/serviceInfo/${table}`
})

//vehicle
export const CREATE_VEHICLE = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/${realmApiRoute}/vehicle/${table}`
})

export const GET_VEHICLE = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/vehicle/${table}`
})

export const GET_LOGISTIC_VEHICLE = (table: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/vehicle/${table}`
})

export const GET_LOGISTIC_VEHICLE_BY_ID = (
  table: string,
  vehicleId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/vehicle/${table}/${vehicleId}`
})

export const GET_VEHICLE_PHOTO =  (table: string, vehicleId: number): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/vehicle/${table}/photo/${vehicleId}`
})

export const SEARCH_LOGISTIC_VEHICLE = (
  table: string,
  vehicleId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/vehicle/${table}/${vehicleId}`
})

export const NEW_SEARCH_LOGISTIC_VEHICLE = (
  table: string,
  vehicleId?: string,
  deviceId?: string
): AxiosRequestConfig => {
  let url = `api/v1/logistic/vehicle/${table}/search`
  // if (vehicleId !== undefined) {
  //   url += `?vehicleId=${vehicleId}`;
  // }

  // if (deviceId) {
  //   url += vehicleId ? `&deviceId=${deviceId}` : `?deviceId=${deviceId}`;
  // }

  return {
    method: 'get',
    url: `${url}`
  }
}

export const CREATE_LOGISTIC_VEHICLE = (table: string): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/logistic/vehicle/${table}`
})

export const EDIT_LOGISTIC_VEHICLE = (
  table: string,
  vehicleId: number
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/logistic/vehicle/V2/${table}/${vehicleId}`
})

export const DELETE_LOGISTIC_VEHICLE = (
  table: string,
  vehicleId: number
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/logistic/vehicle/V2/${table}/${vehicleId}/status`
})

export const DELETE_VEHICLE = (
  realmApiRoute: string,
  table: string,
  vehicleId: number
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/${realmApiRoute}/vehicle/${table}/${vehicleId}/status`
})

export const EDIT_VEHICLE = (
  realmApiRoute: string,
  table: string,
  vehicleId: number
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/${realmApiRoute}/vehicle${realmApiRoute === 'collectors' ? '/V2/' : '/'}${table}/${vehicleId}`
})

//inventory
export const ASTD_GET_INVENTORY = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/inventory/${table}/searching/withLocation`
})

export const GET_INVENTORY = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/inventory/${table}/searching/withLocation`
})

export const GET_ITEM_TRACK_INVENTORY = (
  gid: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/globalItemId/${gid}`
})

export const GET_INVENTORY_BY_LABEL = (label: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/searchItemsbyGID/${label}`
})

//process records
export const GET_PROCESS_OUT = (
  table: string,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/processout/header/searching/${table}`
})

export const GET_PROCESS_IN_BY_ID = (
  table: string,
  processInId: number,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/processin/${table}/${processInId}`
})

export const GET_PROCESS_IN_DETAIL = (
  table: string,
  processInId: number,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/processin/detail/searching/${table}/${processInId}`
})

export const GET_PROCESS_LIST: AxiosRequestConfig = {
  method: 'get',
  url: `api/v1/administrator/ProcessType`
}

export const GET_PROCESS_OUT_DETAIL = (
  table: string,
  processOutId: number,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/processout/detail/searching/${table}/${processOutId}`
})

export const CREATE_PROCESS_OUT_ITEM = (
  table: string,
  processOutId: number,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/${realmApiRoute}/processout/${table}/items/${processOutId}`
})

export const EDIT_PROCESS_OUT_DETAIL_ITEM = (
  table: string,
  processOutId: number,
  processOutDtlId: number,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/${realmApiRoute}/processout/V2/${table}/${processOutId}/proecessoutDtl/${processOutDtlId}`
})

export const DELETE_PROCESS_OUT_RECORD = (
  table: string,
  processOutId: number,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/${realmApiRoute}/processout/${table}/delete/${processOutId}`
})

export const DELETE_PROCESS_OUT_DETAIL_ITEM = (
  table: string,
  processOutDtlId: number,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/${realmApiRoute}/processoutDetail/V2/${table}/${processOutDtlId}/status`
})

// WAREHOUSE DASHBOARD

export const GET_CAPACITY_WAREHOUSE = (
  realmApiRoute: string,
  table: string,
  warehouseId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/warehousecapacity/${table}/${warehouseId}`
})

export const GET_WEIGHT_BY_SUBTYPE_ID = (
  realmApiRoute: string,
  table: string,
  warehouseId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/inventory/${table}/getweightbysubtype/${warehouseId}`
})

export const GET_RECYC_SUB_TYPE_WEIGHT = (
  realmApiRoute: string,
  table: string,
  warehouseId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/typeweight/${table}/${warehouseId}`
})

export const GET_WEIGHT_BY_SUB_TYPE = (realmApiRoute: string, table: string, warehouseId: number): AxiosRequestConfig => ({
   method: 'get',
  url: `api/v1/${realmApiRoute}/inventory/${table}/getweightbytypes/${warehouseId}`
})

export const GET_CHECKIN_WAREHOUSE = (
  realmApiRoute: string,
  table: string,
  warehouseId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/numofcheckinreq/${table}/${warehouseId}`
})

export const GET_CHECKOUT_WAREHOUSE = (
  realmApiRoute: string,
  table: string,
  warehouseId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/numofcheckoutreq/${table}/${warehouseId}`
})

export const GET_CHECK_IN_OUT_WAREHOUSE = (
  realmApiRoute: string,
  table: string,
  warehouseId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/checkinout/${table}/${warehouseId}`
})

// USER ACCOUNT AND GROUP
export const GET_ALL_USER_ACCOUNT = (table: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/userAccount/t/${table}`
})

export const ADD_USER_ACCOUNT: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/administrator/register'
}
export const GET_USER_GROUP = (tenantId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/userGroup/t/${tenantId}`
})

export const GET_USER_ACCOUNT = (loginId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/userAccount/${loginId}`
})

export const GET_FUNCTION = (): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/function`
})

export const GET_FUNCTION_FILTERED = (tenantTypeId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/function/t/functionWithReason/${tenantTypeId}`
})

export const CREATE_USER_GROUP = (): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/administrator/userGroup`
})

export const EDIT_USER_GROUP = (userGroupId: number): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/administrator/userGroup/${userGroupId}`
})

export const DELETE_USER_GROUP = (userGroupId: number): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/userGroup/status/${userGroupId}`
})

//STAFF MANAGEMENT
export const GET_STAFF = (
  tenantId: string,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/staff/search/${tenantId}`
})

export const CREATE_STAFF = (realmApiRoute: string): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/${realmApiRoute}/staff`
})

export const EDIT_STAFF = (
  tenantId: string,
  staffId: string,
  realmApi: string
): AxiosRequestConfig => ({
  method: realmApi === 'logistic' ? 'put' : realmApi === 'customer' ? 'put' : realmApi === 'collectors' ? 'put' : 'patch',
  url: `api/v1/${realmApi}/staff/V2/${tenantId}/${staffId}`
})

export const GET_LOGINID_LIST = (tenantId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/userAccount/t/${tenantId}`
})

export const GET_TITLE_LIST = (
  table: string,
  realmApi: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApi}/stafftitle/${table}`
})

//API roster
export const GET_ROSTER_LIST = (
  tenantId: string,
  startAt: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/roster/${tenantId}/${startAt}`
})

export const GET_ROSTER_LIST_BY_COL_POINT = (
  tenantId: string,
  colId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/roster/collectionPoint/${tenantId}/${colId}`
})

export const CREATE_ROSTER: AxiosRequestConfig = {
  method: 'post',
  url: `api/v1/collectors/roster`
}

export const ADD_STAFF_ROSTER = (
  tenantId: string,
  rosterId: number,
  staffId: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/collectors/roster/addStaff/${tenantId}/${rosterId}/${staffId}`
})

export const DELETE_STAFF_ROSTER = (
  tenantId: string,
  rosterId: number,
  staffId: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/collectors/roster/deleteStaff/${tenantId}/${rosterId}/${staffId}`
})

export const UPDATE_ROSTER = (
  tenantId: string,
  rosterId: number
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/collectors/roster/${tenantId}/${rosterId}`
})

export const CANCEL_ROSTER = (
  tenantId: string,
  rosterId: number
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/collectors/roster/cancel/${tenantId}/${rosterId}`
})

//USER ACCOUNT API
export const GET_USER_ACCOUNT_LIST = (
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/userAccount/t/${tenantId}`
})

export const GET_USER_ACCOUNT_LIST_PAGING = (
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/userAccount/t/pageable/${tenantId}`
})

export const CREATE_USER_ACCOUNT: AxiosRequestConfig = {
  method: 'post',
  url: `api/v1/administrator/register`
}

export const UPDATE_USER_ACCOUNT = (loginId: string): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/administrator/userAccount/${loginId}`
})

export const DELETE_USER_ACCOUNT = (loginId: string): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/userAccount/status/${loginId}`
})

export const GET_CHECKIN_CHECKOUT_LIST = (
  table: string,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/checkinout/searching/${table}`,
})

export const GET_CHECKIN_BY_ID = (
  table: string,
  chkInId: number,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/checkin/${table}/${chkInId}`
})

export const GET_CHECKOUT_BY_ID = (
  table: string,
  chkOutId: number,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/checkout/${table}/${chkOutId}`
})

export const GET_ALL_RECYCLE_TYPE = (): AxiosRequestConfig => ({
  method: 'get',
  url: 'api/v1/administrator/recycType'
})

export const GET_ALL_PRODUCT_TYPE = (): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/productTypes`
})

//logistics pickup order
export const GET_ALL_LOGISTICS_PICK_UP_ORDER = (
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/pico/search/logistic/${tenantId}`
  // url: `api/v1/administrator/pico/search/${tenantId}`
})

//get all status
export const GET_ALL_STATUS = (): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/statusGroup`
})

//get status detail
export const GET_STATUS_DETAIL = (status: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/statusGroup/${status}`
})

//get pickup order reason list
export const GET_ALL_REASON = (
  tenantId: string,
  realmApiRoute: string,
  functionId: string | number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/reason/${tenantId}/${functionId}`
})

//logistic/jobOrder
export const GET_ALL_JOB_ORDER = (table: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/jo/searchV2/${table}`
})

export const UPDATE_JOB_ORDER_STATUS = (
  table: string,
  joId: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/logistic/jo/${table}/status/${joId}`
})

export const GET_DRIVER_DETAIL_BY_ID = (
  table: string,
  driverId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/driver/${table}/${driverId}`
})
// get logistic , contract, vehicle for logistic admin
export const GET_CONTRACT_LOGISTIC = (
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/contract/${tenantId}`
})

export const GET_LOGISTICLIST_LOGISTIC = (
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/logisticlist/${table}`
})
export const ASSIGN_DRIVER = (table: string): AxiosRequestConfig => ({
  method: 'post',
  url: `/api/v1/logistic/jo/${table}`
})

export const REJECT_REASSIGN_DRIVER = (
  table: string,
  id: any
): AxiosRequestConfig => ({
  method: 'put',
  url: `/api/v1/logistic/jo/${table}/${id}`
})

export const GET_DRIVER = (table: string): AxiosRequestConfig => ({
  method: 'get',
  url: `/api/v1/logistic/driver/{table}?table=${table}`
})

export const GET_DRIVER_DATA = (tenantId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `/api/v1/logistic/driverInfo/${tenantId}`
})

export const GET_VEHICLE_PLATE_LIST = (tenantId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/vehicleInfo/${tenantId}`
})

export const GET_VEHICLE_LOGISTIC = (table: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/vehicle/${table}`
})

export const GET_LIST_NOTIF_TEMPLATE_PO = (
  tenantId: string,
  path: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${path}/notiTemplate/search/${tenantId}`
})

export const GET_LIST_NOTIF_TEMPLATE_STAFF = (
  tenantId: string,
  path: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${path}/notiTemplate/search/${tenantId}`
})

//get denial reason
export const GET_DENIAL_REASON = (
  realmApiRoute: string,
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `/api/v1/${realmApiRoute}/reason/${tenantId}`
})
//get denial reason by functionId
export const GET_DENIAL_REASON_BY_FUNCTION_ID = (
  realmApiRoute: string,
  tenantId: string,
  functionId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `/api/v1/${realmApiRoute}/reason/${tenantId}/${functionId}`
})

//create denial reason
export const CREATE_DENIAL_REASON = (
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'post',
  url: `/api/v1/${realmApiRoute}/reason/`
})

//update denial reason
export const UPDATE_DENIAL_REASON = (
  realmApiRoute: string,
  tenantId: string,
  reasonId: number
): AxiosRequestConfig => ({
  method: 'PUT',
  url: `/api/v1/${realmApiRoute}/reason/V2/${tenantId}/${reasonId}`
})

//get staff title
export const GET_STAFF_TITLE = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `/api/v1/${realmApiRoute}/stafftitle/${table}`
})

// export const GET_STAFF_TITLE_BY_ID = (
//   realmApiRoute: string,
//   table: string,
//   titleId: string
// ): AxiosRequestConfig => ({
//   method: 'get',
//   url: `/api/v1/${realmApiRoute}/stafftitle/${table}/${titleId}`
// })

//create staff title
export const CREATE_STAFF_TITLE = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'post',
  url: `/api/v1/${realmApiRoute}/stafftitle/${table}`
})

//update staff title
export const UPDATE_STAFF_TITLE = (
  realmApiRoute: string,
  table: string,
  titleId: string
): AxiosRequestConfig => ({
  method: 'PUT',
  url: `/api/v1/${realmApiRoute}/stafftitle/V2/${table}/${titleId}`
})

//get disposal location
export const GET_DISPOSAL_LOCATION = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `/api/v1/${realmApiRoute}/disposallocation/${table}`
})

//create disposal location
export const CREATE_DISPOSAL_LOCATION = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'post',
  url: `/api/v1/${realmApiRoute}/disposallocation/${table}`
})

//update disposal location
export const UPDATE_DISPOSAL_LOCATION = (
  realmApiRoute: string,
  table: string,
  disposalLocId: string
): AxiosRequestConfig => ({
  method: 'PUT',
  url: `/api/v1/${realmApiRoute}/disposallocation/V2/${table}/${disposalLocId}`
})

//get company (collectorlist || logisticlist || manulist || customerlist)
export const GET_COMPANY = (
  realmApiRoute: string,
  table: string,
  companyType: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `/api/v1/${realmApiRoute}/${companyType}/${table}`
})

//create company
export const CREATE_COMPANY = (
  realmApiRoute: string,
  table: string,
  companyType: string
): AxiosRequestConfig => ({
  method: 'post',
  url: `/api/v1/${realmApiRoute}/${companyType}/${table}`
})

//update company
export const UPDATE_COMPANY = (
  realmApiRoute: string,
  table: string,
  companyType: string,
  companyId: string
): AxiosRequestConfig => ({
  method: 'PUT',
  url: `/api/v1/${realmApiRoute}/${companyType}/V2/${table}/${companyId}`
})

export const GET_CONTRACT_LIST = (
  realmApiRoute: string,
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/contract/${tenantId}`
})

export const CREATE_CONTRACT = (realmApiRoute: string): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/${realmApiRoute}/contract`
})

export const EDIT_CONTRACT = (
  realmApiRoute: string,
  tenantId: string,
  contractNo: string
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/${realmApiRoute}/contract/V2/${tenantId}/${contractNo}`
})

export const DELETE_CONTRACT = (
  realmApiRoute: string,
  tenantId: string,
  contractNo: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/${realmApiRoute}/contract/V2/${tenantId}/${contractNo}/status`
})

export const GET_PACKAGING_LIST = (
  realmApiRoute: string,
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/packaginglist/${tenantId}`
})

export const GET_FULL_PACKAGING_LIST = (realmApiRoute: string, tenantId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/packagingListIgnoreStatus/${tenantId}`
})

export const CREATE_PACKAGING = (
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/${realmApiRoute}/packaginglist`
})

export const EDIT_PACKAGING = (
  realmApiRoute: string,
  tenantId: string,
  packagingTypeId: string
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/${realmApiRoute}/packaginglist/V2/${tenantId}/${packagingTypeId}`
})

export const GET_DETAIL_NOTIF_TEMPLATE = (
  tenantId: string,
  templateId: string,
  path: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${path}/notiTemplate/${tenantId}/${templateId}`
})

export const UPDATE_NOTIF_TEMPLATE = (
  tenantId: string,
  templateId: string,
  path: string
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/${path}/notiTemplate/V2/${tenantId}/${templateId}`
})

//logistics driver
export const GET_DRIVER_LIST = (table: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/driver/${table}`
})

export const CREATE_DRIVER = (tenantId: string): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/logistic/driver/${tenantId}`
})

export const EDIT_DRIVER = (
  tableId: string,
  driverId: string
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/logistic/driver/V2/${tableId}/${driverId}`
})

export const DELETE_DRIVER = (
  tableId: string,
  driverId: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/logistic/driver/V2/${tableId}/${driverId}`
})

export const UPDATE_NOTIF_TEMPLATE_BROADCAST = (
  tenantId: string,
  templateId: string,
  path: string
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/${path}/notiTemplate/V2/${tenantId}/${templateId}`
})

// STAFF ENQUIRY
export const GET_STAFF_ENQUIRY = (tenantId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/staff`
})

export const CREATE_STAFF_ENQUIRY: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/logistic/staff'
}

export const EDIT_STAFF_ENQUIRY = (
  tenantId: string,
  staffId: string
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/logistic/staff/V2/${tenantId}/${staffId}`
})

export const DELETE_STAFF_ENQUIRY = (
  tenantId: string,
  staffId: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/logistic/staff/V2/${tenantId}/${staffId}`
})

//USER ACCOUNT API
export const GET_USER_MANUFACTURER_LIST = (
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/manufacturer/staff/search/${tenantId}`
})

export const CREATE_USER_MANUFACTURER: AxiosRequestConfig = {
  method: 'post',
  url: `api/v1/manufacturer/staff`
}

export const UPDATE_USER_MANUFACTURER = (
  tenantId: string,
  loginId: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/manufacturer/staff/V2/${tenantId}/${loginId}`
})

export const DELETE_USER_MANUFACTURER = (
  loginId: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/manufacturer/staff/V2/${loginId}`
})

//PURCHASE ORDER MANUFACTURER
export const SEARCH_PURCHASE_ORDER = (
  sellerTenantId: string,
  path: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/po/${path}/search/${sellerTenantId}`
})

export const GET_PURCHASE_ORDER_BY_ID = (poId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/po/withoutDeletedDtl/${poId}`
})

export const UPDATE_PURCHASE_ORDER_STATUS = (
  poId: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/po/V2/${poId}`
})

export const GET_ALL_REASON_MANUFACTURER = (
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/manufacturer/reason/${tenantId}`
})

export const GET_RECYC_CODE: AxiosRequestConfig = {
  method: 'get',
  url: `api/v1/administrator/recycCode`
}

export const CREATE_RECYC_CODE: AxiosRequestConfig = {
  method: 'post',
  url: `api/v1/administrator/recycCode`
}

export const UPDATE_RECYC_CODE = (codeId: number): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/administrator/recycCode/V2/${codeId}`
})

export const DELETE_RECYC_CODE = (codeId: number): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/recycCode/V2/${codeId}`
})

export const GET_WEIGHT_UNIT: AxiosRequestConfig = {
  method: 'get',
  url: `api/v1/administrator/weightUnit`
}

export const CREATE_WEIGHT_UNIT: AxiosRequestConfig = {
  method: 'post',
  url: `api/v1/administrator/weightUnit`
}

export const UPDATE_WEIGHT_UNIT = (unitId: number): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/administrator/weightUnit/V2/${unitId}`
})

export const DELETE_WEIGHT_UNIT = (unitId: number): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/weightUnit/V2/${unitId}`
})

export const CREATE_CURRENCY: AxiosRequestConfig = {
  method: 'post',
  url: `api/v1/administrator/currencyList`
}

export const EDIT_CURRENCY = (currencyId: number): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/administrator/currencyList/V2/${currencyId}`
})

export const DELETE_CURRENCY = (currencyId: number): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/currencyList/V2/${currencyId}`
})

export const GET_DECIMAL_VALUE: AxiosRequestConfig = {
  method: 'get',
  url: `api/v1/administrator/decimalVal`
}

export const GET_ALL_DECIMAL_VALUE: AxiosRequestConfig = {
  method: 'get',
  url: `api/v1/administrator/all/decimalVal`
}

export const UPDATE_DECIMAL_VALUE = (
  decimalValId: number
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/decimalVal/V2/${decimalValId}`
})

export const GET_DATE_FORMAT: AxiosRequestConfig = {
  method: 'get',
  url: `api/v1/administrator/dateFormat`
}

export const GET_ALL_DATE_FORMAT: AxiosRequestConfig = {
  method: 'get',
  url: `api/v1/administrator/all/dateFormat`
}

export const UPDATE_DATE_FORMAT = (
  dateFormatId: number
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/dateFormat/V2/${dateFormatId}`
})

export const GET_WEIGHT_TOLERANCE: AxiosRequestConfig = {
  method: 'get',
  url: `api/v1/administrator/weightTolerance`
}

export const UPDATE_WEIGHT_TOLERANCE = (
  weightId: number
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/administrator/weightTolerance/V2/${weightId}`
})
// get upload img setting
export const GET_IMG_SETTINGS = (tenantId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/account/t/imgSetting/${tenantId}`
})

export const UPDATE_PURCHASE_ORDER = (poId: string): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/administrator/po/V3/${poId}`
})

export const GET_COLPOINTRECYCABLES_DASHBOARD = (
  tenantId: string,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/dashboard/colPointRecyclables/${tenantId}`
})

// get decimal value
export const GET_DECIMAL_VAL = (): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/decimalVal`
})

export const GET_WEIGHT_RECYCABLES_DASHBOARD = (
  table: string,
  frmDate: string,
  toDate: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `/api/v1/manufacturer/dashboard/weightRecyclablesColPoint/${table}/${frmDate}/${toDate}`
})

export const GET_SALES_PRODUCT_ANALYSIS = (
  tenantId: string,
  frmDate: string,
  toDate: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `/api/v1/manufacturer/dashboard/salesProductAnalysis/${tenantId}/${frmDate}/${toDate}`
})

export const GET_RECYC_PROCESS_ANALYSIS = (
  table: string,
  frmDate: string,
  toDate: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `/api/v1/manufacturer/dashboard/recycProcessAnalysis/${table}/${frmDate}/${toDate}`
})

export const GET_TOTAL_SALES_PRODUCT_ANALYSIS = (
  tenantId: string,
  frmDate: string,
  toDate: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `/api/v1/manufacturer/dashboard/ttlSalesProductAnalysis/${tenantId}/${frmDate}/${toDate}`
})

export const GET_TOTAL_SALES_PRODUCT_BY_DISTRICT_ANALYSIS = (
  tenantId: string,
  frmDate: string,
  toDate: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `/api/v1/manufacturer/dashboard/ttlSalesProductByDistrictAnalysis/${tenantId}/${frmDate}/${toDate}`
})

export const GET_WEIGHT_RECYCABLES_DASHBOARD_ASTD = (
  tenantId: string,
  frmDate: string,
  toDate: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `/api/v1/account/dashboard/weightRecyclablesColPoint/${tenantId}/${frmDate}/${toDate}`
})

export const GET_BROADCAST_MESSAGE = (): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/account/notiTemplate/broadcastMessage`
})

export const GET_STAFF_ID = (
  realmApiRoute: string,
  tenantId: string,
  loginId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/staff/login/${tenantId}/${loginId}`
})

export const GET_VEHICLE_DETAIL = (vehicleId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/vehicleType/${vehicleId}`
})

export const GET_DENIAL_REASON_COLLECTORS = (
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `/api/v1/collectors/reason/${tenantId}/new`
})

export const GET_DENIAL_REASON_BY_FUNCTION_ID_COLLECTORS = (
  tenantId: string,
  functionId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `/api/v1/collectors/reason/${tenantId}/${functionId}/new`
})

export const CREATE_DENIAL_REASON_COLLECTORS: AxiosRequestConfig = {
  method: 'post',
  url: `/api/v1/collectors/reason/new`
}

export const UPDATE_DENIAL_REASON_COLLECTORS = (
  tenantId: string,
  reasonId: number
): AxiosRequestConfig => ({
  method: 'PUT',
  url: `/api/v1/collectors/reason/V3/${tenantId}/${reasonId}`
})

export const CREATE_USER_ACTIVITY = (loginId: string): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/administrator/userActivity/${loginId}`
})

export const CREATE_PROCESS_TYPE_DATA = (realmApiRoute: string): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/${realmApiRoute}/processtype`
})

export const GET_PROCESS_TYPE_DATA = (realmApiRoute: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/processtype`
})

export const UPDATE_PROCESS_TYPE_DATA = (realmApiRoute: string, processTypeId: string): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/${realmApiRoute}/processtype/${processTypeId}`
})

export const DELETE_PROCESS_TYPE_DATA = (realmApiRoute: string, processTypeId: string): AxiosRequestConfig => ({
  method: 'delete',
  url: `api/v1/${realmApiRoute}/processtype/${processTypeId}`
})

export const GET_FACTORY_LIST_DATA = (tenantId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/factory/getFactories/${tenantId}`
})

export const GET_FACTORY_WAREHOUSE_LIST_DATA = (): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/factory/getWarehouseList`
})

export const GET_ALL_FACTORY_WAREHOUSE_LIST_DATA = (tenantId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/factory/getAllWarehouseList?tenantId=${tenantId}`
})

export const CREATE_FACTORY_DATA = (): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/factory/createFactory`
})

export const UPDATE_FACTORY_DATA = (factoryId: string): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/factory/updateFactory?factoryId=${factoryId}`
})

export const DELETE_FACTORY_DATA = (factoryId: string): AxiosRequestConfig => ({
  method: 'delete',
  url: `api/v1/factory/delFactory?factoryId=${factoryId}`
})

export const GET_INTERNAL_TRANSFER_REQUEST = (
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/itr/all/${tenantId}`
})

export const UPDATE_INTERNAL_TRANSFER_REQUEST_STATUS = (
  tenantId: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/itr/update/${tenantId}/status`
})

export const CREATE_PROCESS_IN = (  
  realmApiRoute: string,
  table: string,
): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/${realmApiRoute}/processin/${table}` 
})

export const CREATE_PROCESS_OUT = (  
  realmApiRoute: string,
  table: string,
): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/${realmApiRoute}/processout/${table}/header`
})

export const GET_PUJO_DATA = (realmApiRoute: string, table: string, joId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/pu/jo/${table}/${joId}`
})