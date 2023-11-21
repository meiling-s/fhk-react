import { useEffect, useState } from "react";
import CustomItemList, { il_item } from "../FormComponents/CustomItemList";
import { siteType } from "../../interfaces/common";
import { useTranslation } from "react-i18next";

type props = {
    setState: (s: string) => void,
    siteTypes: siteType[],
    error?: boolean,
    editable?: boolean,
    defaultValue?: string
}

export default function SiteTypeList({
    setState,
    siteTypes,
    error,
    editable,
    defaultValue
}: props){

    const [siteType, setSiteType] = useState<string>(defaultValue? defaultValue : "");

    const { t, i18n } = useTranslation();

    useEffect(()=>{
        setState(siteType);
    },[siteType])

    const returnSiteTypes = () => {
        const siteList: il_item[] = siteTypes.map((s) => {
            var name = "";
            switch(i18n.language){
                case "enus":
                    name = s.siteTypeNameEng;
                    break;
                case "zhch":
                    name = s.siteTypeNameSchi;
                    break;
                case "zhhk":
                    name = s.siteTypeNameTchi;
                    break;
                default:
                    name = s.siteTypeNameTchi;        //default fallback language is zhhk
                    break;
            }
            return {name: name, id: s.siteTypeId};
        });
        return siteList;
    };

    return(
        <>
            <CustomItemList
                items={returnSiteTypes()}
                singleSelect={setSiteType}
                error={error}
                editable={(editable != undefined)? editable : true}
                defaultSelected={defaultValue? defaultValue : ""}
            />
        </>
    );
}