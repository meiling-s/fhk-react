// @ts-nocheck
import { Box, Button, Collapse, Divider, FormHelperText, Grid, List, ListItemButton, ListItemText, Typography, } from "@mui/material";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styles } from "../../../../constants/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CustomField from "../../../../components/FormComponents/CustomField";
import { useEffect, useState } from "react";
import { createCP, openingPeriod, recyclable, timePeriod } from "../../../../interfaces/collectionPoint";
import CustomTextField from "../../../../components/FormComponents/CustomTextField";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useDebounce from "../../../../hooks/useDebounce";
import { getLocation } from "../../../../APICalls/getLocation";
import CustomTimePicker from "../../../../components/FormComponents/CustomTimePicker";
import CustomSwitch from "../../../../components/FormComponents/CustomSwitch";
import CustomDatePicker from "../../../../components/FormComponents/CustomDatePicker";
import { useNavigate } from "react-router-dom";
import { createCollectionPoint } from "../../../../APICalls/Collector/collectionPointManage";
import { formErr, format } from "../../../../constants/constant";
import { useTranslation } from "react-i18next";
import { getCommonTypes } from "../../../../APICalls/commonManage";
import { colPointType, premiseType, recycType, siteType } from "../../../../interfaces/common";
import RecyclablesList from "../../../../components/SpecializeComponents/RecyclablesList";
import PremiseTypeList from "../../../../components/SpecializeComponents/PremiseTypeList";
import ColPointTypeList from "../../../../components/SpecializeComponents/CollectionPointTypeList";
import SiteTypeList from "../../../../components/SpecializeComponents/SiteTypeList";
import RoutineSelect from "../../../../components/SpecializeComponents/RoutineSelect";

dayjs.extend(isBetween)

