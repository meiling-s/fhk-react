import { useEffect, useState, FunctionComponent, useCallback } from "react";
import { Box, Button, Typography, Pagination } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  ADD_ICON,
  EDIT_OUTLINED_ICON,
  DELETE_OUTLINED_ICON,
} from "../../../themes/icons";

import { styles } from "../../../constants/styles";
import CreateUserGroup from "./CreateUserGroup";
import {
  UserGroup as UserGroupItem,
  CreateUserGroupProps as UserGroupForm,
  Functions,
} from "../../../interfaces/userGroup";
import { ToastContainer, toast } from "react-toastify";
import CircularLoading from "../../../components/CircularLoading";
import { useTranslation } from "react-i18next";
import {
  getAllFunction,
  getAllUserGroup,
} from "../../../APICalls/Collector/userGroup";
import { STATUS_CODE, localStorgeKeyName } from "../../../constants/constant";
import i18n from "../../../setups/i18n";
import { extractError } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
import useLocaleTextDataGrid from "../../../hooks/useLocaleTextDataGrid";

type TableRow = {
  id: number;
  [key: string]: any;
};

function createUserGroup(
  groupId: number,
  tenantId: string,
  roleName: string,
  description: string,
  status: string,
  createdBy: string,
  createdAt: string,
  updatedBy: string,
  updatedAt: string,
  userAccount: object[],
  functions: Functions[],
  isAdmin: boolean
): UserGroupItem {
  return {
    groupId,
    tenantId,
    roleName,
    description,
    status,
    createdBy,
    createdAt,
    updatedBy,
    updatedAt,
    userAccount,
    functions,
    isAdmin,
  };
}

