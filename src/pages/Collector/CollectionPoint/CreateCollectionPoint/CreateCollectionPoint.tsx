import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Box,
  Button,
  Grid,
  Typography,
  Autocomplete,
  TextField as MuiTextField,
  TextField,
  Divider,
  Stack,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomField from "../../../../components/FormComponents/CustomField";
import CustomSwitch from "../../../../components/FormComponents/CustomSwitch";
import CustomPeriodSelect from "../../../../components/FormComponents/CustomPeriodSelect";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCommonTypes } from "../../../../APICalls/commonManage";
import RecyclablesList from "../../../../components/SpecializeComponents/RecyclablesList";
import ColPointTypeList from "../../../../components/SpecializeComponents/CollectionPointTypeList";
import SiteTypeList from "../../../../components/SpecializeComponents/SiteTypeList";
import PremiseTypeList from "../../../../components/SpecializeComponents/PremiseTypeList";
import RoutineSelect from "../../../../components/SpecializeComponents/RoutineSelect";
import CustomItemList from "../../../../components/FormComponents/CustomItemList";
import { createCollectionPoint } from "../../../../APICalls/collectionPointManage";

import { createCP } from "../../../../interfaces/collectionPoint";
import {
  inputSx,
  multilineInputSx,
  submitButtonStyles,
  cancelButtonStyles,
  autocompleteStyles,
} from "./inputStyles";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../../../contexts/CommonTypeContainer";
import { ArrowBackIos } from "@mui/icons-material";
import CustomTextField from "../../../../components/FormComponents/CustomTextField";
import { validationSchema } from "./validationSchema";

interface ColPointType {
  colPoint: any[];
  premise: any[];
  site: any[];
  recyc: any[];
}

interface ContractType {
  contractNo: string;
  isEpd: boolean;
  frmDate: string;
  toDate: string;
}

