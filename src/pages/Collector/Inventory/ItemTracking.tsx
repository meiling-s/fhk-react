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
} from "../../../interfaces/inventory";
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
import CheckinCard from "src/components/Inventory/CheckinCard";
import CompactorCard from "src/components/Inventory/CompactorCard";
import StockAdjustmentCard from "src/components/Inventory/StockAdjustmentCard";
import ProcessOutCard from "src/components/Inventory/ProcessOutCard";
import ProcessingRecordCard from "../../../components/Inventory/ProcessingRecord";
import InternalTransferCard from "src/components/Inventory/InternalTransfer";

interface ItemTrackingProps {
  shippingData: InventoryTracking;
}

const ItemTracking: FunctionComponent<ItemTrackingProps> = ({
  shippingData,
}) => {
  const { i18n, t } = useTranslation();
  const [parsedEventDetails, setParsedEventDetails] =
    useState<InventoryTracking>();

  const getGIDLabel = async (value: string) => {
    const result = await getItemTrackInventory(value);
    if (result) {
      const data = result.data;
      return data.labelId;
    }

    return "";
  };

  useEffect(() => {
    if (shippingData.event.length > 0) {
      const processedData: InventoryTracking = { ...shippingData };
      const processEventDetails = async () => {
        const updatedEvents = await Promise.all(
          shippingData.event.map(async (value: EventTrackingData) => {
            if (value.eventType === "processout") {
              const details = JSON.parse(value.eventDetail);
              details.process_in.gidLabel =
                details.process_in.gid.length > 0
                  ? await getGIDLabel(details.process_in.gid[0])
                  : "";
              details.process_out.gidLabel =
                details.process_out.gid.length > 0
                  ? await getGIDLabel(details.process_out.gid[0])
                  : "";

              return { ...value, details };
            }

            return value;
          })
        );
        processedData.event = updatedEvents;

        setParsedEventDetails(processedData);
      };

      processEventDetails();
    }
  }, [shippingData]);

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
    <Box marginTop={2}>
      {parsedEventDetails?.event.map((eventItem: EventTrackingData) => {
        return (
          <Box key={eventItem.gidEventId} sx={{ marginBottom: 4 }}>
            {eventItem.eventType === "processout" && (
              <CompactorCard data={eventItem.details} />
            )}
            <CheckinCard data={eventItem.details} />
            <StockAdjustmentCard data={eventItem.details} />
            <ProcessOutCard data={eventItem.details} />
            <ProcessingRecordCard data={eventItem.details} />
            <InternalTransferCard data={eventItem.details} />
          </Box>
        );
      })}
    </Box>
  );
};

export default ItemTracking;
