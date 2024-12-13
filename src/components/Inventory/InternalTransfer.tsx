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
import { InternalTransferData } from "../../interfaces/inventory";
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

interface InternalTransferCardProps {
  data: InternalTransferData;
}

const InternalTransferCard: FunctionComponent<InternalTransferCardProps> = ({
  data,
}) => {
  const { i18n, t } = useTranslation();
  const { dateFormat } = useContainer(CommonTypeContainer);
  const [expanded, setExpanded] = useState(true);
  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  const getConditionalValue = (data: InternalTransferData, type: string) => {
    if (type === "company") {
      switch (i18n.language) {
        case "enus":
          return data.company_name_en;
        case "zhhk":
          return data.company_name_tc;
        case "zhch":
          return data.company_name_sc;
      }
    } else if (type === "senderCompany") {
      switch (i18n.language) {
        case "enus":
          return data.from_location_en;
        case "zhch":
          return data.from_location_sc;
        case "zhhk":
          return data.from_location_tc;
      }
    } else if (type === "receiverCompany") {
      switch (i18n.language) {
        case "enus":
          return data.to_location_en;
        case "zhch":
          return data.to_location_sc;
        case "zhhk":
          return data.to_location_tc;
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
        return `Approved by [${data.username}] at ${dayjs
          .utc(data.request_date_time)
          .tz("Asia/Hong_Kong")
          .format(`${dateFormat} HH:mm`)}`;
      case "zhhk":
        return `於 ${dayjs
          .utc(data.request_date_time)
          .tz("Asia/Hong_Kong")
          .format(`${dateFormat} HH:mm`)} 由【${data.username}】核準`;
      case "zhch":
        return `于 ${dayjs
          .utc(data.request_date_time)
          .tz("Asia/Hong_Kong")
          .format(`${dateFormat} HH:mm`)} 由【${data.username}】核准`;
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
        <Typography variant="h6">{t("inventory.internal_transfer")}</Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginLeft: "auto", marginRight: 10 }}
        >
          {dayjs
            .utc(data.createdAt)
            .tz("Asia/Hong_Kong")
            .format(`${dateFormat} HH:mm A`)}
        </Typography>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ padding: 0, marginLeft: 3, marginTop: 1 }}>
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
                      {t("inventory.company")}
                    </Typography>
                  </Box>
                </Box>
                <Box width="70%">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ color: "#535353" }}
                  >
                    {getConditionalValue(data, "company")}
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

export default InternalTransferCard;
