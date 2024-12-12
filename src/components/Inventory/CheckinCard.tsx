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

  console.log(data, "data");

  const getConditionalValue = (data: CheckinData, type: string) => {
    if (type === "company") {
      switch (i18n.language) {
        case "enus":
          return data.company_name_en;
        case "zhch":
          return data.company_name_sc;
        case "zhhk":
          return data.company_name_tc;
      }
    } else if (type === "location") {
      switch (i18n.language) {
        case "enus":
          return data.location_en;
        case "zhch":
          return data.location_sc;
        case "zhhk":
          return data.location_tc;
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
    } else if (type === "addr") {
      switch (i18n.language) {
        case "enus":
          return data.addr_en;
        case "zhch":
          return data.addr_sc;
        case "zhhk":
          return data.addr_tc;
      }
    }
  };

  const getApprovedText = () => {
    switch (i18n.language) {
      case "enus":
        return "Approved by [UserID] at 2023/09/20 18:00";
      case "zhhk":
        return "於 2023/09/20 18:00 由【UserID】核準";
      case "zhch":
        return "于 2023/09/20 18:00 由【UserID】核准";
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
        <Typography variant="h6">{t("dashboardOverview.checkin")}</Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginLeft: "auto", marginRight: 10 }}
        >
          {dayjs
            .utc(data.record_date)
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
                    0kg - dummy
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
                    SenderName {"->"} ReceiverName
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
                    SenderAddr {"->"} ReceiverAddr
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
