import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { styles } from "../../constants/styles";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import theme from "../../themes/palette";
import CustomField from "./CustomField";
import { singleRecyclable } from "../../interfaces/collectionPoint";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as Yup from "yup";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import CustomTextField from "./CustomTextField";
import { FormikHelpers, useFormik } from "formik";
import { CreatePicoDetail } from "../../interfaces/pickupOrder";
import RecyclablesListSingleSelect from "../SpecializeComponents/RecyclablesListSingleSelect";
import { collectorList, manuList } from "../../interfaces/common";
import CustomAutoComplete from "./CustomAutoComplete";
import dayjs from "dayjs";
import { Languages, localStorgeKeyName } from "../../constants/constant";
import {
  formatWeight,
  getThemeColorRole,
  getThemeCustomList,
  onChangeWeight,
} from "../../utils/utils";
import { useTranslation } from "react-i18next";
import NotifContainer from "../../contexts/NotifContainer";
import i18n from "../../setups/i18n";
import Switcher from "./CustomSwitch";
import ProductListSingleSelect from "../SpecializeComponents/ProductListSingleSelect";
import { getProductTypeList } from "../../APICalls/ASTD/settings/productType";
import { Products } from "../../interfaces/productType";
import ConfirmModal from "../SpecializeComponents/ConfirmationModal";
import useModalConfirmRemarksEmpty from "../ModalConfirmRemarksEmpty";

type props = {
  openModal: boolean;
  onClose: () => void;
  setState: (val: CreatePicoDetail[]) => void;
  data: CreatePicoDetail[];
  setId: Dispatch<SetStateAction<number>>;
  picoHisId: string | null;
  editRowId: number | null;
  isEditing: boolean;
  index?: number | null;
  editMode: boolean;
};
const loginId = localStorage.getItem(localStorgeKeyName.username) || "";
const initialTime: dayjs.Dayjs = dayjs();

const formattedTime = (pickupAtValue: dayjs.Dayjs) => {
  return pickupAtValue.format("HH:mm:ss");
};

export type singleProduct = {
  productTypeId: string;
  productSubTypeId: string;
  productAddonId: string;
  productSubTypeRemark: string;
  productAddonTypeRemark: string;
  isProductSubTypeOthers?: boolean;
  isProductAddonTypeOthers?: boolean;
};
export interface InitValue {
  picoDtlId?: any;
  picoHisId: string;
  senderId: string;
  senderName: string;
  senderAddr: string;
  senderAddrGps: number[];
  receiverId: string;
  receiverName: string;
  receiverAddr: string;
  receiverAddrGps: number[];
  status: string;
  createdBy: string;
  updatedBy: string;
  pickupAt: string;
  recycType?: string;
  recycSubType?: string;
  weight: string;
  newDetail?: boolean;
  id?: number;
  recycTypeName?: string;
  itemCategory?: string;
  addon?: string;
  productType?: string;
  productSubType?: string;
  productAddon?: string;
  productSubTypeRemark?: string;
  productAddonTypeRemark?: string;
}

const initValue: InitValue = {
  picoHisId: "",
  senderId: "",
  senderName: "",
  senderAddr: "",
  senderAddrGps: [0, 0],
  receiverId: "",
  receiverName: "",
  receiverAddr: "",
  receiverAddrGps: [0, 0],
  status: "CREATED",
  createdBy: loginId,
  updatedBy: loginId,
  pickupAt: "00:00:00",
  recycType: "",
  recycSubType: "",
  weight: "0",
  newDetail: true,
  id: 0,
  recycTypeName: "",
  itemCategory: "Recyclables",
  addon: "",
  productType: "",
  productSubType: "",
  productAddon: "",
  productSubTypeRemark: undefined,
  productAddonTypeRemark: undefined,
};

