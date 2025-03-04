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
  createRecyc,
  createSubRecyc,
  deleteRecyc,
  deleteSubRecyc,
  updateRecyc,
  updateSubRecyc,
} from "../../../APICalls/ASTD/recycling";
import { STATUS_CODE } from "../../../constants/constant";
import { formValidate } from "src/interfaces/common";

interface recyleSubtyeData {
  recycSubTypeId: string;
  recyclableNameEng: string;
  recyclableNameSchi: string;
  recyclableNameTchi: string;
  description: string;
  remark: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
}

interface recyleTypeData {
  createdAt: string;
  createdBy: string;
  description: string;
  recycSubType: recyleSubtyeData[];
  recycTypeId: string;
  recyclableNameEng: string;
  recyclableNameSchi: string;
  recyclableNameTchi: string;
  remark: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
  recycSubTypeId: string;
  version: number;
}

interface RecyclingFormatProps {
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  action?: "add" | "edit" | "delete";
  onSubmitData: (type: string) => void;
  recyclableType: recyleTypeData[];
  selectedItem: recyleTypeData | null;
  mainCategory: boolean;
  setDeleteModal: (value: boolean) => void;
}

const RecyclingFormat: FunctionComponent<RecyclingFormatProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  recyclableType,
  selectedItem,
  mainCategory,
  setDeleteModal,
}) => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const currentLanguage = localStorage.getItem("selectedLanguage") || "zhhk";
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const [recycleType, setRecycleType] = useState([]);
  const [recycleSubType, setSubRecycleType] = useState({});
  const [contractList, setContractList] = useState<
    { contractNo: string; isEpd: boolean; frmDate: string; toDate: string }[]
  >([]);
  const [pysicalLocation, setPysicalLocation] = useState<boolean>(false); // pysical location field
  const [status, setStatus] = useState<boolean>(true); // status field
  const [trySubmited, setTrySubmitted] = useState<boolean>(false);
  const [tChineseName, setTChineseName] = useState<string>("");
  const [sChineseName, setSChineseName] = useState<string>("");
  const [englishName, setEnglishName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [isMainCategory, setMainCategory] = useState<boolean>(true);
  const [chosenRecyclableType, setChosenRecyclableType] = useState<string>("");
  const [subTypeId, setSubTypeId] = useState<string>("");
  const [mainTypeId, setMainTypeId] = useState<string>("");
  const [version, setVersion] = useState<number>(0);
  const [validation, setValidation] = useState<formValidate[]>([]);
  const isInitialRender = useRef(true); // Add this line
  const navigate = useNavigate();

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [i18n, currentLanguage]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    setTrySubmitted(false);
    if (action === "edit") {
      setTrySubmitted(false);
      if (selectedItem !== null && selectedItem !== undefined) {
        if (!mainCategory) {
          const parentData = recyclableType.find((value) =>
            value.recycSubType.some(
              (subType) =>
                subType.recycSubTypeId === selectedItem.recycSubTypeId
            )
          );
          setSubTypeId(selectedItem.recycSubTypeId);
          setChosenRecyclableType(parentData ? parentData.recycTypeId : "");
        } else {
          setMainTypeId(selectedItem.recycTypeId);
        }
        setTChineseName(selectedItem.recyclableNameTchi);
        setSChineseName(selectedItem.recyclableNameSchi);
        setEnglishName(selectedItem.recyclableNameEng);
        setDescription(selectedItem.description);
        setRemark(selectedItem.remark);
        setMainCategory(mainCategory);
        setVersion(selectedItem.version);
      }
    } else if (action === "add") {
      resetForm();
    }
  }, [selectedItem, action, mainCategory, recyclableType, drawerOpen]);

  const resetForm = () => {
    setTChineseName("");
    setSChineseName("");
    setEnglishName("");
    setDescription("");
    setRemark("");
    setMainCategory(true);
    setChosenRecyclableType("");
    setSubTypeId("");
    setValidation([]);
    setTrySubmitted(false);
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

  const validate = async () => {
    const tempV: formValidate[] = [];

    tChineseName.trim() === "" &&
      tempV.push({
        field: `${t("packaging_unit.traditional_chinese_name")}`,
        problem: `${t("add_warehouse_page.shouldNotEmpty")}`,
        dataTestId: "astd-recyclable-form-tc-err-warning-4543",
        type: "error",
      });

    sChineseName.trim() === "" &&
      tempV.push({
        field: `${t("packaging_unit.simplified_chinese_name")}`,
        problem: `${t("add_warehouse_page.shouldNotEmpty")}`,
        dataTestId: "astd-recyclable-form-sc-err-warning-7195",
        type: "error",
      });

    englishName.trim() === "" &&
      tempV.push({
        field: `${t("packaging_unit.english_name")}`,
        problem: `${t("add_warehouse_page.shouldNotEmpty")}`,
        dataTestId: "astd-recyclable-form-en-err-warning-2471",
        type: "error",
      });

    if (isMainCategory === false) {
      chosenRecyclableType.trim() === "" &&
        tempV.push({
          field: `${t("recycling_unit.main_category")}`,
          problem: `${t("add_warehouse_page.shouldNotEmpty")}`,
          dataTestId:
            "astd-recyclable-form-choose-main-select-err-warning-8595",
          type: "error",
        });
    }

    setValidation(tempV);
    return tempV.length === 0;
  };

  useEffect(() => {
    validate();
  }, [
    tChineseName,
    sChineseName,
    englishName,
    isMainCategory,
    chosenRecyclableType,
    i18n,
    currentLanguage,
  ]);

  const handleDelete = async () => {
    const token = returnApiToken();

    const recyclingForm = {
      status: "INACTIVE",
      updatedBy: token.loginId,
      version: version,
    };

    try {
      if (isMainCategory) {
        setDeleteModal(true);
        // const response = await deleteRecyc(recyclingForm, mainTypeId)
        // if (response) {
        //     showSuccessToast(t('notify.successDeleted'))
        //     onSubmitData('recycle')
        // }
      } else {
        const response = await deleteSubRecyc(recyclingForm, subTypeId);
        if (response) {
          showSuccessToast(t("notify.successDeleted"));
          onSubmitData("recycle");
        }
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

  const handleSubmit = async () => {
    const isValid = await validate();
    if (isValid) {
      const { loginId } = returnApiToken();

      const addRecyclingForm = {
        recyclableNameTchi: tChineseName,
        recyclableNameSchi: sChineseName,
        recyclableNameEng: englishName,
        description: description,
        remark: remark,
        status: "ACTIVE",
        createdBy: loginId,
        updatedBy: loginId,
        ...(action === "edit" && { version: version }),
      };

      if (action === "add") {
        createRecycData(addRecyclingForm);
      } else {
        editRecycData(addRecyclingForm);
      }
    } else {
      setTrySubmitted(true);
    }
  };

  const createRecycData = async (addRecyclingForm: any) => {
    try {
      if (isMainCategory) {
        const response = await createRecyc(addRecyclingForm);
        if (response) {
          showSuccessToast(t("notify.successCreated"));
          onSubmitData("recycle");
        }
      } else {
        const response = await createSubRecyc(
          addRecyclingForm,
          chosenRecyclableType
        );
        if (response) {
          showSuccessToast(t("notify.successCreated"));
          onSubmitData("recycle");
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
  const editRecycData = async (addRecyclingForm: any) => {
    try {
      if (isMainCategory) {
        const response = await updateRecyc(addRecyclingForm, mainTypeId);
        if (response) {
          showSuccessToast(t("notify.SuccessEdited"));
          onSubmitData("recycle");
        }
      } else {
        const response = await updateSubRecyc(addRecyclingForm, subTypeId);
        if (response) {
          showSuccessToast(t("notify.SuccessEdited"));
          onSubmitData("recycle");
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
      const tempV: formValidate[] = [];
      matches.map((match) => {
        tempV.push({
          field: replacements[match],
          problem: t("settings_page.recycling.already_exists"),
          type: "error",
        });
      });
      setValidation(tempV);
      return tempV.length === 0;
    }

    return [];
  };

  const handleCloseDrawer = () => {
    handleDrawerClose();
    resetForm();
  };

  return (
    <div className="add-vehicle">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleCloseDrawer}
        anchor={"right"}
        action={action}
        headerProps={{
          title:
            action == "add"
              ? t("top_menu.add_new")
              : action == "delete"
              ? t("common.delete")
              : "",
          subTitle: t("recycling_unit.recyclable_subtype_semi_complete"),
          submitText: t("add_warehouse_page.save"),
          cancelText: t("add_warehouse_page.delete"),
          onCloseHeader: handleCloseDrawer,
          onSubmit: handleSubmit,
          onDelete: handleDelete,
          deleteText: t("common.deleteMessage"),
        }}
      >
        <Divider></Divider>
        <Box sx={{ marginX: 2, paddingBottom: 10 }}>
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
                        `${t("packaging_unit.traditional_chinese_name")}`
                    ))
                }
                dataTestId="astd-recyclable-form-tc-input-field-5560"
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
                        `${t("packaging_unit.simplified_chinese_name")}`
                    ))
                }
                dataTestId="astd-recyclable-form-sc-input-field-2575"
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
                dataTestId="astd-recyclable-form-en-input-field-4031"
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t("recycling_unit.main_category")} mandatory>
              <Switcher
                onText={t("add_warehouse_page.yes")}
                offText={t("add_warehouse_page.no")}
                disabled={action === "delete" || action === "edit"}
                defaultValue={isMainCategory}
                setState={(newValue) => {
                  setMainCategory(newValue);
                  newValue === false && setChosenRecyclableType("");
                }}
                dataTestId="astd-recyclable-form-type-boolean-button-4961"
              />
            </CustomField>
          </Box>
          {!isMainCategory && (
            <Box sx={{ marginY: 2 }}>
              <CustomField label={t("recycling_unit.main_category")} mandatory>
                <div className="self-stretch flex flex-col items-start justify-start">
                  <div className="self-stretch ">
                    <FormControl sx={{ m: 1, width: "100%" }}>
                      <Select
                        value={chosenRecyclableType}
                        onChange={(event: SelectChangeEvent<string>) =>
                          setChosenRecyclableType(event.target.value)
                        }
                        displayEmpty
                        disabled={action === "delete" || action === "edit"}
                        inputProps={{ "aria-label": "Without label" }}
                        sx={{ borderRadius: "12px" }}
                        error={checkString(chosenRecyclableType)}
                        data-testid="astd-recyclable-form-choose-main-select-button-2451"
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        {recyclableType.length > 0 ? (
                          recyclableType.map((item, index) => (
                            <MenuItem value={item.recycTypeId} key={index}>
                              {currentLanguage === "zhhk"
                                ? item.recyclableNameTchi
                                : currentLanguage === "zhch"
                                ? item.recyclableNameSchi
                                : item.recyclableNameEng}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled value="">
                            <em>{t("common.noOptions")}</em>
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </CustomField>
            </Box>
          )}
          <CustomField label={t("packaging_unit.introduction")}>
            <CustomTextField
              id="description"
              placeholder={t("packaging_unit.introduction_placeholder")}
              onChange={(event) => setDescription(event.target.value)}
              multiline={true}
              defaultValue={description}
              dataTestId="astd-recyclable-form-intro-input-field-7653"
            />
          </CustomField>
          <CustomField label={t("packaging_unit.remark")}>
            <CustomTextField
              id="remark"
              placeholder={t("packaging_unit.remark_placeholder")}
              onChange={(event) => setRemark(event.target.value)}
              multiline={true}
              defaultValue={remark}
              dataTestId="astd-recyclable-form-remark-input-field-3725"
            />
          </CustomField>
          <Grid item sx={{ width: "92%" }}>
            {trySubmited &&
              validation.map((val, index) => (
                <FormErrorMsg
                  key={index}
                  field={t(val.field)}
                  errorMsg={val.problem} // Display the error message directly
                  type={val.type}
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
