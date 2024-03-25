
export interface PickupOrderDetail {
    picoDtlId:       number;
    picoHisId:       string | null;
    senderId:        string;
    senderName:      string;
    senderAddr:      string;
    senderAddrGps:   number[];
    receiverId:      string;
    receiverName:    string;
    receiverAddr:    string;
    receiverAddrGps: number[];
    pickupAt:        string;
    status:          string;
    createdBy:       string;
    updatedBy:       string;
    updatedAt:       string;
    createdAt:       string;
    version:         number;
    recycType:    string;
    recycSubType: string;
    weight:       number;
}

export interface PickupOrder {
    tenantId:         string;
    picoId:            string;
    picoType:          string;
    effFrmDate:        string;
    effToDate:         string;
    routineType:       string;
    routine:           string[];
    logisticId:        string;
    logisticName:      string;
    vehicleTypeId:     string;
    platNo:            string;
    contactNo:         string;
    status:            string;
    reason:            string;
    normalFlg:         boolean;
    approvedAt:        string;
    rejectedAt:        string;
    approvedBy:        string;
    rejectedBy:        string;
    contractNo:        string;
    createdBy:         string;
    updatedBy:         string;
    createdAt:         string;
    refPicoId:         string;
    pickupOrderDetail: PickupOrderDetail[];
}

export interface PickupOrderItem {
    itemId:       number;
    recycType:    string;
    recycSubType: string;
    weight:       number;
    updatedAt:    string;
    createdAt:    string;
    version:      number;
}


export interface CreatePO {
    tenantId:         string;
    picoType:         string;
    effFrmDate:       string;
    effToDate:        string;
    routineType:      string;
    routine:          string[];
    logisticId:       string;
    logisticName:     string;
    vehicleTypeId:    string;
    platNo:           string;
    contactNo:        string;
    status:           string;
    reason:           string;
    normalFlg:        boolean;
    contractNo:       string;
    createdBy:        string;
    updatedBy:        string;
    createPicoDetail: CreatePicoDetail[];
}

export interface CreatePicoDetail {
    picoDtlId?:      number,
    id?:             any;
    picoHisId:       string | null;
    senderId:        string;
    senderName:      string;
    senderAddr:      string;
    senderAddrGps:   number[];
    receiverId:      string;
    receiverName:    string;
    receiverAddr:    string;
    receiverAddrGps: number[];
    status:          string;
    createdBy:       string;
    updatedBy:       string;
    pickupAt:        string;
    recycType:    string;
    recycSubType: string;
    weight:       number;
    
}

export interface Item {
    recycType:    string;
    recycSubType: string;
    weight:       number;

}

export interface PicoDetail {
    recycType:    string;
    recycSubType: string;
    weight:       number;
    picoHistory:  null;
}

export interface Row {
    id: number;
    tenantId: string;
    createdAt: string;
    logisticCompany: string;
    picoId: number;
    deliveryDate: string;
    senderCompany: string;
    receiver: string;
    status: string;
  }

  export interface EditPo {
    tenantId:      string;
    picoType:      string;
    effFrmDate:    string;
    effToDate:     string;
    routineType:   string;
    routine:       string[];
    logisticId:    string;
    logisticName:  string;
    vehicleTypeId: string;
    platNo:        string;
    contactNo:     string;
    status:        string;
    reason:        string;
    normalFlg:     boolean;
    approvedAt:    string;
    rejectedAt:    string;
    approvedBy:    string;
    rejectedBy:    string;
    contractNo:    string;
    updatedBy:     string;
    refPicoId:     string ;
    createPicoDetail: CreatePicoDetail[]
    
}

export interface PoStatus {
    status:    string;
    reason:    string;
    updatedBy: string;
}

export interface PoDtlStatus {
    status:    string;
    updatedBy: string;
}


export interface PicoRefrenceList {
    type: string;
    picoId: string;
    status: string;
    effFrmDate: string;
    effToDate:string
    routine: string;
    senderName: string;
    receiver: string;
    pickupOrderDetail: PickupOrderDetail;
}

export type queryPickupOrder = {
    picoId: string;
    effFromDate: string;
    effToDate: string;
    logisticName: string;
    recycType: string;
    receiverAddr: string;
    status: number
  }