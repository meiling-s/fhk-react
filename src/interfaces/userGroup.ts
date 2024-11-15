export type UserGroup = {
    groupId: number
    tenantId: string
    roleName: string
    description: string
    status: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    userAccount: object[]
    functions: Functions[]
    isAdmin: boolean
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
    description: string
    functions: number[]
    createdBy: string
    status: string
    isAdmin: boolean
}

export type EditUserGroupProps = {
    roleName: string
    description: string
    functions: number[]
    updatedBy: string
    status: string
    isAdmin: boolean
}

export type DeleteUserGroupProps = {
    updatedBy: string
    status: string
}