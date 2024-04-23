import { AxiosRequestConfig } from 'axios'
import { CreateDenialReason } from '../interfaces/denialReason'

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

// export const GET_TENANT_BY_TENANT_ID: AxiosRequestConfig = {
//   method: 'get',
//   url: 'api/v1/account/tenantInvite'
// }

export const UPDATE_TENANT_REGISTER = (
  tenantId: number
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/account/t/updateInfo/${tenantId}`
})

export const GET_TENANT_BY_TENANT_ID = (
  tenantId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/account/t/${tenantId}`
})

export const UPDATE_TENANT_STATUS = (tenantId: number): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/account/t/status/${tenantId}`
})

export const UPDATE_TENANT_CURRENCY = (
  tenantId: string,
  monetaryValue: string,
  updatedBy: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/account/t/monetary/${tenantId}?tenantId=${tenantId}&monetaryValue=${monetaryValue}&updatedBy=${updatedBy}`
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

export const GET_ALL_CHECKIN_REQUESTS = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/checkinrequest/searching/${table}`
})

export const UPDATE_CHECK_IN_STATUS = (
  realmApiRoute: string,
  chkInId: number,
  table: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/${realmApiRoute}/checkin/${table}/status/${chkInId}`
})

//get checkin reason list
export const GET_CHECKIN_REASON = (
  realmApiRoute: string,
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/reason/${tenantId}/4`
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
  url: 'api/v1/administrator/pico/details'
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
  url: `api/v1/${realmApiRoute}/logisticlist/${table}`
})

export const GET_COLLECTORLIST = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/collectorlist/${table}`
})

export const GET_MANULIST = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/manulist/${table}`
})

export const UPDATE_PICK_UP_ORDER: AxiosRequestConfig = {
  method: 'put',
  url: 'api/v1/administrator/pico'
}
export const UPDATE_PICK_UP_ORDER_STATUS: AxiosRequestConfig = {
  method: 'patch',
  url: 'api/v1/administrator/pico/status'
}
export const UPDATE_PICK_UP_ORDER_DETAIL_STATUS: AxiosRequestConfig = {
  method: 'patch',
  url: 'api/v1/administrator/pico/detail/status'
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

export const GET_SITE_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/administrator/siteType'
}

export const ADD_SITE_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/administrator/siteType'
}

export const GET_RECYC_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/administrator/recycType'
}

export const ADD_RECYC_TYPE: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/administrator/recycType'
}

export const GET_VEHICLE_TYPE: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/administrator/vehicleType'
}

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
  url: `api/v1/${realmApiRoute}/warehouse/${table}/${warehouseId}`
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
  method: 'put',
  url: `api/v1/collectors/warehouse/${table}/${warehouseId}/status`
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

export const UPDATE_CHECKOUT_REQUEST_STATUS = (
  realmApiRoute: string,
  chkOutId: number,
  table: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/${realmApiRoute}/checkout/${table}/status/${chkOutId}`
})

//get checkout reason list
export const GET_CHECKOUT_REASON = (
  realmApiRoute: string,
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/reason/${tenantId}/5`
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

export const SEARCH_LOGISTIC_VEHICLE = (
  table: string,
  vehicleId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/vehicle/${table}/${vehicleId}`
})

export const CREATE_LOGISTIC_VEHICLE = (table: string): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/logistic/vehicle/${table}`
})

export const EDIT_LOGISTIC_VEHICLE = (
  table: string,
  vehicleId: number
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/logistic/vehicle/${table}/${vehicleId}`
})

export const DELETE_LOGISTIC_VEHICLE = (
  table: string,
  vehicleId: number
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/logistic/vehicle/${table}/${vehicleId}/status`
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
  url: `api/v1/${realmApiRoute}/vehicle/${table}/${vehicleId}`
})

//inventory
export const GET_INVENTORY = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/inventory/${table}/searching`
})

//process records
export const GET_PROCESS_OUT = (
  table: string,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/processout/${table}`
})

export const GET_PROCESS_IN_BY_ID = (
  table: string,
  processInId: number,
  realmApiRoute: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/processin/${table}/${processInId}`
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
  url: `api/v1/${realmApiRoute}/processout/${table}/${processOutId}`
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
  url: `api/v1/${realmApiRoute}/processout/${table}/processout/${processOutId}/proecessoutDtl/${processOutDtlId}`
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
  url: `api/v1/${realmApiRoute}/processoutDetail/${table}/${processOutDtlId}/status`
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
export const GET_STAFF = (tenantId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/staff/${tenantId}`
})

export const CREATE_STAFF: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/collectors/staff'
}

export const EDIT_STAFF = (
  tenantId: string,
  staffId: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/collectors/staff/${tenantId}/${staffId}`
})

