import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography,
  Grid,
  Divider,
  Pagination,
  CircularProgress,
  Alert,
  FormControl,
  MenuItem,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
} from "@mui/x-data-grid";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ADD_PERSON_ICON, SEARCH_ICON } from "../../themes/icons";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import {
  createInvitation,
  getAllTenant,
  searchTenantById,
  updateTenantStatus,
  sendEmailInvitation,
  createNewTenant,
  astdUpdateTenantStatus,
} from "../../APICalls/tenantManage";
import {
  STATUS_CODE,
  defaultPath,
  localStorgeKeyName,
} from "../../constants/constant";
import { styles } from "../../constants/styles";
import CircularLoading from "../../components/CircularLoading";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomDatePicker2 from "../../components/FormComponents/CustomDatePicker2";
import CustomField from "../../components/FormComponents/CustomField";
import CustomTextField from "../../components/FormComponents/CustomTextField";
import CustomItemList, {
  il_item,
} from "../../components/FormComponents/CustomItemList";
import TenantDetails from "./TenantDetails";
import { Company, UpdateStatus } from "../../interfaces/tenant";

import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  extractError,
  showErrorToast,
  showSuccessToast,
  validateEmail,
  debounce,
  returnApiToken,
  getFormatId,
  isEmptyOrWhitespace,
} from "../../utils/utils";
import { toast, ToastContainer } from "react-toastify";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import i18n from "../../setups/i18n";
import useLocaleTextDataGrid from "../../hooks/useLocaleTextDataGrid";
import ConfirmModal from "../../components/SpecializeComponents/ConfirmationModal";
import { errorState } from "../../interfaces/common";
import { getReasonTenant } from "src/APICalls/Collector/denialReason";

dayjs.extend(utc);
dayjs.extend(timezone);

function createCompany(
  id: number,
  cName: string,
  sName: string,
  eName: string,
  status: string,
  type: string,
  createDate: string,
  accountNum: number,
  version: number
): Company {
  return {
    id,
    cName,
    sName,
    eName,
    status,
    type,
    createDate,
    accountNum,
    version,
  };
}

type inviteModal = {
  open: boolean;
  onClose: () => void;
  id: string;
  onSendInvitation: (isSend: boolean) => void;
};

const Required = () => {
  return (
    <Typography
      sx={{
        color: "red",
        ml: "5px",
      }}
    >
      *
    </Typography>
  );
};

type rejectModal = {
  tenantId: number;
  version: number;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  reasons: il_item[];
};

