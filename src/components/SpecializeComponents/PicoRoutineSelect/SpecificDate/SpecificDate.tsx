import { useTranslation } from "react-i18next";
import { styles } from "../../../../constants/styles";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import CustomDatePicker from "../../../FormComponents/CustomDatePicker";
import { format } from "../../../../constants/constant";

type props = {
    setSpecificDate: (RSDs: string[]) => void,
    defaultDates?: string[]
}

export default function SpecificDate({
    setSpecificDate,
    defaultDates
}: props){

    const [specificDates, setSpecificDates] = useState<string[]>([]);

    const { t } = useTranslation();

    useEffect(() => {
        if(defaultDates){
            setSpecificDates(defaultDates)
        }
        return () => {
            setSpecificDate([]);
        }
    },[])

    useEffect(() => {
        setSpecificDate(specificDates)
    },[specificDates])

    const handleDatePick = (day: dayjs.Dayjs[]) => {
        var newSpecificDates = day.map((date) => {
            console.log(date.format(format.dateFormat2))
            return date.format(format.dateFormat2);
        });
        setSpecificDates(newSpecificDates);
    }

    return(
        <CustomDatePicker
            defaultDate={defaultDates}
            setMultiDate={(dates) => handleDatePick(dates)}
            dp_style={{width: "200px"}}
        />
    )
    
}

let localstyles = {
    gridContainer: {
        width: "100%",
    },
    gridRow: {
        width: "100%",
        flexDirection: "row",
        marginY: 1
    },
    dataRow: {
        backgroundColor: "#FBFBFB",
        borderRadius: 5,
        paddingX: 2
    },
    txtHeader: {
        ...styles.header3,
        pl: 1
    },
    tableCell: {
        display: "flex",
        alignSelf: "center"
    }
}