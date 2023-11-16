import { useTranslation } from "react-i18next";
import CustomItemList, { il_item } from "../../FormComponents/CustomItemList"
import { routineType } from "./predefinedOption"
import { useState } from "react";
import { Box } from "@mui/material";
import Daily from "./Daily/Daily";
import SpecificDate from "./SpecificDate/SpecificDate";
import Weekly from "./Weekly/Weekly";

type props = {

}

export default function RoutineSelect({

}: props){

    //shared state
    const [rouType, setRouType] = useState<string>("");
    //state for daily
    const [dailyPeriod, setDailyPeriod] = useState<string>("");
    //state for weekly
    const [weekDays, setWeekDays] = useState<string>("");
    const [weeklyPeriod, setWeeklyPeriod] = useState<string>("");
    //state for specific date
    const [specificDates, setSpecificDates] = useState<string>("");


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
        console.log(routineT);
        return routineT
    }
    
    return(
        <>
            <CustomItemList
                items={getRoutineType()}
                singleSelect={setRouType}
            />
            <Box sx={{marginTop: 2}}>
               {
                    rouType == "daily"?
                        <Daily/>
                    :   rouType == "weekly"?
                        <Weekly/>
                    :   rouType == "specificDate"&&
                        <SpecificDate/>
                } 
            </Box>
            
        </>
    )
}