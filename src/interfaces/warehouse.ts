export type updateStatus = {
    status: string,
    reason: string[],
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