export type StaffTitle = {
  titleId: string;
  tenantId: string;
  titleNameTchi: string;
  titleNameSchi: string;
  titleNameEng: string;
  description: string;
  remark: string;
  duty: string[];
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateStaffTitle = {
  tenantId: string;
  titleNameTchi: string;
  titleNameSchi: string;
  titleNameEng: string;
  description: string;
  remark: string;
  duty: string[];
  status: string;
  createdBy?: string;
  updatedBy?: string;
};

export type UpdateStaffTitle = {
  titleId: string;
  titleNameTchi: string;
  titleNameSchi: string;
  titleNameEng: string;
  description: string;
  remark: string;
  duty: string[];
  status: string;
  updatedBy?: string;
};
