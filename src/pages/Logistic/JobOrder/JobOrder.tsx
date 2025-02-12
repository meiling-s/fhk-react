import {
  Button,
  Modal,
  Typography,
  Pagination,
  Divider,
  Grid,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useLocation, useNavigate } from "react-router";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import CustomSearchField from "../../../components/TableComponents/CustomSearchField";
import JobOrderForm from "../../../components/FormComponents/JobOrderForm";
import StatusCard from "../../../components/StatusCard";
import CircularLoading from "../../../components/CircularLoading";
import {
  JobListOrder,
  JoStatus,
  queryJobOrder,
  Row,
} from "../../../interfaces/JobOrderInterfaces";
import { useContainer } from "unstated-next";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { getAllJobOrder, editJobOrderStatus } from "../../../APICalls/jobOrder";
import i18n from "../../../setups/i18n";
import {
  displayCreatedDate,
  extractError,
  returnApiToken,
  debounce,
  showErrorToast,
  getPrimaryColor,
} from "../../../utils/utils";
import {
  localStorgeKeyName,
  STATUS_CODE,
  Languages,
} from "../../../constants/constant";
import CustomButton from "../../../components/FormComponents/CustomButton";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import useLocaleTextDataGrid from "../../../hooks/useLocaleTextDataGrid";
import { getDriverList } from "../../../APICalls/driver";
import { Driver } from "../../../interfaces/driver";
import { getTenantById } from "../../../APICalls/tenantManage";
import CustomItemList, {
  il_item,
} from "src/components/FormComponents/CustomItemList";
import { DenialReason } from "src/interfaces/denialReason";
import { getAllFilteredFunction } from "src/APICalls/Collector/userGroup";
import {
  getAllDenialReason,
  getAllDenialReasonByFunctionId,
} from "src/APICalls/Collector/denialReason";
import CustomField from "src/components/FormComponents/CustomField";
import CustomTextField from "src/components/FormComponents/CustomTextField";

dayjs.extend(utc);
dayjs.extend(timezone);

type Approve = {
  open: boolean;
  onClose: () => void;
  selectedRow: any;
};

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
  updatedAt: string,
  version: number
): DenialReason {
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
    version,
  };
}

type ReasonForm = {
  open: boolean;
  onClose: () => void;
  reasonList: any;
  selectedRow: Row | null;
  selectedDate: string;
  onSuccess: () => void;
};

