import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { styles } from "../../constants/styles";
import CustomField from "./CustomField";
import CustomSwitch from "./CustomSwitch";
import CustomDatePicker2 from "./CustomDatePicker2";
import RoutineSelect from "../SpecializeComponents/RoutineSelect";
import CustomTextField from "./CustomTextField";
import CustomItemList, { il_item } from "./CustomItemList";
import CreateRecycleForm from "./CreateRecycleForm";
import { useContainer } from "unstated-next";
import CheckInRequestContainer from "../../contexts/CheckInRequestContainer";
import {
  CreatePicoDetail,
  EditPo,
  PickupOrder,
} from "../../interfaces/pickupOrder";
import { colPtRoutine } from "../../interfaces/common";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridRowSpacingParams } from "@mui/x-data-grid";
import {
  ADD_CIRCLE_ICON,
  DELETE_OUTLINED_ICON,
  EDIT_OUTLINED_ICON,
} from "../../themes/icons";
import theme from "../../themes/palette";
import { t } from "i18next";
import { useFormik } from "formik";
import { editPickupOrder } from "../../APICalls/Collector/pickupOrder/pickupOrder";
import { validate } from "uuid";
import CustomAutoComplete from "./CustomAutoComplete";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import PicoRoutineSelect from "../SpecializeComponents/PicoRoutineSelect";
import { amET } from "@mui/material/locale";
import i18n from "../../setups/i18n";

