import { FunctionComponent, useState, useEffect } from "react";
import { Box, Divider, Grid } from "@mui/material";
import RightOverlayForm from "../../../components/RightOverlayForm";
import CustomField from "../../../components/FormComponents/CustomField";
import CustomTextField from "../../../components/FormComponents/CustomTextField";
import { useTranslation } from "react-i18next";
import { FormErrorMsg } from "../../../components/FormComponents/FormErrorMsg";
import { formValidate } from "../../../interfaces/common";
import {
  createStaffTitle,
  editStaffTitle,
} from "../../../APICalls/Collector/staffTitle";
import {
  extractError,
  returnErrorMsg,
  showErrorToast,
} from "../../../utils/utils";
import {
  STATUS_CODE,
  formErr,
  localStorgeKeyName,
} from "../../../constants/constant";
import {
  StaffTitle,
  CreateStaffTitle as CreateStaffTitleItem,
  UpdateStaffTitle,
} from "../../../interfaces/staffTitle";
import { useNavigate } from "react-router-dom";

interface CreateStaffTitle {
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  action: "add" | "edit" | "delete" | "none";
  onSubmitData: (type: string, msg: string) => void;
  selectedItem?: StaffTitle | null;
  engNameList: string[];
  schiNameList: string[];
  tchiNameList: string[];
}

interface FormValues {
  [key: string]: string;
}

