import { useTranslation } from "react-i18next";
import CustomItemList, { il_item } from "../../FormComponents/CustomItemList"
import { routineType } from "./predefinedOption"
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Daily from "./Daily/Daily";
import SpecificDate from "./SpecificDate/SpecificDate";
import Weekly from "./Weekly/Weekly";
import { routineContent, colPtRoutine } from "../../../interfaces/common"
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type props = {
    setRoutineType: (value: any) => void
    setRoutineContent: (value: any) => void
    routineContent: routineContent[]
    requiredTimePeriod?: boolean
    defaultValue?: colPtRoutine
}

export default function RoutineSelect({
    setRoutineType,
    setRoutineContent,
    requiredTimePeriod = false,
    defaultValue
}: props){
    const [rouType, setRouType] = useState<string>("");
    const [rouContent, setRouContent] = useState<routineContent[]>([]);


    useEffect(() => {
        if(defaultValue){
            setRouType(defaultValue.routineType)
            setRouContent(defaultValue.routineContent)
        }
    },[])
    
    useEffect(() => {
        setRoutineType(rouType)
        setRouContent(rouContent);
    },[defaultValue?.routineType, defaultValue?.routineContent])

    const { t, i18n } = useTranslation();

    const getRoutineType = () => {
        const routineT: il_item[] = routineType.map((routine) => {
            var name: string = "";
            switch(i18n.language){
                case "enus":
                    name = routine.engName;
                    break;
                case "zhch":
                    name = routine.schiName;
                    break;
                case "zhhk":
                    name = routine.tchiName;
                    break;
                default:
                    name = routine.tchiName;        //default fallback language is zhhk
            }
            return {name: name, id: routine.id}
        })
        return routineT
    }
    
    return(
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
            <CustomItemList
                items={getRoutineType()}
                singleSelect={setRouType}
                defaultSelected={defaultValue? defaultValue.routineType : undefined}
            />
           
           <Box sx={{marginTop: 2}}>
               {
                    rouType == "daily"?
                        <Daily
                            setDaily={setRouContent}
                            defaultTime={defaultValue?.routineType == routineType[0].id? defaultValue.routineContent : undefined}
                        />
                    :   rouType == "weekly"?
                        <Weekly
                            setWeekly={setRouContent}
                            defaultWeek={defaultValue?.routineType == routineType[1].id? defaultValue.routineContent : undefined}
                        />
                    :   rouType == "specificDate"&&
                        <SpecificDate
                            setSpecificDate={setRouContent}
                            defaultDates={defaultValue?.routineType == routineType[2].id? defaultValue.routineContent : undefined}
                        />
                } 
            </Box>
        </LocalizationProvider>
    )
}