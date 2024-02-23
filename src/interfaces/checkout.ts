import { gpsCode } from './dataFormat'
// export type CheckOut = {
//   id: number
//   chkOutId: number
//   createdAt: string
//   vehicleTypeId: string
//   receiverName: string
//   picoId: string
//   adjustmentFlg: boolean
//   logisticName: string
//   receiverAddr: string
//   receiverAddrGps: string
// }

export type CheckoutDetailPhoto = {
  sid: number
  photo: string
}

export type CheckoutDetail = {
  chkOutDtlId: number
  recycTypeId: string
  recycSubtypeId: string
  packageTypeId: string
  weight: number
  unitId: string
  itemId: string
  createdBy: string
  updatedBy: string
  checkoutDetailPhoto: CheckoutDetailPhoto[]
  pickupOrderHistory: [] | null
}

export type CheckOut = {
  chkOutId: number
  logisticName: string
  logisticId: string
  vehicleTypeId: string
  plateNo: string
  receiverName: string
  receiverId: string
  receiverAddr: string
  receiverAddrGps: gpsCode
  warehouseId: number
  colId: number
  collectorId: number
  status: string
  reason: string[]
  picoId: string
  signature: string
  normalFlg: boolean
  adjustmentFlg: boolean
  createdBy: string
  updatedBy: string
  checkoutDetail: CheckoutDetail[]
  createdAt: string
  updatedAt: string
}

export type queryCheckout = {
  picoId: string, 
  receiverName: string,
  receiverAddr: string

}
