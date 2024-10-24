import { useEffect, useState } from "react";
import CustomItemList, { il_item } from "../FormComponents/CustomItemList";
import { colPointType } from "../../interfaces/common";
import { useTranslation } from "react-i18next";
import { Skeleton, Box } from "@mui/material";

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

    const [colPointType, setColPointType] = useState<string>(defaultValue ? defaultValue : "");
    const [loading, setLoading] = useState(true);  
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setState(colPointType);
    }, [colPointType]);

    useEffect(() => {
        if (colPointTypes.length > 0) {
            setLoading(false);
        }
    }, [colPointTypes]);

    const returnColPointTypes = () => {
        const colList: il_item[] = colPointTypes.map((col) => {
            let name = "";
            switch(i18n.language) {
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
                    name = col.colPointTypeTchi;  // Default fallback language is zhhk
                    break;
            }
            return { name: name, id: col.colPointTypeId };
        });
        return colList;
    };

    return (
        <>
            {loading ? (
                <Box sx={{ width: '100%' }}>
                    {/* Show Skeleton while loading */}
                    <Skeleton variant="text" height={40} width="100%" />
                    <Skeleton variant="rectangular" height={40} width="100%" />
                    <Skeleton variant="rectangular" height={40} width="100%" />
                </Box>
            ) : (
                <CustomItemList
                    items={returnColPointTypes()}
                    singleSelect={setColPointType}
                    error={error}
                    editable={editable !== undefined ? editable : true}
                    defaultSelected={defaultValue ? defaultValue : ""}
                />
            )}
        </>
    );
}
