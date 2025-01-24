import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  TextField,
  Drawer,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { styles } from "../../constants/styles";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import theme from "../../themes/palette";
import CustomField from "./CustomField";
import { singleRecyclable } from "../../interfaces/collectionPoint";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { t } from "i18next";
import * as Yup from "yup";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import CustomTextField from "./CustomTextField";
import { useFormik } from "formik";
import RecyclablesListSingleSelect from "../SpecializeComponents/RecyclablesListSingleSelect";
import { collectorList, manuList } from "../../interfaces/common";
import dayjs, { Dayjs } from "dayjs";
import { Languages, format } from "../../constants/constant";
import {
  localStorgeKeyName,
  configDateFormatFull,
} from "../../constants/constant";
import {
  formatWeight,
  getPrimaryColor,
  getThemeColorRole,
  getThemeCustomList,
  onChangeWeight,
  validDayjsISODate,
} from "../../utils/utils";
import { PurchaseOrderDetail } from "../../interfaces/purchaseOrder";
import { DatePicker } from "@mui/x-date-pickers";
import { getWeightUnit } from "../../APICalls/ASTD/recycling";
import i18n from "../../setups/i18n";
import { WeightUnit } from "../../interfaces/weightUnit";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Switcher from "./CustomSwitch";
import Selection from "../SpecializeComponents/ProductListSingleSelect";
import ProductListSingleSelect from "../SpecializeComponents/ProductListSingleSelect";
import { singleProduct } from "./CreateRecycleForm";
import { ValidateSchemaCreateRecycleFormPurchaseOrder } from "src/pages/Manufacturer/PurchaseOrder/utils";
import AlertList from "src/components/AlertList";
import useModalConfirmRemarksEmpty from "../ModalConfirmRemarksEmpty";
import NotifContainer from "src/contexts/NotifContainer";

dayjs.extend(utc);
dayjs.extend(timezone);

type props = {
  openModal: boolean;
  onClose: () => void;
  setState: (val: PurchaseOrderDetail[]) => void;
  data: PurchaseOrderDetail[];
  setId: Dispatch<SetStateAction<number>>;
  picoHisId: string | null;
  editRowId: number | null;
  isEditing: boolean;
  receiverAddr?: string;
  onChangeAddressReceiver?: (value: string) => void;
};
type CombinedType = manuList[] | collectorList[];
const loginId = localStorage.getItem(localStorgeKeyName.username) || "";
const initialTime: dayjs.Dayjs = dayjs();

const formattedTimeToUTC = (pickupAtValue: dayjs.Dayjs) => {
  return pickupAtValue.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
};

const initValue = {
  id: -1,
  poDtlId: 0,
  recycTypeId: "",
  recycSubTypeId: "",
  unitId: 0,
  unitNameTchi: "",
  unitNameSchi: "",
  unitNameEng: "",
  weight: "0",
  pickupAt: dayjs.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
  receiverAddr: "",
  receiverAddrGps: [0],
  createdBy: loginId,
  updatedBy: loginId,
  status: "CREATED",
  itemCategory: "Recyclables",
  productType: "",
  productSubType: "",
  productAddonType: "",
  productSubTypeRemark: "",
  productAddonTypeRemark: "",
};

type fieldName =
  | "receiverAddr"
  | "weight"
  | "recycTypeId"
  | "recycSubTypeId"
  | "pickupAt"
  | "unitId";

type ErrorsField = Record<
  fieldName,
  {
    type: string;
    status: boolean;
    required: boolean;
  }
>;

const initialErrors = {
  receiverAddr: {
    type: "string",
    status: false,
    required: true,
  },
  weight: {
    type: "string",
    status: false,
    required: true,
  },
  recycTypeId: {
    type: "string",
    status: false,
    required: true,
  },
  recycSubTypeId: {
    type: "string",
    status: false,
    required: true,
  },
  pickupAt: {
    type: "string",
    status: false,
    required: false,
  },
  unitId: {
    type: "string",
    status: false,
    required: true,
  },
};
const initialState = {
  openConfirmModal: {
    isOpen: false,
    tempData: {
      isConfirmed: false,
      isProductSubTypeOthers: false,
      isproductAddonTypeOthers: false,
    },
  },
};