const SelectReasonModal: React.FC<ReasonForm> = ({
  open,
  onClose,
  reasonList,
  selectedRow,
  selectedDate,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [rejectReasonId, setRejectReasonId] = useState<string[]>([]);
  const [otherRemark, setOtherRemark] = useState<string>("");
  const [isUsingOtherRemark, setIsUsingOtherRemark] = useState<boolean>(false);

  useEffect(() => {
    const findOthersReason = reasonList.find(
      (value: any) => value.reasonNameEng === "Others"
    );
    const selectedReason = rejectReasonId.find(
      (value) => value == findOthersReason?.reasonId
    );
    if (!selectedReason) {
      setOtherRemark("");
      setIsUsingOtherRemark(false);
    } else {
      setIsUsingOtherRemark(true);
    }
  }, [rejectReasonId]);

  useEffect(() => {
    if (open === false) {
      setIsUsingOtherRemark(false);
    }
  }, [open]);

  const handleSubmitRequest = async (rejectReasonId: string[]) => {
    const auth = returnApiToken();
    const rejectReason = rejectReasonId.map((id) => {
      const reasonItem = reasonList.find(
        (reason: { id: string }) => reason.id === id
      );
      return reasonItem ? reasonItem.name : "";
    });
    const updateJOStatus = {
      status: "UNASSIGNED",
      reason: rejectReason,
      updatedBy: auth.loginId,
      pickupDate: selectedDate.split("T")[0],
      remark: isUsingOtherRemark ? otherRemark : "",
    };

    if (selectedRow) {
      try {
        const result = await editJobOrderStatus(
          selectedRow?.joId,
          updateJOStatus
        );
        if (result) {
          toast.info(t("jobOrder.store_date"), {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setOtherRemark("");
          onSuccess();
        }
      } catch (error) {
        console.error("Error Update Date:", error);
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
              {t("jobOrder.changedate_alert")}
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography sx={localstyles.typo}>
              {t("jobOrder.changedate_reason")}
            </Typography>
            <CustomItemList
              items={reasonList}
              multiSelect={setRejectReasonId}
              itemColor={{ bgColor: "#F0F9FF", borderColor: getPrimaryColor() }}
            />
          </Box>
          {isUsingOtherRemark && (
            <Grid item>
              <CustomField label={t("tenant.detail.remark")}>
                <CustomTextField
                  id="otherRemark"
                  value={otherRemark}
                  placeholder={t("tenant.detail.remark")}
                  onChange={(event) => setOtherRemark(event.target.value)}
                />
              </CustomField>
            </Grid>
          )}
          <Box sx={{ alignSelf: "center" }}>
            <CustomButton
              text={t("check_in.confirm")}
              color="blue"
              style={{ width: "175px", marginRight: "10px" }}
              onClick={() => {
                handleSubmitRequest(rejectReasonId);
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

const ApproveModal: React.FC<Approve> = ({ open, onClose, selectedRow }) => {
  const { t } = useTranslation();
  const auth = returnApiToken();
  const onApprove = async () => {
    const updateJOStatus = {
      status: "REJECTED",
      reason: [],
      updatedBy: auth.loginId,
    };
    try {
      const result = await editJobOrderStatus(selectedRow.joId, updateJOStatus);
      if (result) {
        toast.info(t("job_order.approved_success"), {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        onClose();
      }
    } catch (error) {
      console.error("Error approve:", error);
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
              {t("job_order.confirm_approve_title")}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ alignSelf: "center" }}>
            <button
              className="primary-btn mr-2 cursor-pointer"
              onClick={() => {
                onApprove();
              }}
            >
              {t("job_order.confirm_approve")}
            </button>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={() => {
                onClose();
              }}
            >
              {t("job_order.cancel")}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

type RejectForm = {
  open: boolean;
  onClose: () => void;
  reasonList: any;
  selectedRow: Row | null;
};

const RejectModal: React.FC<RejectForm> = ({
  open,
  onClose,
  reasonList,
  selectedRow,
}) => {
  const { t } = useTranslation();
  const [rejectReasonId, setRejectReasonId] = useState<string[]>([]);
  const [otherRemark, setOtherRemark] = useState<string>("");
  const [isUsingOtherRemark, setIsUsingOtherRemark] = useState<boolean>(false);

  useEffect(() => {
    const findOthersReason = reasonList.find(
      (value: any) => value.reasonNameEng === "Others"
    );
    const selectedReason = rejectReasonId.find(
      (value) => value == findOthersReason?.reasonId
    );
    if (!selectedReason) {
      setOtherRemark("");
      setIsUsingOtherRemark(false);
    } else {
      setIsUsingOtherRemark(true);
    }
  }, [rejectReasonId]);

  useEffect(() => {
    if (open === false) {
      setIsUsingOtherRemark(false);
    }
  }, [open]);

  const handleRejectRequest = async (rejectReasonId: string[]) => {
    const rejectReason = rejectReasonId.map((id) => {
      const reasonItem = reasonList.find(
        (reason: { id: string }) => reason.id === id
      );
      return reasonItem ? reasonItem.name : "";
    });
    const loginId = localStorage.getItem(localStorgeKeyName.username) || "";
    const updateJOStatus = {
      status: "CANCELLED",
      reason: rejectReason,
      updatedBy: loginId,
      remark: isUsingOtherRemark ? otherRemark : "",
    };
    try {
      if (selectedRow) {
        const result = await editJobOrderStatus(
          selectedRow.joId.toString(),
          updateJOStatus
        );
        if (result) {
          toast.info(t("common.cancelSuccessfully"), {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setOtherRemark("");
          onClose();
        }
      }
    } catch (error) {
      console.error("Error Reject:", error);
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
              {t("jobOrder.cancel_alert")}
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography sx={localstyles.typo}>
              {t("jobOrder.cancel_reason")}
            </Typography>
            <CustomItemList
              items={reasonList}
              multiSelect={setRejectReasonId}
              itemColor={{ bgColor: "#F0F9FF", borderColor: getPrimaryColor() }}
            />
          </Box>
          {isUsingOtherRemark && (
            <Grid item>
              <CustomField label={t("tenant.detail.remark")}>
                <CustomTextField
                  id="otherRemark"
                  value={otherRemark}
                  placeholder={t("tenant.detail.remark")}
                  onChange={(event) => setOtherRemark(event.target.value)}
                />
              </CustomField>
            </Grid>
          )}
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

interface Option {
  value: string;
  label: string;
}

const JobOrder = () => {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalData, setTotalData] = useState<number>(0);
  const [driverLists, setDriverLists] = useState<Driver[]>([]);
  const { dateFormat } = useContainer(CommonTypeContainer);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const statusList: {
    value: string;
    labelEng: string;
    labelSchi: string;
    labelTchi: string;
  }[] = [
    {
      value: "CREATED",
      labelEng: "CREATED",
      labelSchi: "待处理",
      labelTchi: "待處理",
    },
    {
      value: "REJECTED",
      labelEng: "REJECTED",
      labelSchi: "已拒绝",
      labelTchi: "已拒絕",
    },
    {
      value: "COMPLETED",
      labelEng: "COMPLETED",
      labelSchi: "已完成",
      labelTchi: "已完成",
    },
    {
      value: "CLOSED",
      labelEng: "CLOSED",
      labelSchi: "已取消",
      labelTchi: "已取消",
    },
    {
      value: "OUTSTANDING",
      labelEng: "OUTSTANDING",
      labelSchi: "已逾期",
      labelTchi: "已逾期",
    },
    {
      value: "DENY",
      labelEng: "DENY",
      labelSchi: "不接受",
      labelTchi: "不接受",
    },
    {
      value: "UNASSIGNED",
      labelEng: "UNASSIGNED",
      labelSchi: "未指派",
      labelTchi: "未指派",
    },
    {
      value: "ASSIGNED",
      labelEng: "ASSIGNED",
      labelSchi: "已指派",
      labelTchi: "已指派",
    },
    {
      value: "CANCELLED",
      labelEng: "CANCELLED",
      labelSchi: "已取消",
      labelTchi: "已取消",
    },
    {
      value: "",
      labelEng: "any",
      labelSchi: "任何",
      labelTchi: "任何",
    },
  ];

  const columns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: t("job_order.item.date_time"),
      width: 150,
      renderCell: (params) => {
        return dayjs
          .utc(params.row.createdAt)
          .tz("Asia/Hong_Kong")
          .format(`${dateFormat} HH:mm`);
      },
    },
    {
      field: "driverId",
      headerName: t("job_order.table.driver_id"),
      type: "string",
      width: 150,
      editable: true,
      renderCell: (params) => {
        const driverId = params.row.driverId;
        const driverName = driverLists.filter(
          (item) => item.driverId == driverId
        );
        if (driverName.length > 0) {
          return (
            <div>
              {i18n.language === "enus"
                ? driverName[0].driverNameEng
                : i18n.language === "zhhk"
                ? driverName[0].driverNameTchi
                : driverName[0].driverNameSchi}
            </div>
          );
        } else {
          return <div>{t("status.unassigned")}</div>;
        }
      },
    },
    {
      field: "plateNo",
      headerName: t("job_order.table.plate_no"),
      type: "string",
      width: 150,
      editable: true,
      renderCell: (params) => {
        const plateNo = params.row.plateNo;
        if (plateNo === "") {
          return <div>{t("status.unassigned")}</div>;
        } else {
          return <div>{plateNo}</div>;
        }
      },
    },
    {
      field: "labelId",
      headerName: t("job_order.table.jo_id"),
      type: "string",
      width: 200,
      editable: true,
    },
    {
      field: "picoId",
      headerName: t("job_order.item.reference_po_number"),
      type: "string",
      width: 200,
      editable: true,
    },
    {
      field: "senderName",
      headerName: t("job_order.table.sender_company"),
      type: "sring",
      width: 220,
      editable: true,
    },
    {
      field: "receiverName",
      headerName: t("job_order.table.receiver_company"),
      type: "string",
      width: 220,
      editable: true,
    },
    {
      field: "status",
      headerName: t("job_order.table.status"),
      type: "string",
      width: 150,
      editable: true,
      renderCell: (params) => <StatusCard status={params.value} />,
    },
    {
      field: "operation",
      headerName: t("job_order.table.operation"),
      type: "string",
      width: 220,
      editable: true,
      renderCell: (params) =>
        params.row.status === "DENY" && (
          <CustomButton
            text={t("job_order.table.approve")}
            onClick={() => {
              showApproveModal(params.row);
            }}
          ></CustomButton>
        ),
    },
  ];
  // const {pickupOrder} = useContainer(CheckInRequestContainer)
  const location = useLocation();
  const action: string = location.state;
  const [jobOrder, setJobOrder] = useState<JobListOrder[]>();
  const [rows, setRows] = useState<Row[]>([]);
  const [filteredPico, setFilteredPico] = useState<Row[]>([]);
  const [query, setQuery] = useState<queryJobOrder>({
    id: "",
    labelId: "",
    picoId: "",
    driverId: "",
    senderName: "",
    receiverName: "",
    status: "",
  });
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [reasonList, setReasonList] = useState<DenialReason[]>([]);
  const { localeTextDataGrid } = useLocaleTextDataGrid();
  const [reasonModal, setReasonModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const initJobOrderRequest = async () => {
    // setIsLoading(true)
    try {
      setJobOrder([]);
      const params = {
        page: page - 1,
        size: pageSize,
        ...query,
      };
      const res = await getAllJobOrder(params);
      if (res) {
        const data = res?.data.content;
        setJobOrder(data);
      }
      setTotalData(res?.data.totalPages);
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const initDriverList = async () => {
    try {
      const res = await getDriverList(0, 1000);
      if (res) {
        const data = res.data.content;
        setDriverLists(data);
      }
    } catch (error) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const initReasonList = async () => {
    try {
      const result = await getAllDenialReasonByFunctionId(
        page - 1,
        pageSize,
        23
      );
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

  const showApproveModal = (row: any) => {
    setSelectedRow(row);
    setApproveModal(true);
  };
  const resetPage = async () => {
    setApproveModal(false);
    setRejectModal(false);
    setOpenModal(false);
    setReasonModal(false);
    setSelectedRow(null);
    await delay(2000);
    initJobOrderRequest();
  };

  useEffect(() => {
    initJobOrderRequest();
    initDriverList();
    initReasonList();
  }, [i18n.language]);

  useEffect(() => {
    initJobOrderRequest();
  }, [page, query]);

  function getStatusOpion() {
    const options: Option[] = statusList.map((item) => {
      if (i18n.language === Languages.ENUS) {
        return {
          value: item.value,
          label: item.labelEng,
        };
      } else if (i18n.language === Languages.ZHCH) {
        return {
          value: item.value,
          label: item.labelSchi,
        };
      } else {
        return {
          value: item.value,
          label: item.labelTchi,
        };
      }
    });
    return options;
  }

  const fetchTenantDetails = async (tenantId: number) => {
    try {
      const result = await getTenantById(tenantId);
      const data = result?.data;

      if (i18n.language === "enus") {
        return data.companyNameEng;
      } else if (i18n.language === "zhhk") {
        return data.companyNameTchi;
      } else {
        return data.companyNameSchi;
      }
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
      console.error(`Error fetching tenant ${tenantId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const tempRows =
      jobOrder?.map(async (item) => {
        const senderCompany =
          Number(item.senderId) !== 0 && !isNaN(Number(item.senderId))
            ? await fetchTenantDetails(Number(item.senderId))
            : item.senderName;
        const receiverCompany =
          Number(item.receiverId) !== 0 && !isNaN(Number(item.receiverId))
            ? await fetchTenantDetails(Number(item.receiverId))
            : item.receiverName;
        return {
          ...item,
          id: item.joId,
          joId: item.joId,
          picoId: item.picoId,
          createdAt: item.createdAt,
          driverId: item.driverId,
          plateNo: item.plateNo,
          senderName: senderCompany ? senderCompany : item.senderName,
          receiverName: receiverCompany ? receiverCompany : item.receiverName,
          status: item.status,
          operation: "",
          reason: item.reason,
          updatedAt: item.updatedAt,
          updatedBy: item.updatedBy,
        };
      }) ?? [];

    // Promise.all(tempRows).then((resolvedRows) => {
    //   const filteredRows = resolvedRows.filter(
    //     (item) => item.status !== 'CLOSED'
    //   )
    //   setRows(filteredRows)
    //   setFilteredPico(filteredRows)
    // })
    Promise.all(tempRows)
      .then((resolvedRows) => {
        const filteredRows = resolvedRows.filter(
          (item) => item.status !== "CLOSED"
        );
        setRows(filteredRows);
        setFilteredPico(filteredRows);

        // Set loading to false after all promises have resolved
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tenant details:", error);
        setIsLoading(false); // Ensure loading is false even if there's an error
      });
  }, [jobOrder, i18n.language]);

  const searchfield = [
    {
      label: t("job_order.table.jo_id"),
      placeholder: t("placeHolder.jo_number"),
      field: "labelId",
    },
    {
      label: t("job_order.table.sender_company"),
      options: getUniqueOptions("senderName"),
      field: "senderName",
    },
    {
      label: t("job_order.table.receiver_company"),
      options: getUniqueOptions("receiverName"),
      field: "receiverName",
    },
    {
      label: t("job_order.table.driver_id"),
      options: getUniqueOptions("driverId"),
      field: "driverId",
    },
    {
      label: t("job_order.table.status"),
      options: getStatusOpion(),
      field: "status",
    },
  ];

  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);

  function getUniqueOptions(propertyName: keyof Row) {
    const optionMap = new Map();
    let options: Option[] = [];

    if (propertyName != "driverId") {
      rows.forEach((row) => {
        optionMap.set(row[propertyName], row[propertyName]);
      });

      options = Array.from(optionMap.values()).map((option) => ({
        value: option,
        label: option,
      }));
    } else {
      options = driverLists.map((item) => ({
        value: item.driverId.toString(),
        label:
          i18n.language === "enus"
            ? item.driverNameEng
            : i18n.language === "zhch"
            ? item.driverNameSchi
            : item.driverNameTchi,
      }));
    }

    options.push({
      value: "",
      label: t("check_in.any"),
    });
    return options;
  }

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
    };
  }, []);
  const handleCloses = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };
  const handleRowClick = (params: GridRowParams) => {
    const row = params.row as Row;
    setSelectedRow(row);
    setOpenModal(true);
  };

  const updateQuery = (newQuery: Partial<queryJobOrder>) => {
    setQuery({ ...query, ...newQuery });
    // initJobOrderRequest()
  };

  const handleSearch = debounce((keyName: string, value: string) => {
    setPage(1);
    updateQuery({ [keyName]: value });
  }, 1000);

  const successChangeDate = () => {
    setOpenModal(false);
    setSelectedRow(null);
    initJobOrderRequest();
  };

  return (
    <>
      <ToastContainer />
      <Box
        sx={{ display: "flex", flexDirection: "column" }}
        className="container-wrapper w-max"
      >
        <Modal open={openModal} onClose={handleCloses}>
          <JobOrderForm
            onClose={handleCloses}
            selectedRow={selectedRow}
            onApproved={() => setApproveModal(true)}
            onReject={() => setRejectModal(true)}
            setReasonModal={() => setReasonModal(!reasonModal)}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </Modal>
        <Box sx={{ display: "flex", alignItems: "center", ml: "6px" }}>
          <Typography fontSize={20} color="black" fontWeight="bold">
            {t("job_order.item.detail")}
          </Typography>
        </Box>
        <Box />
        <Stack direction="row" mt={3}>
          {searchfield.map((s) => (
            <CustomSearchField
              key={s.field}
              label={s.label}
              // width={s.width}
              placeholder={s?.placeholder}
              field={s.field}
              options={s.options || []}
              onChange={handleSearch}
            />
          ))}
        </Stack>
        <Box pr={4} pt={3} pb={3} sx={{ flexGrow: 1 }}>
          {isLoading ? (
            <CircularLoading />
          ) : (
            <Box>
              <DataGrid
                rows={filteredPico}
                columns={columns}
                disableRowSelectionOnClick
                onRowClick={handleRowClick}
                getRowSpacing={getRowSpacing}
                localeText={localeTextDataGrid}
                getRowClassName={(params) =>
                  selectedRow && params.id === selectedRow.joId
                    ? "selected-row"
                    : ""
                }
                hideFooter
                sx={{
                  border: "none",
                  "& .MuiDataGrid-cell": {
                    border: "none", // Remove the borders from the cells
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
                count={Math.ceil(totalData)}
                page={page}
                onChange={(_, newPage) => {
                  setPage(newPage);
                }}
              />
            </Box>
          )}
        </Box>

        <ApproveModal
          open={approveModal}
          onClose={resetPage}
          selectedRow={selectedRow}
        />
        <RejectModal
          open={rejectModal}
          onClose={resetPage}
          selectedRow={selectedRow}
          reasonList={reasonList}
        />
        <SelectReasonModal
          open={reasonModal}
          onClose={resetPage}
          selectedRow={selectedRow}
          reasonList={reasonList}
          selectedDate={selectedDate}
          onSuccess={() => setReasonModal(false)}
        />
      </Box>
    </>
  );
};

export default JobOrder;

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
};
