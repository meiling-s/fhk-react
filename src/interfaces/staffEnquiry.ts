export type StaffEnquiry = {
  staffId: string;
  tenantId: string;
  staffNameTchi: string;
  staffNameSchi: string;
  staffNameEng: string;
  titleId: string;
  contractNo: string;
  loginId: string;
  status: string;
  email: string;
  gender: string;
  fullTimeFlg: boolean;
  salutation: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateStaffEnquiry = {
  staffNameTchi: string;
  staffNameSchi: string;
  staffNameEng: string;
  tenantId: string;
  titleId: string;
  contractNo: string;
  loginId: string;
  status: string;
  gender: string;
  email: string;
  salutation: string;
  fullTimeFlg: boolean;
  createdBy: string;
  updatedBy: string;
};

export type EditStaffEnquiry = {
  staffNameTchi: string;
  staffNameSchi: string;
  staffNameEng: string;
  tenantId: string;
  titleId: string;
  contractNo: string;
  loginId: string;
  status: string;
  gender: string;
  email: string;
  salutation: string;
  fullTimeFlg: boolean;
  createdBy: string;
  updatedBy: string;
};

export type DeleteStaffEnquiry = {
  status: string;
  updatedBy: string;
};
