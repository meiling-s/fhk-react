import { Box, Button } from "@mui/material"
import { useEffect, useState } from "react"
import { styles } from "../../constants/styles"
type props = {
    items: string[],
    withSubItems?: string[],
    singleSelect?: (s: string) => void
    multiSelect?: (s: string[]) => void
    defaultSelected?: string[],     //just for setting the defaultSelected value of selectMulti
    setLastSelect?: (s: string) => void        //for determinding the last selected item
    dbClickSelect?: boolean,
}
function CustomItemList({
    items,
    withSubItems,
    singleSelect,
    multiSelect,
    defaultSelected,
    setLastSelect,
    dbClickSelect
}: props){
    const [selectSingle, setSelectSingle] = useState<string>("");
    const [selectMulti, setSelectMulti] = useState<string[]>([]);
    const [LS, setLS] = useState<string>(" ");      //last select
    useEffect(()=>{
        if(defaultSelected && multiSelect){
            setSelectMulti(defaultSelected);
        }
    },[])
    if(!(singleSelect || multiSelect)){        //if none of the select method exist
        return(
            <></>
        )
    }
    //determine currently using single select or multi select, do action accordingly
    const handleSelect = (select: string) => {
        var selectAction: boolean = true;       //true = doing select, false = doing unselect
        if(singleSelect){
            if(selectSingle!="" && selectSingle==select){       //if selected, do unselect
                setSelectSingle("");
                singleSelect("");
                selectAction=false;
            }else{      //if unselected, do select
                setSelectSingle(select);
                singleSelect(select);
            }
        }else if(multiSelect){
            const selected = Object.assign([],selectMulti);
            if(selected.includes(select)){      //if selected, do unselect
                setSelectMulti(Object.values(selected).filter((s)=>( s != select)));
                multiSelect(Object.values(selected).filter((s)=>( s != select)));
                selectAction=false;
            }else{      //if unselected, do select
                selected.push(select)
                setSelectMulti(selected);
                multiSelect(selected);
            }
        }
        if(setLastSelect){
            setLastSelect(selectAction? select : " ");
            setLS(selectAction? select : " ");
        }
    }
    const handleSingleClick = (select: string) => {     //condition to go into this function: on single click & dbClickSelect == true
        if(setLastSelect && selectMulti.includes(select)){      //when parent provided the function for setLastSelect(set current select item) and this item is already selected, switch current select item to it
            setLastSelect((LS == select)? " " : select);
            setLS((LS == select)? " " : select);
        }
    }
    const returnTheme = (s: string) => {
        var theme = localstyles.item;
        if(singleSelect){
            if(selectSingle == s){
                theme = localstyles.triggered;
            }
        }else if(multiSelect){
            if(selectMulti.includes(s)){
                if(withSubItems && withSubItems.includes(s)){
                    theme = localstyles.withSubItems;
                }else{
                    theme = localstyles.triggered; 
                }
            }
        }
        return theme;
    }
    return(
        <Box sx={localstyles.container}>
            {
                items.map((item) => (
                    <Button
                        variant="outlined"
                        sx={returnTheme(item)}
                        onClick={()=>{dbClickSelect? handleSingleClick(item) : handleSelect(item)}}
                        onDoubleClick={(event) => {dbClickSelect && handleSelect(item)}}>
                        {item}
                    </Button>
                ))
            }
        </Box>
    )
}
const localstyles = {
    container: {
        mt: 1,
        display: "flex",
        flexDirection: "row",
    },
    item: {
        ...styles.listItemTemp,
        backgroundColor: "white",
        borderColor: "#D1D1D1",
        color: "#535353",
        '&.MuiButton-root:hover':{
            //bgcolor: "#F4F4F4",
            borderColor: "#D1D1D1"
        }
    },
    triggered: {
        ...styles.listItemTemp,
        backgroundColor: "#E4F6DC",
        borderColor: "#79CA25",
        color: "#535353",
        '&.MuiButton-root:hover':{
            //bgcolor: "#F4F4F4",
            borderColor: "#79CA25"
        }
    },
    withSubItems: {
        ...styles.listItemTemp,
        backgroundColor: "#79CA25",
        borderColor: "#79CA25",
        color: "#FFFFFF",
        '&.MuiButton-root:hover':{
            //bgcolor: "#F4F4F4",
            borderColor: "#79CA25"
        }
    }
}
export default CustomItemList