const PickupOrderCreateForm = ({
  selectedPo,
  title,
  formik,
  setState,
  state,
}: {
  selectedPo?: PickupOrder;
  title: string;
  formik: any;
  setState: (val: CreatePicoDetail[]) => void;
  state: CreatePicoDetail[];
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [id, setId] = useState<number>(0);
  const { logisticList, contractType, vehicleType } =
    useContainer(CommonTypeContainer);
  const navigate = useNavigate();
  const handleCloses = () => {
    setOpenModal(false);
  };
  console.log(vehicleType);

  console.log("yo" + JSON.stringify(state));
  const handleEditRow = (id: number) => {
    setEditRowId(id);
    setOpenModal(true);
  };
  const handleDeleteRow = (id: any) => {
    const updatedRows = state.filter((row) => row.id !== id);
    setState(updatedRows);
  };
  const handleHeaderOnClick = () => {
    console.log("Header click");
    navigate(-1); //goback to last page
  };
  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
    };
  }, []);

  const getvehicleType=()=>{
    if (vehicleType) {
      const carType: il_item[] = [];
      vehicleType?.forEach((vehicle) => {
        var name = "";
        switch (i18n.language) {
          case "enus":
            name = vehicle.vehicleTypeNameEng;
            break;
          case "zhch":
            name = vehicle.vehicleTypeNameSchi;
            break;
          case "zhhk":
            name = vehicle.vehicleTypeNameTchi;
            break;
          default:
            name = vehicle.vehicleTypeNameTchi; //default fallback language is zhhk
            break;
        }
        const vehicleType: il_item = {
          id: vehicle.vehicleTypeId,
          name: name,
        };
        carType.push(vehicleType);
      }
      );
      return carType
    }
  }
 

  const columns: GridColDef[] = [
    { field: "pickupAt", headerName: "运送时间", width: 150 },
    {
      field: "recycType",
      headerName: "主类别",
      width: 150,
      editable: true,
      valueGetter: ({ row }) => row.item.recycType,
    },
    {
      field: "recycSubType",
      headerName: "次类别",
      type: "string",
      width: 150,
      editable: true,
      valueGetter: ({ row }) => row.item.recycSubType,
    },
    {
      field: "Weight",
      headerName: "重量",
      type: "string",
      width: 150,
      editable: true,
      valueGetter: ({ row }) => row.item.weight,
    },
    {
      field: "senderName",
      headerName: "寄件公司",
      type: "string",
      width: 150,
      editable: true,
    },
    {
      field: "receiverName",
      headerName: "收件公司",
      type: "string",
      width: 150,
      editable: true,
    },
    {
      field: "senderAddr",
      headerName: "回收地点",
      type: "string",
      width: 150,
      editable: true,
    },
    {
      field: "receiverAddr",
      headerName: "到达地点",
      type: "string",
      width: 200,
      editable: true,
    },
    {
      field: "edit",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <IconButton>
          <EDIT_OUTLINED_ICON onClick={() => handleEditRow(params.row.id)} />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => handleDeleteRow(params.row.id)}>
          <DELETE_OUTLINED_ICON />
        </IconButton>
      ),
    },
  ];

 

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
                  <Typography sx={styles.header1}>{title}</Typography>
                </Button>
              </Grid>
              <Grid item>
                <CustomField label={"请选择运输类别"} mandatory>
                  <CustomSwitch
                    onText="常规运输"
                    offText="一次性运输"
                    defaultValue={
                      selectedPo?.picoType === "AD_HOC"
                        ? true
                        : selectedPo?.picoType === "ROUTINE"
                        ? false
                        : undefined
                    }
                    setState={(value) =>
                      formik.setFieldValue(
                        "picoType",
                        value ? "AD_HOC" : "ROUTINE"
                      )
                    }
                    value={formik.values.picoType}
                  />
                </CustomField>
              </Grid>
              <Grid item display="flex">
                <CustomDatePicker2
                  pickupOrderForm={true}
                  setDate={(values) => {
                    formik.setFieldValue("effFrmDate", values.startDate);
                    formik.setFieldValue("effToDate", values.endDate);
                  }}
                  defaultStartDate={selectedPo?.effFrmDate}
                  defaultEndDate={selectedPo?.effToDate}
                />
              </Grid>
              <CustomField label="回收周次" style={{ width: "100%" }} mandatory>
                <PicoRoutineSelect
                  setRoutine={(values) => {
                    console.log("routine" + JSON.stringify(values));
                    formik.setFieldValue("routineType", values.routineType);
                    formik.setFieldValue("routine", values.routineContent);
                  }}
                  defaultValue={{
                    routineType: selectedPo?.routineType ?? "",
                    routineContent: selectedPo?.routine ?? [],
                  }}
                />
              </CustomField>
              <Grid item>
                <CustomField label={"选择物流公司"} mandatory>
                  <CustomAutoComplete
                    placeholder="請輸入公司名稱"
                    option={
                      logisticList?.map((option) => option.logisticNameTchi) ??
                      []
                    }
                    sx={{ width: "400px" }}
                    onChange={(_: SyntheticEvent, newValue: string | null) =>
                      formik.setFieldValue("logisticName", newValue)
                    }
                    onInputChange={(event: any, newInputValue: string) => {
                      console.log(newInputValue); // Log the input value
                      formik.setFieldValue("logisticName", newInputValue); // Update the formik field value if needed
                    }}
                    value={formik.values.logisticName}
                    inputValue={formik.values.logisticName}
                    error={
                      formik.errors.logisticName && formik.touched.logisticName
                    }
                  />
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={"车辆类别"} mandatory>
               
                    <CustomItemList
                      items={getvehicleType()||[]}
                      singleSelect={(values) =>
                        formik.setFieldValue("vehicleTypeId", values)
                      }
                      value={formik.values.vehicleTypeId}
                      defaultSelected={selectedPo?.vehicleTypeId}
                      error={
                        formik.errors.vehicleTypeId &&
                        formik.touched.vehicleTypeId
                      }
                    />
                  
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={"车牌号码"} mandatory>
                  <CustomTextField
                    id="platNo"
                    placeholder="请填写车牌号码"
                    onChange={formik.handleChange}
                    value={formik.values.platNo}
                    sx={{ width: "400px" }}
                    error={formik.errors.platNo && formik.touched.platNo}
                  />
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={"联络人号码"} mandatory>
                  <CustomTextField
                    id="contactNo"
                    placeholder="请填写手机号码"
                    onChange={formik.handleChange}
                    value={formik.values.contactNo}
                    sx={{ width: "400px" }}
                    error={formik.errors.contactNo && formik.touched.contactNo}
                  />
                </CustomField>
              </Grid>
              <Grid item>
                <Box>
                  <CustomField label={"合約編號"} mandatory>
                    <CustomAutoComplete
                      placeholder="請輸入公司名稱"
                      option={
                        contractType?.map((option) => option.contractNo) ?? []
                      }
                      sx={{ width: "400px" }}
                      onChange={(_: SyntheticEvent, newValue: string | null) =>
                        formik.setFieldValue("contractNo", newValue)
                      }
                      value={formik.values.contractNo}
                      error={
                        formik.errors.contractNo && formik.touched.contractNo
                      }
                    />
                  </CustomField>
                </Box>
              </Grid>

              <Grid item>
                <CustomField label={"預計回收地點資料"} mandatory>
                  <DataGrid
                    rows={state}
                    hideFooter
                    columns={columns}
                    disableRowSelectionOnClick
                    getRowSpacing={getRowSpacing}
                    sx={{
                      border: "none",
                      "& .MuiDataGrid-cell": {
                        border: "none", // Remove the borders from the cells
                      },
                      "& .MuiDataGrid-row": {
                        bgcolor: "white",
                        borderRadius: "10px",
                      },
                      "&>.MuiDataGrid-main": {
                        "&>.MuiDataGrid-columnHeaders": {
                          borderBottom: "none",
                        },
                      },
                      "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                        display: "none",
                      },
                      "& .MuiDataGrid-overlay": {
                        display: "none",
                      },
                    }}
                  />
                  <Modal open={openModal} onClose={handleCloses}>
                    <CreateRecycleForm
                      data={state}
                      id={id}
                      setId={setId}
                      setState={setState}
                      onClose={handleCloses}
                      editRowId={editRowId}
                    />
                  </Modal>

                  <Button
                    variant="outlined"
                    startIcon={<ADD_CIRCLE_ICON />}
                    onClick={() => setOpenModal(true)}
                    sx={{
                      height: "40px",
                      width: "100%",
                      mt: "20px",
                      borderColor: theme.palette.primary.main,
                      color: "black",
                      borderRadius: "10px",
                    }}
                  >
                    新增
                  </Button>
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
            <Stack mt={2} spacing={2}>
              {Object.keys(formik.errors).map((fieldName) =>
                formik.touched[fieldName] && formik.errors[fieldName] ? (
                  <Alert severity="error" key={fieldName}>
                    {formik.errors[fieldName]}
                  </Alert>
                ) : null
              )}
            </Stack>
          </LocalizationProvider>
        </Box>
      </form>
    </>
  );
};

let localstyles = {
  localButton: {
    width: "200px",
    fontSize: 18,
    mr: 3,
  },
};

export default PickupOrderCreateForm;
