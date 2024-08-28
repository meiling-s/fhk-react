export interface DriverDetail {
    driverExpId: number;
    vehicleTypeId: string;
    licenseExp: string;
    workingExp: string;
}

export interface Driver {
    driverId: number;
    loginId: string;
    driverNameTchi: string;
    driverNameSchi: string;
    driverNameEng: string;
    licenseNo: string;
    photo: string[];
    contactNo: string;
    status: string;
    driverDetail: DriverDetail[];
    createdBy: string;
    updatedBy: string;
    labelId?: string;
    version: number;
}