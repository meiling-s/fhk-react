export interface PickupOrder {
    picoId:            number;
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
    approvedAt:        Date;
    rejectedAt:        Date;
    approvedBy:        string;
    rejectedBy:        string;
    contractNo:        string;
    createdBy:         string;
    updatedBy:         string;
    pickupOrderDetail: PickupOrderDetail[];
}

export interface PickupOrderDetail {
    picoDtlId:       number;
    senderId:        string;
    senderName:      string;
    senderAddr:      string;
    senderAddrGps:   number[];
    receiverId:      string;
    receiverName:    string;
    receiverAddr:    string;
    receiverAddrGps: number[];
    pickupAt:        Date;
    status:          string;
    createdBy:       string;
    updatedBy:       string;
    updatedAt:       Date;
    createdAt:       Date;
    version:         number;
}



export interface CreatePO {
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
    items:           Item;
}

export interface Item {
    recycType:    string;
    recycSubType: string;
    weight:       number;
    picoHisId:    number;
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
    
}
