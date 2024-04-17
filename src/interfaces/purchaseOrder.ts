export type PurchaseOrderDetail = {
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
  weight: number
  createdBy: string
  updatedBy: string
}

export type PurChaseOrder = {
  poId: string
  picoId: string
  cusTenantId: string
  receiverAddr: string
  receiverAddrGps: [0]
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
}

export type queryPurchaseOrder = {
  poId: string
  fromCreatedAt: string
  toCreatedAt: string
  receiverAddr: string
  recycType: string
  status: string
}
