import React, { FunctionComponent, useState, useEffect } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
} from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
// import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  ADD_ICON,
  EDIT_OUTLINED_ICON,
  DELETE_OUTLINED_ICON,
} from "../../../themes/icons";

import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import StatusLabel from "../../../components/StatusLabel";
import { useTranslation } from "react-i18next";
import { getUserAccountPaging } from "../../../APICalls/userAccount";
import CircularLoading from "../../../components/CircularLoading";
import {
  UserAccount as UserAccountItem,
  ForgetPassUser,
} from "../../../interfaces/userAccount";
import UserAccountDetails from "./UserAccountDetails";
import ApproveRejectForgetPass from "./ApproveRejectForgetPass";
import StatusCard from "../../../components/StatusCard";
import { styles } from "../../../constants/styles";
import { getForgetPasswordRequest } from "../../../APICalls/forgetPassword";
import { extractError } from "../../../utils/utils";
import { STATUS_CODE } from "../../../constants/constant";
import useLocaleTextDataGrid from "../../../hooks/useLocaleTextDataGrid";

type TableRow = {
  id: number;
  [key: string]: any;
};

type recyTypeItem = {
  [key: string]: any;
};

const UserAccount: FunctionComponent = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentLanguage = localStorage.getItem("selectedLanguage") || "zhhk";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [action, setAction] = useState<"add" | "edit" | "delete">("add");
  const [rowId, setRowId] = useState<number>(1);
  const [userAccountItems, setUserAccountItems] = useState<UserAccountItem[]>(
    []
  );
  const [userList, setUserList] = useState<string[]>([]);
  const [staffIdList, setStaffIdList] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] =
    useState<UserAccountItem | null>(null);
  const navigate = useNavigate();
  const [forgetPassList, setForgetPassList] = useState<ForgetPassUser[]>([]);
  const [forgetPassUser, setForgetPassUser] = useState<ForgetPassUser | null>(
    null
  );
  const [approveRejectDrawer, setApproveRejectDrawer] =
    useState<boolean>(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalData, setTotalData] = useState<number>(0);
  const { localeTextDataGrid } = useLocaleTextDataGrid();

  const columns: GridColDef[] = [
    {
      field: "loginId",
      headerName: t("userAccount.loginName"),
      width: 150,
      type: "string",
    },
    {
      field: "staffId",
      headerName: t("userAccount.staffId"),
      width: 150,
      type: "string",
    },
    {
      field: "userGroup",
      headerName: t("userAccount.userGroup"),
      width: 250,
      type: "string",
      valueGetter: (params) => params.row?.userGroup.roleName,
    },
    {
      field: "contactNo",
      headerName: t("userAccount.phone_number"),
      width: 250,
      type: "string",
      valueGetter: (params) => params.row?.contactNo,
    },
    {
      field: "isAdmin",
      headerName: t("userAccount.isAdmin"),
      width: 250,
      type: "string",
      valueGetter: (params) =>
        params.row?.userGroup.isAdmin ? t("common.yes") : t("common.no"),
    },
    {
      field: "status",
      headerName: t("col.status"),
      width: 300,
      type: "string",
      renderCell: (params) => <StatusCard status={params.row?.status} />,
    },
    {
      field: "actions",
      headerName: t("pick_up_order.item.actions"),
      width: 300,
      filterable: false,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <EDIT_OUTLINED_ICON
              fontSize="small"
              data-testid="astd-user-edit-button-6669"
              className="cursor-pointer text-grey-dark mr-2"
              onClick={(event) => {
                event.stopPropagation();
                handleEdit(params.row.loginId);
              }} // Implement your edit logic here
              style={{ cursor: "pointer" }}
            />
            <DELETE_OUTLINED_ICON
              fontSize="small"
              data-testid="astd-user-delete-button-6844"
              className="cursor-pointer text-grey-dark"
              onClick={(event) => {
                event.stopPropagation();
                handleDelete(params.row.loginId);
              }} // Implement your delete logic here
              style={{ cursor: "pointer" }}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [i18n, currentLanguage]);

  const handleOnSubmitData = () => {
    setSelectedAccount(null);
    setDrawerOpen(false);
    fetchDataUserAccount();
  };

  async function fetchDataUserAccount() {
    setIsLoading(true);
    try {
      const result = await getUserAccountPaging(page - 1, pageSize);
      const accountlist: string[] = [];
      const staffIdList: string[] = [];
      if (result?.data) {
        setUserAccountItems(result.data.content);
        result.data.content.map((item: any) => {
          accountlist.push(item.loginId);
          staffIdList.push(item.staffId);
        });
        setUserList(accountlist);
        setStaffIdList(staffIdList);
        setTotalData(result.data.totalPages);
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
    setIsLoading(false);
  }

  async function initForgetPassList() {
    try {
      const result = await getForgetPasswordRequest();
      if (result?.data) {
        setForgetPassList(result?.data);
        console.log("initForgetPassList", result?.data);
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  }

  useEffect(() => {
    // fetchDataUserAccount()
    initForgetPassList();
  }, [action, drawerOpen, currentLanguage, i18n, currentLanguage]);

  useEffect(() => {
    fetchDataUserAccount();
  }, [page]);

  const addDataWarehouse = () => {
    setDrawerOpen(true);
    setAction("add");
  };

  const handleApproveOrReject = () => {
    fetchDataUserAccount();
    initForgetPassList();
  };

  const handleEdit = (rowId: string) => {
    setDrawerOpen(true);
    setAction("edit");
    const selectedItem = userAccountItems.find((item) => item.loginId == rowId);
    if (selectedItem) {
      setSelectedAccount(selectedItem);
    }
  };

  const handleRowClick = (params: GridRowParams) => {
    const row = params.row as TableRow;
    setDrawerOpen(true);
    setAction("edit");
    const selectedItem = userAccountItems.find(
      (item) => item.loginId == row.loginId
    );
    if (selectedItem) {
      setSelectedAccount(selectedItem);
    }
  };

  const handleDelete = (rowId: string) => {
    setDrawerOpen(true);
    setAction("delete");
    const selectedItem = userAccountItems.find((item) => item.loginId == rowId);
    if (selectedItem) {
      setSelectedAccount(selectedItem);
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedAccount(null);
    // fetchData()
    fetchDataUserAccount();
  };

  const handleDrawerForgetPass = () => {
    setApproveRejectDrawer(false);
    //fetchDataUserAccount()
  };

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
    };
  }, []);

  useEffect(() => {
    if (userAccountItems.length === 0 && page > 1 && !selectedAccount) {
      // move backward to previous page once data deleted from last page (no data left on last page)
      setPage((prev) => prev - 1);
    }
  }, [userAccountItems]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: 375, sm: 480, md: "100%" },
      }}
    >
      <div className="user-account">
        <div className="settings-page relative bg-bg-primary w-full overflow-hidden flex flex-row items-start justify-start text-center text-mini text-grey-darker font-tag-chi-medium">
          <div className=" self-stretch flex-1 bg-white flex flex-col items-start justify-start text-smi text-grey-middle font-noto-sans-cjk-tc">
            <div className="self-stretch flex-1 bg-bg-primary flex flex-col items-start justify-start text-3xl text-black font-tag-chi-medium">
              {forgetPassList.length > 0 && (
                <div className="forget-pass-list flex items-center bg-white p-3 border border-solid rounded-lg border-grey-line mt-8 w-full text-left">
                  <ErrorOutlineRoundedIcon
                    className="text-[#79CA25]"
                    fontSize="small"
                  />
                  <div className="text-[#535353] text-smi font-normal mx-1">
                    {t("account")}
                  </div>
                  {forgetPassList.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        className="user-account cursor-pointer flex flex-wrap items-start"
                        style={{ maxWidth: "1280px" }}
                      >
                        {forgetPassList?.map((item, index) => (
                          <p
                            className="text-black text-smi font-bold underline m-0"
                            key={index}
                            onClick={() => {
                              setApproveRejectDrawer(true);
                              setForgetPassUser(item);
                            }}
                            style={{
                              marginBottom: "5px",
                              wordWrap: "break-word",
                            }}
                          >
                            {index > 0 && (
                              <span style={{ marginRight: "5px" }}>,</span>
                            )}
                            {item.loginId}
                          </p>
                        ))}
                      </div>
                    </Box>
                  )}
                  <div className="text-[#535353] text-smi font-normal ml-1 ">
                    {t("userAccount.resetPasswaitApproval")}
                  </div>
                </div>
              )}

              <div
                className={`settings-container self-stretch flex-1 flex flex-col items-start justify-start pt-[30px] pb-[75px] text-mini text-grey-darker ${
                  isMobile
                    ? "overflow-auto whitespace-nowrap w-[375px] mx-4 my-0"
                    : ""
                }`}
              >
                <div className="self-stretch flex flex-col items-start justify-start gap-[12px]">
                  <div className="settings-header self-stretch flex flex-row items-center justify-start gap-[12px] text-base text-grey-dark">
                    <Typography fontSize={16} color="grey" fontWeight="600">
                      {t("userAccount.user")}
                    </Typography>
                    <Button
                      sx={[
                        styles.buttonOutlinedGreen,
                        {
                          width: "max-content",
                          height: "40px",
                        },
                      ]}
                      data-testid="astd-user-new-button-9059"
                      variant="outlined"
                      onClick={() => {
                        addDataWarehouse();
                      }}
                    >
                      <ADD_ICON /> {t("top_menu.add_new")}
                    </Button>
                  </div>
                  <Box pr={4} pt={3} sx={{ flexGrow: 1, width: "100%" }}>
                    {isLoading ? (
                      <CircularLoading />
                    ) : (
                      <Box>
                        {" "}
                        <DataGrid
                          rows={userAccountItems}
                          getRowId={(row) => row.loginId}
                          hideFooter
                          columns={columns}
                          disableRowSelectionOnClick
                          onRowClick={handleRowClick}
                          getRowSpacing={getRowSpacing}
                          localeText={localeTextDataGrid}
                          getRowClassName={(params) =>
                            selectedAccount &&
                            params.id === selectedAccount.loginId
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
              </div>
            </div>
          </div>
          <UserAccountDetails
            drawerOpen={drawerOpen}
            handleDrawerClose={handleDrawerClose}
            selectedItem={selectedAccount}
            action={action}
            onSubmitData={handleOnSubmitData}
            rowId={rowId}
            userList={userList}
            staffIdList={staffIdList}
          />
          <ApproveRejectForgetPass
            drawerOpen={approveRejectDrawer}
            handleDrawerClose={handleDrawerForgetPass}
            selectedItem={forgetPassUser}
            onSubmitData={handleApproveOrReject}
            rowId={rowId}
          ></ApproveRejectForgetPass>
        </div>
      </div>
    </Box>
  );
};

export default UserAccount;
