import { AxiosRequestConfig } from 'axios'

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

// export const GET_ALL_TENANT: AxiosRequestConfig = {
//   method: 'get',
//   url: 'api/v1/account/tenant/astd/tenant'
// }

export const GET_ALL_TENANT: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/account/t'
}

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


//collection point
export const GET_ALL_COLLECTIONPOINT: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/collectors/collectionPoint'
}

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

export const GET_CONTRACT: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/collectors/contract'
}

export const GET_ALL_CHECKIN_REQUESTS = (
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/checkin/${table}`
})

export const UPDATE_CHECK_IN_STATUS = (
  chkInId: number,
  table: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/collectors/checkin/${table}/status/${chkInId}`
})

//collector/pickupOrder
export const GET_ALL_PICK_UP_ORDER: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/administrator/pico'
}

export const GET_PICK_UP_ORDER_BY_ID = (picoId: string): AxiosRequestConfig => ({
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

export const GET_LOGISTICLIST: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/collectors/logisticlist'
}
export const GET_COLLECTORLIST: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/collectors/collectorlist'
}
export const GET_MANULIST: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/collectors/manulist'
}

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
export const GET_ALL_WAREHOUSE = (table: string): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/warehouse/${table}`
})

export const GET_WAREHOUSE_BY_ID = (
  warehouseId: number,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/warehouse/${table}/${warehouseId}`
})

export const ADD_WAREHOUSE = (table: string): AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/collectors/warehouse/${table}`
})

export const UPDATE_WAREHOUSE_BY_ID = (
  warehouseId: number,
  table: string
): AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/collectors/warehouse/${table}/${warehouseId}`
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
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/checkout/${table}`
})

export const GET_CHECKOUT_REQUEST_BY_ID = (
  chkOutId: number,
  table: string
): AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/checkout/${table}/${chkOutId}`
})

export const UPDATE_CHECKOUT_REQUEST_STATUS = (
  chkOutId: number,
  table: string
): AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/collectors/checkout/${table}/status/${chkOutId}`
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
export const CREATE_VEHICLE = (table: string) : AxiosRequestConfig => ({
  method: 'post',
  url: `api/v1/collectors/vehicle/${table}`
})

export const GET_VEHICLE = (table: string) : AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/vehicle/${table}`
})

export const DELETE_VEHICLE = (table: string, vehicleId: number ) : AxiosRequestConfig => ({
  method: 'patch',
  url: `api/v1/collectors/vehicle/${table}/${vehicleId}/status`
})

export const EDIT_VEHICLE = (table: string, vehicleId: number ) : AxiosRequestConfig => ({
  method: 'put',
  url: `api/v1/collectors/vehicle/${table}/${vehicleId}`
})

//inventory
export const GET_INVENTORY = (table: string) : AxiosRequestConfig => ({
  method: 'get',
  url: `api/v1/collectors/inventory/${table}`
})