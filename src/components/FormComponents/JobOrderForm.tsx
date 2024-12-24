import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { styles } from "../../constants/styles";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import CustomField from "./CustomField";
import StatusCard from "../StatusCard";
import {
  DriverDetail,
  JobListOrder,
  Row,
} from "../../interfaces/JobOrderInterfaces";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  displayCreatedDate,
  extractError,
  getPrimaryColor,
  getThemeColorRole,
  returnApiToken,
} from "../../utils/utils";
import { localStorgeKeyName, STATUS_CODE } from "../../constants/constant";
import { PickupOrderDetail } from "../../interfaces/pickupOrder";
import { getPicoById } from "../../APICalls/Collector/pickupOrder/pickupOrder";
import JobOrderCard from "../JobOrderCard";
import CustomButton from "./CustomButton";
import {
  editJobOrderStatus,
  getDriverDetailById,
  getPuJoData,
} from "../../APICalls/jobOrder";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import { getTenantById } from "../../APICalls/tenantManage";
import { getAllDenialReason } from "../../APICalls/Collector/denialReason";
import { DenialReason } from "../../interfaces/denialReason";
import CustomDatePicker from "./CustomDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { toast } from "react-toastify";
import CustomItemList from "./CustomItemList";

dayjs.extend(utc);
dayjs.extend(timezone);

