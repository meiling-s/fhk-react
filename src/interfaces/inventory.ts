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
}

export type InventoryQuery = {
  labelId: string | null
  warehouseId: number | null
  recycTypeId: string
  recycSubTypeId: string
  idleDays: number | null,
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