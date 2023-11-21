import { Box } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { useState } from "react";
import { styles } from "../../constants/styles";
import { format } from "../../constants/constant";

type props = {
    defaultDate?: Date | string,
    minDate?: Date | string,
    maxDate?: Date | string
    setDate: (date: dayjs.Dayjs) => void
}

export default function CustomDatePicker({
    defaultDate,
    minDate,
    maxDate,
    setDate
}: props){

    const default_Date = defaultDate? defaultDate : new Date();

    const handleDateChange = (date: dayjs.Dayjs | null) => {
        if(date){
            setDate(date);
        }
    }

    return(
        <>
            <Box sx={{display: "flex", alignItems: "center"}}>
                <DatePicker
                    defaultValue={dayjs(default_Date)}
                    minDate={minDate? dayjs(minDate) : undefined}
                    maxDate={maxDate? dayjs(maxDate) : undefined}
                    onChange={(value) => handleDateChange(value)}
                    sx={localstyles.datePicker}
                    format={format.dateFormat3}
                />
            </Box>
        </>
    )
}

let localstyles = {
    datePicker: {
        ...styles.textField,
        maxWidth: "250px",
        "& .MuiIconButton-edgeEnd": {
            color: "#79CA25"
        }
    }
}