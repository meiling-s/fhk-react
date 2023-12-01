import dayjs from "dayjs";
import { format } from "../constants/constant";
import { gpsCode, time } from "../interfaces/dataFormat";

export const dayjsToLocalDateTime = (dt: dayjs.Dayjs) => {
    const dateTime = dt;
    console.log("LocalDateTime: ",dateTime);
    return dateTime.toString();
}

export const dateToLocalDateTime = (dt: Date) => {
    const dateTime = dt;
    console.log("LocalDateTime: ",dateTime);
    return dateTime.toString();
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
    const time: time = {
        hour: t.hour(),
        minute: t.minute(),
        second: t.second(),
        nano: t.millisecond()
    }
    return time;
}

export const dateToLocalTime = (t: Date) => {
    const time: time = {
        hour: t.getHours(),
        minute: t.getMinutes(),
        second: t.getSeconds(),
        nano: t.getMilliseconds()
    }
    return time;
}

export const toGpsCode = (lat: number, long: number) => {
    const gpsCode: gpsCode = [lat,long];
    return gpsCode
}