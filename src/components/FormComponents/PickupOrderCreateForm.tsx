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
import CustomSwitch from "./CustomSwitch";
import CustomDatePicker2 from "./CustomDatePicker2";
import CustomTextField from "./CustomTextField";
import CustomItemList, { il_item } from "./CustomItemList";
import CreateRecycleForm from "./CreateRecycleForm";
import { useContainer } from "unstated-next";
import {
  CreatePicoDetail,
  PickupOrder,
  PickupOrderDetail,
} from "../../interfaces/pickupOrder";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridRowSpacingParams } from "@mui/x-data-grid";
import { DELETE_OUTLINED_ICON, EDIT_OUTLINED_ICON } from "../../themes/icons";
import CustomAutoComplete from "./CustomAutoComplete";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import PicoRoutineSelect from "../SpecializeComponents/PicoRoutineSelect";
import PickupOrderList from "../../components/PickupOrderList";
import { useTranslation } from "react-i18next";
import { Languages, format } from "../../constants/constant";
import { localStorgeKeyName } from "../../constants/constant";
import {
  getThemeColorRole,
  getThemeCustomList,
  displayCreatedDate,
  getPrimaryColor,
} from "../../utils/utils";

import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import useLocaleTextDataGrid from "../../hooks/useLocaleTextDataGrid";
import useValidationPickupOrder from "../../pages/Collector/PickupOrder/useValidationPickupOrder";
import { t } from "i18next";
import {
  getProductAddonFromDataRow,
  getProductTypeFromDataRow,
  getProductSubTypeFromDataRow,
} from "src/pages/Collector/PickupOrder/utils";
import { getThirdPartyLogisticData } from "src/APICalls/Collector/pickupOrder/pickupOrder";
import { logisticList } from "src/interfaces/common";

dayjs.extend(utc);
dayjs.extend(timezone);