const JobOrderForm = ({
  onClose,
  selectedRow,
  onApproved,
  onReject,
  setReasonModal,
  selectedDate,
  setSelectedDate,
}: {
  onClose: () => void;
  selectedRow: Row | null;
  onApproved: () => void;
  onReject: () => void;
  setReasonModal: (value: boolean) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
}) => {
  const { t, i18n } = useTranslation();
  const role =
    localStorage.getItem(localStorgeKeyName.role) || "collectoradmin";

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // If the overlay is clicked (not its children), close the modal
      onClose && onClose();
    }
  };
  const navigate = useNavigate();

  const [selectedJobOrder, setSelectedJobOrder] = useState<Row>();
  const [pickupOrderDetail, setPickUpOrderDetail] =
    useState<PickupOrderDetail[]>();
  const [driverDetail, setDriverDetail] = useState<DriverDetail>();
  const { dateFormat, logisticList } = useContainer(CommonTypeContainer);
  const [denialReasonList, setDenialReasonList] = useState<DenialReason[]>([]);
  const [isJoExists, setJoExists] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const auth = returnApiToken();

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

  const getPicoDetail = async () => {
    if (selectedRow?.picoId) {
      const result = await getPicoById(selectedRow?.picoId.toString());
      if (result?.data.pickupOrderDetail?.length > 0) {
        const updatedPickupOrderDetails = await Promise.all(
          result.data.pickupOrderDetail.map(
            async (item: {
              receiverName: any;
              receiverId: number;
              senderId: number;
              senderName: any;
            }) => {
              const senderName =
                item.senderId !== 0 &&
                !isNaN(item.senderId) &&
                item.senderId !== null
                  ? await fetchTenantDetails(item.senderId)
                  : item.senderName;
              const receiverName =
                item.receiverId !== 0 &&
                !isNaN(item.receiverId) &&
                item.receiverId !== null
                  ? await fetchTenantDetails(item.receiverId)
                  : item.receiverName;
              return {
                ...item,
                senderName: senderName || item.senderName,
                receiverName: receiverName || item.receiverName,
              };
            }
          )
        );

        const picoDetailItem = updatedPickupOrderDetails.find(
          (item) => item.picoDtlId === selectedRow?.picoDtlId
        );
        setPickUpOrderDetail([picoDetailItem]);
      }
    }
  };

  const getDriverDetail = async () => {
    if (selectedRow?.driverId) {
      const result = await getDriverDetailById(
        selectedRow?.driverId.toString()
      );
      if (result?.data) {
        setDriverDetail(result.data || {});
      }
    }
  };

  const getDenialReason = async () => {
    const result = await getAllDenialReason(0, 1000);
    const data = result.data.content;
    if (data) {
      setDenialReasonList(data);
    }
  };

  const getPuJoDetail = async () => {
    if (selectedRow) {
      const result = await getPuJoData(selectedRow?.joId);
      const data = result.data;

      console.log(data, "pujo data");
      if (data.length > 0) {
        setJoExists(true);
      }
    }
  };

  useEffect(() => {
    if (selectedRow) {
      setSelectedDate(selectedRow.pickupAt ?? "");
      setSelectedJobOrder(selectedRow);
      getPicoDetail();
      getDriverDetail();
      getDenialReason();
      getPuJoDetail();
    }
  }, [selectedRow]);

  const getReasonName = (reasonId: string) => {
    const selectedReason = denialReasonList.find(
      (value) => value.reasonId.toString() === reasonId
    );
    switch (i18n.language) {
      case "zhhk":
        return selectedReason?.reasonNameTchi || "";
      case "zhch":
        return selectedReason?.reasonNameSchi || "";
      case "enus":
        return selectedReason?.reasonNameEng || "";
      default:
        return selectedReason?.reasonNameEng || "";
    }
  };

  const reasons =
    selectedRow?.reason
      ?.map((reason) => getReasonName(reason))
      .filter((reasonName) => reasonName.length > 0) || [];

  const formattedReasons = reasons
    .map((reason, index) =>
      index === reasons.length - 1 ? reason + "." : reason + ", "
    )
    .join("");

  const itemCheck = () => {
    if (selectedRow?.reason !== undefined && selectedRow?.reason?.length > 0) {
      if (i18n.language === "enus") {
        if (selectedRow?.reason?.length < 2) {
          return t("job_order.reason_single");
        } else {
          return t("job_order.reason_multi");
        }
      } else {
        return t("job_order.reason_single");
      }
    }
  };

  const handleClickStore = () => {
    const reformatDate = new Date(selectedDate);
    const today = new Date();

    // Clear the time part of today's date for accurate comparison
    today.setHours(0, 0, 0, 0);

    if (reformatDate >= today) {
      setReasonModal(true);
    } else {
      setErrorMessage(true);
    }
  };

  useEffect(() => {
    setErrorMessage(false);
  }, [selectedDate]);

  return (
    <Box sx={localstyles.modal} onClick={handleOverlayClick}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
        <Box sx={localstyles.container}>
          <Box sx={{ display: "flex", flex: "1", p: 4, alignItems: "center" }}>
            <Box>
              <Typography sx={styles.header4}>
                {t("job_order.item.detail")}
              </Typography>
              <Typography sx={styles.header3}>
                {selectedJobOrder?.labelId}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexShrink: 0, ml: "20px" }}>
              <StatusCard status={selectedJobOrder?.status} />
            </Box>
            <Box sx={{ marginLeft: "auto" }}>
              {selectedRow?.status === "DENY" && (
                <CustomButton
                  text={t("job_order.table.approve")}
                  onClick={() => {
                    onApproved();
                  }}
                ></CustomButton>
              )}
              {selectedRow?.status === "UNASSIGNED" ||
              selectedRow?.status === "ASSIGNED" ? (
                <CustomButton
                  text={t("notification.modify_template.app.button_submit")}
                  onClick={() => handleClickStore()}
                  disabled={isJoExists}
                  style={{ marginRight: 10 }}
                ></CustomButton>
              ) : null}
              {selectedRow?.status === "UNASSIGNED" ||
              selectedRow?.status === "ASSIGNED" ? (
                <CustomButton
                  text={t("job_order.cancel")}
                  onClick={() => onReject()}
                  outlined={true}
                ></CustomButton>
              ) : null}
              <IconButton sx={{ ml: "25px" }} onClick={onClose}>
                <KeyboardTabIcon sx={{ fontSize: "30px" }} />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <Stack spacing={2} sx={localstyles.content}>
            <Box>
              <Typography sx={localstyles.typo_header}>
                {t("job_order.item.shipping_info")}
              </Typography>
            </Box>
            <CustomField label={t("job_order.item.date_time")}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedJobOrder?.createdAt
                  ? dayjs
                      .utc(selectedJobOrder?.createdAt)
                      .tz("Asia/Hong_Kong")
                      .format(`${dateFormat} HH:mm`)
                  : ""}
              </Typography>
            </CustomField>

            <CustomField label={t("job_order.item.reference_po_number")}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedJobOrder?.picoId}
              </Typography>
            </CustomField>
            <Typography sx={localstyles.typo_header}>
              {t("job_order.item.rec_loc_info")}
            </Typography>
            <CustomField label={t("jobOrder.shippingDateAndTime")}>
              <DatePicker
                value={dayjs(selectedDate)}
                slotProps={{ textField: { size: "small" } }}
                sx={localstyles.datePicker()}
                onChange={(values: any) => {
                  setSelectedDate(dayjs(values).format("YYYY-MM-DDTHH:mm:ss"));
                }}
                format={dateFormat}
                minDate={dayjs()}
                disabled={isJoExists}
              />
            </CustomField>
            {errorMessage && (
              <Typography sx={localstyles.errorMessage}>
                {t("jobOrder.invalid_date")}
              </Typography>
            )}
            <JobOrderCard
              plateNo={selectedRow?.plateNo}
              pickupOrderDetail={pickupOrderDetail ?? []}
              driverDetail={driverDetail}
            />
            {selectedRow?.status === "DENY" && (
              <Box>
                <Typography>
                  {i18n.language === "enus"
                    ? driverDetail?.driverNameEng
                    : i18n.language === "zhch"
                    ? driverDetail?.driverNameSchi
                    : driverDetail?.driverNameTchi}{" "}
                  {t("job_order.rejected_at")}{" "}
                  {dayjs(selectedRow?.updatedAt).format(`${dateFormat} HH:mm`)},{" "}
                  {itemCheck()} {formattedReasons}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

let localstyles = {
  modal: {
    display: "flex",
    height: "100vh",
    width: "100%",
    justifyContent: "flex-end",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "45%",
    bgcolor: "white",
    overflowY: "scroll",
  },

  button: {
    borderColor: "lightgreen",
    color: "green",
    width: "100px",
    height: "35px",
    p: 1,
    borderRadius: "18px",
    mr: "10px",
  },
  // header: {
  //   display: "flex",
  //   flex: 1,
  //   p: 4,
  //   alignItems:'center'

  //
  content: {
    flex: 9,
    p: 4,
  },
  typo_header: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#717171",
    letterSpacing: "1px",
    mt: "10px",
  },
  typo_fieldTitle: {
    fontSize: "13px",
    color: "#ACACAC",
    letterSpacing: "1px",
  },
  typo_fieldContent: {
    fontSize: "15px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    marginTop: "2px",
  },
  typo: {
    color: "#ACACAC",
    fontSize: 13,
    // fontWeight: "bold",
    display: "flex",
  },
  errorMessage: {
    fontSize: 14,
    color: "red",
    marginBottom: 10,
    marginTop: 5,
  },
  datePicker: () => ({
    width: "100%",
    "& .MuiIconButton-edgeEnd": {
      color: "#63D884",
    },
  }),
};

export default JobOrderForm;
