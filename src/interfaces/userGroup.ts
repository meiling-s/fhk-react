export type UserGroup = {
    groupId: number
    tenantId: string
    roleName: string
    status: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    userAccount: object[]
    functions: Functions[]
}

export type Functions = {
    functionId: number
    functionNameTChi: string
    functionNameSChi: string
    functionNameEng: string
    tenantTypeId: string
    description: string
    hasReason: boolean
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
}

export type CreateUserGroupProps = {
    realm: string
    tenantId: string
    roleName: string
    functions: number[]
    createdBy: string
    status: string
}

export type EditUserGroupProps = {
    functions: number[]
    updatedBy: string
    status: string
}

export type DeleteUserGroupProps = {
    updatedBy: string
    status: string
}