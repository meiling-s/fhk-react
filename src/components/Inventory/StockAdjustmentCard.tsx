import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  Collapse,
} from "@mui/material";
import React, { FunctionComponent, useEffect, useState } from "react";
import {
  InventoryDetail as InvDetails,
  InventoryTracking,
  EventTrackingData,
  EventDetailTracking,
} from "../../interfaces/inventory";
import { useTranslation } from "react-i18next";
import {
  AccountTree,
  CalendarToday,
  ExpandLess,
  ExpandMore,
  LocationOn,
  Scale,
} from "@mui/icons-material";
import {
  CALENDAR_ICON,
  CATEGORY_ICON,
  COMPANY_ICON,
  FACTORY_ICON,
  FOLDER_ICON,
  INVENTORY_ICON,
  MEMORY_ICON,
  WEIGHT_ICON,
} from "src/themes/icons";
import { getItemTrackInventory } from "src/APICalls/Collector/inventory";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface StockAdjustmentCardProps {
  data: EventDetailTracking;
}

const StockAdjustmentCard: FunctionComponent<StockAdjustmentCardProps> = ({
  data,
}) => {
  const { i18n, t } = useTranslation();
  const [expanded, setExpanded] = useState(true);
  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  const getConditionalValue = (data: EventDetailTracking, type: string) => {
    if (type === "title") {
      switch (i18n.language) {
        case "enus":
          return data.process_type_en;
        case "zhch":
          return data.process_type_sc;
        case "zhhk":
          return data.process_type_tc;
      }
    } else if (type === "company") {
      switch (i18n.language) {
        case "enus":
          return data.company_name_en;
        case "zhch":
          return data.company_name_sc;
        case "zhhk":
          return data.company_name_tc;
      }
    } else if (type === "factory") {
      switch (i18n.language) {
        case "enus":
          return data.factory_name_en;
        case "zhch":
          return data.factory_name_sc;
        case "zhhk":
          return data.factory_name_tc;
      }
    } else if (type === "processin_warehouse") {
      switch (i18n.language) {
        case "enus":
          return data.process_in.warehouse_en;
        case "zhch":
          return data.process_in.warehouse_sc;
        case "zhhk":
          return data.process_in.warehouse_tc;
      }
    } else if (type === "processout_warehouse") {
      switch (i18n.language) {
        case "enus":
          return data.process_out.warehouse_en;
        case "zhch":
          return data.process_out.warehouse_sc;
        case "zhhk":
          return data.process_out.warehouse_tc;
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
        <Typography variant="h6">Stock Adjustment</Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginLeft: "auto", marginRight: 10 }}
        >
          Date
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
                Company - Dummy
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
