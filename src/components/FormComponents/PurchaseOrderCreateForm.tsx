import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  Autocomplete,
  TextField,
  Modal,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { styles } from "../../constants/styles";
import CustomField from "./CustomField";
import CreateRecycleFormPurchaseOrder from "./CreateRecycleFormPurchaseOrder";
import { useContainer } from "unstated-next";
import { CreatePicoDetail } from "../../interfaces/pickupOrder";
import {
  PaymentType,
  PurChaseOrder,
  PurchaseOrderDetail,
} from "../../interfaces/purchaseOrder";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridRowSpacingParams } from "@mui/x-data-grid";
import { DELETE_OUTLINED_ICON, EDIT_OUTLINED_ICON } from "../../themes/icons";
import { t } from "i18next";
import CustomAutoComplete from "./CustomAutoComplete";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import i18n from "../../setups/i18n";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Languages, format } from "../../constants/constant";
import { localStorgeKeyName } from "../../constants/constant";
import {
  getThemeColorRole,
  displayCreatedDate,
  formatWeight,
} from "../../utils/utils";
import { customerList, manuList } from "../../interfaces/common";
import {
  getCompanyData,
  getCustomerList,
  getManuList,
} from "../../APICalls/Manufacturer/purchaseOrder";
import useLocaleTextDataGrid from "../../hooks/useLocaleTextDataGrid";
import { LocalizeRecycleProductTypePO } from "../TableComponents/LocalizeRecyctype";
import {
  getProductAddonFromDataRow,
  getProductSubTypeFromDataRow,
  getProductTypeFromDataRow,
} from "src/pages/Collector/PickupOrder/utils";
import { getManufacturerBasedLang } from "src/pages/Manufacturer/PurchaseOrder/utils";

dayjs.extend(utc);
dayjs.extend(timezone);

type DeleteModalProps = {
  open: boolean;
  selectedRecycLoc?: CreatePicoDetail | null;
  onClose: () => void;
  onDelete: (id: number) => void;
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  selectedRecycLoc,
  onClose,
  onDelete,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          <Box sx={{ paddingX: 3, paddingTop: 3 }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: "bold" }}
            >
              {t("pick_up_order.delete_msg")}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ alignSelf: "center", paddingBottom: 3 }}>
            <button
              className="primary-btn mr-2 cursor-pointer"
              onClick={() => {
                onDelete(selectedRecycLoc?.id);
              }}
            >
              {t("check_in.confirm")}
            </button>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={() => {
                onClose();
              }}
            >
              {t("check_out.cancel")}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};
type fieldName =
  | "receiverName"
  | "contactName"
  | "contactNo"
  | "paymentType"
  | "details"
  | "senderName";

type ErrorsField = Record<
  fieldName,
  {
    type: string;
    status: boolean;
    required: boolean;
  }
>;

const initialErrors = {
  receiverName: {
    type: "string",
    status: false,
    required: true,
  },
  contactName: {
    type: "string",
    status: false,
    required: true,
  },
  contactNo: {
    type: "string",
    status: false,
    required: true,
  },
  paymentType: {
    type: "string",
    status: false,
    required: true,
  },
  senderName: {
    type: "string",
    status: false,
    required: false,
  },
  details: {
    type: "array",
    status: false,
    required: true,
  },
};

