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
import {
  ProcessOutData,
  StockAdjustmentData,
} from "../../interfaces/inventory";
import { useTranslation } from "react-i18next";
import { ExpandLess, ExpandMore, LocationOn } from "@mui/icons-material";
import { CATEGORY_ICON, COMPANY_ICON, INVENTORY_ICON } from "src/themes/icons";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "src/contexts/CommonTypeContainer";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface StockAdjustmentCardProps {
  data: StockAdjustmentData;
}

const StockAdjustmentCard: FunctionComponent<StockAdjustmentCardProps> = ({
  data,
}) => {
  const { i18n, t } = useTranslation();
  const { dateFormat } = useContainer(CommonTypeContainer);
  const [expanded, setExpanded] = useState(true);
  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  const getConditionalValue = (data: StockAdjustmentData, type: string) => {
    if (type === "company") {
      switch (i18n.language) {
        case "enus":
          return data.company_name_en;
        case "zhch":
          return data.company_name_sc;
        case "zhhk":
          return data.company_name_tc;
      }
    }
  };

  const getApprovedText = () => {
    switch (i18n.language) {
      case "enus":
        return `Approved by [${data.createdBy}] at ${dayjs
          .utc(data.record_date)
          .tz("Asia/Hong_Kong")
          .format(`${dateFormat} HH:mm`)}`;
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
        <Typography variant="h6">{t("check_in.stock_adjustment")}</Typography>
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
        <CardContent sx={{ padding: 0, marginLeft: 3, marginTop: 1 }}>
          <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
            <Grid item xs={12} mb={1}>
              <Box display="flex" alignItems="center">
                <Box width="30%">
                  <Box display="flex" alignItems="center">
                    <CATEGORY_ICON
                      fontSize="small"
                      sx={{ marginRight: 1, color: "#ACACAC" }}
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ color: "#ACACAC" }}
                    >
                      {t("common.category")}
                    </Typography>
                  </Box>
                </Box>
                <Box width="70%">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ color: "#535353" }}
                  >
                    Category - Dummy
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Box>
          <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
            <Box width="30%">
              <Box display="flex" alignItems="center">
                <COMPANY_ICON
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
          <Grid item xs={12} mb={1}>
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
                    {t("inventory.delivery_to_warehouse")}
                  </Typography>
                </Box>
              </Box>
              <Box width="70%">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ color: "#535353" }}
                >
                  Warehouse Name - Dummy
                </Typography>
              </Box>
            </Box>
          </Grid>
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
                    {t("inventory.delivery_location")}
                  </Typography>
                </Box>
              </Box>
              <Box width="70%">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ color: "#535353" }}
                >
                  Warehouse Address - Dummy
                </Typography>
              </Box>
            </Box>
          </Grid>
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

export default StockAdjustmentCard;
