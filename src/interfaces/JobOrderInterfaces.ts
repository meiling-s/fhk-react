export interface JobListOrder {
    id:                string,
    joId:              string;
    picoId:            string;
    picoDtlId:         number;
    plateNo:           string;
    senderId:          string,
    senderName:        string,
    senderAddr:        string,
    senderAddrGps:     Number[],
    receiverId:        string,
    receiverName:      string,
    receiverAddr:      string,
    receiverAddrGps:   Number[],
    recycType:         string,
    recycSubType:      string,
    weight:            Number,
    vehicleId:         Number,
    driverId:          string,
    contractNo:        string,
    pickupAt:          string,
    status:            string,
    reason:            string[],
    createdBy:         string,
    createdAt:         string,
    updatedBy:         string,
    updatedAt:         string
  }
  
  export type JoStatus =  {
    status:    string;
    reason:    string[];
    updatedBy: string;
  }
  
  export type queryJobOrder = {
    id: string,
    joId: string,
    picoId: string,
    driverId: string,
    senderName: string,
    receiverName: string,
    status: string
  }
  export interface Row {
    id: string;
    joId: string;
    picoId: string;
    picoDtlId: number;
    labelId?: string;
    createdAt: string;
    driverId: string;
    plateNo: string;
    senderName: string;
    receiverName: string;
    status: string;
    receiverId?: string ;
    senderId?: string;
  }
  
  export interface DriverDetail {
    driverId: string;
    photo: string[];
    driverNameTchi: string,
    driverNameSchi: string,
    driverNameEng: string,
  }