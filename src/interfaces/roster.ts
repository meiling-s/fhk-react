import { gpsCode } from './dataFormat'

export type Staff = {
  staffId: string
  tenantId: string
  staffNameTchi: string
  staffNameSchi: string
  staffNameEng: string
  titleId: string
  contactNo: string
  loginId: string
  status: string
  gender: string
  email: string
  salutation: string
  createdBy: string
  updatedBy: string
  updatedAt: string
  createdAt: string
  version: number
  lang: string
  title: string
}

export type CollectionPoint = {
  colId: number
  tenantId: string
  colName: string
  colPointTypeId: string
  effFrmDate: string
  effToDate: string
  address: string
  gpsCode: gpsCode
  epdFlg: boolean
  extraServiceFlg: boolean
  siteTypeId: string
  contractNo: string
  noOfStaff: string
  status: string
  premiseName: string
  premiseTypeId: string
  premiseRemark: string
  normalFlg: true
  createdBy: string
  updatedBy: string
  routineType: string
  updatedAt: string
  createdAt: string
  version: number
}

export type Roster = {
  rosterId: number
  tenantId: string
  routineType: string
  startAt: string
  endAt: string
  status: string
  reason: string
  createdBy: string
  updatedBy: string
  staff: Staff[]
  collectionPoint: CollectionPoint
}

export type GroupedRoster = {
  collectionId: number
  collectionName: string
  roster: Roster[]
  //   collectionPoint: CollectionPoint
}
