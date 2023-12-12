import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import React, { useEffect, useState } from "react";
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

const PickupOrderCreateForm = ({ selectedPo }: { selectedPo: PickupOrder }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [addRow, setAddRow] = useState<CreatePicoDetail[]>([]);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [colPtRoutine, setColPtRoutine] = useState<colPtRoutine>();
  const [id, setId] = useState<number>(0);
  const { initPickupOrderRequest } = useContainer(CheckInRequestContainer);
  const navigate = useNavigate();
  const handleCloses = () => {
    setOpenModal(false);
  };

  console.log("yo" + JSON.stringify(addRow));
  const handleEditRow = (id: number) => {
    setEditRowId(id);
    setOpenModal(true);
  };
  const handleDeleteRow = (id: any) => {
    const updatedRows = addRow.filter((row) => row.id !== id);
    setAddRow(updatedRows);
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
  const columns: GridColDef[] = [
    { field: "time", headerName: "运送时间", width: 150 },
    {
      field: "items",
      headerName: "主类别",
      width: 150,
      editable: true,
      valueFormatter: (params) => params.value?.[0].recycTypeId,
    },
    {
      field: "items.recycSubType",
      headerName: "次类别",
      type: "string",
      width: 150,
      editable: true,
      valueFormatter: (params) => params.value?.[0].recycSubtypeId?.[0],
    },
    {
      field: "weight",
      headerName: "重量",
      type: "string",
      width: 150,
      editable: true,
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

  useEffect(() => {
    if (selectedPo) {
      formik.setValues({
        ...formik.values,
        picoType: selectedPo.picoType,
        effFrmDate:selectedPo.effFrmDate,
        effToDate: selectedPo.effToDate,
        routineType:selectedPo.routineType,       
        routine:[],           
      logisticId: selectedPo.logisticId,       
      logisticName:selectedPo.logisticName,   
      vehicleTypeId:selectedPo.vehicleTypeId,  
      platNo:selectedPo.platNo,            
      contactNo: selectedPo.contractNo,   
      status:'CREATED',            
      reason:selectedPo.reason,            
      normalFlg: true,       
      contractNo: selectedPo.contractNo,       
      updatedBy:'Admin',
    
     
      });
    }
  }, [selectedPo]);

  const formik = useFormik({
    initialValues: {
      picoType: "string",
      effFrmDate: "2023-12-12",
      effToDate: "2023-12-12",
      routineType: "string",
      routine: ["string"],
      logisticId: "string",
      logisticName: "hello",
      vehicleTypeId: "string",
      platNo: "string",
      contactNo: "string",
      status: "CREATED",
      reason: "string",
      normalFlg: true,
      approvedAt: "2023-12-12T02:17:30.062Z",
      rejectedAt: "2023-12-12T02:17:30.062Z",
      approvedBy: "string",
      rejectedBy: "string",
      contractNo: "string",
      updatedBy: "string",
      pickupOrderDetail: [],
    },

    onSubmit: async (values: EditPo) => {
      alert(JSON.stringify(values, null, 2));
      const result = await editPickupOrder(selectedPo.picoId, values);
      const data = result?.data;
      if (data) {
        console.log("all collection point: ", data);
        await initPickupOrderRequest();
        navigate("/collector/PickupOrder",{ state: "created" });    
      
    }else{
      alert('fail to create pickup order')
    }
      

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
                  <Typography sx={styles.header1}>建立运单</Typography>
                </Button>
              </Grid>
              <Grid item>
                <CustomField label={"请选择运输类别"}>
                  <CustomSwitch
                    onText="常规运输"
                    offText="一次性运输"
                    defaultValue={true}
                    setState={(value) =>
                      formik.setFieldValue("picoType", value)
                    }
                    value={formik.values.picoType}
                  />
                </CustomField>
              </Grid>
              <Grid item display="flex">
                <CustomDatePicker2
                  pickupOrderForm={true}
                  setDate={(values) => formik.setFieldValue("Date", values)}
                />
              </Grid>
              <CustomField label="回收周次" style={{ width: "100%" }}>
                <RoutineSelect setRoutine={setColPtRoutine} />
              </CustomField>
              <Grid item>
                <CustomField label={"选择物流公司"}>
                  <CustomTextField
                    id="logisticName"
                    placeholder="请输入公司名称"
                    onChange={formik.handleChange}
                    value={formik.values.logisticName}
                    sx={{ width: "400px" }}
                  ></CustomTextField>
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={"车辆类别"}>
                  <CustomItemList
                    items={carType}
                    singleSelect={(values) =>
                      formik.setFieldValue("vehicleTypeId", values)
                    }
                    value={formik.values.vehicleTypeId}
                  />
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={"车牌号码"}>
                  <CustomTextField
                    id="platNo"
                    placeholder="请填写车牌号码"
                    onChange={formik.handleChange}
                    value={formik.values.platNo}
                    sx={{ width: "400px" }}
                  />
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={"联络人号码"}>
                  <CustomTextField
                    id="contactNo"
                    placeholder="请填写手机号码"
                    onChange={formik.handleChange}
                    value={formik.values.contactNo}
                    sx={{ width: "400px" }}
                  />
                </CustomField>
              </Grid>
              <Grid item>
                <Box>
                  <CustomField label={"預計回收地點資料"}>
                    <CustomTextField
                      id="contractNo"
                      placeholder="请輸入編號"
                      onChange={formik.handleChange}
                      value={formik.values.contractNo}
                      sx={{ width: "400px" }}
                    />
                  </CustomField>
                </Box>
              </Grid>

              <Grid item>
                <CustomField label={"預計回收地點資料"}>
                  <DataGrid
                    rows={addRow}
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
                      data={addRow}
                      id={id}
                      setId={setId}
                      setState={setAddRow}
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
