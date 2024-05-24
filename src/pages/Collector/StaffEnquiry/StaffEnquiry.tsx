import { FunctionComponent, useCallback, useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import UserGroup from "../UserGroup/UserGroup";
import {
  GridColDef,
  GridSortItem,
  GridRenderCellParams,
  GridRowParams,
  GridRowSpacingParams,
  DataGrid,
} from "@mui/x-data-grid";
import { toast, ToastContainer } from "react-toastify";
import { styles } from "../../../constants/styles";
import {
  EDIT_OUTLINED_ICON,
  DELETE_OUTLINED_ICON,
  ADD_ICON,
  SEARCH_ICON,
} from "../../../themes/icons";
import { displayCreatedDate, extractError } from "../../../utils/utils";
import { Staff } from "../../../interfaces/staff";
import { getStaffEnquiryList } from "../../../APICalls/staffEnquiry";
import StaffEnquiryDetail from "./StaffEnquiryDetail";
import { StaffEnquiry as StaffEnquiryProps } from "../../../interfaces/staffEnquiry";
import { useNavigate } from "react-router-dom";
import { STATUS_CODE } from "../../../constants/constant";

function createStaff(
  staffId: string,
  tenantId: string,
  staffNameTchi: string,
  staffNameSchi: string,
  staffNameEng: string,
  titleId: string,
  contractNo: string,
  fullTimeFlg: boolean,
  loginId: string,
  status: string,
  gender: string,
  email: string,
  salutation: string,
  createdBy: string,
  updatedBy: string,
  createdAt: string,
  updatedAt: string
): StaffEnquiryProps {
  return {
    staffId,
    tenantId,
    staffNameTchi,
    staffNameSchi,
    staffNameEng,
    titleId,
    contractNo,
    fullTimeFlg,
    loginId,
    status,
    gender,
    email,
    salutation,
    createdBy,
    updatedBy,
    createdAt,
    updatedAt,
  };
}

const StaffEnquiry: FunctionComponent = () => {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  // const [selectedTab, setSelectedTab] = useState(0)
  // const tabStaff = [t('staffManagement.list'), t('staffManagement.schedule')]
  const [selectedTab, setSelectedTab] = useState(0);
  const tabStaff = [t("staffManagement.list"), t("staffManagement.userGroup")];
  const [staffList, setStaffList] = useState<StaffEnquiryProps[]>([]);
  const [filteredStaff, setFillteredStaff] = useState<StaffEnquiryProps[]>([]);
  const [selectedRow, setSelectedRow] = useState<StaffEnquiryProps | null>(
    null
  );
  const [action, setAction] = useState<"add" | "edit" | "delete">("add");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalData, setTotalData] = useState<number>(0);
  const navigate = useNavigate()
    
  useEffect(() => {
    initStaffList();
  }, [page]);

  const initStaffList = async () => {
    try {
      const result = await getStaffEnquiryList(page - 1, pageSize);
      if (result) {
        const data = result.data.content;
        var staffMapping: StaffEnquiryProps[] = [];
        data.map((item: any) => {
          staffMapping.push(
            createStaff(
              item?.staffId,
              item?.tenantId,
              item?.staffNameTchi,
              item?.staffNameSchi,
              item?.staffNameEng,
              item?.titleId,
              item?.contractNo,
              item?.fullTimeFlg,
              item?.loginId,
              item?.status,
              item?.gender,
              item?.email,
              item?.salutation,
              item?.createdBy,
              item?.updatedBy,
              item?.createdAt,
              item?.updatedAt
            )
          );
        });
        setStaffList(staffMapping);
        setFillteredStaff(staffMapping);
        setTotalData(result.data.totalPages);
      }
    } catch (error) {
      const {state, realm} =  extractError(error);
      if(state.code === STATUS_CODE[503]){
        navigate('/maintenance')
      } else {
        navigate(`/${realm}/error`, {state: state})
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "staffId",
      headerName: t("staffManagement.employeeId"),
      width: 150,
      type: "string",
    },
    {
      field: "staffNameTchi",
      headerName: t("staffManagement.employeeChineseName"),
      width: 200,
      type: "string",
    },
    {
      field: "staffNameEng",
      headerName: "Employee English Name",
      width: 200,
      type: "string",
    },
    {
      field: "titleId",
      headerName: t("staffManagement.position"),
      width: 150,
      type: "string",
    },
    {
      field: "loginId",
      headerName: t("staffManagement.loginName"),
      width: 150,
      type: "string",
    },
    {
      field: "contactNo",
      headerName: t("staffManagement.contactNumber"),
      width: 150,
      type: "string",
    },
    {
      field: "updatedAt",
      headerName: t("staffManagement.lastLogin"),
      width: 200,
      type: "string",
      renderCell: (params) => {
        return displayCreatedDate(params.row.updatedAt);
      },
    },
    {
      field: "edit",
      headerName: "",
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <EDIT_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark mr-2"
              onClick={(event) => {
                const selected = staffList.find(
                  (item) => item.loginId == params.row.loginId
                );
                event.stopPropagation();
                handleAction(params, "edit");
                if (selected) setSelectedRow(selected);
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        );
      },
    },
    {
      field: "delete",
      headerName: "",
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <DELETE_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark"
              onClick={(event) => {
                event.stopPropagation();
                handleAction(params, "delete");
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        );
      },
    },
  ];

  const sortModel: GridSortItem[] = [
    {
      field: "staffId",
      sort: "asc",
    },
  ];

  const handleAction = (
    params: GridRenderCellParams,
    action: "add" | "edit" | "delete"
  ) => {
    setAction(action);

    setSelectedRow(params.row);
    setDrawerOpen(true);
  };

  const handleSelectRow = (params: GridRowParams) => {
    setAction("edit");
    setSelectedRow(params.row);
    setDrawerOpen(true);
  };

  const showErrorToast = (msg: string) => {
    toast.error(msg, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // const handleTabChange = () => {}
  const handleTabChange = (tab: number) => {
    setSelectedTab(tab);
  };

  const showSuccessToast = (msg: string) => {
    toast.info(msg, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const onSubmitData = (type: string, msg: string) => {
    initStaffList();
    if (type == "success") {
      showSuccessToast(msg);
    } else {
      showErrorToast(msg);
    }
  };

  const onChangeSearch = (searchWord: string) => {
    if (searchWord.trim() !== "") {
      const filteredData: StaffEnquiryProps[] = filteredStaff.filter((item) => {
        const lowerCaseSearchWord = searchWord.toLowerCase();
        const lowerCaseStaffId = item.staffId.toLowerCase();
        const staffNameEng = item.staffNameEng.toLowerCase();
        const staffNameTchi = item.staffNameTchi.toLowerCase();

        // Check if staffId starts with the search word
        return (
          lowerCaseStaffId.startsWith(lowerCaseSearchWord) ||
          staffNameEng.startsWith(lowerCaseSearchWord) ||
          staffNameTchi.startsWith(lowerCaseSearchWord)
        );
      });
      setFillteredStaff(filteredData);
    } else {
      setFillteredStaff(staffList);
    }
  };

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
    };
  }, []);

  return (
    <Box className="container-wrapper w-full">
      <div className="settings-page bg-bg-primary">
        <Box>
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t("staffEnquiry.title")}
          </Typography>
        </Box>
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
          {/* <Box>
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t('staffManagement.staff')}
          </Typography>
        </Box>
        <Box>
          <Tabs
            tabs={tabStaff}
            navigate={handleTabChange}
            selectedProp={selectedTab}
            className="lg:px-10 sm:px-4 bg-bg-primary"
          />
        </Box> */}
          {selectedTab === 0 && (
            <>
              <Box
                sx={{
                  marginY: 4,
                }}
              >
                <Button
                  sx={[
                    styles.buttonOutlinedGreen,
                    {
                      width: "max-content",
                      height: "40px",
                    },
                  ]}
                  variant="outlined"
                  onClick={() => {
                    setDrawerOpen(true);
                    setAction("add");
                  }}
                >
                  <ADD_ICON /> {t("staffEnquiry.addNewStaffEnquiry")}
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: "8px", maxWidth: "1460px" }}>
                <TextField
                  id="staffId"
                  onChange={(event) => onChangeSearch(event.target.value)}
                  sx={[localstyles.inputState, { width: "450px" }]}
                  label={t("staffManagement.employeeId")}
                  placeholder={t("staffManagement.enterEmployeeNumber")}
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
                <TextField
                  id="staffName"
                  onChange={(event) => onChangeSearch(event.target.value)}
                  sx={[localstyles.inputState, { width: "450px" }]}
                  label={t("staffManagement.employeeName")}
                  placeholder={t("staffManagement.enterEmployeeName")}
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
              </Box>
              <div className="table-vehicle">
                <Box pr={4} sx={{ flexGrow: 1, maxWidth: "1460px" }}>
                  <DataGrid
                    rows={filteredStaff}
                    getRowId={(row) => row.staffId}
                    hideFooter
                    columns={columns}
                    checkboxSelection
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
                      setPage(newPage);
                    }}
                  />
                </Box>
              </div>
              {/* {selectedRow != null && ( */}
              <StaffEnquiryDetail
                drawerOpen={drawerOpen}
                handleDrawerClose={() => setDrawerOpen(false)}
                action={action}
                selectedItem={selectedRow}
                onSubmitData={onSubmitData}
              />
              {/* )} */}
            </>
          )}
          {selectedTab === 1 && <UserGroup />}
        </Box>
      </div>
    </Box>
  );
};

let localstyles = {
  inputState: {
    mt: 3,
    width: "100%",
    m: 1,
    borderRadius: "10px",
    bgcolor: "white",
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      "& fieldset": {
        borderColor: "#79CA25",
      },
      "&:hover fieldset": {
        borderColor: "#79CA25",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#79CA25",
      },
      "& label.Mui-focused": {
        color: "#79CA25",
      },
    },
  },
};

export default StaffEnquiry;
