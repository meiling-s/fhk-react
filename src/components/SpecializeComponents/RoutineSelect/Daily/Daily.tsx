import { useState } from "react";
import CustomTimePicker from "../../../FormComponents/CustomTimePicker";
import CustomField from "../../../FormComponents/CustomField";
import { useTranslation } from "react-i18next";
import { timePeriod } from "../../../../interfaces/collectionPoint";

type props = {

}

export default function Daily({
    
}: props){

    const [period, setPeriod] = useState<timePeriod[]>([]);

    const { t } = useTranslation();

    return(
        <CustomField label={t("time_Period")}>
            <CustomTimePicker
                multiple={true}
                setTime={setPeriod}
            />
        </CustomField>
    )
}