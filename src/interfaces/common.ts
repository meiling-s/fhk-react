export type colPointType = {
    colPointTypeId: string,
    colPointTypeEng: string,
    colPointTypeSchi: string,
    colPointTypeTchi: string,
    remark: string,
    status: string,
    createdAt: string,
    createdBy: string,
    updatedAt: string,
    updatedBy: string
}

export type premiseType = {
    premiseTypeId: string,
    premiseTypeNameEng: string,
    premiseTypeNameSchi: string,
    premiseTypeNameTchi: string,
    registeredFlg: boolean,
    residentalFlg: boolean,
    remark: string,
    status: string,
    createdAt: string,
    createdBy: string,
    updatedAt: string,
    updatedBy: string
}

export type siteType = {
    siteTypeId: string,
    siteTypeNameEng: string,
    siteTypeNameSchi: string,
    siteTypeNameTchi: string,
    description: string,
    remark: string,
    status: string,
    createdAt: string,
    createdBy: string,
    updatedAt: string,
    updatedBy: string
}

export type recycType = {
    recycTypeId: string,
    recyclableNameEng: string,
    recyclableNameSchi: string,
    recyclableNameTchi: string,
    description: string,
    remark: string,
    status: string,
    createdAt: string,
    createdBy: string,
    updatedAt: string,
    updatedBy: string
}

export type recycSubType = {
    recycSubtypeId: string,
    recyclableNameEng: string,
    recyclableNameSchi: string,
    recyclableNameTchi: string,
    description: string,
    remark: string,
    status: string,
    createdAt: string,
    createdBy: string,
    updatedAt: string,
    updatedBy: string
}