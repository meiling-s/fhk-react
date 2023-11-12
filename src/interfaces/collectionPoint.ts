import dayjs from "dayjs"
import { il_item } from "../components/FormComponents/CustomItemList"

export type openingPeriod = {
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs
}

export type serviceHr = {
    startFrom: dayjs.Dayjs,
    endAt: dayjs.Dayjs
}

export type recyclable = {
	recycTypeId: string,
	recycSubtypeId: string[]
}

export type roster = {
	rosterId: string,
	routineType: string,
    startAt: string,
    endAt: string,
   	status: string,
}

export type collectionPoint = {

    colId: string,
	colName: string,
    colPointTypeId: string,
	effFrmDate: string,
	effToDate: string,
	startTime: string[],
	endTime: string[],
	address: string,
	gpsCode: number[],
	epdFlg: boolean,
	extraServiceFlg: boolean,
	siteTypeId: string,
	contractNo: string,
	noOfStaff: number,
	status: string,
	premiseName: string,
	premiseTypeId: string,
	premiseRemark: string,
	normalFlg: boolean,
	createdAt: Date,
	updatedAt: Date,
	createdBy: string,
	updatedBy: string,
	roster: roster[],
	colPtRecyc: recyclable[]

}

export type createCP = {        //data for creating Collection Point

	colName: string,
    colPointTypeId: string,
	effFrmDate: String,
	effToDate: String,
	startTime: string[],
	endTime: string[],
	address: string,
	gpsCode: number[],
	epdFlg: boolean,
	extraServiceFlg: boolean,
	siteTypeId: string,
	contractNo: string,
	noOfStaff: number,
	status: string,
	premiseName: string,
	premiseTypeId: string,
	premiseRemark: string,
	normalFlg: boolean,
	createdBy: string,
	updatedBy: string,
	roster: roster[],
	colPtRecyc: recyclable[]

}
