import {
  Alert,
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { styles } from "../../constants/styles";
import { DELETE_OUTLINED_ICON } from "../../themes/icons";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import theme from "../../themes/palette";
import CustomField from "./CustomField";
import CustomTimePicker from "./CustomTimePicker";
import { recyclable, timePeriod } from "../../interfaces/collectionPoint";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RecyclablesList from "../SpecializeComponents/RecyclablesList";
import { t } from "i18next";
import * as Yup from "yup";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import CustomTextField from "./CustomTextField";
import { ErrorMessage, useFormik } from "formik";
import { CreatePicoDetail } from "../../interfaces/pickupOrder";
import { Navigate, useNavigate } from "react-router";
import RecyclablesListSingleSelect from "../SpecializeComponents/RecyclablesListSingleSelect";
import { dateToLocalTime } from "../Formatter";

const CreateRecycleForm = ({
  onClose,
  setState,
  setId,
  data,
  id,
  editRowId,
}: {
  onClose: () => void;
  setState: (val: CreatePicoDetail[]) => void;
  data: CreatePicoDetail[];
  setId: Dispatch<SetStateAction<number>>;
  id: number;
  editRowId: number | null;
}) => {
  const [recyclables, setRecyclables] = useState<recyclable[]>([]);
  const { recycType } = useContainer(CommonTypeContainer);
  const editRow = data.find((row) => row.id === editRowId);

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // If the overlay is clicked (not its children), close the modal
      onClose && onClose();
    }
  };
  useEffect(() => {
    if (editRow) {
      // Set the form field values based on the editRow data
      formik.setValues({
        id: id,
        senderId: "1",
        senderName: editRow.senderName,
        senderAddr: editRow.senderAddr,
        senderAddrGps: [11, 12],
        receiverId: "1",
        receiverName: editRow.receiverName,
        receiverAddr: editRow.receiverAddr,
        receiverAddrGps: [11, 12],
        status: "CREATED",
        createdBy: "ADMIN",
        updatedBy: "ADMIN",
        pickupAt: "",
        item: {
          recycType: editRow.item.recycType,
          recycSubType: editRow.item.recycSubType,
          weight: editRow.item.weight,
        },
      });
    }
  }, [editRow]);

  const validateSchema = Yup.object().shape({
    senderName: Yup.string().required("This sendername is required"),
    senderAddr: Yup.string().required("This senderAddr is required"),
    receiverName: Yup.string().required("This receiverName is required"),
    receiverAddr: Yup.string().required("This receiverAddr is required"),
    item: Yup.object().shape({
      recycType: Yup.string().required("This recycType is required"),
      recycSubType: Yup.string().required("This recycSubType is required"),
      weight: Yup.number().required("This weight is required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      id: id,
      senderId: "1",
      senderName: "",
      senderAddr: "",
      senderAddrGps: [11, 12],
      receiverId: "1",
      receiverName: "",
      receiverAddr: "",
      receiverAddrGps: [11, 12],
      status: "CREATED",
      createdBy: "ADMIN",
      updatedBy: "ADMIN",
      pickupAt: "",
      item: {
        recycType: "",
        recycSubType: "",
        weight: 0,
      },
    },
    validationSchema: validateSchema,

    onSubmit: (values) => {
      console.log(values);
      alert(JSON.stringify(values, null, 2));
      const updatedValues: any = {
        ...values,
        id: id + 1,
        // items:items,
      };

      setState([...data, updatedValues]);
      setId(id + 1);
      onClose && onClose();
    },
  });
  console.log(formik.errors);

  const TextFields = [
    {
      label: "寄件公司",
      id: "senderName",
      value: formik.values.senderName,
      error: formik.errors.senderName && formik.touched.senderName,
    },
    {
      label: "收件公司",
      id: "receiverName",
      value: formik.values.receiverName,
      error: formik.errors.receiverName && formik.touched.receiverName,
    },
    {
      label: "回收地點",
      id: "senderAddr",
      value: formik.values.senderAddr,
      error: formik.errors.senderAddr && formik.touched.senderAddr,
    },
    {
      label: "到達地點",
      id: "receiverAddr",
      value: formik.values.receiverAddr,
      error: formik.errors.receiverAddr && formik.touched.receiverAddr,
    },
  ];

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={localstyles.modal} onClick={handleOverlayClick}>
            <Box sx={localstyles.container}>
              <Box
                sx={{ display: "flex", flex: "1", p: 4, alignItems: "center" }}
              >
                <Box>
                  <Typography sx={styles.header4}>新增</Typography>
                  <Typography sx={styles.header3}>預計回收物</Typography>
                </Box>

                <Box sx={{ marginLeft: "auto" }}>
                  <Button
                    variant="outlined"
                    sx={localstyles.button}
                    type="submit"
                  >
                    完成
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      ...localstyles.button,
                      color: theme.palette.primary.main,
                      bgcolor: "white",
                    }}
                    onClick={() => onClose && onClose()}
                  >
                    取消
                  </Button>
                  <IconButton sx={{ ml: "25px" }}>
                    <KeyboardTabIcon sx={{ fontSize: "30px" }} />
                  </IconButton>
                </Box>
              </Box>
              <Divider />
              <Stack spacing={2} sx={localstyles.content}>
                <CustomField label="運送時間" mandatory>
                  <TimePicker
                    sx={{ width: "100%" }}
                    value={formik.values.pickupAt}
                    onChange={(value) => {
                      if (value != null)
                        formik.setFieldValue(
                          "pickupAt",
                          dateToLocalTime(new Date(value))
                        );
                    }}
                  />
                </CustomField>

                <CustomField label={t("col.recycType")} mandatory>
                  <RecyclablesListSingleSelect
                  showError={formik.errors.item?.recycType&&formik.touched.item?.recycType||undefined}
                    recycL={recycType ?? []}
                    setState={(values) => {
                      formik.setFieldValue(
                        "item.recycType",
                        values?.recycTypeId
                      );
                      formik.setFieldValue(
                        "item.recycSubType",
                        values?.recycSubtypeId
                      );
                    }}
                  />
                </CustomField>
                <CustomField label="預計重量" mandatory>
                  <CustomTextField
                    id="item.weight"
                    placeholder="请輸入重量"
                    onChange={formik.handleChange}
                    value={formik.values.item.weight}
                    error={formik.errors.item?.weight&&formik.touched.item?.weight||undefined}
                    sx={{ width: "100%" }}
                    endAdornment={
                      <InputAdornment position="end">kg</InputAdornment>
                    }
                  ></CustomTextField>
                </CustomField>
                {TextFields.map((t) => (
                  <CustomField mandatory label={t.label}>
                    <CustomTextField
                      id={t.id}
                      placeholder="请输入地點"
                      rows={4}
                      onChange={formik.handleChange}
                      value={t.value}
                      sx={{ width: "100%" }}
                      error={t.error||undefined}
                    ></CustomTextField>
                  </CustomField>
                ))}
                <Stack spacing={2}>
                  { formik.errors.pickupAt&&formik.touched.pickupAt&&<Alert severity="error">{formik.errors.pickupAt} </Alert> }
                  { formik.errors.item?.recycType&&formik.touched.item?.recycType&&<Alert severity="error">{formik.errors.item?.recycType} </Alert> }
                  { formik.errors.item?.recycSubType&&formik.touched.item?.recycSubType&&<Alert severity="error">{formik.errors.item?.recycSubType} </Alert> }
                  { formik.errors.item?.weight&&formik.touched.item?.weight&&<Alert severity="error">{formik.errors.item?.weight} </Alert> }
                  { formik.errors.senderName&&formik.touched.senderName&&<Alert severity="error">{formik.errors.senderName} </Alert> }
                  { formik.errors.receiverName&&formik.touched.receiverName&&<Alert severity="error">{formik.errors.receiverName} </Alert> }
                  { formik.errors.senderAddr&&formik.touched.senderAddr&&<Alert severity="error">{formik.errors.senderAddr} </Alert> }
                  { formik.errors.receiverAddr&&formik.touched.receiverAddr&&<Alert severity="error">{formik.errors.receiverAddr} </Alert> }
                 </Stack>
              </Stack>
             
            </Box>
          </Box>
        </LocalizationProvider>
      </form>
    </>
  );
};

let localstyles = {
  modal: {
    display: "flex",
    height: "100vh",
    width: "100%",
    justifyContent: "flex-end",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "40%",
    bgcolor: "white",
    overflowY: "scroll",
  },

  button: {
    borderColor: theme.palette.primary.main,
    color: "white",
    width: "100px",
    height: "35px",
    p: 1,
    bgcolor: theme.palette.primary.main,
    borderRadius: "18px",
    mr: "10px",
  },
  content: {
    flex: 9,
    p: 4,
  },
  typo_header: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#858585",
    letterSpacing: "2px",
    mt: "10px",
  },
  typo_fieldTitle: {
    fontSize: "15px",
    color: "#ACACAC",
    letterSpacing: "2px",
  },
  typo_fieldContent: {
    fontSize: "17PX",
    letterSpacing: "2px",
  },
};

export default CreateRecycleForm;
