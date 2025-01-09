import { FunctionComponent, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ImageIcon from "@mui/icons-material/Image";
import AspectRatio from "@mui/joy/AspectRatio";
import {
  CheckOut,
  CheckoutDetail,
  CheckoutDetailPhoto,
} from "../../../interfaces/checkout";

import RightOverlayForm from "../../../components/RightOverlayForm";
import { Box, Stack } from "@mui/material";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import { il_item } from "../../../components/FormComponents/CustomItemList";
import { useContainer } from "unstated-next";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { format } from "../../../constants/constant";
import i18n from "../../../setups/i18n";
import { localStorgeKeyName } from "../../../constants/constant";
import { formatWeight } from "../../../utils/utils";
import { getDetailCheckoutRequests } from "../../../APICalls/Collector/checkout";
import ProductCard from "src/components/ProductCard";
import RecycleCard from "src/components/RecycleCard";

dayjs.extend(utc);
dayjs.extend(timezone);

type recycItem = {
  recycType: il_item;
  recycSubType: il_item;
  weight: number;
  packageTypeId: string;
  checkoutDetailPhoto: CheckoutDetailPhoto[];
};

type productItem = {
  productType: il_item;
  productSubType: il_item;
  productAddonType: il_item;
  weight: number;
  packageTypeId: string;
  checkoutDetailPhoto: CheckoutDetailPhoto[];
};

interface CheckOutDetailsProps {
  selectedCheckOut?: CheckOut;
  drawerOpen: boolean;
  handleDrawerClose: () => void;
}

const CheckOutDetails: FunctionComponent<CheckOutDetailsProps> = ({
  selectedCheckOut,
  drawerOpen = false,
  handleDrawerClose,
}) => {
  const { t } = useTranslation();
  const { recycType, decimalVal, dateFormat, packagingList, productType } =
    useContainer(CommonTypeContainer);
  const [selectedDetail, setSelectedDetail] = useState<
    CheckoutDetail[] | undefined
  >([]);
  const [recycItem, setRecycItem] = useState<recycItem[]>([]);
  const [productItem, setProductItem] = useState<productItem[]>([]);

  const poNumber =
    selectedCheckOut?.picoId != null ? `${selectedCheckOut.picoId}` : "";
  const shippingInfo = [
    {
      label: t("check_out.logistic_company"),
      value: selectedCheckOut?.logisticName,
    },
    {
      label: t("check_in.sender_company"),
      value: selectedCheckOut?.senderCompany,
    },
    {
      label: t("check_out.receiver_company"),
      value: selectedCheckOut?.receiverName,
    },
  ];

  const loginId = localStorage.getItem(localStorgeKeyName.username) || "";

  const updatedDate = selectedCheckOut?.updatedAt
    ? dayjs
        .utc(new Date(selectedCheckOut?.updatedAt))
        .tz("Asia/Hong_Kong")
        .format(`${dateFormat} HH:mm`)
    : "-";
  const messageCheckout = `[${loginId}] ${t(
    "check_out.approved_on"
  )} ${updatedDate} ${t("check_out.reason_is")} ${selectedCheckOut?.reason}`;

  useEffect(() => {
    setSelectedDetail(selectedCheckOut?.checkoutDetail);
    initCheckoutDetail(selectedCheckOut?.chkOutId);
  }, [selectedCheckOut]);

  const initCheckoutDetail = async (chkOutId: number | undefined) => {
    if (chkOutId !== undefined) {
      const result = await getDetailCheckoutRequests(chkOutId);
      if (result) {
        const recycItems: recycItem[] = [];
        const productItems: productItem[] = [];
        const data = result.data;

        data.forEach((detail: CheckoutDetail) => {
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
                id: detail.chkOutDtlId.toString(),
              },
              recycSubType: {
                name: subName,
                id: detail.chkOutDtlId.toString(),
              },
              weight: detail.weight,
              packageTypeId: detail.packageTypeId,
              checkoutDetailPhoto: detail.checkoutDetailPhoto,
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
                id: detail.chkOutDtlId.toString(),
              },
              productSubType: {
                name: subProductName,
                id: detail.chkOutDtlId.toString(),
              },
              productAddonType: {
                name: addonName,
                id: detail.chkOutDtlId.toString(),
              },
              weight: detail.weight,
              packageTypeId: detail.packageTypeId,
              checkoutDetailPhoto: detail.checkoutDetailPhoto,
            });
          }
        });
        setProductItem(productItems);
        setRecycItem(recycItems);
      }
    }
  };

  return (
    <div className="checkin-request-detail">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={"right"}
        action={"none"}
        headerProps={{
          title: t("check_out.request_check_out"),
          subTitle: poNumber,
          onCloseHeader: handleDrawerClose,
        }}
        useConfirmModal={false}
      >
        <div
          style={{ borderTop: "1px solid lightgrey" }}
          className="content p-6"
        >
          <Stack spacing={4}>
            {selectedCheckOut?.adjustmentFlg && (
              <Box>
                <div className="bg-[#FBFBFB] rounded-sm flex items-center gap-2 p-2 adjustmen-inventory">
                  <CheckIcon className="text-[#79CA25]" />
                  {t("check_out.stock_adjustment")}
                </div>
              </Box>
            )}
            <Box>
              <div className="shiping-information text-base text-[#717171] font-bold">
                {t("check_out.shipping_info")}
              </div>
            </Box>
            <Box>
              {shippingInfo.map((item, index) => (
                <div
                  key={index}
                  className={`wrapper ${
                    index === shippingInfo.length - 1 ? "" : "mb-6"
                  }`}
                >
                  <div className="shiping-information text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                    {item.label}
                  </div>
                  <div className="shiping-information text-mini text-black font-bold tracking-widest">
                    {item.value}
                  </div>
                </div>
              ))}
            </Box>
            <Box>
              <div className="recyle-loc-info shiping-information text-base text-[#717171] tracking-widest font-bold">
                {t("check_out.recyc_loc_info")}
              </div>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div className="delivery-loc">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t("check_out.shipping_location")}
                </div>
                <div className="text-mini text-black font-bold tracking-widest">
                  {selectedCheckOut?.senderAddr ??
                    selectedCheckOut?.senderAddress}
                </div>
              </div>
              <ArrowForwardIcon className="text-gray" />
              <div className="arrived">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t("pick_up_order.detail.arrived")}
                </div>
                <div className="text-mini text-black font-bold tracking-widest">
                  {selectedCheckOut?.receiverAddr}
                </div>
              </div>
            </Box>
            <Box>
              <div className="recyle-type-weight text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                {t("check_out.recyclable_type_weight")}
              </div>
              <Stack spacing={2}>
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
                      images={item.checkoutDetailPhoto}
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
                      productName={item.productType.name}
                      productType={item.productType.name}
                      images={item.checkoutDetailPhoto}
                    />
                  );
                })}
              </Stack>
            </Box>
            <Box>
              {selectedCheckOut?.status !== "CREATED" && (
                <div className="message">
                  <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                    {t("check_out.message")}
                  </div>
                  <div className=" text-sm text-[#717171] font-medium tracking-widest">
                    {messageCheckout}
                  </div>
                </div>
              )}
            </Box>
          </Stack>
        </div>
      </RightOverlayForm>
    </div>
  );
};

let localstyles = {
  content: {
    flex: 9,
    // p: 2,
    // mb: 2,
  },
};

export default CheckOutDetails;
