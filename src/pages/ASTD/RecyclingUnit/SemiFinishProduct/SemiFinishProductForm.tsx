import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Typography,
  styled,
} from "@mui/material";
import RightOverlayForm from "../../../../components/RightOverlayForm";
import CustomField from "../../../../components/FormComponents/CustomField";
import CustomTextField from "../../../../components/FormComponents/CustomTextField";
import {
  Products,
  ProductPayload,
  ProductSubType,
} from "../../../../types/settings";
import {
  createProductType,
  createProductSubtype,
  createProductAddonType,
  editProductType,
  editProductSubtype,
  editProductAddonType,
  getProductTypeList,
  getProductSubtypeList,
} from "../../../../APICalls/ASTD/settings/productType";
import { FormErrorMsg } from "../../../../components/FormComponents/FormErrorMsg";
import { STATUS_CODE } from "../../../../constants/constant";
import {
  extractError,
  isEmptyOrWhitespace,
  showErrorToast,
} from "../../../../utils/utils";
import { localStorgeKeyName } from "../../../../constants/constant";
import { useProductContext } from "./ProductContext";
import { useNavigate } from "react-router-dom";
const StyledTab = styled(Tab)(({ theme }) => ({
  border: "1px solid",
  borderRadius: "24px",
  margin: "0 4px",
  padding: "8px 16px",
  minWidth: "auto",
  textTransform: "none",
  "&.Mui-disabled": {
    // backgroundColor: '#dbdbdb',
    // '&:hover': {
    //   cursor: 'not-allowed'
    // }
  },
  "&.Mui-selected": {
    backgroundColor: "rgb(121 202 37 / 21%)",
    color: "#79CA25",
    borderColor: "#79CA25",
  },
  "&:not(.Mui-selected)": {
    color: "#bdbdbd",
    "&:hover": {
      backgroundColor: "transparent",
      cursor: "default",
    },
  },
}));

type SemiFinishProductProps = {
  isEditMode?: boolean;
  isAddMode?: boolean;
  productId?: string;
  productSubId?: string;
  initialData?: Products;
  initialCategory?: any;
  initialSubCategory?: any;
  paramId?: string;
  activeTab?: number;
  handleClose: () => void;
  handleSubmit: () => void;
  open: boolean;
};

