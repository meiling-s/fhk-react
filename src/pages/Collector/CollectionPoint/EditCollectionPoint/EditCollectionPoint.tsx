// @ts-nocheck
import {
    Autocomplete,
    Box,
    Button,
    Collapse,
    Divider,
    Grid,
    List,
    ListItemButton,
    ListItemText,
    TextField,
    Typography,
} from "@mui/material";
import { styles } from "../../../../constants/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CustomField from "../../../../components/FormComponents/CustomField";
import { useEffect, useState } from "react";
import { collectionPoint, updateCP, openingPeriod, recyclable, serviceHr } from "../../../../interfaces/collectionPoint";
import CustomTextField from "../../../../components/FormComponents/CustomTextField";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useDebounce from "../../../../hooks/useDebounce";
import { getLocation } from "../../../../APICalls/getLocation";
import CustomTimePicker from "../../../../components/FormComponents/CustomTimePicker";
import CustomSwitch from "../../../../components/FormComponents/CustomSwitch";
import CustomItemList, { il_item } from "../../../../components/FormComponents/CustomItemList";
import CustomDatePicker from "../../../../components/FormComponents/CustomDatePicker";
import { useLocation, useNavigate } from "react-router-dom";
import { updateCollectionPoint } from "../../../../APICalls/collectionPointManage";
import { useTranslation } from "react-i18next";
import { colPointType, premiseType, recycType, siteType } from "../../../../interfaces/common";
import { getCommonTypes } from "../../../../APICalls/commonManage";

type recycItem = {
    recycType: il_item,
    recycSubtype: il_item[]
}