const CreateRecycleForm = ({
  openModal,
  onClose,
  setState,
  data,
  editRowId,
  isEditing,
  picoHisId,
  index,
  editMode,
}: props) => {
  const {
    recycType,
    manuList,
    collectorList,
    decimalVal,
    productType,
    getProductType,
    getManuList,
    getCollectorList,
  } = useContainer(CommonTypeContainer);

  const {
    resetModal,
    openConfirmModal,
    setOpenConfirmModal,
    validateRemarks,
    ModalConfirmRemarksEmpty,
  } = useModalConfirmRemarksEmpty({
    onConfirm: () => {
      formik.handleSubmit();
    },
  });

  const [editRow, setEditRow] = useState<CreatePicoDetail | null>(null);
  const [defaultRecyc, setDefaultRecyc] = useState<singleRecyclable>();
  const [defaultProduct, setDefaultProduct] = useState<singleProduct>();

  const { marginTop } = useContainer(NotifContainer);
  const [isDetailDouble, setIsDetailDouble] = useState(false);
  const [isRecyc, setRecycType] = useState<boolean>(true);
  //---set custom style each role---
  const role =
    localStorage.getItem(localStorgeKeyName.role) || "collectoradmin";
  const colorTheme: string = getThemeColorRole(role) || "#79CA25";
  const customListTheme = getThemeCustomList(role) || "#E4F6DC";
  //---end set custom style each role---
  const { t } = useTranslation();
  const setDefRecyc = (picoDtl: CreatePicoDetail) => {
    const defRecyc: singleRecyclable = {
      recycTypeId: picoDtl.recycType ?? "",
      recycSubTypeId: picoDtl.recycSubType ?? "",
    };
    setDefaultRecyc(defRecyc);
  };
  const setDefProd = (picoDtl: CreatePicoDetail) => {
    const defProd: singleProduct = {
      productTypeId:
        picoDtl?.productType?.productTypeId || picoDtl?.productType || "",
      productSubTypeId:
        picoDtl?.productSubType?.productSubTypeId ||
        picoDtl?.productSubType ||
        "",
      productAddonId:
        picoDtl?.productAddonType?.productAddonTypeId ||
        picoDtl?.productAddon ||
        picoDtl?.productAddonType ||
        "",
      productAddonTypeRemark: picoDtl.productAddonTypeRemark || "",
      productSubTypeRemark: picoDtl.productSubTypeRemark || "",
    };

    setDefaultProduct(defProd);
  };

  useEffect(() => {
    if (editRowId) {
      const editR = data.find((item) => item.picoDtlId === editRowId);
      if (editR) {
        setDefRecyc(editR);
        setDefProd(editR);
        setEditRow(editR);
      }
    } else if (editRowId == null && index && editMode) {
      const editR = data.find((item) => item.id === index);
      if (editR) {
        setDefRecyc(editR);
        setDefProd(editR);
        setEditRow(editR);
      }
    } else if (editMode) {
      setDefaultRecyc(undefined);
      setDefaultProduct(undefined);
      initValue.id = data.length;
      formik.setValues(initValue);
    }

    if (!editMode && index !== null && index !== undefined) {
      const edit = data.find((item) => item.id === index);

      if (edit) {
        setDefRecyc(edit);
        setDefProd(edit);
        setEditRow(edit);
      }
    }
  }, [editRowId]);

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

      const refactorDataFormik = {
        id: editRow.id,
        picoDtlId: editRowId === editRow.picoDtlId ? editRow.picoDtlId : 0,
        picoHisId: picoHisId ?? "",
        senderId: editRow.senderId,
        senderName: editRow.senderName,
        senderAddr: editRow.senderAddr,
        senderAddrGps: editRow.senderAddrGps,
        receiverId: editRow.receiverId,
        receiverName: editRow.receiverName,
        receiverAddr: editRow.receiverAddr,
        receiverAddrGps: editRow.receiverAddrGps,
        status: editRow.status,
        createdBy: editRow.createdBy,
        updatedBy: editRow.updatedBy,
        pickupAt: editRow.pickupAt,
        recycType: editRow.recycType,
        recycSubType: editRow.recycSubType,
        weight: formatWeight(editRow.weight, decimalVal),
        itemCategory: editRow.itemCategory,
        addon: editRow.addon,
        productType: editRow?.productType?.productTypeId || editRow.productType, // => first value for edit from API , second value from create data row
        productSubType:
          editRow?.productSubType?.productSubTypeId || editRow.productSubType,
        productSubTypeRemark: editRow?.productSubTypeRemark,
        productAddonTypeRemark: editRow?.productAddonTypeRemark,
        productAddon:
          editRow?.productAddonType?.productAddonTypeId || editRow.productAddon,
      };

      formik.setValues(refactorDataFormik);
      setRecycType(
        editRow.itemCategory === "Recyclables" ||
          !refactorDataFormik?.productType
          ? true
          : false
      );
    }
  }, [editRow]);

  useEffect(() => {
    getManuList();
    getCollectorList();
    getProductType();
  }, []);

  const validateSchema = Yup.lazy((values) => {
    let prevData: CreatePicoDetail[] = [];
    if (editRow) {
      prevData = data.filter((item) => item.id != editRow.id);
    } else {
      prevData = data;
    }

    if (isRecyc) {
      return Yup.object().shape({
        pickupAt: Yup.string()
          .required(t("pick_up_order.error.pickuAt"))
          .test(
            "invalid-date",
            t("pick_up_order.error.invalid_pickup_time"),
            function (value) {
              if (value !== "Invalid Date") return true;
              if (value === undefined) return true;
              return false;
              // return value !== t('pick_up_order.error.invalid_date')
            }
          ),
        // .test(
        //   t('pick_up_order.error.not_in_prev_data'),
        //   t('pick_up_order.error.pickup_time'),
        //   function (value) {
        //     return !prevData.some((item) => item.pickupAt === value)
        //   }
        // ),

        senderName: Yup.string().required(t("pick_up_order.error.senderName")),
        senderAddr: Yup.string()
          .required(t("pick_up_order.error.senderAddr"))
          .test(
            t("pick_up_order.error.not_same_as_receiver"),
            t("pick_up_order.error.sender_address"),
            function (value) {
              const receiverAddr = values.receiverAddr;
              return value !== receiverAddr;
            }
          ),
        // .test(
        //   t('pick_up_order.error.not_in_prev_data'),
        //   t('pick_up_order.error.sender_address_exists'),
        //   function (value) {
        //     return !prevData.some((item) => item.senderAddr === value)
        //   }
        // ),
        receiverName: Yup.string().required(
          t("pick_up_order.error.receiverName")
        ),
        receiverAddr: Yup.string()
          .required(t("pick_up_order.error.receiverAddr"))
          .test(
            t("pick_up_order.error.not_same_as_sender"),
            t("pick_up_order.error.receiver_address_cannot"),
            function (value) {
              const senderAddr = values.senderAddr;
              return value !== senderAddr;
            }
          ),
        // .test(
        //   t('pick_up_order.error.not_in_prev_data'),
        //   t('pick_up_order.error.receiver_address_exists'),
        //   function (value) {
        //     return !prevData.some((item) => item.receiverAddr === value)
        //   }
        // ),
        recycType: Yup.string()
          .typeError(t("pick_up_order.error.recycType"))
          .required(t("pick_up_order.error.recycType")),
        recycSubType: Yup.string()
          .typeError(t("pick_up_order.error.recycSubType"))
          .when("recycType", {
            is: (value: string) => {
              const item: any =
                recycType &&
                recycType?.length > 0 &&
                recycType?.find((item: any) => item.recycTypeId == value);
              const isValid = item?.recycSubType?.length > 0;
              return isValid;
            },
            then: (schema) =>
              schema.required(t("pick_up_order.error.recycSubType")),
          }),
        weight: Yup.number()
          .moreThan(0, t("pick_up_order.error.weightGreaterThanZero"))
          .required(t("pick_up_order.error.weight")),
      });
    } else {
      return Yup.object().shape({
        pickupAt: Yup.string()
          .required(t("pick_up_order.error.pickuAt"))
          .test(
            "invalid-date",
            t("pick_up_order.error.invalid_pickup_time"),
            function (value) {
              if (value !== "Invalid Date") return true;
              if (value === undefined) return true;
              return false;
              // return value !== t('pick_up_order.error.invalid_date')
            }
          ),
        // .test(
        //   t('pick_up_order.error.not_in_prev_data'),
        //   t('pick_up_order.error.pickup_time'),
        //   function (value) {
        //     return !prevData.some((item) => item.pickupAt === value)
        //   }
        // ),

        senderName: Yup.string().required(t("pick_up_order.error.senderName")),
        senderAddr: Yup.string()
          .required(t("pick_up_order.error.senderAddr"))
          .test(
            t("pick_up_order.error.not_same_as_receiver"),
            t("pick_up_order.error.sender_address"),
            function (value) {
              const receiverAddr = values.receiverAddr;
              return value !== receiverAddr;
            }
          ),
        // .test(
        //   t('pick_up_order.error.not_in_prev_data'),
        //   t('pick_up_order.error.sender_address_exists'),
        //   function (value) {
        //     return !prevData.some((item) => item.senderAddr === value)
        //   }
        // ),
        receiverName: Yup.string().required(
          t("pick_up_order.error.receiverName")
        ),
        receiverAddr: Yup.string()
          .required(t("pick_up_order.error.receiverAddr"))
          .test(
            t("pick_up_order.error.not_same_as_sender"),
            t("pick_up_order.error.receiver_address_cannot"),
            function (value) {
              const senderAddr = values.senderAddr;
              return value !== senderAddr;
            }
          ),
        productType: Yup.string()
          .required(t("pick_up_order.error.productType"))
          .typeError(t("pick_up_order.error.productType")),
        productSubType: Yup.string()
          .typeError(t("pick_up_order.error.productSubType"))
          .when("productType", {
            is: (value: string) => {
              const item: any =
                productType &&
                productType?.length > 0 &&
                productType?.find((item: any) => item.productTypeId == value);
              const isValid = item?.productSubType?.length > 0;
              return isValid;
            },
            then: (schema) =>
              schema.required(t("pick_up_order.error.productSubType")),
          }),
        productAddon: Yup.string().when(["productType", "productSubType"], {
          is: (value: string, value2: string) => {
            const itemProductType: any =
              productType &&
              productType?.length > 0 &&
              productType?.find((item: any) => item.productTypeId == value);
            const itemSubProductType: any =
              itemProductType?.productSubType?.length > 0 &&
              itemProductType?.productSubType?.find(
                (item: any) => item.productSubTypeId == value2
              );
            const isValid = itemSubProductType?.productAddonType?.length > 0;
            return isValid;
          },
          then: (schema) =>
            schema.required(t("pick_up_order.error.productAddon")),
        }),
        weight: Yup.number()
          .moreThan(0, t("pick_up_order.error.weightGreaterThanZero"))
          .required(t("pick_up_order.error.weight")),
      });
    }
  });

  const formik = useFormik({
    initialValues: initValue,
    validationSchema: validateSchema,

    onSubmit: (values, { resetForm }) => {
      const isRemarksConfirmed = validateRemarks({
        openConfirmModal,
        values: {
          productSubTypeRemark: formik?.values?.productSubTypeRemark,
          productAddonTypeRemark: formik?.values?.productAddonTypeRemark,
        },
      });

      if (!isRemarksConfirmed) {
        setOpenConfirmModal({
          ...openConfirmModal,
          isOpen: true,
        });
        return;
      } else {
        resetModal();
      }

      if (isEditing) {
        // ===== On Edit Row Detail =====

        if (editMode) {
          const updatedData = data.map((row, id) => {
            if (values.id === row.id) {
              return {
                ...values,
                id: row.id,
              };
            } else {
              return {
                ...row,
                //id : row.id
              };
            }
          });

          setState(updatedData);
        } else {
          const updatedData = data.map((row, id) => {
            if (values.id === row.id) {
              return {
                ...values,
                id: row.id,
              };
            } else {
              return row;
            }
          });

          setState(updatedData);
        }
      } else {
        // ===== On Create New Row Detail =====

        var updatedValues: CreatePicoDetail = values;

        if (values.picoHisId == "" && !isEditing) {
          updatedValues.id = data.length + 1;
        }

        setState([...data, updatedValues]);
      }

      setEditRow(null);
      setDefaultRecyc(undefined);
      setDefaultProduct(undefined);
      resetForm();
      resetModal();
      onClose && onClose();
      console.log("onSubmit", values)
    },
  });

  const TextFields = [
    {
      label: t("pick_up_order.item.sender_name"),
      id: "senderName",
      value: formik.values.senderName,
      error: formik.errors.senderName && formik.touched.senderName,
    },
    {
      label: t("pick_up_order.recyclForm.receiver"),
      id: "receiverName",
      value: formik.values.receiverName,
      error: formik.errors.receiverName && formik.touched.receiverName,
    },
    {
      label: t("pick_up_order.recyclForm.recycling_location"),
      id: "senderAddr",
      value: formik.values.senderAddr,
      error: formik.errors.senderAddr && formik.touched.senderAddr,
    },
    {
      label: t("pick_up_order.recyclForm.arrived"),
      id: "receiverAddr",
      value: formik.values.receiverAddr,
      error: formik.errors.receiverAddr && formik.touched.receiverAddr,
    },
  ];

  const formatTimePickAt = (timeValue: string) => {
    const times = timeValue.split(":");
    return initialTime
      .hour(Number(times[0]))
      .minute(Number(times[1]))
      .second(Number(times[2]));
  };

  const onHandleDrawer = () => {
    onClose && onClose();
    setEditRow(null);
    setDefaultRecyc(undefined);
    setDefaultProduct(undefined);
    resetModal();
    formik.resetForm();
  };

  const validateIsDataExist = () => {
    if (data.length === 0) return;
    const {
      pickupAt,
      receiverAddr,
      receiverName,
      senderName,
      senderAddr,
      recycType,
      recycSubType,
      id,
    } = formik.values;

    const newValueString =
      pickupAt +
      receiverAddr +
      receiverName +
      senderName +
      senderAddr +
      recycType +
      recycSubType;
    const dataStrings: string[] = [];
    for (let item of data) {
      const {
        pickupAt,
        receiverAddr,
        receiverName,
        senderName,
        senderAddr,
        recycType,
        recycSubType,
      } = item;
      const oldValueString =
        pickupAt +
        receiverAddr +
        receiverName +
        senderName +
        senderAddr +
        recycType +
        recycSubType;

      if (!isEditing) {
        dataStrings.push(oldValueString);
      } else {
        if (formik.values.id !== item.id) {
          dataStrings.push(oldValueString);
        }
      }
    }

    if (dataStrings.includes(newValueString)) {
      setIsDetailDouble(true);
    } else {
      setIsDetailDouble(false);
    }
  };

  useEffect(() => {
    validateIsDataExist();
  }, [formik.values]);

  return (
    <Drawer
      open={openModal}
      onClose={onHandleDrawer}
      anchor={"right"}
      variant={"temporary"}
      sx={{
        "& .MuiDrawer-paper": {
          marginTop: `${marginTop}`,
        },
      }}
    >
      <Divider></Divider>
      <div
        className={`border-b-[1px] border-grey-line h-full ${
          openModal ? `md:w-[700px] w-[100vw] mt-[${marginTop}]` : "hidden"
        }`}
      >
        <form onSubmit={formik.handleSubmit}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* <Box sx={{...localstyles.modal, marginTop}} onClick={handleOverlayClick}> */}
            <Box>
              <Box
                sx={{ display: "flex", flex: "1", p: 4, alignItems: "center" }}
              >
                <Box>
                  <Typography sx={styles.header4}>
                    {isEditing ? t("userGroup.change") : t("top_menu.add_new")}
                  </Typography>
                  <Typography sx={styles.header3}>
                    {t("pick_up_order.recyclForm.expected_recycling")}
                  </Typography>
                </Box>

                <Box sx={{ marginLeft: "auto" }}>
                  <Button
                    variant="outlined"
                    sx={{
                      ...localstyles.button,
                      color: "white",
                      bgcolor: colorTheme,
                      borderColor: colorTheme,
                    }}
                    type="submit"
                    data-testId="astd-create-edit-pickup-order-complete-button-4904"
                  >
                    {t("col.save")}
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      ...localstyles.button,
                      color: colorTheme,
                      bgcolor: "white",
                      borderColor: colorTheme,
                    }}
                    onClick={onHandleDrawer}
                    data-testId="astd-create-edit-pickup-order-cancel-button-1205"
                  >
                    {t("col.cancel")}
                  </Button>
                  <IconButton sx={{ ml: "25px" }} onClick={onHandleDrawer}>
                    <KeyboardTabIcon sx={{ fontSize: "30px" }} />
                  </IconButton>
                </Box>
              </Box>
              <Divider />

              <Stack spacing={2} sx={localstyles.content}>
                <CustomField
                  label={t("pick_up_order.recyclForm.shipping_time")}
                  mandatory
                >
                  <TimePicker
                    sx={{ width: "100%" }}
                    value={formatTimePickAt(formik.values.pickupAt)}
                    timeSteps={{ minutes: 1 }}
                    onChange={(value) => {
                      formik.setFieldValue(
                        "pickupAt",
                        value ? formattedTime(value) : ""
                      );
                    }}
                  />
                </CustomField>

                <CustomField
                  label={t("pick_up_order.recyclForm.item_category")}
                >
                  <Switcher
                    onText={t("recyclables")}
                    offText={t("product")}
                    defaultValue={isRecyc}
                    setState={(newValue) => {
                      formik.setFieldValue(
                        "itemCategory",
                        newValue === true ? "Recyclables" : "Product"
                      );
                      setRecycType(!isRecyc);
                    }}
                    dataTestId="astd-create-edit-pickup-order-form-type-select-button-3525"
                  />
                </CustomField>
                {isRecyc ? (
                  <CustomField label={t("col.recycType")} mandatory>
                    <RecyclablesListSingleSelect
                      showError={
                        (formik.errors?.recycType &&
                          formik.touched?.recycType) ||
                        undefined
                      }
                      recycL={recycType ?? []}
                      setState={(values) => {
                        formik.setFieldValue(
                          "itemCategory",
                          isRecyc === true ? "Recyclables" : "Product"
                        );
                        formik.setFieldValue("recycType", values?.recycTypeId);
                        formik.setFieldValue(
                          "recycSubType",
                          values?.recycSubTypeId
                        );
                        formik.setFieldValue("productType", "");
                        formik.setFieldValue("productSubType", "");
                        formik.setFieldValue("productAddon", "");
                        const recyc = recycType?.find(
                          (item) => item.recycTypeId === values.recycTypeId
                        );
                        // will use to validate when non-recycable selected
                        if (recyc) {
                          formik.setFieldValue(
                            "recycTypeName",
                            recyc?.recyclableNameEng
                          );
                        }
                      }}
                      itemColor={{
                        bgColor: customListTheme
                          ? customListTheme.bgColor
                          : "#E4F6DC",
                        borderColor: customListTheme
                          ? customListTheme.border
                          : "79CA25",
                      }}
                      defaultRecycL={defaultRecyc}
                      key={formik.values.picoDtlId}
                    />
                  </CustomField>
                ) : (
                  <CustomField
                    label={t("pick_up_order.product_type.product")}
                    mandatory
                  >
                    <ProductListSingleSelect
                      showError={
                        (formik.errors?.productType &&
                          formik.touched?.productType) ||
                        undefined
                      }
                      label={t("pick_up_order.product_type.product")}
                      options={productType ?? []}
                      setState={(values) => {
                        setOpenConfirmModal({
                          ...openConfirmModal,
                          tempData: {
                            ...openConfirmModal.tempData,
                            isProductSubTypeOthers: Boolean(
                              values?.isProductSubTypeOthers
                            ),
                            isProductAddonTypeOthers: Boolean(
                              values?.isProductAddonTypeOthers
                            ),
                          },
                        });
                        formik.setFieldValue(
                          "itemCategory",
                          Boolean(isRecyc) === true ? "Recyclables" : "Product"
                        );
                        formik.setFieldValue(
                          "productType",
                          values?.productTypeId
                        );
                        formik.setFieldValue(
                          "productSubType",
                          values?.productSubTypeId
                        );
                        formik.setFieldValue(
                          "productAddon",
                          values?.productAddonId
                        );
                        formik.setFieldValue(
                          "productSubTypeRemark",
                          values?.productSubTypeRemark
                        );
                        formik.setFieldValue(
                          "productAddonTypeRemark",
                          values?.productAddonTypeRemark
                        );
                        formik.setFieldValue("recycType", "");
                        formik.setFieldValue("recycSubType", "");
                      }}
                      itemColor={{
                        bgColor: customListTheme
                          ? customListTheme.bgColor
                          : "#E4F6DC",
                        borderColor: customListTheme
                          ? customListTheme.border
                          : "79CA25",
                      }}
                      defaultProduct={defaultProduct}
                      key={formik.values.picoDtlId}
                    />
                  </CustomField>
                )}

                <CustomField
                  label={t("pick_up_order.recyclForm.weight")}
                  mandatory
                >
                  <CustomTextField
                    id="weight"
                    placeholder={t("userAccount.pleaseEnterNumber")}
                    // onChange={formik.handleChange}
                    onChange={(event) => {
                      onChangeWeight(
                        event.target.value,
                        decimalVal,
                        (value: string) => {
                          formik.setFieldValue("weight", value);
                        }
                      );
                    }}
                    onBlur={(event) => {
                      const value = formatWeight(
                        event.target.value,
                        decimalVal
                      );
                      formik.setFieldValue("weight", value);
                    }}
                    value={formik.values.weight}
                    error={
                      (formik.errors?.weight && formik.touched?.weight) ||
                      undefined
                    }
                    sx={{ width: "100%" }}
                    endAdornment={
                      <InputAdornment position="end">kg</InputAdornment>
                    }
                    dataTestId="astd-create-edit-pickup-order-form-weight-input-field-2997"
                  ></CustomTextField>
                </CustomField>
                {TextFields.map((it) => (
                  <CustomField mandatory label={it.label}>
                    {it.id === "senderName" || it.id === "receiverName" ? (
                      <CustomAutoComplete
                        placeholder={t("pick_up_order.recyclForm.placeholder")}
                        option={[
                          ...(collectorList?.map((option) => {
                            if (i18n.language === Languages.ENUS) {
                              return option.collectorNameEng;
                            } else if (i18n.language === Languages.ZHCH) {
                              return option.collectorNameSchi;
                            } else {
                              return option.collectorNameTchi;
                            }
                          }) ?? []),
                          ...(manuList?.map((option) => {
                            if (i18n.language === Languages.ENUS) {
                              return option.manufacturerNameEng;
                            } else if (i18n.language === Languages.ZHCH) {
                              return option.manufacturerNameSchi;
                            } else {
                              return option.manufacturerNameTchi;
                            }
                          }) ?? []),
                        ]}
                        sx={{ width: "100%" }}
                        onChange={(
                          _: SyntheticEvent,
                          newValue: string | null
                        ) => {
                          formik.setFieldValue(it.id, newValue);

                          const optionId =
                            collectorList?.find(
                              (item) =>
                                item.collectorNameEng === newValue ||
                                item.collectorNameEng === newValue ||
                                item.collectorNameEng === newValue
                            )?.collectorId ||
                            manuList?.find(
                              (manu) =>
                                manu.manufacturerNameEng === newValue ||
                                manu.manufacturerNameSchi === newValue ||
                                manu.manufacturerNameTchi === newValue
                            )?.manufacturerId ||
                            "";

                          //set receiverId and senderId
                          if (it.id === "senderName") {
                            formik.setFieldValue("senderId", optionId);
                          } else {
                            formik.setFieldValue("receiverId", optionId);
                          }
                        }}
                        onInputChange={(event: any, newInputValue: string) => {
                          formik.setFieldValue(it.id, newInputValue); // Update the formik field value if needed
                        }}
                        value={it.value}
                        inputValue={it.value}
                        error={it.error || undefined}
                        dataTestId={
                          it.id === "senderName"
                            ? "astd-create-edit-pickup-order-form-sender-company-select-button-8477"
                            : "astd-create-edit-pickup-order-form-receiver-company-select-button-8814"
                        }
                      />
                    ) : (
                      <CustomTextField
                        id={it.id}
                        placeholder={t("pick_up_order.recyclForm.placeholder")}
                        rows={4}
                        onChange={formik.handleChange}
                        value={it.value}
                        sx={{ width: "100%" }}
                        error={it.error || undefined}
                        dataTestId={
                          it.id === "senderAddr"
                            ? "astd-create-edit-pickup-order-form-sender-address-input-field-8204"
                            : "astd-create-edit-pickup-order-form-receiver-address-input-field-7002"
                        }
                      />
                    )}
                  </CustomField>
                ))}
                {isDetailDouble && (
                  <Typography style={{ color: "red" }}>
                    {t("pick_up_order.picoDetailCannotBeRepeated")}
                  </Typography>
                )}
                <Stack spacing={2}>
                  {formik.errors.pickupAt && formik.touched.pickupAt && (
                    <Alert severity="error">{formik.errors.pickupAt} </Alert>
                  )}
                  {formik.errors?.recycType && formik.touched?.recycType && (
                    <Alert
                      severity="error"
                      data-testId="astd-create-edit-pickup-order-form-recyc-main-err-warning-7333"
                    >
                      {formik.errors?.recycType}{" "}
                    </Alert>
                  )}
                  {formik.errors?.recycSubType &&
                    formik.touched?.recycSubType && (
                      <Alert
                        severity="error"
                        data-testId="astd-create-edit-pickup-order-form-recyc-sub-err-warning-8762"
                      >
                        {formik.errors?.recycSubType}{" "}
                      </Alert>
                    )}
                  {formik.errors?.productType &&
                    formik.touched?.productType && (
                      <Alert
                        severity="error"
                        data-testId="astd-create-edit-pickup-order-form-product-type-err-warning-7624"
                      >
                        {formik.errors?.productType}{" "}
                      </Alert>
                    )}
                  {formik.errors?.productSubType &&
                    formik.touched?.productSubType && (
                      <Alert
                        severity="error"
                        data-testId="astd-create-edit-pickup-order-form-product-type-err-warning-7624"
                      >
                        {formik.errors?.productSubType}{" "}
                      </Alert>
                    )}
                  {formik.errors?.productAddon &&
                    formik.touched?.productAddon && (
                      <Alert
                        severity="error"
                        data-testId="astd-create-edit-pickup-order-form-product-addon-err-warning-9664"
                      >
                        {formik.errors?.productAddon}{" "}
                      </Alert>
                    )}
                  {formik.errors?.weight && formik.touched?.weight && (
                    <Alert
                      severity="error"
                      data-testId="astd-create-edit-pickup-order-form-weight-err-warning-7399"
                    >
                      {formik.errors?.weight}{" "}
                    </Alert>
                  )}
                  {formik.errors.senderName && formik.touched.senderName && (
                    <Alert
                      severity="error"
                      data-testId="astd-create-edit-pickup-order-form-sender-company-err-warning-7661"
                    >
                      {formik.errors.senderName}{" "}
                    </Alert>
                  )}
                  {formik.errors.receiverName &&
                    formik.touched.receiverName && (
                      <Alert
                        severity="error"
                        data-testId="astd-create-edit-pickup-order-form-receiver-company-err-warning-5648"
                      >
                        {formik.errors.receiverName}{" "}
                      </Alert>
                    )}
                  {formik.errors.senderAddr && formik.touched.senderAddr && (
                    <Alert
                      severity="error"
                      data-testId="astd-create-edit-pickup-order-form-sender-address-err-warning-8679"
                    >
                      {formik.errors.senderAddr}{" "}
                    </Alert>
                  )}
                  {formik.errors.receiverAddr &&
                    formik.touched.receiverAddr && (
                      <Alert
                        severity="error"
                        data-testId="astd-create-edit-pickup-order-form-receiver-address-err-warning-3798"
                      >
                        {formik.errors.receiverAddr}{" "}
                      </Alert>
                    )}
                </Stack>
              </Stack>
              <ModalConfirmRemarksEmpty />
            </Box>
            {/* </Box> */}
          </LocalizationProvider>
        </form>
      </div>
    </Drawer>
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
