export type formValidate = {
    field: string,
    problem: string,
    type: string,
    dataTestId?: string,
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
    recycSubType: Array<recycSubType>,
    description: string,
    remark: string,
    status: string,
    createdAt: string,
    createdBy: string,
    updatedAt: string,
    updatedBy: string,
    backgroundColor?: string
}

export type recycSubType = {
    recycSubTypeId: string,
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

export type logisticList = {
    logisticId:       string;
    logisticNameTchi: string;
    logisticNameSchi: string;
    logisticNameEng:  string;
    brNo:             string;
    description:      string;
    remark:           string;
    status:           string;
    createdBy:        string;
    updatedBy:        string;
    createdAt:        string;
    updatedAt:        string;
}
export type manuList = {
    manufacturerId:       string;
    manufacturerNameTchi: string;
    manufacturerNameSchi: string;
    manufacturerNameEng:  string;
    brNo:                 string;
    description:          string;
    remark:               string;
    status:               string;
    createdBy:            string;
    updatedBy:            string;
    createdAt:            string;
    updatedAt:            string;
}

export type collectorList = {
    collectorId:       string;
    collectorNameTchi: string;
    collectorNameSchi: string;
    collectorNameEng:  string;
    brNo:              string;
    description:       string;
    remark:            string;
    status:            string;
    createdBy:         string;
    updatedBy:         string;
    createdAt:         string;
    updatedAt:         string;
}

export type customerList = {
    customerId:       string;
    customerNameTchi: string;
    customerNameSchi: string;
    customerNameEng:  string;
    brNo:              string;
    description:       string;
    remark:            string;
    status:            string;
    createdBy:         string;
    updatedBy:         string;
    createdAt:         string;
    updatedAt:         string;
}


export type picoRoutine = {
    routineType: string,
    routineContent: string[]
}

export type vehicleType = {
    vehicleTypeId:       string;
    vehicleTypeNameTchi: string;
    vehicleTypeNameSchi: string;
    vehicleTypeNameEng:  string;
    description:         string;
    remark:              string;
    status:              string;
    createdBy:           string;
    updatedBy:           string;
    createdAt:           string;
    updatedAt:           string;
}

export type ProcessType = {
    
    processTypeId:string
    processTypeNameTchi: string
    processTypeNameSchi: string
    processTypeNameEng: string
    processTypeLimit: number
    description: string
    remark: string
    status: string
    createdBy:string
    updatedBy: string
    createdAt: string
    updatedAt: string    
}

export type itemList = {
    bgColor: string
    borderColor: string
}

export type weightUnit = {
    unitId: number
    unitNameEng: string
    unitNameSchi: string
    unitNameTchi: string
    receiverName: string
    weight: number
    description: true
}

export type errorState = {
    code: number,
    message: string
}

export type StaffTitle = {
    createdAt: string
    createdBy: string
    description: string
    titleName: string
    duty: string[]
    remark: string
    status: string
    titleId: string
    titleNameEng: string
    titleNameSchi: string
    titleNameTchi: string
    updatedAt: string
}

export type UserActivity = {
    operation: string
    ip: string
    createdBy: string
    updatedBy: string
}

export type Company =  {
    id?: number
    nameEng?: string
    nameSchi?: string
    nameTchi?: string
}

export type PackagingList = {
    packagingTypeId: string,
    tenantId: string,
    packagingNameTchi: string,
    packagingNameSchi: string,
    packagingNameEng: string,
    description: string,
    remark: string,
    status: string,
    createdBy: string,
    updatedBy: string,
    createdAt: string,
    updatedAt: string
}