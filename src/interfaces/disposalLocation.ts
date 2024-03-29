export type DisposalLocation = {
    disposalLocId: string;
    disposalLocNameTchi: string;
    disposalLocNameSchi: string;
    disposalLocNameEng: string;
    location: string;
    locationGps: number[];
    description: string;
    remark: string;
    status: string;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
  };
  
  export type CreateDisposalLocation = {
    disposalLocNameTchi: string;
    disposalLocNameSchi: string;
    disposalLocNameEng: string;
    location: string;
    locationGps: number[];
    description: string;
    remark: string;
    status: string;
    createdBy?: string;
    updatedBy?: string;
  };
  
  export type UpdateDisposalLocation = {
    disposalLocId: string;
    disposalLocNameTchi: string;
    disposalLocNameSchi: string;
    disposalLocNameEng: string;
    location: string;
    locationGps: number[];
    description: string;
    remark: string;
    status: string;
    updatedBy?: string;
  };
  