function CreateCollectionPoint() {

    const {state} = useLocation();
    const colInfo: collectionPoint = state;

    const [colType, setCOLType] = useState<string>(colInfo.colPointTypeId);
    const [colName, setCOLName] = useState<string>(colInfo.colName);
    const [address, setAddress] = useState<string>(colInfo.address);
    const [gpsCode, setGPSCode] = useState<number[]>(colInfo.gpsCode);
    const [openingPeriod, setOpeningPeriod] = useState<openingPeriod>({ startDate: dayjs(colInfo.effFrmDate), endDate: dayjs(colInfo.effToDate) });
    const [sHr, setSHr] = useState<serviceHr[]>([]);
    const [siteType, setSiteType] = useState<string>(colInfo.siteTypeId); //site type
    const [contractNo, setContractNo] = useState<string>(colInfo.contractNo);
    const [premiseName, setPremiseName] = useState<string>(colInfo.premiseName); //Name of the house/place
    const [premiseType, setPremiseType] = useState<string>(colInfo.premiseTypeId); //Category of the house/place
    const [premiseRemark, setPremiseRemark] = useState<string>(colInfo.premiseRemark);
    const [status, setStatus] = useState<boolean>(true);
    const [colRecyc, setCOLRecyc] = useState<string[]>([]);     //Recyclables
    const [curRecyc, setCurRecyc] = useState<string>(" ");     //Current selected recyclables
    const [subTypeList, setSubTypeList] = useState<string[]>([]);     //all selected sub type
    const [staffNum, setStaffNum] = useState<number>(colInfo.noOfStaff);
    const [EPDEnable, setEPDEnable] = useState<boolean>(colInfo.epdFlg);
    const [serviceType, setServiceType] = useState<boolean>(colInfo.extraServiceFlg);
    const [searchText, setSearchText] = useState<string>("");
    const [listPlace, setListPlace] = useState<any[]>([]);
    const [trySubmited, setTrySubmited] = useState<boolean>(false);
    const [validation, setValidation] = useState<{ field: string, problem: string }[]>([]);
    const [typeList, setTypeList] = useState<{colPoint: colPointType[], premise: premiseType[], site: siteType[], recyc: recycType[]}>({colPoint: [], premise: [], site: [], recyc: []});
    const [contractList, setContractList] = useState<{contractNo: string, isEpd: boolean}[]>([]);
    const debouncedSearchValue: string = useDebounce(searchText, 1000);

    const navigate = useNavigate();

    const { t, i18n } = useTranslation();

    const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (address) {
          setAddress("");
        }
        setSearchText(e.target.value);
    }

    useEffect(()=>{
        setCOLRecyc(recyclables_getRecycTypes(colInfo.colPtRecyc));
        setSubTypeList(recyclables_getSubTypes(colInfo.colPtRecyc));
        var SHR: serviceHr[] = toSHR();
        setSHr(SHR);
        initType();
    },[])

    const initType = async () => {
        const result = await getCommonTypes();
        if(result){
            setTypeList(result);
        }
        if(result?.contract){
            var conList : {contractNo: string, isEpd: boolean}[] = [];
            result?.contract.map((con) => {
                conList.push({contractNo: con.contractNo, isEpd: con.epdFlg})
            })
            setContractList(conList);
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

    useEffect(() => {
        checkEPD(contractNo);
    }, [contractNo])

    // useEffect(() => {
    //     console.log("staffNum: ", staffNum);
    // }, [staffNum])

    // useEffect(()=>{
    //     console.log("listplace: ",listPlace);
    // },[listPlace])

    const toSHR = () => {
        var SHR: serviceHr[] = [];
        for( var i = 0; i < Math.min(colInfo.startTime.length,colInfo.endTime.length); i++){
            SHR.push({startFrom: dayjs(colInfo.startTime[i]), endAt: dayjs(colInfo.endTime[i])});
        }
        return SHR;
    }

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

    const returnRecycTypes = () => {
        const recycItem: recycItem[] = [];
        typeList.recyc.map((re) => {
            var reItem: recycItem = {recycType: {name: "", id: ""}, recycSubtype: []};
            var subItem: il_item[] = [];
            var name = "";
            switch(i18n.language){
                case "enus":
                    name = re.recyclableNameEng;
                    break;
                case "zhch":
                    name = re.recyclableNameSchi;
                    break;
                case "zhhk":
                    name = re.recyclableNameTchi;
                    break;
                default:
                    name = re.recyclableNameTchi;        //default fallback language is zhhk
                    break;
            }
            reItem.recycType = {name: name, id: re.recycTypeId};

            re.recycSubtype.map((sub) => {
                var subName = "";
                switch(i18n.language){
                    case "enus":
                        subName = sub.recyclableNameEng;
                        break;
                    case "zhch":
                        subName = sub.recyclableNameSchi;
                        break;
                    case "zhhk":
                        subName = sub.recyclableNameTchi;
                        break;
                    default:
                        subName = sub.recyclableNameTchi;        //default fallback language is zhhk
                        break;
                }
                subItem.push({name: subName, id: sub.recycSubtypeId})
            })
            reItem.recycSubtype = subItem;

            recycItem.push(reItem)
        });
        return(recycItem);
    };

    const returnRecyclables = (recycS: recycItem[]) => {       //transforming recyclables to string array with main items name only
        const recyclables: il_item[] = recycS.map((recyc) => {
            return recyc.recycType;
        });
        return recyclables;
    }

    const returnRecyclablesId = (recycS: recycItem[]) => {       //transforming recyclables to string array with main items name only
        const recyclablesId: string[] = recycS.map((recyc) => {
            return recyc.recycType.id;
        });
        return recyclablesId;
    }


    const returnSubRecyclables = (recycId: string) => {       //return sub items of recyc
        const item: recycItem | undefined = returnRecycTypes().find((recycType) => {
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
        const re = returnRecycTypes().find((recyc) => {     //find the corresponding recyclable object
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
        console.log(recyclableS);
        return recyclableS;
    }

    const getNameFromRecycId = (id: string) => {
        const reType = typeList.recyc.find((re) => {
            return re.recycTypeId == id
        });
        if(reType){
            switch(i18n.language){
                case "enus":
                    return reType.recyclableNameEng;
                case "zhch":
                    return reType.recyclableNameSchi;
                case "zhhk":
                    return reType.recyclableNameTchi;
                default:
                    return reType.recyclableNameTchi;        //default fallback language is zhhk
            }
        }
        return "";
    }

    const checkEPD = (contractNo: string) => {
        const contract = contractList.find((contract) => {
            return contract.contractNo == contractNo
        });
        if(contract){
            setEPDEnable(contract.isEpd);
        }
    }

    const handleSaveOnClick = async () => {
        if(validation.length == 0){
            const ST: string[] = sHr.map((value) => value.startFrom.toString());
            const ET: string[] = sHr.map((value) => value.endAt.toString());
            const cp: updateCP = {
                colPointTypeId: colType,
                effFrmDate: openingPeriod?.startDate.toString(),
                effToDate: openingPeriod?.endDate.toString(),
                address: address,
                gpsCode: gpsCode,
                epdFlg: EPDEnable,
                extraServiceFlg: !serviceType,
                siteTypeId: siteType,
                contractNo: contractNo,
                noOfStaff: staffNum,
                status: status? "CREATED" : "CLOSED",
                premiseName: premiseName,
                premiseTypeId: premiseType,
                premiseRemark: premiseRemark,
                normalFlg: true,
                updatedBy: "colAdmin",
                colPtRecyc: toRecyclables(),
                roster: []
                
            }
            const result = await updateCollectionPoint(colInfo.colId,cp);
            const data = result?.data;
            if(data){
                console.log("updated collection point: ",data);
            }
            navigate("/collector/collectionPoint",{ state: "updated" });       //goback to last page
        }else{
            console.log(validation)
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
                            <Typography sx={styles.header1}>{t("col.editCP")}</Typography>
                        </Button>
                    </Grid>

                    <CustomField label={t("col.colType")} mandatory={true}>
                        <CustomItemList
                            items={returnColTypes()}
                            singleSelect={setCOLType}
                            error={trySubmited && checkString(colType)}
                            defaultSelected={colInfo.colPointTypeId}
                        />
                    </CustomField>

                    <CustomField label={t("col.siteType")} mandatory={true}>
                        <CustomItemList
                            items={returnSiteTypes()}
                            singleSelect={setSiteType}
                            error={checkString(siteType)}
                            defaultSelected={colInfo.siteTypeId}
                        />
                    </CustomField>

                    <CustomField label={t("col.colName")}>
                        <Typography sx={styles.formDataText}>
                            {colInfo.colName}
                        </Typography>
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
                            {listPlace&&(
                                <List key={listPlace[0]?.place_id}>
                                    <ListItemButton
                                    onClick={() => {
                                        setAddress(listPlace[0].formatted_address);
                                        setGPSCode([listPlace[0]?.geometry?.location?.lat,listPlace[0]?.geometry?.location?.lng]);
                                    }}
                                    >
                                    <ListItemText>{listPlace[0]?.formatted_address}</ListItemText>
                                    </ListItemButton>
                                    <Divider />
                                </List>
                            )}
                        </Box>
                    </CustomField>

                    <CustomField label={t("col.effFromDate")} mandatory={true}>
                        <CustomDatePicker
                            setDate={setOpeningPeriod}
                            defaultStartDate={colInfo.effFrmDate}
                            defaultEndDate={colInfo.effToDate}
                        />
                    </CustomField>

                    <CustomField label={t("col.startTime")} mandatory={true}>
                        <CustomTimePicker multiple={true} setTime={setSHr} defaultTime={toSHR()}/>
                    </CustomField>

                    <CustomField label={t("col.premiseName")} mandatory={true}>
                        <CustomTextField
                            id="HouseOrPlaceName"
                            placeholder={t("col.enterName")}
                            onChange={(event) => setPremiseName(event.target.value)}
                            error={checkString(premiseName)}
                            defaultValue={colInfo.premiseName}
                        />
                    </CustomField>

                    <CustomField label={t("col.premiseType")} mandatory={true}>
                        <CustomItemList
                            items={returnPremiseTypes()}
                            singleSelect={setPremiseType}
                            error={checkString(premiseType)}
                            defaultSelected={colInfo.premiseTypeId}
                        />
                    </CustomField>

                    <Grid item>
                        <Collapse in={premiseType == "PT00010"} >
                            <CustomField label={t("col.premiseRemark")}>
                                <CustomTextField
                                    id="premiseRemark"
                                    placeholder={t("col.enterText")}
                                    onChange={(event) => setPremiseRemark(event.target.value)}
                                    defaultValue={colInfo.premiseRemark}
                                />
                            </CustomField>
                        </Collapse>
                    </Grid>
                    

                    <CustomField label={t("col.status")}>
                        <CustomSwitch
                            onText={t("col.open")}
                            offText={t("col.close")}
                            defaultValue={colInfo.status=="CREATED"}
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
                            items={returnRecyclables(returnRecycTypes())}
                            withSubItems={returnWithSubItem()}
                            multiSelect={selectRecyc}
                            setLastSelect={setCurRecyc}
                            dbClickSelect={true}
                            error={trySubmited && colRecyc.length == 0}
                            defaultSelected={recyclables_getRecycTypes(colInfo.colPtRecyc)}
                        />
                    </CustomField>
                    <Grid item>
                        <Collapse in={curRecyc != " " && colRecyc.length > 0} unmountOnExit>
                            <CustomField label={curRecyc == " " ? "" : getNameFromRecycId(curRecyc) + t("col.category")}>
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
                            defaultValue={colInfo.noOfStaff}
                        />
                    </CustomField>

                    <Grid item sx={{ width: "100%" }}>
                        <Divider />
                    </Grid>

                    <Grid item>
                        <Typography sx={styles.header2}>{t("col.serviceInfo")}</Typography>
                    </Grid>

                    <CustomField label={t("col.contractNo")} mandatory={true}>
                    <Autocomplete
                        disablePortal
                        id="contractNo"
                        options={contractList.map((contract) => contract.contractNo)}
                        defaultValue={colInfo.contractNo}
                        onChange={(event, value) =>
                            {
                                console.log(value)
                                if(value){
                                    setContractNo(value) 
                                }
                            }}
                        renderInput={(params) => 
                            <TextField
                                {...params}
                                placeholder={t("col.enterNo")}
                                sx={[styles.textField, {width: 250}]}
                                error={checkString(contractNo)}
                                InputProps={{
                                    ...params.InputProps,
                                    sx: styles.inputProps
                                }}
                            />
                        }
                    />
                    </CustomField>

                    <CustomField label={t("col.serviceType")}>
                        <CustomSwitch
                            onText={t("col.basic")}
                            offText={t("col.extra")}
                            defaultValue={colInfo.extraServiceFlg}
                            setState={setServiceType}
                        />
                    </CustomField>
                    <Grid item>
                        <Button sx={[styles.buttonFilledGreen, localstyles.localButton]} onClick={() => handleSaveOnClick()}>
                            {t("col.save")}
                        </Button>
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