type DeleteModalProps = {
  open: boolean;
  selectedRecycLoc?: CreatePicoDetail | null;
  onClose: () => void;
  onDelete: (id: number) => void;
  editMode: boolean;
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

const WarningMessage: React.FC<{
  message: string;
  setContinue: () => void;
}> = ({ message, setContinue }) => {
  return (
    <div className="bg-[#F6F4B7] p-3 rounded-xl w-1/4">
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Typography
          style={{
            color: "#ec942c",
            fontWeight: "400",
          }}
        >
          {t("col.contractNo")} {message}
        </Typography>
        <Button
          sx={{ ...styles.buttonFilledGreen, marginLeft: "auto" }}
          onClick={() => setContinue && setContinue()}
        >
          {t("continue")}
        </Button>
      </Box>
    </div>
  );
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  selectedRecycLoc,
  onClose,
  onDelete,
  editMode,
}) => {
  const { t, i18n } = useTranslation();
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
                if (editMode && selectedRecycLoc?.picoDtlId) {
                  onDelete(selectedRecycLoc?.picoDtlId);
                } else {
                  onDelete(selectedRecycLoc?.id);
                }
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

const PickupOrderCreateForm = ({
  selectedPo,
  title,
  formik,
  setState,
  state,
  editMode,
}: {
  selectedPo?: PickupOrder;
  title: string;
  formik: any;
  setState: (val: CreatePicoDetail[]) => void;
  state: CreatePicoDetail[];
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
  const [skipValidation, setSkipValidation] = useState<string[]>([]);
  const { t, i18n } = useTranslation();
  const {
    logisticList,
    contractType,
    vehicleType,
    recycType,
    productType,
    dateFormat,
    getLogisticlist,
    getContractList,
    getRecycType,
  } = useContainer(CommonTypeContainer);
  const navigate = useNavigate();
  const { localeTextDataGrid } = useLocaleTextDataGrid();
  const logisticCompany = logisticList;
  const [thirdPartyLogisticList, setThirdPartyLogisticList] =
    useState<logisticList[]>();
  const contractRole = contractType;
  const [index, setIndex] = useState<number | null>(null);
  const { validateData, errorsField, changeTouchField } =
    useValidationPickupOrder(formik.values, state);

  const unexpiredContracts = contractRole
    ? contractRole.filter((contract) => {
      const currentDate = new Date();
      const contractDate = new Date(contract.contractToDate);

      // Set time to midnight to compare only the date part
      currentDate.setHours(0, 0, 0, 0);
      contractDate.setHours(0, 0, 0, 0);

      return contractDate >= currentDate && contract.status === "ACTIVE"; // Includes today
    })
    : [];

  const [recycbleLocId, setRecycbleLocId] = useState<CreatePicoDetail | null>(
    null
  );

  // set custom style each role
  const colorTheme: string = getThemeColorRole(role);
  const customListTheme = getThemeCustomList(role);
  const [prevLang, setPrevLang] = useState(i18n.language);

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

  const get3rdPartyLogisticList = async () => {
    const result = await getThirdPartyLogisticData();
    if (result) {
      setThirdPartyLogisticList(result.data.content);
    }
  };

  useEffect(() => {
    get3rdPartyLogisticList();
    getLogisticlist();
    getContractList();
    getRecycType();
  }, []);

  const handleCloses = () => {
    setIsEditing(false);
    setEditRowId(null);
    setUpdateRowId(null);
    setOpenModal(false);
    setIndex(null);
  };

  const handleEditRow = (id: number) => {
    setIsEditing(true);
    setEditRowId(id);
    setOpenModal(true);
  };

  const handleDeleteRow = (id: any) => {
    if (editMode) {
      if (!window.location.pathname.includes("approvePurchaseOrder")) {
        const updateDeleteRow = state
          .filter((picoDtl) => picoDtl.picoDtlId) // Only include items with picoDtlId
          .map((picoDtl) => ({
            ...picoDtl,
            status: picoDtl.picoDtlId === id ? "DELETED" : picoDtl.status,
          }));
        setState(updateDeleteRow);
      } else {
        // for puchase order page
        const updateDeleteRow = state.map((picoDtl) => ({
          ...picoDtl,
          status: picoDtl.id === id ? "DELETED" : picoDtl.status,
        }));
        setState(updateDeleteRow);
      }
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

  const approveAt = selectedPo?.approvedAt
    ? dayjs
      .utc(selectedPo?.approvedAt)
      .tz("Asia/Hong_Kong")
      .format(`${dateFormat} HH:mm`)
    : dayjs
      .utc(selectedPo?.updatedAt)
      .tz("Asia/Hong_Kong")
      .format(`${dateFormat} HH:mm`);

  const handleHeaderOnClick = () => {
    //console.log('Header click')
    navigate(-1); //goback to last page
  };
  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
    };
  }, []);

  const addSkipValidation = (skip: string) => {
    if (skip === "contractNo") {
      validateData(skip);
    }
  };
  const getvehicleType = () => {
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
      });
      return carType;
    }
  };

  const getReason = () => {
    const reasonList = [
      {
        id: "1",
        reasonEn: "Broken Car",
        reasonSchi: "坏车",
        reasonTchi: "壞車",
      },
      {
        id: "2",
        reasonEn: "Surplus of Goods",
        reasonSchi: "货物过剩",
        reasonTchi: "貨物過剩",
      },
    ];
    const reasons: il_item[] = [];
    reasonList.forEach((item) => {
      var name = "";
      switch (i18n.language) {
        case "enus":
          name = item.reasonEn;
          break;
        case "zhch":
          name = item.reasonSchi;
          break;
        case "zhhk":
          name = item.reasonTchi;
          break;
        default:
          name = item.reasonTchi; //default fallback language is zhhk
          break;
      }
      const reasonItem: il_item = {
        id: item.id,
        name: name,
      };
      reasons.push(reasonItem);
    });
    return reasons;
  };

  const onDeleteModal = (id: number) => {
    handleDeleteRow(id);
    setOpenDelete(false);
  };

  const columns: GridColDef[] = [
    {
      field: "pickupAt",
      headerName: t("pick_up_order.recyclForm.shipping_time"),
      width: 150,
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
      field: "recycType",
      headerName: t("pick_up_order.detail.main_category"),
      width: 150,
      // editable: true,
      valueGetter: ({ row }) => {
        const typeField = row.recycType || row.productType;
        const matchingRecycType = recycType?.find(
          (item) => item.recycTypeId === row.recycType
        );
        const matchingProductType = getProductTypeFromDataRow({
          row,
          dataProductType: productType,
        });

        if (matchingRecycType) {
          let name = "";
          switch (i18n.language) {
            case "enus":
              name = matchingRecycType.recyclableNameEng;
              break;
            case "zhch":
              name = matchingRecycType.recyclableNameSchi;
              break;
            case "zhhk":
              name = matchingRecycType.recyclableNameTchi;
              break;
            default:
              name = matchingRecycType.recyclableNameTchi;
          }
          return name;
        } else if (matchingProductType) {
          let name = "";
          switch (i18n.language) {
            case "enus":
              name = matchingProductType?.productNameEng;
              break;
            case "zhch":
              name = matchingProductType?.productNameSchi;
              break;
            case "zhhk":
              name = matchingProductType?.productNameTchi;
              break;
            default:
              name = matchingProductType?.productNameTchi;
          }
          return name;
        } else if (row.productType) {
          let name = "";
          switch (i18n.language) {
            case "enus":
              name = row.productType?.productNameEng;
              break;
            case "zhch":
              name = row.productType?.productNameSchi;
              break;
            case "zhhk":
              name = row.productType?.productNameTchi;
              break;
            default:
              name = row.productType?.productNameTchi;
          }
          return name;
        }

        return typeField;
      },
    },
    {
      field: "recycSubType",
      headerName: t("pick_up_order.detail.subcategory"),
      type: "string",
      width: 150,
      // editable: true,
      valueGetter: ({ row }) => {
        const matchingRecycType = recycType?.find(
          (item) => item.recycTypeId === row.recycType
        );

        const matchingProductSubType = getProductSubTypeFromDataRow({
          row,
          dataProductType: productType,
        });

        if (matchingRecycType) {
          const matchrecycSubType = matchingRecycType.recycSubType?.find(
            (subtype) => subtype.recycSubTypeId === row.recycSubType
          );
          if (matchrecycSubType) {
            var subName = "";
            switch (i18n.language) {
              case "enus":
                subName = matchrecycSubType?.recyclableNameEng ?? "";
                break;
              case "zhch":
                subName = matchrecycSubType?.recyclableNameSchi ?? "";
                break;
              case "zhhk":
                subName = matchrecycSubType?.recyclableNameTchi ?? "";
                break;
              default:
                subName = matchrecycSubType?.recyclableNameTchi ?? ""; //default fallback language is zhhk
                break;
            }

            return subName;
          } else {
            return row.recycSubType;
          }
        } else if (matchingProductSubType) {
          var subName = "";
          switch (i18n.language) {
            case "enus":
              subName = matchingProductSubType?.productNameEng || "";
              break;
            case "zhch":
              subName = matchingProductSubType?.productNameSchi || "";
              break;
            case "zhhk":
              subName = matchingProductSubType?.productNameTchi || "";
              break;
            default:
              subName = matchingProductSubType?.productNameTchi || ""; //default fallback language is zhhk
              break;
          }

          return subName;
        }
      },
    },
    {
      field: "addon",
      headerName: t("pick_up_order.product_type.add-on"),
      type: "string",
      width: 150,
      // editable: true,
      valueGetter: ({ row }) => {
        const matchingProductAddon = getProductAddonFromDataRow({
          row,
          dataProductType: productType,
        });

        var addonName = "";
        switch (i18n.language) {
          case "enus":
            addonName = matchingProductAddon?.productNameEng || "";
            break;
          case "zhch":
            addonName = matchingProductAddon?.productNameSchi || "";
            break;
          case "zhhk":
            addonName = matchingProductAddon?.productNameTchi || "";
            break;
          default:
            addonName = matchingProductAddon?.productNameTchi || "";
            break;
        }

        return addonName;
      },
    },
    {
      field: "weight",
      headerName: t("pick_up_order.detail.weight"),
      type: "string",
      width: 150,
      // editable: true,
    },
    {
      field: "senderName",
      headerName: t("pick_up_order.detail.sender_name"),
      type: "string",
      width: 150,
      // editable: true,
    },
    {
      field: "receiverName",
      headerName: t("pick_up_order.detail.receiver"),
      type: "string",
      width: 150,
      // editable: true,
    },
    {
      field: "senderAddr",
      headerName: t("pick_up_order.detail.recycling_location"),
      type: "string",
      width: 150,
      // editable: true,
    },
    {
      field: "receiverAddr",
      headerName: t("pick_up_order.detail.arrived"),
      type: "string",
      width: 200,
      // editable: true,
    },
    {
      field: "edit",
      headerName: t("notification.menu_staff.edit"),
      width: 100,
      filterable: false,
      renderCell: (params) => {
        // if (!params.row.isAutomation) {
        return (
          <IconButton
            onClick={() => {
              setIndex(params.row.id);
              handleEditRow(params.row.picoDtlId);
            }}
            disabled={params.row.isAutomation || params.row.refPicoDtlId}
            data-testId={
              "astd-create-edit-pickup-order-edit-recycling-3943" +
              params.row.id
            }
          >
            <EDIT_OUTLINED_ICON />
          </IconButton>
        );
        // }
      },
    },
    {
      field: "delete",
      headerName: t("pick_up_order.item.delete"),
      filterable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setOpenDelete(true);
            setRecycbleLocId(params.row);
          }}
          data-testId={
            "astd-create-edit-pickup-order-delete-recycling-4671" +
            params.row.id
          }
        >
          <DELETE_OUTLINED_ICON />
        </IconButton>
      ),
    },
  ];

  const [openPico, setOpenPico] = useState(false);

  const handleClosePicoList = () => {
    setOpenPico(false);
  };

  const selectPicoRefrence = (
    picodetail: PickupOrderDetail[],
    picoId: string
  ) => {
    console.log("selectPicoRefrence", picodetail);
    console.log("picoId", picoId);
    const newRow: CreatePicoDetail[] = picodetail
      .filter((value) => value.status === "OUTSTANDING")
      // picodetail.filter(value => value)
      .map((value, index) => {
        return {
          createdBy: value?.createdBy,
          updatedBy: value?.updatedBy,
          pickupAt: value?.pickupAt,
          picoHisId: value?.picoHisId,
          receiverAddr: value?.receiverAddr,
          receiverAddrGps: value?.receiverAddrGps,
          receiverId: value?.receiverId,
          receiverName: value?.receiverName,
          senderAddr: value?.senderAddr,
          senderAddrGps: value?.senderAddrGps,
          senderId: value?.senderId,
          senderName: value?.senderName,
          status: "CREATED",
          weight: `${value?.weight}`,
          id: state.length + index + 1000,
          refPicoDtlId: value?.picoDtlId,
          recycType: value?.recycType,
          recycSubType: value?.recycSubType,
          productType: value?.productType,
          version: value?.version,
          productAddonType: value?.productAddonType,
          productAddOnTypeRemark: value?.productAddOnTypeRemark,
          productSubType: value?.productSubType,
          productSubTypeRemark: value?.productSubTypeRemark,
          isAutomation: true,
        };
      });

    console.log("newRow", newRow);
    const newState = state
      ?.filter((value) => value?.isAutomation === undefined)
      .concat(newRow);
    setState(newState);

    setPicoRefId(picoId);
    formik.setFieldValue("refPicoId", picoId);
    setOpenPico(false);
    console.log("newState", newState);
  };

  const resetPicoId = () => {
    setOpenPico(true);
    setPicoRefId("");
  };

  const getCurrentLogisticName = (value: string) => {
    let logisticName: string = "";
    if (!logisticCompany) return logisticName;
    const logisticSimplified = logisticCompany.find(
      (item) => item.logisticNameSchi === value
    );
    const logisticEnglish = logisticCompany.find(
      (item) => item.logisticNameEng === value
    );
    const logisticTraditional = logisticCompany.find(
      (item) => item.logisticNameTchi === value
    );
    if (logisticSimplified !== undefined) {
      if (i18n.language === "enus") {
        logisticName = logisticSimplified?.logisticNameEng ?? "";
      } else if (i18n.language === "zhhk") {
        logisticName = logisticSimplified?.logisticNameTchi ?? "";
      } else if (i18n.language === "zhch") {
        logisticName = logisticSimplified?.logisticNameSchi ?? "";
      }
    } else if (logisticEnglish !== undefined) {
      if (i18n.language === "zhch") {
        logisticName = logisticEnglish?.logisticNameSchi ?? "";
      } else if (i18n.language === "zhhk") {
        logisticName = logisticEnglish?.logisticNameTchi ?? "";
      } else if (i18n.language === "enus") {
        logisticName = logisticEnglish?.logisticNameEng ?? "";
      }
    } else if (logisticTraditional !== undefined) {
      if (i18n.language === "zhch") {
        logisticName = logisticTraditional?.logisticNameSchi ?? "";
      } else if (i18n.language === "enus") {
        logisticName = logisticTraditional?.logisticNameEng ?? "";
      } else if (i18n.language === "zhhk") {
        logisticName = logisticTraditional?.logisticNameTchi ?? "";
      }
    }
    formik.setFieldValue("logisticName", logisticName);
  };

  useEffect(() => {
    if (formik?.values?.logisticName && prevLang !== i18n.language) {
      getCurrentLogisticName(formik.values.logisticName);
    }
    setPrevLang(i18n.language);
  }, [i18n.language]);

  const onhandleSubmit = () => {
    const param =
      formik?.values?.picoType === "AD_HOC" ? "contractNo" : undefined;
    const isValid = validateData(param);
    if (isValid == true) {
      formik.handleSubmit();
    }
  };

  return (
    <>
      {/* <form onSubmit={formik.handleSubmit}> */}
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
                {t("pick_up_order.shipping_info")}
              </Typography>
            </Grid>
            {selectedPo && (
              <Grid item>
                <Grid item>
                  <CustomField label={t("pick_up_order.table.pico_id")}>
                    <Typography sx={styles.header2}>
                      {selectedPo.picoId}
                    </Typography>
                  </CustomField>
                </Grid>
              </Grid>
            )}
            <Grid item>
              <CustomField
                label={t("pick_up_order.select_shipping_category")}
                mandatory
              >
                <CustomSwitch
                  onText={t("pick_up_order.regular_shipping")}
                  offText={t("pick_up_order.one-transport")}
                  defaultValue={
                    selectedPo !== undefined
                      ? selectedPo?.picoType === "AD_HOC"
                        ? false
                        : selectedPo?.picoType === "ROUTINE"
                          ? true
                          : true
                      : true
                  }
                  setState={(value) => {
                    formik.setFieldValue(
                      "picoType",
                      value ? "ROUTINE" : "AD_HOC"
                    );
                    formik.setFieldValue("logisticName", "");
                  }}
                  value={formik.values.picoType}
                  dataTestId="astd-create-edit-pickup-order-type-select-button-2449"
                />
              </CustomField>
            </Grid>
            {formik.values.picoType == "ROUTINE" && (<Grid item style={{ display: "flex", flexDirection: "column" }}>
              <CustomDatePicker2
                pickupOrderForm={true}
                setDate={(values) => {
                  formik.setFieldValue("effFrmDate", values.startDate);
                  formik.setFieldValue("effToDate", values.endDate);
                  changeTouchField("effFrmDate");
                  changeTouchField("effToDate");
                }}
                defaultStartDate={selectedPo?.effFrmDate}
                defaultEndDate={selectedPo?.effToDate}
                iconColor={colorTheme}
              />
              {/* {errorsField.effFrmDate.status ? (
                <ErrorMessage message={errorsField.effFrmDate.message} />
              ) : (
                ''
              )}
              {errorsField.effToDate.status ? (
                <ErrorMessage message={errorsField.effToDate.message} />
              ) : (
                ''
              )} */}
            </Grid>)}
            {formik.values.picoType == "AD_HOC" && (
              <Grid item>
                <CustomField
                  label={t("common.validityDate")}
                >
                  <Typography variant="body1" style={{ marginBottom: "8px" }}>
                    {dayjs.utc(new Date()).tz("Asia/Hong_Kong").format(dateFormat)}
                  </Typography>
                </CustomField>
              </Grid>)}
            {formik.values.picoType == "ROUTINE" && (
              <Grid item style={{ display: "flex", flexDirection: "column" }}>
                <CustomField
                  label={t("pick_up_order.table.delivery_datetime")}
                  style={{ width: "100%" }}
                  mandatory
                >
                  <PicoRoutineSelect
                    setRoutine={(values) => {
                      formik.setFieldValue("routineType", values.routineType);
                      formik.setFieldValue("routine", values.routineContent);
                      changeTouchField("routine");
                    }}
                    defaultValue={{
                      routineType: selectedPo?.routineType ?? "daily",
                      routineContent:
                        selectedPo?.routineType === "weekly"
                          ? selectedPo?.routine ?? []
                          : selectedPo?.routineType === "specificDate"
                            ? selectedPo?.specificDates ?? []
                            : [],
                    }}
                    itemColor={{
                      bgColor: customListTheme?.bgColor,
                      borderColor: customListTheme
                        ? customListTheme.border
                        : "#79CA25",
                    }}
                    roleColor={colorTheme}
                  />
                </CustomField>
                {/* {errorsField.routine.status ? (
                  <ErrorMessage message={errorsField.routine.message} />
                ) : (
                  ''
                )} */}
              </Grid>
            )}

            <Grid item style={{ display: "flex", flexDirection: "column" }}>
              <CustomField label={t("pick_up_order.choose_logistic")} mandatory>
                <CustomAutoComplete
                  placeholder={t("pick_up_order.enter_company_name")}
                  option={
                    formik.values.picoType === "AD_HOC"
                      ? thirdPartyLogisticList?.map((option) => {
                        if (i18n.language === Languages.ENUS) {
                          return option.logisticNameEng;
                        } else if (i18n.language === Languages.ZHCH) {
                          return option.logisticNameSchi;
                        } else {
                          return option.logisticNameTchi;
                        }
                      }) ?? []
                      : logisticCompany?.map((option) => {
                        if (i18n.language === Languages.ENUS) {
                          return option.logisticNameEng;
                        } else if (i18n.language === Languages.ZHCH) {
                          return option.logisticNameSchi;
                        } else {
                          return option.logisticNameTchi;
                        }
                      }) ?? []
                  }
                  sx={{ width: "400px" }}
                  onChange={(_: SyntheticEvent, newValue: string | null) => {
                    formik.setFieldValue("logisticName", newValue);
                    changeTouchField("logisticName");
                  }}
                  onInputChange={(event: any, newInputValue: string) => {
                    formik.setFieldValue("logisticName", newInputValue); // Update the formik field value if needed
                    changeTouchField("logisticName");
                  }}
                  value={formik.values.logisticName}
                  inputValue={formik.values.logisticName}
                  error={
                    errorsField.logisticName.status
                    //formik.errors.logisticName && formik.touched.logisticName
                  }
                  dataTestId={
                    "astd-create-edit-pickup-order-choose-logistic-select-button-6878"
                  }
                />
              </CustomField>
              {/* {errorsField.logisticName.status ? (
                <ErrorMessage message={errorsField.logisticName.message} />
              ) : (
                ''
              )} */}
            </Grid>
            <Grid item style={{ display: "flex", flexDirection: "column" }}>
              <CustomField
                label={t("pick_up_order.vehicle_category")}
                mandatory={false}
              >
                <CustomItemList
                  items={getvehicleType() || []}
                  singleSelect={(values) =>
                    formik.setFieldValue("vehicleTypeId", values)
                  }
                  value={formik.values.vehicleTypeId}
                  defaultSelected={selectedPo?.vehicleTypeId}
                  error={
                    errorsField.vehicleTypeId.status
                    // formik.errors.vehicleTypeId && formik.touched.vehicleTypeId
                  }
                  itemColor={{
                    bgColor: customListTheme.bgColor,
                    borderColor: customListTheme
                      ? customListTheme.border
                      : "#79CA25",
                  }}
                  dataTestId="astd-create-edit-pickup-order-vehicle-type-select-button-9679"
                />
              </CustomField>
            </Grid>
            <Grid item>
              <CustomField
                label={t("pick_up_order.contact_number")}
                mandatory={false}
              >
                <CustomTextField
                  id="contactNo"
                  placeholder={t("pick_up_order.enter_contact_number")}
                  onChange={(event) => {
                    formik.setFieldValue("contactNo", event.target.value);
                    changeTouchField("contactNo");
                  }}
                  value={formik.values.contactNo}
                  sx={{ width: "400px" }}
                  error={formik.errors.contactNo && formik.touched.contactNo}
                  dataTestId="astd-create-edit-pickup-order-contact-no-input-field-6429"
                />
              </CustomField>
            </Grid>
            {formik.values.picoType == "ROUTINE" && (
              <Grid item>
                <Box>
                  <CustomField label={t("col.contractNo")}>
                    <Autocomplete
                      disablePortal
                      id="contractNo"
                      sx={{ width: 400 }}
                      defaultValue={formik.values.contractNo}
                      options={
                        unexpiredContracts?.map(
                          (contract) => contract.contractNo
                        ) || []
                      }
                      onChange={(event, value) => {
                        formik.setFieldValue("contractNo", value);
                        addSkipValidation("contractNo");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={t("col.enterNo")}
                          sx={[styles.textField, { width: 400 }]}
                          InputProps={{
                            ...params.InputProps,
                            sx: styles.inputProps,
                          }}
                          data-testId="astd-create-edit-pickup-order-contract-no-select-button-3176"
                        />
                      )}
                      noOptionsText={t("common.noOptions")}
                    />
                  </CustomField>
                </Box>
              </Grid>
            )}
            {formik.values.picoType == "AD_HOC" && (
              <Grid item style={{ display: "flex", flexDirection: "column" }}>
                <CustomField
                  label={t("pick_up_order.adhoc.reason_get_off")}
                  mandatory
                >
                  <CustomItemList
                    items={getReason() || []}
                    singleSelect={(values) => {
                      formik.setFieldValue("reason", values);
                    }}
                    value={formik.values.reason}
                    defaultSelected={selectedPo?.reason}
                    error={
                      errorsField.AD_HOC.status
                      //formik.errors.reason && formik.touched.reason
                    }
                    itemColor={{
                      bgColor: customListTheme.bgColor,
                      borderColor: customListTheme
                        ? customListTheme.border
                        : "#79CA25",
                    }}
                    dataTestId="astd-create-edit-pickup-order-ad-hoc-reason-select-button-5199"
                  />
                </CustomField>
                {/* {errorsField.AD_HOC.status ? (
                  <ErrorMessage message={errorsField.AD_HOC.message} />
                ) : (
                  ''
                )} */}
              </Grid>
            )}
            {formik.values.picoType === "AD_HOC" && (
              <Grid item>
                <Typography sx={[styles.header3, { marginBottom: 1 }]}>
                  {t("pick_up_order.adhoc.po_number")}
                </Typography>
                {formik.values.refPicoId !== "" && formik.values.refPicoId ? (
                  <div className="flex items-center justify-between w-[390px]">
                    <div className="font-bold text-mini">
                      {formik.values.refPicoId}
                    </div>
                    <div
                      className={`text-mini cursor-pointer text-[${colorTheme}]`}
                      onClick={resetPicoId}
                      data-testId="astd-create-edit-pickup-order-related-po-change-menu-button-5755"
                    >
                      {t("pick_up_order.change")}
                    </div>
                  </div>
                ) : (
                  <div>
                    <Button
                      sx={[picoIdButton]}
                      onClick={() => setOpenPico(true)}
                      data-testId="astd-create-edit-pickup-order-related-po-select-menu-button-7503"
                    >
                      <AddCircleIcon sx={{ ...endAdornmentIcon, pr: 1 }} />
                      {t("pick_up_order.choose")}
                    </Button>
                  </div>
                )}
              </Grid>
            )}
            <Grid item>
              <Typography sx={styles.header2}>
                {t("pick_up_order.recyle_loc_info")}
              </Typography>
            </Grid>
            <Grid item>
              <CustomField label={""}>
                <DataGrid
                  rows={state.filter((row, index) => {
                    if (row.status !== "DELETED") {
                      return {
                        ...row,
                        id: row.picoDtlId,
                      };
                    }
                  })}
                  getRowId={(row) => row.id}
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
                {/* <Modal open={openModal} onClose={handleCloses}> */}
                <CreateRecycleForm
                  openModal={openModal}
                  data={state}
                  setId={setId}
                  setState={setState}
                  onClose={handleCloses}
                  editRowId={editRowId}
                  picoHisId={picoRefId}
                  isEditing={isEditing}
                  index={index}
                  editMode={editMode}
                />
                {/* </Modal> */}

                <PickupOrderList
                  drawerOpen={openPico}
                  handleDrawerClose={handleClosePicoList}
                  selectPicoDetail={selectPicoRefrence}
                  picoId={selectedPo?.picoId}
                ></PickupOrderList>

                <Button
                  variant="outlined"
                  startIcon={
                    <AddCircleIcon sx={{ ...endAdornmentIcon, pr: 1 }} />
                  }
                  onClick={() => {
                    setIndex(null);
                    setIsEditing(false);
                    setOpenModal(true);
                    changeTouchField("createPicoDetail");
                  }}
                  data-testId="astd-create-edit-pickup-order-new-recycling-9199"
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
              </CustomField>
            </Grid>
            <Grid item>
              {/* {errorsField.createPicoDetail.status ? (
                <ErrorMessage message={errorsField.createPicoDetail.message} />
              ) : (
                ''
              )} */}
            </Grid>
            <Grid item>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    ...styles.header3,
                    paddingX: "4px",
                    paddingRight: "16px",
                  }}
                >
                  {t("common.createdDatetime") + " : " + createdDate}
                </Typography>
                {approveAt && editMode && (
                  <Typography
                    sx={{
                      ...styles.header3,
                      paddingX: "4px",
                      paddingLeft: "16px",
                      borderLeft: "1px solid #ACACAC",
                    }}
                  >
                    {t("common.lastUpdateDatetime") + " : " + approveAt}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                sx={[buttonFilledCustom, localstyles.localButton]}
                onClick={onhandleSubmit}
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
            {/* {Object.keys(formik.errors).map((fieldName) =>
              formik.touched[fieldName] && formik.errors[fieldName] ? (
                <Alert severity="error" key={fieldName}>
                  {formik.errors[fieldName]}
                </Alert>
              ) : null
            )} */}
            {errorsField.routine.status && (
              <ErrorMessage message={errorsField.routine.message} />
            )}
            {errorsField.effFrmDate.status && (
              <ErrorMessage message={errorsField.effFrmDate.message} />
            )}
            {errorsField.effToDate.status && (
              <ErrorMessage message={errorsField.effToDate.message} />
            )}
            {errorsField.logisticName.status && (
              <ErrorMessage message={errorsField.logisticName.message} />
            )}
            {errorsField.AD_HOC.status &&
              formik.values.picoType === "AD_HOC" && (
                <ErrorMessage message={errorsField.AD_HOC.message} />
              )}
            {errorsField.createPicoDetail.status && (
              <ErrorMessage message={errorsField.createPicoDetail.message} />
            )}
            {errorsField.contactNo.status && (
              <ErrorMessage message={errorsField.contactNo.message} />
            )}
            {errorsField.contractNo.status && (
              <WarningMessage
                message={errorsField.contractNo.message}
                setContinue={() => addSkipValidation("contractNo")}
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
            editMode={editMode}
          />
        </LocalizationProvider>
      </Box>
      {/* </form> */}
    </>
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

export default PickupOrderCreateForm;
