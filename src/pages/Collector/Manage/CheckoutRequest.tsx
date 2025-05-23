import React, { FunctionComponent, useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridCellParams,
} from "@mui/x-data-grid";
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  InputLabel,
  Button,
  FormControl,
  Pagination,
  MenuItem,
  Modal,
  Typography,
  Divider,
  Checkbox,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import "../../../styles/Base.css";
import { useNavigate } from "react-router-dom";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import CustomItemList from "../../../components/FormComponents/CustomItemList";
import {
  getAllCheckoutRequest,
  updateCheckoutRequestStatus,
  getCheckoutReasons,
  updateCheckout,
} from "../../../APICalls/Collector/checkout";
import { LEFT_ARROW_ICON, SEARCH_ICON } from "../../../themes/icons";
import CheckInDetails from "./CheckOutDetails";
import { CheckOutWarehouse, updateStatus } from "../../../interfaces/warehouse";
import { CheckOut } from "../../../interfaces/checkout";

import { useTranslation } from "react-i18next";
import { styles } from "../../../constants/styles";
import { queryCheckout } from "../../../interfaces/checkout";
import {
  Languages,
  STATUS_CODE,
  localStorgeKeyName,
} from "../../../constants/constant";
import {
  displayCreatedDate,
  extractError,
  getPrimaryColor,
  showSuccessToast,
  debounce,
  showErrorToast,
} from "../../../utils/utils";
import CustomButton from "../../../components/FormComponents/CustomButton";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import CircularLoading from "../../../components/CircularLoading";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import useLocaleTextDataGrid from "../../../hooks/useLocaleTextDataGrid";
import { getPicoById } from "../../../APICalls/Collector/pickupOrder/pickupOrder";
import {
  getTenantById,
  searchTenantById,
} from "../../../APICalls/tenantManage";
import { getWarehouseById } from "src/APICalls/warehouseManage";
dayjs.extend(utc);
dayjs.extend(timezone);

type TableRow = {
  id: number;
  [key: string]: any;
};

type ApproveForm = {
  open: boolean;
  onClose: () => void;
  checkedCheckOut: number[];
  onApprove?: () => void;
  checkOutData: CheckOut[];
  navigate: (url: string) => void;
};

type RejectForm = {
  open: boolean;
  onClose: () => void;
  checkedCheckOut: number[];
  onRejected?: () => void;
  reasonList: any;
  checkOutData: CheckOut[];
  navigate: (url: string) => void;
};

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

