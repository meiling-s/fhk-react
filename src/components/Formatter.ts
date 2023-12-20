import dayjs from "dayjs";
import { format } from "../constants/constant";
import { gpsCode } from "../interfaces/dataFormat";

export const dayjsToLocalDateTime = (dt: dayjs.Dayjs) => {
    const dateTime = dt;
    console.log("LocalDateTime: ",dateTime.toISOString());
    return dateTime.toISOString();
}

export const dateToLocalDateTime = (dt: Date) => {
    const dateTime = dt;
    console.log("LocalDateTime: ",dateTime.toISOString());
    return dateTime.toISOString();
}

export const dayjsToLocalDate = (d: dayjs.Dayjs) => {
    const date = d.format(format.dateFormat3);
    console.log("LocalDate: ",date);
    return date;
}

export const dateToLocalDate = (d: Date) => {
    const date = dayjs(d).format(format.dateFormat3);
    console.log("LocalDate: ",date);
    return date;
}

export const dayjsToLocalTime = (t: dayjs.Dayjs) => {
    const time = t.format(format.timeFormat);
    return time;
}

export const dateToLocalTime = (t: Date) => {
    const time = dayjs(t).format(format.timeFormat);
    return time;
}

export const toGpsCode = (lat: number, long: number) => {
    const gpsCode: gpsCode = [lat,long];
    return gpsCode
}


