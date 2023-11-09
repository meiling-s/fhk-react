import {
    Box,
    Button,
    Collapse,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import { styles } from "../../constants/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CustomField from "../../components/FormComponents/CustomField";
import { useEffect, useState } from "react";
import { createCP, openingPeriod, recyclable, serviceHr } from "../../interfaces/collectionPoint";
import CustomTextField from "../../components/FormComponents/CustomTextField";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useDebounce from "../../hooks/useDebounce";
import { getLocation } from "../../APICalls/getLocation";
import { MapData } from "../../interfaces/map";
import CustomTimePicker from "../../components/FormComponents/CustomTimePicker";
import CustomSwitch from "../../components/FormComponents/CustomSwitch";
import CustomItemList from "../../components/FormComponents/CustomItemList";
import CustomDatePicker from "../../components/FormComponents/CustomDatePicker";
import { useNavigate } from "react-router-dom";
import { createCollectionPoint, getAllCollectionPoint } from "../../APICalls/collectionPointManage";
import { format } from "../../constants/constant";


const cpTypes: string[] = ["固定服務點", "流動服務點", "上門服務點"];
const enginLandCats: string[] = [
    "房屋工程工地",
    "大型基建工程工地",
    "重建工程工地",
];
const premiseCats: string[] = ["單幢樓", "公共屋邨", "私人屋苑"];
const recycItems: recyclable[] = [{
    recycTypeId: "廢紙",
    recycSubtypeId: ["紙皮", "報紙"]
},
{
    recycTypeId: "金屬",
    recycSubtypeId: ["金屬1", "金屬2"]
},
{
    recycTypeId: "塑膠",
    recycSubtypeId: ["塑膠1", "塑膠2"]
}]

function CreateCollectionPoint() {
    const [cpType, setCPType] = useState<string>("");
    const [cpName, setCPName] = useState<string>("");
    const [cpAddress, setCPAddress] = useState<string>("");
    const [contact, setContact] = useState<string>("");
    const [openingPeriod, setOpeningPeriod] = useState<openingPeriod>({startDate: dayjs(new Date(),format.dateFormat3), endDate: dayjs(new Date(),format.dateFormat3)});
    const [sHr, setSHr] = useState<serviceHr[]>([]);
    const [enginLandCat, setEnginLandCat] = useState<string>(""); //Engineering land category
    const [premiseName, setPremiseName] = useState<string>(""); //Name of the house/place
    const [premiseCat, setPremiseCat] = useState<string>(""); //Category of the house/place
    const [remark, setRemark] = useState<string>("");
    const [openState, setOpenState] = useState<boolean>(true);
    const [recycCat, setRecycCat] = useState<recyclable[]>([]);     //Recyclables category
    const [curRecycCat, setCurRecycCat] = useState<string>(" ");     //Current selected recyclables category
    const [fullSubItemList, setFullSubItemList] = useState<string[]>([]);     //Sub-items of current selected recyclables category
    const [employeeNum, setEmployeeNum] = useState<number>(0);
    const [EPDEnable, setEPDEnable] = useState<boolean>(false);
    const [serviceType, setServiceType] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>("");
    const [listPlace, setListPlace] = useState<any[]>([]);
    const debouncedSearchValue: string = useDebounce(searchText, 1000);
    const [selectPosition, setSelectPosition] = useState<number[]>([0, 0]);

    const navigate = useNavigate();

    const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (cpAddress) {
          setCPAddress("");
        }
        setSearchText(e.target.value);
    }
    console.log(selectPosition)

    useEffect(() => {
        console.log("curRecycCat: ", curRecycCat);
    }, [curRecycCat])

    useEffect(() => {
        localStorage.setItem("selectedLatitude", selectPosition[0] + "");
        localStorage.setItem("selectedLongtitude", selectPosition[1] + "");
        localStorage.setItem("selectedCollectionName", cpName);
        localStorage.setItem("selectedCollectionType", cpType);
        localStorage.setItem("selectedcpAddress", cpAddress);
    }, [selectPosition, cpName, cpType, cpAddress]);

    useEffect(() => {
        if (debouncedSearchValue) {
          getLocation(debouncedSearchValue)
            .then((response) => {
              const result = response.data.results;
              setListPlace(result);
            })
            .catch((error) => {
              console.log("Error fetching data:", error);
            });
        } else {
          setListPlace([]);
        }
    }, [debouncedSearchValue]);

    useEffect(()=>{
        console.log("listplace: ",listPlace);
    },[listPlace])

    const returnRecyclables = (recycS: recyclable[]) => {       //transforming recyclables to string array with main items name only
        const recyclables: string[] = recycS.map((recyc) => {
            return recyc.recycTypeId;
        });
        return recyclables;
    }

    const returnSubRecyclables = (recyc: string) => {       //return sub items of recyc
        const item: recyclable | undefined = recycItems.find((recycItem) => {
            return recycItem.recycTypeId === recyc;
        });
        if (item) {
            const subItems = item.recycSubtypeId
            return subItems;
        } else {
            return [];
        }
    }

    const returnWithSubItem = () => {
        const recyc = recycCat.filter((items) => {
            return items.recycSubtypeId.length > 0;
        });
        return returnRecyclables(recyc);
    }
    const selectRecyc = (str: string[]) => {        //do select and unselect action for main item
        const tempRecycItem = returnRecyclables(recycCat);      //current selected main item
        var RecycItemDif: string[] = [];        //Recyclables item difference, used for storing the difference between current selected list and new selected list
        if (tempRecycItem.length < str.length) {        //selected a new item
            RecycItemDif = str.filter((s) => {        //getting the difference for adding item(s) to the selected list
                return !tempRecycItem.includes(s)
            });
            if (RecycItemDif.length > 0) {
                const newRecyc = Object.assign([], recycCat);
                RecycItemDif.map((recyc) => {
                    newRecyc.push({ recycTypeId: recyc, recycSubtypeId: [] });
                })
                setRecycCat(newRecyc);
            }
        } else if (tempRecycItem.length > str.length) {      //unselected a item
            RecycItemDif = tempRecycItem.filter((recyc) => {      //getting the difference for item(s) extraction from the selected list
                return !str.includes(recyc)
            });
            if (RecycItemDif.length > 0) {
                const newRecyc: recyclable[] = recycCat.filter((recyc) => {
                    //remove subitem of this main item from full sub item list
                    if (RecycItemDif.includes(recyc.recycTypeId)) {
                        //remove subitem of this main item from full sub item list
                        const newFullSubItemList = fullSubItemList.filter((subitem) => {
                            return !returnSubRecyclables(recyc.recycTypeId).includes(subitem);
                        })
                        setFullSubItemList(newFullSubItemList);
                    }
                    return !RecycItemDif.includes(recyc.recycTypeId);
                })
                setRecycCat(newRecyc);
                //setCurRecycCat(" ");     //reset the current selected recyclable since the last selected item has been unselected
            }
        }

        //console.log(RecycItemDif, tempRecycItem.length, str.length);
    }
    const selectSubRecyc = (s: string[]) => {       //do select and unselect action for sub item
        var recycS: recyclable[] = recycCat.map((recyc) => {
            if (recyc.recycTypeId === curRecycCat) {
                recyc.recycSubtypeId = returnSubRecyclables(curRecycCat).filter((subItems) => {     //get the full list of sub items of current selected main item and check the overlapping part
                    return s.includes(subItems);
                })
            }
            return recyc;
        });
        setRecycCat(recycS);
        setFullSubItemList(s);
    }

    const handleCreateOnClick = async () => {
        const ST: string[] = sHr.map((value) => value.startFrom.toString());
        const ET: string[] = sHr.map((value) => value.endAt.toString());
        const cp: createCP = {
            colName: cpName,
            colPointTypeId: cpType,
            effFrmDate: openingPeriod?.startDate.toString(),
            effToDate: openingPeriod?.endDate.toString(),
            startTime: ST,
            endTime: ET,
            address: cpAddress,
            gpsCode: "",
            isEpd: EPDEnable,
            isExtraService: !serviceType,
            siteTypeId: "",
            contractNo: "",
            noOfStaff: employeeNum,
            status: openState? "ACTIVE" : "INACTIVE",
            premiseName: premiseName,
            premiseTypeId: premiseCat,
            premiseRemark: remark,
            isNormal: true,
            createdBy: "colAdmin",
            updatedBy: "colAdmin",
            colPtRecyc: recycCat
        }
        const result = await createCollectionPoint(cp);
        const data = result?.data;
        if(data){
            console.log("all collection point: ",data);
        }
        navigate(-1);       //goback to last page
    }

    const handleCancelOnClick = () => {
        console.log("Cancel click");
        navigate(-1);       //goback to last page
    }

    const handleHeaderOnClick = () => {
        console.log("Header click");
        navigate(-1);       //goback to last page
    }

    //   const locationSelect = (setState: (s: string) => void) => {
    //     return (
    //       <IconButton
    //         aria-label="select location"
    //         size="medium"
    //         onClick={() => setState("testing")}
    //       >
    //         <LocationOnIcon sx={styles.endAdornmentIcon} />
    //       </IconButton>
    //     );
    //   };

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
                <Grid container direction={"column"} spacing={2.5} sx={styles.gridForm}>
                    <Grid item>
                        <Button sx={[styles.headerSection]} onClick={() => handleHeaderOnClick()}>
                            <ArrowBackIosIcon sx={{ fontSize: 15, marginX: 0.5 }} />
                            <Typography sx={styles.header1}>建立回收點</Typography>
                        </Button>
                    </Grid>

                    <CustomField label={"回收點類別"} necessary={true}>
                        <CustomItemList
                            items={cpTypes}
                            singleSelect={setCPType}
                        />
                    </CustomField>

                    <CustomField label={"回收點名稱"}>
                        <CustomTextField
                            id="cpName"
                            placeholder="請輸入名稱"
                            onChange={(event) => setCPName(event.target.value)}
                        />
                    </CustomField>

                    <CustomField label={"地點"}>
                        <CustomTextField
                        id="location"
                        placeholder="請輸入地點"
                        onChange={(event) => handleSearchTextChange(event)}
                        // endAdornment={locationSelect(setCPLocation)}
                        value={cpAddress ? cpAddress : searchText}
                        />
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                                borderColor: "black",
                            }}
                        >
                            {listPlace&&(
                                <List key={listPlace[0]?.place_id}>
                                    <ListItemButton
                                    onClick={() => {
                                        setSelectPosition([listPlace[0]?.geometry?.location?.lat,listPlace[0]?.geometry?.location?.lng]);
                                        setCPAddress(listPlace[0].formatted_address);
                                    }}
                                    >
                                    <ListItemText>{listPlace[0]?.formatted_address}</ListItemText>
                                    </ListItemButton>
                                    <Divider />
                                </List>
                            )}
                        </Box>
                    </CustomField>

                    <CustomField label={"聯絡"}>
                        <CustomTextField
                            id="contact"
                            placeholder="請輸入聯絡號碼"
                            onChange={(event) => setContact(event.target.value)}
                        />
                    </CustomField>

                    <CustomField label={"開放日期由"}>
                        <CustomDatePicker setDate={setOpeningPeriod}/>
                    </CustomField>

                    <CustomField label={"服務時間"}>
                        <CustomTimePicker multiple={true} setTime={setSHr} />
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
                            onChange={(event) => setPremiseName(event.target.value)}
                        />
                    </CustomField>

                    <CustomField label={"房屋或場所類別"}>
                        <CustomItemList
                            items={premiseCats}
                            singleSelect={setPremiseCat}
                        />
                    </CustomField>

                    <CustomField label={"備註"}>
                        <CustomTextField
                            id="remark"
                            placeholder="請輸入文字"
                            onChange={(event) => setRemark(event.target.value)}
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

                    <Grid item sx={{ width: "100%" }}>
                        <Divider />
                    </Grid>

                    <Grid item>
                        <Typography sx={styles.header2}>回收物資料</Typography>
                    </Grid>

                    <CustomField label={"可回收物類別"} necessary={true}>
                        <CustomItemList
                            items={returnRecyclables(recycItems)}
                            withSubItems={returnWithSubItem()}
                            multiSelect={selectRecyc}
                            setLastSelect={setCurRecycCat}
                            dbClickSelect={true}
                        />
                    </CustomField>
                    <Grid item>
                        <Collapse in={curRecycCat != " " && recycCat.length > 0} unmountOnExit>
                            <CustomField label={curRecycCat == " " ? "" : curRecycCat + "類別"}>
                                <CustomItemList
                                    items={returnSubRecyclables(curRecycCat)}
                                    multiSelect={selectSubRecyc}
                                    defaultSelected={fullSubItemList}
                                    dbClickSelect={true}
                                />
                            </CustomField>
                        </Collapse>
                    </Grid>

                    <Grid item sx={{ width: "100%" }}>
                        <Divider />
                    </Grid>

                    <Grid item>
                        <Typography sx={styles.header2}>員工資料</Typography>
                    </Grid>

                    <CustomField label={"員工數量"}>
                        <CustomTextField
                            id="remark"
                            placeholder="請輸入人數"
                            onChange={(event) => {
                                const value = event.target.value;
                                if (!isNaN(+value)) {
                                    //if value is number
                                    setEmployeeNum(parseInt(value));
                                }
                            }}
                        />
                    </CustomField>

                    <Grid item sx={{ width: "100%" }}>
                        <Divider />
                    </Grid>

                    <Grid item>
                        <Typography sx={styles.header2}>服務資料</Typography>
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
                    <Grid item>
                        <Button sx={[styles.buttonFilledGreen, localstyles.localButton]} onClick={() => handleCreateOnClick()}>
                            建立
                        </Button>
                        <Button sx={[styles.buttonOutlinedGreen, localstyles.localButton]} onClick={() => handleCancelOnClick()}>
                            取消
                        </Button>
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </>
    );
}
const localstyles = {
    timeText: {
        color: "#ACACAC",
        fontWeight: "500"
    },
    localButton: {
        width: "200px",
        fontSize: 18,
        mr: 3
    }
};

export default CreateCollectionPoint;
