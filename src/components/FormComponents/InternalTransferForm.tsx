import {
  Alert,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RecycleCard from "../RecycleCard";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import {
  CheckIn,
  CheckinDetail,
  CheckinDetailPhoto
} from "../../interfaces/checkin";
import { styles } from "../../constants/styles";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import { useContainer } from "unstated-next";
import { il_item } from "./CustomItemList";
import i18n from "../../setups/i18n";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { format } from "../../constants/constant";
import { localStorgeKeyName } from "../../constants/constant";
import { formatWeight } from "../../utils/utils";
import { getDetailCheckInRequests } from "../../APICalls/Collector/warehouseManage";
import NotifContainer from "../../contexts/NotifContainer";
import { InternalTransferName } from "src/interfaces/internalTransferRequests";

type recycItem = {
  recycType: il_item;
  recycSubType: il_item;
  weight: number;
  packageTypeId: string;
  checkinDetailPhoto: CheckinDetailPhoto[];
};

type props = {
  onClose?: () => void;
  selectedItem?: InternalTransferName;
};

const InternalTransferForm = ({ onClose, selectedItem }: props) => {
  const { t } = useTranslation();
  const { marginTop } = useContainer(NotifContainer);
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // If the overlay is clicked (not its children), close the modal
      onClose && onClose();
    }
  };

  console.log('selectedItem', selectedItem)

  return (
    <Box sx={{ ...localstyles.modal, marginTop }} onClick={handleOverlayClick}>
      <Box sx={localstyles.container} className="md:w-[500px] w-[100vw]">
        <Box sx={localstyles.header}>
          <Box>
            <Typography sx={styles.header4}>
              {t("internalTransfer.internal_transfer_request")}
            </Typography>
            <Typography sx={styles.header3}>{selectedItem?.detail?.gidLabel}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignSelf: "center" }}>
            <IconButton onClick={onClose}>
              <KeyboardTabIcon sx={{ fontSize: "30px" }} />
            </IconButton>
          </Box>
        </Box>
        <Divider />
        <Stack spacing={2} sx={localstyles.content}>
          <Box>
            <Typography sx={localstyles.typo_header}>
              {t("internalTransfer.item_information")}
            </Typography>
          </Box>

          <Box>
            <Typography sx={localstyles.typo_fieldTitle}>
              {t("internalTransfer.date_time")}
            </Typography>
            <Typography sx={localstyles.typo_fieldContent}>
              {selectedItem?.createdAt}
            </Typography>
          </Box>

          <Box>
            <Typography sx={localstyles.typo_fieldTitle}>
              {t("pick_up_order.recyclForm.item_category")}
            </Typography>
            <Typography sx={localstyles.typo_fieldContent}>
              {selectedItem?.itemType}
            </Typography>
          </Box>

          <Box>
            <Typography sx={localstyles.typo_fieldTitle}>
              {t("settings_page.recycling.main_category")}
            </Typography>
            <Typography sx={localstyles.typo_fieldContent}>
              {selectedItem?.mainCategory}
            </Typography>
          </Box>
          <Box>
            <Typography sx={localstyles.typo_fieldTitle}>
              {t("settings_page.recycling.sub_category")}
            </Typography>
            <Typography sx={localstyles.typo_fieldContent}>
              {selectedItem?.subCategory}
            </Typography>
          </Box>
          <Box>
            <Typography sx={localstyles.typo_fieldTitle}>
              {t("inventory.package")}
            </Typography>
            <Typography sx={localstyles.typo_fieldContent}>
              {selectedItem?.package}
            </Typography>
          </Box>
          <Box>
            <Typography sx={localstyles.typo_fieldTitle}>
              {t("internalTransfer.sender_warehouse")}
            </Typography>
            <Typography sx={localstyles.typo_fieldContent}>
              {selectedItem?.senderWarehouse}
            </Typography>
          </Box>
          <Box>
            <Typography sx={localstyles.typo_fieldTitle}>
              {t("internalTransfer.receiver_warehouse")}
            </Typography>
            <Typography sx={localstyles.typo_fieldContent}>
              {selectedItem?.toWarehouse}
            </Typography>
          </Box>
          <Box>
            <Typography sx={localstyles.typo_fieldTitle}>
              {t("inventory.weight")}
            </Typography>
            <Typography sx={localstyles.typo_fieldContent}>
              {selectedItem?.weight}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

let localstyles = {
  modal: {
    display: "flex",
    height: "100vh",
    width: "100%",
    justifyContent: "flex-end"
  },
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    // width: "40%",
    bgcolor: "white",
    overflowY: "scroll"
  },
  header: {
    display: "flex",
    flex: 1,
    p: 4,
    justifyContent: "space-between"
  },
  content: {
    flex: 9,
    p: 4
  },
  typo_header: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#858585",
    letterSpacing: "2px",
    mt: "10px"
  },
  typo_fieldTitle: {
    fontSize: "15px",
    color: "#ACACAC",
    letterSpacing: "2px"
  },
  typo_fieldContent: {
    fontSize: "17PX",
    letterSpacing: "2px"
  }
};

export default InternalTransferForm;