export const GET_LOGINID_LIST = (tenantId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/userAccount/t/${tenantId}`
})

export const GET_TITLE_LIST = (table: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/stafftitle/${table}`
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
  picoId: string,
  page: number,
  size: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/checkinout/searching/${table}`,
  params: {
    picoId: picoId ?? '',
    page,
    size
  }
})

export const GET_CHECKIN_BY_ID = (
  table: string,
  chkInId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/checkin/${table}/${chkInId}`
})

export const GET_CHECKOUT_BY_ID = (
  table: string,
  chkOutId: number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/checkout/${table}/${chkOutId}`
})

export const GET_ALL_RECYCLE_TYPE = (): AxiosRequestConfig => ({
  method: 'get',
  url: 'api/v1/administrator/recycType'
})

//logistics pickup order
export const GET_ALL_LOGISTICS_PICK_UP_ORDER = (
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/administrator/pico/search/logistic/${tenantId}`
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
  functionId: string | number
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/reason/${tenantId}/${functionId}`
})

//logistic/jobOrder
export const GET_ALL_JOB_ORDER = (table: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/jo/search/${table}`
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

export const GET_VEHICLE_LOGISTIC = (table: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/vehicle/${table}`
})

export const GET_LIST_NOTIF_TEMPLATE_PO = (
  tenantId: string,
  path: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${path}/notiTemplate/${tenantId}`
})

export const GET_LIST_NOTIF_TEMPLATE_STAFF = (
  tenantId: string,
  path: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${path}/notiTemplate/${tenantId}`
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
  url: `/api/v1/${realmApiRoute}/reason/${tenantId}/${reasonId}`
})

//get staff title
export const GET_STAFF_TITLE = (
  realmApiRoute: string,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `/api/v1/${realmApiRoute}/stafftitle/${table}`
})

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
  url: `/api/v1/${realmApiRoute}/stafftitle/${table}/${titleId}`
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
  url: `/api/v1/${realmApiRoute}/disposallocation/${table}/${disposalLocId}`
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
  url: `/api/v1/${realmApiRoute}/${companyType}/${table}/${companyId}`
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
  url: `api/v1/${realmApiRoute}/contract/${tenantId}/${contractNo}`
})

export const GET_PACKAGING_LIST = (
  realmApiRoute: string,
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/${realmApiRoute}/packaginglist/${tenantId}`
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
  url: `api/v1/${realmApiRoute}/packaginglist/${tenantId}/${packagingTypeId}`
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
  url: `api/v1/${path}/notiTemplate/${tenantId}/${templateId}`
})

//logistics driver
export const GET_DRIVER_LIST = (): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/logistic/driver/{table}`
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
  url: `api/v1/logistic/driver/${tableId}/${driverId}`
})

export const DELETE_DRIVER = (
  tableId: string,
  driverId: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/logistic/driver/${tableId}/${driverId}`
})

export const UPDATE_NOTIF_TEMPLATE_BROADCAST = (
  tenantId: string,
  templateId: string,
  path: string
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/${path}/notiTemplate/${tenantId}/${templateId}`
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
  url: `api/v1/logistic/staff/${tenantId}/${staffId}`
})

export const DELETE_STAFF_ENQUIRY = (
  tenantId: string,
  staffId: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/logistic/staff/${tenantId}/${staffId}`
})

//USER ACCOUNT API
export const GET_USER_MANUFACTURER_LIST = (
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/manufacturer/staff/${tenantId}`
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
  url: `api/v1/manufacturer/staff/${tenantId}/${loginId}`
})

export const DELETE_USER_MANUFACTURER = (
  loginId: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/manufacturer/staff/${loginId}`
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
  url: `api/v1/administrator/po/${poId}`
})

export const UPDATE_PURCHASE_ORDER_STATUS = (
  poId: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/administrator/po/${poId}`
})

export const GET_ALL_REASON_MANUFACTURER = (
  tenantId: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/manufacturer/reason/${tenantId}`
})

export const UPDATE_PURCHASE_ORDER = (
  poId: string
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/administrator/po/${poId}`
})
