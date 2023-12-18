import { Box, Button, IconButton } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { useState } from "react";
import { styles } from "../../constants/styles";
import { format } from "../../constants/constant";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useTranslation } from "react-i18next";

type props = {
    defaultDate?: Date | Date[] | string | string[],
    minDate?: Date | string,
    maxDate?: Date | string,
    setDate?: (date: dayjs.Dayjs) => void,
    setMultiDate?: (date: dayjs.Dayjs[]) => void,
    container_style?: object,
    dp_style?: object
}

export default function CustomDatePicker({
    defaultDate,
    minDate,
    maxDate,
    setDate,
    setMultiDate,
    container_style,
    dp_style
}: props){

    const [dates,setDates] = useState<Date[]>([]);

    const { t } = useTranslation();

    if(setMultiDate != undefined){        //multi date select

        if(defaultDate != undefined && Array.isArray(defaultDate) && defaultDate.length > 0){
            const defDates = defaultDate.map((defDate) => {
                return new Date(defDate)
            });
            setDates(defDates)
        }

        const handleDateChange = (value: dayjs.Dayjs | null, index: number) => {
            if(value != null){
                if(index >= 0){

                    const date_s = dates.map((d, curIndex) => {
                        if( index == curIndex ){      //if current index = index of modifying item
                            return value.toDate()
                        }
                        return d
                    })
                    setDates(date_s);
    
                }
            }
        }

        const addDate = () => {
            const date_s = Object.assign([],dates);
            date_s.push(new Date());
            setDates(date_s);
        }

        const removeDate = (index: number) => {
            if(index>-1 && dates.length>0){
                setDates(Object.values(dates).filter((i,index2)=>(index2 !== index)));
            }
        }

        const showDate = (date: dayjs.Dayjs, index: number) => {
            return(
                <Box sx={{...localstyles.DateItem, ...container_style}}>
                    <DatePicker
                        defaultValue={date}
                        minDate={minDate? dayjs(minDate) : undefined}
                        maxDate={maxDate? dayjs(maxDate) : undefined}
                        onChange={(value) => handleDateChange(value, index)}
                        sx={{...localstyles.datePicker, ...dp_style}}
                        format={format.dateFormat2}
                    />
                    <IconButton aria-label="addSerivceHr" size="medium" onClick={()=>removeDate(index)}>
                        <RemoveCircleOutlineIcon
                            sx={styles.disableIcon}
                        />
                    </IconButton>
                </Box>
            )
            
        }

        return(
            <Box sx={localstyles.container}>
                {
                    dates.map((date,index) => (
                        showDate(dayjs(date),index)
                    ))
                }
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <Button
                        sx={{...styles.buttonOutlinedGreen_2, marginY: 2}}
                        onClick={(event) => addDate()}
                    >
                        <AddCircleOutlineIcon
                            sx={{...styles.endAdornmentIcon, pr: 1}}
                        />
                        {t("component.routine.addPeriod")}
                    </Button>
                </Box>
            </Box>
        )

    }else if(setDate != undefined){      //single date select

        const default_Date = (defaultDate!=undefined && !Array.isArray(defaultDate))? defaultDate : new Date();

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
                        sx={{...localstyles.datePicker, ...dp_style}}
                        format={format.dateFormat2}
                    />
                </Box>
            </>
        )

    }

    return <></>        //if non setDate function found

}

let localstyles = {
    datePicker: {
        ...styles.textField,
        maxWidth: "250px",
        "& .MuiIconButton-edgeEnd": {
            color: "#79CA25"
        }
    },
    container: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        borderRadius: 10
    },
    DateItem: {
        display: "flex",
        height: "fit-content",
        paddingX: 1,
        mr: 1,
        marginY: 2,
        alignItems: "center"
    }
}
