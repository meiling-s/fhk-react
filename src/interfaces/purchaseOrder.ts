export type PurchaseOrderDetail = {
  id?: string | number, // => FE Data
  itemCategory?: string, // => FE Data

  poDtlId: number
  recycTypeId: string
  recyclableNameTchi: string
  recyclableNameSchi: string
  recyclableNameEng: string
  recycSubTypeId: string
  recyclableSubNameTchi: string
  recyclableSubNameSchi: string
  recyclableSubNameEng: string
  unitId: number
  unitNameTchi: string
  unitNameSchi: string
  unitNameEng: string
  weight: string,
  pickupAt: string
  status: any
  receiverAddr: string
  receiverAddrGps: number[]
  createdBy: string
  updatedBy: string
  version?: number
  productType: string // => id
  productNameTchi: string
  productNameSchi: string
  productNameEng: string
  productSubType: string // => id
  productSubNameTchi: string
  productSubNameSchi: string
  productSubNameEng: string
  productAddonType: string // => id
  productAddonNameTchi: string
  productAddonNameSchi: string
  productAddonNameEng: string
  productSubTypeRemark: string
  productAddonTypeRemark: string
  productSubTypeId?: string
  productAddonTypeId?: string
  productTypeId?: string
}

export type PurChaseOrder = {
  poId: string
  picoId: string
  cusTenantId?: string
  sellerTenantId: string
  senderAddr: string
  senderAddrGps: [0]
  senderName: string
  receiverName: string
  contactName: string
  contactNo: string
  paymentType: string
  status: string
  approvedAt: string
  rejectedAt: string
  approvedBy: string
  rejectedBy: string
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
  purchaseOrderDetail: PurchaseOrderDetail[]
  version?: number,
}

export type queryPurchaseOrder = {
  poId: string
  fromCreatedAt: string
  toCreatedAt: string
  receiverAddr: string
  recycType: string
  status: string
}

export type Row = {
  id: number
  createdAt: string
  poId: string
  picoId: string
  receiverAddr: string
  approvedAt: string
  status: string
  recyType: string
}

export type CreatePurchaseOrderDetail = {
  poDtlId?: string,
  index?: number,
  poId: string,
  recycTypeId: string,
  recycSubTypeId: string,
  weight: number,
  createdBy: string,
  updatedBy: string
}

export type CreatePurchaseOrder = {
  picoId: string,
  receiverAddr: string,
  receiverAddrGps: [0],
  sellerTenantId: string,
  senderAddr: string,
  senderAddrGps: [0],
  senderName: string,
  receiverName: string,
  contactName: string,
  contactNo: string,
  paymentType: string,
  status: string,
  approvedAt: string,
  rejectedAt: string,
  approvedBy: string,
  rejectedBy: string,
  createdBy: string,
  updatedBy: string,
  purchaseOrderDetail: CreatePurchaseOrderDetail[]
}

export interface PaymentType {
  paymentNameTchi: string
  paymentNameSchi: string
  paymentNameEng: string,
  value: string
}
