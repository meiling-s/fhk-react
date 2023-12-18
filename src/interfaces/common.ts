export type formValidate = {
    field: string,
    problem: string,
    type: string
}

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
    map(arg0: (e: recycSubType) => void): unknown
    recycTypeId: string,
    recyclableNameEng: string,
    recyclableNameSchi: string,
    recyclableNameTchi: string,
    recycSubtype: Array<recycSubType>,
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
    createdBy: string,
    updatedBy: string
}

export type contract = {
    contractNo: string,
    contractFrmDate: string,
    contractToDate: string,
    parentContractNo: string,
    epdFlg: boolean,
    remark: string,
    status: string,
    createdBy: string,
    createdAt: string,
    updatedBy: string,
    updatedAt: string
}

export type routine = {
    colId: string,
    colPtRoutine: colPtRoutine,
    status: string,
    createdBy: string,
    updatedBy: string
}

export type routineContent = {
    id: string,
    startTime: string[],
    endTime: string[]
}

export type colPtRoutine = {
    routineType: string,
    routineContent: routineContent[]
}

export type picoRoutine = {
    routineType: string,
    routineContent: string[]
}