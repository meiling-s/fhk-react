import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Collapse,
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import { GIDValue, ProcessingRecordData } from "../../interfaces/inventory";
import { useTranslation } from "react-i18next";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  COMPANY_ICON,
  INVENTORY_ICON,
  MEMORY_ICON,
  WEIGHT_ICON,
} from "src/themes/icons";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "src/contexts/CommonTypeContainer";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ProcessingRecordCardProps {
  data: ProcessingRecordData;
  handleClickGIDLabel: (gidValue: GIDValue) => void;
}

const ProcessingRecordCard: FunctionComponent<ProcessingRecordCardProps> = ({
  data,
  handleClickGIDLabel,
}) => {
  const { i18n, t } = useTranslation();
  const { weightUnits, dateFormat } = useContainer(CommonTypeContainer);
  const [expanded, setExpanded] = useState(true);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  const getConditionalValue = (data: ProcessingRecordData, type: string) => {
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
        <Typography variant="h6">
          {t("processRecord.processingRecords")}
        </Typography>
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
                {data.gidLabel.length > 0 &&
                  data.gidLabel.map((item: string, index: number) => {
                    const last = data.gidLabel[data.gidLabel.length - 1];
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
                          const indexItem = data.gidLabel.indexOf(item);
                          const gidValue = {
                            gid: data.gid[indexItem],
                            gidLabel: item,
                          };
                          handleClickGIDLabel(gidValue);
                        }}
                      >
                        {item}
                      </Typography>
                    );
                  })}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
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
                  {t("inventory.warehouse_recycling")}
                </Typography>
              </Box>
            </Box>
            <Box width="70%">
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ color: "#535353" }}
              >
                {getConditionalValue(data, "location")}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
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
                {data.total_weight} Kg
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ProcessingRecordCard;
