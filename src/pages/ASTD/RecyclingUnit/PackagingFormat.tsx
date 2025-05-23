import {
  FunctionComponent,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import RightOverlayForm from "../../../components/RightOverlayForm";
import TextField from "@mui/material/TextField";
import {
  Grid,
  FormHelperText,
  Autocomplete,
  Modal,
  Box,
  Stack,
  Divider,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switcher from "../../../components/FormComponents/CustomSwitch";
import LabelField from "../../../components/FormComponents/CustomField";
import { ADD_CIRCLE_ICON, REMOVE_CIRCLE_ICON } from "../../../themes/icons";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import {
  extractError,
  isEmptyOrWhitespace,
  returnApiToken,
  showErrorToast,
  showSuccessToast,
} from "../../../utils/utils";
import {
  createWarehouse,
  getWarehouseById,
  editWarehouse,
  getRecycleType,
} from "../../../APICalls/warehouseManage";
import { set } from "date-fns";
import { getLocation } from "../../../APICalls/getLocation";
import { get } from "http";
import { getCommonTypes } from "../../../APICalls/commonManage";
import { FormErrorMsg } from "../../../components/FormComponents/FormErrorMsg";
import CustomField from "../../../components/FormComponents/CustomField";
import CustomTextField from "../../../components/FormComponents/CustomTextField";
import {
  createPackagingUnit,
  createRecyc,
  editPackagingUnit,
} from "../../../APICalls/ASTD/recycling";
import { STATUS_CODE } from "../../../constants/constant";

interface PackagingUnitProps {
  createdAt: string;
  createdBy: string;
  description: string;
  packagingNameEng: string;
  packagingNameSchi: string;
  packagingNameTchi: string;
  packagingTypeId: string;
  remark: string;
  status: string;
  tenantId: string;
  updatedAt: string;
  updatedBy: string;
  version: number;
}

interface RecyclingFormatProps {
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  action?: "add" | "edit" | "delete";
  onSubmitData: (type: string) => void;
  selectedItem: PackagingUnitProps | null;
}

const RecyclingFormat: FunctionComponent<RecyclingFormatProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  selectedItem,
}) => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const currentLanguage = localStorage.getItem("selectedLanguage") || "zhhk";
  const [errorMsgList, setErrorMsgList] = useState<string[]>([]);

  const [trySubmited, setTrySubmitted] = useState(false);
  const [tChineseName, setTChineseName] = useState("");
  const [sChineseName, setSChineseName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [description, setDescription] = useState("");
  const [remark, setRemark] = useState("");
  const [packagingId, setPackagingId] = useState("");
  const [validation, setValidation] = useState<
    { field: string; error: string; dataTestId: string }[]
  >([]);
  const [version, setVersion] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [i18n, currentLanguage]);

  useEffect(() => {
    setTrySubmitted(false);
    if (action === "edit" || action === "delete") {
      if (selectedItem !== null && selectedItem !== undefined) {
        setPackagingId(selectedItem.packagingTypeId);
        setTChineseName(selectedItem.packagingNameTchi);
        setSChineseName(selectedItem.packagingNameSchi);
        setEnglishName(selectedItem.packagingNameEng);
        setDescription(selectedItem.description);
        setRemark(selectedItem.remark);
        setVersion(selectedItem.version);
      }
    } else if (action === "add") {
      resetForm();
    }
  }, [selectedItem, action, drawerOpen]);

  const resetForm = () => {
    setTChineseName("");
    setSChineseName("");
    setEnglishName("");
    setDescription("");
    setRemark("");
  };

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false;
    }
    return s == "" || isEmptyOrWhitespace(s);
  };

  const checkNumber = (s: number) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false;
    }
    return s == 0;
  };

  const getFormErrorMsg = () => {
    const errorList: string[] = [];
    validation.map((item) => {
      errorList.push(`${item.error}`);
    });
    setErrorMsgList(errorList);

    return "";
  };

  useEffect(() => {
    const tempV: { field: string; error: string; dataTestId: string }[] = [];

    tChineseName.trim() === "" &&
      tempV.push({
        field: `${t("packaging_unit.traditional_chinese_name")}`,
        error: `${t("add_warehouse_page.shouldNotEmpty")}`,
        dataTestId: "astd-packaging-unit-form-tc-err-warning-4738",
      });

    sChineseName.trim() === "" &&
      tempV.push({
        field: `${t("packaging_unit.simplified_chinese_name")}`,
        error: `${t("add_warehouse_page.shouldNotEmpty")}`,
        dataTestId: "astd-packaging-unit-form-sc-err-warning-7683",
      });

    englishName.trim() === "" &&
      tempV.push({
        field: `${t("packaging_unit.english_name")}`,
        error: `${t("add_warehouse_page.shouldNotEmpty")}`,
        dataTestId: "astd-packaging-unit-form-en-err-warning-6715",
      });

    setValidation(tempV);
  }, [tChineseName, sChineseName, englishName, i18n, currentLanguage]);

  const handleDelete = () => {
    const { loginId, tenantId } = returnApiToken();

    const packagingForm = {
      tenantId: tenantId,
      packagingNameTchi: tChineseName,
      packagingNameSchi: sChineseName,
      packagingNameEng: englishName,
      description: description,
      remark: remark,
      status: "DELETED",
      createdBy: loginId,
      updatedBy: loginId,
      version: version,
    };

    if (validation.length == 0) {
      editPackagingData(packagingForm, "delete");
    } else {
      setTrySubmitted(true);
      showErrorToast(t("notify.errorDeleted"));
    }
  };

  const handleSubmit = () => {
    const { loginId, tenantId } = returnApiToken();

    const packagingForm = {
      tenantId: tenantId,
      packagingNameTchi: tChineseName,
      packagingNameSchi: sChineseName,
      packagingNameEng: englishName,
      description: description,
      remark: remark,
      status: "ACTIVE",
      createdBy: loginId,
      updatedBy: loginId,
      ...(action == "edit" && { version: version ?? 0 }),
    };

    const isError = validation.length == 0;
    getFormErrorMsg();

    if (validation.length == 0) {
      action == "add"
        ? createPackagingData(packagingForm)
        : editPackagingData(packagingForm, "edit");

      setValidation([]);
    } else {
      setTrySubmitted(true);
    }
  };

  const createPackagingData = async (packagingForm: any) => {
    try {
      const response = await createPackagingUnit(packagingForm);
      if (response) {
        showSuccessToast(t("notify.successCreated"));
        onSubmitData("packaging");
      }
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else if (state.code === STATUS_CODE[409]) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes("[RESOURCE_DUPLICATE_ERROR]")) {
          setTrySubmitted(true);
          handleDuplicateErrorMessage(errorMessage);
        } else {
          showErrorToast(error.response.data.message);
        }
      }
    }
  };
  const editPackagingData = async (packagingForm: any, value: string) => {
    try {
      const response = await editPackagingUnit(packagingForm, packagingId);
      if (response) {
        onSubmitData("packaging");
        if (value === "edit") {
          showSuccessToast(t("notify.SuccessEdited"));
        } else {
          showSuccessToast(t("notify.successDeleted"));
        }
      }
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else if (state.code === STATUS_CODE[409]) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes("[RESOURCE_DUPLICATE_ERROR]")) {
          setTrySubmitted(true);
          handleDuplicateErrorMessage(errorMessage);
        } else {
          showErrorToast(error.response.data.message);
        }
      }
    }
  };

  const handleDuplicateErrorMessage = (input: string) => {
    const replacements: { [key: string]: string } = {
      "[tchi]": t("common.traditionalChineseName"),
      "[eng]": t("common.englishName"),
      "[schi]": t("common.simplifiedChineseName"),
    };

    const matches = input.match(/\[(tchi|eng|schi)\]/g);

    if (matches) {
      const tempV: { field: string; error: string; dataTestId: string }[] = [];
      matches.map((match) => {
        tempV.push({
          field: replacements[match],
          error: t("settings_page.recycling.already_exists"),
          dataTestId: "",
        });
      });
      setValidation(tempV);
      return tempV.length === 0;
    }

    return [];
  };

  return (
    <div className="add-vehicle">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={"right"}
        action={action}
        headerProps={{
          title:
            action == "add"
              ? t("top_menu.add_new")
              : action == "delete"
              ? t("common.delete")
              : "",
          subTitle: t("packaging_unit.packaging_unit"),
          submitText: t("add_warehouse_page.save"),
          cancelText: t("add_warehouse_page.delete"),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
          onDelete: handleDelete,
          deleteText: t("common.deleteMessage"),
        }}
      >
        <Divider></Divider>
        <Box sx={{ marginX: 2 }}>
          <Box sx={{ marginY: 2 }}>
            <CustomField
              label={t("packaging_unit.traditional_chinese_name")}
              mandatory
            >
              <CustomTextField
                id="tChineseName"
                value={tChineseName}
                disabled={action === "delete"}
                placeholder={t(
                  "packaging_unit.traditional_chinese_name_placeholder"
                )}
                onChange={(event) => setTChineseName(event.target.value)}
                error={
                  checkString(tChineseName) ||
                  (trySubmited &&
                    validation.some(
                      (value) =>
                        value.field ===
                        t("packaging_unit.traditional_chinese_name")
                    ))
                }
                dataTestId="astd-packaging-unit-form-tc-input-field-9028"
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <CustomField
              label={t("packaging_unit.simplified_chinese_name")}
              mandatory
            >
              <CustomTextField
                id="sChineseName"
                value={sChineseName}
                disabled={action === "delete"}
                placeholder={t(
                  "packaging_unit.simplified_chinese_name_placeholder"
                )}
                onChange={(event) => setSChineseName(event.target.value)}
                error={
                  checkString(sChineseName) ||
                  (trySubmited &&
                    validation.some(
                      (value) =>
                        value.field ===
                        t("packaging_unit.simplified_chinese_name")
                    ))
                }
                dataTestId="astd-packaging-unit-form-sc-input-field-2397"
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t("packaging_unit.english_name")} mandatory>
              <CustomTextField
                id="englishName"
                value={englishName}
                disabled={action === "delete"}
                placeholder={t("packaging_unit.english_name_placeholder")}
                onChange={(event) => setEnglishName(event.target.value)}
                error={
                  checkString(englishName) ||
                  (trySubmited &&
                    validation.some(
                      (value) =>
                        value.field === t("packaging_unit.english_name")
                    ))
                }
                dataTestId="astd-packaging-unit-form-en-input-field-3992"
              />
            </CustomField>
          </Box>
          <CustomField label={t("packaging_unit.introduction")}>
            <CustomTextField
              id="description"
              placeholder={t("packaging_unit.introduction_placeholder")}
              onChange={(event) => setDescription(event.target.value)}
              multiline={true}
              defaultValue={description}
              disabled={action === "delete"}
              dataTestId="astd-packaging-unit-form-intro-input-field-8409"
            />
          </CustomField>
          <CustomField label={t("packaging_unit.remark")}>
            <CustomTextField
              id="remark"
              placeholder={t("packaging_unit.remark_placeholder")}
              onChange={(event) => setRemark(event.target.value)}
              multiline={true}
              defaultValue={remark}
              disabled={action === "delete"}
              dataTestId="astd-packaging-unit-form-remark-input-field-8657"
            />
          </CustomField>
          <Grid item sx={{ width: "92%" }}>
            {trySubmited &&
              validation.map((val, index) => (
                <FormErrorMsg
                  key={index}
                  field={t(val.field)}
                  errorMsg={val.error}
                  type={"error"}
                  dataTestId={val.dataTestId}
                />
              ))}
          </Grid>
        </Box>
      </RightOverlayForm>
    </div>
  );
};

let styles = {
  textField: {
    borderRadius: "10px",
    fontWeight: "500",
    "& .MuiOutlinedInput-input": {
      padding: "15px 20px",
      margin: 0,
    },
  },
  textArea: {
    borderRadius: "10px",
    fontWeight: "500",
    "& .MuiOutlinedInput-input": {
      padding: 0,
      margin: 0,
    },
  },
  inputState: {
    "& .MuiOutlinedInput-root": {
      margin: 0,
      "&:not(.Mui-disabled):hover fieldset": {
        borderColor: "#79CA25",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#79CA25",
      },
    },
  },
  dropDown: {
    "& .MuiOutlinedInput-root-MuiSelect-root": {
      borderRadius: "10px",
    },
  },
  modal: {
    position: "absolute",
    top: "50%",
    width: "34%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    height: "fit-content",
    padding: 4,
    backgroundColor: "white",
    border: "none",
    borderRadius: 5,

    "@media (max-width: 768px)": {
      width: "70%" /* Adjust the width for mobile devices */,
    },
  },
};

export default RecyclingFormat;
