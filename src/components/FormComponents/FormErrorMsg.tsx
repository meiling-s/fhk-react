import { Box, Button, Typography } from "@mui/material";
import { t } from "i18next";
import { styles } from "../../constants/styles";

type props = {
    type?: string,
    field: string,
    errorMsg: string,
    setContinue?: () => void 
}

export function FormErrorMsg({
    type,
    field,
    errorMsg,
    setContinue
}: props){

    const warning = type? type == "warning"? true : false : false;

    return(
        <Box sx={warning? localstyles.container_warning : localstyles.container}>
            <Box sx={{display: "flex", flexDirection: "row", flex: 9, alignItems: "center"}}>
                <Typography sx={warning? localstyles.txtField_warning : localstyles.txtField}>
                {field}
                </Typography>
                <Typography sx={warning? localstyles.txtErrorMsg_warning :localstyles.txtErrorMsg}>
                    {errorMsg}
                </Typography>
            </Box>
            
            {
                type&& type == "warning"&&
                    <Button sx={{...styles.buttonFilledGreen, flex: 1}} onClick={() => setContinue&& setContinue()}>
                        {t("continue")}
                    </Button>
            }
        </Box>
        
    );
}

let localstyles = {
    container: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        marginY: 1.5,
        p: 2,
        pl: 3,
        backgroundColor: "#F7BCC6",
        borderRadius: 5
    },
    txtField: {
        fontWeight: "bold",
        color: "red"
    },
    txtErrorMsg: {
        color: "red"
    },
    container_warning: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        marginY: 1.5,
        p: 2,
        pl: 3,
        backgroundColor: "#F6F4B7",
        borderRadius: 5
    },
    txtField_warning: {
        fontWeight: "bold",
        color: "#ec942c"
    },
    txtErrorMsg_warning: {
        color: "#ec942c"
    }
}