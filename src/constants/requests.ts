import { AxiosRequestConfig } from "axios";

//tenant manage
export const LOGIN: AxiosRequestConfig = {
  method: 'post',
  url: 'api/v1/account/login',
};

export const ADD_TENANT: AxiosRequestConfig = {
  method: 'patch',
  url: 'api/v1/account/tenant/astd/addTenant',
};

export const GET_ALL_TENANT: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/account/tenant/astd/tenant'
}

export const GET_TENANT_BY_TENANT_ID: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/account/tenantInvite'
}

export const UPDATE_TENANT_REGISTER: AxiosRequestConfig = {
  method: 'patch',
  url: 'api/v1/account/tenantInvite'
}

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

export const FIND_COLLECTIONPOINT_EXIST_BYCONTRACT_ADDRESS: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/collectors/collectionPoint/byContractAndAddress'
}

export const GET_CONTRACT: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/collectors/contract'
}

export const GET_ALL_CHECKIN_REQUESTS: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/collectors/checkin'
}

export const UPDATE_CHECK_IN_STATUS: AxiosRequestConfig = {
  method: 'patch',
  url: 'api/v1/collectors/checkin/'
}

//collector/pickupOrder
export const GET_ALL_PICK_UP_ORDER: AxiosRequestConfig = {
  method: 'get',
  url: 'api/v1/collectors/pico'
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

//warehouse
export const GET_ALL_WAREHOUSE: AxiosRequestConfig = {
  method: "get",
  url: "api/v1/collectors/warehouse",
};

export const GET_WAREHOUSE_BY_ID = (
  warehouseId: number
): AxiosRequestConfig => ({
  method: "get",
  url: `api/v1/collectors/warehouse/${warehouseId}`,
});

export const ADD_WAREHOUSE: AxiosRequestConfig = {
  method: "post",
  url: "api/v1/collectors/warehouse",
};

export const UPDATE_WAREHOUSE_BY_ID = (
  warehouseId: number
): AxiosRequestConfig => ({
  method: "put",
  url: `api/v1/collectors/warehouse/${warehouseId}`,
});

export const UPDATE_RECYCLE_CAPACITY_BY_ID = (
  warehouseRecycId: number
): AxiosRequestConfig => ({
  method: "put",
  url: `api/v1/collectors/warehouseRecyc/${warehouseRecycId}/status`,
});

export const UPDATE_WAREHOUSE_STATUS_BY_ID = (
  warehouseId: number
): AxiosRequestConfig => ({
  method: "put",
  url: `api/v1/collectors/warehouse/${warehouseId}/status`,
});

//recycle type
export const GET_RECYCLE_TYPE: AxiosRequestConfig = {
  method: "get",
  url: "api/v1/administrator/recycType",
};

export const GET_RECYCLE_TYPE_BY_ID = (recycTypeId: string) => ({
  method: "get",
  url: `api/v1/administrator/recycType/${recycTypeId}`,
});


//test
export const GET_ALL_USERNAME: AxiosRequestConfig = {
  method: "get",
  url: "users",
};