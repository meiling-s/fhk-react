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
import { ProcessOutData } from "../../interfaces/inventory";
import { useTranslation } from "react-i18next";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  CALENDAR_ICON,
  CATEGORY_ICON,
  COMPANY_ICON,
  FACTORY_ICON,
  INVENTORY_ICON,
  MEMORY_ICON,
  WEIGHT_ICON,
} from "src/themes/icons";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "src/contexts/CommonTypeContainer";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ProcessOutCardProps {
  data: ProcessOutData;
}

const ProcessOutCard: FunctionComponent<ProcessOutCardProps> = ({ data }) => {
  const { weightUnits, dateFormat } = useContainer(CommonTypeContainer);
  const { i18n, t } = useTranslation();
  const [expanded, setExpanded] = useState(true);
  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  console.log(data, "data");

  const getConditionalValue = (data: ProcessOutData, type: string) => {
    if (type === "company") {
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
    } else if (type === "category") {
      switch (i18n.language) {
        case "enus":
          return data.process_type_en;
        case "zhch":
          return data.process_type_sc;
        case "zhhk":
          return data.process_type_tc;
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
        <Typography variant="h6">{t("inventory.process_out")}</Typography>
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
          <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
            <Grid item xs={12}>
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
                    {getConditionalValue(data, "category")}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Box>
          <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
            <Box width="30%">
              <Box display="flex" alignItems="center">
                <FACTORY_ICON
                  fontSize="small"
                  sx={{ marginRight: 1, color: "#ACACAC" }}
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ color: "#ACACAC" }}
                >
                  {t("inventory.factory")}
                </Typography>
              </Box>
            </Box>
            <Box width="70%">
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ color: "#535353" }}
              >
                {getConditionalValue(data, "factory")}
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
                    {data.process_in.total_weight}{" "}
                    {getConditionalValue(data, "weightUnit")}
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
                    {data.process_out.total_weight}{" "}
                    {getConditionalValue(data, "weightUnit")}
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

export default ProcessOutCard;
