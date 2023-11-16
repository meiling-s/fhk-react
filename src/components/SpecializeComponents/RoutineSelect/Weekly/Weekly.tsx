import { useState } from "react";
import CustomTimePicker from "../../../FormComponents/CustomTimePicker";
import CustomItemList, { il_item } from "../../../FormComponents/CustomItemList";
import { useTranslation } from "react-i18next";
import { weekDayT, weekDs } from "../predefinedOption";
import CustomField from "../../../FormComponents/CustomField";
import { timePeriod } from "../../../../interfaces/collectionPoint";
import { Collapse } from "@mui/material";

type props = {

}

type weekDay_timePeriod = {     //store the timePeriod with the weekDay id
    id: string,
    timePeriod: timePeriod[]
}

export default function Weekly({

}: props){

    const [weekDays, setWeekDays] = useState<string[]>([]);
    const [curWeekDay, setCurWeekDay] = useState<string>(" ");
    const [timePeriods, setTimePeriods] = useState<weekDay_timePeriod[]>([]);

    const { t, i18n } = useTranslation();

    const getWeekDays = () => {
        const weekD: il_item[] = weekDs.map((weekDay) => {
            var name: string = "";
            switch(i18n.language){
                case "enus":
                    name = weekDay.engName;
                    break;
                case "zhch":
                    name = weekDay.schiName;
                    break;
                case "zhhk":
                    name = weekDay.tchiName;
                    break;
                default:
                    name = weekDay.tchiName;        //default fallback language is zhhk
            }
            return {name: name, id: weekDay.id}
        })
        return weekD
    }

    const getWeekDayById = (id: string) => {
        const weekD: weekDayT | undefined = weekDs.find((weekDay) => {
            return weekDay.id == id;
        })
        if(weekD){
            var name: string = "";
            switch(i18n.language){
                case "enus":
                    return weekD.engName;
                case "zhch":
                    return weekD.schiName;
                case "zhhk":
                    return weekD.tchiName;
                default:
                    return weekD.tchiName;        //default fallback language is zhhk
            }
        }
        return "";
    }

    const setWeekD = (s: string[]) => {
        console.log(s);
        if(s.length > weekDays.length){     //if adding item to weekDays
            console.log("adding item");
            setWeekDays(s);
        }else if(s.length < weekDays.length){
            console.log("remove item",s);
            const day = weekDays.find((day) => {     //find the item that has been removed
                return !s.includes(day);
            });
            if(day){
                const timeP = timePeriods.filter((TP) => {
                    console.log(TP.id,day);
                    return !(TP.id == day)
                });
                console.log(timeP);
                setTimePeriods(timeP);
            }
            setWeekDays(s)
        }

    }

    const setTimePeriodForWeekDay = (TPs: timePeriod[]) => {
        var tempTP: weekDay_timePeriod = {id: curWeekDay, timePeriod: TPs};
        var findTP = timePeriods.find((twTPs) => {
            return twTPs.id == curWeekDay
        });
        var timePeriodsSet: weekDay_timePeriod[] = [];
        if(findTP){
            timePeriodsSet = timePeriods.map((twTPs) => {
                if(twTPs.id == curWeekDay){
                    return tempTP;
                }
                return twTPs;
            });
        }else{
            timePeriodsSet = Object.assign([],timePeriods);
            timePeriodsSet.push(tempTP);
        }
        console.log(timePeriods,curWeekDay,findTP,TPs)
        setTimePeriods(timePeriodsSet);
    }

    const getTimePeriod = (id: string) => {
        var findTP = timePeriods.find((twTPs) => {
            return twTPs.id == id
        });
        if(findTP){
            return findTP
        }
        return {id: "",timePeriod: []}
    }

    const getWithSubItemList = () => {
        const withSubItem = weekDays.filter((day) => {
            return getTimePeriod(day).timePeriod.length > 0;
        });
        return withSubItem;
    }

    return(
        <>
            <CustomField label={t("component.routine.everyWeekDay")}>
                <CustomItemList
                    items={getWeekDays()}
                    multiSelect={setWeekD}
                    dbClickSelect={true}
                    setLastSelect={setCurWeekDay}
                    withSubItems={getWithSubItemList()}
                />
                <Collapse sx={{mt: 1}} in={curWeekDay != " " && weekDays.length > 0}>
                    <CustomField label={t("time_Period") + ` (${getWeekDayById(curWeekDay)})`} key={curWeekDay}>
                        <CustomTimePicker
                            multiple={true}
                            setTime={setTimePeriodForWeekDay}
                            defaultTime={getTimePeriod(curWeekDay).timePeriod}
                        />
                    </CustomField>
                </Collapse>
            </CustomField>
        </>
    )
}