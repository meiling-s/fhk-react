import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Stack,
  Typography,
  Pagination,
  Divider
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams
} from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import { styles } from "../../../constants/styles";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import CustomItemList from "../../../components/FormComponents/CustomItemList";
import {
  getCheckinReasons,
  getInternalRequest,
  updateInternalRequestStatus,
} from "../../../APICalls/Collector/warehouseManage";
import CircularLoading from "../../../components/CircularLoading";
import InternalTransferForm from "../../../components/FormComponents/InternalTransferForm";
import {
  Languages,
  STATUS_CODE,
  localStorgeKeyName
} from "../../../constants/constant";
import {
  extractError,
  getPrimaryColor,
  showSuccessToast,
  showErrorToast,
} from "../../../utils/utils";
import { useTranslation } from "react-i18next";
import CustomButton from "../../../components/FormComponents/CustomButton";
import i18n from "../../../setups/i18n";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import useLocaleTextDataGrid from "../../../hooks/useLocaleTextDataGrid";
import { recycSubType, recycType } from "src/interfaces/common";
import { InternalTransfer, InternalTransferName, queryInternalTransfer } from "src/interfaces/internalTransferRequests";
import { mappingAddonsType, mappingProductType, mappingRecy, mappingSubProductType, mappingSubRecy } from "../ProccessOrder/utils";
import { getAllFactoriesWarehouse } from "src/APICalls/Collector/factory";
import { FactoryWarehouseData } from "src/interfaces/factory";
import CustomField from "src/components/FormComponents/CustomField";
import CustomTextField from "src/components/FormComponents/CustomTextField";

dayjs.extend(utc);
dayjs.extend(timezone);

type Confirm = {
  open: boolean;
  onClose: () => void;
  title?: string;
};

