import { Box, Button, Divider, Grid, IconButton, List, ListItem, Typography } from "@mui/material";
import { styles } from "../../constants/styles";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CustomField from "../../components/CustomField";
import { useEffect, useState } from "react";
import { openingPeriod, serviceHr } from "../../interfaces/collectionPoint";
import CustomTextField from "../../components/CustomTextField";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CustomTimePicker from "../../components/CustomTimePicker";
import CustomSwitch from "../../components/CustomSwitch";
import CustomItemList from "../../components/CustomItemList";
import CustomDatePicker from "../../components/CustomDatePicker";

const cpTypes: string[] = ["固定服務點","流動服務點","上門服務點"];
const enginLandCats: string[] = ["房屋工程工地","大型基建工程工地","重建工程工地"];
const housePlaceCats: string[] = ["單幢樓","公共屋邨","私人屋苑"];
const recyclable: string[] = ["廢紙","金屬","塑膠"]

function CreateCollectionPoint(){

    const [cpType, setCPType] = useState<string>();
    const [cpName, setCPName] = useState<string>();
    const [cpLocation, setCPLocation] = useState<string>();
    const [contact, setContact] = useState<string>();
    const [openingPeriod, setOpeningPeriod] = useState<openingPeriod>();
    const [sHr, setSHr] = useState<serviceHr[]>([]);
    const [enginLandCat, setEnginLandCat] = useState<string>();     //Engineering land category
    const [housePlaceName, setHousePlaceName] = useState<string>();   //Name of the house/place
    const [housePlaceCat, setHousePlaceCat] = useState<string>();   //Category of the house/place
    const [remark, setRemark] = useState<string>();
    const [openState, setOpenState] = useState<boolean>(true);
    const [recycCat, setRecycCat] = useState<string[]>([]);     //Recyclables category
    const [employeeNum, setEmployeeNum] = useState<number>();
    const [EPDEnable, setEPDEnable] = useState<boolean>(false);
    const [serviceType, setServiceType] = useState<boolean>(true);

    const locationSelect = (setState:(s: string) => void) => {
        return(
            <IconButton aria-label="select location" size="medium" onClick={()=>setState("testing")}>
                <LocationOnIcon
                    sx={styles.endAdornmentIcon}
                />
            </IconButton>
        )
    }

    return(
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
            <Grid container direction={"column"} spacing={2.5} sx={localstyles.form}>
                <Grid item>
                    <Button sx={[localstyles.headerSection]}>
                        <ArrowBackIosIcon sx={{fontSize: 15, marginX: 0.5}}/>
                        <Typography sx={localstyles.header1}>
                            建立回收點
                        </Typography>
                    </Button>
                </Grid>

                <Grid item>
                    <Typography sx={localstyles.header2}>
                        地點資料
                    </Typography> 
                </Grid>
                
                <CustomField label={"回收點類別"}>
                    <CustomItemList
                        items={cpTypes}
                        singleSelect={setCPType}
                    />
                </CustomField>

                <CustomField label={"回收點名稱"}>
                    <CustomTextField
                        id="cpName"
                        placeholder="請輸入名稱"
                        onChange={(event)=>setCPName(event.target.value)}
                    />
                </CustomField>

                <CustomField label={"地點"}>
                    <CustomTextField
                        id="location"
                        placeholder="請輸入地點"
                        onChange={(event)=>setCPLocation(event.target.value)}
                        endAdornment={locationSelect(setCPLocation)}
                    />
                </CustomField>

                <CustomField label={"聯絡"}>
                    <CustomTextField
                        id="contact"
                        placeholder="請輸入聯絡號碼"
                        onChange={(event)=>setContact(event.target.value)}
                    />
                </CustomField>

                <CustomField label={"開放日期由"}>
                    <CustomDatePicker
                        setState={setOpeningPeriod}
                    /> 
                </CustomField>

                <CustomField label={"服務時間"}>
                    <CustomTimePicker
                        multiple={true}
                        setTime={setSHr}
                    />                    
                </CustomField>

                <CustomField label={"工程用地類別"}>
                    <CustomItemList
                        items={enginLandCats}
                        singleSelect={setEnginLandCat}
                    />
                </CustomField>
                    
                <CustomField label={"房屋或場所名稱"}>
                    <CustomTextField
                        id="HouseOrPlaceName"
                        placeholder="請輸入名稱"
                        onChange={(event)=>setHousePlaceName(event.target.value)}
                    />
                </CustomField>

                <CustomField label={"房屋或場所類別"}>
                    <CustomItemList
                        items={housePlaceCats}
                        singleSelect={setHousePlaceCat}
                    />
                </CustomField>

                <CustomField label={"備註"}>
                    <CustomTextField
                        id="remark"
                        placeholder="請輸入文字"
                        onChange={(event)=>setRemark(event.target.value)}
                    />
                </CustomField>

                <CustomField label={"開放收態"}>
                    <CustomSwitch
                        onText="開放"
                        offText="關閉"
                        defaultValue={true}
                        setState={setOpenState}
                    />
                </CustomField>

                <Grid item sx={{width:"100%"}}>
                   <Divider /> 
                </Grid>

                <Grid item>
                    <Typography sx={localstyles.header2}>
                        回收物資料
                    </Typography>  
                </Grid>

                <CustomField label={"可回收物類別"}>
                    <CustomItemList
                        items={recyclable}
                        multiSelect={setRecycCat}
                    />
                </CustomField>

                <Grid item sx={{width:"100%"}}>
                   <Divider /> 
                </Grid>

                <Grid item>
                    <Typography sx={localstyles.header2}>
                        員工資料
                    </Typography>  
                </Grid>

                <CustomField label={"員工數量"}>
                    <CustomTextField
                        id="remark"
                        placeholder="請輸入人數"
                        onChange={(event)=>{
                            const value = event.target.value
                            if(!isNaN(+value)){     //if value is number
                                setEmployeeNum(parseInt(value)); 
                             }
                        }}
                    />
                </CustomField>

                <Grid item sx={{width:"100%"}}>
                   <Divider /> 
                </Grid>

                <Grid item>
                    <Typography sx={localstyles.header2}>
                        服務資料
                    </Typography>  
                </Grid>

                <CustomField label={"是否EPD 服務"}>
                    <CustomSwitch
                        onText="是"
                        offText="否"
                        defaultValue={false}
                        setState={setEPDEnable}
                    />
                </CustomField>

                <CustomField label={"服務種類"}>
                    <CustomSwitch
                        onText="基本"
                        offText="額外"
                        defaultValue={true}
                        setState={setServiceType}
                    />
                </CustomField>
            </Grid>
            </LocalizationProvider>
        </>
    )
}

const localstyles = {
    headerSection: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        color: "black"
    },
    form: {
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
    timePicker: {
        ...styles.textField,
        maxWidth: "150px"
    }
}

export default CreateCollectionPoint;