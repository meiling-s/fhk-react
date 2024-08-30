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
  version: number;
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
  version?: number;
};


export type DenialReasonCollectors = {
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
  weatherFlg: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  version: number
};

export type CreateDenialReasonCollectors = {
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
  weatherFlg: boolean;
  version: number
};

export type UpdateDenialReasonCollectors = {
  reasonNameTchi: string;
  reasonNameSchi: string;
  reasonNameEng: string;
  description: string;
  remark: string;
  functionId: string;
  status: string;
  updatedBy?: string;
  weatherFlg: boolean;
  version: number
};