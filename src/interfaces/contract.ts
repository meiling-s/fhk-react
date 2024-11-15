export type Contract = {
    id: number
    contractNo: string
    tenantId: string
    contractFrmDate: string
    contractToDate: string
    epdFlg: boolean
    remark: string
    parentContractNo: string
    status: string
    createdBy: string
    updatedBy: string
    createdAt: string
    updatedAt: string
    version?: number
}

export type CreateContract = {
    tenantId: string
    contractNo: string
    parentContractNo: string
    status: string
    contractFrmDate: string
    contractToDate: string
    remark: string
    epdFlg: boolean
    createdBy: string
    updatedBy: string
    version?: number
}