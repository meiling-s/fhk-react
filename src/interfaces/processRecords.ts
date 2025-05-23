export type processOutImage = {
    sid: number
    photo: string
  }
  
  export type ProcessOutItem = {
    status: string | undefined
    productTypeId: any
    productAddonTypeId: any
    productAddonTypeRemark: any
    productSubTypeId: any
    productSubTypeRemark: any
    processOutDtlId: number
    recycTypeId: string
    recycSubTypeId: string
    packageTypeId: string
    weight: number
    unitId: string
    processoutDetailPhoto: processOutImage[]
    itemId: number
    itemType: 'GENERAL' | 'LEFTOVER' | 'WASTE' | string
    createdBy: string
    updatedBy: string
    version: number
  }

  export type ProcessInItem = {
    status: string | undefined
    productTypeId: any
    productAddonTypeId: any
    productAddonTypeRemark: any
    productSubTypeId: any
    productSubTypeRemark: any
    processInDtlId: number
    recycTypeId: string
    recycSubTypeId: string
    packageTypeId: string
    weight: number
    unitId: string
    processinDetailPhoto: processOutImage[]
    itemId: number
    itemType: 'GENERAL' | 'LEFTOVER' | 'WASTE' | string
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
    itemType: 'GENERAL' | 'LEFTOVER' | 'WASTE' | string
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