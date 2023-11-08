import { Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { styles } from "../../constants/styles";
import dayjs from "dayjs";
import { useState } from "react";
import { openingPeriod } from "../../interfaces/collectionPoint";

type DatePicker = {
    setState: (period: openingPeriod) => void
}

function CustomDatePicker({
    setState
}: DatePicker){

    const [period, setPeriod] = useState<openingPeriod>({startDate: dayjs(new Date()), endDate: dayjs(new Date())});

    const onChangeDate = (start: boolean, value: dayjs.Dayjs | null) => {
        if(value != null){
            const peri = Object.assign({},period);
            if(start){
                peri.startDate = value;
            }else{
                peri.endDate = value;
            }
            setPeriod(peri);
            setState(peri);
        }
    }

    return(
        <>
            <Box sx={{display: "flex", alignItems: "center"}}>
                <DatePicker
                    defaultValue={dayjs(new Date())}
                    maxDate={period.endDate}
                    onChange={(value) => onChangeDate(true,value)}
                    sx={localstyles.datePicker}
                />
                    <Typography sx={{marginX: 1}}>
                        至
                    </Typography>
                <DatePicker
                    defaultValue={dayjs(new Date())}
                    minDate={period.startDate}
                    onChange={(value) => onChangeDate(true,value)}
                    sx={localstyles.datePicker}
                />
            </Box>
        </>
        
    )
    
}

const localstyles = {
    datePicker: {
        ...styles.textField,
        maxWidth: "150px",
        "& .MuiIconButton-edgeEnd": {
            color: "#79CA25"
        }
    }
}

export default CustomDatePicker;