const PurchaseOrderCreateForm = ({
  selectedPo,
  title,
  formik,
  setState,
  state,
  editMode,
}: {
  selectedPo?: PurChaseOrder;
  title: string;
  formik: any;
  setState: (val: PurchaseOrderDetail[]) => void;
  state: PurchaseOrderDetail[];
  editMode: boolean;
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [updateRowId, setUpdateRowId] = useState<number | null>(null);
  const role =
    localStorage.getItem(localStorgeKeyName.role) || "collectoradmin";
  const [id, setId] = useState<number>(0);
  const [picoRefId, setPicoRefId] = useState("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const {
    logisticList,
    weightUnits,
    productType,
    recycType,
    decimalVal,
    initWeightUnit,
    dateFormat,
    getRecycType,
    getProductType,
  } = useContainer(CommonTypeContainer);
  const [prevLang, setPrevLang] = useState("zhhk");
  const [manuList, setManuList] = useState<manuList[]>();
  const [customerList, setCustomerList] = useState<customerList[]>([]);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    receiverName: { type: "string", status: false, required: true },
    contactName: { type: "string", status: false, required: true },
    contactNo: { type: "string", status: false, required: true },
    paymentType: { type: "string", status: false, required: true },
    senderName: { type: "string", status: false, required: false },
    details: { type: "string", status: false, required: true },
  });
  const { localeTextDataGrid } = useLocaleTextDataGrid();
  const [errorsField, setErrorsField] = useState<ErrorsField>(initialErrors);

  const paymentTypes: PaymentType[] = [
    {
      paymentNameTchi: "現金",
      paymentNameSchi: "现金",
      paymentNameEng: "Cash",
      value: "cash",
    },
    {
      paymentNameTchi: "信用卡",
      paymentNameSchi: "信用卡",
      paymentNameEng: "Credit card",
      value: "card",
    },
    {
      paymentNameTchi: "支票",
      paymentNameSchi: "支票",
      paymentNameEng: "Cheque",
      value: "cheque",
    },
    {
      paymentNameTchi: "轉數快",
      paymentNameSchi: "转数快",
      paymentNameEng: "FPS",
      value: "fps",
    },
  ];

  const [currentPayment, setCurrentPayment] = useState<{
    value: string;
    description: string;
  }>({ value: "", description: "" });
  const logisticCompany = logisticList;
  const [recycbleLocId, setRecycbleLocId] = useState<CreatePicoDetail | null>(
    null
  );

  // set custom style each role
  const colorTheme: string = getThemeColorRole(role);
  // const customListTheme = getThemeCustomList(role)

  const fetchManuList = async () => {
    const response = await getManuList();
    if (response) {
      setManuList(response.data.content);
    }
  };

  const fetchCustomerList = async () => {
    const response = await getCustomerList();
    if (response) {
      setCustomerList(response.data.content);
    }
  };

  useEffect(() => {
    fetchManuList();
    fetchCustomerList();
    if (weightUnits.length === 0) initWeightUnit();
  }, []);

  const buttonFilledCustom = {
    borderRadius: "40px",
    borderColor: "#7CE495",
    backgroundColor: colorTheme,
    color: "white",
    fontWeight: "bold",
    transition: "0.3s",
    "&.MuiButton-root:hover": {
      backgroundColor: colorTheme,
      borderColor: "#D0DFC2",
      boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
    },
  };
  const buttonOutlinedCustom = {
    borderRadius: "40px",
    border: 1,
    borderColor: colorTheme,
    backgroundColor: "white",
    color: colorTheme,
    fontWeight: "bold",
    "&.MuiButton-root:hover": {
      bgcolor: "#F4F4F4",
    },
    width: "max-content",
  };

  const endAdornmentIcon = {
    fontSize: 25,
    color: colorTheme,
  };

  const picoIdButton = {
    flexDirection: "column",
    borderRadius: "8px",
    width: "400px",
    padding: "32px",
    border: 1,
    borderColor: colorTheme,
    backgroundColor: "white",
    color: "black",
    fontWeight: "bold",
    "&.MuiButton-root:hover": {
      bgcolor: "#F4F4F4",
    },
  };
  //-- end custom style --

  const handleCloses = () => {
    setIsEditing(false);
    setEditRowId(null);
    setUpdateRowId(null);
    setOpenModal(false);
  };

  const handleEditRow = (id: number) => {
    setIsEditing(true);
    setEditRowId(id);
    setOpenModal(true);
  };

  const handleDeleteRow = (id: any) => {
    if (editMode) {
      //let updateDeleteRow = state.filter((row, index) => row.id == id)
      // let updateDeleteRow: CreatePicoDetail[] = []
      // debugger
      const updateDeleteRow = state
        .filter((picoDtl) => picoDtl.poDtlId) // Only include items with picoDtlId
        .map((picoDtl) => ({
          ...picoDtl,
          status: picoDtl.poDtlId === id ? "DELETED" : picoDtl.status,
        }));
      setState(updateDeleteRow);
    } else {
      let updateDeleteRow = state.filter((row) => row.id !== id);
      setState(updateDeleteRow);
    }
  };

  const createdDate = selectedPo
    ? dayjs
        .utc(selectedPo.createdAt)
        .tz("Asia/Hong_Kong")
        .format(`${dateFormat} HH:mm`)
    : dayjs.utc(new Date()).tz("Asia/Hong_Kong").format(`${dateFormat} HH:mm`);

  const handleHeaderOnClick = () => {
    navigate(-1); //goback to last page
  };

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
    };
  }, []);

  const onDeleteModal = (id: number) => {
    handleDeleteRow(id);
    setOpenDelete(false);
  };

  const columns: GridColDef[] = [
    {
      field: "pickupAt",
      headerName: t("purchase_order.create.receipt_date_and_time"),
      width: 200,
      valueFormatter: (params) => {
        if (params) {
          return dayjs
            .utc(params.value)
            .tz("Asia/Hong_Kong")
            .format("YYYY/MM/DD hh:mm A");
        }
      },
    },
    {
      field: "itemCategory",
      headerName: t("pick_up_order.recyclForm.item_category"),
      valueGetter: ({ row }) => {
        const itemCategory = row?.productType ? t("product") : t("recyclables");

        return itemCategory;
      },
      width: 150,
    },
    {
      field: "recycTypeId",
      headerName: t("pick_up_order.detail.main_category"),
      width: 150,
      editable: true,
      valueGetter: ({ row }) => {
        const dataRowName = LocalizeRecycleProductTypePO({ data: row });
        let name = dataRowName?.typeName;

        if (!name) {
          const matchingRecycType = recycType?.find(
            (item) => item.recycTypeId === row.recycTypeId
          );
          const matchingProductType = getProductTypeFromDataRow({
            row,
            dataProductType: productType,
          });
          const resultData = row?.productType
            ? matchingProductType
            : matchingRecycType;
          const dataName = LocalizeRecycleProductTypePO({ data: resultData });
          name = dataName?.subTypeName || dataName?.typeName;
        }

        return name;
      },
    },
    {
      field: "recycSubTypeId",
      headerName: t("pick_up_order.detail.subcategory"),
      type: "string",
      width: 150,
      editable: true,
      valueGetter: ({ row }) => {
        const dataRowName = LocalizeRecycleProductTypePO({ data: row });
        let name = dataRowName?.subTypeName || dataRowName?.typeName;

        if (!name) {
          const matchingRecycType = recycType
            ?.find((item) => item.recycTypeId === row.recycTypeId)
            ?.recycSubType?.find(
              (item) => item.recycSubTypeId == row?.recycSubTypeId
            );
          const matchingProductType = getProductSubTypeFromDataRow({
            row,
            dataProductType: productType,
          });
          const resultData = row?.productType
            ? matchingProductType
            : matchingRecycType;
          const dataName = LocalizeRecycleProductTypePO({ data: resultData });
          name = dataName?.subTypeName || dataName?.typeName;
        }

        return name;
      },
    },
    {
      field: "addon",
      headerName: t("pick_up_order.product_type.add-on"),
      type: "string",
      width: 150,
      editable: true,
      valueGetter: ({ row }) => {
        const matchingProductType = getProductAddonFromDataRow({
          row,
          dataProductType: productType,
        });
        const dataName: any = row?.productType
          ? LocalizeRecycleProductTypePO({ data: matchingProductType })
              ?.typeName
          : "";
        return dataName;
      },
    },
    {
      field: "weight",
      headerName: t("purchase_order.create.weight"),
      type: "string",
      width: 150,
      editable: true,
      valueGetter: ({ row }) => {
        const unit = getUnitName(Number(row.unitId));
        return `${formatWeight(row.weight, decimalVal)} ${unit.lang}`;
      },
    },
    {
      field: "receiverAddr",
      headerName: t("purchase_order.create.arrived"),
      type: "string",
      width: 150,
      editable: true,
    },
    {
      field: "edit",
      headerName: t("pick_up_order.item.edit"),
      width: 100,
      filterable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleEditRow(params.row.id)}>
          <EDIT_OUTLINED_ICON />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: t("pick_up_order.item.delete"),
      width: 100,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setOpenDelete(true);
            setRecycbleLocId(params.row);
          }}
        >
          <DELETE_OUTLINED_ICON />
        </IconButton>
      ),
    },
  ];

  const onChangeAddressReceiver = (value: string) => {
    formik.setFieldValue("receiverAddr", value);
  };

  const onChangePaymentType = (value: string) => {
    if (!value) {
      formik.setFieldValue("paymentType", "");
      setErrorsField((prev) => {
        return {
          ...prev,
          paymentType: {
            ...prev.paymentType,
            status: true,
          },
        };
      });
      return;
    } else {
      setErrorsField((prev) => {
        return {
          ...prev,
          paymentType: {
            ...prev.paymentType,
            status: false,
          },
        };
      });
    }

    if (i18n.language === Languages.ENUS) {
      const payment = paymentTypes.find(
        (item) => item.paymentNameEng && item.paymentNameEng === value
      );
      if (payment) {
        formik.setFieldValue("paymentType", payment.value);
      }
    } else if (i18n.language === Languages.ZHCH) {
      const payment = paymentTypes.find(
        (item) => item.paymentNameSchi && item.paymentNameSchi === value
      );
      if (payment) {
        formik.setFieldValue("paymentType", payment.value);
      }
    } else {
      const payment = paymentTypes.find(
        (item) => item.paymentNameTchi && item.paymentNameTchi === value
      );
      if (payment) {
        formik.setFieldValue("paymentType", payment.value);
      }
    }
  };

  const onHandleError = (serviceName: fieldName, message: string) => {
    if (message === "succeed") {
      setErrorsField((prev) => {
        return {
          ...prev,
          [serviceName]: {
            ...prev[serviceName],
            status: false,
          },
        };
      });
    } else {
      setErrorsField((prev) => {
        return {
          ...prev,
          [serviceName]: {
            ...prev[serviceName],
            status: true,
          },
        };
      });
    }
  };

  const getCurrentValueManufacturer = (field: fieldName) => {
    if (!manuList) return;
    if (formik.values?.[field] && i18n.language !== prevLang) {
      for (let item of manuList) {
        if (
          Languages.ENUS === prevLang &&
          item.manufacturerNameEng === formik.values?.[field]
        ) {
          if (i18n.language === Languages.ZHCH) {
            onChangeContent(field, item.manufacturerNameSchi);
          } else if (i18n.language === Languages.ZHHK) {
            onChangeContent(field, item.manufacturerNameTchi);
          }
        } else if (
          Languages.ZHCH === prevLang &&
          item.manufacturerNameSchi === formik.values?.[field]
        ) {
          if (i18n.language === Languages.ENUS) {
            onChangeContent(field, item.manufacturerNameEng);
          } else if (i18n.language === Languages.ZHHK) {
            onChangeContent(field, item.manufacturerNameTchi);
          }
        } else if (
          Languages.ZHHK === prevLang &&
          item.manufacturerNameTchi === formik.values?.[field]
        ) {
          if (i18n.language === Languages.ENUS) {
            onChangeContent(field, item.manufacturerNameEng);
          } else if (i18n.language === Languages.ZHHK) {
            onChangeContent(field, item.manufacturerNameSchi);
          }
        }
      }
    }
  };

  const getCurrentValuePaymentType = () => {
    if (!paymentTypes) return;
    const paymentType = paymentTypes.find(
      (item) => item.value === currentPayment.value
    );
    if (paymentType) {
      formik.setFieldValue("paymentType", paymentType.value);
      if (Languages.ENUS === i18n.language) {
        setCurrentPayment({
          value: paymentType.value,
          description: paymentType.paymentNameEng,
        });
      } else if (Languages.ZHCH === i18n.language) {
        setCurrentPayment({
          value: paymentType.value,
          description: paymentType.paymentNameSchi,
        });
      } else {
        setCurrentPayment({
          value: paymentType.value,
          description: paymentType.paymentNameTchi,
        });
      }
    }
  };

  useEffect(() => {
    const paymentType = paymentTypes.find(
      (item) => item.value === selectedPo?.paymentType
    );
    if (paymentType) {
      setCurrentPayment({
        value: paymentType.value,
        description:
          i18n.language === "enus"
            ? paymentType.paymentNameEng
            : i18n.language === "zhch"
            ? paymentType.paymentNameSchi
            : paymentType.paymentNameTchi,
      });
    }
  }, [selectedPo]);

  useEffect(() => {
    if (!manuList) return;
    if (formik.values.receiverName && i18n.language !== prevLang) {
      getCurrentValueManufacturer("receiverName");
    }

    if (formik.values.senderName && i18n.language !== prevLang) {
      getCurrentValueManufacturer("senderName");
    }

    if (currentPayment.value && i18n.language !== prevLang) {
      getCurrentValuePaymentType();
    }
    setPrevLang(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    getRecycType();
    getProductType();
  }, []);

  const onChangeContent = (field: fieldName, value: any) => {
    if (value === "" || value === 0) {
      formik.setFieldValue([field], "");
      onHandleError(field, "failed");
    } else {
      formik.setFieldValue([field], value);
      onHandleError(field, "succeed");
    }
  };

  const handleUpdateSellerTenantId = async (value: string | null) => {
    if (value !== null) {
      const result = await getCompanyData(value);
      if (result?.data) {
        formik.setFieldValue("sellerTenantId", result?.data.tenantId);
      }
    }
  };

  const validateData = () => {
    let isValid = true;
    const filteredRecycData = state.filter(
      (value) => value.status !== "DELETED"
    );
    if (formik.values.receiverName === "") {
      setErrorsField((prev) => {
        return {
          ...prev,
          receiverName: {
            ...prev.receiverName,
            status: true,
          },
        };
      });
      isValid = false;
    }
    if (formik.values.contactName === "") {
      setErrorsField((prev) => {
        return {
          ...prev,
          contactName: {
            ...prev.contactName,
            status: true,
          },
        };
      });
      isValid = false;
    }
    if (formik.values.contactNo === "") {
      setErrorsField((prev) => {
        return {
          ...prev,
          contactNo: {
            ...prev.contactNo,
            status: true,
          },
        };
      });
      isValid = false;
    }
    if (formik.values.paymentType === "") {
      setErrorsField((prev) => {
        return {
          ...prev,
          paymentType: {
            ...prev.paymentType,
            status: true,
          },
        };
      });
      isValid = false;
    }

    if (state.length === 0) {
      setErrorsField((prev) => {
        return {
          ...prev,
          details: {
            ...prev.details,
            status: true,
          },
        };
      });
      isValid = false;
    }

    if (formik.values.senderName === formik.values.receiverName) {
      setErrorsField((prev) => {
        return {
          ...prev,
          senderName: {
            ...prev.senderName,
            status: true,
            required: true,
          },
        };
      });
      isValid = false;
    } else if (formik.values.senderName !== formik.values.receiverName) {
      setErrorsField((prev) => {
        return {
          ...prev,
          senderName: {
            ...prev.senderName,
            status: false,
            required: false,
          },
        };
      });
    }

    if (filteredRecycData.length < 1) {
      setErrorsField((prev) => {
        return {
          ...prev,
          details: {
            ...prev.details,
            status: true,
          },
        };
      });
      isValid = false;
    }

    return isValid;
  };

  const onhandleSubmit = () => {
    const isValid = validateData();
    if (!isValid) return;
    formik.handleSubmit();
  };

  useEffect(() => {
    const filteredRecycData = state.filter(
      (value) => value.status !== "DELETED"
    );
    console.log(filteredRecycData, "aa");
    if (filteredRecycData.length > 0) {
      setErrorsField((prev) => {
        return {
          ...prev,
          details: {
            ...prev.details,
            status: false,
          },
        };
      });
    }
  }, [state]);

  const getWeightUnits = (): { unitId: number; lang: string }[] => {
    let units: { unitId: number; lang: string }[] = [];
    if (i18n.language === Languages.ENUS) {
      units = weightUnits.map((item) => {
        return {
          unitId: item?.unitId,
          lang: item?.unitNameEng,
        };
      });
    } else if (i18n.language === Languages.ZHCH) {
      units = weightUnits.map((item) => {
        return {
          unitId: item?.unitId,
          lang: item?.unitNameSchi,
        };
      });
    } else {
      units = weightUnits.map((item) => {
        return {
          unitId: item?.unitId,
          lang: item?.unitNameTchi,
        };
      });
    }

    return units;
  };

  const getUnitName = (unitId: number): { unitId: number; lang: string } => {
    let unitName: { unitId: number; lang: string } = { unitId: 0, lang: "" };
    const unit = getWeightUnits().find((item) => item.unitId === unitId);
    if (unit) {
      unitName = unit;
    }
    return unitName;
  };

  return (
    <>
      {/* <form onSubmit={onhandleSubmit}> */}
      <Box sx={[styles.innerScreen_container, { paddingRight: 0 }]}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          <Grid
            container
            direction={"column"}
            spacing={2.5}
            sx={{ ...styles.gridForm }}
          >
            <Grid item>
              <Button sx={[styles.headerSection]} onClick={handleHeaderOnClick}>
                <ArrowBackIosIcon sx={{ fontSize: 15, marginX: 0.5 }} />
                <Typography sx={styles.header1}>{title}</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Typography sx={styles.header2}>
                {t("purchase_order.create.contact_information")}
              </Typography>
            </Grid>
            <Grid item>
              <CustomField
                label={t("purchase_order.create.receiving_company_name")}
                mandatory
              >
                <CustomAutoComplete
                  placeholder={t(
                    "purchase_order.create.receiving_company_name_placeholder"
                  )}
                  option={
                    customerList?.map((option) => {
                      if (i18n.language === Languages.ENUS) {
                        return option.customerNameEng;
                      } else if (i18n.language === Languages.ZHCH) {
                        return option.customerNameSchi;
                      } else {
                        return option.customerNameTchi;
                      }
                    }) ?? []
                  }
                  sx={{ width: "400px" }}
                  onChange={(_: SyntheticEvent, newValue: string | null) =>
                    formik.setFieldValue("receiverName", newValue)
                  }
                  onInputChange={(event: any, newInputValue: string) => {
                    onChangeContent("receiverName", newInputValue);
                  }}
                  value={formik.values.receiverName}
                  inputValue={formik.values.receiverName}
                  error={errorsField.receiverName.status}
                />
              </CustomField>
              {/* {
                  errorsField['receiverName' as keyof ErrorsField].required && errorsField['receiverName' as keyof ErrorsField].status ? 
                  <ErrorMessage  message={t('purchase_order.create.required_field')}/> : ''
                } */}
            </Grid>
            <Grid item>
              <CustomField
                label={t("purchase_order.create.contact_name")}
                mandatory
              >
                <CustomAutoComplete
                  placeholder={t(
                    "purchase_order.create.contact_name_placeholder"
                  )}
                  option={[]}
                  sx={{ width: "400px" }}
                  onChange={(_: SyntheticEvent, newValue: string | null) =>
                    formik.setFieldValue("contactName", newValue)
                  }
                  onInputChange={(event: any, newInputValue: string) => {
                    onChangeContent("contactName", newInputValue);
                  }}
                  value={formik.values.contactName}
                  inputValue={formik.values.contactName}
                  error={
                    errorsField.contactNo.status
                    //formik.errors.contactName && formik.touched.contactName
                  }
                />
              </CustomField>
              {/* {errorsField['contactName' as keyof ErrorsField].required &&
              errorsField['contactName' as keyof ErrorsField].status ? (
                <ErrorMessage
                  message={t('purchase_order.create.required_field')}
                />
              ) : (
                ''
              )} */}
            </Grid>
            <Grid item>
              <CustomField
                label={t("purchase_order.create.contact_number")}
                mandatory
              >
                <CustomAutoComplete
                  placeholder={t(
                    "purchase_order.create.contact_number_placeholder"
                  )}
                  option={[]}
                  sx={{ width: "400px" }}
                  onChange={(_: SyntheticEvent, newValue: string | null) =>
                    formik.setFieldValue("contactNo", newValue)
                  }
                  onInputChange={(event: any, newInputValue: string) => {
                    onChangeContent("contactNo", newInputValue);
                  }}
                  value={formik.values.contactNo}
                  inputValue={formik.values.contactNo}
                  error={formik.errors.contactNo && formik.touched.contactNo}
                />
              </CustomField>
              {/* {errorsField['contactNo' as keyof ErrorsField].required &&
              errorsField['contactNo' as keyof ErrorsField].status ? (
                <ErrorMessage
                  message={t('purchase_order.create.required_field')}
                />
              ) : (
                ''
              )} */}
            </Grid>
            <Grid item>
              <Box>
                <CustomField
                  label={t("purchase_order.create.payment_method")}
                  mandatory
                >
                  <Autocomplete
                    disablePortal
                    id="paymentType"
                    sx={{ width: 400 }}
                    // defaultValue={formik.values.paymentType}
                    value={currentPayment}
                    getOptionLabel={(option) => option.description}
                    options={paymentTypes.map((payment) => {
                      if (i18n.language === Languages.ENUS) {
                        return {
                          value: payment.value,
                          description: payment.paymentNameEng,
                        };
                      } else if (i18n.language === Languages.ZHCH) {
                        return {
                          value: payment.value,
                          description: payment.paymentNameSchi,
                        };
                      } else {
                        return {
                          value: payment.value,
                          description: payment.paymentNameTchi,
                        };
                      }
                    })}
                    onChange={(event, value) => {
                      if (value) {
                        setCurrentPayment(value);
                        formik.setFieldValue("paymentType", value.value);
                        onChangePaymentType(value?.value);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t(
                          "purchase_order.create.payment_method_placeholder"
                        )}
                        sx={[styles.textField, { width: 400 }]}
                        InputProps={{
                          ...params.InputProps,
                          sx: styles.textField,
                        }}
                        error={
                          errorsField.paymentType.status
                          // formik.errors.paymentType &&
                          // formik.touched.paymentType
                        }
                      />
                    )}
                    noOptionsText={t("common.noOptions")}
                  />
                </CustomField>
              </Box>
              {/* {errorsField['paymentType' as keyof ErrorsField].required &&
              errorsField['paymentType' as keyof ErrorsField].status ? (
                <ErrorMessage
                  message={t('purchase_order.create.required_field')}
                />
              ) : (
                ''
              )} */}
            </Grid>
            <Grid item>
              <Typography sx={styles.header2}>
                {t("purchase_order.create.order_information")}
              </Typography>
            </Grid>
            <Grid item>
              <Box>
                <CustomField label={t("purchase_order.create.recycling_plant")}>
                  <Autocomplete
                    disablePortal
                    id="senderName"
                    sx={{ width: 400 }}
                    defaultValue={getManufacturerBasedLang(
                      formik.values.senderName,
                      manuList
                    )}
                    value={getManufacturerBasedLang(
                      formik.values.senderName,
                      manuList
                    )}
                    options={
                      manuList?.map((option) => {
                        if (i18n.language === Languages.ENUS) {
                          return option.manufacturerNameEng;
                        } else if (i18n.language === Languages.ZHCH) {
                          return option.manufacturerNameSchi;
                        } else {
                          return option.manufacturerNameTchi;
                        }
                      }) ?? []
                    }
                    onChange={(event, value) => {
                      handleUpdateSellerTenantId(value);
                      formik.setFieldValue("senderName", value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t(
                          "purchase_order.create.payment_method_placeholder"
                        )}
                        sx={[styles.textField, { width: 400 }]}
                        InputProps={{
                          ...params.InputProps,
                          sx: styles.textField,
                        }}
                      />
                    )}
                    noOptionsText={t("common.noOptions")}
                  />
                </CustomField>
              </Box>
              {/* {
                  errorsField['senderName' as keyof ErrorsField].required && errorsField['senderName' as keyof ErrorsField].status ? 
                  <ErrorMessage  message={t('purchase_order.create.senderNameEqualToReceiverName')}/> : ''
                } */}
            </Grid>
            <Grid item>
              <CustomField label={""}>
                <DataGrid
                  rows={
                    editMode
                      ? state
                          .map((row, index) => ({ ...row }))
                          .filter((value) => value.status !== "DELETED")
                      : state
                  }
                  hideFooter
                  columns={columns}
                  disableRowSelectionOnClick
                  getRowSpacing={getRowSpacing}
                  localeText={localeTextDataGrid}
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
                <CreateRecycleFormPurchaseOrder
                  openModal={openModal}
                  data={state}
                  setId={setId}
                  setState={setState}
                  onClose={handleCloses}
                  editRowId={editRowId}
                  picoHisId={picoRefId}
                  isEditing={isEditing}
                  onChangeAddressReceiver={onChangeAddressReceiver}
                  receiverAddr={formik.values.receiverAddr}
                />

                <Button
                  variant="outlined"
                  startIcon={
                    <AddCircleIcon sx={{ ...endAdornmentIcon, pr: 1 }} />
                  }
                  onClick={() => {
                    setEditRowId(null);
                    setIsEditing(false);
                    setOpenModal(true);
                  }}
                  sx={{
                    height: "40px",
                    width: "100%",
                    mt: "20px",
                    borderColor: colorTheme,
                    color: "black",
                    borderRadius: "10px",
                  }}
                >
                  {t("pick_up_order.new")}
                </Button>
                {/* {errorsField['details' as keyof ErrorsField].required &&
                errorsField['details' as keyof ErrorsField].status ? (
                  <ErrorMessage
                    message={t('purchase_order.create.required_field')}
                  />
                ) : (
                  ''
                )} */}
              </CustomField>
            </Grid>
            <Grid item>
              <Typography sx={styles.header3}>
                {t("purchase_order.create.setup_time") + " : " + createdDate}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                // type="submit"
                onClick={onhandleSubmit}
                sx={[buttonFilledCustom, localstyles.localButton]}
              >
                {t("pick_up_order.finish")}
              </Button>
              <Button
                sx={[buttonOutlinedCustom, localstyles.localButton]}
                onClick={handleHeaderOnClick}
              >
                {t("pick_up_order.cancel")}
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
            {errorsField.receiverName.status && (
              <ErrorMessage
                message={
                  t("purchase_order.create.receiving_company_name") +
                  t("form.error.shouldNotBeEmpty")
                }
              />
            )}
            {errorsField.contactName.status && (
              <ErrorMessage
                message={
                  t("purchase_order.create.contact_name") +
                  t("form.error.shouldNotBeEmpty")
                }
              />
            )}
            {errorsField.contactNo.status && (
              <ErrorMessage
                message={
                  t("purchase_order.create.contact_number") +
                  t("form.error.shouldNotBeEmpty")
                }
              />
            )}
            {errorsField.paymentType.status && (
              <ErrorMessage
                message={
                  t("purchase_order.create.payment_method") +
                  t("form.error.shouldNotBeEmpty")
                }
              />
            )}
            {errorsField.details.status && (
              <ErrorMessage
                message={
                  t("purchase_order.create.order_information_details") +
                  t("form.error.shouldNotBeEmpty")
                }
              />
            )}
            {formik.values.senderName !== "" &&
              formik.values.receiverName !== "" &&
              formik.values.senderName === formik.values.receiverName && (
                <ErrorMessage
                  message={t(
                    "purchase_order.create.senderNameEqualToReceiverName"
                  )}
                />
              )}
          </Stack>
          <DeleteModal
            open={openDelete}
            selectedRecycLoc={recycbleLocId}
            onClose={() => {
              setOpenDelete(false);
            }}
            onDelete={onDeleteModal}
          />
        </LocalizationProvider>
      </Box>
      {/* </form> */}
    </>
  );
};

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="bg-[#F7BBC6] p-3 rounded-xl w-1/2">
      <Typography
        style={{
          color: "red",
          fontWeight: "400",
        }}
      >
        {message}
      </Typography>
    </div>
  );
};

let localstyles = {
  localButton: {
    width: "200px",
    fontSize: 18,
    mr: 3,
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: "34%",
    height: "fit-content",
    backgroundColor: "white",
    border: "none",
    borderRadius: 5,
  },
};

export default PurchaseOrderCreateForm;
