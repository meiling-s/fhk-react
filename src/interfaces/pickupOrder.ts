
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
    checkInWeight?: number | null,
    checkInUnitId?: number | null,
    checkInAt?: string | null,
    checkInBy?: string | null,
    checkInByNameEng?: string | null,
    checkInByNameSchi?: string | null,
    checkInByNameTchi?: string | null,
    checkOutWeight?: number | null,
    checkOutUnitId?: number | null,
    checkOutAt?: string | null,
    checkOutBy?: string | null,
    checkOutByNameEng?: string | null,
    checkOutByNameSchi?: string | null,
    checkOutByNameTchi?: string | null,
}

export interface PickupOrder {
    id(id: any): unknown;
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
    updatedAt:         string;
    createdAt:         string;
    refPicoId:         string;
    pickupOrderDetail: PickupOrderDetail[];
    version?: number;
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
    recycType?:    string;
    recycSubType?: string;
    weight:       string;
    itemCategory?: string;
    version?: number;
    addon?: string;
    productType?: string;
    productSubType?: string;
    productAddon?: string;
    productSubtypeRemark?: string;
    productAddonRemark?: string
    
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
    updatePicoDetail: CreatePicoDetail[]
    version?: number;
    
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
    senderName: string;
    status: number | null
  }

export interface OrderJobHeader {
    picoId: string;
    receiverName: string;
    effFrmDate: string;
    effToDate: string;
    setupDate: string;
}

export interface AssignJobDriver {
    joId: number,
    picoId: string;
    picoDtlId: number;
    plateNo: string;
    senderId: string;
    senderName: string;
    senderAddr: string
    senderAddrGps: number[];
    receiverId: string;
    receiverName: string;
    receiverAddr: string;
    receiverAddrGps: number[];
    recycType: string;
    recycSubType: string;
    weight: number;
    vehicleId: number;
    driverId: string;
    contractNo: string;
    pickupAt: string;
    createdBy: string;
    effFrmDate:  string,
    effToDate:  string,
    status: string,
    updatedBy: string
}

export interface AssignJobField {
    plateNo: string;
    driverId: string;
    vehicleId: number
}

export interface RejectJobDriver {
    status: string;
    reason: string[];
    updatedBy: string;
}    
export interface GetDriver {
    page: number;
    size: number;
    sort: string[];
}

export interface DriverList {
    driverId: string;
    driverNameEng: string
    driverNameSchi: string
    driverNameTchi: string
}

export interface VehicleList {
    vehicleId: number;
    plateNo: string
}