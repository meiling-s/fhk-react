import { Box, Grid, Divider, Typography } from "@mui/material";
import React, { FunctionComponent, useEffect, useState } from "react";
import { styles } from "../../../constants/styles";
import RightOverlayForm from "../../../components/RightOverlayForm";
import CustomField from "../../../components/FormComponents/CustomField";
import CircularLoading from "../../../components/CircularLoading";
import {
  InventoryItem,
  InventoryTracking,
  GIDValue,
} from "../../../interfaces/inventory";
import { useTranslation } from "react-i18next";
import { returnApiToken, formatWeight } from "../../../utils/utils";
import { getItemTrackInventory } from "../../../APICalls/Collector/inventory";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import ItemTracking from "./ItemTracking";
import { useLocation } from "react-router-dom";

interface InventoryDetailProps {
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  selectedRow?: InventoryItem | null;
  handleGetHyperlinkData: (gidValue: GIDValue) => void;
}

const InventoryDetail: FunctionComponent<InventoryDetailProps> = ({
  drawerOpen,
  handleDrawerClose,
  selectedRow,
  handleGetHyperlinkData,
}) => {
  const { t } = useTranslation();
  const [shippingData, setShippingData] = useState<InventoryTracking | null>(
    null
  );
  const { decimalVal } = useContainer(CommonTypeContainer);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();

  const fieldItem = [
    {
      label: t("inventory.date"),
      value: selectedRow?.createdAt,
    },
    {
      label: t("processOrder.details.itemCategory"),
      value: selectedRow?.recycTypeId ? t("recyclables") : t("product"),
    },
    {
      label: t("settings_page.recycling.main_category"),
      value: selectedRow?.recycTypeId
        ? selectedRow?.recyName || "-"
        : selectedRow?.productName || "-",
    },
    {
      label: t("settings_page.recycling.sub_category"),
      value: selectedRow?.recycTypeId
        ? selectedRow?.subName || "-"
        : selectedRow?.productSubName || "-",
    },
    {
      label: t("settings_page.recycling.additional_category"),
      value: selectedRow?.recycTypeId
        ? "-"
        : selectedRow?.productAddOnName || "-",
    },
    {
      label: t("inventory.package"),
      value: selectedRow?.packageName,
    },
    {
      label: t("inventory.inventoryLocation"),
      value: selectedRow?.location,
    },
    {
      label: t("inventory.weight"),
      value: `${formatWeight(selectedRow?.weight || 0, decimalVal)} kg`,
    },
  ];

  const filteredFieldItem = fieldItem.filter((item) => {
    if (
      location.pathname === "/astd/globalItemID" &&
      item.label === t("inventory.inventoryLocation")
    ) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    initItemTrackInventory();
  }, [selectedRow]);

  const initItemTrackInventory = async () => {
    setIsLoading(true);
    const token = returnApiToken();
    setShippingData(null);
    if (selectedRow !== null && selectedRow !== undefined) {
      let result;
      result = await getItemTrackInventory(selectedRow.gid);

      if (result) {
        const data = result.data;
        setShippingData(data);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="detail-inventory">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={"right"}
        action={"none"}
        useConfirmModal={false}
        headerProps={{
          title: t("inventory.recyclingNumber"),
          subTitle: `${selectedRow?.labelId}`,
          onCloseHeader: handleDrawerClose,
        }}
      >
        <Divider />
        <Box sx={{ PaddingX: 2 }}>
          <Grid
            container
            direction={"column"}
            spacing={4}
            sx={{
              width: { xs: "100%" },
              marginTop: { sm: 2, xs: 6 },
              marginLeft: {
                xs: 0,
              },
              paddingRight: 2,
            }}
            className="sm:ml-0 mt-o w-full"
          >
            <Grid item>
              <Box>
                <Typography sx={styles.header2}>
                  {t("warehouseDashboard.recyclingInformation")}
                </Typography>
              </Box>
            </Grid>
            {filteredFieldItem.map((item, index) => {
              return (
                <Grid item key={index}>
                  <CustomField label={item.label}>
                    <Typography sx={localStyle.textField}>
                      {item.value}
                    </Typography>
                  </CustomField>
                </Grid>
              );
            })}
            {isLoading ? (
              <CircularLoading />
            ) : (
              <Grid item>
                {shippingData !== null && (
                  <Grid>
                    <Typography sx={styles.header2}>
                      {t("inventory.track")}
                    </Typography>
                    {/* <InventoryShippingCard shippingData={shippingData} /> */}
                    <ItemTracking
                      shippingData={shippingData}
                      handleGetHyperlinkData={handleGetHyperlinkData}
                    />
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
        </Box>
      </RightOverlayForm>
    </div>
  );
};

let localStyle = {
  textField: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  card: {
    borderColor: "ACACAC",
    borderRadius: "10px",
    padding: 2,
    borderWidth: "1px",
    borderStyle: "solid",
    marginBottom: 2,
  },
};
export default InventoryDetail;
