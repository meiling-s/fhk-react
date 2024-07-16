import { FunctionComponent, useState, useEffect } from "react";
import { Box, Divider, Grid, Autocomplete, TextField } from "@mui/material";
import RightOverlayForm from "../../../components/RightOverlayForm";
import CustomField from "../../../components/FormComponents/CustomField";
import CustomTextField from "../../../components/FormComponents/CustomTextField";
import CustomItemList from "../../../components/FormComponents/CustomItemList";
import { useTranslation } from "react-i18next";
import { FormErrorMsg } from "../../../components/FormComponents/FormErrorMsg";
import { formValidate } from "../../../interfaces/common";
import { getLoginIdList, getStaffTitle } from "../../../APICalls/staff";

import { styles } from "../../../constants/styles";

import { formErr } from "../../../constants/constant";
import { returnErrorMsg } from "../../../utils/utils";
import { il_item } from "../../../components/FormComponents/CustomItemList";
import { Staff, CreateStaff, EditStaff } from "../../../interfaces/staff";

import { localStorgeKeyName } from "../../../constants/constant";
import {
  createStaffEnquiry,
  deleteStaffEnquiry,
  editStaffEnquiry,
} from "../../../APICalls/staffEnquiry";
import {
  CreateStaffEnquiry,
  DeleteStaffEnquiry,
  EditStaffEnquiry,
  StaffEnquiry,
} from "../../../interfaces/staffEnquiry";

interface CreateVehicleProps {
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  action: "add" | "edit" | "delete" | "none";
  onSubmitData: (type: string, msg: string) => void;
  selectedItem?: StaffEnquiry | null;
}

interface FormValues {
  [key: string]: string;
}

