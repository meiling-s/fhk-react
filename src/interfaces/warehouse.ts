export type updateStatus = {
    status: string,
    reason: string[],
    updatedBy: string,
    version: number
}

export type CheckInWarehouse = {
    checkInWeight: number,
    checkInUnitId: number,
    checkInAt: string,
    checkInBy: string,
    updatedBy: string,
    version: number,
}

export type CheckOutWarehouse = {
    checkOutWeight: number,
    checkOutUnitId: number,
    checkOutAt: string,
    checkOutBy: string,
    updatedBy: string,
    version: number
}

export type CheckInOutWarehouse = {
    id: number
    chkInId: number | null
    chkOutId: number | null
    createdAt: string
    status: string
    senderName: string
    receiverName: string
    picoId: string
    adjustmentFlg: true
    logisticName: string
    senderAddr: string
    receiverAddr: string
}