const CreateCollectionPoint = () => {
  const [typeList, setTypeList] = useState<ColPointType>({
    colPoint: [],
    premise: [],
    site: [],
    recyc: [],
  });
  const [contractList, setContractList] = useState<ContractType[]>([]);
  const [premiseType, setPremiseType] = useState<string>("");
  const [premiseRemark, setPremiseRemark] = useState<string>("");
  const [status, setStatus] = useState<boolean>(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [serviceFlg, setServiceFlg] = useState<string>("basic");
  const [routineValidationError, setRoutineValidationError] = useState<
    string | null
  >(null);
  const { dateFormat } = useContainer(CommonTypeContainer);

  const initialValues = {
    colName: "",
    colType: "",
    siteType: "",
    address: "",
    openingPeriod: { startDate: dayjs(), endDate: dayjs() },
    premiseName: "",
    premiseType: "",
    premiseRemark: "",
    status: true,
    recyclables: [],
    staffNum: "",
    EPDFlg: false,
    serviceFlg: "basic",
    contractNo: "",
    colPtRoutine: null,
  };

  const serviceTypeList = [
    {
      id: "basic",
      name: t("col.basic"),
    },
    {
      id: "additional",
      name: t("col.additional"),
    },
    {
      id: "others",
      name: t("col.other"),
    },
  ];

  const isIncludeOthersPremis = () => {
    return (
      premiseType === "PT00009" ||
      premiseType === "PT00027" ||
      premiseType === "PT00028"
    );
  };

  const getLabel = () => {
    if (premiseType === "PT00027") {
      return t("col.otherResidentialPremise");
    } else if (premiseType === "PT00028") {
      return t("col.otherNonResidentialPremise");
    }
    return t("col.otherPremise");
  };

  useEffect(() => {
    const initType = async () => {
      try {
        const result = await getCommonTypes();
        if (result) {
          setTypeList({
            colPoint: result.colPoint || [],
            premise: result.premise || [],
            site: result.site || [],
            recyc: result.recyc || [],
          });
        }
        if (result?.contract) {
          const conList = result.contract.map((con: any) => ({
            contractNo: con.contractNo,
            isEpd: con.epdFlg,
            frmDate: con.contractFrmDate,
            toDate: con.contractToDate,
          }));
          setContractList(conList);
        }
      } catch (error) {
        console.error("Error fetching common types", error);
      }
    };
    initType();
  }, []);

  const handleCreateOnClick = async (values: any) => {
    if (routineValidationError) {
      return;
    }
    try {
      const loginId = localStorage.getItem("username") || "";
      const tenantId = localStorage.getItem("tenantId") || "";
      const newServiceFlgValue =
        values.colType === "CPT00001" ? "basic" : serviceFlg;
      const newPremiseTypeIdValue =
        values.colType === "CPT00003" ? values.premiseType : "";
      const cp: createCP = {
        tenantId: tenantId,
        colName: values.colName,
        colPointTypeId: values.colType,
        effFrmDate: dayjs(values.openingPeriod.startDate).format("YYYY-MM-DD"),
        effToDate: dayjs(values.openingPeriod.endDate).format("YYYY-MM-DD"),
        routine: values.colPtRoutine,
        address: values.address,
        gpsCode: [22.426887, 114.211165],
        epdFlg: values.EPDFlg,
        serviceFlg: newServiceFlgValue,
        siteTypeId: values.siteType,
        contractNo: values.contractNo,
        noOfStaff: values.staffNum,
        status: values.status ? "CREATED" : "CLOSED",
        premiseName: values.premiseName,
        premiseTypeId: newPremiseTypeIdValue,
        premiseRemark: values.premiseRemark,
        normalFlg: true,
        createdBy: loginId,
        updatedBy: loginId,
        colPtRecyc: values.recyclables,
        roster: [],
      };

      console.log(cp, "cp");
      // const response = await createCollectionPoint(cp);

      // if (response.data) {
      //   navigate("/collector/collectionPoint", { state: "created" });
      // } else {
      //   console.log(response);
      // }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema(t)}
        validateOnBlur={true}
        validateOnChange={true}
        onSubmit={(values) => handleCreateOnClick(values)}
      >
        {({ setFieldValue, values, isValid, dirty, validateForm }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            validateForm();
          }, [values.colType]);
          return (
            <Form>
              <Box sx={{ paddingLeft: { xs: 0 }, width: "80%" }}>
                <Grid item my={2}>
                  <Button
                    sx={{ color: "#111" }}
                    onClick={() => navigate("/collector/collectionPoint")}
                  >
                    <ArrowBackIos sx={{ fontSize: 16, marginX: 0.5 }} />
                    <Typography color="#333" fontWeight="bold" fontSize="24px">
                      {t("col.createCP")}
                    </Typography>
                  </Button>
                </Grid>
                <Grid container direction={"column"} spacing={2.5}>
                  <Grid item>
                    <Typography fontWeight="bold" fontSize="20px" color="#666">
                      {t("col.locationData")}
                    </Typography>
                  </Grid>

                  <Grid item>
                    <CustomField label={t("col.colType")} mandatory={true}>
                      <ColPointTypeList
                        setState={(value) => {
                          setFieldValue("colType", value);
                          if (value === "CPT00001") {
                            setFieldValue("premiseType", "");
                            setServiceFlg("basic");
                          } else if (value === "CPT00002") {
                            setFieldValue("premiseType", "");
                          }
                        }}
                        colPointTypes={typeList.colPoint}
                      />
                      <ErrorMessage
                        name="colType"
                        component="div"
                        className="text-red text-sm font-bold"
                      />
                    </CustomField>
                  </Grid>

                  <Grid item>
                    <CustomField label={t("col.siteType")} mandatory={true}>
                      <SiteTypeList
                        setState={(value) => setFieldValue("siteType", value)}
                        siteTypes={typeList.site}
                      />
                      <ErrorMessage
                        name="siteType"
                        component="div"
                        className="text-red text-sm font-bold"
                      />
                    </CustomField>
                  </Grid>

                  <Grid item>
                    <CustomField label={t("col.colName")} mandatory={true}>
                      <Field
                        sx={inputSx}
                        as={MuiTextField}
                        name="colName"
                        placeholder={t("col.enterName")}
                        fullWidth
                      />
                      <ErrorMessage
                        name="colName"
                        component="div"
                        className="text-red text-sm font-bold"
                      />
                    </CustomField>
                  </Grid>

                  <Grid item>
                    <CustomField label={t("col.address")} mandatory={true}>
                      <Field
                        sx={multilineInputSx}
                        as={MuiTextField}
                        name="address"
                        placeholder={t("col.enterAddress")}
                        multiline
                        fullWidth
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-red text-sm font-bold"
                      />
                    </CustomField>
                    <Typography
                      sx={{ marginTop: 1, fontSize: 16, color: "#ACACAC" }}
                    >
                      {t("col.addressNotes")}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <CustomField label={t("col.effFromDate")} mandatory>
                      <CustomPeriodSelect
                        setDate={(value) =>
                          setFieldValue("openingPeriod", value)
                        }
                      />
                    </CustomField>
                  </Grid>
                  <Grid item>
                    <CustomField label={t("col.startTime")} mandatory={true}>
                      <RoutineSelect
                        setRoutine={(value) =>
                          setFieldValue("colPtRoutine", value)
                        }
                        requiredTimePeriod={true}
                        setValidationError={setRoutineValidationError}
                      />
                      {routineValidationError && (
                        <div className="text-red text-sm">
                          {routineValidationError}
                        </div>
                      )}
                    </CustomField>
                  </Grid>

                  <Grid item>
                    <CustomField label={t("col.premiseName")} mandatory={true}>
                      <Field
                        sx={inputSx}
                        as={MuiTextField}
                        name="premiseName"
                        placeholder={t("col.premiseName")}
                        fullWidth
                      />
                      <ErrorMessage
                        name="premiseName"
                        component="div"
                        className="text-red text-sm font-bold"
                      />
                    </CustomField>
                  </Grid>
                  {values.colType === "CPT00003" && (
                    <Grid item>
                      <CustomField
                        label={t("col.premiseType")}
                        mandatory={true}
                      >
                        <PremiseTypeList
                          setState={(value) => {
                            setFieldValue("premiseType", value);
                            setPremiseType(value);
                          }}
                          premiseTypes={typeList.premise}
                        />
                        <ErrorMessage
                          name="premiseType"
                          component="div"
                          className="text-red text-sm font-bold"
                        />
                      </CustomField>
                    </Grid>
                  )}
                  {isIncludeOthersPremis() && (
                    <Grid item>
                      <CustomField label={getLabel()} mandatory={true}>
                        <Field
                          as={MuiTextField}
                          name="premiseRemark"
                          placeholder={t("col.enterText")}
                          fullWidth
                          sx={inputSx}
                        />
                        <ErrorMessage
                          name="premiseRemark"
                          component="div"
                          className="text-red text-sm font-bold"
                        />
                      </CustomField>
                    </Grid>
                  )}

                  <Grid item>
                    <CustomField label={t("col.status")}>
                      <CustomSwitch
                        onText={t("col.open")}
                        offText={t("col.close")}
                        defaultValue={true}
                        setState={setStatus}
                      />
                    </CustomField>
                    <Divider sx={{ marginTop: "16px" }} />
                  </Grid>

                  <Grid item>
                    <Typography fontWeight="bold" fontSize="20px" color="#666">
                      {t("col.colRecycType")}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <CustomField label={t("col.recycType")} mandatory={true}>
                      <RecyclablesList
                        recycL={typeList.recyc}
                        setState={(value) =>
                          setFieldValue("recyclables", value)
                        }
                      />
                      <ErrorMessage
                        name="recyclables"
                        component="div"
                        className="text-red text-sm font-bold"
                      />
                    </CustomField>
                  </Grid>

                  <Grid item>
                    <Typography fontWeight="bold" fontSize="20px" color="#666">
                      {t("col.staffInfo")}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <CustomField label={t("col.numOfStaff")} mandatory={true}>
                      <Field
                        sx={inputSx}
                        as={MuiTextField}
                        name="staffNum"
                        placeholder={t("col.enterNumOfStaff")}
                        fullWidth
                      />
                      <ErrorMessage
                        name="staffNum"
                        component="div"
                        className="text-red text-sm font-bold"
                      />
                    </CustomField>
                  </Grid>
                  <Divider sx={{ marginTop: "16px" }} />
                  <Grid item>
                    <Typography
                      fontWeight="bold"
                      fontSize="20px"
                      color="#666"
                      my="8px"
                    >
                      {t("col.serviceInfo")}
                    </Typography>

                    <CustomField label={t("col.contractNo")}>
                      <Autocomplete
                        sx={autocompleteStyles}
                        disablePortal
                        id="contractNo"
                        options={contractList.map((contract, index) => ({
                          label: contract.contractNo,
                          key: `${contract.contractNo}-${index}`,
                        }))}
                        onChange={(event, value) => {
                          if (value) {
                            setFieldValue("contractNo", value.label);
                          } else {
                            setFieldValue("contractNo", "");
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("col.enterNo")}
                            InputProps={{
                              ...params.InputProps,
                            }}
                          />
                        )}
                        noOptionsText={t("common.noOptions")}
                      />
                    </CustomField>

                    {values.colType !== "CPT00001" && (
                      <CustomField
                        label={t("col.serviceType")}
                        mandatory={true}
                      >
                        <CustomItemList
                          items={serviceTypeList}
                          singleSelect={(value) => {
                            setServiceFlg((prevValue) => {
                              if (value === "") {
                                return "basic";
                              }
                              return value;
                            });
                          }}
                          value={serviceFlg}
                          defaultSelected={serviceFlg}
                        />
                        <ErrorMessage
                          name="serviceFlg"
                          component="div"
                          className="text-red text-sm font-bold"
                        />
                      </CustomField>
                    )}

                    <Grid item></Grid>
                  </Grid>
                  <Stack direction="row" spacing={2} my="32px">
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      color="info"
                      disabled={!!routineValidationError || !isValid || !dirty}
                      sx={submitButtonStyles}
                    >
                      {t("col.create")}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => navigate("/collector/collectionPoint")}
                      sx={cancelButtonStyles}
                    >
                      {t("col.cancel")}
                    </Button>
                  </Stack>
                </Grid>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </LocalizationProvider>
  );
};

export default CreateCollectionPoint;
