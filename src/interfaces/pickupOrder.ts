
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
    id:number;
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
    建立日期: string;
    物流公司: string;
    运单编号: number;
    送货日期: string;
    寄件公司: string;
    收件公司: string;
    状态: string;
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
    createPicoDetail: CreatePicoDetail[]
    
}

export interface PoStatus {
    status:    string;
    reason:    string;
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