const StaffTitleDetail: FunctionComponent<CreateStaffTitle> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  selectedItem,
  engNameList = [],
  schiNameList = [],
  tchiNameList = [],
}) => {
  const { t } = useTranslation();

  const initialFormValues = {
    titleNameTchi: "",
    titleNameSchi: "",
    titleNameEng: "",
    duty: "",
    description: "",
    remark: "",
  };
  const [formData, setFormData] = useState<FormValues>(initialFormValues);
  const [trySubmited, setTrySubmited] = useState<boolean>(false);
  const [validation, setValidation] = useState<formValidate[]>([]);
  const loginName = localStorage.getItem(localStorgeKeyName.username) || "";
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || "";
  const [engNameExisting, setEngNameExisting] = useState<string[]>([]);
  const [schiNameExisting, setSchiNameExisting] = useState<string[]>([]);
  const [tchiNameExisting, setTchiNameExisting] = useState<string[]>([]);
  const [version, setVersion] = useState<number>(0);

  const staffField = [
    {
      label: t("common.traditionalChineseName"),
      placeholder: t("common.enterName"),
      field: "titleNameTchi",
      type: "text",
    },
    {
      label: t("common.simplifiedChineseName"),
      placeholder: t("common.enterName"),
      field: "titleNameSchi",
      type: "text",
    },
    {
      label: t("common.englishName"),
      placeholder: t("common.enterName"),
      field: "titleNameEng",
      type: "text",
    },
    {
      label: t("staff_title.duty"),
      placeholder: t("staff_title.enter_duty"),
      field: "duty",
      type: "text",
    },
    {
      label: t("common.description"),
      placeholder: t("common.enterText"),
      field: "description",
      type: "text",
    },
    {
      label: t("common.remark"),
      placeholder: t("common.enterText"),
      field: "remark",
      type: "text",
    },
  ];
  const navigate = useNavigate();

  const mappingData = () => {
    if (selectedItem != null) {
      setFormData({
        titleId: selectedItem.titleId,
        // duty: selectedItem.duty.length > 0 ? selectedItem.duty[0] : '',
        duty: selectedItem.duty.toString(),
        titleNameTchi: sanitizeString(selectedItem.titleNameTchi),
        titleNameEng: sanitizeString(selectedItem.titleNameEng),
        titleNameSchi: sanitizeString(selectedItem.titleNameSchi),
        description: sanitizeString(selectedItem.description),
        remark: sanitizeString(selectedItem.remark),
      });

      setVersion(selectedItem.version ?? 0);
      setEngNameExisting(
        engNameList.filter((item) => item != selectedItem.titleNameEng)
      );
      setSchiNameExisting(
        schiNameList.filter((item) => item != selectedItem.titleNameSchi)
      );
      setTchiNameExisting(
        tchiNameList.filter((item) => item != selectedItem.titleNameTchi)
      );
    }
  };

  const sanitizeString = (str: string) => {
    return str.replace(/\u0000/g, "");
  };

  const resetFormData = () => {
    setFormData(initialFormValues);
    setValidation([]);
    setTrySubmited(false);
  };

  useEffect(() => {
    if (action !== "add") {
      mappingData();
    } else {
      resetFormData();
      setEngNameExisting(engNameList);
      setSchiNameExisting(schiNameList);
      setTchiNameExisting(tchiNameList);
    }
  }, [drawerOpen]);

  const checkString = (s: string, field: string) => {
    if (trySubmited) {
      if (s === "") {
        return true;
      } else {
        return validation.some((val) => val.field === field);
      }
    }
    return false;
  };

  const validate = async () => {
    const tempV: formValidate[] = [];
    const fieldMapping: FormValues = {
      titleNameTchi: t("common.traditionalChineseName"),
      titleNameSchi: t("common.simplifiedChineseName"),
      titleNameEng: t("common.englishName"),
      duty: t("staff_title.duty"),
      description: t("common.description"),
      remark: t("common.remark"),
    };
    Object.keys(formData).forEach((fieldName) => {
      formData[fieldName as keyof FormValues].trim() === "" &&
        tempV.push({
          field: fieldMapping[fieldName as keyof FormValues],
          problem: t("form.error.shouldNotBeEmpty"),
          type: "error",
        });
    });

    setValidation(tempV);
    return tempV.length === 0;
  };

  useEffect(() => {
    validate();
  }, [
    formData.titleNameTchi,
    formData.titleNameEng,
    formData.titleNameSchi,
    formData.duty,
    formData.description,
    formData.remark,
  ]);

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setFormData({
      ...formData,
      [field]: sanitizeString(value),
    });
  };

  const handleSubmit = async () => {
    const isValid = await validate();
    if (isValid) {
      const staffData: CreateStaffTitleItem = {
        tenantId: tenantId.toString(),
        titleNameTchi: formData.titleNameTchi,
        titleNameSchi: formData.titleNameSchi,
        titleNameEng: formData.titleNameEng,
        description: formData.description,
        duty: [formData.duty],
        status: "ACTIVE",
        remark: formData.remark,
        createdBy: loginName,
        updatedBy: loginName,
      };

      if (action === "add") {
        handleCreateStaff(staffData);
      } else {
        handleEditStaff();
      }
    } else {
      setTrySubmited(true);
    }
  };

  const handleCreateStaff = async (staffData: CreateStaffTitleItem) => {
    try {
      validate();
      if (validation.length === 0) {
        const result = await createStaffTitle(staffData);
        if (result?.data) {
          onSubmitData("success", t("common.saveSuccessfully"));
          resetFormData();
          handleDrawerClose();
        } else {
          setTrySubmited(true);
          onSubmitData("error", t("common.saveFailed"));
        }
      } else {
        setTrySubmited(true);
      }
    } catch (error: any) {
      const { state } = extractError(error);

      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else if (state.code === STATUS_CODE[409]) {
        const errorMessage = error.response.data.message;

        if (errorMessage.includes("[RESOURCE_DUPLICATE_ERROR]")) {
          setTrySubmited(true);
          handleDuplicateErrorMessage(errorMessage);
        } else {
          showErrorToast(error.response.data.message);
        }
      }
    }
  };

  const handleEditStaff = async () => {
    try {
      const editData: UpdateStaffTitle = {
        titleId: selectedItem?.titleId || "",
        titleNameTchi: formData.titleNameTchi,
        titleNameSchi: formData.titleNameSchi,
        titleNameEng: formData.titleNameEng,
        description: formData.description,
        duty: [formData.duty],
        status: "ACTIVE",
        remark: formData.remark,
        updatedBy: loginName,
        version: version,
      };
      if (validation.length === 0) {
        if (selectedItem != null) {
          const result = await editStaffTitle(selectedItem.titleId, editData);
          if (result) {
            onSubmitData("success", t("common.editSuccessfully"));
            resetFormData();
            handleDrawerClose();
          }
        }
      } else {
        setTrySubmited(true);
      }
    } catch (error: any) {
      const { state } = extractError(error);

      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else if (state.code === STATUS_CODE[409]) {
        const errorMessage = error.response.data.message;

        if (errorMessage.includes("[RESOURCE_DUPLICATE_ERROR]")) {
          setTrySubmited(true);
          handleDuplicateErrorMessage(errorMessage);
        } else {
          showErrorToast(error.response.data.message);
        }
      }
    }
  };

  const handleDelete = async () => {
    const editData: UpdateStaffTitle = {
      titleId: selectedItem?.titleId || "",
      titleNameTchi: formData.titleNameTchi,
      titleNameSchi: formData.titleNameSchi,
      titleNameEng: formData.titleNameEng,
      description: formData.description,
      duty: [formData.duty],
      status: "DELETED",
      remark: formData.remark,
      updatedBy: loginName,
      version: version,
    };
    if (selectedItem != null) {
      const result = await editStaffTitle(selectedItem.titleId, editData);
      if (result) {
        onSubmitData("success", t("common.deletedSuccessfully"));
        resetFormData();
        handleDrawerClose();
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
      // return matches.map((match) => ({
      //   field: replacements[match],
      //   problem: "already exists", // Customize this message as needed
      //   type: "error",
      // }));
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
              ? t("add_warehouse_page.delete")
              : selectedItem?.titleNameTchi,
          subTitle:
            action == "add"
              ? t("top_menu.staff_positions")
              : selectedItem?.titleId,
          submitText: t("add_warehouse_page.save"),
          cancelText: t("add_warehouse_page.delete"),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
          onDelete: handleDelete,
          deleteText: t("common.deleteMessage"),
        }}
      >
        <Divider></Divider>
        <Box sx={{ PaddingX: 2 }}>
          <Grid
            container
            direction={"column"}
            spacing={4}
            sx={{
              width: { xs: "100%" },
              marginTop: { sm: 2, xs: 6 },
              marginLeft: {
                xs: 0,
              },
              paddingRight: 2,
            }}
            className="sm:ml-0 mt-o w-full"
          >
            {staffField.map((item, index) => (
              <Grid item key={index}>
                <CustomField label={item.label} mandatory>
                  <CustomTextField
                    id={item.label}
                    value={formData[item.field as keyof FormValues]}
                    disabled={action === "delete"}
                    placeholder={item.placeholder}
                    onChange={(event) =>
                      handleFieldChange(
                        item.field as keyof FormValues,
                        event.target.value
                      )
                    }
                    error={checkString(
                      formData[item.field as keyof FormValues],
                      item.label
                    )}
                  />
                </CustomField>
              </Grid>
            ))}
            <Grid item sx={{ width: "100%" }}>
              {trySubmited &&
                validation.map((val, index) => (
                  <FormErrorMsg
                    key={index}
                    field={t(val.field)}
                    errorMsg={val.problem}
                    type={val.type}
                  />
                ))}
            </Grid>
          </Grid>
        </Box>
      </RightOverlayForm>
    </div>
  );
};

export default StaffTitleDetail;
