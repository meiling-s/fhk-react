export type UserGroup = {
    groupId: number,
    tenantId: string,
    roleName: string,
    status: string,
    createdBy: string,
    updatedBy: string,
    updatedAt: string,
    createdAt: string,
    version: number
}

export type UserAccount = {
    loginId: string,
    tenantId: string,
    realm: string,
    password: string,
    staffId: string,
    userGroup: UserGroup,
    status: string,
    lastLoginDatetime: string,
    createdBy: string,
    updatedBy: string,
    updatedAt: string,
    createdAt: string
}

export type CreateUserAccount = {
    loginId: string
    realm: string
    tenantId: string
    staffId: string
    groupId: number
    status: string,
    createdBy: string
    updatedBy: string
    firstName: string
    lastName: string
    sex: string
    email: string
    role: string[]
    phoneNumber: string,
    actions: string[]
}