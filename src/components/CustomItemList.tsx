import { Box, Button } from "@mui/material"
import { useState } from "react"

type props = {
    items: string[],
    singleSelect?: (s: string) => void
    multiSelect?: (s: string[]) => void
}

function CustomItemList({
    items,
    singleSelect,
    multiSelect
}: props){

    const [selectSingle, setSelectSingle] = useState<string>("");
    const [selectMulti, setSelectMulti] = useState<string[]>([]);

    if(!(singleSelect || multiSelect)){        //if none of the select method exist
        return(
            <></>
        )
    }

    const handleSelect = (select: string) => {
        if(singleSelect){
            setSelectSingle(select);
            singleSelect(select);
        }else if(multiSelect){
            const selected = Object.assign([],selectMulti);
            if(selected.includes(select)){
                setSelectMulti(Object.values(selected).filter((s)=>( s != select)));
                multiSelect(Object.values(selected).filter((s)=>( s != select)));
            }else{
                selected.push(select)
                setSelectMulti(selected);
                multiSelect(selected);
            }
        }
    }

    const checkIsSelected = (s: string) => {
        var result = false;
        if(singleSelect){
            if(selectSingle == s){
                result = true;
            }
        }else if(multiSelect){
            if(selectMulti.includes(s)){
                result = true;
            }
        }
        return result;
    }

    return(
        <Box sx={localstyles.container}>
            {
                items.map((item) => (
                    <Button
                        variant="outlined"
                        sx={checkIsSelected(item)? localstyles.triggered : localstyles.item}
                        onClick={()=>handleSelect(item)}>
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
        backgroundColor: "white",
        paddingX: 1.5,
        paddingY: 1,
        mr: 1,
        borderWidth: 1,
        borderColor: "#D1D1D1",
        borderRadius: 50,
        color: "#535353",
        fontWeight: "bold",
        '&.MuiButton-root:hover':{
            //bgcolor: "#F4F4F4",
            borderColor: "#D1D1D1"
        }
    },
    triggered: {
        backgroundColor: "#E4F6DC",
        paddingX: 1.5,
        paddingY: 1,
        mr: 1,
        borderWidth: 1,
        borderColor: "#79CA25",
        borderRadius: 50,
        color: "#535353",
        fontWeight: "bold",
        '&.MuiButton-root:hover':{
            //bgcolor: "#F4F4F4",
            borderColor: "#79CA25"
        }
    }
}

export default CustomItemList