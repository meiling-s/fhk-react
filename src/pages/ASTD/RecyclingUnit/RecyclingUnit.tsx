import React, {
  useEffect,
  useState,
  FunctionComponent,
  useCallback,
} from "react";
import {
  Box,
  Button,
  Checkbox,
  Typography,
  Pagination,
  Container,
  IconButton,
  Switch,
  Modal,
  Stack,
  Divider,
} from "@mui/material";
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
import EditIcon from "@mui/icons-material/Edit";

import { styles } from "../../../constants/styles";
// import CreateVehicle from './CreateVehicle'
import {
  Vehicle as VehicleItem,
  CreateVehicle as VehiclesForm,
} from "../../../interfaces/vehicles";
import { Contract as ContractItem } from "../../../interfaces/contract";
import { getAllContract } from "../../../APICalls/Collector/contracts";
import { ToastContainer, toast } from "react-toastify";

import { useTranslation } from "react-i18next";
import { extractError, returnApiToken } from "../../../utils/utils";
import { getTenantById } from "../../../APICalls/tenantManage";
import StatusLabel from "../../../components/StatusLabel";
import {
  GET_ALL_RECYCLE_TYPE,
  GET_RECYC_TYPE,
} from "../../../constants/requests";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import axiosInstance from "../../../constants/axiosInstance";
import { AXIOS_DEFAULT_CONFIGS } from "../../../constants/configs";
import { t } from "i18next";
import RecyclingFormat from "./RecyclingFormat";
import {
  deleteRecyc,
  deleteSubRecyc,
  getAllPackagingUnit,
  getRecycCode,
  getWeightUnit,
} from "../../../APICalls/ASTD/recycling";
import CircularLoading from "../../../components/CircularLoading";
import WeightFormat from "./WeightFormat";
import PackagingFormat from "./PackagingFormat";
import CodeFormat from "./CodeFormat";
import { STATUS_CODE, localStorgeKeyName } from "../../../constants/constant";
import CustomButton from "../../../components/FormComponents/CustomButton";
import { useNavigate } from "react-router-dom";
import useLocaleTextDataGrid from "../../../hooks/useLocaleTextDataGrid";
import DeleteModalSub from "../../../components/FormComponents/deleteModal";
import SemiFinishProduct from "./SemiFinishProduct";
interface CodeFormatProps {
  createdAt: string;
  createdBy: string;
  description: string;
  recycCodeId: number;
  recycCodeName: string;
  recycSubTypeId: string;
  recycTypeId: string;
  remark: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
  version: number;
}

interface PackagingUnitProps {
  createdAt: string;
  createdBy: string;
  description: string;
  packagingNameEng: string;
  packagingNameSchi: string;
  packagingNameTchi: string;
  packagingTypeId: string;
  remark: string;
  status: string;
  tenantId: string;
  updatedAt: string;
  updatedBy: string;
  version: number;
}

interface WeightFormatProps {
  createdAt: string;
  createdBy: string;
  description: string;
  poDetail: string[];
  remark: string;
  status: string;
  unitId: number;
  unitNameEng: string;
  unitNameSchi: string;
  unitNameTchi: string;
  updatedAt: string;
  updatedBy: string;
  weight: number;
  version: number;
}

interface recyleSubtyeData {
  recycSubTypeId: string;
  recyclableNameEng: string;
  recyclableNameSchi: string;
  recyclableNameTchi: string;
  description: string;
  remark: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
}

interface recyleTypeData {
  createdAt: string;
  createdBy: string;
  description: string;
  recycSubType: recyleSubtyeData[];
  recycTypeId: string;
  recyclableNameEng: string;
  recyclableNameSchi: string;
  recyclableNameTchi: string;
  remark: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
  recycSubTypeId: string;
  version: number;
}

type DeleteForm = {
  open: boolean;
  onClose: () => void;
  onRejected?: () => void;
  handleConfirmDelete: () => void;
};

