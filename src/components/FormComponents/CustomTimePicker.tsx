import { Box, IconButton, Typography } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { serviceHr } from "../../interfaces/collectionPoint";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { styles } from "../../constants/styles";
import { useTranslation } from "react-i18next";

type timePicker = {
    multiple: boolean,
    //serviceHr: boolean,       enable it if need to support non serviceHr time picker
    setTime: (shr: serviceHr[]) => void
    defaultTime?: serviceHr[]
}

function CustomTimePicker({
    multiple,
    //serviceHr,
    setTime,
    defaultTime
}: timePicker){

    const [tempSHR, setTempSHR] = useState<serviceHr>({startFrom: dayjs("09:00", "HH:mm"), endAt: dayjs("17:00", "HH:mm")});
    const [sHr, setSHr] = useState<serviceHr[]>(defaultTime? defaultTime : []);

    const { t } = useTranslation();

    useEffect(()=>{
        setTime(sHr);
    },[sHr])

    useEffect(()=>{
        if(!multiple){
           addServiceHr(); 
        }
    },[])

    const SHRonChange = (start: boolean, value: dayjs.Dayjs | null, index: number) => {
        if(value != null){
            if(index == -1){        //-1 = default time picker
                const shr = tempSHR;
                if(start){
                    shr.startFrom = value;
                }else{
                    shr.endAt = value;
                }
                setTempSHR(shr);
            }else if(index >= 0){
                const shr = sHr[index];
                if(start){
                    shr.startFrom = value;
                }else{
                    shr.endAt = value;
                }

                const servicesHr = sHr.map((hr, index2) => {
                    if(index==index2){
                        return shr
                    }
                    return hr
                })
                setSHr(servicesHr);

            }
        }
    }

    const addServiceHr = () => {
        const servicesHr = Object.assign([],sHr);
        const shr = Object.assign({},tempSHR);
        servicesHr.push(shr);
        setSHr(servicesHr);
    }

    const removeServiceHr = (index: number) => {
        if(index>-1 && sHr.length>0){
            setSHr(Object.values(sHr).filter((i,index2)=>(index2 !== index)));
        }
        
    }

    const showSHr = (startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, index: number) => {
        return(
            <Box sx={{display: "flex", alignItems: "center", marginY: 2}}>
                <TimePicker
                    defaultValue={startTime}
                    onChange={(value) => SHRonChange(true,value,index)}
                    sx={localstyles.timePicker}
                />
                <Typography sx={{marginX: 1}}>
                    {t("to")}
                </Typography>
                <TimePicker
                    defaultValue={endTime}
                    onChange={(value) => SHRonChange(false,value,index)}
                    sx={localstyles.timePicker}
                />
                <IconButton aria-label="addSerivceHr" size="medium" onClick={()=>removeServiceHr(index)}>
                    <RemoveCircleOutlineIcon
                        sx={styles.disableIcon}
                    />
                </IconButton>
            </Box>
        )
        
    }

    if(multiple){
        return(
            <>
                {
                    sHr.map((serviceHr,index) => (
                        showSHr(serviceHr.startFrom,serviceHr.endAt,index)
                    ))
                }
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <TimePicker
                        defaultValue={tempSHR.startFrom}
                        onChange={(value) => SHRonChange(true,value,-1)}
                        sx={localstyles.timePicker}
                    />
                        <Typography sx={{marginX: 1}}>
                            {t("to")}
                        </Typography>
                    <TimePicker
                        defaultValue={tempSHR.endAt}
                        onChange={(value) => SHRonChange(false,value,-1)}
                        sx={localstyles.timePicker}
                    />
                    <IconButton aria-label="addSerivceHr" size="medium" onClick={()=>addServiceHr()}>
                        <AddCircleOutlineIcon
                            sx={styles.endAdornmentIcon}
                        />
                    </IconButton>
                </Box>
            </>
        )
    }else{      //just one time picker
        return(
            <>
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <TimePicker
                        defaultValue={tempSHR.startFrom}
                        onChange={(value) => SHRonChange(true,value,0)}
                        sx={localstyles.timePicker}
                    />
                        <Typography sx={{marginX: 1}}>
                            至
                        </Typography>
                    <TimePicker
                        defaultValue={tempSHR.endAt}
                        onChange={(value) => SHRonChange(false,value,0)}
                        sx={localstyles.timePicker}
                    />
                </Box>
            </>
            
        )
    }
    
}

const localstyles = {
    timePicker: {
        ...styles.textField,
        maxWidth: "150px"
    }
}

export default CustomTimePicker