const ApproveModal: React.FC<ApproveForm> = ({
  open,
  onClose,
  checkedCheckOut,
  onApprove,
  checkOutData,
  navigate,
}) => {
  const { t } = useTranslation();
  const loginId = localStorage.getItem(localStorgeKeyName.username) || "";
  const handleApproveRequest = async () => {
    const confirmReason: string[] = ["Confirmed"];

    const results = await Promise.allSettled(
      checkedCheckOut.map(async (chkOutId) => {
        const selected = checkOutData.find(
          (value) => value.chkOutId === chkOutId
        );
        try {
          const statReason: updateStatus = {
            status: "CONFIRMED",
            reason: confirmReason,
            updatedBy: loginId,
            version: selected?.version ?? 0,
          };
          const result = await updateCheckoutRequestStatus(
            chkOutId,
            statReason
          );
          const data = result?.data;
          if (data) {
            data.checkoutDetail.map(async (detail: any) => {
              if (data.picoDtlId) {
                const picoAPI = await getPicoById(selected?.picoId ?? "");
                const picoResult = picoAPI.data.pickupOrderDetail.find(
                  (value: { picoDtlId: number }) =>
                    value.picoDtlId === data.picoDtlId
                );

                const dataCheckout: CheckOutWarehouse = {
                  checkOutWeight: detail.weight || 0,
                  checkOutUnitId: detail.unitId || 0,
                  checkOutAt: data.updatedAt || "",
                  checkOutBy: data.updatedBy || "",
                  updatedBy: loginId,
                  version: picoResult.version,
                };
                return await updateCheckout(
                  chkOutId,
                  dataCheckout,
                  data.picoDtlId
                );
              }
            });

            if (onApprove) {
              onApprove();
            }
          }
        } catch (error: any) {
          const { state } = extractError(error);
          if (state.code === STATUS_CODE[503]) {
            navigate("/maintenance");
          } else if (state.code === STATUS_CODE[409]) {
            showErrorToast(error?.response?.data?.message);
          }
        }
      })
    );
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
          {/* <Box className="flex gap-2 justify-start">
            <Typography sx={localstyles.typo}>
              {t('check_out.total_checkout') + checkedCheckOut.length}
            </Typography>
          </Box> */}

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

const RejectModal: React.FC<RejectForm> = ({
  open,
  onClose,
  checkedCheckOut,
  onRejected,
  reasonList,
  checkOutData,
  navigate,
}) => {
  const { t } = useTranslation();
  const [rejectReasonId, setRejectReasonId] = useState<string[]>([]);

  const handleRejectRequest = async (rejectReasonId: string[]) => {
    const rejectReason = rejectReasonId.map((id) => {
      const reasonItem = reasonList.find(
        (reason: { id: string }) => reason.id === id
      );
      return reasonItem ? reasonItem.name : "";
    });
    const loginId = localStorage.getItem(localStorgeKeyName.username) || "";

    const results = await Promise.allSettled(
      checkedCheckOut.map(async (chkOutId) => {
        const selected = checkOutData.find(
          (value) => value.chkOutId === chkOutId
        );
        try {
          const statReason: updateStatus = {
            status: "REJECTED",
            reason: rejectReason,
            updatedBy: loginId,
            version: selected?.version ?? 0,
          };
          const result = await updateCheckoutRequestStatus(
            chkOutId,
            statReason
          );
          const data = result?.data;
          if (data) {
            if (onRejected) {
              onRejected();
            }
          }
        } catch (error: any) {
          const { state } = extractError(error);
          if (state.code === STATUS_CODE[503]) {
            navigate("/maintenance");
          } else if (state.code === STATUS_CODE[409]) {
            showErrorToast(error?.response?.data?.message);
          }
        }
      })
    );
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
              {t("check_out.confirm_reject")}
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography sx={localstyles.typo}>
              {t("check_out.reject_reasons")}
            </Typography>
            {/* <Typography sx={localstyles.typo}>
              {t('check_out.total_checkout') + checkedCheckOut.length}
            </Typography> */}
            <CustomItemList
              items={reasonList}
              multiSelect={setRejectReasonId}
              itemColor={{ bgColor: "#F0F9FF", borderColor: getPrimaryColor() }}
            />
          </Box>

          <Box sx={{ alignSelf: "center" }}>
            <CustomButton
              text={t("check_in.confirm")}
              color="blue"
              style={{ width: "175px", marginRight: "10px" }}
              onClick={() => {
                handleRejectRequest(rejectReasonId);
                onClose();
              }}
            />
            <CustomButton
              text={t("check_in.cancel")}
              color="blue"
              outlined
              style={{ width: "175px" }}
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

type CompanyNameLanguages = {
  labelEnglish: string;
  labelSimpflifed: string;
  labelTraditional: string;
};

const CheckoutRequest: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const titlePage = t("check_out.request_check_out");
  const approveLabel = t("check_out.approve");
  const rejectLabel = t("check_out.reject");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rejFormModal, setRejectModal] = useState<boolean>(false);
  const [approveModal, setApproveModal] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CheckOut>();
  const [checkedCheckOut, setCheckedCheckOut] = useState<number[]>([]);
  const [unCheckedCheckOut, setUnCheckedCheckOut] = useState<number[]>([]);
  const [company, setCompany] = useState("");
  const [filterCheckOut, setFilterCheckOut] = useState<CheckOut[]>([]);
  const [checkOutRequest, setCheckoutRequest] = useState<CheckOut[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalData, setTotalData] = useState<number>(0);
  const [query, setQuery] = useState<queryCheckout>({
    picoId: "",
    receiverName: "",
    receiverAddr: "",
  });
  const [reasonList, setReasonList] = useState<any>([]);
  const {
    dateFormat,
    manuList,
    collectorList,
    logisticList,
    companies,
    currentTenant,
  } = useContainer(CommonTypeContainer);
  const { localeTextDataGrid } = useLocaleTextDataGrid();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const getRejectReason = async () => {
    try {
      let result = await getCheckoutReasons();
      if (result?.data?.content.length > 0) {
        let reasonName = "";
        switch (i18n.language) {
          case "enus":
            reasonName = "reasonNameEng";
            break;
          case "zhch":
            reasonName = "reasonNameSchi";
            break;
          default:
            reasonName = "reasonNameTchi";
            break;
        }
        result?.data?.content.map(
          (item: { [x: string]: any; id: any; reasonId: any; name: any }) => {
            item.id = item.reasonId;
            item.name = item[reasonName];
          }
        );
        console.log(reasonList, "reasonlist");
        setReasonList(result?.data?.content);
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    const selectedRows = checked
      ? filterCheckOut.map((row) => row.chkOutId)
      : [];
    setCheckedCheckOut(selectedRows);
    // console.log('handleSelectAll', selectedRows)
  };

  const handleRowCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    chkOutId: number
  ) => {
    setDrawerOpen(false);
    setSelectedRow(undefined);

    const checked = event.target.checked;

    if (checked) {
      setCheckedCheckOut((prev) => [...prev, chkOutId]);
      setUnCheckedCheckOut((prev) => {
        const unCheck = prev.filter((id) => id !== chkOutId);
        return unCheck;
      });
    } else {
      const updatedChecked = checkedCheckOut.filter(
        (rowId) => rowId != chkOutId
      );
      setCheckedCheckOut(updatedChecked);
      setUnCheckedCheckOut((prev) => [...prev, chkOutId]);
    }
    // const updatedChecked = checked
    //   ? [...checkedCheckOut, chkOutId]
    //   : checkedCheckOut.filter((rowId) => rowId != chkOutId)
    // setCheckedCheckOut(updatedChecked)
    // console.log(updatedChecked)

    // const allRowsChecked = filterCheckOut.every((row) =>
    //   updatedChecked.includes(row.chkOutId)
    // )
    // setSelectAll(allRowsChecked)
  };

  const HeaderCheckbox = (
    <Checkbox
      checked={selectAll}
      onChange={handleSelectAll}
      color="primary"
      inputProps={{ "aria-label": "Select all rows" }}
    />
  );

  useEffect(() => {
    if (selectAll) {
      const newIds: number[] = [];
      filterCheckOut.map((item) => item.chkOutId);
      for (let item of filterCheckOut) {
        if (!unCheckedCheckOut.includes(item.chkOutId)) {
          newIds.push(item.chkOutId);
        }
      }
      const allId: number[] = [...checkedCheckOut, ...newIds];
      const ids = new Set(allId);
      setCheckedCheckOut(Array.from(ids));
    }
  }, [filterCheckOut]);

  useEffect(() => {
    if (checkedCheckOut.length === 0) {
      setSelectAll(false);
    }
  }, [checkedCheckOut]);

  const checkboxColumn: GridColDef = {
    field: "customCheckbox",
    headerName: t("localizedTexts.select"),
    width: 80,
    sortable: false,
    filterable: false,
    renderHeader: () => HeaderCheckbox,
    renderCell: (params) => (
      <Checkbox
        checked={checkedCheckOut.includes(params.row?.chkOutId)}
        onChange={(event) =>
          handleRowCheckboxChange(event, params.row.chkOutId)
        }
        color="primary"
      />
    ),
  };

  const checkoutHeader: GridColDef[] = [
    checkboxColumn,
    {
      field: "createdAt",
      headerName: t("check_out.created_at"),
      type: "string",
      width: 200,
    },
    {
      field: "senderCompany",
      headerName: t("check_in.sender_company"),
      width: 150,
      type: "string",
    },
    {
      field: "receiverName",
      headerName: t("check_in.receiver_company"),
      type: "string",
      width: 150,
    },
    {
      field: "picoId",
      headerName: t("check_out.pickup_order_no"),
      width: 150,
      type: "string",
    },
    {
      field: "adjustmentFlg",
      headerName: t("check_out.stock_adjustment"),
      width: 150,
      type: "string",
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            {params.row.adjustmentFlg ? (
              <CheckIcon className="text-green-primary" />
            ) : (
              <CloseIcon className="text-red" />
            )}
          </div>
        );
      },
    },
    {
      field: "logisticName",
      headerName: t("check_out.logistic_company"),
      width: 200,
      type: "string",
    },
    {
      field: "senderAddr",
      headerName: t("check_out.shipping_location"),
      type: "string",
      width: 200,
      valueGetter: (params) => {
        // Check if senderAddr exists, if not use senderAddress
        return params.row.senderAddr || params.row.senderAddress || "-";
      },
    },
    {
      field: "receiverAddr",
      headerName: t("pick_up_order.detail.arrived"),
      width: 200,
      type: "string",
    },
  ];

  const transformToTableRow = (item: CheckOut): TableRow => {
    const dateInHK = dayjs.utc(item.createdAt).tz("Asia/Hong_Kong");
    const createdAt = dateInHK.format(`${dateFormat} HH:mm`);
    return {
      id: item.chkOutId,
      chkOutId: item.chkOutId,
      createdAt: createdAt,
      vehicleTypeId: item.vehicleTypeId,
      receiverName: item.receiverName,
      picoId: item.picoId,
      adjustmentFlg: item.adjustmentFlg,
      logisticName: item.logisticName,
      receiverAddr: item.receiverAddr,
      receiverAddrGps: "-",
      status: item.status,
    };
  };

  const getPicoDetail = async (picoId: string) => {
    try {
      const pico = await getPicoById(picoId);
      if (pico) {
        return pico.data;
      }
    } catch (error) {
      return null;
    }
  };

  const getCompanyNameById = (id: number): string => {
    let { ENUS, ZHCH, ZHHK } = Languages;
    let companyName: string = "";
    const company = companies.find((item) => item.id === id);
    if (company) {
      if (i18n.language === ENUS) companyName = company.nameEng ?? "";
      if (i18n.language === ZHCH) companyName = company.nameSchi ?? "";
      if (i18n.language === ZHHK) companyName = company.nameTchi ?? "";
    }

    return companyName;
  };

  const getReceiverCompany = async (id: string) => {
    let companyName: string = "";
    const result = await getTenantById(Number(id));
    const data = result.data;
    if (i18n.language === "enus") {
      companyName = data.companyNameEng;
    } else if (i18n.language === "zhch") {
      companyName = data.companyNameSchi;
    } else {
      companyName = data.companyNameTchi;
    }

    return companyName;
  };

  const getSenderCompany = (): string => {
    let senderCompany: string = "";
    if (i18n.language === Languages.ENUS)
      senderCompany = currentTenant?.nameEng ?? "";
    if (i18n.language === Languages.ZHCH)
      senderCompany = currentTenant?.nameSchi ?? "";
    if (i18n.language === Languages.ZHHK)
      senderCompany = currentTenant?.nameTchi ?? "";
    return senderCompany;
  };

  const getWarehouseDetail = async (id: number) => {
    try {
      const warehouse = await getWarehouseById(id);
      return warehouse.data;
    } catch (error) {
      return null;
    }
  };

  const cacheWarehouse: any = {};

  const getWarehouseAddres = async (warehouseId: number) => {
    let deliveryAddress: string = "";
    if (warehouseId in cacheWarehouse) {
      deliveryAddress = cacheWarehouse[warehouseId].address;
    } else {
      const warehouse = await getWarehouseDetail(warehouseId);

      if (warehouse) {
        cacheWarehouse[warehouseId] = {
          isExist: true,
          address: warehouse.location,
        };
        deliveryAddress = warehouse.location;
      } else {
        cacheWarehouse[warehouseId] = {
          isExist: false,
          address: "",
        };
      }
    }
    return deliveryAddress;
  };

  const getCheckoutRequest = async () => {
    setIsLoading(true);
    try {
      const result = await getAllCheckoutRequest(page - 1, pageSize, query);
      const data = result?.data.content;
      if (data && data.length > 0) {
        let checkoutData: CheckOut[] = [];
        for (let item of data) {
          if (item.status !== "CREATED") continue;
          const dateInHK = dayjs.utc(item.createdAt).tz("Asia/Hong_Kong");
          const createdAt = dateInHK.format(`${dateFormat} HH:mm`);
          item.createdAt = createdAt;
          if (item.picoId) {
            const picoDetail = await getPicoDetail(item.picoId);
            const choosenPicoDetail = picoDetail?.pickupOrderDetail?.find(
              (value: { picoDtlId: any }) => value.picoDtlId === item.picoDtlId
            );
            if (choosenPicoDetail) {
              item.senderName = choosenPicoDetail.senderName;
              item.senderAddr = choosenPicoDetail.senderAddr;
            }
          }
          if (!isNaN(item?.logisticId)) {
            const companyName = getCompanyNameById(Number(item?.logisticId));
            item.logisticName =
              companyName !== "" ? companyName : item.logisticName;
          }
          if (!isNaN(item.receiverId)) {
            const companyName = await getReceiverCompany(item.receiverId);
            item.receiverName =
              item.receiverId !== "" ? companyName : item.receiverName;
          }
          if (item?.warehouseId) {
            item.senderAddress =
              (await getWarehouseAddres(item.warehouseId)) ?? "";
          }

          item.senderCompany = getSenderCompany();

          checkoutData.push(item);
        }

        setCheckoutRequest(checkoutData);
        setFilterCheckOut(checkoutData);
      } else {
        setFilterCheckOut([]);
      }
      setTotalData(result?.data.totalPages);
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCheckoutRequest();
    getRejectReason();
  }, [page, query, dateFormat, i18n.language]);

  const updateQuery = (newQuery: Partial<queryCheckout>) => {
    setQuery({ ...query, ...newQuery });
  };

  const handleSearchByPoNumb = debounce((searchWord: string) => {
    setPage(1);
    updateQuery({ picoId: searchWord });
  }, 1000);

  const handleCompanyChange = (event: SelectChangeEvent) => {
    // console.log("company", event.target.value)
    setPage(1);
    setCompany(event.target.value);
    var searchWord = event.target.value;
    updateQuery({ receiverName: searchWord });
  };

  const handleLocChange = (event: SelectChangeEvent) => {
    setPage(1);
    setLocation(event.target.value);
    var searchWord = event.target.value;
    updateQuery({ receiverAddr: searchWord });
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedRow(undefined);
  };

  const handleSelectRow = (params: GridRowParams) => {
    const row = params.row;
    // console.log('row', row)
    const selectedItem = checkOutRequest?.find(
      (item) => item.chkOutId === row.chkOutId
    );

    setSelectedRow(selectedItem);

    setDrawerOpen(true);
  };

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
    };
  }, []);

  const resetPage = async () => {
    setConfirmModal(false);
    setCheckedCheckOut([]);
    await getCheckoutRequest();
  };

  const [primaryColor, setPrimaryColor] = useState<string>("#79CA25");
  const role = localStorage.getItem(localStorgeKeyName.role);

  useEffect(() => {
    setPrimaryColor(
      role === "manufacturer" || role === "customer" ? "#6BC7FF" : "#79CA25"
    );
  }, [role]);

  const getTranslationCompanyName = (name: string): string => {
    let companyName: string = "";
    const logistic = logisticList?.find((item) => {
      const { logisticNameEng, logisticNameSchi, logisticNameTchi } = item;
      if (
        logisticNameEng === name ||
        logisticNameSchi === name ||
        logisticNameTchi === name
      ) {
        return item;
      }
    });

    if (logistic) {
      if (i18n.language === Languages.ENUS)
        companyName = logistic.logisticNameEng;
      if (i18n.language === Languages.ZHCH)
        companyName = logistic.logisticNameSchi;
      if (i18n.language === Languages.ZHHK)
        companyName = logistic.logisticNameTchi;
    }
    return companyName;
  };

  const listTranslationCompanyName = (): CompanyNameLanguages[] => {
    const manufacturerCompany: CompanyNameLanguages[] =
      manuList?.map((item) => {
        return {
          labelEnglish: item?.manufacturerNameEng ?? "",
          labelSimpflifed: item?.manufacturerNameSchi ?? "",
          labelTraditional: item?.manufacturerNameTchi ?? "",
        };
      }) ?? [];

    const collectorCompany: CompanyNameLanguages[] =
      collectorList?.map((item) => {
        return {
          labelEnglish: item?.collectorId ?? "",
          labelSimpflifed: item?.collectorNameSchi ?? "",
          labelTraditional: item?.collectorNameTchi ?? "",
        };
      }) ?? [];

    return [...manufacturerCompany, ...collectorCompany];
  };

  const companyReceiverSender = listTranslationCompanyName();

  const getTranslationCompany = (name: string): string => {
    let companyName: string = "";
    const company = companyReceiverSender.find((item) => {
      console.log(item, "itemmm");
      const { labelEnglish, labelSimpflifed, labelTraditional } = item;
      if (
        name === labelEnglish ||
        name === labelSimpflifed ||
        name === labelTraditional
      ) {
        return item;
      }
    });

    if (company) {
      if (i18n.language === Languages.ENUS) companyName = company.labelEnglish;
      if (i18n.language === Languages.ZHCH)
        companyName = company.labelSimpflifed;
      if (i18n.language === Languages.ZHHK)
        companyName = company.labelTraditional;
    }

    return companyName;
  };

  return (
    <Box className="container-wrapper w-full mr-11">
      <div className="overview-page bg-bg-primary">
        <div
          className="header-page flex justify-start items-center mb-4 cursor-pointer"
          onClick={() => navigate("/warehouse")}
        >
          <LEFT_ARROW_ICON fontSize="large" />
          <div className="title font-bold text-3xl pl-4 ">{titlePage}</div>
        </div>
        <div className="action-overview mb-2">
          <Button
            sx={[
              styles.buttonFilledGreen,
              {
                mt: 3,
                width: "90px",
                height: "40px",
                m: 0.5,
                backgroundPositionXackground:
                  checkedCheckOut.length === 0 ? "white" : "",
                cursor:
                  checkedCheckOut.length === 0 ? "not-allowed" : "pointer",
              },
            ]}
            disabled={checkedCheckOut.length === 0 || !isAdmin}
            variant="outlined"
            onClick={() => setApproveModal(checkedCheckOut.length > 0)}
          >
            {approveLabel}
          </Button>
          <Button
            sx={[
              styles.buttonOutlinedGreen,
              {
                mt: 3,
                width: "90px",
                height: "40px",
                m: 0.5,
              },
            ]}
            disabled={checkedCheckOut.length === 0 || !isAdmin}
            variant="outlined"
            onClick={() => setRejectModal(checkedCheckOut.length > 0)}
          >
            {rejectLabel}
          </Button>
        </div>
        <div className="filter-section flex justify-between items-center w-full">
          <TextField
            id="searchShipment"
            onChange={(event) => handleSearchByPoNumb(event.target.value)}
            sx={styles.inputStyle}
            label={t("check_in.pickup_order_no")}
            placeholder={t("check_in.input_po_no")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => {}}>
                    <SEARCH_ICON style={{ color: primaryColor }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={styles.inputStyle}>
            <InputLabel id="company-label" sx={styles.textFieldLabel}>
              {t("check_out.receiver_company")}
            </InputLabel>
            <Select
              labelId="company-label"
              id="company"
              value={company}
              label={t("check_in.receiver_company")}
              onChange={handleCompanyChange}
            >
              {filterCheckOut
                ?.filter(
                  (item, index, self) =>
                    index ===
                    self.findIndex((t) => t.receiverName === item.receiverName)
                )
                .map((item, index) => (
                  <MenuItem key={index} value={item.receiverName}>
                    {item.receiverName}
                  </MenuItem>
                ))}
              <MenuItem value="">
                <em>{t("check_in.any")}</em>
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={styles.inputStyle}>
            <InputLabel id="location-label" sx={styles.textFieldLabel}>
              {t("check_out.location")}
            </InputLabel>
            <Select
              labelId="location-label"
              id="location"
              value={location}
              label={t("check_out.location")}
              onChange={handleLocChange}
            >
              {filterCheckOut
                ?.filter(
                  (item, index, self) =>
                    index ===
                    self.findIndex((t) => t.receiverAddr === item.receiverAddr)
                )
                .map((item, index) => (
                  <MenuItem key={index} value={item.receiverAddr}>
                    {item.receiverAddr}
                  </MenuItem>
                ))}
              <MenuItem value="">
                <em>{t("check_out.any")}</em>
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="table-overview w-full">
          <Box pr={4} pt={3} sx={{ flexGrow: 1, width: "100%" }}>
            {isLoading ? (
              <CircularLoading />
            ) : (
              <Box>
                <DataGrid
                  rows={filterCheckOut}
                  getRowId={(row) => row.chkOutId}
                  hideFooter
                  columns={checkoutHeader}
                  disableRowSelectionOnClick
                  onRowClick={handleSelectRow}
                  getRowSpacing={getRowSpacing}
                  localeText={localeTextDataGrid}
                  getRowClassName={(params) =>
                    `${
                      selectedRow &&
                      params.row.chkOutId === selectedRow.chkOutId
                        ? "selected-row "
                        : ""
                    }${
                      checkedCheckOut &&
                      checkedCheckOut.includes(params.row.chkOutId)
                        ? "checked-row"
                        : ""
                    }`
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
                    ".checked-row": {
                      backgroundColor: `rgba(25, 118, 210, 0.08)`,
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
      <RejectModal
        open={rejFormModal}
        onClose={() => {
          setRejectModal(false);
        }}
        checkedCheckOut={checkedCheckOut}
        reasonList={reasonList}
        onRejected={() => {
          setRejectModal(false);
          showSuccessToast(t("pick_up_order.rejected_success"));
          resetPage();
          // setConfirmModal(true)
        }}
        checkOutData={checkOutRequest ?? []}
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
        checkedCheckOut={checkedCheckOut}
        checkOutData={checkOutRequest ?? []}
        navigate={navigate}
      />
      <ConfirmModal open={confirmModal} onClose={resetPage} />
      <CheckInDetails
        drawerOpen={drawerOpen}
        handleDrawerClose={handleDrawerClose}
        selectedCheckOut={selectedRow}
      />
    </Box>
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

export default CheckoutRequest;
