export type PackagingUnit = {
    id: number,
    description: string,
    packagingNameEng: string,
    packagingNameSchi: string,
    packagingNameTchi: string,
    packagingTypeId: string,
    remark: string,
    status: string,
    tenantId: string,
    createdBy: string,
    updatedBy: string,
    createdAt: string,
    updatedAt: string,
}

export type CreatePackagingUnit = {
    tenantId: string,
    packagingTypeId?: string,
    packagingNameTchi: string,
    packagingNameSchi: string,
    packagingNameEng: string,
    description: string,
    remark: string,
    status: string,
    createdBy: string,
    updatedBy: string
}