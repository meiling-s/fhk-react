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
    Tooltip,
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
import CustomItemList, { il_item } from "../../components/FormComponents/CustomItemList";
import CustomDatePicker from "../../components/FormComponents/CustomDatePicker";
import { useNavigate } from "react-router-dom";
import { createCollectionPoint, getAllCollectionPoint } from "../../APICalls/collectionPointManage";
import { format } from "../../constants/constant";
import { useTranslation } from "react-i18next";
import { getCommonTypes } from "../../APICalls/commonManage";
import { colPointType, premiseType, siteType } from "../../interfaces/common";
import { toast } from "react-toastify";

type recycItem = {
    recycType: il_item,
    recycSubtype: il_item[]
}

const recycTypes: recycItem[] = [{
    recycType: {name: "廢紙", id: "RC00002"},
    recycSubtype: [{name: "紙包飲品盒", id: "RSC00014"}, {name: "包裝紙皮", id: "RSC00011"}]
},
{
    recycType: {name: "金屬", id: "RC00003"},
    recycSubtype: [{name: "鋁罐", id: "RSC00016"}, {name: "罐頭", id: "RSC00015"}]
},
{
    recycType: {name: "塑膠", id: "RC00001"},
    recycSubtype: [{name: "膠樽", id: "RSC00001"}, {name: "膠杯", id: "RSC00002"}]
}]