const StaffEnquiryDetail: FunctionComponent<CreateVehicleProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  selectedItem,
}) => {
  const { t } = useTranslation();

  const initialFormValues = {
    loginId: "",
    staffNameTchi: "",
    staffNameEng: "",
    staffNameSchi: "",
    // tenantId: "",
    contractNo: "",
    fullTimeFlg: "",
    email: "",
    titleId: "",
    gender: "",
  };
  const [formData, setFormData] = useState<FormValues>(initialFormValues);
  const [loginIdList, setLoginIdList] = useState<il_item[]>([]);
  const [selectedLoginId, setSelectedLoginId] = useState<string>("");
  const [staffTitleList, setStaffTitleList] = useState<il_item[]>([]);
  const [trySubmited, setTrySubmited] = useState<boolean>(false);
  const [validation, setValidation] = useState<formValidate[]>([]);
  const loginName = localStorage.getItem(localStorgeKeyName.username) || "";
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || "";

  const staffField = [
    {
      label: t("staffManagement.loginName"),
      placeholder: t("staffManagement.enterName"),
      field: "loginId",
      type: "text",
    },
    {
      label: t("staffManagement.employeeChineseName"),
      placeholder: t("staffManagement.enterName"),
      field: "staffNameTchi",
      type: "text",
    },
    {
      label: t("staffManagement.employeeChineseCn"),
      placeholder: t("staffManagement.enterName"),
      field: "staffNameSchi",
      type: "text",
    },
    {
      label: "Staff English Name",
      placeholder: t("staffManagement.enterName"),
      field: "staffNameEng",
      type: "text",
    },
    {
      label: t("staffManagement.position"),
      placeholder: "",
      field: "titleId",
      type: "option",
    },
    {
      label: t("staffEnquiry.contractNo"),
      placeholder: t("staffEnquiry.enterContractNo"),
      field: "contractNo",
      type: "text",
    },
    {
      label: t("staffEnquiry.gender"),
      placeholder: t("staffEnquiry.enterGender"),
      field: "gender",
      type: "autocomplete",
    },
    {
      label: t("staffManagement.email"),
      placeholder: t("staffManagement.enterEmail"),
      field: "email",
      type: "text",
    },
    {
      label: t("staffEnquiry.fulltimeFlag"),
      placeholder: t("staffEnquiry.enterFulltimeFlag"),
      field: "fullTimeFlg",
      type: "autocomplete",
    },
  ];

  useEffect(() => {
    initLoginIdList();
    initStaffTitle();
    resetFormData()
  }, [drawerOpen]);

  const initLoginIdList = async () => {
    const result = await getLoginIdList();
    if (result) {
      const data = result.data;
      var loginIdMapping: il_item[] = [];
      data.forEach((item: any) => {
        loginIdMapping.push({
          id: item.loginId,
          name: item.loginId,
        });
      });
      setLoginIdList(loginIdMapping);
    }
  };

  const initStaffTitle = async () => {
    const result = await getStaffTitle();
    if (result) {
      const data = result.data.content;
      var staffTitle: il_item[] = [];
      data.forEach((item: any) => {
        staffTitle.push({
          id: item.titleId,
          name: item.titleNameTchi,
        });
      });
      setStaffTitleList(staffTitle);
    }
  };

  const mappingData = () => {
    console.log("selectedItem", selectedItem);
    if (selectedItem != null) {
      setFormData({
        loginId: selectedItem.loginId,
        staffNameTchi: selectedItem.staffNameTchi,
        staffNameEng: selectedItem.staffNameEng,
        staffNameSchi: selectedItem.staffNameSchi,
        contractNo: selectedItem.contractNo,
        email: selectedItem.email,
        titleId: selectedItem.titleId,
        fullTimeFlg: selectedItem.fullTimeFlg ? "true" : "false",
      });
      setSelectedLoginId(selectedItem.loginId);
    }
  };

  const resetFormData = () => {
    setFormData(initialFormValues);
    setValidation([]);
    setTrySubmited(false);
    setSelectedLoginId("");
  };

  useEffect(() => {
    if (action !== "add") {
      mappingData();
    } else {
      resetFormData();
    }
  }, [drawerOpen]);

  const checkString = (s: string) => {
    if (!trySubmited) {
      return false;
    }
    return s == "";
  };

  const validate = async () => {
    const tempV: formValidate[] = [];
    const fieldMapping: FormValues = {
      loginId: t("staffManagement.loginName"),
      staffNameTchi: t("staffManagement.employeeChineseName"),
      staffNameSchi: t("staffManagement.employeeChineseName"),
      staffNameEng: "Staff English Name",
      titleId: t("staffManagement.position"),
      contactNo: t("staffManagement.contactNumber"),
      email: t("staffManagement.email"),
      contractNo: t("staffManagement.email"),
      gender: t("staffManagement.email"),
      fullTimeFlg: t("staffManagement.email"),
    };
    Object.keys(formData).forEach((fieldName) => {
      formData[fieldName as keyof FormValues].trim() === "" &&
        tempV.push({
          field: fieldMapping[fieldName as keyof FormValues],
          problem: formErr.empty,
          type: "error",
        });
    });
    setValidation(tempV);
  };

  useEffect(() => {
    validate();
  }, [
    formData.loginId,
    formData.staffNameTchi,
    formData.staffNameEng,
    formData.staffNameSchi,
    formData.contactNo,
    formData.email,
    formData.titleId,
  ]);

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    const staffData: CreateStaffEnquiry = {
      tenantId: tenantId.toString(),
      staffNameTchi: formData.staffNameTchi,
      staffNameSchi: formData.staffNameSchi,
      staffNameEng: formData.staffNameEng,
      titleId: formData.titleId,
      loginId: formData.loginId,
      contractNo: formData.contractNo,
      status: "ACTIVE",
      gender: "M",
      email: formData.email,
      fullTimeFlg: true,
      salutation: "salutation",
      createdBy: loginName,
      updatedBy: loginName,
    };

    if (action == "add") {
      handleCreateStaff(staffData);
    } else {
      handleEditStaff();
    }
  };

  const handleCreateStaff = async (staffData: CreateStaffEnquiry) => {
    validate();
    console.log("validation", validation)
    if (validation.length === 0) {
      const result = await createStaffEnquiry(staffData);
      if (result?.data) {
        onSubmitData("success", "Success created data");
        resetFormData();
        handleDrawerClose();
      } else {
        setTrySubmited(true);
        onSubmitData("error", "Failed created data");
      }
    } else {
      setTrySubmited(true);
    }
  };

  const handleEditStaff = async () => {
    const editData: EditStaffEnquiry = {
      staffNameTchi: formData.staffNameTchi,
      staffNameSchi: formData.staffNameSchi,
      staffNameEng: formData.staffNameEng,
      titleId: formData.titleId,
      loginId: formData.loginId,
      tenantId: tenantId.toString(),
      contractNo: formData.contractNo,
      fullTimeFlg: true,
      status: "ACTIVE",
      gender: "M",
      email: formData.email,
      salutation: "salutation",
      updatedBy: loginName,
      createdBy: loginName,
    };
    if (validation.length == 0) {
      if (selectedItem != null) {
        const result = await editStaffEnquiry(editData, selectedItem.staffId);
        if (result) {
          onSubmitData("success", "Edit data success");
          resetFormData();
          handleDrawerClose();
        }
      }
    } else {
      setTrySubmited(true);
    }
  };

  const handleDelete = async () => {
    const editData: DeleteStaffEnquiry = {
      status: "DELETED",
      updatedBy: loginName,
    };
    if (selectedItem != null) {
      const result = await deleteStaffEnquiry(editData, selectedItem.staffId);
      if (result) {
        onSubmitData("success", "Deleted data success");
        resetFormData();
        handleDrawerClose();
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
              ? t("add_warehouse_page.delete")
              : selectedItem?.staffNameTchi,
          subTitle:
            action == "add" ? t("staffEnquiry.title") : selectedItem?.staffId,
          submitText: t("add_warehouse_page.save"),
          cancelText: t("add_warehouse_page.delete"),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
          onDelete: handleDelete,
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
            {staffField.map((item, index) =>
              item.type == "text" ? (
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
                        formData[item.field as keyof FormValues]
                      )}
                    />
                  </CustomField>
                </Grid>
              ) : item.type == "autocomplete" ? (
                <CustomField label={item.label} mandatory>
                  {action === "add" ? (
                    <Autocomplete
                      disablePortal
                      id={
                        item.field === "fullTimeFlg" ? "fullTimeFlg" : "gender"
                      }
                      defaultValue={selectedLoginId}
                      options={
                        item.field === "fullTimeFlg"
                          ? ["true", "false"]
                          : ["Male", "Female"]
                      }
                      onChange={(event, value) => {
                        if (value) {
                          handleFieldChange(
                            item.field as keyof FormValues,
                            value
                          );
                          setSelectedLoginId(value);
                        }
                      }}
                      value={formData[item.field as keyof FormValues]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={item.placeholder}
                          sx={[styles.textField, { width: 320 }]}
                          InputProps={{
                            ...params.InputProps,
                            sx: styles.inputProps,
                          }}
                          disabled={action != "add"}
                          error={checkString(
                            formData[item.field as keyof FormValues]
                          )}
                        />
                      )}
                      noOptionsText={t('common.noOptions')}
                    />
                  ) : (
                    <TextField
                      placeholder={item.placeholder}
                      sx={[styles.textField, { width: 320 }]}
                      InputProps={{
                        readOnly: true,
                        sx: styles.inputProps,
                      }}
                      disabled={true}
                      value={selectedLoginId}
                    />
                  )}
                </CustomField>
              ) : (
                <CustomField label={t("staffManagement.position")} mandatory>
                  {action !== "delete" ? (
                    <CustomItemList
                      items={staffTitleList || []}
                      singleSelect={(values) => {
                        handleFieldChange(
                          item.field as keyof FormValues,
                          values
                        );
                      }}
                      value={formData[item.field as keyof FormValues]}
                      defaultSelected={selectedItem?.titleId}
                    />
                  ) : (
                    <TextField
                      placeholder={item.placeholder}
                      sx={[styles.textField, { width: 320 }]}
                      InputProps={{
                        readOnly: true,
                        sx: styles.inputProps,
                      }}
                      disabled={true}
                      value={selectedLoginId}
                    />
                  )}
                </CustomField>
              )
            )}
            <Grid item sx={{ width: "100%" }}>
              {trySubmited &&
                validation.map((val, index) => (
                  <FormErrorMsg
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

export default StaffEnquiryDetail;
