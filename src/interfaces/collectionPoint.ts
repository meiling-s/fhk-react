import dayjs from "dayjs"

export type openingPeriod = {
    startDate: Date,
    endDate: Date | undefined
}

export type serviceHr = {
    startFrom: dayjs.Dayjs,
    endAt: dayjs.Dayjs
}