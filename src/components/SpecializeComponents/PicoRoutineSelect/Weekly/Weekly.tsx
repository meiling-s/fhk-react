import { useEffect, useState } from "react";
import CustomItemList, { il_item } from "../../../FormComponents/CustomItemList";
import { useTranslation } from "react-i18next";
import { weekDs } from "../predefinedOption";
import CustomField from "../../../FormComponents/CustomField";
import { itemList } from "../../../../interfaces/common";

type props = {
    setWeekly: (RWs: string[]) => void,
    defaultWeek?: string[],
    itemColor?: itemList | null
}

export default function Weekly({
    setWeekly,
    defaultWeek,
    itemColor
}: props){

    const [weekDays, setWeekDays] = useState<string[]>([]);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        if(defaultWeek){
            var weekDays: string[] | undefined = returnDefaultWeekDay();
            if(weekDays){
                setWeekDays(weekDays);
            }
        }

        return () => {
            setWeekly([]);
        }
    },[])

    useEffect(() => {
        setWeekly(weekDays)
    },[weekDays])

    const returnDefaultWeekDay = () => {
        if(defaultWeek){
            var weekDays: string[] = [];
            defaultWeek.map((weekday) => {
                weekDays.push(weekday);
            })
            return weekDays;
        }
        return undefined
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

    const setWeekD = (s: string[]) => {
        
        setWeekly(s)

    }

    return(
        <>
            <CustomField label={t("component.routine.everyWeekDay")} mandatory>
                <CustomItemList
                    items={getWeekDays()}
                    multiSelect={setWeekD}
                    defaultSelected={returnDefaultWeekDay()}
                    itemColor={itemColor ? itemColor : null}
                />
            </CustomField>
        </>
    )
}