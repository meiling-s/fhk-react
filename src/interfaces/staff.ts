export type Staff = {
    staffId: string
    tenantId: string
    staffNameTchi: string
    staffNameSchi: string
    staffNameEng: string
    titleValue: string
    titleId: string
    contactNo: string
    loginId: string
    status: string
    gender: string
    email: string
    salutation: string
    createdBy: string
    updatedBy: string
    createdAt: string
    updatedAt: string
    fullTimeFlg?: boolean
  }

  
  
  export type CreateStaff = {
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
    fullTimeFlg?: boolean
  }
  
  export type EditStaff = {
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
    updatedBy: string
    fullTimeFlg?: boolean
  }

export type staffQuery = {
  staffId: string
  staffName: string
}
  