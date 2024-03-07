import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography,
  Grid,
  Divider,
  Pagination
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridCellParams,
} from "@mui/x-data-grid";
import { ADD_PERSON_ICON, SEARCH_ICON } from "../../themes/icons";
import { SyntheticEvent, useEffect, useState } from "react";
import { visuallyHidden } from "@mui/utils";
import React from "react";
import {
  createInvitation,
  getAllTenant,
  updateTenantStatus,
} from "../../APICalls/tenantManage";
import { defaultPath, format } from "../../constants/constant";
import { styles } from "../../constants/styles";
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
import { ErrorMessage, useFormik, validateYupSchema } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import CustomAutoComplete from "../../components/FormComponents/CustomAutoComplete";
import { returnApiToken } from '../../utils/utils';

function createCompany(
  id: number,
  cName: string,
  eName: string,
  status: string,
  type: string,
  createDate: Date,
  accountNum: number
): Company {
  return { id, cName, eName, status, type, createDate, accountNum };
}

type inviteModal = {
  open: boolean;
  onClose: () => void;
  id: string;
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
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

function RejectModal({ tenantId, open, onClose, onSubmit }: rejectModal) {
  const { t } = useTranslation();
  const [rejectReasonId, setRejectReasonId] = useState<string[]>([]);

  const reasons: il_item[] = [
    {
      id: "1",
      name: t("tenant.photo_blury"),
    },
    {
      id: "2",
      name: t("tenant.bussniess_error"),
    },
  ];

  const handleRejectRequest = async () => {
    const statData: UpdateStatus = {
      status: "REJECTED",
      updatedBy: "admin",
    };

    const result = await updateTenantStatus(statData, tenantId);
    const data = result?.data;
    if (data) {
      console.log("reject success success");
      onSubmit();
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
              Are you sure to reject the T0001 application?
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
                onClose();
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

function InviteModal({ open, onClose, id }: inviteModal) {
  const { t } = useTranslation();

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
              component="h2"
              sx={{ fontWeight: "bold" }}
            >
              {t("tenant.invite_modal.invite_company")}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ paddingX: 3 }}>
            <Typography sx={localstyles.typo}>
              {t("tenant.invite_modal.invite_by_email")}
              <Required />
            </Typography>
            <TextField
              fullWidth
              placeholder={t("tenant.invite_modal.enter_email")}
              onChange={(event: { target: { value: any } }) => {
                console.log(event.target.value);
              }}
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
                    >
                      {t("tenant.invite_modal.copy")}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ paddingX: 3, paddingBottom: 3 }}>
            <Typography variant="h6" component="h2" sx={{ marginBottom: 2 }}>
              {t("tenant.invite_modal.or")}
            </Typography>
            <Typography sx={localstyles.typo}>
              {t("tenant.invite_modal.link_invitation")}
            </Typography>
            <TextField
              fullWidth
              value={defaultPath.tenantRegisterPath + id}
              onChange={(event: { target: { value: any } }) => {
                console.log(event.target.value);
              }}
              InputProps={{
                sx: styles.textField,
                endAdornment: (
                  <InputAdornment position="end" sx={{ height: "100%" }}>
                    <Button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          defaultPath.tenantRegisterPath + id
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
  onClose: () => void;
  onSubmit: (formikValues: InviteTenant, submitForm: () => void) => void;
};

function InviteForm({ open, onClose, onSubmit }: inviteForm) {
  const { t } = useTranslation();
  const [submitable, setSubmitable] = useState<boolean>(false);

  const validateSchema = Yup.object().shape({
    companyNumber: Yup.string().required("This companyNumber is required"),
    companyCategory: Yup.string().required("This companyNumber is required"),
  });

  const formik = useFormik<InviteTenant>({
    initialValues: {
      tenantId: 0,
      companyNumber: "",
      companyCategory: "",
      companyZhName: "",
      companyCnName: "",
      companyEnName: "",
      bussinessNumber: "",
      effFrmDate: "",
      effToDate: "",
      remark: "",
    },
    validationSchema: validateSchema,

    onSubmit: (values) => {
      console.log(values);
      onClose && onClose();
    },
  });

  const TextFields = [
    {
      label: t("tenant.invite_form.company_number"),
      placeholder: t("tenant.invite_form.enter_company_number"),
      id: "companyNumber",
      value: formik.values.companyNumber,
      error: formik.errors.companyNumber && formik.touched.companyNumber,
    },
    {
      label: t("tenant.invite_form.company_category"),
      placeholder: t("tenant.invite_form.enter_company_category"),
      id: "companyCategory",
      value: formik.values.companyCategory,
      error: formik.errors.companyCategory && formik.touched.companyCategory,
      options: ["Collector", "Logistic", "Manufacturer", "Customer"],
    },
    {
      label: t("tenant.invite_form.company_zh_name"),
      placeholder: t("tenant.invite_form.enter_company_zh_name"),
      id: "companyZhName",
      value: formik.values.companyZhName,
      error: formik.errors.companyZhName && formik.touched.companyZhName,
    },
    {
      label: t("tenant.invite_form.company_cn_name"),
      placeholder: t("tenant.invite_form.enter_company_cn_name"),
      id: "companyCnName",
      value: formik.values.companyCnName,
      error: formik.errors.companyCnName && formik.touched.companyCnName,
    },
    {
      label: t("tenant.invite_form.company_en_name"),
      placeholder: t("tenant.invite_form.enter_company_en_name"),
      id: "companyEnName",
      value: formik.values.companyEnName,
      error: formik.errors.companyEnName && formik.touched.companyEnName,
    },
    {
      label: t("tenant.invite_form.bussiness_number"),
      placeholder: t("tenant.invite_form.enter_bussiness_number"),
      id: "bussinessNumber",
      value: formik.values.bussinessNumber,
      error: formik.errors.bussinessNumber && formik.touched.bussinessNumber,
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={[
            localstyles.modal,
            {
              height: "90%",
              width: "40%",
              overflowY: "auto",
            },
          ]}
        >
          <Stack spacing={2}>
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
            <Box sx={{ paddingX: 3, paddingTop: 3 }}>
              {TextFields.map((t, index) => (
                <Grid item sx={{ marginBottom: 3 }} key={index}>
                  <CustomField mandatory label={t.label}>
                    {t.id === "companyCategory" ? (
                      <CustomAutoComplete
                        placeholder={t.placeholder}
                        option={t.options?.map((option) => option)}
                        sx={{ width: "100%"}}
                        onChange={(
                          _: SyntheticEvent,
                          newValue: string | null
                        ) => formik.setFieldValue("companyCategory", newValue)}
                        onInputChange={(event: any, newInputValue: string) => {
                          console.log(newInputValue); // Log the input value
                          formik.setFieldValue(
                            "companyCategory",
                            newInputValue
                          ); // Update the formik field value if needed
                        }}
                        value={t.value}
                        inputValue={t.value}
                        error={t.error || undefined}
                      />
                    ) : (
                      <CustomTextField
                        id={t.id}
                        placeholder={t.placeholder}
                        rows={4}
                        onChange={formik.handleChange}
                        value={t.value}
                        sx={{ width: "100%" }}
                        error={t.error || undefined}
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
                    (formik.errors?.remark && formik.touched?.remark) ||
                    undefined
                  }
                ></CustomTextField>
              </CustomField>
            </Box>

            <Box sx={{ alignSelf: "center" }}>
              <Button
                disabled={submitable}
                // onClick={() => onSubmit(formik.handleSubmit)}
                onClick={async () => {
                  await onSubmit(formik.values, formik.submitForm);
                  formik.resetForm(); // Reset the form after the onSubmit function completes
                }}
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
                提交
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
}

function CompanyManage() {
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [invFormModal, setInvFormModal] = useState<boolean>(false);
  const [invSendModal, setInvSendModal] = useState<boolean>(false);
  const [rejectModal, setRejectModal] = useState<boolean>(false);
  const [InviteId, setInviteId] = useState<string>("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filterCompanies, setFilterCompanies] = useState<Company[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [checkedCompanies, setCheckedCompanies] = useState<number[]>([]);
  const [openDetail, setOpenDetails] = useState<boolean>(false);
  const [selectedTenanId, setSelectedTenantId] = useState(0);
  const [rejectedId, setRejectId] = useState(0);
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    const selectedRows = checked ? filterCompanies.map((row) => row.id) : [];
    setCheckedCompanies(selectedRows);
  };

  const handleRowCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    tenantId: number
  ) => {
    setOpenDetails(false);
    const checked = event.target.checked;
    const updatedChecked = checked
      ? [...checkedCompanies, tenantId]
      : checkedCompanies.filter((rowId) => rowId != tenantId);
    setCheckedCompanies(updatedChecked);

    const allRowsChecked = filterCompanies.every((row) =>
      updatedChecked.includes(row.id)
    );
  };

  const handleApproveTenant = async (tenantId: number) => {
    setOpenDetails(false);
    const statData: UpdateStatus = {
      status: "CONFIRMED",
      updatedBy: "admin",
    };

    const result = await updateTenantStatus(statData, tenantId);
    const data = result?.data;
    if (data) {
      console.log("approve success");
      initCompaniesData();
    }
    window.location.reload();
    setOpenDetails(false);
  };

  const handleRejectTenant = (tenantId: number) => {
    setRejectId(tenantId);
    setRejectModal(true);
  };

  const HeaderCheckbox = (
    <Checkbox
      checked={selectAll}
      onChange={handleSelectAll}
      color="primary"
      inputProps={{ "aria-label": "Select all rows" }}
    />
  );

  const checkboxColumn: GridColDef = {
    field: "customCheckbox",
    headerName: "Select",
    width: 80,
    sortable: false,
    filterable: false,
    renderHeader: () => HeaderCheckbox,
    renderCell: (params) => (
      <Checkbox
        checked={selected.includes(params.row.id) || selectAll}
        onChange={(event) => handleRowCheckboxChange(event, params.row.id)}
        color="primary"
      />
    ),
  };

  const headCells: GridColDef[] = [
    checkboxColumn,
    {
      field: "id",
      headerName: t("tenant.company_number"),
      type: "string",
      width: 200,
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
    },
    {
      field: "type",
      headerName: t("tenant.company_category"),
      width: 150,
      type: "string",
    },
    {
      field: "createDate",
      headerName: t("tenant.created_date"),
      width: 150,
      type: "string",
    },
    {
      field: "accountNum",
      headerName: t("tenant.number_of_acc"),
      width: 150,
      type: "string",
    },
    {
      field: "action",
      headerName: "",
      width: 250,
      type: "string",
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
                    handleApproveTenant(params.row.id);
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
                    handleRejectTenant(params.row.id);
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
  }, []);

  async function initCompaniesData() {
    const result = await getAllTenant(page-1, pageSize);
    const data = result?.data.content;
    if (data.length > 0) {
      var coms: Company[] = [];
      data.map((com: any) => {
        coms.push(
          createCompany(
            com?.tenantId,
            com?.companyNameTchi,
            com?.companyNameEng,
            com?.status,
            com?.tenantType,
            new Date(com?.createdAt),
            0
          )
        );
      });
      setCompanies(coms);
      setFilterCompanies(coms);
    }
    setTotalData(result?.data.totalPages)
  }

  const handleFilterCompanies = (searchWord: string) => {
    if (searchWord != "") {
      const filteredCompanies: Company[] = [];
      companies.map((company) => {
        if (
          company.id.toString().includes(searchWord) ||
          company.cName.includes(searchWord) ||
          company.eName.includes(searchWord) ||
          company.status.includes(searchWord) ||
          company.type.includes(searchWord) ||
          dayjs(company.createDate)
            .format(format.dateFormat1)
            .includes(searchWord) ||
          company.accountNum.toString().includes(searchWord)
        ) {
          filteredCompanies.push(company);
        }
      });

      if (filteredCompanies) {
        setFilterCompanies(filteredCompanies);
      }
    } else {
      console.log("searchWord empty, don't filter companies");
      setFilterCompanies(companies);
    }
  };

  const onRejectModal = () => {
    initCompaniesData();
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
    initCompaniesData();
  };

  const onInviteFormSubmit = async (
    formikValues: InviteTenant,
    submitForm: () => void
  ) => {
    const auth = returnApiToken()
    const result = await createInvitation({
      tenantId: parseInt(auth.tenantId),
      companyNameTchi: formikValues.companyZhName,
      companyNameSchi: formikValues.companyCnName,
      companyNameEng: formikValues.companyEnName,
      tenantType: formikValues.companyCategory, // hardcode for temporaray
      status: "CREATED",
      brNo: formikValues.bussinessNumber,
      remark: formikValues.remark,
      contactNo: "",
      email: "",
      contactName: "",
      decimalPlace: 0,
      monetaryValue: "",
      inventoryMethod: "",
      allowImgSize: 0,
      allowImgNum: 0,
      effFrmDate: formikValues.effFrmDate,
      effToDate: formikValues.effToDate,
      createdBy: "admin",
      updatedBy: "admin",
    });

    if (result != null) {
      console.log(result);
      setInviteId(result?.data?.tenantId);
      setInvSendModal(true);
      setInvFormModal(false);
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
          onClick={() => setInvFormModal(true)}
        >
          <ADD_PERSON_ICON sx={{ marginX: 1 }} /> {t("tenant.invite")}
        </Button>
        <TextField
          id="searchCompany"
          onChange={(event) => handleFilterCompanies(event.target.value)}
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
          label={t("tenant.search")}
          placeholder={t("tenant.enter_company_number")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => {}}>
                  <SEARCH_ICON style={{ color: "#79CA25" }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <div className="table-tenant">
          <Box pr={4} pt={3} sx={{ flexGrow: 1, width: "100%" }}>
            <DataGrid
              rows={filterCompanies}
              getRowId={(row) => row.id}
              hideFooter
              columns={headCells}
              checkboxSelection={false}
              disableRowSelectionOnClick
              onRowClick={handleSelectRow}
              getRowSpacing={getRowSpacing}
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
              }}
            />
             <Pagination
              className="mt-4"
              count={Math.ceil(totalData)}
              page={page}
              onChange={(_, newPage) => {
                setPage(newPage)
              }}
            />
          </Box>
        </div>
        <InviteForm
          open={invFormModal}
          onClose={() => setInvFormModal(false)}
          onSubmit={onInviteFormSubmit}
        />

        <InviteModal
          open={invSendModal}
          onClose={handleCloseInvite}
          id={InviteId}
        />

        <RejectModal
          tenantId={rejectedId}
          open={rejectModal}
          onClose={() => setRejectModal(false)}
          onSubmit={onRejectModal}
        />
        {selectedTenanId != 0 && (
          <TenantDetails
            drawerOpen={openDetail}
            handleDrawerClose={handleDrawerClose}
            tenantId={selectedTenanId}
          />
        )}
      </Box>
    </>
  );
}

let localstyles = {
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
};

export default CompanyManage;
