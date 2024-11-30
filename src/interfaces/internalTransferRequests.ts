import { gpsCode } from "./dataFormat";

export type InternalTransfer = {
  id: number
  toWarehouseId: number
  tenantId: string
  createdBy: string
  createdAt: string
  itemId: number
  gidLabel: string
  recycTypeId: string
  recycSubTypeId: string
  productTypeId: string
  productSubTypeId: string
  productSubTypeRemark: string
  productAddonTypeId: string
  productAddonTypeRemark:string
  packageTypeId: string
  weight: number
  unitId: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  warehouseId: number
  reason: string
  remark: string
}

export type InternalTransferName = {
  id: number
  createdAt: string
  itemType: string
  mainCategory: string
  subCategory: string
  addonCategory: string
  package: string
  senderWarehouse: string
  toWarehouse: string
  weight: number
  detail?: InternalTransfer
}
  
export type queryInternalTransfer = {
  recycTypeId?: string, 
  recycSubTypeId?: string
}
  

