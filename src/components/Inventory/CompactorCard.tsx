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
import { GIDValue, ProcessOutData } from "../../interfaces/inventory";
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

interface CompactorCardProps {
  data: ProcessOutData;
  handleClickGIDLabel: (gidValue: GIDValue) => void;
}

const CompactorCard: FunctionComponent<CompactorCardProps> = ({
  data,
  handleClickGIDLabel,
}) => {
  const { weightUnits, dateFormat } = useContainer(CommonTypeContainer);
  const { i18n, t } = useTranslation();
  const [expanded, setExpanded] = useState(true);
  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

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

  const getMoreText = () => {
    switch (i18n.language) {
      case "enus":
        return "(more than 1)";
      case "zhch":
        return "(或多於一個)";
      case "zhhk":
        return "(或多於一個)";
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
        <Typography variant="h6">{t("inventory.compactor")}</Typography>
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
                <Box
                  width="70%"
                  display={"flex"}
                  flexDirection={"row"}
                  flexWrap={"wrap"}
                >
                  {data.process_in.gidLabel.length > 0 &&
                    data.process_in.gidLabel.map(
                      (item: string, index: number) => {
                        const last =
                          data.process_in.gidLabel[
                            data.process_in.gidLabel.length - 1
                          ];
                        return (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{
                              color: "#199BEC",
                              cursor: "pointer",
                              marginRight: item === last ? 0 : 1,
                            }}
                            key={index}
                            onClick={() => {
                              const indexItem =
                                data.process_in.gidLabel.indexOf(item);
                              const gidValue = {
                                gid: data.process_in.gid[indexItem],
                                gidLabel: item,
                              };
                              handleClickGIDLabel(gidValue);
                            }}
                          >
                            {item}
                          </Typography>
                        );
                      }
                    )}
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
                    {dayjs
                      .utc(data.process_in.start_date_time)
                      .tz("Asia/Hong_Kong")
                      .format(`${dateFormat} HH:mm A`)}
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
                    {getConditionalValue(data, "processin_warehouse")}{" "}
                    {data.process_in.gidLabel.length > 1 ? getMoreText() : null}
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
                <Box
                  width="70%"
                  display={"flex"}
                  flexDirection={"row"}
                  flexWrap={"wrap"}
                >
                  {data.process_out.gidLabel.length > 0 &&
                    data.process_out.gidLabel.map(
                      (item: string, index: number) => {
                        const last =
                          data.process_out.gidLabel[
                            data.process_out.gidLabel.length - 1
                          ];
                        return (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{
                              color: "#199BEC",
                              cursor: "pointer",
                              marginRight: item === last ? 0 : 1,
                            }}
                            key={index}
                            onClick={() => {
                              const indexItem =
                                data.process_out.gidLabel.indexOf(item);
                              const gidValue = {
                                gid: data.process_out.gid[indexItem],
                                gidLabel: item,
                              };
                              handleClickGIDLabel(gidValue);
                            }}
                          >
                            {item}
                          </Typography>
                        );
                      }
                    )}
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
                    {dayjs
                      .utc(data.process_out.start_date_time)
                      .tz("Asia/Hong_Kong")
                      .format(`${dateFormat} HH:mm A`)}
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
                    {getConditionalValue(data, "processout_warehouse")}{" "}
                    {data.process_out.gidLabel.length > 1
                      ? getMoreText()
                      : null}
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
                    {data.process_out.total_weight} Kg
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
