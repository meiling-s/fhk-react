import { gpsCode } from "./dataFormat";

export type CheckinDetailPhoto = {
    sid: number;
    photo: string;
  }
  
export  type CheckinDetail = {
    chkInDtlId: number;
    recycTypeId: string;
    recycSubtypeId: string;
    packageTypeId: string;
    weight: number;
    unitId: string;
    itemId: string;
    checkinDetailPhoto: CheckinDetailPhoto[];
    createdBy: string;
    updatedBy: string;
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
  }
  

