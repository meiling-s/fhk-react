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

interface CompactorCardProps {
  data: EventDetailTracking;
}

const CompactorCard: FunctionComponent<CompactorCardProps> = ({ data }) => {
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
          {getConditionalValue(data, "title")}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginLeft: "auto", marginRight: 10 }}
        >
          Date
        </Typography>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent
          sx={{ padding: 0, marginLeft: 3, marginBottom: 1, marginTop: 2 }}
        >
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
        </CardContent>
        <CardContent sx={{ padding: 0, marginLeft: 3 }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            color="#717171"
          >
            {t("inventory.beforeProcessing")}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Box width="30%">
                  <Box display="flex" alignItems="center">
                    <MEMORY_ICON
                      fontSize="small"
                      sx={{ marginRight: 1, color: "#ACACAC" }}
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ color: "#ACACAC" }}
                    >
                      {t("inventory.itemNumber")}
                    </Typography>
                  </Box>
                </Box>
                <Box width="70%">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ color: "#199BEC", cursor: "pointer" }}
                  >
                    {data.process_out.gidLabel}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Box width="30%">
                  <Box display="flex" alignItems="center">
                    <CALENDAR_ICON
                      fontSize="small"
                      sx={{ marginRight: 1, color: "#ACACAC" }}
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ color: "#ACACAC" }}
                    >
                      Start Date & Time
                    </Typography>
                  </Box>
                </Box>
                <Box width="70%">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ color: "#535353" }}
                  >
                    {data.process_in.start_date_time
                      ? new Date(
                          data.process_in.start_date_time
                        ).toLocaleString()
                      : "-"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
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
                      {t("inventory.warehouse")}
                    </Typography>
                  </Box>
                </Box>
                <Box width="70%">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ color: "#535353" }}
                  >
                    {getConditionalValue(data, "processin_warehouse")}
                  </Typography>
                </Box>
              </Box>
            </Grid>
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
                      Weight
                    </Typography>
                  </Box>
                </Box>
                <Box width="70%">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ color: "#535353" }}
                  >
                    {data.process_in.total_weight || "-"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            color="#717171"
            mt={2}
          >
            {t("inventory.afterProcessing")}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Box width="30%">
                  <Box display="flex" alignItems="center">
                    <MEMORY_ICON
                      fontSize="small"
                      sx={{ marginRight: 1, color: "#ACACAC" }}
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ color: "#ACACAC" }}
                    >
                      {t("inventory.itemNumber")}
                    </Typography>
                  </Box>
                </Box>
                <Box width="70%">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ color: "#199BEC", cursor: "pointer" }}
                  >
                    {data.process_in.gidLabel}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Box width="30%">
                  <Box display="flex" alignItems="center">
                    <CALENDAR_ICON
                      fontSize="small"
                      sx={{ marginRight: 1, color: "#ACACAC" }}
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ color: "#ACACAC" }}
                    >
                      {t("inventory.start_date")}
                    </Typography>
                  </Box>
                </Box>
                <Box width="70%">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ color: "#535353" }}
                  >
                    {data.process_out.start_date_time
                      ? new Date(
                          data.process_out.start_date_time
                        ).toLocaleString()
                      : "-"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
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
                      {t("inventory.warehouse")}
                    </Typography>
                  </Box>
                </Box>
                <Box width="70%">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ color: "#535353" }}
                  >
                    {getConditionalValue(data, "processout_warehouse")}
                  </Typography>
                </Box>
              </Box>
            </Grid>
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
                      Weight
                    </Typography>
                  </Box>
                </Box>
                <Box width="70%">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ color: "#535353" }}
                  >
                    {data.process_out.total_weight || "-"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default CompactorCard;
