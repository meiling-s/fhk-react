export type LoginItem = {
  username: string
  password: string
}

//tenant register item
export type RegisterItem = {
  lang: string
  contactName: string
  contactNo: string
  companyLogo: string
  brImages: string[]
  epdImages: string[]
  monetaryValue: string
}

export type Tenant = {
  tenantId: number
  companyNameTchi: string
  companyNameSchi: string
  companyNameEng: string
  tenantType: string
  lang: string
  status: string
  brNo: string
  remark: string
  contactNo: string
  email: string
  contactName: string
  brPhoto: string[]
  epdPhoto: string[]
  companyLogo: string
  decimalPlace: number
  monetaryValue: string
  inventoryMethod: string
  allowImgSize: number
  allowImgNum: number
  effFrmDate: string
  effToDate: string
  approvedAt: string
  approvedBy: string
  rejectedAt: string
  rejectedBy: string
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export type UpdateTenantForm = {
  companyNameTchi: string
  companyNameSchi: string
  companyNameEng: string
  tenantType: string
  lang: string
  status: string
  brNo: string
  remark: string
  contactNo: string
  email: string
  contactName: string
  brPhoto: string[]
  epdPhoto: string[]
  companyLogo: string
  decimalPlace: number
  monetaryValue: string
  inventoryMethod: string
  allowImgSize: number
  allowImgNum: number
  effFrmDate: string
  effToDate: string
  approvedAt: string
  approvedBy: string
  rejectedAt: string
  rejectedBy: string
  createdBy: string
  createdAt: string
  updatedAt: string
  updatedBy: string
}
