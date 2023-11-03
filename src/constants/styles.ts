import { layout } from "./constant";

export const styles = {
    innerScreen: {
        display: "flex",
        width: `calc(100% - ${layout.drawerWidth}px)`,
        height: "100%",
        ml: `${layout.drawerWidth}px`,
        mt: layout.appbarHeight,
        backgroundColor: "#F4F5F7",
        p: 4
    },
    mapRightContainer: {
        width: "50%",
        height: `calc(100vh - ${layout.appbarHeight})`,
        mt: -4,
        ml: 4
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