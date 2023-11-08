import dayjs from "dayjs"

export type openingPeriod = {
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs
}

export type serviceHr = {
    startFrom: dayjs.Dayjs,
    endAt: dayjs.Dayjs
}

export type recyclable = {
    recyc_type_id: string,
    recyc_subtype_id: string[]
}
export type collectionPoint = {
    col_id: string,
	col_name: string,
	eff_frm_date: Date,
	eff_to_date: Date,
	start_time: string[2],
	end_time: string[2],
	address: string,
	gps_code: [cor1: number, cor2: number],
	is_epd: boolean,
	is_extra_service: boolean,
	site_type_id: string,
	contract_no: string,
	no_of_staff: number,
	status: string,
	premise_name: string,
	premise_type_id: string,
	premise_remark: string,
	is_normal: boolean,
	created_at: Date,
	updated_at: Date,
	created_by: string,
	updated_by: string,
	col_pt_recyc: recyclable
}