function RejectModal({
  tenantId,
  version,
  open,
  onClose,
  onSubmit,
  reasons,
}: rejectModal) {
  const { t } = useTranslation();
  const [rejectReasonId, setRejectReasonId] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleRejectRequest = async () => {
    try {
      const statData: UpdateStatus = {
        status: "REJECTED",
        reasonId: rejectReasonId,
        updatedBy: "admin",
        version: version,
      };

      const operatorId = getFormatId(
        localStorage.getItem(localStorgeKeyName.tenantId) ?? ""
      );

      if (rejectReasonId.length === 0) {
        toast.info(t("tenant.detail.please_enter_the_reason"), {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        const result = await astdUpdateTenantStatus(
          statData,
          operatorId,
          tenantId
        );
        // const data = result?.data
        if (result.status === 200) {
          onSubmit();
          onClose();
        }
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          <Box sx={{ paddingX: 3, paddingTop: 3 }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h3"
              sx={{ fontWeight: "bold" }}
            >
              {`${t("tenant.are_sure_to_reject")} ${getFormatId(
                tenantId.toString()
              )}?`}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ paddingX: 3, paddingTop: 3 }}>
            <Typography sx={localstyles.typo}>
              {t("check_out.reject_reasons")}
            </Typography>
            <CustomItemList items={reasons} multiSelect={setRejectReasonId} />
          </Box>

          <Box sx={{ alignSelf: "center", paddingY: 3 }}>
            <button
              className="primary-btn mr-2 cursor-pointer"
              onClick={() => {
                handleRejectRequest();
              }}
            >
              {t("check_in.confirm")}
            </button>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={() => {
                onClose();
              }}
            >
              {t("check_in.cancel")}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}

interface ModalNotif {
  open?: boolean;
  onClose?: () => void;
  isSend?: boolean;
}

const ModalNotification: React.FC<ModalNotif> = ({
  open = false,
  onClose,
  isSend = false,
}) => {
  const { t } = useTranslation();
  const msgModal = isSend
    ? t("tenant.invite_modal.invite_success")
    : t("tenant.invite_modal.invite_failed");

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          <Box sx={{ paddingX: 3, paddingTop: 3, textAlign: "center" }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h3"
              sx={{ fontWeight: "bold" }}
            >
              {msgModal}
            </Typography>
          </Box>

          <Box sx={{ alignSelf: "center", paddingY: 3 }}>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={onClose}
            >
              {t("check_out.ok")}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

function InviteModal({ open, onClose, id, onSendInvitation }: inviteModal) {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [emailErr, setEmailErr] = useState<boolean>(false);
  const [nextStep, setNextStep] = useState<boolean>(false);

  const sendInvitation = async () => {
    const result = await sendEmailInvitation(
      email,
      id.toString().padStart(6, "0")
    );
    if (result) {
      setNextStep(true);
    }
  };

  const handleCloseInvitationLink = async () => {
    setNextStep(false);
    setEmail("");
    onClose();
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          {!nextStep && (
            <>
              <Box sx={{ paddingX: 3, paddingTop: 3 }}>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: "bold" }}
                >
                  {t("tenant.invite_modal.invite_company")}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ paddingX: 3, paddingBottom: 5 }}>
                <Typography sx={localstyles.typo}>
                  {t("tenant.invite_modal.invite_by_email")}
                  <Required />
                </Typography>
                <TextField
                  fullWidth
                  placeholder={t("tenant.invite_modal.enter_email")}
                  onChange={(event) => {
                    setEmailErr(!validateEmail(email));
                    setEmail(event.target.value);
                  }}
                  error={emailErr}
                  required={true}
                  value={email}
                  InputProps={{
                    sx: styles.textField,
                    endAdornment: (
                      <InputAdornment position="end" sx={{ height: "100%" }}>
                        <Button
                          sx={[
                            styles.buttonOutlinedGreen,
                            {
                              width: "90px",
                              height: "100%",
                            },
                          ]}
                          variant="outlined"
                          onClick={sendInvitation}
                          disabled={emailErr || email === ""}
                        >
                          {t("tenant.invite_modal.send")}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </>
          )}
          {nextStep && (
            <Box
              sx={{
                paddingX: 3,
                paddingBottom: 3,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ marginLeft: "auto", flex: 1, paddingTop: 2 }}>
                <CloseIcon
                  style={{
                    color: "#000",
                  }}
                  className="hover:cursor-pointer"
                  onClick={handleCloseInvitationLink}
                />
              </Box>
              <Typography sx={localstyles.typo}>
                {t("tenant.invite_modal.link_invitation")}
              </Typography>
              <TextField
                fullWidth
                value={
                  defaultPath.tenantRegisterPath +
                  id.toString().padStart(6, "0")
                }
                onChange={(event: { target: { value: any } }) => {
                  //console.log(event.target.value)
                }}
                InputProps={{
                  sx: styles.textField,
                  endAdornment: (
                    <InputAdornment position="end" sx={{ height: "100%" }}>
                      <Button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            defaultPath.tenantRegisterPath +
                              id.toString().padStart(6, "0")
                          )
                        }
                        sx={[
                          styles.buttonOutlinedGreen,
                          {
                            width: "90px",
                            height: "100%",
                          },
                        ]}
                        variant="outlined"
                      >
                        {t("tenant.invite_modal.copy")}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}
        </Stack>
      </Box>
    </Modal>
  );
}

type InviteTenant = {
  tenantId: number;
  companyNumber: string;
  companyCategory: string;
  companyZhName: string;
  companyCnName: string;
  companyEnName: string;
  bussinessNumber: string;
  effFrmDate: string;
  effToDate: string;
  remark: string;
};

type inviteForm = {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmitForm: (formikValues: InviteTenant) => void;
  isDuplicated: boolean;
  isTenantErr: boolean;
  duplicateErrorMessage: string;
  setTenantIdErr: (value: boolean) => void;
  setTrySubmitted: (value: boolean) => void;
  trySubmitted: boolean;
};

function InviteForm({
  open,
  isLoading,
  onClose,
  onSubmitForm,
  isDuplicated,
  isTenantErr,
  duplicateErrorMessage,
  setTenantIdErr,
  setTrySubmitted,
  trySubmitted,
}: inviteForm) {
  const { t } = useTranslation();
  //const [submitable, setSubmitable] = useState<boolean>(false)
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const validateSchema = Yup.object().shape({
    companyCategory: Yup.string().required(
      `${t("tenant.invite_form.company_category")} ${t(
        "purchase_order.create.is_required"
      )}`
    ),
    companyZhName: Yup.string().required(
      `${t("tenant.invite_form.company_zh_name")} ${t(
        "purchase_order.create.is_required"
      )}`
    ),
    companyCnName: Yup.string().required(
      `${t("tenant.invite_form.company_cn_name")} ${t(
        "purchase_order.create.is_required"
      )}`
    ),
    companyEnName: Yup.string().required(
      `${t("tenant.invite_form.company_en_name")} ${t(
        "purchase_order.create.is_required"
      )}`
    ),
    bussinessNumber: Yup.string().required(
      `${t("tenant.invite_form.bussiness_number")} ${t(
        "purchase_order.create.is_required"
      )}`
    ),
    remark: Yup.string().required(
      `${t("tenant.invite_form.remark")} ${t(
        "purchase_order.create.is_required"
      )}`
    ),
    effFrmDate: Yup.mixed()
      .nullable()
      .required(
        `${t("common.start_date_at")} ${t("purchase_order.create.is_required")}`
      )
      .test(
        "is-valid-format",
        `${t("common.start_date_at")} ${t("form.error.isInWrongFormat")}`,
        function (value) {
          if (value === null || value === undefined) return true;
          const date = new Date(value as string);
          return !isNaN(date.getTime());
        }
      )
      .test(
        "is-before-end-date",
        `${t("tenant.invite_modal.err_date")}`,
        function (value) {
          const { effToDate } = this.parent;
          if (!value || !effToDate) return true;
          const startDate = new Date(value as string);
          const endDate = new Date(effToDate as string);
          return startDate <= endDate;
        }
      ),
    effToDate: Yup.mixed()
      .nullable()
      .required(
        `${t("tenant.invite_modal.validaity_to_date")} ${t(
          "purchase_order.create.is_required"
        )}`
      )
      .test(
        "is-valid-format",
        `${t("tenant.invite_modal.validaity_to_date")} ${t(
          "form.error.isInWrongFormat"
        )}`,
        function (value) {
          if (value === null || value === undefined) return true;
          const date = new Date(value as string);
          return !isNaN(date.getTime());
        }
      ),
  });

  const initialValues = {
    tenantId: 0,
    companyNumber: "",
    companyCategory: "collector",
    companyZhName: "",
    companyCnName: "",
    companyEnName: "",
    bussinessNumber: "",
    effFrmDate: new Date().toDateString(),
    effToDate: new Date().toDateString(),
    remark: "",
  };

  const formik = useFormik<InviteTenant>({
    initialValues,
    validationSchema: validateSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmitForm(values);
        // resetForm()
        //onClose && onClose()
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  useEffect(() => {
    if (open) {
      formik.resetForm();
      setTrySubmitted(false);
    }
  }, [open]);

  useEffect(() => {
    if (duplicateErrorMessage !== "") {
      handleDuplicateErrorMessage(duplicateErrorMessage);
    }
  }, [isDuplicated, duplicateErrorMessage]);

  const handleDuplicateErrorMessage = (input: string) => {
    const replacements: { [key: string]: string } = {
      "[tchi]": "companyZhName",
      "[eng]": "companyEnName",
      "[schi]": "companyCnName",
      "[brNo]": "bussinessNumber",
      "[Company Number]": "companyNumber",
    };

    // Adjust regex to correctly match all keys, including "[Company Number]"
    const matches = input.match(/\[(tchi|eng|schi|brNo|Company Number)\]/gi);

    if (matches) {
      matches.forEach((match) => {
        formik.setFieldError(
          replacements[match],
          t("settings_page.recycling.already_exists")
        );
      });
    }
  };

  const TextFields = [
    {
      label: t("tenant.invite_form.company_number"),
      placeholder: t("tenant.invite_form.enter_company_number"),
      id: "companyNumber",
      value: formik.values.companyNumber,
      error: formik.errors.companyNumber && formik.touched.companyNumber,
      mandatory: false,
    },
    {
      label: t("tenant.invite_form.company_category"),
      placeholder: t("tenant.invite_form.enter_company_category"),
      id: "companyCategory",
      value: formik.values.companyCategory,
      error: formik.errors.companyCategory && formik.touched.companyCategory,
      mandatory: true,
      options: [
        {
          key: "collector",
          label: t("tenant.invite_form.collector_company"),
        },
        {
          key: "logistic",
          label: t("tenant.invite_form.logistic_company"),
        },
        {
          key: "manufacturer",
          label: t("tenant.invite_form.manufacturer_company"),
        },
        {
          key: "customer",
          label: t("tenant.invite_form.customer_company"),
        },
      ],
    },
    {
      label: t("tenant.invite_form.company_zh_name"),
      placeholder: t("tenant.invite_form.enter_company_zh_name"),
      id: "companyZhName",
      value: formik.values.companyZhName,
      error: formik.errors.companyZhName && formik.touched.companyZhName,
      mandatory: true,
    },
    {
      label: t("tenant.invite_form.company_cn_name"),
      placeholder: t("tenant.invite_form.enter_company_cn_name"),
      id: "companyCnName",
      value: formik.values.companyCnName,
      error: formik.errors.companyCnName && formik.touched.companyCnName,
      mandatory: true,
    },
    {
      label: t("tenant.invite_form.company_en_name"),
      placeholder: t("tenant.invite_form.enter_company_en_name"),
      id: "companyEnName",
      value: formik.values.companyEnName,
      error: formik.errors.companyEnName && formik.touched.companyEnName,
      mandatory: true,
    },
    {
      label: t("tenant.invite_form.bussiness_number"),
      placeholder: t("tenant.invite_form.enter_bussiness_number"),
      id: "bussinessNumber",
      value: formik.values.bussinessNumber,
      error: formik.errors.bussinessNumber && formik.touched.bussinessNumber,
      mandatory: true,
    },
  ];

  const validateData = () => {
    const errors: Record<string, string> = {};
    const touchedFields: Record<string, boolean> = {}; // Track touched fields

    if (isEmptyOrWhitespace(formik.values.bussinessNumber)) {
      errors.bussinessNumber = t("form.error.shouldNotBeEmpty");
      touchedFields.bussinessNumber = true;
    }
    if (isEmptyOrWhitespace(formik.values.companyCnName)) {
      errors.companyCnName = t("form.error.shouldNotBeEmpty");
      touchedFields.companyCnName = true;
    }
    if (isEmptyOrWhitespace(formik.values.companyEnName)) {
      errors.companyEnName = t("form.error.shouldNotBeEmpty");
      touchedFields.companyEnName = true;
    }
    if (isEmptyOrWhitespace(formik.values.companyZhName)) {
      errors.companyZhName = t("form.error.shouldNotBeEmpty");
      touchedFields.companyZhName = true;
    }
    if (isEmptyOrWhitespace(formik.values.remark)) {
      errors.remark = t("form.error.shouldNotBeEmpty");
      touchedFields.remark = true;
    }

    // Function to parse different date formats correctly
    const parseDate = (dateString: string) => {
      if (!dateString || isEmptyOrWhitespace(dateString)) return null;
      const parsedDate = new Date(dateString);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
    };

    const effFrmDate = parseDate(formik.values.effFrmDate);
    const effToDate = parseDate(formik.values.effToDate);

    if (effFrmDate && effToDate) {
      // Extract year, month, and day for accurate comparison
      const startDate = new Date(
        effFrmDate.getFullYear(),
        effFrmDate.getMonth(),
        effFrmDate.getDate()
      );
      const endDate = new Date(
        effToDate.getFullYear(),
        effToDate.getMonth(),
        effToDate.getDate()
      );

      if (startDate > endDate) {
        errors.effFrmDate = t("tenant.invite_modal.err_date"); // Adjust the error message key
        touchedFields.effFrmDate = true;
      }
    }

    formik.setFormikState((prevState) => ({
      ...prevState,
      errors: errors,
      touched: touchedFields,
    }));

    if (Object.keys(errors).length > 0) {
      setTrySubmitted(true);
    } else {
      formik.handleSubmit();
    }
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setTrySubmitted(false);
    validateData();
  };

  const handleOncloseForm = () => {
    setOpenConfirmModal(true);
    // onClose()
  };

  const checkString = (s: string) => {
    if (!trySubmitted) {
      //before first submit, don't check the validation
      return false;
    }
    return s == "" || isEmptyOrWhitespace(s);
  };

  // const getErrorMessage = () => {
  //   switch (duplicatedErr) {
  //     case "brNo":
  //       return t("tenant.invite_modal.err_duplicated_br_no");
  //     case "companyName":
  //       return t("tenant.invite_modal.err_duplicated_company_name");
  //     case "companyNumber":
  //       return t("tenant.invite_modal.err_duplicated_company_number");
  //     case "tenantId":
  //       return t("tenant.invite_modal.err_duplicated_company_number");
  //     case "illegalTenantId":
  //       return t("tenant.invite_modal.err_illegal_tenant_id");
  //     default:
  //       return t("tenant.invite_modal.err_duplicated_company_number");
  //   }
  // };

  return (
    <form onSubmit={formik.handleSubmit}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
        <Modal
          open={open}
          onClose={handleOncloseForm}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={[
              localstyles.modal,
              {
                height: "90%",
                width: "max-content",
                overflowY: "auto",
              },
            ]}
          >
            <Stack spacing={2}>
              <Box
                sx={{
                  paddingX: 3,
                  paddingTop: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: "bold" }}
                >
                  {t("tenant.invite_modal.invite_company")}
                </Typography>
                <CloseIcon
                  className="text-black cursor-pointer"
                  onClick={onClose}
                />
              </Box>
              <Divider />
              <Box sx={{ paddingX: 3, paddingTop: 3 }}>
                {TextFields.map((t, index) => (
                  <Grid item sx={{ marginBottom: 3 }} key={index}>
                    <CustomField mandatory={t.mandatory} label={t.label}>
                      {t.id === "companyCategory" ? (
                        <Grid item>
                          <FormControl
                            sx={{
                              width: "100%",
                            }}
                          >
                            <Select
                              labelId="userGroup"
                              id="userGroup"
                              value={t.value}
                              sx={{
                                borderRadius: "12px",
                              }}
                              onChange={(event: SelectChangeEvent<string>) => {
                                const selectedValue = t?.options?.find(
                                  (item) => item.key === event.target.value
                                );
                                if (selectedValue) {
                                  formik.setFieldValue(
                                    "companyCategory",
                                    selectedValue.key
                                  );
                                }
                              }}
                            >
                              {t?.options?.map((item, index) => (
                                <MenuItem key={index} value={item.key}>
                                  {item.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      ) : t.id === "companyNumber" ? (
                        <Box>
                          <TextField
                            fullWidth
                            InputProps={{
                              sx: styles.textField,
                            }}
                            placeholder={t.placeholder}
                            onChange={(event) => {
                              const numericValue = event.target.value.replace(
                                /\D/g,
                                ""
                              );
                              formik.setFieldValue(
                                "companyNumber",
                                numericValue
                              );
                              setTenantIdErr(false);
                            }}
                            sx={localstyles.inputState}
                            value={t.value}
                            inputProps={{
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                              maxLength: 6,
                            }}
                            error={t.error || undefined}
                          />
                        </Box>
                      ) : (
                        <CustomTextField
                          id={t.id}
                          placeholder={t.placeholder}
                          rows={4}
                          onChange={formik.handleChange}
                          value={t.value}
                          sx={{ width: "100%" }}
                          error={checkString(t.value) || t.error || undefined}
                        />
                      )}
                    </CustomField>
                  </Grid>
                ))}
                <Grid item display="flex">
                  <CustomDatePicker2
                    pickupOrderForm={true}
                    setDate={(values) => {
                      formik.setFieldValue("effFrmDate", values.startDate);
                      formik.setFieldValue("effToDate", values.endDate);
                    }}
                    defaultStartDate={new Date()}
                    defaultEndDate={new Date()}
                  />
                </Grid>
              </Box>
              <Box sx={{ paddingX: 3 }}>
                <CustomField mandatory label={t("tenant.invite_form.remark")}>
                  <CustomTextField
                    id={"remark"}
                    placeholder={t("tenant.invite_form.enter_remark")}
                    multiline={true}
                    rows={4}
                    onChange={formik.handleChange}
                    value={formik.values.remark}
                    sx={{ width: "100%" }}
                    error={
                      checkString(formik.values.remark) ||
                      (formik.errors?.remark && formik.touched?.remark) ||
                      undefined
                    }
                  ></CustomTextField>
                </CustomField>
                <Stack spacing={2} marginTop={2}>
                  {formik.errors.companyNumber &&
                    formik.touched.companyNumber && (
                      <Alert severity="error">
                        {t("tenant.invite_form.company_number")}{" "}
                        {formik.errors.companyNumber}
                      </Alert>
                    )}
                  {formik.errors.companyCategory &&
                    formik.touched.companyCategory && (
                      <Alert severity="error">
                        {formik.errors.companyCategory}{" "}
                      </Alert>
                    )}

                  {formik.errors.companyZhName &&
                    formik.touched.companyZhName && (
                      <Alert severity="error">
                        {t("tenant.invite_form.company_zh_name")}{" "}
                        {formik.errors.companyZhName}
                      </Alert>
                    )}
                  {formik.errors.companyCnName &&
                    formik.touched.companyCnName && (
                      <Alert severity="error">
                        {t("tenant.invite_form.company_cn_name")}{" "}
                        {formik.errors.companyCnName}{" "}
                      </Alert>
                    )}
                  {formik.errors.companyEnName &&
                    formik.touched.companyEnName && (
                      <Alert severity="error">
                        {t("tenant.invite_form.company_en_name")}{" "}
                        {formik.errors.companyEnName}{" "}
                      </Alert>
                    )}
                  {formik.errors.bussinessNumber &&
                    formik.touched.bussinessNumber && (
                      <Alert severity="error">
                        {t("tenant.invite_form.bussiness_number")}{" "}
                        {formik.errors.bussinessNumber}
                      </Alert>
                    )}
                  {formik.errors.effFrmDate && formik.touched.effFrmDate && (
                    <Alert severity="error">{formik.errors.effFrmDate} </Alert>
                  )}
                  {formik.errors.effToDate && formik.touched.effToDate && (
                    <Alert severity="error">{formik.errors.effToDate} </Alert>
                  )}
                  {formik.errors.remark && formik.touched.remark && (
                    <Alert severity="error">
                      {t("tenant.invite_form.remark")} {formik.errors.remark}{" "}
                    </Alert>
                  )}
                  {/* {isDuplicated && (
                    <Alert severity="error">{getErrorMessage()}</Alert>
                  )} */}
                  {isTenantErr && (
                    <Alert severity="error">
                      {t("tenant.invite_modal.err_companyIdLength")}{" "}
                    </Alert>
                  )}
                </Stack>
              </Box>
              <Box sx={{ alignSelf: "center" }}>
                {isLoading && <CircularProgress color="success" />}
              </Box>
              <Box sx={{ alignSelf: "center", paddingBottom: "16px" }}>
                <Button
                  //disabled={!formik.isValid || isLoading}
                  onClick={handleSubmit}
                  type="submit"
                  // onClick={async () => {
                  //   await onSubmit(formik.values, formik.submitForm)
                  //   formik.resetForm() // Reset the form after the onSubmit function completes
                  // }}
                  sx={[
                    styles.buttonFilledGreen,
                    {
                      mt: 3,
                      color: "white",
                      width: "max-content",
                      height: "40px",
                    },
                  ]}
                >
                  {t("common.submit")}
                </Button>
              </Box>
            </Stack>
            <ConfirmModal
              isOpen={openConfirmModal}
              onConfirm={() => {
                setOpenConfirmModal(false);
                onClose();
              }}
              onCancel={() => setOpenConfirmModal(false)}
            />
          </Box>
        </Modal>
      </LocalizationProvider>
    </form>
  );
}

function CompanyManage() {
  const { t } = useTranslation();

  const [invFormModal, setInvFormModal] = useState<boolean>(false);
  const [invSendModal, setInvSendModal] = useState<boolean>(false);
  const [modalNotification, setModalNotification] = useState<boolean>(false);
  const [successSendInv, setSuccessSendInv] = useState<boolean>(false);
  const [rejectModal, setRejectModal] = useState<boolean>(false);
  const [InviteId, setInviteId] = useState<string>("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filterCompanies, setFilterCompanies] = useState<Company[]>([]);
  const [openDetail, setOpenDetails] = useState<boolean>(false);
  const [selectedTenanId, setSelectedTenantId] = useState(0);
  const [isLoadingInvite, setIsLoadingInvite] = useState<boolean>(false);
  const [rejectedId, setRejectId] = useState(0);
  const [rejectVersion, setRejectVersion] = useState<number>(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalData, setTotalData] = useState<number>(0);
  const { dateFormat } = useContainer(CommonTypeContainer);
  const [duplicatedData, setDuplicatedData] = useState<boolean>(false);
  const [duplicateErrorMessage, setDuplicateErrorMessage] =
    useState<string>("");
  const [tenantIdErr, setTenantIdErr] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reasons, setReasons] = useState<il_item[]>([]);
  const [trySubmitted, setTrySubmitted] = useState<boolean>(false);
  const realmOptions = [
    {
      key: "collector",
      label: t("tenant.invite_form.collector_company"),
    },
    {
      key: "logistic",
      label: t("tenant.invite_form.logistic_company"),
    },
    {
      key: "manufacturer",
      label: t("tenant.invite_form.manufacturer_company"),
    },
    {
      key: "customer",
      label: t("tenant.invite_form.customer_company"),
    },
  ];
  const navigate = useNavigate();
  const { localeTextDataGrid } = useLocaleTextDataGrid();

  const handleApproveTenant = async (tenantId: number, version: number) => {
    try {
      setOpenDetails(false);
      const statData: UpdateStatus = {
        status: "CONFIRMED",
        updatedBy: "admin",
        version: version,
      };

      const result = await updateTenantStatus(statData, tenantId);
      if (result?.status === 200) {
        await createTenantSocif(tenantId);
        showSuccessToast(t("common.approveSuccess"));
        initCompaniesData();
      }
      //  window.location.reload()
      setOpenDetails(false);
    } catch (error) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const getReasonList = async () => {
    const token = returnApiToken();
    const result = await getReasonTenant(0, 100, token.tenantId, 1);
    const data = result?.data;
    if (data) {
      let tempReasons: il_item[] = [];
      data.content.map((item: any) => {
        tempReasons.push({
          id: item.reasonId,
          name:
            i18n.language === "zhhk"
              ? item?.reasonNameTchi
              : i18n.language === "zhch"
              ? item?.reasonNameSchi
              : item?.reasonNameEng,
        });
      });
      setReasons(tempReasons);
    }
  };

  const createTenantSocif = async (tenantId: number) => {
    try {
      const companyData: Company = companies.find(
        (value) => value.id === tenantId
      )!;
      if (companyData === undefined)
        throw new Error("fail to get company data");
      const payload = {
        namec: companyData?.cName,
        names: companyData?.sName,
        namee: companyData?.eName,
        tenantId: `${tenantId.toString().padStart(6, "0")}`,
      };
      await createNewTenant(payload);
    } catch (error) {
      if (window.baseURL.socif !== "") {
        // prevent redirecting to error page on DEV ENV
        const { state } = extractError(error);
        if (state.code === STATUS_CODE[503]) {
          navigate("/maintenance");
        }
      }
    }
  };

  const handleRejectTenant = (tenantId: number, version: number) => {
    setRejectId(tenantId);
    setRejectVersion(version);
    setRejectModal(true);
  };

  const headCells: GridColDef[] = [
    // checkboxColumn,
    {
      field: "id",
      headerName: t("tenant.company_number"),
      type: "string",
      width: 200,
      valueFormatter: (params) => {
        return params.value.toString().padStart(6, "0");
      },
    },
    {
      field: "cName",
      headerName: t("tenant.company_cn_name"),
      width: 150,
      type: "string",
    },
    {
      field: "eName",
      headerName: t("tenant.company_en_name"),
      type: "string",
      width: 150,
    },
    {
      field: "status",
      headerName: t("tenant.status"),
      width: 150,
      type: "string",
      renderCell: (params) => {
        return t(`status.${params.row.status.toLowerCase()}`).toUpperCase();
      },
    },
    {
      field: "type",
      headerName: t("tenant.company_category"),
      width: 150,
      type: "string",
      valueGetter: (params) => {
        return (
          realmOptions.find((item) => item.key === params.row.type)?.label || ""
        );
      },
    },
    {
      field: "createDate",
      headerName: t("tenant.created_date"),
      width: 150,
      type: "string",
      valueGetter: (params) => {
        return dayjs
          .utc(params.row?.createDate)
          .tz("Asia/Hong_Kong")
          .format(`${dateFormat} HH:mm`);
      },
    },
    {
      field: "accountNum",
      headerName: t("tenant.number_of_acc"),
      width: 150,
      type: "string",
    },
    {
      field: "action",
      headerName: t("pick_up_order.item.actions"),
      width: 250,
      type: "string",
      filterable: false,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            {params.row.status === "CREATED" ? (
              <div>
                <Button
                  sx={[
                    styles.buttonFilledGreen,
                    {
                      width: "max-content",
                      height: "40px",
                      marginRight: "8px",
                    },
                  ]}
                  variant="outlined"
                  onClick={(event) => {
                    handleApproveTenant(params.row.id, params.row.version);
                    event.stopPropagation();
                  }}
                >
                  {t("check_out.approve")}
                </Button>
                <Button
                  sx={[
                    styles.buttonOutlinedGreen,
                    {
                      width: "max-content",
                      height: "40px",
                    },
                  ]}
                  variant="outlined"
                  onClick={(event) => {
                    handleRejectTenant(params.row.id, params.row.version);
                    event.stopPropagation(); // Prevent event bubbling
                  }}
                >
                  {t("check_out.reject")}
                </Button>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    initCompaniesData();
    getReasonList();
  }, [page, i18n.language]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mappingTenantData = (data: any) => {
    const tenantList: Company[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.map((com: any) => {
      tenantList.push(
        createCompany(
          com?.tenantId,
          com?.companyNameTchi,
          com?.companyNameSchi,
          com?.companyNameEng,
          com?.status,
          com?.tenantType,
          com?.createdAt,
          com?.decimalPlace || 0,
          com?.version
        )
      );
    });

    return tenantList;
  };

  async function initCompaniesData() {
    setIsLoading(true);
    try {
      const result = await getAllTenant(page - 1, pageSize);
      const data = result?.data.content;
      if (data.length > 0) {
        const tenantList = mappingTenantData(data);
        setCompanies(tenantList);
        setFilterCompanies(tenantList);
      }
      setTotalData(result?.data.totalPages);
    } catch (error) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
    setIsLoading(false);
  }

  const handleFilterCompanies = debounce(async (searchWord: string) => {
    try {
      if (searchWord != "") {
        const tenantId = parseInt(searchWord);
        const result = await searchTenantById(page - 1, pageSize, tenantId);
        const data = result?.data.content;
        if (data?.length > 0) {
          const tenantList = mappingTenantData(data);
          setCompanies(tenantList);
          setFilterCompanies(tenantList);
          setTotalData(result?.data.totalPages);
        }
      } else {
        initCompaniesData();
      }
    } catch (error) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  }, 500);

  const onRejectModal = () => {
    initCompaniesData();
    console.log("onRejectModal", onRejectModal);
    showSuccessToast(t("common.rejectSuccess"));
    setOpenDetails(false);
  };

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
    };
  }, []);

  const handleSelectRow = (params: GridRowParams) => {
    setSelectedTenantId(params.row.id);
    console.log("clicked");
    setOpenDetails(true);
  };

  const handleDrawerClose = () => {
    setSelectedTenantId(0);
    setOpenDetails(false);
  };

  const handleCloseInvite = () => {
    setInvSendModal(false);
    setDuplicatedData(false);
    initCompaniesData();
  };

  const handleSendInvitation = (isSend: boolean) => {
    setInvSendModal(false);
    setModalNotification(true);
    setSuccessSendInv(isSend);
  };

  const onChangeStatus = () => {
    initCompaniesData();
  };

  const onInviteFormSubmit = async (
    formikValues: InviteTenant
    //submitForm: () => void
  ) => {
    if (formikValues.companyNumber && formikValues.companyNumber.length !== 6) {
      setTenantIdErr(true);
      setIsLoadingInvite(false);
      return;
    } else {
      try {
        const token = returnApiToken();
        setTrySubmitted(false);
        setIsLoadingInvite(true);
        const realmType =
          realmOptions.find((item) => item.key == formikValues.companyCategory)
            ?.key || "collector";

        const result = await createInvitation(
          {
            tenantId: parseInt(formikValues.companyNumber),
            companyNameTchi: formikValues.companyZhName,
            companyNameSchi: formikValues.companyCnName,
            companyNameEng: formikValues.companyEnName,
            tenantType: realmType,
            status: "CREATED",
            brNo: formikValues.bussinessNumber,
            remark: formikValues.remark,
            contactNo: "",
            email: "",
            contactName: "",
            decimalPlace: 0,
            monetaryValue: "",
            inventoryMethod: "",
            allowImgSize: 3,
            allowImgNum: 3,
            effFrmDate: dayjs(formikValues.effFrmDate)
              .hour(0)
              .minute(0)
              .second(0)
              .millisecond(0)
              .utc()
              .toISOString(),
            effToDate: dayjs(formikValues.effToDate)
              .hour(23)
              .minute(59)
              .second(59)
              .millisecond(0)
              .toISOString(),
            createdBy: token.loginId,
            updatedBy: token.loginId,
          },
          realmType
        );

        if (result?.data?.tenantId) {
          setInviteId(result?.data?.tenantId);
          setInvSendModal(true);
          setInvFormModal(false);
          setIsLoadingInvite(false);
          setDuplicatedData(false);
          setTenantIdErr(false);
        } else {
          showErrorToast(t("common.saveFailed"));
          setIsLoadingInvite(false);
        }
      } catch (error: any) {
        const { state } = extractError(error);
        if (state.code === STATUS_CODE[503]) {
          navigate("/maintenance");
        } else if (state.code === STATUS_CODE[403]) {
          //showErrorToast(t('common.saveFailed'))
          setDuplicatedData(true);
          setIsLoadingInvite(false);
          setTrySubmitted(true);
        } else if (state.code === STATUS_CODE[409]) {
          const errorMessage = error.response.data.message;
          if (errorMessage.includes("[RESOURCE_DUPLICATE_ERROR]")) {
            setDuplicateErrorMessage(errorMessage);
            setDuplicatedData(true);
            setIsLoadingInvite(false);
            setTrySubmitted(true);
          }
        } else {
          showErrorToast(`${t("common.saveFailed")}`);
          setDuplicatedData(true);
          setTenantIdErr(false);
          setIsLoadingInvite(false);
          setTrySubmitted(true);
        }
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          pr: 4,
        }}
      >
        <ToastContainer></ToastContainer>
        <Typography fontSize={20} color="black" fontWeight="bold">
          {t("tenant.company")}
        </Typography>
        <Button
          sx={[
            styles.buttonOutlinedGreen,
            {
              mt: 3,
              width: "max-content",
              height: "40px",
            },
          ]}
          variant="outlined"
          onClick={() => {
            setInvFormModal(true);
            setDuplicatedData(false);
          }}
        >
          <ADD_PERSON_ICON sx={{ marginX: 1 }} /> {t("tenant.invite")}
        </Button>
        <TextField
          id="searchCompany"
          onChange={(event) => {
            const numericValue = event.target.value.replace(/\D/g, "");
            handleFilterCompanies(numericValue);
          }}
          sx={{
            mt: 3,
            width: "100%",
            bgcolor: "white",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#79CA25",
              },
              "&:hover fieldset": {
                borderColor: "#79CA25",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#79CA25",
              },
            },
          }}
          label={t("tenant.company_number")}
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
            maxLength: 6,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SEARCH_ICON style={{ color: "#79CA25" }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <div className="table-tenant">
          <Box pr={4} pt={3} sx={{ flexGrow: 1, width: "100%" }}>
            {isLoading ? (
              <CircularLoading />
            ) : (
              <Box>
                <DataGrid
                  rows={filterCompanies}
                  getRowId={(row) => row.id}
                  hideFooter
                  columns={headCells}
                  disableRowSelectionOnClick
                  onRowClick={handleSelectRow}
                  getRowSpacing={getRowSpacing}
                  localeText={localeTextDataGrid}
                  getRowClassName={(params) =>
                    selectedTenanId && params.id === selectedTenanId
                      ? "selected-row"
                      : ""
                  }
                  sx={{
                    border: "none",
                    "& .MuiDataGrid-cell": {
                      border: "none",
                    },
                    "& .MuiDataGrid-row": {
                      bgcolor: "white",
                      borderRadius: "10px",
                    },
                    "&>.MuiDataGrid-main": {
                      "&>.MuiDataGrid-columnHeaders": {
                        borderBottom: "none",
                      },
                    },
                    ".MuiDataGrid-columnHeaderTitle": {
                      fontWeight: "bold !important",
                      overflow: "visible !important",
                    },
                    "& .selected-row": {
                      backgroundColor: "#F6FDF2 !important",
                      border: "1px solid #79CA25",
                    },
                  }}
                />
                <Pagination
                  className="mt-4"
                  count={Math.ceil(totalData)}
                  page={page}
                  onChange={(_, newPage) => {
                    setPage(newPage);
                  }}
                />
              </Box>
            )}
          </Box>
        </div>
        <InviteForm
          open={invFormModal}
          isLoading={isLoadingInvite}
          onClose={() => {
            setInvFormModal(false);
            setTenantIdErr(false);
          }}
          onSubmitForm={onInviteFormSubmit}
          isDuplicated={duplicatedData}
          isTenantErr={tenantIdErr}
          setTenantIdErr={setTenantIdErr}
          duplicateErrorMessage={duplicateErrorMessage}
          setTrySubmitted={setTrySubmitted}
          trySubmitted={trySubmitted}
        />

        <InviteModal
          open={invSendModal}
          onClose={handleCloseInvite}
          id={InviteId}
          onSendInvitation={handleSendInvitation}
        />
        <ModalNotification
          open={modalNotification}
          onClose={() => setModalNotification(false)}
          isSend={successSendInv}
        />

        <RejectModal
          tenantId={rejectedId}
          version={rejectVersion}
          open={rejectModal}
          onClose={() => setRejectModal(false)}
          onSubmit={onRejectModal}
          reasons={reasons}
        />
        {selectedTenanId != 0 && (
          <TenantDetails
            drawerOpen={openDetail}
            handleDrawerClose={handleDrawerClose}
            tenantId={selectedTenanId}
            onChangeStatus={onChangeStatus}
          />
        )}
      </Box>
    </>
  );
}

const localstyles = {
  btn_WhiteGreenTheme: {
    borderRadius: "20px",
    borderWidth: 1,
    borderColor: "#79ca25",
    backgroundColor: "white",
    color: "#79ca25",
    fontWeight: "bold",
    "&.MuiButton-root:hover": {
      bgcolor: "#F4F4F4",
      borderColor: "#79ca25",
    },
  },
  table: {
    minWidth: 750,
    borderCollapse: "separate",
    borderSpacing: "0px 10px",
  },
  headerRow: {
    borderRadius: 10,
    mb: 1,
    "th:first-child": {
      borderRadius: "10px 0 0 10px",
    },
    "th:last-child": {
      borderRadius: "0 10px 10px 0",
    },
  },
  row: {
    backgroundColor: "#FBFBFB",
    borderRadius: 10,
    mb: 1,
    "td:first-child": {
      borderRadius: "10px 0 0 10px",
    },
    "td:last-child": {
      borderRadius: "0 10px 10px 0",
    },
  },
  headCell: {
    border: "none",
    fontWeight: "bold",
  },
  bodyCell: {
    border: "none",
  },
  typo: {
    color: "grey",
    fontSize: 14,
    display: "flex",
  },
  textField: {
    borderRadius: "10px",
    fontWeight: "500",
    "& .MuiOutlinedInput-input": {
      padding: "10px",
    },
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: "34%",
    height: "fit-content",
    backgroundColor: "white",
    border: "none",
    borderRadius: 5,
  },
  textArea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    borderColor: "#ACACAC",
    borderRadius: 5,
  },
  formButton: {
    width: "150px",
    borderRadius: 5,
    backgroundColor: "#79CA25",
    color: "white",
    "&.MuiButton-root:hover": {
      backgroundColor: "#7AD123",
    },
  },
  borderRadius: "10px",
  fontWeight: "500",
  "& .MuiOutlinedInput-input": {
    padding: "15px 20px",
    margin: 0,
  },
  inputState: {
    "& .MuiInputLabel-root": {
      color: "#ACACAC",
      /* Add any other custom styles here */
    },
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
};

export default CompanyManage;