type updateStatus = {
  status: string;
  updatedBy: string;
};

const RecyclingUnit: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<WeightFormatProps | null>(
    null
  );
  const [selectedRecyclingRow, setSelectedRecyclingRow] =
    useState<recyleTypeData | null>(null);
  const [selectedPackagingRow, setSelectedPackagingRow] =
    useState<PackagingUnitProps | null>(null);
  const [selectedCodeRow, setSelectedCodeRow] =
    useState<CodeFormatProps | null>(null);
  const [action, setAction] = useState<"add" | "edit" | "delete">("add");
  const [rowId, setRowId] = useState<number>(1);
  const [page, setPage] = useState(1);
  const [recyclableType, setRecyclableType] = useState([]);
  const [packagingUnit, setPackagingUnit] = useState<PackagingUnitProps[]>([]);
  const [weightUnit, setWeightUnit] = useState([]);
  const [code, setCode] = useState<CodeFormatProps[]>([]);
  const pageSize = 10;
  const [totalData, setTotalData] = useState<number>(0);
  const [recycDrawerOpen, setRecycDrawerOpen] = useState<boolean>(false);
  const [packagingDrawerOpen, setPackagingDrawerOpen] =
    useState<boolean>(false);
  const [weightDrawerOpen, setWeightDrawerOpen] = useState<boolean>(false);
  const [codeDrawerOpen, setCodeDrawerOpen] = useState<boolean>(false);
  const [isMainCategory, setMainCategory] = useState<boolean>(false);
  const [delFormModal, setDeleteModal] = useState<boolean>(false);
  const [switchValue, setSwitchValue] = useState<any>(null);
  const navigate = useNavigate();
  const { localeTextDataGrid } = useLocaleTextDataGrid();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [recycSubTypeIdValue, setRecycSubTypeIdValue] = useState<any>(null);
  const [subTypeVersion, setSubTypeVersion] = useState<number>(0);
  const [isLoadingPackaging, setIsLoadingPackaging] = useState<boolean>(false);
  const [isLoadingRecycling, setIsLoadingRecycling] = useState<boolean>(false);
  const [isLoadingWeight, setIsLoadingWeight] = useState<boolean>(false);

  useEffect(() => {
    initRecycTypeList();
    initRecycCode();
    initPackagingUnit();
    initWeightUnit();
  }, [page]);

  const initRecycTypeList = async () => {
    try {
      var response = await axiosInstance({
        baseURL: window.baseURL.administrator,
        ...GET_RECYC_TYPE,
        // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
      });
      const data = response.data;
      setRecyclableType(data);
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const initRecycCode = async () => {
    setIsLoadingRecycling(true);
    try {
      const result = await getRecycCode(page - 1, pageSize);
      const data = result?.data;

      setCode(data);
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
    setIsLoadingRecycling(false);
  };

  const initPackagingUnit = async () => {
    setIsLoadingPackaging(true);
    try {
      const result = await getAllPackagingUnit(page - 1, pageSize);
      const data = result?.data.content;

      setPackagingUnit(data);
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
    setIsLoadingPackaging(false);
  };

  const initWeightUnit = async () => {
    setIsLoadingWeight(true);
    try {
      const result = await getWeightUnit(page - 1, pageSize);
      const data = result?.data;

      setWeightUnit(data);
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
    setIsLoadingWeight(false);
  };

  const codeColumns: GridColDef[] = [
    {
      field: "recycCodeName",
      headerName: t("recycling_unit.recyclable_code"),
      width: 200,
      type: "string",
    },
    {
      field: "recycTypeId",
      headerName: t("recycling_unit.main_category"),
      width: 200,
      type: "string",
    },
    {
      field: "recycSubTypeId",
      headerName: t("recycling_unit.sub_category"),
      width: 200,
      type: "string",
    },
    {
      field: "edit",
      headerName: t("pick_up_order.item.edit"),
      filterable: false,
      renderCell: (params) => {
        return (
          <div
            style={{ display: "flex", gap: "8px" }}
            data-testid="astd-code-edit-button-6691"
          >
            <EDIT_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark mr-2"
              onClick={(event) => {
                event.stopPropagation();
                handleAction(params, "edit", "code");
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        );
      },
    },
    {
      field: "delete",
      headerName: t("pick_up_order.item.delete"),
      filterable: false,
      renderCell: (params) => {
        return (
          <div
            style={{ display: "flex", gap: "8px" }}
            data-testid="astd-code-delete-button-8979"
          >
            <DELETE_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark"
              onClick={(event) => {
                event.stopPropagation();
                handleAction(params, "delete", "code");
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        );
      },
    },
  ];

  const columns: GridColDef[] = [
    {
      field: "packagingNameTchi",
      headerName: t("packaging_unit.traditional_chinese_name"),
      width: 200,
      type: "string",
    },
    {
      field: "packagingNameSchi",
      headerName: t("packaging_unit.simplified_chinese_name"),
      width: 200,
      type: "string",
    },
    {
      field: "packagingNameEng",
      headerName: t("packaging_unit.english_name"),
      width: 200,
      type: "string",
    },
    {
      field: "description",
      headerName: t("packaging_unit.introduction"),
      width: 250,
      type: "string",
    },
    {
      field: "remark",
      headerName: t("packaging_unit.remark"),
      width: 170,
      type: "string",
    },
    {
      field: "edit",
      headerName: t("pick_up_order.item.edit"),
      filterable: false,
      renderCell: (params) => {
        return (
          <div
            style={{ display: "flex", gap: "8px" }}
            data-testid="astd-packaging-unit-edit-button-5410"
          >
            <EDIT_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark mr-2"
              onClick={(event) => {
                event.stopPropagation();
                handleAction(params, "edit", "packaging");
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        );
      },
    },
    {
      field: "delete",
      headerName: t("pick_up_order.item.delete"),
      filterable: false,
      renderCell: (params) => {
        return (
          <div
            style={{ display: "flex", gap: "8px" }}
            data-testid="astd-packaging-unit-delete-button-6095"
          >
            <DELETE_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark"
              onClick={(event) => {
                event.stopPropagation();
                handleAction(params, "delete", "packaging");
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        );
      },
    },
  ];

  const weightColumns: GridColDef[] = [
    {
      field: "unitNameTchi",
      headerName: t("packaging_unit.traditional_chinese_name"),
      width: 200,
      type: "string",
    },
    {
      field: "unitNameSchi",
      headerName: t("packaging_unit.simplified_chinese_name"),
      width: 200,
      type: "string",
    },
    {
      field: "unitNameEng",
      headerName: t("packaging_unit.english_name"),
      width: 200,
      type: "string",
    },
    {
      field: "weight",
      headerName: t("recycling_unit.1kg_equivalent"),
      width: 200,
      type: "string",
    },
    {
      field: "description",
      headerName: t("packaging_unit.introduction"),
      width: 250,
      type: "string",
    },
    {
      field: "remark",
      headerName: t("packaging_unit.remark"),
      width: 170,
      type: "string",
    },
    {
      field: "edit",
      headerName: t("pick_up_order.item.edit"),
      filterable: false,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <EDIT_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark mr-2"
              onClick={(event) => {
                event.stopPropagation();
                handleAction(params, "edit", "weight");
              }}
              style={{ cursor: "pointer" }}
              data-testid="astd-weight-edit-button-8782"
            />
          </div>
        );
      },
    },
    {
      field: "delete",
      headerName: t("pick_up_order.item.delete"),
      filterable: false,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <DELETE_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark"
              onClick={(event) => {
                event.stopPropagation();
                handleAction(params, "delete", "weight");
              }}
              style={{ cursor: "pointer" }}
              data-testid="astd-weight-delete-button-7204"
            />
          </div>
        );
      },
    },
  ];

  const onDeleteModal = () => {
    setOpenDelete((prev) => !prev);
  };

  const onDeleteClick = async () => {
    const token = returnApiToken();

    const recyclingForm = {
      status: "INACTIVE",
      updatedBy: token.loginId,
      version: subTypeVersion,
    };

    const response = await deleteSubRecyc(recyclingForm, recycSubTypeIdValue);
    if (response) {
      showSuccessToast(t("notify.successDeleted"));
      handleOnSubmitData("recycle");
      setRecycSubTypeIdValue(null);
    }
    onDeleteModal();
  };

  const handleAction = (
    params: GridRenderCellParams,
    action: "add" | "edit" | "delete",
    value: "weight" | "packaging" | "code"
  ) => {
    setAction(action);
    setRowId(params.row.id);
    if (value === "weight") {
      setSelectedRow(params.row);
      setWeightDrawerOpen(true);
    } else if (value === "packaging") {
      setSelectedPackagingRow(params.row);
      setPackagingDrawerOpen(true);
    } else if (value === "code") {
      setSelectedCodeRow(params.row);
      setCodeDrawerOpen(true);
    }
  };

  const handleSelectRow = (params: GridRowParams) => {
    setAction("edit");
    setRowId(params.row.id);
    setSelectedRow(params.row);
    setDrawerOpen(true);
  };

  const codeHandleSelectRow = (params: GridRowParams) => {
    setAction("edit");
    setRowId(params.row.id);
    setSelectedCodeRow(params.row);
    setCodeDrawerOpen(true);
  };

  const packagingHandleSelectRow = (params: GridRowParams) => {
    setAction("edit");
    setRowId(params.row.id);
    setSelectedPackagingRow(params.row);
    setPackagingDrawerOpen(true);
  };

  const weightHandleSelectRow = (params: GridRowParams) => {
    setAction("edit");
    setRowId(params.row.id);
    setSelectedRow(params.row);
    setWeightDrawerOpen(true);
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

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
    };
  }, []);

  const customGridHandleAction = (value: any, action: any, type: string) => {
    setRecycDrawerOpen(true);
    setAction(action);
    setSelectedRecyclingRow(value);
    setMainCategory(type === "mainCategory" ? true : false);
  };

  const handleOnSubmitData = (type: string) => {
    if (type === "weight") {
      setWeightDrawerOpen(false);
      initWeightUnit();
    } else if (type === "packaging") {
      setPackagingDrawerOpen(false);
      initPackagingUnit();
    } else if (type === "recycle") {
      setRecycDrawerOpen(false);
      initRecycTypeList();
    } else if (type === "code") {
      setCodeDrawerOpen(false);
      initRecycCode();
    }
  };

  const handleClickSwitch = async (value: any, type: string) => {
    if (type === "main") {
      setSwitchValue(value);
      setDeleteModal(true);
    } else if (type === "sub") {
      setSwitchValue(null);
      setRecycSubTypeIdValue(value.recycSubTypeId);
      setOpenDelete(true);
      setSubTypeVersion(value.version);
    }
  };

  const handleConfirmDelete = async () => {
    const token = returnApiToken();
    const recycId = selectedRecyclingRow && selectedRecyclingRow.recycTypeId;
    const recyclingForm = {
      status: "INACTIVE",
      updatedBy: token.loginId,
      version:
        selectedRecyclingRow?.version !== undefined
          ? selectedRecyclingRow?.version
          : switchValue.version,
    };

    if (switchValue !== null) {
      try {
        const response = await deleteRecyc(
          recyclingForm,
          switchValue.recycTypeId
        );
        if (response) {
          showSuccessToast(t("notify.successDeleted"));
          handleOnSubmitData("recycle");
          setSwitchValue(null);
        }
      } catch (error: any) {
        const { state } = extractError(error);
        if (state.code === STATUS_CODE[503]) {
          navigate("/maintenance");
        } else if (state.code === STATUS_CODE[409]) {
          showErrorToast(error.response.data.message);
        } else {
          showErrorToast(t("notify.errorDeleted"));
        }
      }
    } else if (recycId !== null) {
      try {
        const response = await deleteRecyc(recyclingForm, recycId);
        if (response) {
          showSuccessToast(t("notify.successDeleted"));
          handleOnSubmitData("recycle");
          setDeleteModal(false);
        }
      } catch (error: any) {
        const { state } = extractError(error);
        if (state.code === STATUS_CODE[503]) {
          navigate("/maintenance");
        } else if (state.code === STATUS_CODE[409]) {
          showErrorToast(error.response.data.message);
        } else {
          showErrorToast(t("notify.errorDeleted"));
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginY: 4,
          }}
        >
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t(`recycling_unit.recyclable_subtype_semi_complete`)}
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
              setRecycDrawerOpen(true);
              setAction("add");
            }}
            data-testid="astd-recyclable-new-button-5393"
          >
            <ADD_ICON /> {t("top_menu.add_new")}
          </Button>
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
            <CustomDataGrid
              data={recyclableType}
              customGridHandleAction={customGridHandleAction}
              handleClickSwitch={handleClickSwitch}
            />
          </Box>
        </div>
        <SemiFinishProduct />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginY: 4,
          }}
        >
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t(`recycling_unit.recyclable_code`)}
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
              setCodeDrawerOpen(true);
              setAction("add");
            }}
            data-testid="astd-code-new-button-4949"
          >
            <ADD_ICON /> {t("top_menu.add_new")}
          </Button>
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
            {isLoadingRecycling ? (
              <CircularLoading />
            ) : (
              <DataGrid
                rows={code}
                getRowId={(row) => row.recycCodeId}
                hideFooter
                columns={codeColumns}
                onRowClick={codeHandleSelectRow}
                getRowSpacing={getRowSpacing}
                localeText={localeTextDataGrid}
                getRowClassName={(params) =>
                  selectedCodeRow && params.id === selectedCodeRow.recycCodeId
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
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginY: 4,
            }}
          >
            <Typography fontSize={16} color="black" fontWeight="bold">
              {t(`recycling_unit.packaging_unit`)}
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
                setPackagingDrawerOpen(true);
                setAction("add");
              }}
              data-testid="astd-packaging-unit-new-button-1985"
            >
              <ADD_ICON /> {t("top_menu.add_new")}
            </Button>
          </Box>
        </div>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
            {isLoadingPackaging ? (
              <CircularLoading />
            ) : (
              <DataGrid
                rows={packagingUnit}
                getRowId={(row) => row.packagingTypeId}
                hideFooter
                columns={columns}
                onRowClick={packagingHandleSelectRow}
                getRowSpacing={getRowSpacing}
                localeText={localeTextDataGrid}
                getRowClassName={(params) =>
                  selectedPackagingRow &&
                  params.id === selectedPackagingRow.packagingTypeId
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
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginY: 4,
            }}
          >
            <Typography fontSize={16} color="black" fontWeight="bold">
              {t(`recycling_unit.weight_unit`)}
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
                setWeightDrawerOpen(true);
                setAction("add");
              }}
              data-testid="astd-weight-new-button-1075"
            >
              <ADD_ICON /> {t("top_menu.add_new")}
            </Button>
          </Box>
        </div>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
            {isLoadingWeight ? (
              <CircularLoading />
            ) : (
              <DataGrid
                rows={weightUnit}
                getRowId={(row) => row.unitId}
                hideFooter
                columns={weightColumns}
                onRowClick={weightHandleSelectRow}
                getRowSpacing={getRowSpacing}
                localeText={localeTextDataGrid}
                getRowClassName={(params) =>
                  selectedRow && params.id === selectedRow.unitId
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
            )}
          </Box>
        </div>
      </Box>
      <DeleteModalSub
        open={openDelete}
        onClose={onDeleteModal}
        onDelete={onDeleteClick}
        deleteText={t("common.deleteMessage")}
      />
      <RecyclingFormat
        drawerOpen={recycDrawerOpen}
        handleDrawerClose={() => setRecycDrawerOpen(false)}
        action={action}
        onSubmitData={handleOnSubmitData}
        recyclableType={recyclableType}
        selectedItem={selectedRecyclingRow}
        mainCategory={isMainCategory}
        setDeleteModal={setDeleteModal}
      />
      <CodeFormat
        drawerOpen={codeDrawerOpen}
        handleDrawerClose={() => {
          setCodeDrawerOpen(false);
          setSelectedCodeRow(null);
        }}
        action={action}
        onSubmitData={handleOnSubmitData}
        selectedItem={selectedCodeRow}
      />
      <PackagingFormat
        drawerOpen={packagingDrawerOpen}
        handleDrawerClose={() => {
          setPackagingDrawerOpen(false);
          setSelectedPackagingRow(null);
        }}
        action={action}
        onSubmitData={handleOnSubmitData}
        selectedItem={selectedPackagingRow}
      />
      <WeightFormat
        drawerOpen={weightDrawerOpen}
        handleDrawerClose={() => {
          setWeightDrawerOpen(false);
          setSelectedRow(null);
        }}
        action={action}
        onSubmitData={handleOnSubmitData}
        rowId={rowId}
        selectedItem={selectedRow}
      />
      <DeleteModal
        open={delFormModal}
        onClose={() => {
          setDeleteModal(false);
        }}
        onRejected={() => {
          setDeleteModal(false);
          showSuccessToast(t("pick_up_order.rejected_success"));
        }}
        handleConfirmDelete={handleConfirmDelete}
      />
    </>
  );
};

