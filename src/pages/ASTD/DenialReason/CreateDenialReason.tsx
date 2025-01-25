import { FunctionComponent, useState, useEffect } from "react";
import { Box, Divider, Grid, Autocomplete, TextField } from "@mui/material";
import RightOverlayForm from "../../../components/RightOverlayForm";
import CustomField from "../../../components/FormComponents/CustomField";
import CustomTextField from "../../../components/FormComponents/CustomTextField";
import { useTranslation } from "react-i18next";
import { FormErrorMsg } from "../../../components/FormComponents/FormErrorMsg";
import { formValidate } from "../../../interfaces/common";
import {
  editDenialReason,
  createDenialReason,
} from "../../../APICalls/Collector/denialReason";
import { styles } from "../../../constants/styles";
import { STATUS_CODE, formErr } from "../../../constants/constant";
import {
  extractError,
  returnErrorMsg,
  showErrorToast,
} from "../../../utils/utils";
import {
  DenialReason,
  CreateDenialReason,
  UpdateDenialReason,
} from "../../../interfaces/denialReason";
import { localStorgeKeyName } from "../../../constants/constant";
import {
  getAllFilteredFunction,
  getAllFunction,
} from "../../../APICalls/Collector/userGroup";
import i18n from "../../../setups/i18n";
import { useNavigate } from "react-router-dom";
// import Switcher from '../../../components/FormComponents/CustomSwitch'

interface CreateDenialReasonProps {
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  action: "add" | "edit" | "delete" | "none";
  onSubmitData: (type: string, msg: string) => void;
  selectedItem?: DenialReason | null;
  denialReasonList: DenialReason[];
}

interface FormValues {
  [key: string]: string;
}