function CreateCollectionPoint() {

    const [colType, setCOLType] = useState<string>("");
    const [colName, setCOLName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [gpsCode, setGPSCode] = useState<number[]>([0, 0]);
    const [openingPeriod, setOpeningPeriod] = useState<openingPeriod>({ startDate: dayjs(new Date()), endDate: dayjs(new Date()) });
    const [sHr, setSHr] = useState<serviceHr[]>([]);
    const [siteType, setSiteType] = useState<string>(""); //site type
    const [contractNo, setContractNo] = useState<string>("");
    const [premiseName, setPremiseName] = useState<string>(""); //Name of the house/place
    const [premiseType, setPremiseType] = useState<string>(""); //Category of the house/place
    const [premiseRemark, setPremiseRemark] = useState<string>("");
    const [status, setStatus] = useState<boolean>(true);
    const [colRecyc, setCOLRecyc] = useState<string[]>([]);     //Recyclables
    const [curRecyc, setCurRecyc] = useState<string>(" ");     //Current selected recyclables
    const [subTypeList, setSubTypeList] = useState<string[]>([]);     //all selected sub type
    const [staffNum, setStaffNum] = useState<number>(NaN);
    const [EPDEnable, setEPDEnable] = useState<boolean>(false);
    const [serviceType, setServiceType] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>("");
    const [listPlace, setListPlace] = useState<any[]>([]);
    const [trySubmited, setTrySubmited] = useState<boolean>(false);
    const [validation, setValidation] = useState<{ field: string, problem: string }[]>([]);
    const [typeList, setTypeList] = useState<{colPoint: colPointType[], premise: premiseType[], site: siteType[]}>({colPoint: [], premise: [], site: []});
    const debouncedSearchValue: string = useDebounce(searchText, 1000);

    const navigate = useNavigate();

    const { t, i18n } = useTranslation();

    const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (address) {
            setAddress("");
        }
        setSearchText(e.target.value);
    }

    // useEffect(() => {
    //     localStorage.setItem("selectedLatitude", gpsCode[0] + "");
    //     localStorage.setItem("selectedLongtitude", gpsCode[1] + "");
    //     localStorage.setItem("selectedCollectionName", colName);
    //     localStorage.setItem("selectedCollectionType", colType);
    //     localStorage.setItem("selectedcpAddress", address);
    // }, [gpsCode, colName, colType, address]);

    useEffect(()=>{
        initType();
    },[])

    const initType = async () => {
        const result = await getCommonTypes();
        if(result){
            setTypeList(result);
        }
    }

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

    useEffect(() => {
        //do validation here
        const tempV: { field: string, problem: string }[] = []        //temp validation
        colType == "" && tempV.push({ field: "col.colType", problem: "empty" });
        siteType == "" && tempV.push({ field: "col.siteType", problem: "empty" });
        colName == "" && tempV.push({ field: "col.colName", problem: "empty" });
        address == "" && tempV.push({ field: "col.address", problem: "empty" });
        premiseName == "" && tempV.push({ field: "col.premiseName", problem: "empty" });
        premiseType == "" && tempV.push({ field: "col.premiseType", problem: "empty" });
        colRecyc.length == 0 && tempV.push({ field: "col.recycType", problem: "empty" });
        Number.isNaN(staffNum) && tempV.push({ field: "col.numOfStaff", problem: "empty" });
        !Number.isInteger(staffNum)
            ? tempV.push({ field: "col.numOfStaff", problem: "wrongFormat" })
            : (Number.isInteger(staffNum) && staffNum < 0) && tempV.push({ field: "col.numOfStaff", problem: "numSmallerThan0" });
        contractNo == "" && tempV.push({ field: "col.contractNo", problem: "empty" });
        setValidation(tempV);
    }, [colType, siteType, colName, address, premiseName, premiseType, colRecyc, staffNum, contractNo])

    // useEffect(() => {
    //     console.log("staffNum: ", staffNum);
    // }, [staffNum])

    // useEffect(()=>{
    //     console.log("listplace: ",listPlace);
    // },[listPlace])

    //validation function
    const checkString = (s: string) => {
        if(!trySubmited){       //before first submit, don't check the validation
            return false;
        }
        return s == "";
    }
    const checkNumber = (n: number) => {        //before first submit, don't check the validation
        if(!trySubmited){
            return false;
        }
        return Number.isNaN(n) || !Number.isInteger(n) || (Number.isInteger(n) && n < 0);
    }

    const getValidationMsg = (valid: { field: string, problem: string }[]) => {
        var msg: string = "";
        var empty: string[] = [];
        var wrongFormat: string[] = [];
        var numSmallerThan0: string[] = [];
        valid.map((v)=>{
            switch(v.problem){
                case "empty":
                    empty.push(v.field);
                    break;
                case "wrongFormat":
                    wrongFormat.push(v.field);
                    break;
                case "numSmallerThan0":
                    numSmallerThan0.push(v.field);
                    break;
            }
        })
        if(empty.length > 0){
            empty.map((e, index) => {
                msg += t(e);
                msg += (index==empty.length-1)? t("form.shouldNotBeEmpty") : ", "
            })
            msg += "\n";
        }
        if(wrongFormat.length > 0){
            wrongFormat.map((w, index) => {
                msg += t(w);
                msg += (index==wrongFormat.length-1)? t("form.isInWrongFormat") : ", "
            })
            msg += "\n";
        }
        if(numSmallerThan0.length > 0){
            numSmallerThan0.map((n, index) => {
                msg += t(n);
                msg += (index==numSmallerThan0.length-1)? t("form.shouldNotSmallerThanZero") : ", "
            })
            msg += "\n";
        }
        //console.log("validation: ",empty,wrongFormat,numSmallerThan0,msg);
        return msg;
    }

    const returnColTypes = () => {
        const colList: il_item[] = typeList.colPoint.map((col) => {
            var name = "";
            switch(i18n.language){
                case "enus":
                    name = col.colPointTypeEng;
                    break;
                case "zhch":
                    name = col.colPointTypeSchi;
                    break;
                case "zhhk":
                    name = col.colPointTypeTchi;
                    break;
                default:
                    name = col.colPointTypeTchi;        //default fallback language is zhhk
                    break;
            }
            return {name: name, id: col.colPointTypeId};
        });
        return colList;
    };

    const returnPremiseTypes = () => {
        const premiseList: il_item[] = typeList.premise.map((pre) => {
            var name = "";
            switch(i18n.language){
                case "enus":
                    name = pre.premiseTypeNameEng;
                    break;
                case "zhch":
                    name = pre.premiseTypeNameSchi;
                    break;
                case "zhhk":
                    name = pre.premiseTypeNameTchi;
                    break;
                default:
                    name = pre.premiseTypeNameTchi;        //default fallback language is zhhk
                    break;
            }
            return {name: name, id: pre.premiseTypeId};
        });
        return premiseList;
    };

    const returnSiteTypes = () => {
        const siteList: il_item[] = typeList.site.map((s) => {
            var name = "";
            switch(i18n.language){
                case "enus":
                    name = s.siteTypeNameEng;
                    break;
                case "zhch":
                    name = s.siteTypeNameSchi;
                    break;
                case "zhhk":
                    name = s.siteTypeNameTchi;
                    break;
                default:
                    name = s.siteTypeNameTchi;        //default fallback language is zhhk
                    break;
            }
            return {name: name, id: s.siteTypeId};
        });
        return siteList;
    };

    const returnRecyclables = (recycS: recycItem[]) => {       //transforming recyclables to string array with main items name only
        const recyclables: il_item[] = recycS.map((recyc) => {
            return recyc.recycType;
        });
        return recyclables;
    }

    const returnSubRecyclables = (recycId: string) => {       //return sub items of recyc
        const item: recycItem | undefined = recycTypes.find((recycType) => {
            return recycType.recycType.id === recycId;
        });
        if (item) {
            const subItems = item.recycSubtype
            return subItems;
        } else {
            return [];
        }
    }

    const returnSubTypesId = (id: string) => {
        var subTypesId: string[] = [];
        const re = recycTypes.find((recyc) => {     //find the corresponding recyclable object
            return recyc.recycType.id == id;
        })
        if(re){
            re.recycSubtype.map((sub) => {
                subTypesId.push(sub.id);
            })
        }
        return subTypesId;
    }

    const returnWithSubItem = () => {
        var withSubItem: string[] = []      //store the ids of recycType that have selected sub item
        colRecyc.map((id) => {
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
        if(colRecyc.length < str.length){       //selecting new item
            setCOLRecyc(str)
        }else if(colRecyc.length > str.length){     //unselecting an item
            const removeRecyc = colRecyc.find((recyc) => {     //find the item that has been removed
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
            setCOLRecyc(str);
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
            recyc.recycSubtypeId.map((sub) => {
                subTypes.push(sub);
            })
        });
        return subTypes;
    }

    const toRecyclables = () => {
        var recyclableS: recyclable[] = [];
        colRecyc.map((recyc) => {
            const subId = returnSubTypesId(recyc);
            const subList = subTypeList.filter((sub) => {       //get the selected sub types of corresponding recyc type
                return subId.includes(sub);
            })
            //console.log(subList);
            recyclableS.push({recycTypeId: recyc, recycSubtypeId: subList});
        });
        return recyclableS;
    }

    const handleCreateOnClick = async () => {
        toast.info('Collection point created', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        if(validation.length == 0){
            const ST: string[] = sHr.map((value) => value.startFrom.toString());
            const ET: string[] = sHr.map((value) => value.endAt.toString());
            const cp: createCP = {
                colName: colName,
                colPointTypeId: colType,
                effFrmDate: openingPeriod?.startDate.format(format.dateFormat3),
                effToDate: openingPeriod?.endDate.format(format.dateFormat3),
                startTime: ST,
                endTime: ET,
                address: address,
                gpsCode: gpsCode,
                epdFlg: EPDEnable,
                extraServiceFlg: !serviceType,
                siteTypeId: siteType,
                contractNo: contractNo,
                noOfStaff: staffNum,
                status: status ? "CREATED" : "CLOSED",
                premiseName: premiseName,
                premiseTypeId: premiseType,
                premiseRemark: premiseRemark,
                normalFlg: true,
                createdBy: "colAdmin",
                updatedBy: "colAdmin",
                roster: [],
                colPtRecyc: toRecyclables()
            }
            const result = await createCollectionPoint(cp);
            const data = result?.data;
            if (data) {
                console.log("all collection point: ", data);
            }
            navigate("/collector/collectionPoint",{ state: "created" });       //goback to last page
        }else{
            setTrySubmited(true);
        }
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
            <form>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
                    <Grid container direction={"column"} spacing={2.5} sx={styles.gridForm}>
                        <Grid item>
                            <Button sx={[styles.headerSection]} onClick={() => handleHeaderOnClick()}>
                                <ArrowBackIosIcon sx={{ fontSize: 15, marginX: 0.5 }} />
                                <Typography sx={styles.header1}>{t("col.createCP")}</Typography>
                            </Button>
                        </Grid>

                        <CustomField label={t("col.colType")} mandatory={true}>
                            <CustomItemList
                                items={returnColTypes()}
                                singleSelect={setCOLType}
                                error={trySubmited && checkString(colType)}
                            />
                        </CustomField>

                        <CustomField label={t("col.siteType")} mandatory={true}>
                            <CustomItemList
                                items={returnSiteTypes()}
                                singleSelect={setSiteType}
                                error={checkString(siteType)}
                            />
                        </CustomField>

                        <CustomField label={t("col.colName")} mandatory={true}>
                            <CustomTextField
                                id="colName"
                                placeholder={t("col.enterName")}
                                onChange={(event) => setCOLName(event.target.value)}
                                error={checkString(colName)}
                            />
                        </CustomField>

                        <CustomField label={t("col.address")} mandatory={true}>
                            <CustomTextField
                                id="address"
                                placeholder={t("col.enterAddress")}
                                onChange={(event) => handleSearchTextChange(event)}
                                // endAdornment={locationSelect(setCPLocation)}
                                value={address ? address : searchText}
                                error={checkString(address)}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "100%",
                                    borderColor: "black",
                                }}
                            >
                                {listPlace && (
                                    <List key={listPlace[0]?.place_id}>
                                        <ListItemButton
                                            onClick={() => {
                                                setAddress(listPlace[0].formatted_address);
                                                setGPSCode([listPlace[0]?.geometry?.location?.lat, listPlace[0]?.geometry?.location?.lng]);
                                            }}
                                        >
                                            <ListItemText>{listPlace[0]?.formatted_address}</ListItemText>
                                        </ListItemButton>
                                        <Divider />
                                    </List>
                                )}
                            </Box>
                        </CustomField>

                        <CustomField label={t("col.effFromDate")}>
                            <CustomDatePicker setDate={setOpeningPeriod} />
                        </CustomField>

                        <CustomField label={t("col.startTime")} mandatory={true}>
                            <CustomTimePicker multiple={true} setTime={setSHr} />
                        </CustomField>

                        <CustomField label={t("col.premiseName")} mandatory={true}>
                            <CustomTextField
                                id="HouseOrPlaceName"
                                placeholder={t("col.enterName")}
                                onChange={(event) => setPremiseName(event.target.value)}
                                error={checkString(premiseName)}
                            />
                        </CustomField>

                        <CustomField label={t("col.premiseType")} mandatory={true}>
                            <CustomItemList
                                items={returnPremiseTypes()}
                                singleSelect={setPremiseType}
                                error={checkString(premiseType)}
                            />
                        </CustomField>

                        <Grid item>
                            <Collapse in={premiseType == "PT00010"} >
                                <CustomField label={t("col.premiseRemark")}>
                                    <CustomTextField
                                        id="premiseRemark"
                                        placeholder={t("col.enterText")}
                                        onChange={(event) => setPremiseRemark(event.target.value)}
                                    />
                                </CustomField>
                            </Collapse>
                        </Grid>

                        <CustomField label={t("col.status")}>
                            <CustomSwitch
                                onText={t("col.open")}
                                offText={t("col.close")}
                                defaultValue={true}
                                setState={setStatus}
                            />
                        </CustomField>

                        <Grid item sx={{ width: "100%" }}>
                            <Divider />
                        </Grid>

                        <Grid item>
                            <Typography sx={styles.header2}>{t("col.colRecycType")}</Typography>
                        </Grid>

                        <CustomField label={t("col.recycType")} mandatory={true}>
                            <CustomItemList
                                items={returnRecyclables(recycTypes)}
                                withSubItems={returnWithSubItem()}
                                multiSelect={selectRecyc}
                                setLastSelect={setCurRecyc}
                                dbClickSelect={true}
                                error={trySubmited && colRecyc.length == 0}
                            />
                        </CustomField>
                        <Grid item>
                            <Collapse in={curRecyc != " " && colRecyc.length > 0} unmountOnExit>
                                <CustomField label={curRecyc == " " ? "" : curRecyc + t("col.category")}>
                                    <CustomItemList
                                        items={returnSubRecyclables(curRecyc)}
                                        multiSelect={selectSubRecyc}
                                        defaultSelected={subTypeList}
                                        dbClickSelect={true}
                                    />
                                </CustomField>
                            </Collapse>
                        </Grid>

                        <Grid item sx={{ width: "100%" }}>
                            <Divider />
                        </Grid>

                        <Grid item>
                            <Typography sx={styles.header2}>{t("col.staffInfo")}</Typography>
                        </Grid>

                        <CustomField label={t("col.numOfStaff")} mandatory={true}>
                            <CustomTextField
                                id="employee number"
                                placeholder={t("col.enterNumOfStaff")}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    if (!isNaN(+value)) {
                                        //if value is number
                                        setStaffNum(parseInt(value));
                                    }
                                }}
                                error={checkNumber(staffNum)}
                            />
                        </CustomField>

                        <Grid item sx={{ width: "100%" }}>
                            <Divider />
                        </Grid>

                        <Grid item>
                            <Typography sx={styles.header2}>{t("col.serviceInfo")}</Typography>
                        </Grid>

                        <CustomField label={"是否EPD 服務"}>
                            <CustomSwitch
                                onText="是"
                                offText="否"
                                defaultValue={false}
                                setState={setEPDEnable}
                            />
                        </CustomField>

                        <CustomField label={t("col.contractNo")} mandatory={true}>
                            <CustomTextField
                                id="contractNo"
                                placeholder={t("col.enterNo")}
                                onChange={(event) => setContractNo(event.target.value)}
                                error={checkString(contractNo)}
                            />
                        </CustomField>

                        <CustomField label={t("col.serviceType")}>
                            <CustomSwitch
                                onText={t("col.basic")}
                                offText={t("col.extra")}
                                defaultValue={true}
                                setState={setServiceType}
                            />
                        </CustomField>
                        <Grid item>
                            <Tooltip title={/*getValidationMsg(validation)*/""} placement="top-start">
                                <Button sx={[styles.buttonFilledGreen, localstyles.localButton]} onClick={() => handleCreateOnClick()}>
                                    {t("col.create")}
                                </Button>
                            </Tooltip>
                            <Button sx={[styles.buttonOutlinedGreen, localstyles.localButton]} onClick={() => handleCancelOnClick()}>
                                {t("col.cancel")}
                            </Button>
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </form>
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