const UserGroup: FunctionComponent = () => {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userGroupList, setUserGroupList] = useState<UserGroupItem[]>([]);
  const [selectedRow, setSelectedRow] = useState<UserGroupItem | null>(null);
  const [action, setAction] = useState<"add" | "edit" | "delete">("add");
  const [rowId, setRowId] = useState<number>(1);
  const [functionList, setFunctionList] = useState<Functions[]>([]);
  const [groupNameList, setGroupNameList] = useState<string[]>([]);
  const role = localStorage.getItem(localStorgeKeyName.role) as string;
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalData, setTotalData] = useState<number>(0);
  const { localeTextDataGrid } = useLocaleTextDataGrid();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    initFunctionList();
    initUserGroupList();
    initAllUserGroupList();
  }, [page]);

  const initFunctionList = async () => {
    try {
      const result = await getAllFunction();
      const data = result?.data.filter((item: any) => {
        const isRoleMatch = item.tenantTypeId === role;

        // Exclude "Pickup order" if role is logistic, collector, or manufacturer
        const shouldExcludePickup =
          ["logistic", "collector", "manufacturer"].includes(role) &&
          item.functionNameEng === "Pickup order";

        // Exclude "Purchase order" if role is customer
        const shouldExcludePurchase =
          role === "customer" && item.functionNameEng === "Purchase order";

        return isRoleMatch && !shouldExcludePickup && !shouldExcludePurchase;
      });

      setFunctionList(data);
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const initUserGroupList = async () => {
    setIsLoading(true);
    try {
      const result = await getAllUserGroup(page - 1, pageSize);
      const data = result?.data;
      let tempGroupList: string[] = [];
      if (data) {
        let userGroupMapping: UserGroupItem[] = [];
        data.content.map((item: any) => {
          userGroupMapping.push(
            createUserGroup(
              item?.groupId,
              item?.tenantId,
              item?.roleName,
              item?.description,
              item?.status,
              item?.createdBy,
              item?.createdAt,
              item?.updatedBy,
              item?.updatedAt,
              item?.userAccount,
              item?.functions,
              item?.isAdmin
            )
          );

          tempGroupList.push(item?.roleName);
        });
        setUserGroupList(userGroupMapping);
        setTotalData(result.data.totalPages);
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
    setIsLoading(false);
  };

  const initAllUserGroupList = async () => {
    setIsLoading(true);
    setGroupNameList([]);
    try {
      const result = await getAllUserGroup(0, 10002);
      const data = result?.data;
      let tempGroupList: string[] = [];
      if (data) {
        let userGroupMapping: UserGroupItem[] = [];
        data.content.map((item: any) => {
          userGroupMapping.push(
            createUserGroup(
              item?.groupId,
              item?.tenantId,
              item?.roleName,
              item?.description,
              item?.status,
              item?.createdBy,
              item?.createdAt,
              item?.updatedBy,
              item?.updatedAt,
              item?.userAccount,
              item?.functions,
              item?.isAdmin
            )
          );

          tempGroupList.push(item?.roleName);
        });
        setGroupNameList(tempGroupList);
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
    setIsLoading(false);
  };

  const columns: GridColDef[] = [
    {
      field: "roleName",
      headerName: t("userGroup.groupName"),
      width: 200,
      type: "string",
    },
    {
      field: "description",
      headerName: t("userGroup.description"),
      width: 200,
      type: "string",
    },
    {
      field: "isAdmin",
      headerName: t("userAccount.isAdmin"),
      width: 250,
      type: "string",
      valueGetter: (params) =>
        params.row?.isAdmin ? t("common.yes") : t("common.no"),
    },
    {
      field: "functions",
      headerName: t("userGroup.availableFeatures"),
      width: 600,
      type: "string",
      renderCell: (params) => {
        return (
          <div>
            {params.row.functions.map((item: any, key: number) => (
              <span key={key}>
                {key > 0 ? " , " : ""}
                {i18n.language == "zhch"
                  ? item.functionNameSChi
                  : i18n.language == "zhhk"
                  ? item.functionNameTChi
                  : item.functionNameEng}
              </span>
            ))}
          </div>
        );
      },
    },

    {
      field: "edit",
      headerName: t("pick_up_order.item.edit"),
      filterable: false,
      renderCell: (params) => {
        return (
          <Button
            data-testid="astd-user-group-edit-button-9924"
            onClick={(event) => {
              event.stopPropagation();
              handleAction(params, "edit");
            }}
          >
            <EDIT_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark mr-2"
              style={{ cursor: "pointer" }}
            />
          </Button>
        );
      },
    },
    {
      field: "delete",
      headerName: t("pick_up_order.item.delete"),
      filterable: false,
      renderCell: (params) => {
        return (
          <Button
            data-testid="astd-user-group-delete-button-7688"
            onClick={(event) => {
              event.stopPropagation();
              handleAction(params, "delete");
            }}
          >
            <DELETE_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark"
              style={{ cursor: "pointer" }}
            />
          </Button>
        );
      },
    },
  ];

  const handleAction = (
    params: GridRenderCellParams,
    action: "add" | "edit" | "delete"
  ) => {
    setAction(action);
    setRowId(params.row.id);
    setSelectedRow(params.row);
    setDrawerOpen(true);
  };

  const handleSelectRow = (params: GridRowParams) => {
    setAction("edit");
    setRowId(params.row.id);
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
    initUserGroupList();
    initAllUserGroupList();
    if (type == "success") {
      showSuccessToast(msg);
    } else {
      showErrorToast(msg);
    }
  };

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
    };
  }, []);

  useEffect(() => {
    if (userGroupList.length === 0 && page > 1) {
      // move backward to previous page once data deleted from last page (no data left on last page)
      setPage((prev) => prev - 1);
    }
  }, [userGroupList]);

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginY: 4,
          }}
        >
          <Typography fontSize={16} color="grey" fontWeight="600">
            {t("staffManagement.userGroup")}
          </Typography>
          <Button
            sx={[
              styles.buttonOutlinedGreen,
              {
                width: "max-content",
                height: "40px",
              },
            ]}
            data-testid="astd-user-group-new-button-8674"
            variant="outlined"
            onClick={() => {
              setDrawerOpen(true);
              setAction("add");
            }}
          >
            <ADD_ICON /> {t("top_menu.add_new")}
          </Button>
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
            {isLoading ? (
              <CircularLoading />
            ) : (
              <Box>
                {" "}
                <DataGrid
                  rows={userGroupList}
                  getRowId={(row) => row.groupId}
                  hideFooter
                  columns={columns}
                  onRowClick={handleSelectRow}
                  getRowSpacing={getRowSpacing}
                  localeText={localeTextDataGrid}
                  getRowClassName={(params) =>
                    selectedRow && params.id === selectedRow.groupId
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
        {rowId != 0 && (
          <CreateUserGroup
            drawerOpen={drawerOpen}
            handleDrawerClose={() => {
              setDrawerOpen(false);
              setSelectedRow(null);
            }}
            action={action}
            rowId={rowId}
            selectedItem={selectedRow}
            functionList={functionList}
            onSubmitData={onSubmitData}
            groupNameList={groupNameList}
          />
        )}
      </Box>
    </>
  );
};

export default UserGroup;
