export type InventoryDetail = {
  itemDtlId: number
  sourcePicoId: string
  sourcePicoDtlId: number
}

export type InventoryItem = {
  itemId: number
  labelId: string
  warehouseId: number
  colId: number
  recyclingNumber?: string
  recycTypeId: string
  recycSubTypeId: string
  productTypeId: string
  productSubTypeId: string
  productSubTypeRemark: string
  productAddonTypeId: string
  productAddonTypeRemark: string
  recyName: string
  subName: string
  productName: string
  productSubName: string
  productAddOnName: string
  packageTypeId: string
  weight: number
  unitId: string
  status: string
  createdBy: string
  updatedBy: string
  inventoryDetail: InventoryDetail[]
  createdAt: string
  updatedAt: string
  location: string
  packageName?: string,
  gid: number,
  gidLabel: string
}

export type InventoryQuery = {
  labelId: string | null
  warehouseId: number | null
  recycTypeId: string
  recycSubTypeId: string
  idleDays: number | null,
}

export type ProcessInOutEventDetail = {
  gid: number[],
  warehouse_tc: string
  warehouse_sc: string
  start_date_time: string
  warehouse_en: string
  total_weight: string
  gidLabel: string
}

export type EventDetailTracking = {
  tenant_id: string,
  company_name_en: string
  company_name_sc: string
  company_name_tc: string
  factory_name_en: string
  factory_name_sc: string
  factory_name_tc: string
  process_out: ProcessInOutEventDetail,
  process_type_en: string
  process_type_sc: string
  process_type_tc: string
  process_in: ProcessInOutEventDetail
}

export type EventTrackingData = {
  gidEventId: number
  tenantId: string
  eventType: string
  eventDetail: string
  details: EventDetailTracking
  remarks: string | null
  createdBy: string
  createdAt: string
}

export type InventoryTracking = {
  gid: number[]
  labelId: string
  parentIds: number[]
  childrenIds: number[]
  recycTypeId: string
  recycSubTypeId: string
  productTypeId: string
  productSubTypeId: string
  productSubTypeRemark: string
  productAddonTypeId: string
  productAddonTypeRemark: string
  packageTypeId: string
  weight: number
  unitId: string
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
  event: EventTrackingData[]
}

export interface ProcessInType {
  processTypeId: string;
  colId: number;
  warehouseId: number;
  address: string;
  status: 'CREATED' | string; 
  createdBy: string;
  updatedBy: string;
  processinDatetime: string;
  processinDetail: ProcessInDetailType[];
}

export interface ProcessInDetailType {
  itemId: number;
  recycTypeId: string;
  recycSubTypeId: string;
  productTypeId: string;
  productSubTypeId: string;
  productSubTypeRemark: string;
  productAddonTypeId: string;
  productAddonTypeRemark: string;
  packageTypeId: string;
  weight: number;
  unitId: string;
  createdBy: string;
  updatedBy: string;
  processinDetailPhoto: ProcessDetailPhotoType[];
}

export interface ProcessOutType {
  status: 'CREATED' | string;
  processInId: number;
  processOutDatetime: string; // ISO date string
  createdBy: string;
  updatedBy: string;
  processoutDetail: ProcessOutDetailType[];
}

export interface ProcessOutDetailType {
  recycTypeId: string;
  recycSubTypeId: string;
  productTypeId: string;
  productSubTypeId: string;
  productSubTypeRemark: string;
  productAddonTypeId: string;
  productAddonTypeRemark: string;
  packageTypeId: string;
  weight: number;
  unitId: string;
  status: 'ACTIVE' | string;
  processoutDetailPhoto: ProcessDetailPhotoType[];
  itemId: number | null;
  createdBy: string;
  updatedBy: string;
}

export interface ProcessDetailPhotoType {
  sid: number;
  photo: string;
}