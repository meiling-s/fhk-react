import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import React, { useState } from "react";
import { styles } from "../../../constants/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { t } from "i18next";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import { TYPE } from "react-toastify/dist/utils";
import CustomField from "../../../components/FormComponents/CustomField";
import CustomSwitch from "../../../components/FormComponents/CustomSwitch";
import CustomPeriodSelect from "../../../components/FormComponents/CustomPeriodSelect";
import { openingPeriod } from "../../../interfaces/collectionPoint";
import dayjs from "dayjs";
import CustomTextField from "../../../components/FormComponents/CustomTextField";
import { useFormik } from "formik";
import CustomItemList, {
  il_item,
} from "../../../components/FormComponents/CustomItemList";
import CustomDatePicker2 from "../../../components/FormComponents/CustomDatePicker2";

const CreatePickupOrder = () => {
  const navigate = useNavigate();

  const handleHeaderOnClick = () => {
    console.log("Header click");
    navigate(-1); //goback to last page
  };
  const carType: il_item[] = [
    {
      id: "1",
      name: "小型货车",
    },
    {
      id: "2",
      name: "大型货车",
    },
  ];
  const DropOffReason: il_item[] = [
    {
      id: "1",
      name: "坏车",
    },
    {
      id: "2",
      name: "货物过剩",
    },
  ];
  const formik = useFormik({
    initialValues: {
      logistic: "",
      carNumber: "",
      contactNumber: "",
      carType: "",
      Date: {
        startDate: "",
        endDate: "",
      },
      DropOff:''
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={styles.innerScreen_container}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="zh-cn"
          >
            <Grid
              container
              direction={"column"}
              spacing={2.5}
              sx={{ ...styles.gridForm }}
            >
              <Grid item>
                <Button
                  sx={[styles.headerSection]}
                  onClick={handleHeaderOnClick}
                >
                  <ArrowBackIosIcon sx={{ fontSize: 15, marginX: 0.5 }} />
                  <Typography sx={styles.header1}>
                    {t("col.createCP")}
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <CustomField label={"请选择运输类别"}>
                  <CustomSwitch
                    onText="常规运输"
                    offText="一次性运输"
                    defaultValue={true}
                    setState={(value) => formik.setFieldValue("carType", value)}
                    value={formik.values.carType}
                  />
                </CustomField>
              </Grid>
              <Grid item display="flex">
                <CustomDatePicker2
                  pickupOrderForm={true}
                  setDate={(values) => formik.setFieldValue("Date", values)}
                />
              </Grid>
              <Grid item>
                <CustomField label={"选择物流公司"}>
                  <CustomTextField
                    id="logistic"
                    placeholder="请输入公司名称"
                    onChange={formik.handleChange}
                    value={formik.values.logistic}
                  ></CustomTextField>
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={"车辆类别"}>
                  <CustomItemList
                    items={carType}
                    multiSelect={(values) =>
                      formik.setFieldValue("carType", values)
                    }
                    value={formik.values.carType}
                  />
                </CustomField>
              </Grid>
              <Grid item>
                
                <CustomField label={"车牌号码"}>
                  <CustomTextField
                    id="carNumber"
                    placeholder="请填写车牌号码"
                    onChange={formik.handleChange}
                    value={formik.values.carNumber}
                  ></CustomTextField>
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={"联络人号码"}>
                  <CustomTextField
                    id="contactNumber"
                    placeholder="请填写手机号码"
                    onChange={formik.handleChange}
                    value={formik.values.contactNumber}
                  ></CustomTextField>
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={"下车原因"}>
                  <CustomItemList
                    items={DropOffReason}
                    multiSelect={(values) =>
                      formik.setFieldValue("DropOff", values)
                    }
                    value={formik.values.carType}
                  />
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={"参考运单编号"}>
                  <Typography>P012345678</Typography>
                </CustomField>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  sx={[styles.buttonFilledGreen, localstyles.localButton]}
                >
                  完成
                </Button>
                <Button
                  sx={[styles.buttonOutlinedGreen, localstyles.localButton]}
                  onClick={handleHeaderOnClick}
                >
                  {t("col.cancel")}
                </Button>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Box>
      </form>
    </>
  );
};
let localstyles = {
  btn_WhiteGreenTheme: {
    borderRadius: "20px",
    borderWidth: 1,
    borderColor: "#79ca25",
    backgroundColor: "white",
    color: "#79ca25",
    fontWeight: "bold",
    "&.MuiButton-root:hover": {
      bgcolor: "#F4F4F4",
      borderColor: "#79ca25",
    },
  },
  table: {
    minWidth: 750,
    borderCollapse: "separate",
    borderSpacing: "0px 10px",
  },
  headerRow: {
    //backgroundColor: "#97F33B",
    borderRadius: 10,
    mb: 1,
    "th:first-child": {
      borderRadius: "10px 0 0 10px",
    },
    "th:last-child": {
      borderRadius: "0 10px 10px 0",
    },
  },
  row: {
    backgroundColor: "#FBFBFB",
    borderRadius: 10,
    mb: 1,
    "td:first-child": {
      borderRadius: "10px 0 0 10px",
    },
    "td:last-child": {
      borderRadius: "0 10px 10px 0",
    },
  },
  headCell: {
    border: "none",
    fontWeight: "bold",
  },
  bodyCell: {
    border: "none",
  },
  typo: {
    color: "grey",
    fontSize: 14,
    fontWeight: "bold",
    display: "flex",
  },
  textField: {
    borderRadius: "10px",
    fontWeight: "500",
    "& .MuiOutlinedInput-input": {
      padding: "10px",
    },
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: "34%",
    height: "fit-content",
    padding: 4,
    backgroundColor: "white",
    border: "none",
    borderRadius: 5,
  },
  textArea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    borderColor: "#ACACAC",
    borderRadius: 5,
  },
  formButton: {
    width: "150px",
    borderRadius: 5,
    backgroundColor: "#79CA25",
    color: "white",
    "&.MuiButton-root:hover": {
      backgroundColor: "#7AD123",
    },
  },
  localButton: {
    width: "200px",
    fontSize: 18,
    mr: 3,
  },
};

export default CreatePickupOrder;
