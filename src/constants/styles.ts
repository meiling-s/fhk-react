import { layout } from "./constant";
export const styles = {
    innerScreen: {
        display: "flex",
        minHeight: `calc(100vh - ${layout.appbarHeight} - ${layout.innerScreen_padding} )`,
        ml: `${layout.drawerWidth}px`,
        mt:{lg:layout.appbarHeight,sm:'100px'},
        backgroundColor: "#F4F5F7",
        pl: layout.innerScreen_padding,
        pt: layout.innerScreen_padding
    },
    innerScreen_container: {
        width: "100%",
        height: "100%",
        display:'flex',
        flexDirection: 'column',
        pr: layout.innerScreen_padding,
        pb: layout.innerScreen_padding
    },
    mobileScreen:{
        ml: 0,
        pl: 0,
        pt: 0
    },
    headerSection: {
        display: "flex",    
        flexDirection: "row",
        alignItems: "center",
        color: "black"
    },
    gridForm: {
        alignItems: "flex-start"
    },
    header1: {
        fontSize: 25,
        fontWeight: "bold"
    },
    header2: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#717171"
    },
    header3: {
        fontSize: 16,
        color: "#ACACAC"
    },
    header4: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold'
    },
    formDataText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000000"
    },
    buttonFilledGreen: {
        borderRadius: "40px",
        borderColor: "#79ca25",
        backgroundColor: "#79CA25",
        color: "white",
        fontWeight: "bold",
        '&.MuiButton-root:hover':{
            backgroundColor: "#7AD123",
            border: "2px solid #D0DFC2"
        }
    },
    buttonOutlinedGreen: {
        borderRadius: "40px",
        border: 1,
        borderColor: "#79ca25",
        backgroundColor: "white",
        color: "#79ca25",
        fontWeight: "bold",
        '&.MuiButton-root:hover':{
            bgcolor: "#F4F4F4"
        }
    },
    buttonOutlinedGreen_2: {
        padding: 2,
        borderRadius: 3,
        border: 1,
        borderColor: "#79ca25",
        backgroundColor: "white",
        color: "#79ca25",
        fontWeight: "bold",
        '&.MuiButton-root:hover':{
            bgcolor: "#F4F4F4"
        }
    },
    mapRightContainer: {
        width: "50%",
        height: `calc(100vh - ${layout.appbarHeight})`,
        mt: -4
    },
    textField: {
        borderRadius: 5,
        backgroundColor: "white",
        "& fieldset":{
            borderRadius: 5,
        }
    },
    inputProps: {
        '&:hover fieldset': {
            borderColor: "#A8A8A8 !important"
        },
        '&:focus-within fieldset, &:focus-visible fieldset': {
            borderColor: "#79CA25 !important",
        }
    },
    endAdornmentIcon: {
        fontSize: 25,
        color: "#79CA25"
    },
    disableIcon: {
        fontSize: 25,
        color: "#ACACAC"
    },
    listItemTemp: {     //list item template, general style of custom list item in all state
        paddingX: 1.5,
        paddingY: 1,
        mr: 1,
        borderWidth: 1,
        borderRadius: 50,
        fontWeight: "bold"
    },
    imageContainer:{
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
     
    },
    buttonBlack: {
        color: "#000000"
    },
}