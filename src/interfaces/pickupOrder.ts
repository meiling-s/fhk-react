export interface PickupOrder {
    picoId:            number;
    picoType:          string;
    effFrmDate:        Date;
    effToDate:         Date;
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