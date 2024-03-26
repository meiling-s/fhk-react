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
}

// export type CreateContract = {
//     vehicleTypeId: string
//     vehicleName: string
//     plateNo: string
//     serviceType: string
//     photo: string[]
//     status: string
//     createdBy: string
//     updatedBy: string
// }