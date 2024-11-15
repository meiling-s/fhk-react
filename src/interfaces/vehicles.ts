export type Vehicle = {
    id: number
    vehicleId: number
    vehicleTypeId: string
    vehicleName: string
    plateNo: string
    serviceType: string
    photo: string[]
    status: string
    createdBy: string
    updatedBy: string
    createdAt: string
    updatedAt: string
    version: number
}

export type CreateVehicle = {
    vehicleTypeId: string
    vehicleName: string
    plateNo: string
    serviceType: string
    photo: string[]
    status: string
    createdBy: string
    updatedBy: string
}

export type LogisticVehicle = {
    vehicleId: number
    vehicleTypeId: string
    plateNo: string
    photo: string[]
    status: string
    deviceId: string
    netWeight: number
    createdBy: string
    updatedBy: string
    createdAt: string
    updatedAt: string
    version: number
}

export type CreateLogisticVehicle = {
    vehicleTypeId: string,
    plateNo: string,
    netWeight: number,
    photo: string[],
    status: string,
    deviceId: string,
    createdBy: string,
    updatedBy: string
}