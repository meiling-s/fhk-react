import { gpsCode } from "./dataFormat";

export type CheckinHeader = {
  chkInId: number;
  logisticName: string;
  logisticId: string;
  vehicleTypeId: string;
  plateNo: string;
  senderName: string;
  senderId: string;
  senderAddr: string;
  senderAddrGps: gpsCode;
  warehouseId: number;
  colId: number;
  status: string;
  reason: string[];
  picoId: string;
  signature: string;
  normalFlg: boolean;
  adjustmentFlg: boolean,
  createdBy: string;
  updatedBy: string;
  checkinDetail: string[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export type PickupOrderHeader = {
  picoId: number,
  picoType: string,
  effFrmDate: string,
  effToDate: string,
  routineType: string,
  routine: string[],
  logisticName: string;
  logisticId: string;
  vehicleTypeId: string;
  platNo: string;
  contactNo: string;
  status: string;
  reason: string;
  normalFlg: boolean;
  approvedAt: string;
  rejectedAt: string;
  approvedBy: string;
  rejectedBy: string;
  contractNo: string;
  createdBy: string;
  updatedBy: string;
  pickupOrderDetail: string[];
  updatedAt: string;
  createdAt: string;
  version: number;
}

export type PickupOrderDetail = {
  picoDtlId: number;
  senderId: string;
  senderName: string;
  senderAddr: string;
  senderAddrGps: gpsCode;
  receiverId: string;
  receiverAddr: string;
  receiverAddrGps: gpsCode;
  pickupAt: string;
  status: string;
  createdBy: string;
  updatedBy: string;
  items: string[];
  pickupOrderHeader: PickupOrderHeader[];
  updatedAt: string;
  createdAt: string;
  version: number;
}

export type Items = {
  itemId: number;
  recycType: string;
  recycSubType: string;
  weight: number;
  pickupOrderHistory: string;
  pickupOrderDetail: PickupOrderDetail[];
  updatedAt: string;
  createdAt: string;
  version: number;
}

export type PickupOrderHistory = {
  picoHisId: number;
  picoDtlId: number;
  senderId: string;
  senderName: string;
  senderAddr: string;
  senderAddrGps: gpsCode;
  receiverId: string;
  receiverAddr: string;
  receiverAddrGps: gpsCode;
  pickupAt: string;
  status: string;
  items: Items[];
  checkInDetails: CheckinDetail[];
}

export type CheckinDetailPhoto = {
    sid: number;
    photo: string;
    checkinDetail: string;
  }
  
export  type CheckinDetail = {
    chkInDtlId: number;
    recycTypeId: string;
    recycSubTypeId: string;
    productAddonTypeId: string;
    productAddonTypeRemark: string;
    productSubTypeId: string;
    productSubTypeRemark: string;
    productTypeId: string;
    packageTypeId: string;
    weight: number;
    unitId: string;
    itemId: string;
    createdBy: string;
    updatedBy: string;
    checkinHeader: CheckinHeader[];
    checkinDetailPhoto: CheckinDetailPhoto[];
    pickupOrderHistory: PickupOrderHistory[];
  }
  
export type CheckIn = {
    chkInId: number;
    logisticName: string;
    logisticId: string;
    vehicleTypeId: string;
    plateNo: string;
    senderName: string;
    senderId: string;
    senderAddr: string;
    senderAddrGps: gpsCode;
    warehouseId: number;
    colId: number;
    status: string;
    reason: string[];
    picoId: string;
    signature: string;
    normalFlg: boolean;
    adjustmentFlg: boolean,
    createdBy: string;
    updatedBy: string;
    checkinDetail: CheckinDetail[];
    createdAt: string;
    updatedAt: string;
    recipientCompany?: string;
    deliveryAddress?: string;
    version: number;
  }
  
  export type queryCheckIn = {
    picoId: string, 
    senderName: string
    senderAddr: string
  }
  

