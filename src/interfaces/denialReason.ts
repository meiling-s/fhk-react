export type DenialReason = {
  reasonId: number;
  tenantId: string;
  reasonNameTchi: string;
  reasonNameSchi: string;
  reasonNameEng: string;
  description: string;
  remark: string;
  functionId: string;
  functionName: string;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateDenialReason = {
  tenantId?: string;
  reasonNameTchi: string;
  reasonNameSchi: string;
  reasonNameEng: string;
  description: string;
  remark: string;
  functionId: string;
  status: string;
  createdBy?: string;
  updatedBy?: string;
};

export type UpdateDenialReason = {
  reasonNameTchi: string;
  reasonNameSchi: string;
  reasonNameEng: string;
  description: string;
  remark: string;
  functionId: string;
  status: string;
  updatedBy?: string;
};
