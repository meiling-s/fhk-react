import dayjs from 'dayjs'
import { il_item } from '../components/FormComponents/CustomItemList'
import { colPtRoutine, routineContent } from './common'
import { gpsCode } from './dataFormat'

export type openingPeriod = {
  startDate: dayjs.Dayjs
  endDate: dayjs.Dayjs
}

export type timePeriod = {
  startFrom: dayjs.Dayjs
  endAt: dayjs.Dayjs
}

export type recyclable = {
  recycTypeId: string
  recycSubTypeId: string[]
}

export type singleRecyclable = {
  recycTypeId: string
  recycSubTypeId: string
}

export type roster = {
  rosterId: string
  routineType: string
  startAt: string
  endAt: string
  status: string
}

export type collectionPoint = {
  colId: string
  colName: string
  colPointTypeId: string
  effFrmDate: string
  effToDate: string
  routineType: string
  routine: routineContent[]
  address: string
  gpsCode: gpsCode
  epdFlg: boolean
  //extraServiceFlg: boolean
  serviceFlg: string
  siteTypeId: string
  contractNo: string
  noOfStaff: number
  status: string
  premiseName: string
  premiseTypeId: string
  premiseRemark: string
  normalFlg: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  roster: roster[]
  colPtRecyc: recyclable[]
  version: number
}

export type createCP = {
  //data for creating Collection Point
  tenantId: string
  colName: string
  colPointTypeId: string
  effFrmDate: String
  effToDate: String
  routine: colPtRoutine
  address: string
  gpsCode: gpsCode
  epdFlg: boolean
  //extraServiceFlg: boolean
  serviceFlg: string
  siteTypeId: string
  contractNo: string
  noOfStaff: number
  status: string
  premiseName: string
  premiseTypeId: string
  premiseRemark: string
  normalFlg: boolean
  colPtRecyc: recyclable[]
  roster: roster[]
  createdBy: string
  updatedBy: string
}

export type updateCP = {
  //data for creating Collection Point

  colPointTypeId: string
  effFrmDate: String
  effToDate: String
  routine: colPtRoutine
  address: string
  gpsCode: gpsCode
  epdFlg: boolean
  //extraServiceFlg: boolean
  serviceFlg: string
  siteTypeId: string
  contractNo: string
  noOfStaff: number
  status: string
  premiseName: string
  premiseTypeId: string
  premiseRemark: string
  normalFlg: boolean
  updatedBy: string
  colPtRecyc: recyclable[]
  roster: roster[]
  version: number
}
