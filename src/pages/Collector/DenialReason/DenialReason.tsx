import { useEffect, useState, FunctionComponent, useCallback } from "react";
import { Box, Button, Checkbox, Typography, Pagination } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { styles } from "../../../constants/styles";
import {
  ADD_ICON,
  EDIT_OUTLINED_ICON,
  DELETE_OUTLINED_ICON,
} from "../../../themes/icons";
import { getAllDenialReason } from "../../../APICalls/Collector/denialReason";
import { DenialReason as DenialReasonItem } from "../../../interfaces/denialReason";
import CreateDenialReason from "./CreateDenialReason";

function createDenialReason(
  reasonId: number,
  tenantId: string,
  reasonNameTchi: string,
  reasonNameSchi: string,
  reasonNameEng: string,
  description: string,
  remark: string,
  functionId: number,
  status: string,
  createdBy: string,
  updatedBy: string,
  createdAt: string,
  updatedAt: string
): DenialReasonItem {
  return {
    reasonId,
    tenantId,
    reasonNameTchi,
    reasonNameSchi,
    reasonNameEng,
    description,
    remark,
    functionId,
    status,
    createdBy,
    updatedBy,
    createdAt,
    updatedAt,
  };
}

const DenialReason: FunctionComponent = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsPerPageOptions, setRowsPerPageOptions] = useState([10, 25, 100]);
  const [totalRows, setTotalRows] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [denialReason, setDenialReason] = useState("");
  const [denialReasonId, setDenialReasonId] = useState("");
  const [denialReasonName, setDenialReasonName] = useState("");
  const [action, setAction] = useState<"add" | "edit" | "delete">("add");
  const [rowId, setRowId] = useState<number>(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [totalData, setTotalData] = useState<number>(0);
  const [DenialReasonList, setDenialReasonList] = useState<DenialReasonItem[]>(
    []
  );

  console.log(DenialReasonList);
  const [selectedRow, setSelectedRow] = useState<DenialReasonItem | null>(null);

  useEffect(() => {
    initDenialReasonList();
  }, []);

  const initDenialReasonList = async () => {
    const result = await getAllDenialReason(page - 1, pageSize);
    const data = result?.data;
    // setDenialReasonList(data);
    if (data) {
      var denialReasonMapping: DenialReasonItem[] = [];
      data.map((item: any) => {
        denialReasonMapping.push(
          createDenialReason(
            item?.reasonId,
            item?.tenantId,
            item?.reasonNameTchi,
            item?.reasonNameSchi,
            item?.reasonNameEng,
            item?.description,
            item?.remark,
            item?.functionId,
            item?.status,
            item?.createdBy,
            item?.updatedBy,
            item?.createdAt,
            item?.updatedAt
          )
        );
      });
      setDenialReasonList(denialReasonMapping);
      setTotalData(data.totalPages);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "reasonNameSchi",
      headerName: t("denial_reason.reason_name_tchi"),
      width: 200,
      type: "string",
    },
    {
      field: "reasonNameTchi",
      headerName: t("denial_reason.reason_name_schi"),
      width: 200,
      type: "string",
    },
    {
      field: "reasonNameEng",
      headerName: t("denial_reason.reason_name_eng"),
      width: 200,
      type: "string",
    },
    {
      field: "functionId",
      headerName: t("denial_reason.corresponding_functions"),
      width: 100,
      type: "string",
    },
    {
      field: "description",
      headerName: t("denial_reason.description"),
      width: 100,
      type: "string",
    },
    {
      field: "remark",
      headerName: t("denial_reason.remark"),
      width: 100,
      type: "string",
    },
    {
      field: "edit",
      headerName: "",
      renderCell: (params) => {
        return (
          <Button
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
      headerName: "",
      renderCell: (params) => {
        return (
          <Button
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
    initDenialReasonList();
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
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t("top_menu.denial_reason")}
          </Typography>
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
            <ADD_ICON /> {t("top_menu.add_new")}
          </Button>
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
            <DataGrid
              rows={DenialReasonList}
              getRowId={(row) => row.reasonId}
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
        {rowId != 0 && (
          <CreateDenialReason
            drawerOpen={drawerOpen}
            handleDrawerClose={() => setDrawerOpen(false)}
            action={action}
            rowId={rowId}
            selectedItem={selectedRow}
            onSubmitData={onSubmitData}
          />
        )}
      </Box>
    </>
  );
};

export default DenialReason;
