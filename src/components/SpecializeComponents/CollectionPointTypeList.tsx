import { useEffect, useState } from "react";
import CustomItemList, { il_item } from "../FormComponents/CustomItemList";
import { colPointType } from "../../interfaces/common";
import { useTranslation } from "react-i18next";

type props = {
    setState: (s: string) => void,
    colPointTypes: colPointType[],
    error?: boolean,
    editable?: boolean,
    defaultValue?: string
}

export default function ColPointTypeList({
    setState,
    colPointTypes,
    error,
    editable,
    defaultValue
}: props){

    const [colPointType, setColPointType] = useState<string>(defaultValue? defaultValue : "");

    const { t, i18n } = useTranslation();

    useEffect(()=>{
        setState(colPointType);
    },[colPointType])

    const returnColPointTypes = () => {
        const colList: il_item[] = colPointTypes.map((col) => {
            var name = "";
            switch(i18n.language){
                case "enus":
                    name = col.colPointTypeEng;
                    break;
                case "zhch":
                    name = col.colPointTypeSchi;
                    break;
                case "zhhk":
                    name = col.colPointTypeTchi;
                    break;
                default:
                    name = col.colPointTypeTchi;        //default fallback language is zhhk
                    break;
            }
            return {name: name, id: col.colPointTypeId};
        });
        return colList;
    };

    //console.log("init editable ",editable)

    return(
        <>
            <CustomItemList
                items={returnColPointTypes()}
                singleSelect={setColPointType}
                error={error}
                editable={(editable != undefined)? editable : true}
                defaultSelected={defaultValue? defaultValue : ""}
            />
        </>
    );
}