function CreateCollectionPoint() {

    const [colType, setCOLType] = useState<string>("");
    const [colName, setCOLName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [gpsCode, setGPSCode] = useState<number[]>([0, 0]);
    const [openingPeriod, setOpeningPeriod] = useState<openingPeriod>({ startDate: dayjs(new Date()), endDate: dayjs(new Date()) });
    const [sHr, setSHr] = useState<timePeriod[]>([]);
    const [siteType, setSiteType] = useState<string>(""); //site type
    const [contractNo, setContractNo] = useState<string>("");
    const [premiseName, setPremiseName] = useState<string>(""); //Name of the house/place
    const [premiseType, setPremiseType] = useState<string>(""); //Category of the house/place
    const [premiseRemark, setPremiseRemark] = useState<string>("");
    const [status, setStatus] = useState<boolean>(true);
    const [recyclables, setRecyclables] = useState<recyclable[]>([]);
    const [staffNum, setStaffNum] = useState<string>("");
    const [EPDFlg, setEPDFlg] = useState<boolean>(false);
    const [serviceType, setServiceType] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>("");
    const [listPlace, setListPlace] = useState<any[]>([]);
    const [trySubmited, setTrySubmited] = useState<boolean>(false);
    const [validation, setValidation] = useState<{ field: string, problem: string }[]>([]);
    const [skipValidation, setSkipValidation] = useState<string[]>([]);     //store the fields of validation that are going to skip
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

    useEffect(()=>{
        console.log("recyclables: ",recyclables);
    },[recyclables])

    useEffect(() => {
        if (debouncedSearchValue) {
            getLocation(debouncedSearchValue)
                .then((response) => {
                    if(response.data.results){
                        console.log(response.data);
                        const result = response.data.results;
                        setListPlace(result);
                    }
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
        colName == "" && tempV.push({ field: "col.colName", problem: formErr.empty });
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
    }, [colType, siteType, colName, address, premiseName, premiseType, recyclables, staffNum, contractNo])

    useEffect(() => {
        checkEPD(contractNo);
    }, [contractNo])

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

    const getValidationMsg = (valid: {field: string, problem: string}[]) => {
        var msg: string[] = [];
        var tempM: string = "";
        var empty: string[] = [];
        var wrongFormat: string[] = [];
        var numSmallerThan0: string[] = [];
        valid.map((v)=>{
            switch(v.problem){
                case formErr.empty:
                    empty.push(v.field);
                    break;
                case formErr.wrongFormat:
                    wrongFormat.push(v.field);
                    break;
                case formErr.numberSmallThanZero:
                    numSmallerThan0.push(v.field);
                    break;
            }
        })
        if(empty.length > 0){
            tempM = "";
            empty.map((e, index) => {
                tempM += t(e);
                tempM += (index==empty.length-1)? t("form.shouldNotBeEmpty") : ", "
            })
            if(tempM != ""){
                msg.push(tempM);
            }
        }
        if(wrongFormat.length > 0){
            tempM = "";
            wrongFormat.map((w, index) => {
                tempM += t(w);
                tempM += (index==wrongFormat.length-1)? t("form.isInWrongFormat") : ", "
            })
            if(tempM != ""){
                msg.push(tempM);
            }
        }
        if(numSmallerThan0.length > 0){
            tempM = "";
            numSmallerThan0.map((n, index) => {
                tempM += t(n);
                tempM += (index==numSmallerThan0.length-1)? t("form.shouldNotSmallerThanZero") : ", "
            })
            if(tempM != ""){
                msg.push(tempM);
            }
        }
        //console.log("validation: ",empty,wrongFormat,numSmallerThan0,msg);

        return(
            <>
                {
                    msg.map((m) => 
                        <Typography>
                            {m}
                        </Typography>
                    )
                }
            </>   
        )
    }

    const checkEPD = (contractNo: string) => {
        const contract = contractList.find((contract) => {
            return contract.contractNo == contractNo
        });
        if(contract){
            setEPDFlg(contract.isEpd);
        }
    }

    const handleCreateOnClick = async () => {
        
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
                epdFlg: EPDFlg,
                extraServiceFlg: !serviceType,
                siteTypeId: siteType,
                contractNo: contractNo,
                noOfStaff: parseInt(staffNum),
                status: status ? "CREATED" : "CLOSED",
                premiseName: premiseName,
                premiseTypeId: premiseType,
                premiseRemark: premiseRemark,
                normalFlg: true,
                createdBy: "colAdmin",
                updatedBy: "colAdmin",
                colPtRecyc: recyclables,
                roster: []
            }
            const result = await createCollectionPoint(cp);
            const data = result?.data;
            if (data) {
                console.log("all collection point: ", data);
            }
            navigate("/collector/collectionPoint",{ state: "created" });       //goback to collection point with action "created"
        }else{
            console.log(validation)
            setTrySubmited(true);
            //if(validation.incl)
        }
    }

    const handleCancelOnClick = () => {
        console.log("Cancel click");
        navigate("/collector/collectionPoint");       //goback to last page
    }

    const handleHeaderOnClick = () => {
        console.log("Header click");
        navigate("/collector/collectionPoint");       //goback to last page
    }

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
                <Grid container direction={"column"} spacing={2.5} sx={styles.gridForm}>
                    <Grid item>
                        <Button sx={[styles.headerSection]} onClick={() => handleHeaderOnClick()}>
                            <ArrowBackIosIcon sx={{ fontSize: 15, marginX: 0.5 }} />
                            <Typography sx={styles.header1}>{t("col.createCP")}</Typography>
                        </Button>
                    </Grid>

                    <CustomField label={t("col.colType")} mandatory={true}>
                        <ColPointTypeList
                            setState={setCOLType}
                            colPointTypes={typeList.colPoint}
                            error={checkString(colType)}
                        />
                    </CustomField>

                    <CustomField label={t("col.siteType")} mandatory={true}>
                        <SiteTypeList
                            setState={setSiteType}
                            siteTypes={typeList.site}
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
                        <RoutineSelect/>
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
                        <PremiseTypeList
                            setState={setPremiseType}
                            premiseTypes={typeList.premise}
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
                        <RecyclablesList
                            recycL={typeList.recyc}
                            setState={setRecyclables}
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
                            defaultValue={true}
                            setState={setServiceType}
                        />
                    </CustomField>
                    <Grid item>
                        <FormHelperText error={true}>{getValidationMsg(validation)}</FormHelperText>
                    </Grid>
                    <Grid item>
                        <Button sx={[styles.buttonFilledGreen, localstyles.localButton]} onClick={() => handleCreateOnClick()}>
                            {t("col.create")}
                        </Button>
                        <Button sx={[styles.buttonOutlinedGreen, localstyles.localButton]} onClick={() => handleCancelOnClick()}>
                            {t("col.cancel")}
                        </Button>
                    </Grid>
                </Grid>
            </LocalizationProvider>
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
