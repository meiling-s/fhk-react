
export interface ProductAddon {
    productAddonTypeId: string;
    productNameTchi: string;
    productNameSchi: string;
    productNameEng: string;
    description: string;
    remark: string;
    status: string;
  };
  

  export interface ProductSubType {
    productSubTypeId: string;
    productNameTchi: string;
    productNameSchi: string;
    productNameEng: string;
    description: string;
    remark: string;
    status: string;
    productAddonType?: ProductAddon[];
  };
  
  export interface Products {
    productTypeId: string;
    productSubTypeId?: string;
    productNameTchi: string;
    productNameSchi: string;
    productNameEng: string;
    description: string;
    remark: string;
    status: string;
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
    status?: string;
    version?: number;
    productTypeId?: string;
    productSubTypeId?: string;
    createdBy?: string;
  }