// @ts-nocheck
import { Autocomplete, Box, Button, Collapse, Divider, Grid, List, ListItemButton, ListItemText, TextField, Typography, } from "@mui/material";
import { styles } from "../../../../constants/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CustomField from "../../../../components/FormComponents/CustomField";
import { useEffect, useState } from "react";
import { collectionPoint, updateCP, openingPeriod, recyclable, timePeriod } from "../../../../interfaces/collectionPoint";
import CustomTextField from "../../../../components/FormComponents/CustomTextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useDebounce from "../../../../hooks/useDebounce";
import { getLocation } from "../../../../APICalls/getLocation";
import CustomTimePicker from "../../../../components/FormComponents/CustomTimePicker";
import CustomSwitch from "../../../../components/FormComponents/CustomSwitch";
import CustomDatePicker from "../../../../components/FormComponents/CustomDatePicker";
import { useLocation, useNavigate } from "react-router-dom";
import { updateCollectionPoint } from "../../../../APICalls/Collector/collectionPointManage";
import { useTranslation } from "react-i18next";
import { colPointType, premiseType, recycType, siteType } from "../../../../interfaces/common";
import { getCommonTypes } from "../../../../APICalls/commonManage";
import RecyclablesList from "../../../../components/SpecializeComponents/RecyclablesList";
import PremiseTypeList from "../../../../components/SpecializeComponents/PremiseTypeList";
import ColPointTypeList from "../../../../components/SpecializeComponents/CollectionPointTypeList";
import SiteTypeList from "../../../../components/SpecializeComponents/SiteTypeList";
import { formErr } from "../../../../constants/constant";

function CreateCollectionPoint() {

    const {state} = useLocation();
    const colInfo: collectionPoint = state;

    const [colType, setCOLType] = useState<string>(colInfo.colPointTypeId);
    const [address, setAddress] = useState<string>(colInfo.address);
    const [gpsCode, setGPSCode] = useState<number[]>(colInfo.gpsCode);
    const [openingPeriod, setOpeningPeriod] = useState<openingPeriod>({ startDate: dayjs(colInfo.effFrmDate), endDate: dayjs(colInfo.effToDate) });
    const [sHr, setSHr] = useState<timePeriod[]>([]);
    const [siteType, setSiteType] = useState<string>(colInfo.siteTypeId); //site type
    const [contractNo, setContractNo] = useState<string>(colInfo.contractNo);
    const [premiseName, setPremiseName] = useState<string>(colInfo.premiseName); //Name of the house/place
    const [premiseType, setPremiseType] = useState<string>(colInfo.premiseTypeId); //Category of the house/place
    const [premiseRemark, setPremiseRemark] = useState<string>(colInfo.premiseRemark);
    const [status, setStatus] = useState<boolean>(true);
    const [recyclables, setRecyclables] = useState<recyclable[]>([]);
    const [staffNum, setStaffNum] = useState<string>(colInfo.noOfStaff.toString());
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
        var SHR: timePeriod[] = toSHR();
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
        colType == "" && tempV.push({ field: "col.colType", problem: formErr.empty });
        siteType == "" && tempV.push({ field: "col.siteType", problem: formErr.empty });
        address == "" && tempV.push({ field: "col.address", problem: formErr.empty });
        (dayjs(new Date()).isBetween(openingPeriod.startDate,openingPeriod.endDate) && status == false) &&      //status == false: status is "CLOSED"
            tempV.push({ field: "col.openingDate", problem: "stillInPeriod" });
        premiseName == "" && tempV.push({ field: "col.premiseName", problem: formErr.empty });
        premiseType == "" && tempV.push({ field: "col.premiseType", problem: formErr.empty });
        recyclables.length == 0 && tempV.push({ field: "col.recycType", problem: formErr.empty });
        console.log("num:",staffNum,Number.isNaN(parseInt(staffNum)),staffNum == "")
        staffNum == "" && tempV.push({ field: "col.numOfStaff", problem: formErr.empty });
        (Number.isNaN(parseInt(staffNum)) && !(staffNum == ""))
            ? tempV.push({ field: "col.numOfStaff", problem: formErr.wrongFormat })
            : (!Number.isNaN(parseInt(staffNum)) && parseInt(staffNum) < 0) && tempV.push({ field: "col.numOfStaff", problem: formErr.numberSmallThanZero });
        contractNo == "" && tempV.push({ field: "col.contractNo", problem: formErr.empty });
        setValidation(tempV);
        console.log(tempV);
    }, [colType, siteType, address, premiseName, premiseType, recyclables, staffNum, contractNo])

    useEffect(() => {
        checkEPD(contractNo);
    }, [contractNo])

    const toSHR = () => {
        var SHR: timePeriod[] = [];
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
    const checkNumber = (n: string) => {        //before first submit, don't check the validation
        if(!trySubmited){
            return false;
        }
        return Number.isNaN(parseInt(n)) || n == "" || (!Number.isNaN(parseInt(n)) && parseInt(n) < 0);
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
                noOfStaff: parseInt(staffNum),
                status: status? "CREATED" : "CLOSED",
                premiseName: premiseName,
                premiseTypeId: premiseType,
                premiseRemark: premiseRemark,
                normalFlg: true,
                updatedBy: "colAdmin",
                colPtRecyc: recyclables,
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
                        <ColPointTypeList
                            setState={setCOLType}
                            colPointTypes={typeList.colPoint}
                            error={checkString(colType)}
                            defaultValue={colInfo.colPointTypeId}
                        />
                    </CustomField>

                    <CustomField label={t("col.siteType")} mandatory={true}>
                        <SiteTypeList
                            setState={setSiteType}
                            siteTypes={typeList.site}
                            error={checkString(siteType)}
                            defaultValue={colInfo.siteTypeId}
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
                        <PremiseTypeList
                            setState={setPremiseType}
                            premiseTypes={typeList.premise}
                            error={checkString(premiseType)}
                            defaultValue={colInfo.premiseTypeId}
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
                        <RecyclablesList
                            recycL={typeList.recyc}
                            setState={setRecyclables}
                            defaultRecycL={colInfo.colPtRecyc}
                        />
                    </CustomField>

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
                                setStaffNum(value);
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
    localButton: {
        width: "200px",
        fontSize: 18,
        mr: 3
    }
};

export default CreateCollectionPoint;
