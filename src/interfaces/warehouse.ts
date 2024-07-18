export type updateStatus = {
    status: string,
    reason: string[],
    updatedBy: string
}

export type CheckInWarehouse = {
    checkInWeight: number,
    checkInUnitId: number,
    checkInAt: string,
    checkInBy: string,
    updatedBy: string
}

export type CheckOutWarehouse = {
    checkOutWeight: number,
    checkOutUnitId: number,
    checkOutAt: string,
    checkOutBy: string,
    updatedBy: string
}

export type CheckInOutWarehouse = {
    id: number
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