import { FunctionComponent, useState, useEffect, useMemo } from "react";
import { Box, Divider, Grid } from "@mui/material";
import RightOverlayForm from "../../../components/RightOverlayForm";
import CustomField from "../../../components/FormComponents/CustomField";
import CustomTextField from "../../../components/FormComponents/CustomTextField";
import { FormErrorMsg } from "../../../components/FormComponents/FormErrorMsg";
import Switcher from "../../../components/FormComponents/CustomSwitch";
import LabelField from "../../../components/FormComponents/CustomField";
import { useTranslation } from "react-i18next";
import { formValidate } from "../../../interfaces/common";
import { STATUS_CODE, formErr } from "../../../constants/constant";
import {
  extractError,
  isEmptyOrWhitespace,
  returnApiToken,
  returnErrorMsg,
} from "../../../utils/utils";
import { localStorgeKeyName } from "../../../constants/constant";

import {
  CreateUserGroupProps,
  DeleteUserGroupProps,
  EditUserGroupProps,
  Functions,
  UserGroup,
} from "../../../interfaces/userGroup";
import FunctionList from "./FunctionList";
import {
  createUserGroup,
  deleteUserGroup,
  editUserGroup,
} from "../../../APICalls/Collector/userGroup";
import { useNavigate } from "react-router-dom";
import i18n from "../../../setups/i18n";

interface Props {
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  action: "add" | "edit" | "delete" | "none";
  onSubmitData: (type: string, msg: string) => void;
  rowId?: number;
  selectedItem?: UserGroup | null;
  functionList: Functions[];
  groupNameList: string[];
}

