export type InventoryDetail = {
  itemDtlId: number
  sourcePicoId: string
  sourcePicoDtlId: number
}

export type InventoryItem = {
  itemId: number
  labelId: string
  warehouseId: number
  recyclingNumber?: string
  recycTypeId: string
  recycSubTypeId: string
  recyName: string
  subName: string
  packageTypeId: string
  weight: number
  unitId: string
  status: string
  createdBy: string
  updatedBy: string
  inventoryDetail: InventoryDetail[]
  createdAt: string
  updatedAt: string
  location: string
  packageName?: string,
}

export type InventoryQuery = {
  labelId: string | null
  warehouseId: number | null
  recycTypeId: string
  recycSubTypeId: string
  idleDays: number | null,
}
