import { FunctionComponent, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import RightOverlayForm from "../../../components/RightOverlayForm";
import { Grid, Box, Divider } from "@mui/material";
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
  createRecyclingPoint,
  deleteRecyclingPoint,
  editRecyclingPoint,
} from "../../../APICalls/ASTD/recycling";
import { STATUS_CODE } from "../../../constants/constant";
import RecyclingPointForm from "./RecyclingPointForm";

interface siteTypeDataProps {
  createdAt: string;
  createdBy: string;
  description: string;
  remark: string;
  siteTypeId: string;
  siteTypeNameEng: string;
  siteTypeNameSchi: string;
  siteTypeNameTchi: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
  version: number;
}

interface SiteTypeProps {
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  action?: "add" | "edit" | "delete";
  rowId?: number;
  selectedItem: siteTypeDataProps | null;
  handleOnSubmitData: (type: string) => void;
}

const CreateRecyclingPoint: FunctionComponent<SiteTypeProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  rowId,
  selectedItem,
  handleOnSubmitData,
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
  const [validation, setValidation] = useState<
    { field: string; error: string; dataTestId?: string }[]
  >([]);
  const [version, setVersion] = useState<number>(0);
  const isInitialRender = useRef(true); // Add this line
  const navigate = useNavigate();

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [i18n, currentLanguage]);

  useEffect(() => {
    setTrySubmitted(false);
    if (action === "edit" || action === "delete") {
      if (selectedItem !== null && selectedItem !== undefined) {
        setTChineseName(selectedItem.siteTypeNameTchi);
        setSChineseName(selectedItem.siteTypeNameSchi);
        setEnglishName(selectedItem.siteTypeNameEng);
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
        error: `${t(`common.traditionalChineseName`)} ${t(
          "add_warehouse_page.shouldNotEmpty"
        )}`,
        dataTestId: "astd-house-form-tc-err-warning-5120",
      });

    sChineseName.trim() === "" &&
      tempV.push({
        field: `${t("packaging_unit.simplified_chinese_name")}`,
        error: `${t(`common.simplifiedChineseName`)} ${t(
          "add_warehouse_page.shouldNotEmpty"
        )}`,
        dataTestId: "astd-house-form-sc-err-warning-8565",
      });

    englishName.trim() === "" &&
      tempV.push({
        field: `${t("packaging_unit.english_name")}`,
        error: `${t(`common.englishName`)} ${t(
          "add_warehouse_page.shouldNotEmpty"
        )}`,
        dataTestId: "astd-house-form-en-err-warning-28511",
      });

    setValidation(tempV);
  }, [tChineseName, sChineseName, englishName, i18n, currentLanguage]);

  const handleDelete = async () => {
    const { loginId } = returnApiToken();
    const recyclingPointForm = {
      status: "DELETED",
      updatedBy: loginId,
      version: version,
    };

    try {
      if (selectedItem !== null && selectedItem !== undefined) {
        const response = await deleteRecyclingPoint(
          selectedItem?.siteTypeId,
          recyclingPointForm
        );
        if (response) {
          handleOnSubmitData("siteType");
          showSuccessToast(t("notify.successDeleted"));
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

  const handleSubmit = () => {
    setTrySubmitted(false);
    const { loginId } = returnApiToken();

    const recyclingPointForm = {
      siteTypeNameTchi: tChineseName,
      siteTypeNameSchi: sChineseName,
      siteTypeNameEng: englishName,
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
        ? createRecyclingPointData(recyclingPointForm)
        : editRecyclingPointData(recyclingPointForm);

      setValidation([]);
    } else {
      setTrySubmitted(true);
    }
  };

  const createRecyclingPointData = async (data: any) => {
    try {
      const response = await createRecyclingPoint(data);
      if (response) {
        handleOnSubmitData("siteType");
        showSuccessToast(t("notify.successCreated"));
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
        console.error(error);
        showErrorToast(t("errorCreated.errorCreated"));
      }
    }
  };
  const editRecyclingPointData = async (data: any) => {
    try {
      if (selectedItem !== null && selectedItem !== undefined) {
        const response = await editRecyclingPoint(
          selectedItem?.siteTypeId,
          data
        );
        if (response) {
          handleOnSubmitData("siteType");
          showSuccessToast(t("notify.SuccessEdited"));
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
          subTitle: t("recycling_point.engineering_land"),
          submitText: t("add_warehouse_page.save"),
          cancelText: t("add_warehouse_page.delete"),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
          onDelete: handleDelete,
          deleteText: t("common.deleteMessage"),
        }}
      >
        <Divider></Divider>
        <RecyclingPointForm
          tChineseName={tChineseName}
          sChineseName={sChineseName}
          englishName={englishName}
          description={description}
          remark={remark}
          trySubmited={trySubmited}
          validation={validation}
          action={action || "add"}
          setTChineseName={setTChineseName}
          setSChineseName={setSChineseName}
          setEnglishName={setEnglishName}
          setDescription={setDescription}
          setRemark={setRemark}
          checkString={checkString}
          t={t}
        />
      </RightOverlayForm>
    </div>
  );
};

export default CreateRecyclingPoint;
