import { Box, Button, IconButton, Typography } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { timePeriod } from "../../interfaces/collectionPoint";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { styles } from "../../constants/styles";
import { useTranslation } from "react-i18next";
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

type timePicker = {
    multiple: boolean,
    //timePeriod: boolean,       enable it if need to support non timePeriod time picker
    setTime: (timePeriod: timePeriod[]) => void
    defaultTime?: timePeriod[]
}

function CustomTimePicker({
    multiple,
    //timePeriod,
    setTime,
    defaultTime
}: timePicker){

    const tempTP: timePeriod = {startFrom: dayjs("09:00", "HH:mm"), endAt: dayjs("17:00", "HH:mm")};
    const [timePeriod, setTimePeriod] = useState<timePeriod[]>(defaultTime? defaultTime : []);

    const { t } = useTranslation();

    useEffect(()=>{
        setTime(timePeriod);
    },[timePeriod])

    useEffect(()=>{
        if(!multiple){
           addTimePeriod(); 
        }
    },[])

    const handleTimePeriodChange = (start: boolean, value: dayjs.Dayjs | null, index: number) => {
        if(value != null){
            if(index >= 0){
                const TP = timePeriod[index];
                if(start){
                    TP.startFrom = value;
                }else{
                    TP.endAt = value;
                }

                const timeP = timePeriod.map((hr, curIndex) => {
                    if( index == curIndex ){      //if current index = index of modifying item
                        return TP
                    }
                    return hr
                })
                setTimePeriod(timeP);

            }
        }
    }

    const addTimePeriod = () => {
        const timeP = Object.assign([],timePeriod);
        const TP = Object.assign({},tempTP);
        timeP.push(TP);
        setTimePeriod(timeP);
    }

    const removeTimePeriod = (index: number) => {
        if(index>-1 && timePeriod.length>0){
            setTimePeriod(Object.values(timePeriod).filter((i,index2)=>(index2 !== index)));
        }
    }

    const showTP = (startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, index: number) => {
        return(
            <Box sx={localstyles.timePeriodItem}>
                <MobileTimePicker
                    defaultValue={startTime}
                    onChange={(value) => handleTimePeriodChange(true,value,index)}
                    sx={localstyles.timePicker}
                />
                    <Typography sx={localstyles.txtStyle_to}>
                        {t("to")}
                    </Typography>
                <MobileTimePicker
                    defaultValue={endTime}
                    onChange={(value) => handleTimePeriodChange(false,value,index)}
                    sx={localstyles.timePicker}
                />
                <IconButton aria-label="addSerivceHr" size="medium" onClick={()=>removeTimePeriod(index)}>
                    <RemoveCircleOutlineIcon
                        sx={styles.disableIcon}
                    />
                </IconButton>
            </Box>
        )
        
    }

    if(multiple){
        return(
            <Box sx={localstyles.container}>
                {
                    timePeriod.map((timePeriod,index) => (
                        showTP(timePeriod.startFrom,timePeriod.endAt,index)
                    ))
                }
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <Button
                        sx={styles.buttonOutlinedGreen}
                        onClick={(event) => addTimePeriod()}
                    >
                        <AddCircleOutlineIcon
                            sx={styles.endAdornmentIcon}
                        />
                        {t("component.routine.addPeriod")}
                    </Button>
                </Box>
            </Box>
        )
    }else{      //just one time picker
        return(
            <Box sx={localstyles.container}>
                <Box sx={localstyles.timePeriodItem}>
                    <MobileTimePicker
                        defaultValue={tempTP.startFrom}
                        onChange={(value) => handleTimePeriodChange(true,value,0)}
                        sx={localstyles.timePicker}
                    />
                        <Typography sx={localstyles.txtStyle_to}>
                            {t("to")}
                        </Typography>
                    <MobileTimePicker
                        defaultValue={tempTP.endAt}
                        onChange={(value) => handleTimePeriodChange(false,value,0)}
                        sx={localstyles.timePicker}
                    />
                </Box>
            </Box>
            
        )
    }
    
}

const localstyles = {
    timePicker: {
        width: 72,
        borderRadius: 5,
        backgroundColor: "white",
        "& fieldset":{
            borderWidth: 0
        },
        "& input":{
            paddingX: 0
        }
    },
    timePeriodItem: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "white",
        paddingX: 2,
        mr: 2,
        border: 2,
        borderRadius: 3,
        borderColor: "#E2E2E2",
    },
    container: {
        display: "flex",
        flexDirection: "row",
        borderRadius: 10,
        mt: 1
    },
    txtStyle_to: {
        marginX: 1,
        color: "#ACACAC",
        fontSize: 15,
        fontWeight: "bold"
    }    
}

export default CustomTimePicker