const DenialReasonDetail: FunctionComponent<CreateDenialReasonProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  selectedItem,
  denialReasonList = [],
}) => {
  const { t } = useTranslation();

  const initialFormValues = {
    reasonNameTchi: "",
    reasonNameSchi: "",
    reasonNameEng: "",
    functionId: "",
    description: "",
    remark: "",
  };
  // const [status, setStatus] = useState<boolean>(true)
  const [formData, setFormData] = useState<FormValues>(initialFormValues);
  const [selectedFunctionId, setSelectedFunctionId] = useState<string>("");
  const [trySubmited, setTrySubmited] = useState<boolean>(false);
  const [validation, setValidation] = useState<formValidate[]>([]);
  const [version, setVersion] = useState<number>(0);
  const loginName = localStorage.getItem(localStorgeKeyName.username) || "";
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || "";
  const [functionList, setFunctionList] = useState<
    {
      functionId: string;
      functionNameEng: string;
      functionNameSChi: string;
      reasonTchi: string;
      name: string;
    }[]
  >([]);
  const [existingDenialReason, setExistingDenialReason] = useState<
    DenialReason[]
  >([]);
  const navigate = useNavigate();

  const initFunctionList = async () => {
    try {
      const result = await getAllFilteredFunction("astd");
      const data = result?.data;
      if (data.length > 0) {
        let name = "";
        data.map(
          (item: {
            functionId: string;
            functionNameEng: string;
            functionNameSChi: string;
            functionNameTChi: string;
            name: string;
          }) => {
            switch (i18n.language) {
              case "enus":
                name = item.functionNameEng;
                break;
              case "zhch":
                name = item.functionNameSChi;
                break;
              case "zhhk":
                name = item.functionNameTChi;
                break;
              default:
                name = item.functionNameTChi;
                break;
            }
            item.name = name;
          }
        );
      }
      setFunctionList(data);
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };
  const denialReasonField = [
    {
      label: t("denial_reason.reason_name_tchi"),
      placeholder: t("denial_reason.enter_name"),
      field: "reasonNameTchi",
      type: "text",
      mandatory: true,
      dataTestId: "astd-reject-form-tc-input-field-7235",
    },
    {
      label: t("denial_reason.reason_name_schi"),
      placeholder: t("denial_reason.enter_name"),
      field: "reasonNameSchi",
      type: "text",
      mandatory: true,
      dataTestId: "astd-reject-form-sc-input-field-1131",
    },
    {
      label: t("denial_reason.reason_name_eng"),
      placeholder: t("denial_reason.enter_name"),
      field: "reasonNameEng",
      type: "text",
      mandatory: true,
      dataTestId: "astd-reject-form-en-input-field-5444",
    },
    {
      label: t("denial_reason.corresponding_functions"),
      placeholder: t("denial_reason.select_function"),
      field: "functionId",
      type: "autocomplete",
      mandatory: true,
      dataTestId: "astd-reject-form-functions-select-menu-2551",
    },
    // {
    //   label: t('denial_reason.description'),
    //   placeholder: t('denial_reason.enter_text'),
    //   field: 'description',
    //   type: 'text-not-mandatory',
    //   textarea: true,
    // },
    {
      label: t("denial_reason.remark"),
      placeholder: t("denial_reason.enter_text"),
      field: "remark",
      type: "text-not-mandatory",
      textarea: true,
      mandatory: false,
      dataTestId: "astd-reject-form-remark-4898",
    },
    // {
    //   label: t('general_settings.state'),
    //   placeholder: '',
    //   field: 'status',
    //   type: 'boolean',
    //   mandatory: true
    // }
  ];

  useEffect(() => {
    if (drawerOpen) {
      initFunctionList();
    }
  }, [drawerOpen]);

  const mappingData = () => {
    if (selectedItem != null) {
      const selectedValue = functionList.find(
        (el) => el.functionId === selectedItem.functionId
      );
      if (selectedValue) {
        setSelectedFunctionId(selectedValue.name);
      }
      setFormData({
        functionId: selectedValue?.name || "",
        reasonNameTchi: selectedItem.reasonNameTchi,
        reasonNameEng: selectedItem.reasonNameEng,
        reasonNameSchi: selectedItem.reasonNameSchi,
        // description: selectedItem.description,
        remark: selectedItem.remark,
      });
      setVersion(selectedItem.version);
      //setStatus(selectedItem.status === 'ACTIVE' ? true : false)

      setExistingDenialReason(
        denialReasonList.filter(
          (item) => item.reasonId != selectedItem.reasonId
        )
      );
    }
  };

  const resetFormData = () => {
    setFormData(initialFormValues);
    setValidation([]);
    setTrySubmited(false);
    setSelectedFunctionId("");
  };

  useEffect(() => {
    if (action !== "add") {
      mappingData();
    } else {
      resetFormData();
      setExistingDenialReason(denialReasonList);
    }
  }, [functionList, drawerOpen]);

  const checkString = (s: string) => {
    if (!trySubmited) {
      return false;
    }
    return s == "";
  };

  const validationTestId: FormValues = {
    functionId: "astd-reject-form-functions-select-menu-err-warning-2779",
    reasonNameTchi: "astd-reject-form-tc-err-warning-2202",
    reasonNameSchi: "astd-reject-form-sc-err-warning-7800",
    reasonNameEng: "astd-reject-form-en-err-warning-5957",
    description: "astd-reject-form-description-err-warning",
    remark: "astd-reject-form-remark-err-warning",
  };

  const validate = async () => {
    const tempV: formValidate[] = [];
    let excludeFields = ["description", "remark"];
    // if (!status) {
    //   excludeFields.push('functionId')
    // }

    const fieldMapping: FormValues = {
      functionId: t("denial_reason.corresponding_functions"),
      reasonNameTchi: t("denial_reason.reason_name_tchi"),
      reasonNameSchi: t("denial_reason.reason_name_schi"),
      reasonNameEng: t("denial_reason.reason_name_eng"),
      // description: t('denial_reason.description'),
      //remark: t('denial_reason.remark')
    };

    const selectedId = functionList.find(
      (value) => value.functionId === formData.functionId
    );
    const filteredDenialReasons = existingDenialReason.filter(
      (item) =>
        item.functionId === selectedId?.functionId ||
        item.functionId === formData.functionId
    );

    Object.keys(formData).forEach((fieldName) => {
      if (typeof formData[fieldName as keyof FormValues] !== "number") {
        formData[fieldName as keyof FormValues]?.trim() === "" &&
          !excludeFields.includes(fieldName) &&
          tempV.push({
            field: fieldMapping[fieldName as keyof FormValues],
            problem: formErr.empty,
            type: "error",
            dataTestId: validationTestId[fieldName],
          });
      }
    });
    filteredDenialReasons.length > 0 &&
      filteredDenialReasons.forEach((item) => {
        if (
          item.reasonNameTchi.toLowerCase() ===
          formData.reasonNameTchi.toLowerCase()
        ) {
          tempV.push({
            field: t("common.traditionalChineseName"),
            problem: formErr.alreadyExist,
            type: "error",
          });
        }
        if (
          item.reasonNameSchi.toLowerCase() ===
          formData.reasonNameSchi.toLowerCase()
        ) {
          tempV.push({
            field: t("common.simplifiedChineseName"),
            problem: formErr.alreadyExist,
            type: "error",
          });
        }
        if (
          item.reasonNameEng.toLowerCase() ===
          formData.reasonNameEng.toLowerCase()
        ) {
          tempV.push({
            field: t("common.englishName"),
            problem: formErr.alreadyExist,
            type: "error",
          });
        }
      });
    setValidation(tempV);

    return tempV.length === 0;
  };

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    const isValid = await validate();
    console.log(isValid, "isValid");
    if (isValid) {
      const selectedValue = functionList.find(
        (el) => el.name === formData.functionId
      );
      if (selectedValue) {
        formData.functionId = selectedValue.functionId;
      }
      const denialReasonData: CreateDenialReason = {
        tenantId: tenantId.toString(),
        reasonNameTchi: formData.reasonNameTchi,
        reasonNameSchi: formData.reasonNameSchi,
        reasonNameEng: formData.reasonNameEng,
        description: formData.description,
        //functionId: status ? formData.functionId : '0',
        functionId: formData.functionId,
        remark: formData.remark,
        status: "ACTIVE",
        // status: status ? 'ACTIVE' : 'INACTIVE',
        createdBy: loginName,
        updatedBy: loginName,
      };

      if (action == "add") {
        handleCreateDenialReason(denialReasonData);
      } else {
        handleEditDenialReason();
      }
    } else {
      setTrySubmited(true);
    }
  };

  const handleCreateDenialReason = async (
    denialReasonData: CreateDenialReason
  ) => {
    try {
      if (validation.length === 0) {
        const result = await createDenialReason(denialReasonData);
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
        showErrorToast(error.response.data.message);
      }
    }
  };

  const handleEditDenialReason = async () => {
    try {
      const selectedValue = functionList.find(
        (el) => el.name === formData.functionId
      );
      if (selectedValue) {
        formData.functionId = selectedValue.functionId;
      }
      const editData: UpdateDenialReason = {
        reasonNameTchi: formData.reasonNameTchi,
        reasonNameSchi: formData.reasonNameSchi,
        reasonNameEng: formData.reasonNameEng,
        description: "",
        functionId: formData.functionId,
        status: "ACTIVE",
        //status: status ? 'ACTIVE' : 'INACTIVE',
        remark: formData.remark,
        updatedBy: loginName,
        version: version,
      };
      if (validation.length === 0) {
        if (selectedItem != null) {
          const result = await editDenialReason(
            selectedItem.reasonId,
            editData
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
        showErrorToast(error.response.data.message);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const selectedValue = functionList.find(
        (el) => el.name === formData.functionId
      );
      if (selectedValue) {
        formData.functionId = selectedValue.functionId;
      }
      const editData: UpdateDenialReason = {
        reasonNameTchi: formData.reasonNameTchi,
        reasonNameSchi: formData.reasonNameSchi,
        reasonNameEng: formData.reasonNameEng,
        description: formData.description ?? "",
        functionId: formData.functionId,
        status: "DELETED",
        remark: formData.remark,
        updatedBy: loginName,
        version: version,
      };
      if (selectedItem != null) {
        const result = await editDenialReason(selectedItem.reasonId, editData);
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

  return (
    <div>
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
              : selectedItem?.reasonNameTchi,
          subTitle: t("top_menu.denial_reason"),
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
            {denialReasonField.map((item, index) =>
              item.type === "text" ? (
                <Grid item key={index}>
                  <CustomField label={item.label} mandatory={item.mandatory}>
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
                      textarea={item.textarea}
                      multiline={item.textarea}
                      error={checkString(
                        formData[item.field as keyof FormValues]
                      )}
                      dataTestId={item.dataTestId}
                    />
                  </CustomField>
                </Grid>
              ) : item.type == "autocomplete" ? (
                <Grid item key={index}>
                  <CustomField label={item.label} mandatory>
                    <Autocomplete
                      disablePortal
                      id="contractNo"
                      defaultValue={selectedFunctionId}
                      options={functionList.map(
                        (functionItem) => functionItem.name
                      )}
                      onChange={(event, value) => {
                        if (value) {
                          handleFieldChange(
                            item.field as keyof FormValues,
                            value
                          );
                          setSelectedFunctionId(value);
                        }
                      }}
                      value={selectedFunctionId}
                      disabled={action === "delete"}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={item.placeholder}
                          sx={[styles.textField, { width: 320 }]}
                          InputProps={{
                            ...params.InputProps,
                            sx: styles.inputProps,
                          }}
                          error={checkString(selectedFunctionId)}
                        />
                      )}
                      noOptionsText={t("common.noOptions")}
                      data-testid={item.dataTestId}
                    />
                  </CustomField>
                </Grid>
              ) : item.type === "text-not-mandatory" ? (
                <Grid item key={index}>
                  <CustomField label={item.label}>
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
                      textarea={item.textarea}
                      multiline={item.textarea}
                      dataTestId={item.dataTestId}
                    />
                  </CustomField>
                </Grid>
              ) : (
                // item.field == 'status' && item.type == 'boolean' ? (
                //   <Grid item key={index}>
                //     <CustomField label={item.label} mandatory></CustomField>
                //     <Switcher
                //       onText={t('status.active')}
                //       offText={t('status.inactive')}
                //       disabled={action === 'delete'}
                //       defaultValue={status}
                //       setState={(newValue) => {
                //         setStatus(newValue)
                //       }}
                //     />
                //   </Grid>
                // ) :
                <></>
              )
            )}
            <Grid item sx={{ width: "100%" }}>
              {trySubmited &&
                validation.map((val, index) => {
                  return (
                    <FormErrorMsg
                      key={index}
                      field={t(val.field)}
                      errorMsg={returnErrorMsg(val.problem, t)}
                      type={val.type}
                    />
                  );
                })}
            </Grid>
          </Grid>
        </Box>
      </RightOverlayForm>
    </div>
  );
};

export default DenialReasonDetail;
