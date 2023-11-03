import dayjs from "dayjs"

export type openingPeriod = {
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs
}

export type serviceHr = {
    startFrom: dayjs.Dayjs,
    endAt: dayjs.Dayjs
}