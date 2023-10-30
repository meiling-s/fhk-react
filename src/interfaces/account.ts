export type LoginItem = {
  username: string,
  password: string,
  realm: string,
}

export type Tenant = {
  tenantId: number,
  companyNameTchi: string,
  companyNameSchi: string,
  companyNameEng: string,
  tenantType: string,
  status: string,
  brNo: string,
  remark: string,
  contactNo: string,
  email: string,
  contactName: string,
  brPhoto: string,
  decimalPlace: 0,
  monetaryValue: string,
  inventoryMethod: string,
  allowImgSize: 0,
  allowImgNum: 0,
  approvedAt: string,
  approvedBy: string,
  rejectedAt: string,
  rejectedBy: string,
  createdBy: string,
  updatedBy: string
}