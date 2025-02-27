import { FunctionComponent, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import RightOverlayForm from "../../../components/RightOverlayForm";
import { Grid, Box, Divider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  extractError,
  isEmptyOrWhitespace,
  returnApiToken,
  showErrorToast,
  showSuccessToast,
} from "../../../utils/utils";
import { FormErrorMsg } from "../../../components/FormComponents/FormErrorMsg";
import CustomField from "../../../components/FormComponents/CustomField";
import CustomTextField from "../../../components/FormComponents/CustomTextField";
import {
  createVehicleData,
  deleteVehicleData,
  updateVehicleData,
} from "../../../APICalls/ASTD/recycling";
import { paletteColors } from "../../../themes/palette";
import { STATUS_CODE } from "../../../constants/constant";

interface VehicleDataProps {
  createdAt: string;
  createdBy: string;
  description: string;
  remark: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
  vehicleTypeId: string;
  vehicleTypeNameEng: string;
  vehicleTypeNameSchi: string;
  vehicleTypeNameTchi: string;
  vehicleTypeLimit: string;
  version: number;
}

interface SiteTypeProps {
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  action?: "add" | "edit" | "delete";
  selectedItem: VehicleDataProps | null;
  onSubmit: (type: string) => void;
}

const CreateEngineData: FunctionComponent<SiteTypeProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  selectedItem,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const currentLanguage = localStorage.getItem("selectedLanguage") || "zhhk";
  const [errorMsgList, setErrorMsgList] = useState<string[]>([]);
  const [trySubmited, setTrySubmitted] = useState<boolean>(false);
  const [tChineseName, setTChineseName] = useState<string>("");
  const [sChineseName, setSChineseName] = useState<string>("");
  const [englishName, setEnglishName] = useState<string>("");
  const [weight, setWeight] = useState<string>("0");
  const [description, setDescription] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [vehicleTypeId, setVehicleTypeId] = useState<string>("");
  const [version, setVersion] = useState<number>(0);
  const [validation, setValidation] = useState<
    { field: string; error: string; dataTestId?: string }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const isInitialRender = useRef(true); // Add this line
  const navigate = useNavigate();

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [i18n, currentLanguage]);

  useEffect(() => {
    if (action === "edit" || action === "delete") {
      if (selectedItem !== null && selectedItem !== undefined) {
        setVehicleTypeId(selectedItem.vehicleTypeId);
        setTChineseName(selectedItem.vehicleTypeNameTchi);
        setSChineseName(selectedItem.vehicleTypeNameSchi);
        setEnglishName(selectedItem.vehicleTypeNameEng);
        setDescription(selectedItem.description);
        setWeight(selectedItem.vehicleTypeLimit);
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
    setWeight("");
    setRemark("");
    setValidation([]);
    setVersion(0);
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
      return false; // Before submission, no validation error
    }
    return isNaN(s) || s <= 0; // Show error if it's not a valid number or less than 0
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
        dataTestId: `astd-vehicles-form-tc-err-warning-3317`,
      });

    sChineseName.trim() === "" &&
      tempV.push({
        field: `${t(`common.simplifiedChineseName`)} `,
        error: `${t("add_warehouse_page.shouldNotEmpty")}`,
        dataTestId: `astd-vehicles-form-sc-err-warning-8740`,
      });

    englishName.trim() === "" &&
      tempV.push({
        field: `${t(`common.englishName`)} `,
        error: `${t("add_warehouse_page.shouldNotEmpty")}`,
        dataTestId: `astd-vehicles-form-en-err-warning-8515`,
      });

    Number(weight) <= 0 &&
      tempV.push({
        field: `${t("vehicle.loading_capacity")} `,
        error: `${t("recycling_unit.weight_error")}`,
        dataTestId: `astd-vehicles-form-capacity-err-warning-1032`,
      });

    weight == "" &&
      tempV.push({
        field: `${t("vehicle.loading_capacity")} `,
        error: `${t("add_warehouse_page.shouldNotEmpty")}`,
        dataTestId: `astd-vehicles-form-capacity-err-warning-1032`,
      });

    setValidation(tempV);
  }, [tChineseName, sChineseName, englishName, weight, i18n, currentLanguage]);

  const handleDelete = async () => {
    const token = returnApiToken();

    const vehicleForm = {
      status: "DELETED",
      updatedBy: token.loginId,
      version: version,
    };

    if (vehicleForm) {
      try {
        const response = await deleteVehicleData(vehicleTypeId, vehicleForm);

        if (response) {
          showSuccessToast(t("notify.successDeleted"));
          onSubmit("vehicle");
        }
      } catch (error: any) {
        const { state } = extractError(error);
        if (state.code === STATUS_CODE[503]) {
          navigate("/maintenance");
        } else if (state.code === STATUS_CODE[409]) {
          showErrorToast(error.response.data.message);
        }
      }
    }
  };

  const handleSubmit = () => {
    const { loginId } = returnApiToken();

    const vehicleForm = {
      vehicleTypeNameTchi: tChineseName,
      vehicleTypeNameSchi: sChineseName,
      vehicleTypeNameEng: englishName,
      vehicleTypeLimit: weight,
      description: description,
      remark: remark,
      status: "ACTIVE",
      createdBy: loginId,
      updatedBy: loginId,
      ...(action === "edit" && { version: version }),
    };

    const isError = validation.length == 0;
    getFormErrorMsg();

    if (validation.length == 0) {
      action == "add"
        ? createVehicle(vehicleForm)
        : editVehicleData(vehicleForm);

      setValidation([]);
    } else {
      setTrySubmitted(true);
    }
  };

  const createVehicle = async (vehicleForm: any) => {
    try {
      const response = await createVehicleData(vehicleForm);
      if (response) {
        showSuccessToast(t("notify.successCreated"));
        onSubmit("vehicle");
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
      } else {
        showErrorToast(t("notify.errorCreated"));
      }
    }
  };

  const editVehicleData = async (vehicleForm: any) => {
    try {
      const response = await updateVehicleData(vehicleTypeId, vehicleForm);
      if (response) {
        showSuccessToast(t("notify.SuccessEdited"));
        onSubmit("vehicle");
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
      "[tchi]": t("packaging_unit.traditional_chinese_name"),
      "[eng]": t("packaging_unit.english_name"),
      "[schi]": t("packaging_unit.simplified_chinese_name"),
    };

    // Adjust regex to correctly match all keys, including "[Company Number]"
    const matches = input.match(/\[(tchi|eng|schi)\]/gi);

    if (matches) {
      const tempV: { field: string; error: string; dataTestId?: string }[] = [];
      matches.forEach((match) => {
        tempV.push({
          field: replacements[match],
          error: t("form.error.alreadyExist"),
        });
      });
      setValidation(tempV);
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
          subTitle: t("vehicle.vehicle"),
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
                dataTestId="astd-vehicles-form-tc-input-field-9962"
                id="tChineseName"
                value={tChineseName}
                disabled={action === "delete"}
                placeholder={t(
                  "packaging_unit.traditional_chinese_name_placeholder"
                )}
                onChange={(event) => setTChineseName(event.target.value)}
                error={checkString(tChineseName)}
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <CustomField
              label={t("packaging_unit.simplified_chinese_name")}
              mandatory
            >
              <CustomTextField
                dataTestId="astd-vehicles-form-sc-input-field-2191"
                id="sChineseName"
                value={sChineseName}
                disabled={action === "delete"}
                placeholder={t(
                  "packaging_unit.simplified_chinese_name_placeholder"
                )}
                onChange={(event) => setSChineseName(event.target.value)}
                error={checkString(sChineseName)}
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t("packaging_unit.english_name")} mandatory>
              <CustomTextField
                dataTestId="astd-vehicles-form-en-input-field-7884"
                id="englishName"
                value={englishName}
                disabled={action === "delete"}
                placeholder={t("packaging_unit.english_name_placeholder")}
                onChange={(event) => setEnglishName(event.target.value)}
                error={checkString(englishName)}
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t("vehicle.loading_capacity")} mandatory>
              <CustomTextField
                dataTestId="astd-vehicles-form-capacity-input-field-9424"
                id="weight"
                type="number"
                value={weight}
                disabled={action === "delete"}
                placeholder={t("vehicle.loading_capacity")}
                onChange={(event) => {
                  const value = event.target.value;
                  const sanitizedValue = value.replace(/[^0-9.]/g, "");
                  const parts = sanitizedValue.split(".");

                  let formattedValue =
                    parts[0] + (parts.length > 1 ? "." + parts[1] : "");

                  let numValue =
                    formattedValue === "" ? 0 : Number(formattedValue);
                  numValue = Math.max(0, numValue);

                  setWeight(numValue.toString()); // Always set a valid number
                }}
                error={checkNumber(Number(weight))}
                endAdornment={<Typography>kg</Typography>}
              />
            </CustomField>
          </Box>
          {Number(weight) < 0 && (
            <Typography sx={{ color: paletteColors.Red1 }}>
              {t("recycling_unit.weight_error")}
            </Typography>
          )}
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t("packaging_unit.introduction")}>
              <CustomTextField
                dataTestId="astd-vehicles-form-intro-input-field-1178"
                id="description"
                placeholder={t("packaging_unit.introduction_placeholder")}
                onChange={(event) => setDescription(event.target.value)}
                multiline={true}
                defaultValue={description}
                disabled={action === "delete"}
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t("packaging_unit.remark")}>
              <CustomTextField
                dataTestId="astd-vehicles-form-remark-input-field-9641"
                id="remark"
                placeholder={t("packaging_unit.remark_placeholder")}
                onChange={(event) => setRemark(event.target.value)}
                multiline={true}
                defaultValue={remark}
                disabled={action === "delete"}
              />
            </CustomField>
          </Box>
          <Grid item sx={{ width: "92%" }}>
            {trySubmited &&
              validation.map((val, index) => (
                <FormErrorMsg
                  dataTestId={val.dataTestId}
                  key={index}
                  field={t(val.field)}
                  errorMsg={val.error}
                  type={"error"}
                />
              ))}
          </Grid>
          {/* {errorMessage && (
            <Grid item sx={{ width: '92%' }}>
              <FormErrorMsg
                field={''}
                errorMsg={handleDuplicateErrorMessage(errorMessage)}
              />
            </Grid>
          )} */}
        </Box>
      </RightOverlayForm>
    </div>
  );
};

export default CreateEngineData;
