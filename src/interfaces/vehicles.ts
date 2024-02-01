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