function TabPanel(props: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  const { children, value, index, ...other } = props;
  return (
    <div
      data-testId="astd-semi-product-new-button-473"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box mb="16px" pb="16px">
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const SemiFinishProductForm: React.FC<SemiFinishProductProps> = ({
  isEditMode = false,
  isAddMode = false,
  initialData,
  productId,
  productSubId,
  initialCategory,
  initialSubCategory,
  open,
  activeTab,
  paramId,
  handleClose,
  handleSubmit,
}) => {
  const [tabIndex, setTabIndex] = useState<number>(activeTab || 0);
  const [category, setCategory] = useState<Products[] | []>([]);
  const [subCategory, setSubCategory] = useState<ProductSubType[] | []>([]);
  const { t, i18n } = useTranslation();
  const language = localStorage.getItem("selectedLanguage");
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [productCategoryId, setProductCategoryId] = useState<string>("");
  const [selectedProductCategory, setSelectedProductCategory] = useState<any>(
    []
  );
  const { refetch } = useProductContext();
  const navigate = useNavigate();
  const [trySubmitted, setTrySubmitted] = useState<boolean>(false);

  const handleTabChange = (event: React.ChangeEvent<{}>, newIndex: number) => {
    setTabIndex(newIndex);
  };

  const getValidationSchema = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return Yup.object({
          traditionalName: Yup.string().required(
            t("form.error.shouldNotBeEmpty")
          ),
          simplifiedName: Yup.string().required(
            t("form.error.shouldNotBeEmpty")
          ),
          englishName: Yup.string().required(t("form.error.shouldNotBeEmpty")),
          introduction: Yup.string(),
          remarks: Yup.string(),
        });
      case 1:
        return Yup.object({
          traditionalName: Yup.string().required(
            t("form.error.shouldNotBeEmpty")
          ),
          simplifiedName: Yup.string().required(
            t("form.error.shouldNotBeEmpty")
          ),
          englishName: Yup.string().required(t("form.error.shouldNotBeEmpty")),
          category: Yup.string().required(t("form.error.shouldNotBeEmpty")),
          introduction: Yup.string(),
          remarks: Yup.string(),
        });
      case 2:
        return Yup.object({
          traditionalName: Yup.string().required(
            t("form.error.shouldNotBeEmpty")
          ),
          simplifiedName: Yup.string().required(
            t("form.error.shouldNotBeEmpty")
          ),
          englishName: Yup.string().required(t("form.error.shouldNotBeEmpty")),
          category: Yup.string().required(t("form.error.shouldNotBeEmpty")),
          subCategory: Yup.string().required(t("form.error.shouldNotBeEmpty")),
          introduction: Yup.string(),
          remarks: Yup.string(),
        });
      default:
        return Yup.object({});
    }
  };

  const formik = useFormik({
    initialValues: {
      traditionalName: initialData?.productNameTchi || "",
      simplifiedName: initialData?.productNameSchi || "",
      englishName: initialData?.productNameEng || "",
      category: productId || "",
      subCategory: "",
      introduction: initialData?.description || "",
      remarks: initialData?.remark || "",
    },
    validationSchema: Yup.lazy(() => getValidationSchema(tabIndex)),
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      const payload = {
        productNameTchi: values.traditionalName,
        productNameSchi: values.simplifiedName,
        productNameEng: values.englishName,
        description: values.introduction,
        remark: values.remarks,
        createdBy: localStorage.getItem("username") || "",
        updatedBy: localStorage.getItem("username") || "",
      };
      handleSubmit();
    },
  });

  const handleSave = async () => {
    const isValid = await formik.validateForm();
    formik.setTouched(
      Object.keys(formik.values).reduce((acc: any, key: any) => {
        acc[key] = true;
        return acc;
      }, {})
    );

    if (Object.keys(isValid).length === 0) {
      await onSubmitForm();
    }
  };

  const onSubmitForm = async (): Promise<void> => {
    try {
      const payload: ProductPayload = {
        productNameTchi: formik.values.traditionalName,
        productNameSchi: formik.values.simplifiedName,
        productNameEng: formik.values.englishName,
        description: formik.values.introduction,
        remark: formik.values.remarks,
        updatedBy: localStorage.getItem("username") || "",
        createdBy: localStorage.getItem("username") || "",
      };

      if (isEditMode && initialData) {
        await handleEdit(payload);
      } else {
        await handleCreate(payload);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  const handleDuplicateErrorMessage = (input: string) => {
    const replacements: { [key: string]: keyof typeof formik.values } = {
      "[tchi]": "traditionalName",
      "[eng]": "englishName",
      "[schi]": "simplifiedName",
    };

    const matches = input.match(/\[(tchi|eng|schi)\]/g);

    if (matches) {
      console.log(matches, "matches");
      const newErrors: Record<string, string> = { ...formik.errors };

      matches.forEach((match) => {
        const fieldKey = replacements[match];
        if (fieldKey) {
          newErrors[fieldKey] = t("settings_page.recycling.already_exists");
        }
      });

      formik.setErrors(newErrors); // Update Formik errors so they display
    }
  };

  const handleError = (error: any): void => {
    setTrySubmitted(true);
    const { state } = extractError(error);
    if (state.code === STATUS_CODE[503]) {
      navigate("/maintenance");
    } else if (error?.response?.data?.status === STATUS_CODE[409]) {
      const errorMessage = error.response.data.message;
      if (errorMessage.includes("[RESOURCE_DUPLICATE_ERROR]")) {
        handleDuplicateErrorMessage(errorMessage);
      } else {
        showErrorToast(error.response.data.message);
      }
    }
  };

  const handleEdit = async (payload: ProductPayload): Promise<void> => {
    try {
      if (!paramId) {
        throw new Error("Missing parameter ID for edit operation.");
      }

      const version = initialData?.version;
      let editPayload: ProductPayload = { ...payload, status: 0, version };
      let toastMsg = "";
      let response;

      switch (activeTab) {
        case 0:
          response = await editProductType(paramId, editPayload);
          toastMsg = t("notify.SuccessEdited");
          break;
        case 1:
          editPayload = { ...editPayload, productTypeId: productId };
          response = await editProductSubtype(paramId, editPayload);
          toastMsg = t("notify.SuccessEdited");
          break;
        case 2:
          editPayload = { ...editPayload, productSubTypeId: productSubId };
          response = await editProductAddonType(paramId, editPayload);
          toastMsg = t("notify.SuccessEdited");
          break;
        default:
          throw new Error("Invalid active tab selection.");
      }

      if (response) {
        handleSubmit();
        refetch();
        if (toastMsg) {
          toast.info(toastMsg, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
        handleClose();
      } else {
        throw new Error("Edit failed.");
      }
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleCreate = async (payload: ProductPayload): Promise<void> => {
    try {
      let response;
      let toastMsg = "";

      switch (tabIndex) {
        case 0:
          response = await createProductType(payload);
          toastMsg = t("notify.successCreated");
          break;
        case 1:
          if (formik) {
            response = await createProductSubtype(
              formik.values.category,
              payload
            );
            toastMsg =
              response.status === 409
                ? response.data.message
                : t("notify.successCreated");
          } else {
            throw new Error(
              "Product SubType ID is missing. Cannot create addon."
            );
          }
          break;
        case 2:
          if (formik) {
            response = await createProductAddonType(
              formik.values.subCategory,
              payload
            );
            toastMsg = t("notify.successCreated");
          } else {
            throw new Error(
              "Product SubType ID is missing. Cannot create addon."
            );
          }
          break;
        default:
          throw new Error("Invalid active tab selection for create.");
      }

      if (response) {
        handleSubmit();
        refetch();
        toast.info(toastMsg, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        handleClose();
      } else {
        throw new Error("Creation failed.");
      }
    } catch (error: any) {
      handleError(error);
    }
  };

  useEffect(() => {
    setTabIndex(activeTab || 0);
  }, [activeTab]);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await getProductTypeList();
        setCategory(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCategory();
  }, []);

  useEffect(() => {
    async function fetchSubCategory() {
      try {
        const response = await getProductSubtypeList();
        setSubCategory(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchSubCategory();
  }, []);

  const handleOnClose = () => {
    formik.resetForm();
    handleClose();
  };

  useEffect(() => {
    setTrySubmitted(false);
    if (initialSubCategory && !isEditMode) {
      setSubCategory(initialSubCategory);
    }

    if (initialSubCategory) {
      formik.setValues({
        traditionalName: initialData?.productNameTchi || "",
        simplifiedName: initialData?.productNameSchi || "",
        englishName: initialData?.productNameEng || "",
        category: productId || "",
        subCategory:
          (initialSubCategory !== "undefined" &&
            initialSubCategory[0]?.productSubTypeId) ||
          "",
        introduction: initialData?.description || "",
        remarks: initialData?.remark || "",
      });
    }
  }, [category, initialSubCategory, isEditMode]);

  useEffect(() => {
    const language = localStorage.getItem(localStorgeKeyName.selectedLanguage);
    if (language) setSelectedLanguage(language);
  }, [selectedLanguage]);

  useEffect(() => {
    if (productCategoryId) {
      const categoryId = category.find(
        (item) => item.productTypeId === productCategoryId
      );
      if (categoryId) {
        setSelectedProductCategory(categoryId.productSubType);
      }
    }
  }, [productCategoryId]);

  const handleDelete = async () => {
    try {
      let response;
      let toastMsg;
      const commonPayload = {
        version: initialData?.version,
        status: "INACTIVE",
        updatedBy: localStorage.getItem("username"),
      };

      if (initialData?.productTypeId) {
        response = await editProductType(
          initialData.productTypeId,
          commonPayload
        );
        toastMsg = t("notify.successDeleted");
      } else if (initialData?.productSubTypeId) {
        const subPayload = { ...commonPayload, productTypeId: productId };
        response = await editProductSubtype(
          initialData.productSubTypeId,
          subPayload
        );
        toastMsg = t("notify.successDeleted");
      } else if (initialData?.productAddonTypeId && productSubId) {
        const addOnPayload = {
          ...commonPayload,
          productSubTypeId: productSubId,
        };
        response = await editProductAddonType(
          initialData.productAddonTypeId,
          addOnPayload
        );
        toastMsg = t("notify.successDeleted");
      }

      if (response?.status === 200) {
        refetch();
        if (toastMsg) {
          toast.info(toastMsg, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } else {
        toastMsg = t("common.deleteFailed");
      }
    } catch (error) {
      handleError(error);
    } finally {
      handleOnClose();
    }
  };

  const checkString = (s: string) => {
    if (!trySubmitted) {
      return false;
    }
    return s === "" || isEmptyOrWhitespace(s);
  };

  return (
    <RightOverlayForm
      open={open}
      onClose={() => handleOnClose()}
      anchor="right"
      action={isEditMode ? "edit" : !isAddMode ? "add" : "delete"}
      showHeader={true}
      headerProps={{
        title: !isEditMode ? t("top_menu.add_new") : t("top_menu.add_new"),
        subTitle: t("settings_page.recycling.product_category"),
        submitText: t("add_warehouse_page.save"),
        cancelText: t("common.delete"),
        onCloseHeader: handleClose,
        onSubmit: () => handleSave(),
        onDelete: handleDelete,
        deleteText: t("common.deleteMessage"),
      }}
    >
      <form
        onSubmit={formik.handleSubmit}
        data-testId="astd-semi-product-form-564"
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          paddingX="25px"
          paddingTop="25px"
        >
          <Box mb="16px">
            <CustomField
              label={t("settings_page.recycling.traditional_chinese_name")}
              mandatory
            >
              <CustomTextField
                dataTestId="astd-semi-product-traditional-name-473"
                id="traditionalName"
                value={formik.values.traditionalName}
                placeholder={t(
                  "settings_page.recycling.traditional_chinese_name_placeholder"
                )}
                onChange={(e) => {
                  formik.setFieldValue("traditionalName", e.target.value);
                  formik.setFieldError("traditionalName", ""); // Clear error when user types
                }}
                onBlur={formik.handleBlur}
                error={
                  (formik.touched.traditionalName &&
                    Boolean(formik.errors.traditionalName)) ||
                  checkString(formik.values.traditionalName)
                }
                // helperText={formik.touched.traditionalName && formik.errors.traditionalName}
              />
            </CustomField>
          </Box>

          <Box mb="16px">
            <CustomField
              label={t("settings_page.recycling.simplified_chinese_name")}
              mandatory
            >
              <CustomTextField
                dataTestId="astd-semi-product-simplified-name-391"
                id="simplifiedName"
                value={formik.values.simplifiedName}
                placeholder={t(
                  "settings_page.recycling.simplified_chinese_name_placeholder"
                )}
                onChange={(e) => {
                  formik.setFieldValue("simplifiedName", e.target.value);
                  formik.setFieldError("simplifiedName", ""); // Clear error when typing
                }}
                onBlur={formik.handleBlur}
                error={
                  (formik.touched.simplifiedName &&
                    Boolean(formik.errors.simplifiedName)) ||
                  checkString(formik.values.simplifiedName)
                }
                // helperText={formik.touched.simplifiedName && formik.errors.simplifiedName}
              />
            </CustomField>
          </Box>

          <Box mb="16px">
            {/* English Name */}
            <CustomField
              label={t("settings_page.recycling.english_name")}
              mandatory
            >
              <CustomTextField
                id="englishName"
                dataTestId="astd-semi-product-english-name-829"
                value={formik.values.englishName}
                placeholder={t(
                  "settings_page.recycling.english_name_placeholder"
                )}
                onChange={(e) => {
                  formik.setFieldValue("englishName", e.target.value);
                  formik.setFieldError("englishName", ""); // Clear error when typing
                }}
                onBlur={formik.handleBlur}
                error={
                  (formik.touched.englishName &&
                    Boolean(formik.errors.englishName)) ||
                  checkString(formik.values.englishName)
                }
                // helperText={formik.touched.englishName && formik.errors.englishName}
              />
            </CustomField>
          </Box>
          <CustomField label={t("settings_page.recycling.category")} mandatory>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              aria-label="form tabs"
              TabIndicatorProps={{ style: { display: "none" } }}
            >
              <StyledTab
                label={t("settings_page.recycling.main_category")}
                disabled={isEditMode && (tabIndex === 1 || tabIndex === 2)}
              />
              <StyledTab
                label={t("settings_page.recycling.sub_category")}
                disabled={isEditMode && (tabIndex === 0 || tabIndex === 2)}
              />
              <StyledTab
                label={t("settings_page.recycling.additional_category")}
                disabled={isEditMode && (tabIndex === 0 || tabIndex === 1)}
              />
            </Tabs>
          </CustomField>

          <TabPanel
            value={tabIndex}
            index={0}
            data-testId="astd-semi-product-tabpanel-main-category-219"
          >
            <Box mb="16px">
              {/* 簡介 - Introduction */}
              <CustomField label={t("settings_page.recycling.introduction")}>
                <CustomTextField
                  data-testId="astd-semi-product-main-category-introduction-625"
                  id="introduction"
                  value={formik.values.introduction}
                  placeholder={t(
                    "settings_page.recycling.introduction_placeholder"
                  )}
                  onChange={formik.handleChange}
                  multiline
                  rows={4}
                />
              </CustomField>
            </Box>

            {/* 備註 - Remarks */}
            <CustomField label={t("settings_page.recycling.remarks")}>
              <CustomTextField
                dataTestId="astd-semi-product-main-category-remarks-904"
                id="remarks"
                value={formik.values.remarks}
                placeholder={t("settings_page.recycling.remark_placeholder")}
                onChange={formik.handleChange}
                multiline
                rows={4}
              />
            </CustomField>
          </TabPanel>

          <TabPanel
            value={tabIndex}
            index={1}
            data-testId="astd-semi-product-tabpanel-sub-category-308"
          >
            <Box>
              <Box mb="32px">
                {/* Category Label Outside */}
                <Typography
                  variant="caption"
                  component="label"
                  color="#888"
                  htmlFor="category"
                  style={{ display: "block", marginBottom: "4px" }}
                >
                  {t("settings_page.recycling.main_category")}
                  <span style={{ color: "red" }}>*</span>
                </Typography>

                <FormControl fullWidth>
                  <Select
                    data-testId="astd-semi-product-category-select"
                    labelId="category-label"
                    id="category"
                    value={formik.values.category}
                    onChange={(event) => {
                      formik.setFieldValue("category", event.target.value);
                    }}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.category && Boolean(formik.errors.category)
                    }
                    disabled={isEditMode}
                  >
                    {category.length > 0 &&
                      category.map((item: Products) => {
                        const selectedLanguage =
                          i18n.language === "enus"
                            ? item.productNameEng
                            : i18n.language === "zhhk"
                            ? item.productNameTchi
                            : item.productNameSchi;
                        return (
                          <MenuItem
                            key={item.productTypeId}
                            value={item.productTypeId}
                          >
                            {selectedLanguage}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                <Box my="32px">
                  {/* 簡介 - Introduction */}
                  <CustomField
                    label={t("settings_page.recycling.introduction")}
                  >
                    <CustomTextField
                      dataTestId="astd-semi-product-sub-category-introduction-123"
                      id="introduction"
                      value={formik.values.introduction}
                      placeholder={t(
                        "settings_page.recycling.introduction_placeholder"
                      )}
                      onChange={formik.handleChange}
                      multiline
                      rows={4}
                    />
                  </CustomField>
                </Box>
                {/* 備註 - Remarks */}
                <CustomField label={t("settings_page.recycling.remarks")}>
                  <CustomTextField
                    dataTestId="astd-semi-product-sub-category-remarks-654"
                    id="remarks"
                    value={formik.values.remarks}
                    placeholder={t(
                      "settings_page.recycling.remark_placeholder"
                    )}
                    onChange={formik.handleChange}
                    multiline
                    rows={4}
                  />
                </CustomField>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel
            value={tabIndex}
            index={2}
            data-testId="astd-semi-product-tabpanel-additional-category-737"
          >
            <Box>
              {/* Label outside the input */}
              <Typography
                variant="caption"
                component="label"
                color="#999"
                htmlFor="category"
                style={{ display: "block", marginBottom: "4px" }}
              >
                {t("settings_page.recycling.main_category")}
                <span style={{ color: "red" }}>*</span>
              </Typography>

              <FormControl fullWidth>
                <Select
                  data-testId="astd-semi-product-category-select"
                  labelId="category-label"
                  id="category"
                  value={formik.values.category}
                  onChange={(event) => {
                    formik.setFieldValue("category", event.target.value);
                    setProductCategoryId(event.target.value);
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.category && Boolean(formik.errors.category)
                  }
                  disabled={isEditMode}
                >
                  {category.length > 0 &&
                    category.map((item: Products) => {
                      const selectedLanguage =
                        i18n.language === "enus"
                          ? item.productNameEng
                          : i18n.language === "zhhk"
                          ? item.productNameTchi
                          : item.productNameSchi;
                      return (
                        <MenuItem
                          key={item.productTypeId}
                          value={item.productTypeId}
                        >
                          {selectedLanguage}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Box>
            <Box mb="16px">
              {/* Subcategory Label Outside */}
              <Typography
                variant="caption"
                component="label"
                color="#999"
                htmlFor="category"
                style={{ display: "block", marginBottom: "4px" }}
              >
                {t("settings_page.recycling.sub_category")}
                <span style={{ color: "red" }}>*</span>
              </Typography>

              <FormControl fullWidth>
                <Select
                  data-testId="astd-semi-product-subcategory-select"
                  labelId="subcategory-label"
                  id="subCategory"
                  value={formik.values.subCategory}
                  onChange={(event) =>
                    formik.setFieldValue("subCategory", event.target.value)
                  }
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.subCategory &&
                    Boolean(formik.errors.subCategory)
                  }
                  disabled={isEditMode || formik.values.category === ""}
                >
                  {isEditMode
                    ? subCategory.length > 0 &&
                      subCategory.map((item: ProductSubType) => {
                        const selectedLanguage =
                          i18n.language === "enus"
                            ? item.productNameEng
                            : i18n.language === "zhhk"
                            ? item.productNameTchi
                            : item.productNameSchi;
                        return (
                          <MenuItem
                            key={item.productSubTypeId}
                            value={item.productSubTypeId}
                          >
                            {selectedLanguage}
                          </MenuItem>
                        );
                      })
                    : selectedProductCategory.length > 0 &&
                      selectedProductCategory.map((item: ProductSubType) => {
                        const selectedLanguage =
                          i18n.language === "enus"
                            ? item.productNameEng
                            : i18n.language === "zhhk"
                            ? item.productNameTchi
                            : item.productNameSchi;
                        return (
                          <MenuItem
                            key={item.productSubTypeId}
                            value={item.productSubTypeId}
                          >
                            {selectedLanguage}
                          </MenuItem>
                        );
                      })}
                </Select>
              </FormControl>
            </Box>

            <Box mb="16px">
              <CustomField label={t("settings_page.recycling.introduction")}>
                <CustomTextField
                  dataTestId="astd-semi-product-additional-category-introduction-211"
                  id="introduction"
                  value={formik.values.introduction}
                  placeholder={t(
                    "settings_page.recycling.introduction_placeholder"
                  )}
                  onChange={formik.handleChange}
                  multiline
                  rows={4}
                />
              </CustomField>
            </Box>
            {/* 備註 - Remarks */}
            <CustomField label={t("settings_page.recycling.remarks")}>
              <CustomTextField
                dataTestId="astd-semi-product-additional-category-remarks-789"
                id="remarks"
                value={formik.values.remarks}
                placeholder={t("settings_page.recycling.remark_placeholder")}
                onChange={formik.handleChange}
                multiline
                rows={4}
              />
            </CustomField>
          </TabPanel>
          <div style={{ gap: 0, marginTop: -5 }}>
            {Object.entries(formik.errors).map(([key, value], index) => {
              const errorKeys = Object.keys(formik.errors);
              const lastErrorKey = errorKeys[errorKeys.length - 1];
              return formik.touched[key as keyof typeof formik.touched] &&
                value ? (
                <FormErrorMsg
                  key={index}
                  field={t(
                    `common.${
                      key === "traditionalName"
                        ? "traditionalChineseName"
                        : key === "simplifiedName"
                        ? "simplifiedChineseName"
                        : key
                    }`
                  )}
                  errorMsg={String(value)}
                  type="error"
                  lastIndex={lastErrorKey}
                />
              ) : null;
            })}
          </div>
        </Box>
        <Box
          mt={0}
          mx="25px"
          paddingX="25px"
          display="flex"
          flexDirection="column"
          alignItems="center"
        ></Box>
      </form>
    </RightOverlayForm>
  );
};

export default SemiFinishProductForm;
