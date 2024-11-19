export type FactoryWarehouse = {
    factoryWarehouseId: number;
    warehouseId: number;
    createdBy: string;
    updatedBy: string;
} 

export type FactoryWarehouseData = {
    warehouseId: number;
    warehouseNameTchi: string;
    warehouseNameSchi: string;
    warehouseNameEng: string;
} 

export type FactoryData = {
    factoryId: number;
    tenantId: number;
    factoryNameEng: string;
    factoryNameSchi: string;
    factoryNameTchi: string;
    address: string;
    factoryWarehouse: FactoryWarehouse[];
    description: string;
    remark: string;
    createdBy: string;
    updatedBy: string;
};

export type CreateFactory = {
    factoryId: number;
    tenantId: number;
    factoryNameEng: string;
    factoryNameSchi: string;
    factoryNameTchi: string;
    address: string;
    factoryWarehouse: FactoryWarehouse[];
    description: string;
    remark: string;
    createdBy: string;
    updatedBy: string;
};

export type updateFactory = {
    factoryId: number;
    tenantId: number;
    factoryNameEng: string;
    factoryNameSchi: string;
    factoryNameTchi: string;
    address: string;
    factoryWarehouse: FactoryWarehouse[];
    description: string;
    remark: string;
    createdBy: string;
    updatedBy: string;
};
