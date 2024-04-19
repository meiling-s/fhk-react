import { gpsCode } from "./dataFormat"
import dayjs from "dayjs"

export type ServiceInfo = {
    serviceId: number
    address: string
    addressGps: gpsCode
    serviceName: string
    participants: string,
    startAt: string
    endAt: string
    photo: string[]
    numberOfVisitor: number,
    createdBy: string
    updatedBy: string
    nature?: string,
    speaker?: string,
    additionalFlg?: boolean
}