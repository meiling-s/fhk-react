import { JobListOrder } from './JobOrderInterfaces'
import { LatLngTuple } from 'leaflet'

export type DriverDetail = {
  driverExpId: number
  vehicleTypeId: string
  licenseExp: string
  workingExp: string
}

export type DriverInfo = {
  driverId: number
  loginId: string
  driverNameTchi: string
  driverNameSchi: string
  driverNameEng: string
  licenseNo: string
  photo: string[]
  contactNo: string
  status: string
  driverDetail: DriverDetail[]
  createdBy: string
  updatedBy: string
}

export type PuDetail = {
  puDtlId: number
  recycTypeId: string
  recycSubTypeId: string
  packageTypeId: string
  weight: number
  unitId: number
  photo: string[]
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}

export type PickupPoint = {
  puId: number
  puAt: string
  vehicleId: number
  senderName: string
  receiverName: string
  senderAddr: string
  receiverAddr: string
  senderAddrGps: LatLngTuple
  receiverAddrGps: LatLngTuple
  jo: JobListOrder
  signature: string
  puDetail: PuDetail[]
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}

export type DropoffDetail = {
  drofDtlId: number
  recycTypeId: string
  recycSubTypeId: string
  packageTypeId: string
  weight: number
  unitId: number
  photo: string[]
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}

export type DropOffPoint = {
  drofId: number
  drofAt: string
  puHeader: PickupPoint
  signature: string
  dropoffDetail: DropoffDetail[]
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}