const ConfirmModal: React.FC<Confirm> = ({ open, onClose, title }) => {
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
              sx={{ fontWeight: "medium" }}
            >
              {t("check_out.success_approve")}
            </Typography>
          </Box>
          <Box sx={{ alignSelf: "center" }}>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={() => {
                onClose();
              }}
            >
              {t("check_out.ok")}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

type rejectForm = {
  open: boolean;
  onClose: () => void;
  checkedInternalTransferRequest: number[];
  onRejected?: () => void;
  reasonList: any;
  navigate: (url: string) => void;
};

function RejectForm({
  open,
  onClose,
  checkedInternalTransferRequest,
  onRejected,
  reasonList,
  navigate
}: rejectForm) {
  const { t } = useTranslation();

  const [rejectReasonId, setRejectReasonId] = useState<string[]>([]);
  const [othersReason, setOthersReason] = useState<string>('')

  const handleConfirmRejectOnClick = async (rejectReasonId: string[]) => {
    var rejectReason = rejectReasonId.map((id) => {
      const reasonItem = reasonList.find(
        (reason: { id: string }) => reason.id === id
      );
      return reasonItem ? reasonItem.name : "";
    });

    if (rejectReasonId.includes('99') && othersReason !== '') {
      rejectReason = rejectReason.map(val => {
        if (val !== t('internalTransfer.others')) {
          return val
        }
      })
    }

    const loginId = localStorage.getItem(localStorgeKeyName.username) || "";

    try {
      const payLoad = {
        items: checkedInternalTransferRequest.map((val) => {
          return {
            id: val,
            status: 'REJECTED',
            updatedBy: loginId
          }
        }),
        reason: rejectReason,
        remark: rejectReasonId.includes('99') ? othersReason : ''
      };

      await updateInternalRequestStatus(payLoad);
      if (onRejected) {
        onRejected();
      } 
      resetState();
    } catch(error: any) {
      const { state } = extractError(error);
      resetState();
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else if (state.code === STATUS_CODE[409]) {
        showErrorToast(error?.response?.data?.message);
      }
    }
  };

  const resetState = () => {
    setRejectReasonId([]);
    setOthersReason('');
  };

  const onCloseLocal = () => {
    resetState();
    if (onClose) {
      onClose()
    }
  };

  return (
    <Modal
      open={open}
      onClose={onCloseLocal}
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
              {t("internalTransfer.confirm_reject")}
            </Typography>
          </Box>
          <Box>
            <Typography sx={localstyles.typo}>
              {t("check_in.reject_reasons")}
            </Typography>
            <CustomItemList
              items={reasonList}
              multiSelect={setRejectReasonId}
              itemColor={{ bgColor: "#F0F9FF", borderColor: getPrimaryColor() }}
            />
            {rejectReasonId.includes('99') && (
              <CustomField
              label={`${t("internalTransfer.others")} ${t("check_in.reject_reasons")}`}
              // mandatory={rejectReasonId.includes('99') && othersReason === ''}
              mandatory={false}
              style={{
                marginTop: 2,
              }}
              >
                <CustomTextField
                  id="rejectReason"
                  placeholder={`${t("internalTransfer.others")} ${t("check_in.reject_reasons")}`}
                  onChange={(event) => {
                    setOthersReason(event.target.value)
                  }}
                  value={othersReason}
                  sx={{ width: "100%" }}
                  // error={rejectReasonId.includes('99') && othersReason === ''}
                  error={false}
                  dataTestId="astd-create-edit-pickup-order-contact-no-input-field-6429"
                />
              </CustomField>
            )}
          </Box>

          <Box sx={{ alignSelf: "center" }}>
            <CustomButton
              text={t("check_in.confirm")}
              color="blue"
              style={{ width: "175px", marginRight: "10px" }}
              onClick={() => {
                handleConfirmRejectOnClick(rejectReasonId);
                onCloseLocal();
              }}
            />
            <CustomButton
              text={t("check_in.cancel")}
              color="blue"
              outlined
              style={{ width: "175px" }}
              onClick={() => {
                onCloseLocal();
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}

type ApproveForm = {
  open: boolean;
  onClose: () => void;
  checkedInternalTransferRequest: number[];
  onApprove?: () => void;
  navigate: (url: string) => void;
};

const ApproveModal: React.FC<ApproveForm> = ({
  open,
  onClose,
  checkedInternalTransferRequest,
  onApprove,
  navigate
}) => {
  const { t } = useTranslation();
  const loginId = localStorage.getItem(localStorgeKeyName.username) || "";
  const handleApproveRequest = async () => {
    try {
      const payLoad = {
        items: checkedInternalTransferRequest.map((val) => {
          return {
            id: val,
            status: 'APPROVED',
            updatedBy: loginId
          }
        })
      }
      await updateInternalRequestStatus(payLoad)
      if (onApprove) onApprove()
    } catch(error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else if (state.code === STATUS_CODE[409]) {
        showErrorToast(error?.response?.data?.message);
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
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: "bold" }}
            >
              {t("check_out.confirm_approve")}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ alignSelf: "center" }}>
            <CustomButton
              text={t("check_out.confirm_approve_btn")}
              color="blue"
              style={{ width: "150px", marginRight: "10px" }}
              onClick={() => {
                handleApproveRequest();
              }}
            />
            <CustomButton
              text={t("check_in.cancel")}
              color="blue"
              outlined
              style={{ width: "150px", marginRight: "10px" }}
              onClick={() => {
                onClose();
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

function IntermalTransferRequest() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedInternalTransfer, setSelectedCheckin] = useState<number[]>([]);
  const [selectedUnCheckin, setSelectedUnCheckin] = useState<number[]>([]);
  const [filterShipments, setFilterShipments] = useState<InternalTransferName[]>([]);
  const [rejFormModal, setRejectModal] = useState<boolean>(false);
  const [approveModal, setApproveModal] = useState<boolean>(false);
  const [warehouseDataList, setWarehouseDataList] = useState<FactoryWarehouseData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRow, setSelectedRow] = useState<InternalTransferName>();
  const [internalTransferRequest, setInternalTransferRequest] = useState<InternalTransferName[]>();
  const [shipmentsLength, setShipmentsLength] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState(false);
  const pageSize = 10;
  const [totalData, setTotalData] = useState<number>(0);
  const [query, setQuery] = useState<queryInternalTransfer>({
    recycSubTypeId: "",
    recycTypeId: "",
  });
  const [primaryColor, setPrimaryColor] = useState<string>("#79CA25");
  const [reasonList, setReasonList] = useState<any>([]);
  const { dateFormat } = useContainer(CommonTypeContainer);
  const { localeTextDataGrid } = useLocaleTextDataGrid();
  const { recycType, productType } = useContainer(CommonTypeContainer);
  const role = localStorage.getItem(localStorgeKeyName.role);
  const [category, setCateGory] = useState("");
  const [subCategory, setSubCateGory] = useState("");
  const getRejectReason = async () => {
    try {
      let result = await getCheckinReasons();
      if (result?.data?.content.length > 0) {
        let reasonName = "";
        switch (i18n.language) {
          case "enus":
            reasonName = "reasonNameEng";
            break;
          case "zhch":
            reasonName = "reasonNameSchi";
            break;
          case "zhhk":
            reasonName = "reasonNameTchi";
            break;
          default:
            reasonName = "reasonNameEng";
            break;
        }
        result?.data?.content.map(
          (item: { [x: string]: any; id: any; reasonId: any; name: any }) => {
            item.id = item.reasonId;
            item.name = item[reasonName];
          }
        );
        setReasonList([...result?.data?.content, {id: '99', name: t('internalTransfer.others')}]);
      }
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };
  useEffect(() => {
    initInternalTransferRequest();
    getRejectReason();
  }, [page, query, dateFormat, i18n.language]);

  const getWarehouseByIdFunc = (id: number, warehouseDataListLocal: FactoryWarehouseData[] = warehouseDataList): string => {
    let { ENUS, ZHCH, ZHHK } = Languages;
    let warehouseName: string = "";
    const warehouse = warehouseDataListLocal.find((item) => item.warehouseId === id);
    if (warehouse) {
      if (i18n.language === ENUS) warehouseName = warehouse?.warehouseNameEng ?? "";
      if (i18n.language === ZHCH) warehouseName = warehouse?.warehouseNameSchi ?? "";
      if (i18n.language === ZHHK) warehouseName = warehouse?.warehouseNameTchi ?? "";
    }

    return warehouseName;
  };

  const getRecycTypeName = useCallback((val: recycType | recycSubType): string => {
    let { ENUS, ZHCH, ZHHK } = Languages;
    let recycType: string = "";

    if (i18n.language === ENUS) recycType = val.recyclableNameEng ?? "";
    if (i18n.language === ZHCH) recycType = val.recyclableNameSchi ?? "";
    if (i18n.language === ZHHK) recycType = val.recyclableNameTchi ?? "";

    return recycType;
  }, []);

  const initWarehouseList = (async () => {
      try {
        const result = await getAllFactoriesWarehouse();
        const data = result?.data;
      
        if (data) {
          setWarehouseDataList(data);
          return data;
        }
      } catch (error) {
        return []
      }  
  })

  const initInternalTransferRequest = async () => {
    setIsLoading(true);
    try {
      const warehouseList: FactoryWarehouseData[] = await initWarehouseList();

      const result = await getInternalRequest(page - 1, pageSize, query);
      if (result) {
        const data: InternalTransfer[] = result?.data?.content;
        if (data && data.length > 0) {
          const newData: InternalTransferName[] = data.map((val) => {
            const dateInHK = dayjs.utc(val?.createdAt).tz("Asia/Hong_Kong");

            const mainCategoryLocal = val?.recycTypeId === '' || val?.recycTypeId === null ? 
              mappingProductType(val?.productTypeId, productType) 
                : mappingRecy(val?.recycTypeId, recycType)
            
            const subCategoryLocal = val?.recycSubTypeId === '' || val?.recycSubTypeId === null ?
              mappingSubProductType(val?.productTypeId, val?.productSubTypeId, productType)
                : mappingSubRecy(val?.recycTypeId, val?.recycSubTypeId, recycType)
            
            const addonCategoryLocal = val?.productAddonTypeId !== '' ?
              mappingAddonsType(val?.productTypeId, val?.productSubTypeId, val?.productAddonTypeId, productType)
                : '-'

            return {
              id: Number(val?.id),
              createdAt: dateInHK.format(`${dateFormat} HH:mm`),
              itemType: val?.recycTypeId === '' ? t('product') : t('recyclables'),  //PENDING
              mainCategory: mainCategoryLocal,
              subCategory: subCategoryLocal,
              addonCategory: addonCategoryLocal,
              package: val?.packageTypeId.toString(), // DONE
              senderWarehouse: getWarehouseByIdFunc(Number(val?.warehouseId), warehouseList || undefined),
              toWarehouse: getWarehouseByIdFunc(Number(val?.toWarehouseId), warehouseList || undefined),
              weight: val?.weight,
              detail: val
            }
          });
          
          setInternalTransferRequest(newData);
          setFilterShipments(newData);
          setShipmentsLength(result?.data?.totalElements)
        } else {
          setFilterShipments([]);
        }
        setTotalData(result?.data.totalPages);
      }
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
    setIsLoading(false);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    const selectedRows = checked
      ? filterShipments.map((row) => Number(row.id))
      : [];
    setSelectedCheckin(selectedRows);
  };

  useEffect(() => {
    if (selectAll) {
      let newIds: number[] = [];

      for (let item of filterShipments) {
        if (!selectedUnCheckin.includes(Number(item.id))) {
          newIds.push(Number(item.id));
        }
      }

      const allId: number[] = [...selectedInternalTransfer, ...newIds];
      const ids = new Set(allId);
      setSelectedCheckin(Array.from(ids));
    }
  }, [filterShipments]);

  useEffect(() => {
    if (selectedInternalTransfer.length === 0) {
      setSelectAll(false);
    }
  }, [selectedInternalTransfer]);

  const handleRowCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    setOpen(false);
    setSelectedRow(undefined);

    const checked = event.target.checked;
    if (checked) {
      setSelectedCheckin((prev) => [...prev, id]);
      setSelectedUnCheckin((prev) => {
        const unCheck = prev.filter((idLocal) => idLocal !== id);
        return unCheck;
      });
    } else {
      const updatedChecked = selectedInternalTransfer.filter(
        (rowId) => rowId !== id
      );
      setSelectedCheckin(updatedChecked);
      setSelectedUnCheckin((prev) => [...prev, id]);
    }
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
    headerName: t("localizedTexts.select"),
    width: 80,
    sortable: false,
    filterable: false,
    renderHeader: () => HeaderCheckbox,
    renderCell: (params) => (
      <Checkbox
        checked={selectedInternalTransfer?.includes(params.row?.id)}
        onChange={(event) => handleRowCheckboxChange(event, params.row.id)}
        color="primary"
      />
    )
  };

  const headCells: GridColDef[] = [
    checkboxColumn,
    {
      field: "createdAt",
      type: "string",
      headerName: t("date"),
      width: 150
    },
    {
      field: "itemType",
      type: "string",
      headerName: t("pick_up_order.recyclForm.item_category"),
      width: 200
    },
    {
      field: "mainCategory",
      type: "string",
      headerName: t("settings_page.recycling.main_category"),
      width: 200
    },
    {
      field: "subCategory",
      type: "string",
      headerName: t("settings_page.recycling.sub_category"),
      width: 200
    },
    {
      field: "addonCategory",
      headerName: t("settings_page.recycling.additional_category"),
      width: 150,
      type: "string",
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            {params.row.addonCategory ? (
              <CheckIcon className="text-green-primary" />
            ) : (
              <CloseIcon className="text-red" />
            )}
          </div>
        );
      }
    },
    {
      field: "package",
      type: "string",
      headerName: t("inventory.package"),
      width: 200
    },
    {
      field: "senderWarehouse",
      type: "string",
      headerName: t("internalTransfer.sender_warehouse"),
      width: 200
    },
    {
      field: "toWarehouse",
      type: "string",
      headerName: t("internalTransfer.receiver_warehouse"),
      width: 200
    },
    {
      field: "weight",
      type: "string",
      headerName: t("inventory.weight"),
      width: 200
    }
  ];

  const updateQuery = (newQuery: Partial<queryInternalTransfer>) => {
    setQuery({ ...query, ...newQuery });
  };
  const onRejectCheckin = () => {
    setRejectModal(false);
    showSuccessToast(t("pick_up_order.rejected_success"));
    resetPage();
    // setConfirmModal(true)
  };

  const resetPage = async () => {
    setConfirmModal(false);
    setSelectedCheckin([]);
    initInternalTransferRequest();
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(undefined);
  };

  const handleSelectRow = (params: GridRowParams) => {
    setOpen(true);

    const selectedItem = filterShipments?.find(
      (item) => item.id === params.row.id
    );
    setSelectedRow(selectedItem);
  };

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    };
  }, []);

  useEffect(() => {
    setPrimaryColor(
      role === "manufacturer" || role === "customer" ? "#6BC7FF" : "#79CA25"
    );
  }, [role]);

  const handleCateGory = (event: SelectChangeEvent) => {
    setPage(1);
    setCateGory(event.target.value);
    var recycTypeId = event.target.value;
    updateQuery({ recycTypeId: recycTypeId, recycSubTypeId: '' });
  };
  const handleSubCateGory = (event: SelectChangeEvent) => {
    setPage(1);
    setSubCateGory(event.target.value);
    var recycSubTypeId = event.target.value;
    updateQuery({ recycSubTypeId: recycSubTypeId });
  };
  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -15,
      top: 15,
      padding: "0 4px",
      color: "#ffffff",
      backgroundColor: primaryColor
    }
  }));
  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <InternalTransferForm
          onClose={handleClose}
          selectedItem={selectedRow}
        />
      </Modal>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          pr: 4
        }}
      >
        <Grid container alignItems="center">
          <Grid item>
            <StyledBadge badgeContent={shipmentsLength}>
              <div className="title font-bold text-3xl pl-4">
                {t("internalTransfer.internal_transfer_request")}
              </div>
            </StyledBadge>
          </Grid>
        </Grid>
        <Box>
          <Button
            sx={{
              mt: 3,
              width: "90px",
              height: "40px",
              m: 0.5,
              cursor: selectedInternalTransfer.length === 0 ? "not-allowed" : "pointer",
              borderRadius: "20px",
              backgroundColor: primaryColor,
              "&.MuiButton-root:hover": { bgcolor: primaryColor },
              borderColor: primaryColor,
              marginLeft: "20px",
              fontWeight: "bold",
              color: "white"
            }}
            disabled={selectedInternalTransfer.length === 0}
            variant="outlined"
            onClick={() => {
              setApproveModal(selectedInternalTransfer.length > 0);
            }}
          >
            {" "}
            {t("check_in.approve")}
          </Button>
          <Button
            sx={{
              mt: 3,
              width: "90px",
              height: "40px",
              m: 0.5,
              cursor: selectedInternalTransfer.length === 0 ? "not-allowed" : "pointer",
              borderRadius: "20px",
              borderColor: primaryColor,
              borderWidth: 1,
              fontWeight: "bold",
              marginLeft: "20px"
            }}
            variant="outlined"
            disabled={selectedInternalTransfer.length === 0}
            onClick={() => setRejectModal(selectedInternalTransfer.length > 0)}
          >
            {" "}
            {t("check_in.reject")}
          </Button>
        </Box>
        <Box className="filter-section flex justify-between items-center w-full">
          <FormControl sx={styles.inputStyle}>
            <InputLabel id="cateGory-label">
              {t("placeHolder.classification")}
            </InputLabel>
            <Select
              labelId="cateGory-label"
              id="cateGory"
              value={category}
              label={t("placeHolder.classification")}
              onChange={handleCateGory}
            >
              {recycType?.map((val: recycType) =>  {
                return (
                  <MenuItem value={val?.recycTypeId}>{getRecycTypeName(val)}</MenuItem>    
                )
              })}
              <MenuItem value={''}>NoType</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={styles.inputStyle}>
            <InputLabel id="subCateGory-label">
              {t("placeHolder.subclassification")}
            </InputLabel>
            <Select
              labelId="subCateGory-label"
              id="subCateGory"
              value={subCategory}
              label={t("placeHolder.subclassification")}
              onChange={handleSubCateGory}
            >
              {recycType?.find((val: recycType) => val?.recycTypeId === category)
                ?.recycSubType.map((value: recycSubType) => {
                return (
                  <MenuItem value={value?.recycSubTypeId}>{getRecycTypeName(value)}</MenuItem>
                )
              })}
              <MenuItem value={''}>NoType</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <div className="table-overview">
          <Box pr={4} pt={3} sx={{ flexGrow: 1, width: "100%" }}>
            {isLoading ? (
              <CircularLoading />
            ) : (
              <Box>
                {" "}
                <DataGrid
                  rows={filterShipments}
                  getRowId={(row) => row.id}
                  hideFooter
                  columns={headCells}
                  disableRowSelectionOnClick
                  onRowClick={handleSelectRow}
                  getRowSpacing={getRowSpacing}
                  localeText={localeTextDataGrid}
                  getRowClassName={(params) =>
                    `${
                      selectedRow && params.row.id === selectedRow.id
                        ? "selected-row "
                        : ""
                    }${
                      selectedInternalTransfer &&
                      selectedInternalTransfer.includes(params.row.id)
                        ? "checked-row"
                        : ""
                    }`
                  }
                  sx={{
                    border: "none",
                    "& .MuiDataGrid-cell": {
                      border: "none"
                    },
                    "& .MuiDataGrid-row": {
                      bgcolor: "white",
                      borderRadius: "10px"
                    },
                    "&>.MuiDataGrid-main": {
                      "&>.MuiDataGrid-columnHeaders": {
                        borderBottom: "none"
                      }
                    },
                    ".checked-row": {
                      backgroundColor: `rgba(25, 118, 210, 0.08)`
                    },
                    ".MuiDataGrid-columnHeaderTitle": {
                      fontWeight: "bold !important",
                      overflow: "visible !important"
                    },
                    "& .selected-row": {
                      backgroundColor: "#F6FDF2 !important",
                      border: "1px solid #79CA25"
                    }
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
        <RejectForm
          checkedInternalTransferRequest={selectedInternalTransfer}
          open={rejFormModal}
          reasonList={reasonList}
          onClose={() => {
            setRejectModal(false);
          }}
          onRejected={onRejectCheckin}
          navigate={navigate}
        />

        <ApproveModal
          open={approveModal}
          onClose={() => {
            setApproveModal(false);
          }}
          onApprove={() => {
            setApproveModal(false);
            showSuccessToast(t("pick_up_order.approved_success"));
            resetPage();
            // setConfirmModal(true)
          }}
          checkedInternalTransferRequest={selectedInternalTransfer}
          navigate={navigate}
        />
        <ConfirmModal open={confirmModal} onClose={resetPage} />
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
      borderColor: "#79ca25"
    }
  },
  table: {
    minWidth: 750,
    borderCollapse: "separate",
    borderSpacing: "0px 10px"
  },
  headerRow: {
    //backgroundColor: "#97F33B",
    borderRadius: 10,
    mb: 1,
    "th:first-child": {
      borderRadius: "10px 0 0 10px"
    },
    "th:last-child": {
      borderRadius: "0 10px 10px 0"
    }
  },
  row: {
    backgroundColor: "#FBFBFB",
    borderRadius: 10,
    mb: 1,
    "td:first-child": {
      borderRadius: "10px 0 0 10px"
    },
    "td:last-child": {
      borderRadius: "0 10px 10px 0"
    }
  },
  headCell: {
    border: "none",
    fontWeight: "bold"
  },
  bodyCell: {
    border: "none"
  },
  typo: {
    color: "#ACACAC",
    fontSize: 13,
    // fontWeight: "bold",
    display: "flex"
  },
  textField: {
    borderRadius: "10px",
    fontWeight: "500",
    "& .MuiOutlinedInput-input": {
      padding: "10px"
    }
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: "34%",
    height: "fit-content",
    padding: 4,
    backgroundColor: "white",
    border: "none",
    borderRadius: 5
  },
  textArea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    borderColor: "#ACACAC",
    borderRadius: 5
  },
  formButton: {
    ...styles.buttonFilledGreen,
    width: "150px"
  },
  cancelButton: {
    ...styles.buttonOutlinedGreen,
    width: "150px"
  },
  circuitTag: {
    width: "20px",
    height: "20px",
    background: "#79ca25",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%"
  }
};

export default IntermalTransferRequest;
