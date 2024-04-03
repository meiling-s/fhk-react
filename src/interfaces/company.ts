export type Company = {
  [key: string]: string;
  brNo: string;
  description: string;
  remark: string;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateCompany = {
  [key: string]: string;
  brNo: string;
  description: string;
  remark: string;
  status: string;
  createdBy: string;
  updatedBy: string;
};

export type UpdateCompany = {
  [key: string]: string;
  brNo: string;
  description: string;
  remark: string;
  status: string;
  updatedBy: string;
};
