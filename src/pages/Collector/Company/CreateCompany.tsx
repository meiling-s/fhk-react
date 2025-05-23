import { FunctionComponent, useState, useEffect } from "react";
import { Box, Divider, Grid } from "@mui/material";
import RightOverlayForm from "../../../components/RightOverlayForm";
import CustomField from "../../../components/FormComponents/CustomField";
import CustomTextField from "../../../components/FormComponents/CustomTextField";
import { useTranslation } from "react-i18next";
import { FormErrorMsg } from "../../../components/FormComponents/FormErrorMsg";
import { formValidate } from "../../../interfaces/common";
import {
  editCompany,
  createCompany,
} from "../../../APICalls/Collector/company";
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
  Company,
  CreateCompany as CreateCompanyItem,
  UpdateCompany,
} from "../../../interfaces/company";
import { useNavigate } from "react-router-dom";

interface CreateCompany {
  companyType: string;
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  action: "add" | "edit" | "delete" | "none";
  onSubmitData: (type: string, msg: string) => void;
  selectedItem?: Company | null;
  selectedCompanyList?: Company[];
}

interface FormValues {
  [key: string]: string;
}

const CompanyDetail: FunctionComponent<CreateCompany> = ({
  companyType,
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  selectedItem,
  selectedCompanyList = [],
}) => {
  const { t } = useTranslation();
  const initialFormValues = {
    nameTchi: "",
    nameEng: "",
    nameSchi: "",
    brNo: "",
    description: "",
    remark: "",
  };
  const [formData, setFormData] = useState<FormValues>(initialFormValues);
  const [trySubmited, setTrySubmited] = useState<boolean>(false);
  const [validation, setValidation] = useState<formValidate[]>([]);
  const loginName: string =
    localStorage.getItem(localStorgeKeyName.username) ?? "";
  const [prefixItemName, setPrefixItemName] = useState<string>("");
  const [existingCompanyList, setExistingCompanyList] = useState<Company[]>([]);

  const role = localStorgeKeyName.realm;
  const staffField = [
    {
      label: t("common.traditionalChineseName"),
      placeholder: t("common.enterName"),
      field: "nameTchi",
      type: "text",
      id: `astd-company-${selectedItem?.companyType}-form-tc-input-field-9717`,
    },
    {
      label: t("common.simplifiedChineseName"),
      placeholder: t("common.enterName"),
      field: "nameSchi",
      type: "text",
      id: `astd-company-${selectedItem?.companyType}-form-sc-input-field-2809`,
    },
    {
      label: t("common.englishName"),
      placeholder: t("common.enterName"),
      field: "nameEng",
      type: "text",
      id: `astd-company-${selectedItem?.companyType}-form-en-input-field-1442`,
    },
    {
      label: t("companyManagement.brNo"),
      placeholder: t("companyManagement.enterBrNo"),
      field: "brNo",
      type: "text",
      id: `astd-company-${selectedItem?.companyType}-form-brn-input-field-5627`,
    },
    {
      label: t("common.description"),
      placeholder: t("common.enterText"),
      field: "description",
      type: "text",
      id: `astd-company-${selectedItem?.companyType}-form-desc-input-field-8229`,
    },
    {
      label: t("common.remark"),
      placeholder: t("common.enterText"),
      field: "remark",
      type: "text",
      id: `astd-company-${selectedItem?.companyType}-form-remark-input-field-7911`,
    },
  ];
  const navigate = useNavigate();

  const mappingData = () => {
    if (selectedItem != null) {
      setFormData({
        nameTchi: selectedItem.nameTchi,
        nameEng: selectedItem.nameEng,
        nameSchi: selectedItem.nameSchi,
        brNo: selectedItem.brNo,
        description: selectedItem.description,
        remark: selectedItem.remark,
      });
      setExistingCompanyList(
        selectedCompanyList.filter(
          (item) => item.companyId != selectedItem.companyId
        )
      );
    }
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
      setTrySubmited(false);
      setExistingCompanyList(selectedCompanyList);
    }
  }, [drawerOpen]);

  useEffect(() => {
    const prefixName =
      companyType === "manulist"
        ? "manufacturer"
        : companyType && companyType.replace("list", "");
    setPrefixItemName(prefixName);
  }, [companyType]);

  const checkString = (s: string, field: string) => {
    if (trySubmited) {
      let duplicated = s == "";
      switch (field) {
        case "nameTchi":
          if (
            existingCompanyList.some(
              (item) => item.nameTchi.toLowerCase() == s.toLowerCase()
            )
          )
            duplicated = true;
          break;
        case "nameSchi":
          if (
            existingCompanyList.some(
              (item) => item.nameSchi.toLowerCase() == s.toLowerCase()
            )
          )
            duplicated = true;
          break;
        case "nameEng":
          if (
            existingCompanyList.some(
              (item) => item.nameEng.toLowerCase() == s.toLowerCase()
            )
          )
            duplicated = true;
          break;
        default:
          break;
      }
      return duplicated;
    } else {
      return false;
    }
    //return s == "";
  };

  const validate = async () => {
    const tempV: formValidate[] = [];
    const fieldMapping: FormValues = {
      nameTchi: t("common.traditionalChineseName"),
      nameSchi: t("common.simplifiedChineseName"),
      nameEng: t("common.englishName"),
      brNo: t("companyManagement.brNo"),
      description: t("common.description"),
      remark: t("common.remark"),
    };

    const fieldIdMapping: Record<string, string> = {
      nameTchi: "tc-err-warning-4372",
      nameSchi: "sc-err-warning-6316",
      nameEng: "en-err-warning-8979",
      brNo: "brn-err-warning-4976",
      description: "desc-err-warning-9102",
      remark: "remark-err-warning-5854",
    };
    Object.keys(formData).forEach((fieldName) => {
      formData[fieldName as keyof FormValues].trim() === "" &&
        tempV.push({
          field: fieldMapping[fieldName as keyof FormValues],
          problem: formErr.empty,
          type: "error",
          dataTestId: `astd-company-${companyType}-form-${fieldIdMapping[fieldName]}`,
        });
    });
    existingCompanyList.forEach((item) => {
      if (item.nameTchi.toLowerCase() === formData.nameTchi.toLowerCase()) {
        tempV.push({
          field: t("common.traditionalChineseName"),
          problem: formErr.alreadyExist,
          type: "error",
          dataTestId: `astd-company-${item.companyType}-form-tc-err-warning-4372`,
        });
      }
      if (item.nameSchi.toLowerCase() === formData.nameSchi.toLowerCase()) {
        tempV.push({
          field: t("common.simplifiedChineseName"),
          problem: formErr.alreadyExist,
          type: "error",
          dataTestId: `astd-company-${item.companyType}-form-sc-err-warning-6316`,
        });
      }
      if (item.nameEng.toLowerCase() === formData.nameEng.toLowerCase()) {
        tempV.push({
          field: t("common.englishName"),
          problem: formErr.alreadyExist,
          type: "error",
          dataTestId: `astd-company-${item.companyType}-form-en-err-warning-8979`,
        });
      }
    });

    setValidation(tempV);
    return tempV.length === 0;
  };

  useEffect(() => {
    validate();
  }, [
    formData.nameTchi,
    formData.nameEng,
    formData.nameSchi,
    formData.brNo,
    formData.description,
    formData.remark,
  ]);

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    const isValid = await validate();
    if (isValid) {
      const staffData: CreateCompanyItem = {
        nameTchi: formData.nameTchi,
        nameSchi: formData.nameSchi,
        nameEng: formData.nameEng,
        brNo: formData.brNo,
        description: formData.description,
        remark: formData.remark,
        status: "ACTIVE",
        createdBy: loginName,
        updatedBy: loginName,
      };

      if (action === "add") {
        handleCreateCompany(staffData);
      } else {
        handleEditCompany();
      }
    } else {
      setTrySubmited(true);
    }
  };

  const handleCreateCompany = async (staffData: CreateCompanyItem) => {
    try {
      if (validation.length === 0) {
        const data: {
          brNo: string;
          description: string;
          remark: string;
          status: string;
          createdBy: string;
          updatedBy: string;
          [key: string]: string;
        } = {
          brNo: staffData.brNo,
          description: staffData.description,
          remark: staffData.remark,
          status: staffData.status,
          createdBy: staffData.createdBy,
          updatedBy: staffData.updatedBy,
        };
        data[`${prefixItemName}NameTchi`] = staffData.nameTchi;
        data[`${prefixItemName}NameSchi`] = staffData.nameSchi;
        data[`${prefixItemName}NameEng`] = staffData.nameEng;
        const result = await createCompany(companyType, data);
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
      } else {
        setTrySubmited(true);
        if (error?.response?.data?.status === STATUS_CODE[500]) {
          const errorMessage: any = {
            collectorlist: t("common.collectorName"),
            logisticlist: t("common.logisticName"),
            manulist: t("common.manufacturerName"),
            customerlist: t("common.customerName"),
          };
          setValidation([
            {
              field: errorMessage[companyType],
              problem: formErr.alreadyExist,
              type: "error",
            },
          ]);
        } else {
          setValidation([
            {
              field: t("common.saveFailed"),
              problem: "",
              type: "error",
            },
          ]);
        }
        if (error?.response?.data.status === STATUS_CODE[409]) {
          const errorMessage = error.response.data.message;
          if (errorMessage.includes(`[${prefixItemName}NameDuplicate]`)) {
            showErrorToast(handleDuplicateErrorMessage(errorMessage));
          } else {
            showErrorToast(error.response.data.message);
          }
        }
      }
    }
  };

  const handleEditCompany = async () => {
    try {
      const editData = {
        companyId: selectedItem?.companyId || "",
        nameTchi: formData.nameTchi,
        nameSchi: formData.nameSchi,
        nameEng: formData.nameEng,
        brNo: formData.brNo,
        description: formData.description,
        remark: formData.remark,
        status: "ACTIVE",
        createdBy: formData.createdBy,
        updatedBy: loginName,
        version: selectedItem?.version.toString() ?? "0",
      };
      const data: {
        brNo: string;
        description: string;
        remark: string;
        status: string;
        createdBy: string;
        updatedBy: string;
        version: string;
        [key: string]: string;
      } = {
        brNo: editData.brNo,
        description: editData.description,
        remark: editData.remark,
        status: editData.status,
        createdBy: editData.createdBy,
        updatedBy: editData.updatedBy,
        version: editData.version,
      };
      data[`${prefixItemName}NameTchi`] = editData.nameTchi;
      data[`${prefixItemName}NameSchi`] = editData.nameSchi;
      data[`${prefixItemName}NameEng`] = editData.nameEng;
      if (validation.length === 0) {
        if (selectedItem != null) {
          const result = await editCompany(
            companyType,
            selectedItem.companyId,
            data
          );
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
        if (errorMessage.includes(`[${prefixItemName}NameDuplicate]`)) {
          showErrorToast(handleDuplicateErrorMessage(errorMessage));
        } else {
          showErrorToast(error.response.data.message);
        }
      }
    }
  };

  const handleDelete = async () => {
    try {
      const editData = {
        companyId: selectedItem?.companyId || "",
        nameTchi: formData.nameTchi,
        nameSchi: formData.nameSchi,
        nameEng: formData.nameEng,
        brNo: formData.brNo,
        description: formData.description,
        remark: formData.remark,
        status: "DELETED",
        createdBy: formData.createdBy,
        updatedBy: loginName,
        version: selectedItem?.version.toString() ?? "0",
      };
      const data: {
        brNo: string;
        description: string;
        remark: string;
        status: string;
        createdBy: string;
        updatedBy: string;
        version: string;
        [key: string]: string;
      } = {
        brNo: editData.brNo,
        description: editData.description,
        remark: editData.remark,
        status: editData.status,
        createdBy: editData.createdBy,
        updatedBy: editData.updatedBy,
        version: editData.version,
      };
      data[`${prefixItemName}NameTchi`] = editData.nameTchi;
      data[`${prefixItemName}NameSchi`] = editData.nameSchi;
      data[`${prefixItemName}NameEng`] = editData.nameEng;
      if (selectedItem != null) {
        const result = await editCompany(
          companyType,
          selectedItem.companyId,
          data
        );
        if (result) {
          onSubmitData("success", t("common.deletedSuccessfully"));
          resetFormData();
          handleDrawerClose();
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

  const handleDuplicateErrorMessage = (input: string) => {
    const replacements: { [key: string]: string } = {
      "[tchi]": "Traditional Chinese Name",
      "[eng]": "English Name",
      "[schi]": "Simplified Chinese Name",
    };

    // Remove type-specific duplicate tags
    let result = input.replace(
      /\[(collectorNameDuplicate|logisticNameDuplicate|manufacturerNameDuplicate|customerNameDuplicate)\]/,
      ""
    );

    // Find and replace language-specific tags with descriptive text
    const matches = result.match(/\[(tchi|eng|schi)\]/g);

    let formatted = "";

    if (matches) {
      const replaced = matches.map(
        (match) => replacements[match as keyof typeof replacements]
      );

      if (replaced.length === 1) {
        formatted = replaced[0];
      } else if (replaced.length === 2) {
        formatted = replaced.join(" and ");
      } else if (replaced.length === 3) {
        formatted = `${replaced[0]}, ${replaced[1]} and ${replaced[2]}`;
      }
    }

    // Prepend the descriptive text to the result if there are matches
    if (formatted) {
      result = `${formatted} ${result.replace(/\[(tchi|eng|schi)\]/g, "")}`;
    }

    return result.trim();
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
              : selectedItem?.nameTchi,
          subTitle:
            action == "add"
              ? t(`companyManagement.${companyType}`)
              : selectedItem?.companyId,
          submitText: t("common.save"),
          cancelText: t("common.delete"),
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
                    dataTestId={item.id}
                    //value={formData[item.field as keyof FormValues]}
                    defaultValue={formData[item.field as keyof FormValues]}
                    disabled={action === "delete"}
                    placeholder={item.placeholder}
                    onChange={(event) =>
                      handleFieldChange(
                        item.field as keyof FormValues,
                        event.target.value
                      )
                    }
                    error={
                      checkString(
                        formData[item.field as keyof FormValues],
                        item.field
                      ) ||
                      (trySubmited &&
                        validation.some((value) => value.field === item.label))
                    }
                  />
                </CustomField>
              </Grid>
            ))}
            <Grid item sx={{ width: "100%" }}>
              {trySubmited &&
                validation.map((val, index) => (
                  <FormErrorMsg
                    dataTestId={val.dataTestId}
                    key={index}
                    field={t(val.field)}
                    errorMsg={returnErrorMsg(val.problem, t)}
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

export default CompanyDetail;
