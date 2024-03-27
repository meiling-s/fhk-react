export type DenialReason = {
  reasonId: number;
  tenantId: string;
  reasonNameTchi: string;
  reasonNameSchi: string;
  reasonNameEng: string;
  introduction: string;
  remark: string;
  functionId: number;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateDenialReason = {
  reasonNameTchi: string;
  reasonNameSchi: string;
  reasonNameEng: string;
  introduction: string;
  remark: string;
  functionId: number;
};
