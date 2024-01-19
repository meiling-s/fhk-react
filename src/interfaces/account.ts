export type LoginItem = {
  username: string,
  password: string,
  realm: string,
}

//tenant register item
export type RegisterItem = {
  contactName: string
  contactNo: string
  companyLogo: string
  brImages: string[]
  epdImages: string[]
}

export type Tenant = {
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
  brPhoto: string[]
  epdPhoto: string[]
  companyLogo: string
  decimalPlace: 0
  monetaryValue: string
  inventoryMethod: string
  allowImgSize: 0
  allowImgNum: 0
  effFrmDate: string
  effToDate: string
  approvedAt: string
  approvedBy: string
  rejectedAt: string
  rejectedBy: string
  createdBy: string
  createdAt: string
  updatedBy: string
}
