export interface PickupOrder {
  //picoId:            number;
  tenantId: number
  picoType: string
  effFrmDate: Date
  effToDate: Date
  routineType: string
  routine: string[]
  logisticId: string
  logisticName: string
  vehicleTypeId: string
  platNo: string
  contactNo: string
  status: string
  reason: string
  normalFlg: boolean
  contractNo: string
  createdBy: string
  updatedBy: string
  createPicoDetail: CreatePicoDetail[]
}

export interface CreatePicoDetail {
  //   picoDtlId: number
  senderId: string
  senderName: string
  senderAddr: string
  senderAddrGps: number[]
  receiverId: string
  receiverName: string
  receiverAddr: string
  receiverAddrGps: number[]
  pickupAt: Date
  status: string
  createdBy: string
  updatedBy: string
  item: Item[]
}

export interface Item {
  recycType: string
  recycSubType: string
  weight: number
  picoHisId: number
}


// {
//   "tenantId": 0,
//   "picoType": "AD_HOC",
//   "effFrmDate": "2023-12-26",
//   "effToDate": "2023-12-26",
//   "routineType": "daily",
//   "routine": [
//     "string"
//   ],
//   "logisticId": "string",
//   "logisticName": "string",
//   "vehicleTypeId": "string",
//   "platNo": "string",
//   "contactNo": "string",
//   "status": "CREATED",
//   "reason": "string",
//   "normalFlg": true,
//   "contractNo": "string",
//   "createdBy": "string",
//   "updatedBy": "string",
//   "createPicoDetail": [
//     {
//       "senderId": "string",
//       "senderName": "string",
//       "senderAddr": "string",
//       "senderAddrGps": [
//         0
//       ],
//       "receiverId": "string",
//       "receiverName": "string",
//       "receiverAddr": "string",
//       "receiverAddrGps": [
//         0
//       ],
//       "pickupAt": "23:59:59",
//       "status": "CREATED",
//       "createdBy": "string",
//       "updatedBy": "string",
//       "item": {
//         "recycType": "string",
//         "recycSubType": "string",
//         "weight": 0,
//         "picoHisId": 0
//       }
//     }
//   ]
// }