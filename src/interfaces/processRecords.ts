export type processOutImage = {
    sid: number
    photo: string
  }
  
  export type ProcessOutItem = {
    processOutDtlId: number
    recycTypeId: string
    recycSubTypeId: string
    packageTypeId: string
    weight: number
    unitId: string
    processoutDetailPhoto: processOutImage[]
    itemId: number
    createdBy: string
    updatedBy: string
    version: number
  }
  
  export type ProcessOut = {
    processOutId: number
    status: string
    processInId: number
    createdBy: string
    updatedBy: string
    processoutDetail: ProcessOutItem[]
    createdAt: string
    updatedAt: string
    address: string
    packageTypeId: string
    packageName: string
    labelId?: string
    version: number
  }
  
  export type CreateRecyclable = {
    itemId: number
    recycTypeId: string
    recycSubTypeId: string
    productTypeId: string,
    productSubTypeId: string,
    productSubTypeRemark: string,
    productAddonTypeId: string,
    productAddonTypeRemark: string,
    packageTypeId: string,
    weight: number
    status: string
    unitId: string
    processoutDetailPhoto: processOutImage[]
    createdBy: string
    updatedBy: string
    version?: number
  }

  export type queryProcessRecord = {
    processOutId: number | null;
    processType: string;
    processAddress: string;
  }