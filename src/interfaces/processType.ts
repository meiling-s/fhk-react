export type ProcessTypeItem = {
    id: any
    processTypeId: any
}

export type CreateProcessTypeProps = {
    processTypeNameTchi: string,
    processTypeNameSchi: string,
    processTypeNameEng: string,
    processingTime: number,
    processingTimeUnit: string,
    processingWeightUnitId: number,
    description: string,
    remark: string,
    status: string
}

export type ProcessTypeData = {
    processTypeId: string
    processTypeNameTchi: string
    processTypeNameSchi: string
    processTypeNameEng: string
    processingTime: number
    processingTimeUnit: string
    processingWeightUnitId: number
    description: string
    remark: string
    status: string
    createdBy: string
    updatedBy: string
    createdAt: string
    updatedAt: string
    processingStructure?: string
    version: number
}