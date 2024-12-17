import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  Collapse,
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import { CheckinData } from "../../interfaces/inventory";
import { useTranslation } from "react-i18next";
import { ExpandLess, ExpandMore, LocationOn } from "@mui/icons-material";
import { INVENTORY_ICON, WEIGHT_ICON } from "src/themes/icons";
import CommonTypeContainer from "src/contexts/CommonTypeContainer";
import { useContainer } from "unstated-next";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface CheckinCardProps {
  data: CheckinData;
}

const CheckinCard: FunctionComponent<CheckinCardProps> = ({ data }) => {
  const { i18n, t } = useTranslation();
  const { weightUnits, dateFormat } = useContainer(CommonTypeContainer);
  const [expanded, setExpanded] = useState(true);
  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  const getConditionalValue = (data: CheckinData, type: string) => {
    if (type === "senderCompany") {
      switch (i18n.language) {
        case "enus":
          return data.sender_company_name_en;
        case "zhch":
          return data.sender_company_name_sc;
        case "zhhk":
          return data.sender_company_name_tc;
      }
    } else if (type === "receiverCompany") {
      switch (i18n.language) {
        case "enus":
          return data.receiver_company_name_en;
        case "zhch":
          return data.receiver_company_name_sc;
        case "zhhk":
          return data.receiver_company_name_tc;
      }
    } else if (type === "weightUnit") {
      const selectedWeight = weightUnits.find(
        (value) => value.unitId === Number(data.unitId)
      );
      if (selectedWeight) {
        switch (i18n.language) {
          case "enus":
            return selectedWeight.unitNameEng;
          case "zhch":
            return selectedWeight.unitNameSchi;
          case "zhhk":
            return selectedWeight.unitNameTchi;
        }
      }
    } else if (type === "fromAddr") {
      switch (i18n.language) {
        case "enus":
          return data.from_addr_en;
        case "zhch":
          return data.from_addr_sc;
        case "zhhk":
          return data.from_addr_tc;
      }
    } else if (type === "toAddr") {
      switch (i18n.language) {
        case "enus":
          return data.to_addr_en;
        case "zhch":
          return data.to_addr_sc;
        case "zhhk":
          return data.to_addr_tc;
      }
    }
  };

  const getApprovedText = () => {
    switch (i18n.language) {
      case "enus":
        return `Approved by [${data.createdBy}] at ${dayjs
          .utc(data.createdAt)
          .tz("Asia/Hong_Kong")
          .format(`${dateFormat} HH:mm`)}`;
      case "zhhk":
        return `於 ${dayjs
          .utc(data.createdAt)
          .tz("Asia/Hong_Kong")
          .format(`${dateFormat} HH:mm`)} 由【${data.createdBy}】核準`;
      case "zhch":
        return `于 ${dayjs
          .utc(data.createdAt)
          .tz("Asia/Hong_Kong")
          .format(`${dateFormat} HH:mm`)} 由【${data.createdBy}】核准`;
    }
  };

  return (
    <Card variant="outlined" sx={{ marginBottom: 2, borderRadius: 3 }}>
      <Box display="flex" alignItems="center">
        <IconButton onClick={handleToggle}>
          {expanded ? (
            <ExpandLess sx={{ color: "#79CA25" }} />
          ) : (
            <ExpandMore sx={{ color: "#79CA25" }} />
          )}
        </IconButton>
        <Typography variant="h6">
          {t("inventory.pickup_order_record")}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginLeft: "auto", marginRight: 10 }}
        >
          {dayjs
            .utc(data.checkin_date_time)
            .tz("Asia/Hong_Kong")
            .format(`${dateFormat} HH:mm A`)}
        </Typography>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ padding: 0, marginLeft: 3 }}>
          <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Box width="30%">
                  <Box display="flex" alignItems="center">
                    <WEIGHT_ICON
                      fontSize="small"
                      sx={{ marginRight: 1, color: "#ACACAC" }}
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ color: "#ACACAC" }}
                    >
                      {t("inventory.weight")}
                    </Typography>
                  </Box>
                </Box>
                <Box width="70%">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ color: "#535353" }}
                  >
                    {data.total_weight}{" "}
                    {getConditionalValue(data, "weightUnit")}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Box>
          <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Box width="30%">
                  <Box display="flex" alignItems="center">
                    <INVENTORY_ICON
                      fontSize="small"
                      sx={{ marginRight: 1, color: "#ACACAC" }}
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ color: "#ACACAC" }}
                    >
                      {t("inventory.shipping_receiver")}
                    </Typography>
                  </Box>
                </Box>
                <Box width="70%">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ color: "#535353" }}
                  >
                    {getConditionalValue(data, "senderCompany")} {"->"}{" "}
                    {getConditionalValue(data, "receiverCompany")}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Box>
          <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Box width="30%">
                  <Box display="flex" alignItems="center">
                    <LocationOn
                      fontSize="small"
                      sx={{ marginRight: 1, color: "#ACACAC" }}
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ color: "#ACACAC" }}
                    >
                      {t("jobOrder.delivery_and_arrival_locations")}
                    </Typography>
                  </Box>
                </Box>
                <Box width="70%">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ color: "#535353" }}
                  >
                    {getConditionalValue(data, "fromAddr")} {"->"}{" "}
                    {getConditionalValue(data, "toAddr")}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Box>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Box width="100%" bgcolor={"#F4F4F4"} p={1} borderRadius={2}>
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ color: "#79CA25" }}
                  >
                    {getApprovedText()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default CheckinCard;
