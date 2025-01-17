import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Stack,
  TableRow,
  TextField,
  Typography,
  Pagination,
  Divider,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
} from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { SEARCH_ICON, LEFT_ARROW_ICON } from "../../themes/icons";
import { useEffect, useState } from "react";
import React from "react";
import { styles } from "../../constants/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import CustomItemList from "../../components/FormComponents/CustomItemList";
import {
  getAllCheckInRequests,
  updateCheckinStatus,
  getCheckinReasons,
  updateCheckin,
  getDetailCheckInRequests,
} from "../../APICalls/Collector/warehouseManage";
import CircularLoading from "../../components/CircularLoading";
import { CheckInWarehouse, updateStatus } from "../../interfaces/warehouse";
import RequestForm from "../../components/FormComponents/RequestForm";
import { CheckIn } from "../../interfaces/checkin";
import {
  Languages,
  STATUS_CODE,
  localStorgeKeyName,
} from "../../constants/constant";
import {
  displayCreatedDate,
  extractError,
  getPrimaryColor,
  showSuccessToast,
  debounce,
  showErrorToast,
} from "../../utils/utils";
import { useTranslation } from "react-i18next";
import { queryCheckIn } from "../../interfaces/checkin";
import CustomButton from "../../components/FormComponents/CustomButton";
import i18n from "../../setups/i18n";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import useLocaleTextDataGrid from "../../hooks/useLocaleTextDataGrid";
import { getPicoById } from "../../APICalls/Collector/pickupOrder/pickupOrder";
import { getTenantById } from "../../APICalls/tenantManage";
import { getWarehouseById } from "../../APICalls/warehouseManage";

dayjs.extend(utc);
dayjs.extend(timezone);

type CompanyNameLanguages = {
  labelEnglish: string;
  labelSimpflifed: string;
  labelTraditional: string;
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
  checkedShipments: number[];
  onRejected?: () => void;
  reasonList: any;
  checkInData: CheckIn[];
  navigate: (url: string) => void;
};

