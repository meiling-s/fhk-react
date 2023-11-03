import { layout } from "./constant";

export const styles = {
    innerScreen: {
        display: "flex",
        width: `calc(100% - ${layout.drawerWidth}px)`,
        height: "100vh",
        ml: `${layout.drawerWidth}px`,
        mt: "64px",
        backgroundColor: "#F4F5F7",
        p: 4
    },
    textField: {
        borderRadius: 5,
        backgroundColor: "white",
        "& fieldset":{
            borderRadius: 5,
        }
    },
    endAdornmentIcon: {
        fontSize: 25,
        color: "#79CA25"
    },
    disableIcon: {
        fontSize: 25,
        color: "#ACACAC"
    }
}