const setDefProd = ({
  dataProduct,
  setDefaultProduct,
}: {
  dataProduct: PurchaseOrderDetail;
  setDefaultProduct: (params: singleProduct) => void;
}) => {
  const defProd = {
    productTypeId: dataProduct?.productType,
    productSubTypeId: dataProduct?.productSubType,
    productAddonId: dataProduct?.productAddonType,
    productSubTypeRemark: dataProduct?.productSubTypeRemark,
    productAddonTypeRemark: dataProduct?.productAddonTypeRemark,
  };

  setDefaultProduct(defProd);
};

const CreateRecycleForm = ({
  openModal,
  onClose,
  setState,
  data,
  editRowId,
  isEditing,
  picoHisId,
  receiverAddr,
  onChangeAddressReceiver,
}: props) => {
  const { recycType, weightUnits, decimalVal, productType, getProductType } =
    useContainer(CommonTypeContainer);

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

  const [editRow, setEditRow] = useState<PurchaseOrderDetail>();
  const [defaultRecyc, setDefaultRecyc] = useState<singleRecyclable>();
  const [isRecyc, setRecycType] = useState<boolean>(true);
  const [defaultProduct, setDefaultProduct] = useState<singleProduct>();

  //---set custom style each role---

  const role =
    localStorage.getItem(localStorgeKeyName.role) || "collectoradmin";
  const colorTheme: string = getThemeColorRole(role) || "#79CA25";
  const customListTheme = getThemeCustomList(role) || "#E4F6DC";
  //---end set custom style each role---
  const [errorsField, setErrorsField] = useState<ErrorsField>(initialErrors);
  const { dateFormat } = useContainer(CommonTypeContainer);

  const setDefRecyc = (picoDtl: PurchaseOrderDetail) => {
    const defRecyc: singleRecyclable = {
      recycTypeId: picoDtl.recycTypeId,
      recycSubTypeId: picoDtl.recycSubTypeId,
    };
    setDefaultRecyc(defRecyc);
  };

  const assignDataEditRow = ({ newDataEditRow }: { newDataEditRow: any }) => {
    try {
      if (newDataEditRow) {
        onHandleError("recycTypeId", "succeed");
        onHandleError("recycSubTypeId", "succeed");

        const refactorDataFormik = {
          id: newDataEditRow.id,
          poDtlId: newDataEditRow.poDtlId ?? 0,
          recycTypeId: newDataEditRow.recycTypeId,
          recycSubTypeId: newDataEditRow.recycSubTypeId,
          unitId: newDataEditRow.unitId,
          unitNameTchi: newDataEditRow.unitNameTchi,
          unitNameSchi: newDataEditRow.unitNameSchi,
          unitNameEng: newDataEditRow.unitNameEng,
          weight: formatWeight(newDataEditRow.weight, decimalVal),
          pickupAt: newDataEditRow?.pickupAt || "",
          createdBy: newDataEditRow.createdBy,
          updatedBy: newDataEditRow.updatedBy,
          receiverAddr: newDataEditRow.receiverAddr || "",
          receiverAddrGps: newDataEditRow.receiverAddrGps || [0],
          status:
            newDataEditRow.status === null
              ? "CREATED"
              : newDataEditRow.status ?? "CREATED",
          itemCategory: newDataEditRow.itemCategory || "Recyclables",
          productType: newDataEditRow?.productType, // => first value for edit from API , second value from create newDataEditRow row
          productSubType: newDataEditRow?.productSubType,
          productSubTypeRemark: newDataEditRow?.productSubTypeRemark,
          productAddonTypeRemark: newDataEditRow?.productAddonTypeRemark,
          productAddonType: newDataEditRow?.productAddonType,
        };

        formik.setValues(refactorDataFormik);

        setRecycType(
          newDataEditRow.itemCategory === "Recyclables" ||
            !refactorDataFormik?.productType
            ? true
            : false
        );
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (editRowId == null) {
      formik.setValues(initValue);
      setRecycType(true);
      onHandleError("recycTypeId", "succeed");
      onHandleError("recycSubTypeId", "succeed");
    } else {
      const editR = data.find((value) => value?.id === editRowId);

      if (editR) {
        setDefProd({
          dataProduct: editR,
          setDefaultProduct,
        });
        setDefRecyc(editR);
        assignDataEditRow({ newDataEditRow: editR });
        setEditRow(editR);
        formik.setFieldValue(
          "pickupAt",
          editR.pickupAt
            ? dayjs
                .utc(editR.pickupAt)
                .tz("Asia/Hong_Kong")
                .format(configDateFormatFull)
            : ""
        );
      }
    }
  }, [editRowId]);

  const formik = useFormik({
    initialValues: initValue,
    validationSchema: ValidateSchemaCreateRecycleFormPurchaseOrder({
      editRow,
      isRecyc,
      data,
      productType,
      recycType,
      t,
    }),
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

      let newData = [];
      if (isEditing) {
        const updatedData: any = data.map((row, id) => {
          return row?.id === values.id ? values : row;
        });

        newData = [...updatedData];
      } else {
        let updatedValues: any = values;

        if (updatedValues.poDtlId === 0) {
          const { poDtlId, ...rest } = updatedValues;
          updatedValues = rest;
        }

        updatedValues.id = data.length;

        newData = [...data, updatedValues];
      }

      setState(newData);

      resetForm();
      onClose && onClose();
    },
  });

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

  const onChangeContent = (field: fieldName, value: any) => {
    if (value === "" || value === 0) {
      formik.setFieldValue(field, "");
      onHandleError(field, "failed");
    } else if (field === "recycTypeId") {
      formik.setFieldValue("recycTypeId", value);
      formik.setFieldValue("recycSubTypeId", "");
      onHandleError("recycTypeId", "succeed");
      onHandleError("recycSubTypeId", "succeed");
    } else {
      formik.setFieldValue(field, value);
      onHandleError(field, "succeed");
    }
  };

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

  const { marginTop } = useContainer(NotifContainer);

  const resetAllField = () => {
    setEditRow(undefined);
    setDefaultRecyc(undefined);
    setDefaultProduct(undefined);
    resetModal();
    formik.resetForm();
  };

  const onHandleDrawer = () => {
    resetAllField();
    onClose && onClose();
  };

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
            <Box>
              <Box
                sx={{ display: "flex", flex: "1", p: 4, alignItems: "center" }}
              >
                <Box>
                  <Typography sx={styles.header4}>
                    {isEditing ? t("userGroup.change") : t("top_menu.add_new")}
                  </Typography>
                  <Typography sx={styles.header3}>
                    {t("purchase_order.create.expected_recycling")}
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
                <Grid item>
                  <CustomField
                    label={t("purchase_order.create.receipt_date_and_time")}
                    mandatory
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Box sx={{ ...localstyles.DateItem }}>
                        <DatePicker
                          value={
                            formik.values.pickupAt
                              ? dayjs
                                  .utc(formik.values.pickupAt)
                                  .tz("Asia/Hong_Kong")
                              : dayjs().tz("Asia/Hong_Kong")
                          }
                          format={dateFormat}
                          timezone="Asia/Hong_Kong"
                          onChange={(value) => {
                            const utcValue = value
                              ? formattedTimeToUTC(
                                  dayjs(value).tz("Asia/Hong_Kong")
                                )
                              : dayjs
                                  .utc()
                                  .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                            formik.setFieldValue("pickupAt", utcValue);
                          }}
                          sx={{ ...localstyles.datePicker }}
                        />
                      </Box>
                      <Box sx={{ ...localstyles.timePeriodItem }}>
                        <TimePicker
                          value={
                            formik.values.pickupAt
                              ? dayjs
                                  .utc(formik.values.pickupAt)
                                  .tz("Asia/Hong_Kong")
                              : dayjs().tz("Asia/Hong_Kong")
                          }
                          timezone="Asia/Hong_Kong"
                          onChange={(value) => {
                            const utcValue = value
                              ? formattedTimeToUTC(
                                  dayjs(value).tz("Asia/Hong_Kong")
                                )
                              : dayjs
                                  .utc()
                                  .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

                            formik.setFieldValue("pickupAt", utcValue);
                            console.log("utcValue", utcValue);
                          }}
                          sx={{ ...localstyles.timePicker }}
                        />
                      </Box>
                    </Box>
                  </CustomField>
                  {/* {errorsField['pickupAt' as keyof ErrorsField].status ? (
                  <ErrorMessages message={t('form.error.isInWrongFormat')} />
                ) : (
                  ''
                )} */}
                </Grid>
                <CustomField
                  label={t("pick_up_order.recyclForm.item_category")}
                >
                  <Switcher
                    onText={t("recyclables")}
                    offText={t("product")}
                    defaultValue={isRecyc}
                    setState={(newValue) => {
                      const id = formik?.values?.id;
                      const poDtlId = formik?.values?.poDtlId;
                      resetAllField();
                      formik.setFieldValue("id", id);
                      formik.setFieldValue("poDtlId", poDtlId);
                      formik.setFieldValue(
                        "itemCategory",
                        newValue === true ? "Recyclables" : "Product"
                      );
                      setRecycType(newValue);
                    }}
                  />
                </CustomField>
                <Grid item>
                  {isRecyc ? (
                    <CustomField label={t("col.recycType")} mandatory>
                      <RecyclablesListSingleSelect
                        showError={Boolean(
                          (formik?.touched.recycTypeId &&
                            formik?.errors.recycTypeId) ||
                            (formik?.touched.recycSubTypeId &&
                              formik?.errors.recycSubTypeId) ||
                            undefined
                        )}
                        recycL={recycType ?? []}
                        setState={(values) => {
                          if (values.recycTypeId !== undefined) {
                            formik.setFieldValue(
                              "recycTypeId",
                              values?.recycTypeId,
                              true
                            );
                            onChangeContent("recycTypeId", values.recycTypeId);
                          }
                          if (values.recycSubTypeId !== undefined) {
                            formik.setFieldValue(
                              "recycSubTypeId",
                              values?.recycSubTypeId,
                              true
                            );
                            onChangeContent(
                              "recycSubTypeId",
                              values.recycSubTypeId
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
                        key={formik.values.id}
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
                            Boolean(isRecyc) === true
                              ? "Recyclables"
                              : "Product",
                            true
                          );
                          formik.setFieldValue(
                            "productType",
                            values?.productTypeId,
                            true
                          );
                          formik.setFieldValue(
                            "productSubType",
                            values?.productSubTypeId,
                            true
                          );
                          formik.setFieldValue(
                            "productAddonType",
                            values?.productAddonId,
                            true
                          );
                          formik.setFieldValue(
                            "productSubTypeRemark",
                            values?.productSubTypeRemark,
                            true
                          );
                          formik.setFieldValue(
                            "productAddonTypeRemark",
                            values?.productAddonTypeRemark,
                            true
                          );
                          formik.setFieldValue("recycType", "", true);
                          formik.setFieldValue("recycSubType", "", true);
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
                        key={formik?.values?.poDtlId}
                      />
                    </CustomField>
                  )}
                  {/* {errorsField['recycSubTypeId' as keyof ErrorsField].required &&
                errorsField['recycSubTypeId' as keyof ErrorsField].status ? (
                  <ErrorMessages
                    message={t('purchase_order.create.required_field')}
                  />
                ) : (
                  ''
                )} */}
                </Grid>
                <Grid item>
                  <CustomField
                    label={t("purchase_order.create.weight")}
                    mandatory
                  >
                    <CustomTextField
                      id="weight"
                      placeholder={t("userAccount.pleaseEnterNumber")}
                      // onChange={formik.handleChange}
                      onChange={(event) => {
                        // onChangeContent('weight', event.target.value)
                        onChangeWeight(
                          event.target.value,
                          decimalVal,
                          (value: string) => {
                            formik.setFieldValue("weight", value);
                            if (value) {
                              onHandleError("weight", "succeed");
                            }
                          }
                        );
                      }}
                      onBlur={(event) => {
                        const value = formatWeight(
                          event.target.value,
                          decimalVal
                        );
                        formik.setFieldValue("weight", value);
                        if (value) {
                          onHandleError("weight", "succeed");
                        }
                      }}
                      value={formik.values.weight}
                      error={Boolean(
                        formik.touched?.weight && formik.errors?.weight
                      )}
                      sx={{ width: "100%" }}
                      endAdornment={
                        <Autocomplete
                          disablePortal
                          id="unitId"
                          sx={{ width: 100, border: 0 }}
                          value={getUnitName(formik.values.unitId)}
                          options={getWeightUnits()}
                          getOptionLabel={(option) => option.lang}
                          onChange={(event, value) => {
                            formik.setFieldValue("unitId", value?.unitId || 0);

                            if (value?.unitId) {
                              onChangeContent("unitId", value?.unitId);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("purchase_order.create.unit")}
                              sx={[
                                localstyles.textField,
                                { width: 400, border: "none", borderColor: "" },
                              ]}
                              InputProps={{
                                ...params.InputProps,
                              }}
                              error={Boolean(
                                formik.touched?.unitId && formik.errors?.unitId
                              )}
                            />
                          )}
                          noOptionsText={t("common.noOptions")}
                        />
                      }
                    ></CustomTextField>
                  </CustomField>
                </Grid>
                <Grid item>
                  <CustomField
                    label={t("purchase_order.create.arrived")}
                    mandatory
                  >
                    <CustomTextField
                      id={"receiverAddr"}
                      placeholder={t("purchase_order.create.arrived")}
                      rows={4}
                      multiline={true}
                      onChange={(event) => {
                        onChangeContent("receiverAddr", event.target.value);
                        formik.setFieldValue(
                          "receiverAddr",
                          event.target.value
                        );
                        onChangeAddressReceiver &&
                          onChangeAddressReceiver(event.target.value);
                      }}
                      value={formik.values.receiverAddr}
                      sx={{ width: "100%", height: "100%" }}
                      error={Boolean(
                        formik.errors?.receiverAddr &&
                          formik.touched?.receiverAddr
                      )}
                    />
                  </CustomField>
                </Grid>
                <AlertList formik={formik} />
                <ModalConfirmRemarksEmpty />
              </Stack>
            </Box>
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
  DateItem: {
    display: "flex",
    height: "fit-content",
    alignItems: "center",
  },
  timePeriodItem: {
    display: "flex",
    height: "fit-content",
    paddingX: 2,
    alignItems: "center",
    backgroundColor: "white",
    border: 2,
    borderRadius: 3,
    borderColor: "#E2E2E2",
  },
  datePicker: {
    ...styles.textField,
    maxWidth: "370px",
    "& .MuiIconButton-edgeEnd": {
      color: getPrimaryColor(),
    },
  },
  timePicker: {
    width: "100%",
    borderRadius: 5,
    backgroundColor: "white",
    "& fieldset": {
      borderWidth: 0,
    },
    "& input": {
      paddingX: 0,
    },
    "& .MuiIconButton-edgeEnd": {
      color: getPrimaryColor(),
    },
  },
  textField: {
    // borderRadius: '12px',
    width: {
      xs: "280px",
      md: "100%",
    },
    backgroundColor: "white",
    "& fieldset": {
      borderRadius: "12px",
    },
    marginLeft: "13px",
  },
};

export default CreateRecycleForm;
