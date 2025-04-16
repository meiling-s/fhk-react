import { useEffect, useMemo, useState } from "react";
import CustomTimePicker from "../../../FormComponents/CustomTimePicker";
import CustomItemList, { il_item } from "../../../FormComponents/CustomItemList";
import { useTranslation } from "react-i18next";
import { weekDayT, weekDs } from "../predefinedOption";
import CustomField from "../../../FormComponents/CustomField";
import { timePeriod } from "../../../../interfaces/collectionPoint";
import { Collapse } from "@mui/material";
import { routineContent } from "../../../../interfaces/common";
import dayjs from "dayjs";

type props = {
    setWeekly: (RWs: routineContent[]) => void,
    defaultWeek?: routineContent[],
    required?: boolean
}

type weekDay_timePeriod = {     //store the timePeriod with the weekDay id
    id: string,
    timePeriod: timePeriod[]
}

export default function Weekly({
    setWeekly,
    defaultWeek,
    required =  false
}: props){

    const [weekDays, setWeekDays] = useState<string[]>([]);
    const [curWeekDay, setCurWeekDay] = useState<string>(" ");
    const [timePeriods, setTimePeriods] = useState<weekDay_timePeriod[]>([]);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        if(defaultWeek){
            var weekDays: string[] | undefined = returnDefaultWeekDay();
            var wd_period: weekDay_timePeriod[] | undefined = returnDefaultTimePeriods();
            if(weekDays){
                setWeekDays(weekDays);
            }
            if(wd_period){
                setTimePeriods(wd_period);
            }
        }

        return () => {
            setWeekly(returnRoutineContent([]));
        }
    },[])

    useEffect(() => {
        setWeekly(returnRoutineContent(timePeriods))
    },[timePeriods])

    const returnDefaultWeekDay = () => {
        if(defaultWeek){
            var weekDays: string[] = [];
            defaultWeek.map((weekday) => {
                weekDays.push(weekday.id);
            })
            return weekDays;
        }
        return undefined
    }

    const returnDefaultTimePeriods = () => {
        if(defaultWeek){
            var wd_period: weekDay_timePeriod[] = [];
            defaultWeek.map((weekday) => {
                wd_period.push({id: weekday.id, timePeriod: toTimePeriod(weekday.startTime, weekday.endTime)})
            })
            return wd_period;
        }
        return undefined
    }

    const toTimePeriod = (st: string[], et: string[]) => {      //start time end time
        const timeP: timePeriod[] = [];
        for(var i = 0; i < Math.min(st.length,et.length); i++){
            timeP.push({startFrom: dayjs(st[i]), endAt: dayjs(et[i])});
        }
        return timeP;
    }

    const returnRoutineContent = (week_TimePeriod: weekDay_timePeriod[]) => {
        const routineWeekly: routineContent[] = week_TimePeriod.map((weekday) => {
            const ST: string[] = weekday.timePeriod.map((value) => value.startFrom.toString());
            const ET: string[] = weekday.timePeriod.map((value) => value.endAt.toString());
            const RW: routineContent = {
                id: weekday.id,
                startTime: ST,
                endTime: ET
            }
            return RW;
        })
        return routineWeekly;
    }

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
        console.log("setWeekD: ",s);
        if(s.length > weekDays.length){     //if adding item to weekDays
            console.log("adding item");
            const day = s.find((str) => {     //find the item that has been added
                return !weekDays.includes(str);
            });
            if(day){        //if found
                setWeekDays(s);
                var tempTP: weekDay_timePeriod = {id: day, timePeriod: []};      //add a new record of added week day into timePeriods
                var timePeriodsSet = Object.assign([],timePeriods);
                timePeriodsSet.push(tempTP);
                setTimePeriods(timePeriodsSet);
            }
        }else if(s.length < weekDays.length){
            console.log("remove item");
            const day = weekDays.find((day) => {     //find the item that has been removed
                return !s.includes(day);
            });
            if(day){        //if found
                setWeekDays(s)
                const timeP = timePeriods.filter((TP) => {      //filter the deleted week day from timePeriods
                    console.log(TP.id,day);
                    return !(TP.id == day)
                });
                console.log(timeP);
                setTimePeriods(timeP);
            }
        }
    }

    const setTimePeriodForWeekDay = (TPs: timePeriod[]) => {
        var tempTP: weekDay_timePeriod = {id: curWeekDay, timePeriod: TPs};
        var findTP = timePeriods.find((twTPs) => {      //find the timePeriod first to make sure the curWeekDay is selected
            console.log(twTPs.id, curWeekDay);
            return twTPs.id == curWeekDay
        });
        if(findTP){
            var timePeriodsSet = timePeriods.map((twTPs) => {
                if(twTPs.id == curWeekDay){
                    return tempTP;
                }
                return twTPs;
            });
            setTimePeriods(timePeriodsSet);
        }
        console.log(timePeriods,curWeekDay,findTP,TPs)
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

    const removeWeekD = (weekDayToBeRemoved: string) => {
        setWeekDays(weekDays.filter(wd => wd!==weekDayToBeRemoved))
        setTimePeriods(timePeriods.filter(tp => tp.id !== weekDayToBeRemoved))
    }

    const memoizedDefaultWeekDays = useMemo(() => returnDefaultWeekDay() || [], [defaultWeek]);

    return(
        <>
            <CustomField label={t("component.routine.everyWeekDay")} mandatory>
                <CustomItemList
                    items={getWeekDays()}
                    multiSelect={setWeekD}
                    dbClickSelect={true}
                    setLastSelect={setCurWeekDay}
                    withSubItems={getWithSubItemList()}
                    defaultSelected={memoizedDefaultWeekDays}
                />
                <Collapse sx={{mt: 1}} in={curWeekDay != " " && weekDays.length > 0}>
                    <CustomField label={t("time_Period") + ` (${getWeekDayById(curWeekDay)})`} key={curWeekDay} mandatory={required}>
                        <CustomTimePicker
                            multiple={true}
                            setTime={setTimePeriodForWeekDay}
                            defaultTime={ (curWeekDay != " ")? getTimePeriod(curWeekDay).timePeriod : undefined}
                            removeParent={removeWeekD}
                            selectedParent = {curWeekDay}
                        />
                    </CustomField>
                </Collapse>
            </CustomField>
        </>
    )
}