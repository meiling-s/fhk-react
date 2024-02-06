export type InventoryDetail = {
    itemDtlId: number
    sourcePicoId: string
    sourcePicoDtlId: number
}

export type InventoryItem = {
    itemId: number
    warehouseId: number
    recycTypeId: string
    recycSubTypeId: string
    packageTypeId: string
    weight: number
    unitId: string
    status: string
    createdBy: string
    updatedBy: string
    inventoryDetail: InventoryDetail[],
    createdAt: string
    updatedAt: string
    location: string
}