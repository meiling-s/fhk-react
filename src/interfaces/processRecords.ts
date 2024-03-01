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
  }
  
  export type CreateRecyclable = {
    itemId: number
    recycTypeId: string
    recycSubTypeId: string
    packageTypeId: string
    weight: number
    unitId: string
    processoutDetailPhoto: processOutImage[]
    createdBy: string
    updatedBy: string
  }
  
  