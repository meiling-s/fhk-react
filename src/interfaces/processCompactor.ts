export type ProcessOutItem = {
  id: number
  warehouseId: 0
  recycTypeId: string
  recycSubTypeId: string
  productTypeId: string
  productSubTypeId: string
  productSubTypeRemark: string
  productAddonTypeId: string
  productAddonTypeRemark: string
  packageTypeId: string
  unitId: string,
  weight: number
  photos: string[]
}

export type CompactorProcessOut = {
  chkInIds: number[]
  inItemId: number[]
  items: ProcessOutItem[]
  createdBy: string
  remarks: string
  processInDatetime: string
  processOutDatetime: string
}
