import {
  Alert,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RecycleCard from "../RecycleCard";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import {
  CheckIn,
  CheckinDetail,
  CheckinDetailPhoto,
} from "../../interfaces/checkin";
import { styles } from "../../constants/styles";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import { useContainer } from "unstated-next";
import { il_item } from "./CustomItemList";
import i18n from "../../setups/i18n";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { format } from "../../constants/constant";
import { localStorgeKeyName } from "../../constants/constant";
import { formatWeight } from "../../utils/utils";
import { getDetailCheckInRequests } from "../../APICalls/Collector/warehouseManage";
import NotifContainer from "../../contexts/NotifContainer";
import ProductCard from "../ProductCard";
import zIndex from "@mui/material/styles/zIndex";

type recycItem = {
  recycType: il_item;
  recycSubType: il_item;
  weight: number;
  packageTypeId: string;
  checkinDetailPhoto: CheckinDetailPhoto[];
};

type productItem = {
  productType: il_item;
  productSubType: il_item;
  productAddonType: il_item;
  weight: number;
  packageTypeId: string;
  checkinDetailPhoto: CheckinDetailPhoto[];
};

type props = {
  onClose?: () => void;
  selectedItem?: CheckIn;
};

const RequestForm = ({ onClose, selectedItem }: props) => {
  const { marginTop } = useContainer(NotifContainer);
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // If the overlay is clicked (not its children), close the modal
      onClose && onClose();
    }
  };
  const { recycType, decimalVal, productType } =
    useContainer(CommonTypeContainer);
  const { t } = useTranslation();
  const [selectedDetail, setSelectedDetail] = useState<
    CheckinDetail[] | undefined
  >([]);
  const [recycItem, setRecycItem] = useState<recycItem[]>([]);
  const [productItem, setProductItem] = useState<productItem[]>([]);

  useEffect(() => {
    initCheckinDetail(selectedItem?.chkInId);
    setSelectedDetail(selectedItem?.checkinDetail);
  }, [selectedItem]);

  const initCheckinDetail = async (chkInId: number | undefined) => {
    if (chkInId !== undefined) {
      const result = await getDetailCheckInRequests(chkInId);
      if (result) {
        const recycItems: recycItem[] = [];
        const productItems: productItem[] = [];
        const data = result.data;

        data.forEach((detail: CheckinDetail) => {
          const matchingRecycType = recycType?.find(
            (recyc) => detail.recycTypeId === recyc.recycTypeId
          );
          const matchingProductType = productType?.find(
            (product) => detail.productTypeId === product.productTypeId
          );
          if (matchingRecycType) {
            const matchrecycSubType = matchingRecycType.recycSubType?.find(
              (subtype) => subtype.recycSubTypeId === detail.recycSubTypeId
            );
            var name = "";
            switch (i18n.language) {
              case "enus":
                name = matchingRecycType.recyclableNameEng;
                break;
              case "zhch":
                name = matchingRecycType.recyclableNameSchi;
                break;
              case "zhhk":
                name = matchingRecycType.recyclableNameTchi;
                break;
              default:
                name = matchingRecycType.recyclableNameTchi; //default fallback language is zhhk
                break;
            }
            var subName = "";
            switch (i18n.language) {
              case "enus":
                subName = matchrecycSubType?.recyclableNameEng ?? "";
                break;
              case "zhch":
                subName = matchrecycSubType?.recyclableNameSchi ?? "";
                break;
              case "zhhk":
                subName = matchrecycSubType?.recyclableNameTchi ?? "";
                break;
              default:
                subName = matchrecycSubType?.recyclableNameTchi ?? ""; //default fallback language is zhhk
                break;
            }
            recycItems.push({
              recycType: {
                name: name,
                id: detail.chkInDtlId.toString(),
              },
              recycSubType: {
                name: subName,
                id: detail.chkInDtlId.toString(),
              },
              weight: detail.weight,
              packageTypeId: detail.packageTypeId,
              checkinDetailPhoto: detail.checkinDetailPhoto,
            });
          }
          if (matchingProductType) {
            const matchingProductSubType =
              matchingProductType.productSubType?.find(
                (subtype) =>
                  subtype.productSubTypeId === detail.productSubTypeId
              );
            const matchingProductAddonType =
              matchingProductSubType?.productAddonType?.find(
                (addon) =>
                  addon.productAddonTypeId === detail.productAddonTypeId
              );
            var productName = "";
            var subProductName = "";
            var addonName = "";
            switch (i18n.language) {
              case "enus":
                productName = matchingProductType.productNameEng;
                break;
              case "zhch":
                productName = matchingProductType.productNameSchi;
                break;
              case "zhhk":
                productName = matchingProductType.productNameTchi;
                break;
              default:
                productName = matchingProductType.productNameTchi; //default fallback language is zhhk
                break;
            }
            if (matchingProductSubType) {
              switch (i18n.language) {
                case "enus":
                  subProductName = matchingProductSubType?.productNameEng;
                  break;
                case "zhch":
                  subProductName = matchingProductSubType?.productNameSchi;
                  break;
                case "zhhk":
                  subProductName = matchingProductSubType?.productNameTchi;
                  break;
                default:
                  subProductName = matchingProductSubType?.productNameTchi; //default fallback language is zhhk
                  break;
              }
              if (matchingProductAddonType) {
                switch (i18n.language) {
                  case "enus":
                    addonName = matchingProductAddonType?.productNameEng;
                    break;
                  case "zhch":
                    addonName = matchingProductAddonType?.productNameSchi;
                    break;
                  case "zhhk":
                    addonName = matchingProductAddonType?.productNameTchi;
                    break;
                  default:
                    addonName = matchingProductAddonType?.productNameTchi; //default fallback language is zhhk
                    break;
                }
              }
            }
            productItems.push({
              productType: {
                name: productName,
                id: detail.chkInDtlId.toString(),
              },
              productSubType: {
                name: subProductName,
                id: detail.chkInDtlId.toString(),
              },
              productAddonType: {
                name: addonName,
                id: detail.chkInDtlId.toString(),
              },
              weight: detail.weight,
              packageTypeId: detail.packageTypeId,
              checkinDetailPhoto: detail.checkinDetailPhoto,
            });
          }
        });
        setProductItem(productItems);
        setRecycItem(recycItems);
      }
    }
  };

  // useEffect(() => {
  //   if (selectedDetail && selectedDetail.length > 0) {
  //     const recycItems: recycItem[] = [];

  //     selectedDetail.forEach((detail) => {
  //       const matchingRecycType = recycType?.find(
  //         (recyc) => detail.recycTypeId === recyc.recycTypeId
  //       );
  //       if (matchingRecycType) {
  //         const matchrecycSubType = matchingRecycType.recycSubType?.find(
  //           (subtype) => subtype.recycSubTypeId === detail.recycSubTypeId
  //         );
  //         var name = "";
  //         switch(i18n.language){
  //             case "enus":
  //                 name = matchingRecycType.recyclableNameEng;
  //                 break;
  //             case "zhch":
  //                 name = matchingRecycType.recyclableNameSchi;
  //                 break;
  //             case "zhhk":
  //                 name = matchingRecycType.recyclableNameTchi;
  //                 break;
  //             default:
  //                 name = matchingRecycType.recyclableNameTchi;        //default fallback language is zhhk
  //                 break;
  //         }
  //         var subName = "";
  //                 switch(i18n.language){
  //                     case "enus":
  //                         subName = matchrecycSubType?.recyclableNameEng ?? "";
  //                         break;
  //                     case "zhch":
  //                         subName = matchrecycSubType?.recyclableNameSchi ?? "";
  //                         break;
  //                     case "zhhk":
  //                         subName = matchrecycSubType?.recyclableNameTchi ?? "";
  //                         break;
  //                     default:
  //                         subName = matchrecycSubType?.recyclableNameTchi ?? "";       //default fallback language is zhhk
  //                         break;
  //                 }
  //         recycItems.push({
  //           recycType: {
  //             name: name,
  //             id: detail.chkInDtlId.toString(),
  //           },
  //           recycSubType: {
  //             name: subName,
  //             id: detail.chkInDtlId.toString(),
  //           },
  //           weight:detail.weight,
  //           packageTypeId: detail.packageTypeId
  //         });
  //       }
  //     });
  //     setRecycItem(recycItems);
  //   }
  // }, [selectedDetail, recycType]);

  const updatedDate = selectedItem?.updatedAt
    ? dayjs(new Date(selectedItem?.updatedAt)).format(format.dateFormat1)
    : "-";

  const loginId = localStorage.getItem(localStorgeKeyName.username) || "";

  const messageCheckin = `[${loginId}] ${t(
    "check_out.approved_on"
  )} ${updatedDate} ${t("check_out.reason_is")} ${selectedItem?.reason}`;

  console.log(productItem, "productItmmem");

  return (
    <Box sx={{ ...localstyles.modal, marginTop }} onClick={handleOverlayClick}>
      <Box sx={localstyles.container} className="md:w-[500px] w-[100vw]">
        <Box sx={localstyles.header}>
          <Box>
            <Typography sx={styles.header4}>
              {t("check_in.request_check_in")}
            </Typography>
            <Typography sx={styles.header3}>{selectedItem?.picoId}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignSelf: "center" }}>
            <IconButton onClick={onClose}>
              <KeyboardTabIcon sx={{ fontSize: "30px" }} />
            </IconButton>
          </Box>
        </Box>
        <Divider />
        <Stack spacing={2} sx={localstyles.content}>
          {selectedItem?.adjustmentFlg && (
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
              {t("check_in.stock_adjustment")}
            </Alert>
          )}

          <Box>
            <Typography sx={localstyles.typo_header}>
              {t("check_in.transport_information")}
            </Typography>
          </Box>

          <Box>
            <Typography sx={localstyles.typo_fieldTitle}>
              {t("check_in.logistic_company")}
            </Typography>
            <Typography sx={localstyles.typo_fieldContent}>
              {selectedItem?.logisticName}
            </Typography>
          </Box>

          <Box>
            <Typography sx={localstyles.typo_fieldTitle}>
              {t("check_in.sender_company")}
            </Typography>
            <Typography sx={localstyles.typo_fieldContent}>
              {selectedItem?.senderName}
            </Typography>
          </Box>

          <Box>
            <Typography sx={localstyles.typo_fieldTitle}>
              {t("check_in.receiver_company")}
            </Typography>
            <Typography sx={localstyles.typo_fieldContent}>
              {selectedItem?.receiverName ?? "-"}
            </Typography>
          </Box>

          <Typography sx={localstyles.typo_header}>
            {t("check_in.recyc_loc_info")}
          </Typography>
          <Box display="flex" flexDirection="row">
            <Box sx={{ flex: 1 }}>
              <Typography sx={localstyles.typo_fieldTitle}>
                {t("check_out.shipping_location")}
              </Typography>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedItem?.senderAddr}
              </Typography>
            </Box>

            <Box sx={{ flex: 1, display: "flex", flexDirection: "row" }}>
              <Box alignSelf="left" sx={{ mr: "35px" }}>
                <ArrowForwardIcon
                  style={{ color: "#9f9f9f", fontSize: "30px" }}
                />
              </Box>
              <Box>
                <Typography sx={localstyles.typo_fieldTitle}>
                  {t("pick_up_order.detail.arrived")}
                </Typography>
                <Typography sx={localstyles.typo_fieldContent}>
                  {selectedItem?.receiverAddr ?? "-"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography sx={localstyles.typo_fieldTitle}>
            {t("check_in.recyclable_type_weight")}
          </Typography>
          {recycItem.map((item, index) => {
            return (
              <RecycleCard
                key={item.recycType.id}
                name={item.recycType.name}
                bgcolor="#e1f4ff"
                fontcolor="#66bff6"
                weight={formatWeight(item.weight, decimalVal)}
                showImage={true}
                packageTypeId={item.packageTypeId}
                recycleName={item.recycSubType.name}
                recycleType={item.recycType.name}
                images={item.checkinDetailPhoto}
              />
            );
          })}
          {productItem.map((item, index) => {
            return (
              <ProductCard
                key={item.productType.id}
                name={item.productType.name}
                bgcolor="#e1f4ff"
                fontcolor="#66bff6"
                weight={formatWeight(item.weight, decimalVal)}
                showImage={true}
                packageTypeId={item.packageTypeId}
                productName={item.productSubType.name}
                productType={item.productType.name}
                productAddon={item.productAddonType.name}
                images={item.checkinDetailPhoto}
              />
            );
          })}
          {selectedItem?.status !== "CREATED" && (
            <Box>
              <div className="message">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t("check_out.message")}
                </div>
                <div className=" text-sm text-[#717171] font-medium tracking-widest">
                  {messageCheckin}
                </div>
              </div>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

let localstyles = {
  modal: {
    display: "flex",
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    bgcolor: "white",
    overflowY: "scroll",
    zIndex: 500,
  },
  header: {
    display: "flex",
    flex: 1,
    p: 4,
    justifyContent: "space-between",
  },
  content: {
    flex: 9,
    p: 4,
    mb: 2,
  },
  typo_header: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#858585",
    letterSpacing: "2px",
    mt: "10px",
  },
  typo_fieldTitle: {
    fontSize: "15px",
    color: "#ACACAC",
    letterSpacing: "2px",
  },
  typo_fieldContent: {
    fontSize: "17PX",
    letterSpacing: "2px",
  },
};

export default RequestForm;
