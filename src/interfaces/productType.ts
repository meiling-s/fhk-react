export interface ProductAddon {
  productAddonTypeId: string;
  productNameTchi: string;
  productNameSchi: string;
  productNameEng: string;
  description: string;
  remark: string;
  status: number;
  version?: number;
};


export interface ProductSubType {
  productSubTypeId: string;
  productNameTchi: string;
  productNameSchi: string;
  productNameEng: string;
  description: string;
  remark: string;
  status: number;
  version?: number;
  productAddonType?: ProductAddon[];
};

export interface Products {
  find(arg0: (addon: any) => boolean): unknown;
  productTypeId: string;
  productSubTypeId?: string;
  productNameTchi: string;
  productNameSchi: string;
  productNameEng: string;
  description: string;
  remark: string;
  status: number;
  productSubType?: ProductSubType[];
  version?: number;
};


export interface ProductPayload {
  productNameTchi: string;
  productNameSchi: string;
  productNameEng: string;
  description: string;
  remark: string;
  updatedBy: string;
  status?: number;
  version?: number;
  productTypeId?: string;
  productSubTypeId?: string;
  createdBy?: string;
}