const CreateUserGroup: FunctionComponent<Props> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  rowId,
  selectedItem,
  functionList,
  groupNameList = [],
}) => {
  const { t } = useTranslation();
  const [trySubmited, setTrySubmited] = useState<boolean>(false);
  const [validation, setValidation] = useState<formValidate[]>([]);
  const [roleName, setRoleName] = useState("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [description, setDescription] = useState("");
  const [groupList, setGroupList] = useState<string[]>([]);
  const [functions, setFunctions] = useState<number[]>([]);
  var realm = localStorage.getItem(localStorgeKeyName.realm) || "collector";
  const role = localStorage.getItem(localStorgeKeyName.role) as string;
  const navigate = useNavigate();

  const mappingData = () => {
    if (selectedItem != null) {
      // setRealm('collector')
      setRoleName(selectedItem.roleName);
      let newFunctions: number[] = [];
      selectedItem.functions.forEach((item) => {
        newFunctions.push(item.functionId);
      });
      setFunctions(newFunctions);
      setIsAdmin(selectedItem.isAdmin);
      setDescription(selectedItem.description);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      const allFunctionIds = functionList.map(
        (item: Functions) => item.functionId
      );
      setFunctions(allFunctionIds);
    } else {
      let prevItem: number[] = [];
      selectedItem?.functions.forEach((item) => {
        prevItem.push(item.functionId);
      });
      setFunctions(prevItem);
    }
  }, [isAdmin, functionList]);

  useEffect(() => {
    setValidation([]);
    setTrySubmited(false);

    if (action !== "add") {
      mappingData();
    } else {
      resetData();
    }

    if (isAdmin) {
      const allFunctionIds = functionList.map(
        (item: Functions) => item.functionId
      );
      setFunctions(allFunctionIds);
    }

    if (selectedItem != null) {
      const temp = groupNameList.filter(
        (item) => item.trim() !== selectedItem.roleName.trim()
      );
      setGroupList(temp);
    } else {
      setGroupList([...groupNameList]);
    }
  }, [drawerOpen]);

  const resetData = () => {
    setRoleName("");
    setFunctions([]);
    setDescription("");
    setValidation([]);
  };

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false;
    }
    return s == "" || isEmptyOrWhitespace(s);
  };

  useEffect(() => {
    const validate = async () => {
      const tempV: formValidate[] = [];

      // Check for empty values
      if (checkString(roleName)) {
        tempV.push({
          field: t("userGroup.groupName"),
          problem: formErr.empty,
          type: "error",
        });
      }

      const isDuplicate = groupList.some(
        (item) => item.trim().toLowerCase() === roleName.trim().toLowerCase()
      );

      if (isDuplicate) {
        tempV.push({
          field: t("userGroup.groupName"),
          problem: formErr.alreadyExist,
          type: "error",
        });
      }

      if (checkString(description)) {
        tempV.push({
          field: t("userGroup.description"),
          problem: formErr.empty,
          type: "error",
        });
      }

      if (functions.length === 0) {
        tempV.push({
          field: t("userGroup.availableFeatures"),
          problem: formErr.empty,
          type: "error",
        });
      }

      setValidation(tempV);
    };

    validate();
  }, [roleName, description, functions, i18n.language]);

  const isUserExisting = () => {
    return (
      groupList.some(
        (item) => item.toLowerCase() == roleName.toLowerCase().trim()
      ) && trySubmited
    );
  };

  const handleSubmit = () => {
    const token = returnApiToken();

    const roleFunctionMap: Record<string, number> = {
      collector: 3, // pickup order
      logistic: 24, // pickup order
      manufacturer: 35, // pickup order
      customer: 62, // purchase order
    };

    const requiredFunctionId = roleFunctionMap[role];
    const updatedFunctions = requiredFunctionId
      ? Array.from(new Set([...functions, requiredFunctionId]))
      : functions;

    if (action === "add") {
      const formData: CreateUserGroupProps = {
        realm: realm,
        tenantId: token.tenantId,
        roleName: roleName.trim(),
        description: description,
        functions: updatedFunctions,
        createdBy: token.loginId,
        status: "ACTIVE",
        isAdmin: isAdmin,
      };
      handleCreateUserGroup(formData);
    } else {
      const formData: EditUserGroupProps = {
        functions: updatedFunctions,
        roleName: roleName.trim(),
        description: description,
        updatedBy: token.loginId,
        status: "ACTIVE",
        isAdmin: isAdmin,
      };
      handleEditUserGroup(formData);
    }
  };

  const handleDuplicateErrorMessage = (input: string) => {
    const replacements: { [key: string]: string } = {
      "[User Group Name]": t("userGroup.groupName"),
    };

    const matches = input.match(/\[(User Group Name)\]/g);

    if (matches) {
      const tempV: formValidate[] = [];
      matches.map((match) => {
        tempV.push({
          field: replacements[match],
          problem: formErr.alreadyExist,
          type: "error",
        });
      });
      setValidation(tempV);
      return tempV.length === 0;
    }

    return [];
  };

  const handleCreateUserGroup = async (formData: CreateUserGroupProps) => {
    try {
      if (validation.length === 0) {
        const result = await createUserGroup(formData);
        if (result) {
          onSubmitData("success", t("notify.successCreated"));
          resetData();
          handleDrawerClose();
        }
      } else {
        setTrySubmited(true);
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else if (state.code === STATUS_CODE[500]) {
        const errorMessage = error.response.data.message;

        if (errorMessage.includes("[RESOURCE_DUPLICATE_ERROR]")) {
          setTrySubmited(true);
          handleDuplicateErrorMessage(errorMessage);
        }
      }
    }
  };

  const handleEditUserGroup = async (formData: EditUserGroupProps) => {
    try {
      if (validation.length === 0) {
        if (selectedItem != null) {
          const result = await editUserGroup(formData, selectedItem.groupId!);
          if (result) {
            onSubmitData("success", t("notify.SuccessEdited"));
            resetData();
            handleDrawerClose();
          } else {
            setTrySubmited(true);
            onSubmitData("error", t("notify.errorEdited"));
          }
        }
      } else {
        setTrySubmited(true);
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else if (state.code === STATUS_CODE[500]) {
        const errorMessage = error.response.data.message;

        if (errorMessage.includes("[RESOURCE_DUPLICATE_ERROR]")) {
          setTrySubmited(true);
          handleDuplicateErrorMessage(errorMessage);
        }
      }
    }
  };

  const handleDelete = async () => {
    const token = returnApiToken();
    const status = "DELETED";
    if (selectedItem != null) {
      const formData: DeleteUserGroupProps = {
        updatedBy: token.loginId,
        status: status,
      };
      const result = await deleteUserGroup(formData, selectedItem.groupId!);
      if (result) {
        if (result == 500) {
          setTrySubmited(true);
          onSubmitData("error", t("userGroup.userAccountUsed"));
        } else {
          onSubmitData("success", t("notify.successDeleted"));
          resetData();
          handleDrawerClose();
        }
      } else {
        setTrySubmited(true);
        onSubmitData("error", t("notify.errorDeleted"));
      }
    }
  };

  return (
    <div className="add-user-group">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={"right"}
        action={action}
        headerProps={{
          title:
            action == "add"
              ? t("top_menu.add_new")
              : action == "edit"
              ? t("userGroup.change")
              : t("userGroup.delete"),
          subTitle: t("userGroup.title"),
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
            <Box sx={{ paddingLeft: "32px" }}>
              <LabelField label={t("userAccount.isAdmin")} />
              <Switcher
                onText={t("common.yes")}
                offText={t("common.no")}
                disabled={action === "delete"}
                defaultValue={isAdmin}
                setState={(newValue) => {
                  setIsAdmin(newValue);
                }}
              />
            </Box>
            <CustomField label={t("userGroup.groupName")} mandatory>
              <CustomTextField
                id="roleName"
                dataTestId="astd-user-group-form-group-name-input-field-9870"
                value={roleName}
                disabled={action === "delete"}
                placeholder={t("userGroup.pleaseEnterName")}
                onChange={(event) => setRoleName(event.target.value)}
                error={
                  checkString(roleName) ||
                  isUserExisting() ||
                  (trySubmited &&
                    validation.some(
                      (value) => value.field === t("userGroup.groupName")
                    ))
                }
              />
            </CustomField>
            <CustomField label={t("userGroup.description")} mandatory>
              <CustomTextField
                id="description"
                dataTestId="astd-user-group-form-available-feature-select-button-9031"
                value={description}
                disabled={action === "delete"}
                placeholder={t("userGroup.pleaseEnterText")}
                onChange={(event) => setDescription(event.target.value)}
                error={checkString(description)}
              />
            </CustomField>
            <CustomField label={t("userGroup.availableFeatures")} mandatory>
              {functionList.map((item: Functions, index) => (
                <FunctionList
                  key={index}
                  keyId={index}
                  item={item}
                  functions={functions}
                  disabled={action === "delete"}
                  readOnly={isAdmin}
                  setFunctions={setFunctions}
                />
              ))}
            </CustomField>
            <Grid item sx={{ width: "100%" }}>
              {trySubmited &&
                validation.map((val, index) => (
                  <FormErrorMsg
                    key={index}
                    field={t(val.field)}
                    errorMsg={returnErrorMsg(val.problem, t)}
                    type={val.type}
                    dataTestId={val.dataTestId}
                  />
                ))}
            </Grid>
          </Grid>
        </Box>
      </RightOverlayForm>
    </div>
  );
};

export default CreateUserGroup;
