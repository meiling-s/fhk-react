import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

type props = {
    onText: string,
    offText: string,
    setState: (b: boolean) => void,
    defaultValue?: boolean,
    disabled?: boolean
    value?: string,
}

export default function Switches({
    onText,
    offText,
    defaultValue,
    setState,
    disabled,
    value
}: props) {
    const [onOff, setOnOff] = useState<boolean>((defaultValue!=undefined)? defaultValue : false);

    const handleSwitchChange = () => {
        if(disabled){
            return;
        }
        setState(!onOff);
        setOnOff(!onOff);
    }
  
    return (
        <Button sx={localstyles.container} onClick={() => handleSwitchChange()}>
            <Box sx={[disabled? localstyles.switch_disabled : localstyles.switch,{ml: onOff? "5px" : "105px"}]} />
            <Typography sx={localstyles.onOffLabel}>
                {onText}
            </Typography>
            <Typography sx={localstyles.onOffLabel}>
                {offText}
            </Typography>
        </Button>
    );
}

const localstyles = {
    container: {
        display: "flex",
        flexDirection: "row",
        width: "200px",
        height: "60px",
        backgroundColor: "#E2E2E2",
        borderRadius: 50,
        justifyContent: "flex-start",
        padding: 0
    },
    switch: {
        width: "90px",
        height: "50px",
        backgroundColor: "white",
        ml: "5px",
        position: "absolute",
        borderRadius: 50,
        transition: "transform 1s"
    },
    switch_disabled: {
        width: "90px",
        height: "50px",
        backgroundColor: "#CBCBCB",
        ml: "5px",
        position: "absolute",
        borderRadius: 50,
        transition: "transform 1s"
    },
    onOffLabel: {
        zIndex: 1,
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        color: "#717171",
        fontWeight: "bold"
    }
}