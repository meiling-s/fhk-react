import { Box } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import {
  InventoryTracking,
  EventTrackingData,
  ProcessingRecordData,
  CheckinData,
  ProcessOutData,
  StockAdjustmentData,
  InternalTransferData,
  GIDValue,
} from "../../../interfaces/inventory";
import { getItemTrackInventory } from "src/APICalls/Collector/inventory";
import CheckinCard from "src/components/Inventory/CheckinCard";
import StockAdjustmentCard from "src/components/Inventory/StockAdjustmentCard";
import ProcessOutCard from "src/components/Inventory/ProcessOutCard";
import ProcessingRecordCard from "../../../components/Inventory/ProcessingRecord";
import InternalTransferCard from "src/components/Inventory/InternalTransfer";
import CompactorCard from "src/components/Inventory/CompactorCard";

interface ItemTrackingProps {
  shippingData: InventoryTracking;
  handleGetHyperlinkData: (gidValue: GIDValue) => void;
}

const ItemTracking: FunctionComponent<ItemTrackingProps> = ({
  shippingData,
  handleGetHyperlinkData,
}) => {
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

  const handleClickGIDLabel = (gidValue: GIDValue) => {
    if (shippingData.gid !== gidValue.gid) {
      handleGetHyperlinkData(gidValue);
    }
  };

  useEffect(() => {
    if (shippingData.event.length > 0) {
      const processedData: InventoryTracking = { ...shippingData };
      const processEventDetails = async () => {
        const updatedEvents = await Promise.all(
          shippingData.event.map(async (value: EventTrackingData) => {
            if (
              value.eventType === "processout" ||
              value.eventType === "processin" ||
              value.eventType === "compactorProcessout"
            ) {
              const details = JSON.parse(value.eventDetail);
              details.process_in.gidLabel =
                details.process_in.gid.length > 0
                  ? await getGIDLabel(details.process_in.gid[0])
                  : "";
              details.process_out.gidLabel =
                details.process_out.gid.length > 0
                  ? await getGIDLabel(details.process_out.gid[0])
                  : "";
              details.createdAt = value.createdAt;
              details.unitId = shippingData.unitId;
              details.eventType = value.eventType;

              return { ...value, details };
            } else if (value.eventType === "processRecord") {
              const details = JSON.parse(value.eventDetail);
              details.gidLabel =
                details.gid.length > 0 ? await getGIDLabel(details.gid[0]) : "";
              details.unitId = shippingData.unitId;
              details.createdAt = value.createdAt;
              return { ...value, details };
            } else if (value.eventType === "checkin") {
              const details = JSON.parse(value.eventDetail);
              details.unitId = shippingData.unitId;
              details.createdAt = value.createdAt;
              details.createdBy = value.createdBy;

              return { ...value, details };
            } else if (
              value.eventType === "checkin_stockAdjustment" ||
              value.eventType === "checkout_stockAdjustment"
            ) {
              const details = JSON.parse(value.eventDetail);
              details.createdAt = value.createdAt;
              details.createdBy = value.createdBy;
              details.eventType = value.eventType;

              return { ...value, details };
            } else if (value.eventType === "internalTransfer") {
              const details = JSON.parse(value.eventDetail);
              details.createdAt = value.createdAt;

              return { ...value, details };
            } else if (value.eventType === "checkin_stockAdjustment") {
              const details = JSON.parse(value.eventDetail);
              details.createdAt = value.createdAt;
              details.createdBy = value.createdBy;

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

  return (
    <Box marginTop={2}>
      {parsedEventDetails?.event.map((eventItem: EventTrackingData) => {
        return (
          <Box key={eventItem.gidEventId} sx={{ marginBottom: 4 }}>
            {eventItem.eventType === "compactorProcessout" && (
              <CompactorCard
                data={eventItem.details as ProcessOutData}
                handleClickGIDLabel={handleClickGIDLabel}
              />
            )}
            {eventItem.eventType === "checkin" && (
              <CheckinCard data={eventItem.details as CheckinData} />
            )}
            {eventItem.eventType === "checkin_stockAdjustment" ||
            eventItem.eventType === "checkout_stockAdjustment" ? (
              <StockAdjustmentCard
                data={eventItem.details as StockAdjustmentData}
              />
            ) : null}
            {eventItem.eventType === "processout" ||
            eventItem.eventType === "processin" ? (
              <ProcessOutCard
                data={eventItem.details as ProcessOutData}
                handleClickGIDLabel={handleClickGIDLabel}
              />
            ) : null}
            {eventItem.eventType === "processRecord" && (
              <ProcessingRecordCard
                data={eventItem.details as ProcessingRecordData}
              />
            )}
            {eventItem.eventType === "internalTransfer" && (
              <InternalTransferCard
                data={eventItem.details as InternalTransferData}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default ItemTracking;
