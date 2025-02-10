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
  createRecyc,
  deleteWeightUnit,
  editWeightUnit,
  sendWeightUnit,
} from "../../../APICalls/ASTD/recycling";
import { paletteColors } from "../../../themes/palette";
import { STATUS_CODE } from "../../../constants/constant";
import { version } from "os";

interface WeightFormatData {
  createdAt: string;
  createdBy: string;
  description: string;
  poDetail: string[];
  remark: string;
  status: string;
  unitId: number;
  unitNameEng: string;
  unitNameSchi: string;
  unitNameTchi: string;
  updatedAt: string;
  updatedBy: string;
  weight: number;
  version: number;
}

interface WeightFormatProps {
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  action?: "add" | "edit" | "delete";
  onSubmitData: (type: string) => void;
  rowId?: number;
  selectedItem: WeightFormatData | null;
}

const WeightFormat: FunctionComponent<WeightFormatProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  rowId,
  selectedItem,
}) => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const currentLanguage = localStorage.getItem("selectedLanguage") || "zhhk";
  const [errorMsgList, setErrorMsgList] = useState<string[]>([]);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [trySubmited, setTrySubmitted] = useState<boolean>(false);
  const [tChineseName, setTChineseName] = useState<string>("");
  const [sChineseName, setSChineseName] = useState<string>("");
  const [englishName, setEnglishName] = useState<string>("");
  const [equivalent, setEquivalent] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [version, setVersion] = useState<number>(0);
  const [isMainCategory, setMainCategory] = useState(true);
  const [chosenRecyclableType, setChosenRecyclableType] = useState("");
  const [validation, setValidation] = useState<
    { field: string; error: string; dataTestId: string }[]
  >([]);
  const isInitialRender = useRef(true); // Add this line
  const navigate = useNavigate();

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [i18n, currentLanguage]);

  useEffect(() => {
    setTrySubmitted(false);
    if (action === "edit" || action === "delete") {
      if (selectedItem !== null && selectedItem !== undefined) {
        setTChineseName(selectedItem.unitNameTchi);
        setSChineseName(selectedItem.unitNameSchi);
        setEnglishName(selectedItem.unitNameEng);
        setEquivalent(selectedItem.weight.toString());
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
    setEquivalent("");
    setDescription("");
    setRemark("");
    setVersion(0);
  };

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false;
    }
    return s == "";
  };

  const checkNumber = (s: number) => {
    if (!trySubmited) {
      return false; // No error before first submit
    }
    return !(s >= 0); // Returns true if it's an error
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
        field: `${t(`common.traditionalChineseName`)}`,
        error: `${t("add_warehouse_page.shouldNotEmpty")}`,
        dataTestId: "astd-weight-form-tc-err-warning-3284",
      });

    sChineseName.trim() === "" &&
      tempV.push({
        field: `${t(`common.simplifiedChineseName`)} `,
        error: `${t("add_warehouse_page.shouldNotEmpty")}`,
        dataTestId: "astd-weight-form-sc-err-warning-2369",
      });

    englishName.trim() === "" &&
      tempV.push({
        field: `${t(`common.englishName`)} `,
        error: `${t("add_warehouse_page.shouldNotEmpty")}`,
        dataTestId: "astd-weight-form-en-err-warning-5134",
      });

    Number(equivalent) < 0 &&
      tempV.push({
        field: `${t(`pick_up_order.card_detail.weight`)}`,
        error: `${t("recycling_unit.weight_error")}`,
        dataTestId: "astd-weight-form-weight-err-warning-7858",
      });

    equivalent === "" &&
      tempV.push({
        field: `${t(`pick_up_order.card_detail.weight`)}`,
        error: `${t("add_warehouse_page.shouldNotEmpty")}`,
        dataTestId: "astd-weight-form-weight-err-warning-7858",
      });

    setValidation(tempV);
  }, [
    tChineseName,
    sChineseName,
    englishName,
    equivalent,
    i18n,
    currentLanguage,
  ]);

  const handleDelete = async () => {
    const token = returnApiToken();
    const weightForm = {
      status: "DELETED",
      updatedBy: token.loginId,
      version: version,
    };

    try {
      const response = await deleteWeightUnit(
        Number(selectedItem?.unitId),
        weightForm
      );
      if (response) {
        onSubmitData("weight");
        showSuccessToast(t("notify.successDeleted"));
      }
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else if (state.code === STATUS_CODE[409]) {
        showErrorToast(error.response.data.message);
      }
    }
  };

  const handleSubmit = () => {
    const { loginId } = returnApiToken();

    const weightForm = {
      unitNameTchi: tChineseName,
      unitNameSchi: sChineseName,
      unitNameEng: englishName,
      description: description,
      remark: remark,
      weight: Number(equivalent),
      status: "ACTIVE",
      createdBy: loginId,
      updatedBy: loginId,
      ...(action === "edit" && { version: version }),
    };

    const isError = validation.length == 0;
    getFormErrorMsg();

    if (validation.length == 0) {
      action == "add"
        ? createWeightData(weightForm)
        : editWeightData(weightForm);

      setValidation([]);
    } else {
      setTrySubmitted(true);
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
      console.log(matches, "matches");
      const tempV: { field: string; error: string; dataTestId: string }[] = [];
      matches.map((match) => {
        tempV.push({
          field: replacements[match],
          error: t("settings_page.recycling.already_exists"),
          dataTestId: "",
        });
      });
      setValidation(tempV);

      console.log(tempV, "aa");
      return tempV.length === 0;
    }

    return [];
  };

  const createWeightData = async (weightForm: any) => {
    try {
      const response = await sendWeightUnit(weightForm);
      if (response) {
        onSubmitData("weight");
        showSuccessToast(t("notify.successCreated"));
      }
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else if (state.code === STATUS_CODE[409]) {
        const errorMessage = error.response.data.message;
        setTrySubmitted(true);
        if (errorMessage.includes("[RESOURCE_DUPLICATE_ERROR]")) {
          handleDuplicateErrorMessage(errorMessage);
        } else {
          showErrorToast(error.response.data.message);
        }
      } else {
        console.error(error);
        showErrorToast(t("errorCreated.errorCreated"));
      }
    }
  };
  const editWeightData = async (weightForm: any) => {
    try {
      const response = await editWeightUnit(
        Number(selectedItem?.unitId),
        weightForm
      );
      if (response) {
        onSubmitData("weight");
        showSuccessToast(t("notify.SuccessEdited"));
      }
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else if (state.code === STATUS_CODE[409]) {
        const errorMessage = error.response.data.message;
        setTrySubmitted(true);
        if (errorMessage.includes("[RESOURCE_DUPLICATE_ERROR]")) {
          handleDuplicateErrorMessage(errorMessage);
        } else {
          showErrorToast(error.response.data.message);
        }
      } else {
        console.error(error);
        showErrorToast(t("errorCreated.errorCreated"));
      }
    }
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
          subTitle: t("recycling_unit.weight_unit"),
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
                error={checkString(tChineseName)}
                dataTestId="astd-weight-form-tc-input-field-2894"
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
                error={checkString(sChineseName)}
                dataTestId="astd-weight-form-sc-input-field-7938"
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
                error={checkString(englishName)}
                dataTestId="astd-weight-form-en-input-field-9676"
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t("recycling_unit.1kg_equivalent")} mandatory>
              <CustomTextField
                id="equivalent"
                type="number"
                value={equivalent}
                disabled={action === "delete"}
                placeholder={t("recycling_unit.enter_weight")}
                onChange={(event) => setEquivalent(event.target.value)}
                error={checkNumber(Number(equivalent))}
                dataTestId="astd-weight-form-weight-input-field-8988"
              />
            </CustomField>
          </Box>
          {Number(equivalent) < 0 && (
            <Typography sx={{ color: paletteColors.Red1 }}>
              {t("recycling_unit.weight_error")}
            </Typography>
          )}
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t("packaging_unit.introduction")}>
              <CustomTextField
                id="description"
                placeholder={t("packaging_unit.introduction_placeholder")}
                onChange={(event) => setDescription(event.target.value)}
                multiline={true}
                defaultValue={description}
                disabled={action === "delete"}
                dataTestId="astd-weight-form-intro-input-field-8003"
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t("packaging_unit.remark")}>
              <CustomTextField
                id="remark"
                placeholder={t("packaging_unit.remark_placeholder")}
                onChange={(event) => setRemark(event.target.value)}
                multiline={true}
                defaultValue={remark}
                disabled={action === "delete"}
                dataTestId="astd-weight-form-remark-input-field-9721"
              />
            </CustomField>
          </Box>
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

export default WeightFormat;
