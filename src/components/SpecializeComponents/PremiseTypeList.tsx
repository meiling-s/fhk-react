import { useEffect, useState } from "react";
import CustomItemList, { il_item } from "../FormComponents/CustomItemList";
import { premiseType } from "../../interfaces/common";
import { useTranslation } from "react-i18next";

type props = {
    setState: (s: string) => void,
    premiseTypes: premiseType[],
    error?: boolean,
    editable?: boolean,
    defaultValue?: string
}

export default function PremiseTypeList({
    setState,
    premiseTypes,
    error,
    editable,
    defaultValue
}: props){

    const [premiseType, setPremiseType] = useState<string>(defaultValue? defaultValue : "");

    const { t, i18n } = useTranslation();

    useEffect(()=>{
        setState(premiseType);
    },[premiseType])

    const returnPremiseTypes = () => {
        const premiseList: il_item[] = premiseTypes.map((pre) => {
            var name = "";
            switch(i18n.language){
                case "enus":
                    name = pre.premiseTypeNameEng;
                    break;
                case "zhch":
                    name = pre.premiseTypeNameSchi;
                    break;
                case "zhhk":
                    name = pre.premiseTypeNameTchi;
                    break;
                default:
                    name = pre.premiseTypeNameTchi;        //default fallback language is zhhk
                    break;
            }
            return {name: name, id: pre.premiseTypeId};
        });
        return premiseList;
    };

    return(
        <>
            <CustomItemList
                items={returnPremiseTypes()}
                singleSelect={setPremiseType}
                error={error}
                editable={(editable != undefined)? editable : true}
                defaultSelected={defaultValue? defaultValue : ""}
            />
        </>
    );
}