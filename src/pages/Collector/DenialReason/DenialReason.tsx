import { useEffect, useState, FunctionComponent, useCallback } from "react";
import { Box, Button, Checkbox, Typography, Pagination, Stack } from "@mui/material";
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
import { getAllDenialReason, getAllDenialReasonByFunctionId } from "../../../APICalls/Collector/denialReason";
import { DenialReason as DenialReasonItem } from "../../../interfaces/denialReason";
import CreateDenialReason from "./CreateDenialReason";
import { getAllFunction } from "../../../APICalls/Collector/userGroup";
import i18n from "../../../setups/i18n";
import CustomSearchField from "../../../components/TableComponents/CustomSearchField";

function createDenialReason(
  reasonId: number,
  tenantId: string,
  reasonNameTchi: string,
  reasonNameSchi: string,
  reasonNameEng: string,
  description: string,
  remark: string,
  functionId: string,
  functionName: string,
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
    functionName,
    status,
    createdBy,
    updatedBy,
    createdAt,
    updatedAt,
  };
}

const DenialReason: FunctionComponent = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [action, setAction] = useState<"add" | "edit" | "delete">("add");
  const [rowId, setRowId] = useState<number>(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [totalData, setTotalData] = useState<number>(0);
  const [DenialReasonList, setDenialReasonList] = useState<DenialReasonItem[]>(
    []
  );
  const [functionList, setFunctionList] = useState<{ functionId: string; functionNameEng: string; functionNameSChi: string; reasonTchi: string; name: string; }[]>([]);
  const [functionOptions, setFunctionOptions] = useState<{value: string, label: string}[]>([]);
  const [selectedRow, setSelectedRow] = useState<DenialReasonItem | null>(null);

  const initFunctionList = async () => {
    const result = await getAllFunction();
    const data = result?.data;
    if (data.length > 0) {
      let name = ''
      data.map((item: { functionId: string; functionNameEng: string; functionNameSChi: string; functionNameTChi: string; name: string; }) => {
        switch (i18n.language) {
          case 'enus':
            name = item.functionNameEng
            break
          case 'zhch':
            name = item.functionNameSChi
            break
          case 'zhhk':
            name = item.functionNameTChi
            break
          default:
            name = item.functionNameTChi
            break
        }
        item.name = name
      })
    }
    const options = data.map((item: { name: string; functionId: string; }) => {
      return {
        label: item.name,
        value: item.functionId
      }
    })
    options.push({
      label: t("check_out.any"),
      value: ''
    })
    setFunctionList(data);
    setFunctionOptions(options)
  };

  const initDenialReasonList = async () => {
    const result = await getAllDenialReason(page - 1, pageSize);
    const data = result?.data;
    if (data) {
      var denialReasonMapping: DenialReasonItem[] = [];
      data.content.map((item: any) => {
        const functionItem = functionList.find((el) => el.functionId === item.functionId)
        if (functionItem) {
          item.functionName = functionItem.name
        }
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
            item?.functionName,
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
  const searchByFunctionId = async (functionId: number) => {
    const result = await getAllDenialReasonByFunctionId(page - 1, pageSize, functionId);
    const data = result?.data;
    if (data) {
      var denialReasonMapping: DenialReasonItem[] = [];
      data.content.map((item: any) => {
        const functionItem = functionList.find((el) => el.functionId === item.functionId)
        if (functionItem) {
          item.functionName = functionItem.name
        }
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
            item?.functionName,
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
  useEffect(() => {
    initFunctionList();
  }, [i18n.language])
  
  useEffect(() => {
    initDenialReasonList();
  }, [functionList, page]);

  const columns: GridColDef[] = [
    {
      field: "reasonNameTchi",
      headerName: t("denial_reason.reason_name_tchi"),
      width: 200,
      type: "string",
    },
    {
      field: "reasonNameSchi",
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
      field: "functionName",
      headerName: t("denial_reason.corresponding_functions"),
      width: 100,
      type: "number",
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

  const searchfield = [
    {label:t('denial_reason.corresponding_functions'),width:'100%',options: functionOptions}
  ]

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

  const handleSearch = (keyName: string, value: string) => {
    if (value) {
      searchByFunctionId(Number(value))
    } else {
      initDenialReasonList()
    }
  }

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
          <Stack direction='row' mt={3} >
            {searchfield.map((s, i)=>(
              <CustomSearchField
                key={i}
                label={s.label} 
                width={s.width}
                options={s.options || []} 
                onChange={handleSearch} />
            ))}
          </Stack>
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
            selectedItem={selectedRow}
            onSubmitData={onSubmitData}
            denialReasonlist={DenialReasonList}
          />
        )}
      </Box>
    </>
  );
};

export default DenialReason;
