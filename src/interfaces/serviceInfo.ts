import { gpsCode } from "./dataFormat"
import dayjs from "dayjs"

export type photoService = {
    photo : string
}

export type ServiceInfo = {
    serviceId: number
    address: string
    addressGps: gpsCode
    serviceName: string
    participants: string,
    startAt: string
    endAt: string
    photo: photoService[]
    numberOfVisitor: number,
    createdBy: string
    updatedBy: string
}