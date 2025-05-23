import { type } from 'os'

export type Company = {
  id: number
  cName: string
  sName?: string
  eName: string
  status: string
  type: string
  createDate: string
  accountNum: number
  version: number
}

export type CreateTenant = {
  tenantId: number
  companyNameTchi: string
  companyNameSchi: string
  companyNameEng: string
  tenantType: string
  status: string
  brNo: string
  remark: string
  contactNo: string
  email: string
  contactName: string
  decimalPlace: number
  monetaryValue: string
  inventoryMethod: string
  allowImgSize: number
  allowImgNum: number
  effFrmDate: string
  effToDate: string
  createdBy: string
  updatedBy: string
}

export type UpdateStatus = {
  status: string
  updatedBy: string
  version: number
  reasonId?: string[]
}