function RejectForm({
  open,
  onClose,
  checkedShipments,
  onRejected,
  reasonList,
  checkInData,
  navigate,
}: rejectForm) {
  const { t } = useTranslation();

  const [rejectReasonId, setRejectReasonId] = useState<string[]>([]);

  const handleConfirmRejectOnClick = async (rejectReasonId: string[]) => {
    const rejectReason = rejectReasonId.map((id) => {
      const reasonItem = reasonList.find(
        (reason: { id: string }) => reason.id === id
      );
      return reasonItem ? reasonItem.name : "";
    });
    const loginId = localStorage.getItem(localStorgeKeyName.username) || "";

    const results = await Promise.allSettled(
      checkedShipments.map(async (checkInId) => {
        const selected = checkInData.find(
          (value) => value.chkInId === checkInId
        );
        try {
          const statReason: updateStatus = {
            status: "REJECTED",
            reason: rejectReason,
            updatedBy: loginId,
            version: selected?.version ?? 0,
          };
          const result = await updateCheckinStatus(checkInId, statReason);
          const data = result?.data;
          if (data) {
            // console.log("updated check-in status: ", data);
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
              {t("check_in.confirm_reject")}
            </Typography>
          </Box>
          <Box>
            <Typography sx={localstyles.typo}>
              {t("check_in.reject_reasons")}
            </Typography>
            {/* <Typography sx={localstyles.typo}>
              {t('check_out.total_checkout') + checkedShipments.length}
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
                handleConfirmRejectOnClick(rejectReasonId);
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
}

type ApproveForm = {
  open: boolean;
  onClose: () => void;
  checkedCheckIn: number[];
  onApprove?: () => void;
  checkInData: CheckIn[];
  navigate: (url: string) => void;
};

interface CheckInDetail {
  chkInDtlId: number;
  recycTypeId: string;
  recycSubTypeId: string;
  packageTypeId: string;
  weight: number;
  unitId: string;
  itemId: number;
  picoDtlId: number;
  checkinDetailPhoto: {
    sid: number;
    photo: string;
  }[];
  createdBy: string;
  updatedBy: string;
}

const ApproveModal: React.FC<ApproveForm> = ({
  open,
  onClose,
  checkedCheckIn,
  onApprove,
  checkInData,
  navigate,
}) => {
  const { t } = useTranslation();
  const loginId = localStorage.getItem(localStorgeKeyName.username) || "";
  const handleApproveRequest = async () => {
    const confirmReason: string[] = ["Confirmed"];

    const results = await Promise.allSettled(
      checkedCheckIn.map(async (checkInId) => {
        const selected = checkInData.find(
          (value) => value.chkInId === checkInId
        );
        try {
          const statReason: updateStatus = {
            status: "CONFIRMED",
            reason: confirmReason,
            updatedBy: loginId,
            version: selected?.version ?? 0,
          };
          const result = await updateCheckinStatus(checkInId, statReason);
          const data = result?.data;
          if (data) {
            // console.log('updated check-in status: ', data)

            // Map over each item in checkinDetail
            data.checkinDetail.map(async (detail: any) => {
              if (detail.picoDtlId) {
                const picoAPI = await getPicoById(selected?.picoId ?? "");
                const picoResult = picoAPI.data.pickupOrderDetail.find(
                  (value: { picoDtlId: number }) =>
                    value.picoDtlId === detail.picoDtlId
                );

                const dataCheckin: CheckInWarehouse = {
                  checkInWeight: detail.weight || 0,
                  checkInUnitId: detail.unitId || 0,
                  checkInAt: data.updatedAt || "",
                  checkInBy: data.updatedBy || "",
                  updatedBy: loginId,
                  version: picoResult.version,
                };
                return await updateCheckin(
                  checkInId,
                  dataCheckin,
                  detail.picoDtlId
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
              {t('check_out.total_checkout') + checkedCheckIn.length}
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

type TableRow = {
  id: number;
  [key: string]: any;
};

function ShipmentManage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCheckin, setSelectedCheckin] = useState<number[]>([]);
  const [selectedUnCheckin, setSelectedUnCheckin] = useState<number[]>([]);
  const [filterShipments, setFilterShipments] = useState<CheckIn[]>([]);
  const [rejFormModal, setRejectModal] = useState<boolean>(false);
  const [approveModal, setApproveModal] = useState<boolean>(false);
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkedShipments, setCheckedShipments] = useState<CheckIn[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CheckIn>();
  const [checkInRequest, setCheckInRequest] = useState<CheckIn[]>();
  const [page, setPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState(false);
  const pageSize = 10;
  const [totalData, setTotalData] = useState<number>(0);
  const [query, setQuery] = useState<queryCheckIn>({
    picoId: "",
    senderName: "",
    senderAddr: "",
  });
  const [primaryColor, setPrimaryColor] = useState<string>("#79CA25");
  const [reasonList, setReasonList] = useState<any>([]);
  const { dateFormat } = useContainer(CommonTypeContainer);
  const { localeTextDataGrid } = useLocaleTextDataGrid();
  const { logisticList, manuList, collectorList, companies, currentTenant } =
    useContainer(CommonTypeContainer);
  const role = localStorage.getItem(localStorgeKeyName.role);
  const isAdmin = localStorage.getItem("isAdmin") === "true";

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
        setReasonList(result?.data?.content);
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };
  useEffect(() => {
    initCheckInRequest();
    getRejectReason();
  }, [page, query, dateFormat, i18n.language]);

  const transformToTableRow = (item: CheckIn): TableRow => {
    const dateInHK = dayjs.utc(item.createdAt).tz("Asia/Hong_Kong");
    const createdAt = dateInHK.format(`${dateFormat} HH:mm`);

    return {
      id: item.chkInId,
      chkInId: item.chkInId,
      createdAt: createdAt,
      senderName: item.senderName,
      recipientCompany: item.recipientCompany,
      picoId: item.picoId,
      adjustmentFlg: item.adjustmentFlg,
      logisticName: item.logisticName,
      senderAddr: item.senderAddr,
      deliveryAddress: item.deliveryAddress,
      status: item.status,
      checkinDetail: item.checkinDetail,
    };
  };

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

  const getRecepientCompany = (): string => {
    let recipientCompany: string = "";
    if (i18n.language === Languages.ENUS)
      recipientCompany = currentTenant?.nameEng ?? "";
    if (i18n.language === Languages.ZHCH)
      recipientCompany = currentTenant?.nameSchi ?? "";
    if (i18n.language === Languages.ZHHK)
      recipientCompany = currentTenant?.nameTchi ?? "";
    return recipientCompany;
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

  const initCheckInRequest = async () => {
    setIsLoading(true);
    try {
      const result = await getAllCheckInRequests(page - 1, pageSize, query);
      if (result) {
        const data = result?.data?.content;
        if (data && data.length > 0) {
          const newData: CheckIn[] = [];
          for (let item of data) {
            const dateInHK = dayjs.utc(item.createdAt).tz("Asia/Hong_Kong");
            item.createdAt = dateInHK.format(`${dateFormat} HH:mm`);
            if (item.picoId) {
              const picoDetail = await getPicoDetail(item.picoId);
              const choosenPicoDetail = picoDetail?.pickupOrderDetail?.find(
                (value: { picoDtlId: any }) =>
                  value.picoDtlId === item.picoDtlId
              );

              if (choosenPicoDetail) {
                item.receiverName = choosenPicoDetail.receiverName;
                item.receiverAddr = choosenPicoDetail.receiverAddr;
              }
            }

            if (item?.logisticId) {
              const companyName = getCompanyNameById(Number(item.logisticId));
              item.logisticName =
                companyName === "" ? item.logisticName : companyName;
            }

            if (item.senderId) {
              const companyName = getCompanyNameById(Number(item.senderId));
              item.senderName =
                companyName === "" ? item.senderName : companyName;
            }

            item.recipientCompany = getRecepientCompany();

            if (item.warehouseId) {
              item.deliveryAddress =
                (await getWarehouseAddres(item.warehouseId)) ?? "";
            }
            newData.push(item);
          }
          // const checkinData = newData.map(transformToTableRow)
          setCheckInRequest(newData);
          setFilterShipments(newData);
        } else {
          setFilterShipments([]);
        }
        setTotalData(result?.data.totalPages);
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
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
      ? filterShipments.map((row) => row.chkInId)
      : [];
    setSelectedCheckin(selectedRows);
  };

  useEffect(() => {
    if (selectAll) {
      let newIds: number[] = [];

      for (let item of filterShipments) {
        if (!selectedUnCheckin.includes(item.chkInId)) {
          newIds.push(item.chkInId);
        }
      }

      const allId: number[] = [...selectedCheckin, ...newIds];
      const ids = new Set(allId);
      setSelectedCheckin(Array.from(ids));
    }
  }, [filterShipments]);

  useEffect(() => {
    if (selectedCheckin.length === 0) {
      setSelectAll(false);
    }
  }, [selectedCheckin]);

  const handleRowCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    chkInId: number
  ) => {
    setOpen(false);
    setSelectedRow(undefined);

    const checked = event.target.checked;
    if (checked) {
      setSelectedCheckin((prev) => [...prev, chkInId]);
      setSelectedUnCheckin((prev) => {
        const unCheck = prev.filter((id) => id !== chkInId);
        return unCheck;
      });
    } else {
      const updatedChecked = selectedCheckin.filter(
        (rowId) => rowId != chkInId
      );
      setSelectedCheckin(updatedChecked);
      setSelectedUnCheckin((prev) => [...prev, chkInId]);
    }
    // const updatedChecked = checked
    //   ? [...selectedCheckin, chkInId]
    //   : selectedCheckin.filter((rowId) => rowId != chkInId)
    // setSelectedCheckin(updatedChecked)
    // console.log('updatedChecked', updatedChecked)
    // console.log(updatedChecked)

    // const allRowsChecked = filterShipments.every((row) =>
    //   updatedChecked.includes(row.chkInId)
    // )
    // // setSelectAll(allRowsChecked)
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
        checked={selectedCheckin?.includes(params.row?.chkInId)}
        onChange={(event) => handleRowCheckboxChange(event, params.row.chkInId)}
        color="primary"
      />
    ),
  };

  const headCells: GridColDef[] = [
    checkboxColumn,
    {
      field: "createdAt",
      type: "string",
      headerName: t("check_in.check_in"),
      width: 150,
    },
    {
      field: "senderName",
      type: "string",
      headerName: t("check_in.sender_company"),
      width: 200,
    },
    {
      field: "recipientCompany",
      type: "string",
      headerName: t("check_in.receiver_company"),
      width: 200,
    },
    {
      field: "picoId",
      type: "string",
      headerName: t("check_in.pickup_order_no"),
      width: 200,
    },
    {
      field: "adjustmentFlg",
      headerName: t("check_in.stock_adjustment"),
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
      type: "string",
      headerName: t("check_in.logistic_company"),
      width: 200,
    },
    {
      field: "senderAddr",
      type: "string",
      headerName: t("check_out.shipping_location"),
      width: 200,
    },
    {
      field: "receiverAddr",
      type: "string",
      headerName: t("pick_up_order.detail.arrived"),
      width: 200,
    },
    // {
    //   field: 'status',
    //   type: 'string',
    //   headerName: t('processRecord.status'),
    //   width: 200
    // }
  ];

  const updateQuery = (newQuery: Partial<queryCheckIn>) => {
    setQuery({ ...query, ...newQuery });
  };

  const handleFilterPoNum = debounce((searchWord: string) => {
    setPage(1);
    updateQuery({ picoId: searchWord });
  }, 1000);

  const handleComChange = (event: SelectChangeEvent) => {
    setPage(1);
    setCompany(event.target.value);
    var searchWord = event.target.value;
    updateQuery({ senderName: searchWord });
  };

  const handleLocChange = (event: SelectChangeEvent) => {
    setPage(1);
    setLocation(event.target.value);
    var searchWord = event.target.value;
    updateQuery({ senderAddr: searchWord });
  };

  // const handleApproveOnClick = async () => {
  //   // console.log(checkedShipments);
  //   const checkInIds = checkedShipments.map(
  //     (checkedShipments) => checkedShipments.chkInId
  //   );
  //   console.log("checkin ids are " + checkInIds);
  //   const confirmReason: string[] = ["Confirmed"];
  //   const statReason: updateStatus = {
  //     status: "CONFIRMED",
  //     reason: confirmReason,
  //     updatedBy: "admin",
  //   };

  //   const results = await Promise.allSettled(
  //     checkInIds.map(async (checkInId) => {
  //       try {
  //         const result = await updateCheckinStatus(checkInId, statReason);
  //         const data = result?.data;
  //         if (data) {
  //           console.log("updated check-in status: ", data);
  //           // initShipments();
  //         }
  //       } catch (error) {
  //         console.error(
  //           `Failed to update check-in status for id ${checkInId}: `,
  //           error
  //         );
  //       }
  //     })
  //   );

  //   setSelectedCheckin([]);
  //   // initTable();
  // };

  const onRejectCheckin = () => {
    setRejectModal(false);
    showSuccessToast(t("pick_up_order.rejected_success"));
    resetPage();
    // setConfirmModal(true)
  };

  const resetPage = async () => {
    setConfirmModal(false);
    setSelectedCheckin([]);
    initCheckInRequest();
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(undefined);
  };

  const handleSelectRow = (params: GridRowParams) => {
    setOpen(true);

    const selectedItem = filterShipments?.find(
      (item) => item.chkInId === params.row.chkInId
    );
    setSelectedRow(selectedItem);
  };

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
    };
  }, []);

  useEffect(() => {
    setPrimaryColor(
      role === "manufacturer" || role === "customer" ? "#6BC7FF" : "#79CA25"
    );
  }, [role]);

  const getWarehouseDetail = async (id: number) => {
    try {
      const warehouse = await getWarehouseById(id);
      return warehouse.data;
    } catch (error) {
      return null;
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <RequestForm onClose={handleClose} selectedItem={selectedRow} />
      </Modal>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          pr: 4,
        }}
      >
        <Grid container alignItems="center">
          <Grid item>
            <div
              className="header-page flex justify-start items-center mb-4 cursor-pointer"
              onClick={() => navigate("/warehouse")}
            >
              <LEFT_ARROW_ICON fontSize="large" />
              <div className="title font-bold text-3xl pl-4 ">
                {t("check_in.request_check_in")}
              </div>
            </div>
          </Grid>
        </Grid>
        <Box>
          <Button
            sx={{
              mt: 3,
              width: "90px",
              height: "40px",
              m: 0.5,
              cursor: selectedCheckin.length === 0 ? "not-allowed" : "pointer",
              borderRadius: "20px",
              backgroundColor: primaryColor,
              "&.MuiButton-root:hover": { bgcolor: primaryColor },
              borderColor: primaryColor,
              marginLeft: "20px",
              fontWeight: "bold",
              color: "white",
            }}
            disabled={selectedCheckin.length === 0 || !isAdmin}
            variant="outlined"
            onClick={() => {
              //handleApproveOnClick();
              setApproveModal(selectedCheckin.length > 0);
            }}
          >
            {" "}
            {t("check_in.approve")}
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
            variant="outlined"
            disabled={selectedCheckin.length === 0 || !isAdmin}
            onClick={() => setRejectModal(selectedCheckin.length > 0)}
          >
            {" "}
            {t("check_in.reject")}
          </Button>
        </Box>
        <Box className="filter-section flex justify-between items-center w-full">
          <TextField
            id="searchShipment"
            onChange={(event) => {
              handleFilterPoNum(event.target.value);
            }}
            sx={styles.inputStyle}
            label={t("check_in.pickup_order_no")}
            InputLabelProps={{
              style: { color: primaryColor },
              focused: true,
            }}
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
              {t("check_in.sender_company")}
            </InputLabel>
            <Select
              labelId="company-label"
              id="company"
              value={company}
              label={t("check_in.sender_company")}
              onChange={handleComChange}
            >
              {checkInRequest
                ?.filter(
                  (item, index, self) =>
                    index ===
                    self.findIndex((t) => t.senderName === item.senderName)
                )
                .map((item, index) => (
                  <MenuItem key={index} value={item.senderName}>
                    {item.senderName}
                  </MenuItem>
                ))}
              <MenuItem value="">
                {" "}
                <em>{t("check_in.any")}</em>
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={styles.inputStyle}>
            <InputLabel id="location-label" sx={styles.textFieldLabel}>
              {t("check_in.location")}
            </InputLabel>
            <Select
              labelId="location-label"
              id="location"
              value={location}
              label={t("check_in.location")}
              onChange={handleLocChange}
            >
              {checkInRequest
                ?.filter(
                  (item, index, self) =>
                    index ===
                    self.findIndex((t) => t.senderAddr === item.senderAddr)
                )
                .map((item, index) => (
                  <MenuItem key={index} value={item.senderAddr}>
                    {item.senderAddr}
                  </MenuItem>
                ))}
              <MenuItem value="">
                {" "}
                <em>{t("check_in.any")}</em>
              </MenuItem>
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
                  getRowId={(row) => row.chkInId}
                  hideFooter
                  columns={headCells}
                  disableRowSelectionOnClick
                  onRowClick={handleSelectRow}
                  getRowSpacing={getRowSpacing}
                  localeText={localeTextDataGrid}
                  getRowClassName={(params) =>
                    `${
                      selectedRow && params.row.chkInId === selectedRow.chkInId
                        ? "selected-row "
                        : ""
                    }${
                      selectedCheckin &&
                      selectedCheckin.includes(params.row.chkInId)
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
        <RejectForm
          checkedShipments={selectedCheckin}
          open={rejFormModal}
          reasonList={reasonList}
          onClose={() => {
            setRejectModal(false);
          }}
          onRejected={onRejectCheckin}
          checkInData={checkInRequest ?? []}
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
          checkedCheckIn={selectedCheckin}
          checkInData={checkInRequest ?? []}
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
      borderColor: "#79ca25",
    },
  },
  table: {
    minWidth: 750,
    borderCollapse: "separate",
    borderSpacing: "0px 10px",
  },
  headerRow: {
    //backgroundColor: "#97F33B",
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
    color: "#ACACAC",
    fontSize: 13,
    // fontWeight: "bold",
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
    padding: 4,
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
    ...styles.buttonFilledGreen,
    width: "150px",
  },
  cancelButton: {
    ...styles.buttonOutlinedGreen,
    width: "150px",
  },
};

export default ShipmentManage;