export default RecyclingUnit;

const CustomDataGrid = ({
  data,
  customGridHandleAction,
  handleClickSwitch,
}: {
  data: any;
  customGridHandleAction: (value: any, action: string, type: string) => void;
  handleClickSwitch: (value: any, type: string) => void;
}) => {
  const columns = [
    {
      key: "traditionalName",
      label: t("common.traditionalChineseName"),
      width: "15%",
    },
    {
      key: "chineseName",
      label: t("common.simplifiedChineseName"),
      width: "15%",
    },
    { key: "englishName", label: t("common.englishName"), width: "15%" },
    { key: "description", label: t("common.description"), width: "10%" },
    { key: "remark", label: t("common.remark"), width: "5%" },
    { key: "edit", label: "", width: "5%" },
    { key: "delete", label: "", width: "5%" },
    { key: "toggle", label: "", width: "5%" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",

          fontWeight: "bold",
        }}
      >
        <input type="checkbox" />
        {columns.map((column) => (
          <div
            key={column.key}
            style={{
              flex: `0 0 ${column.width}`,
              padding: "8px",
              fontSize: 13,
            }}
          >
            {column.label}
          </div>
        ))}
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {data.map((item: any, index: any) => (
          <div
            key={index}
            style={{
              backgroundColor: "#fff",
              marginBottom: 15,
              borderRadius: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #ccc",
                paddingBottom: 5,
                paddingTop: 5,
              }}
            >
              {/* <input type="checkbox" /> */}
              <div style={{ flex: `0 0 15%`, padding: "8px", fontSize: 16 }}>
                {item.recyclableNameTchi}
              </div>
              <div style={{ flex: `0 0 15%`, padding: "8px", fontSize: 16 }}>
                {item.recyclableNameSchi}
              </div>
              <div style={{ flex: `0 0 15%`, padding: "8px", fontSize: 16 }}>
                {item.recyclableNameEng}
              </div>
              <div style={{ flex: `0 0 10%`, padding: "8px", fontSize: 16 }}>
                {item.description}
              </div>
              <div style={{ flex: `0 0 5%`, padding: "8px", fontSize: 16 }}>
                {item.remark}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex" }}
                  data-testid={`astd-recyclable-edit-button-5941` + index}
                >
                  <EDIT_OUTLINED_ICON
                    fontSize="small"
                    className="cursor-pointer text-grey-dark mr-5"
                    onClick={() =>
                      customGridHandleAction(item, "edit", "mainCategory")
                    }
                  />
                </div>
                <div
                  style={{ display: "flex" }}
                  data-testid={`astd-recyclable-delete-button-2955` + index}
                >
                  <DELETE_OUTLINED_ICON
                    fontSize="small"
                    className="cursor-pointer text-grey-dark mr-2"
                    onClick={() => handleClickSwitch(item, "main")}
                  />
                </div>
              </div>
            </div>
            {item.recycSubType.length > 0 &&
              item.recycSubType.map((value: any, index: any) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    borderBottom: "1px solid #ccc",
                    backgroundColor: "#fff",
                    paddingBottom: 5,
                    paddingTop: 5,
                    //marginLeft: 20,
                    alignItems: "center",
                  }}
                >
                  {/* <input type="checkbox" /> */}
                  <div
                    style={{ flex: `0 0 15%`, padding: "8px", fontSize: 16 }}
                  >
                    {value.recyclableNameTchi}
                  </div>
                  <div
                    style={{ flex: `0 0 15%`, padding: "8px", fontSize: 16 }}
                  >
                    {value.recyclableNameSchi}
                  </div>
                  <div
                    style={{ flex: `0 0 15%`, padding: "8px", fontSize: 16 }}
                  >
                    {value.recyclableNameEng}
                  </div>
                  <div
                    style={{ flex: `0 0 10%`, padding: "8px", fontSize: 16 }}
                  >
                    {value.description}
                  </div>
                  <div style={{ flex: `0 0 5%`, padding: "8px", fontSize: 16 }}>
                    {value.remark}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      //marginLeft: -10
                    }}
                  >
                    <div
                      style={{ display: "flex" }}
                      data-testid={
                        `astd-subrecyclable-edit-button-5941` + index
                      }
                    >
                      <EDIT_OUTLINED_ICON
                        fontSize="small"
                        className="cursor-pointer text-grey-dark mr-5"
                        onClick={() =>
                          customGridHandleAction(value, "edit", "subCategory")
                        }
                      />
                    </div>
                    <div
                      style={{ display: "flex" }}
                      data-testid={
                        `astd-subrecyclable-delete-button-2955` + index
                      }
                    >
                      <DELETE_OUTLINED_ICON
                        fontSize="small"
                        className="cursor-pointer text-grey-dark mr-2"
                        onClick={() => handleClickSwitch(value, "sub")}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const DeleteModal: React.FC<DeleteForm> = ({
  open,
  onClose,
  onRejected,
  handleConfirmDelete,
}) => {
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
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: "bold" }}
            >
              {t("recycling_unit.confirm_delete")}
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography sx={localstyles.typo}>
              {t("recycling_unit.confirm_text")}
            </Typography>
          </Box>

          <Box sx={{ alignSelf: "center" }}>
            <CustomButton
              text={t("check_in.confirm")}
              color="blue"
              style={{ width: "175px", marginRight: "10px" }}
              onClick={() => {
                handleConfirmDelete();
                onClose();
              }}
              dataTestId="astd-recyclable-confirm-delete-button-4166"
            />
            <CustomButton
              text={t("check_in.cancel")}
              color="blue"
              outlined
              style={{ width: "175px" }}
              onClick={() => {
                onClose();
              }}
              dataTestId="astd-recyclable-cancel-delete-button-4338"
            />
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

let localstyles = {
  typo: {
    color: "grey",
    fontSize: 14,
  },
  modal: {
    position: "absolute",
    top: "50%",
    width: "34%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    height: "fit-content",
    padding: 4,
    backgroundColor: "white",
    border: "none",
    borderRadius: 5,

    "@media (max-width: 768px)": {
      width: "70%" /* Adjust the width for mobile devices */,
    },
  },
};
