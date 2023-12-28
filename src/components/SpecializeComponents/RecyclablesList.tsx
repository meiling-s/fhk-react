import { Collapse } from "@mui/material";
import CustomField from "../FormComponents/CustomField";
import CustomItemList, { il_item } from "../FormComponents/CustomItemList";
import { useEffect, useState } from "react";
import { recycType } from "../../interfaces/common";
import { useTranslation } from "react-i18next";
import { recyclable } from "../../interfaces/collectionPoint";
import { Item } from "../../interfaces/pickupOrder";

type recycItem = {
    recycType: il_item,
    recycSubType: il_item[]
}

type props = {
    showError?: boolean,
    defaultRecycL?: recyclable[],
    recycL: recycType[],
    setState: (s: recyclable[]) => void
    value?:Item
}

export default function RecyclablesList({
    showError,
    defaultRecycL,
    recycL,
    setState,
    value
}: props){

    const [recycTypeList, setRecycTypeList] = useState<string[]>([]);
    const [curRecyc, setCurRecyc] = useState<string>(" ");     //Current selected recyclables
    const [subTypeList, setSubTypeList] = useState<string[]>([]);     //all selected sub type
    const { t, i18n } = useTranslation();

    useEffect(() => {
        //console.log("defaultRecycL:",defaultRecycL);
        if(defaultRecycL){
            setRecycTypeList(recyclables_getRecycTypes(defaultRecycL));
            setSubTypeList(recyclables_getSubTypes(defaultRecycL));
        }
    },[])

    useEffect(() => {
        console.log(toRecyclables());
        setState(toRecyclables());
    },[recycTypeList, subTypeList])

    const returnRecycTypes = () => {
        const recycItem: recycItem[] = [];
        //console.log("recycL: ", recycL);
        recycL.map((re) => { 
            var reItem: recycItem = {recycType: {name: "", id: ""}, recycSubType: []};
            var subItem: il_item[] = [];
            var name = "";
            switch(i18n.language){
                case "enus":
                    name = re.recyclableNameEng;
                    break;
                case "zhch":
                    name = re.recyclableNameSchi;
                    break;
                case "zhhk":
                    name = re.recyclableNameTchi;
                    break;
                default:
                    name = re.recyclableNameTchi;        //default fallback language is zhhk
                    break;
            }
            reItem.recycType = {name: name, id: re.recycTypeId};

            re.recycSubType.map((sub) => {
                var subName = "";
                switch(i18n.language){
                    case "enus":
                        subName = sub.recyclableNameEng;
                        break;
                    case "zhch":
                        subName = sub.recyclableNameSchi;
                        break;
                    case "zhhk":
                        subName = sub.recyclableNameTchi;
                        break;
                    default:
                        subName = sub.recyclableNameTchi;        //default fallback language is zhhk
                        break;
                }
                subItem.push({name: subName, id: sub.recycSubTypeId})
            })
            reItem.recycSubType = subItem;

            recycItem.push(reItem)
        });
        return(recycItem);
    };
 

    const returnRecyclables = (recycS: recycItem[]) => {       //transforming recyclables to string array with main items name only
        const recyclables: il_item[] = recycS.map((recyc) => {
            return recyc.recycType;
        });
        return recyclables;
    }

    const returnSubRecyclables = (recycId: string) => {       //return sub items of recyc
        const item: recycItem | undefined = returnRecycTypes().find((recycType) => {
            return recycType.recycType.id === recycId;
        });
        if (item) {
            const subItems = item.recycSubType
            return subItems;
        } else {
            return [];
        }
    }

    const returnSubTypesId = (id: string) => {
        var subTypesId: string[] = [];
        const re = returnRecycTypes().find((recyc) => {     //find the corresponding recyclable object
            return recyc.recycType.id == id;
        })
        if(re){
            re.recycSubType.map((sub) => {
                subTypesId.push(sub.id);
            })
        }
        return subTypesId;
    }

    const returnWithSubItem = () => {
        var withSubItem: string[] = []      //store the ids of recycType that have selected sub item
        recycTypeList.map((id) => {
            const subId = returnSubTypesId(id);
            subId.map((sub) => {
                if(subTypeList.includes(sub)){
                    withSubItem.push(id)
                }
            })
        });
        return withSubItem;
    }

    const selectRecyc = (str: string[]) => {        //do select and unselect action for main item
        if(recycTypeList.length < str.length){       //selecting new item
            setRecycTypeList(str)
        }else if(recycTypeList.length > str.length){     //unselecting an item
            const removeRecyc = recycTypeList.find((recyc) => {     //find the item that has been removed
                return !str.includes(recyc);
            });
            if(removeRecyc){
                const subId = returnSubTypesId(removeRecyc);
                const subList = subTypeList.filter((sub) => {       //remove the sub items of unselected item from sub type list
                    return !subId.includes(sub);
                })
                //console.log(subList);
                setSubTypeList(subList);
            }
            setRecycTypeList(str);
        }
    }
    const selectSubRecyc = (selectedSubType: string[]) => {
        setSubTypeList(selectedSubType);
    }

    const recyclables_getRecycTypes = (recycs: recyclable[]) => {
        const reTypes: string[] = recycs.map((recyc) => {
            return recyc.recycTypeId;
        });
        return reTypes;
    }

    const recyclables_getSubTypes = (recycs: recyclable[]) => {
        var subTypes: string[] = [];
        recycs.map((recyc) => {
            recyc.recycSubTypeId.map((sub) => {
                subTypes.push(sub);
            })
        });
        return subTypes;
    }

    const toRecyclables = () => {
        var recyclableS: recyclable[] = [];
        recycTypeList.map((recyc) => {
            const subId = returnSubTypesId(recyc);
            const subList = subTypeList.filter((sub) => {       //get the selected sub types of corresponding recyc type
                return subId.includes(sub);
            })
            console.log(subList);
            recyclableS.push({recycTypeId: recyc, recycSubTypeId: subList});
        });
        return recyclableS;
    }

    const getNameFromRecycId = (id: string) => {
        const reType = recycL.find((re) => {
            return re.recycTypeId == id
        });
        if(reType){
            switch(i18n.language){
                case "enus":
                    return reType.recyclableNameEng;
                case "zhch":
                    return reType.recyclableNameSchi;
                case "zhhk":
                    return reType.recyclableNameTchi;
                default:
                    return reType.recyclableNameTchi;        //default fallback language is zhhk
            }
        }
        return "";
    }

    return(
        <>
            <CustomItemList
                items={returnRecyclables(returnRecycTypes())}
                withSubItems={returnWithSubItem()}
                multiSelect={selectRecyc}
                setLastSelect={setCurRecyc}
                dbClickSelect={true}
                error={showError && recycTypeList.length == 0}
                defaultSelected={defaultRecycL? recyclables_getRecycTypes(defaultRecycL) : []}
            />
            <Collapse sx={{mt: 1}} in={curRecyc != " " && recycTypeList.length > 0} unmountOnExit>
                <CustomField label={curRecyc == " " ? "" : getNameFromRecycId(curRecyc) + t("col.category")}>
                    <CustomItemList
                        items={returnSubRecyclables(curRecyc)}
                        multiSelect={selectSubRecyc}
                        defaultSelected={subTypeList}
                        dbClickSelect={true}
                    />
                </CustomField>
            </Collapse>
        </>
        
    )
}