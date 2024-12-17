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
  gid: string,
  gidLabel: string
}

export type GIDItem = {
  labelId: string
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
  updatedBy: string
  createdBy: string
  createdAt: string
  updatedAt: string
  gid: number
  location?: string
  packageName?: string
}

export type InventoryQuery = {
  labelId: string | null
  warehouseId: number | null
  recycTypeId: string
  recycSubTypeId: string
  idleDays: number | null,
}

export type GIDQuery = {
  gid: '',
  warehouseId: null,
  recycTypeId: "",
  recycSubTypeId: "",
  idleDays: null,
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

export type ProcessOutData = {
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
  createdAt: string
  unitId: string
  eventType: string
}

export type ProcessingRecordData = {
  location_en: string
  location_sc: string
  location_tc: string
  record_date: string
  gid: number[],
  company_name_en: string
  company_name_sc: string
  company_name_tc: string
  addr_en: string
  addr_sc: string
  addr_tc: string
  total_weight: number,
  gidLabel: string,
  unitId: string,
  createdAt: string
}

export type CheckinData = {
  car_plate_no: string
  checkin_date_time: string
  driver_name_en: string
  driver_name_sc: string
  driver_name_tc: string
  from_addr_en: string
  from_addr_sc: string
  from_addr_tc: string
  pickup_date_time: string
  pico_id: string
  receiver_company_name_en: string
  receiver_company_name_sc: string
  receiver_company_name_tc: string
  sender_company_name_en: string
  sender_company_name_sc: string
  sender_company_name_tc: string
  to_addr_en: string
  to_addr_sc: string
  to_addr_tc: string
  total_weight: number
  unitId: string
  createdAt: string
  createdBy: string
}

export type InternalTransferData = {
  company_name_en: string
  company_name_sc: string
  company_name_tc: string
  from_addr_en: string
  from_addr_sc: string
  from_addr_tc: string
  from_location_en: string
  from_location_sc: string
  from_location_tc: string
  internal_transfer_request_id: number
  request_date_time: string
  tenant_id: number
  to_addr_en: string
  to_addr_sc: string
  to_addr_tc: string
  to_location_en: string
  to_location_sc: string
  to_location_tc: string
  username: string
  createdAt: string
}

export type StockAdjustmentData = {
  record_date: string
  company_name_en: string
  company_name_sc: string
  company_name_tc: string
  createdAt: string
  createdBy: string
  eventType: string
  location_en: string
  location_sc: string
  location_tc: string
  addr_en: string
  addr_sc: string
  addr_tc: string
}

export type EventTrackingData = {
  gidEventId: number
  tenantId: string
  eventType: string
  eventDetail: string
  details: ProcessOutData | ProcessingRecordData | CheckinData | StockAdjustmentData | InternalTransferData
  remarks: string | null
  createdBy: string
  createdAt: string
}

export type InventoryTracking = {
  gid: number[] | number
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

export interface GIDValue {
  gid: number;
  gidLabel: string;
}