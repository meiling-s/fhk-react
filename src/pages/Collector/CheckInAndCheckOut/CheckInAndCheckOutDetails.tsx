import { Box, Divider } from "@mui/material";
import RightOverlayForm from "../../../components/RightOverlayForm";
import axios from "axios";
import { AXIOS_DEFAULT_CONFIGS } from "../../../constants/configs";
import {
  GET_ALL_PRODUCT_TYPE,
  GET_ALL_RECYCLE_TYPE,
} from "../../../constants/requests";
import { useEffect, useState } from "react";
import { formatWeight, returnApiToken } from "../../../utils/utils";
import { useTranslation } from "react-i18next";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import axiosInstance from "../../../constants/axiosInstance";
import {
  getCheckInDetailByID,
  getCheckOutDetailByID,
} from "../../../APICalls/Collector/inout";
import { PanoramaSharp } from "@mui/icons-material";
import { getWarehouseById } from "src/APICalls/warehouseManage";
import { getCollectionPointDetail } from "src/APICalls/collectionPointManage";
import RecycleCard from "src/components/RecycleCard";
import ProductCard from "src/components/ProductCard";

interface CheckInOutDetail {
  chkInId: number;
  logisticName: string;
  logisticId: string;
  vehicleTypeId: string;
  plateNo: string;
  senderName: string;
  senderId: string;
  senderAddr: string;
  senderAddrGps: number[];
  receiverName: string;
  receiverAddr: string;
  warehouseId: number;
  colId: number;
  status: string;
  reason: string[];
  picoId: string;
  signature: string;
  normalFlg: boolean;
  adjustmentFlg: boolean;
  nightFlg: boolean;
  createdBy: string;
  updatedBy: string;
  checkinDetail?: [
    {
      chkInDtlId: number;
      recycTypeId: string;
      recycSubTypeId: string;
      productAddonTypeId: string;
      productAddonTypeRemark: string;
      productSubTypeId: string;
      productSubTypeRemark: string;
      productTypeId: string;
      packageTypeId: string;
      weight: number;
      unitId: string;
      itemId: number;
      picoDtlId: number | string;
      checkinDetailPhoto?: [
        {
          sid: number;
          photo: string;
        }
      ];
      createdBy: string;
      updatedBy: string;
    }
  ];
  checkoutDetail?: [
    {
      chkOutDtlId: number;
      recycTypeId: string;
      recycSubTypeId: string;
      productAddonTypeId: string;
      productAddonTypeRemark: string;
      productSubTypeId: string;
      productSubTypeRemark: string;
      productTypeId: string;
      packageTypeId: string;
      weight: number;
      unitId: string;
      itemId: number;
      picoDtlId: number | string;
      checkoutDetailPhoto?: [
        {
          sid: number;
          photo: string;
        }
      ];
      createdBy: string;
      updatedBy: string;
    }
  ];
  createdAt: string;
  updatedAt: string;
}

function CheckInAndCheckOutDetails({ isShow, setIsShow, selectedRow }: any) {
  const { decimalVal, accountData } = useContainer(CommonTypeContainer);

  const [recycType, setRecycType] = useState([]);
  const [productType, setProductType] = useState([]);
  const [checkInOutData, setCheckInOutData] = useState<CheckInOutDetail | null>(
    null
  );
  const { t, i18n } = useTranslation();

  const [senderLocation, setSenderLocation] = useState<string | null>(null);

  useEffect(() => {
    if (checkInOutData) {
      const fetchLocation = async () => {
        if (
          checkInOutData?.senderAddr === undefined ||
          checkInOutData?.receiverAddr === undefined
        ) {
          if (checkInOutData?.warehouseId !== 0) {
            const warehouse = await getWarehouseDetail(
              checkInOutData.warehouseId
            );
            setSenderLocation(warehouse.location);
          } else {
            const collectionPoint = await getCollectionPoint(
              checkInOutData.colId
            );
            if (collectionPoint) {
              setSenderLocation(collectionPoint.address);
            } else {
              setSenderLocation("Loading...");
            }
          }
        }
      };
      fetchLocation();
    }
    console.log(checkInOutData, "checkinoutdata");
  }, [checkInOutData]);

  useEffect(() => {
    initCheckinoutDetail();
  }, [selectedRow]);

  const initCheckinoutDetail = async () => {
    if (selectedRow !== null && selectedRow !== undefined) {
      let result;
      const token = returnApiToken();
      if (selectedRow.chkInId) {
        result = await getCheckInDetailByID(
          selectedRow.chkInId,
          token.realmApiRoute
        );
      } else if (selectedRow.chkOutId) {
        result = await getCheckOutDetailByID(
          selectedRow.chkOutId,
          token.realmApiRoute
        );
      }
      const data = result?.data;

      if (data) {
        initRecycType();
        initProductType();
        setCheckInOutData(data);
      }
    }
  };
  const initRecycType = async () => {
    const token = returnApiToken();
    const AuthToken = token.authToken;

    const { data } = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_ALL_RECYCLE_TYPE(),
      headers: {
        AuthToken,
      },
    });

    setRecycType(data);
  };

  const initProductType = async () => {
    const token = returnApiToken();
    const AuthToken = token.authToken;

    const { data } = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_ALL_PRODUCT_TYPE(),
      headers: {
        AuthToken,
      },
    });

    setProductType(data);
  };

  const getWarehouseDetail = async (id: number) => {
    try {
      const response = await getWarehouseById(id);

      return response.data;
    } catch (error) {
      return null;
    }
  };

  const getCollectionPoint = async (id: number) => {
    try {
      const response = await getCollectionPointDetail(id);

      return response?.data;
    } catch (error) {
      return null;
    }
  };

  const recycleType = (id: string) => {
    const findRecyc: any = recycType?.find(
      (item: any) => item.recycTypeId === id
    );
    return i18n.language === "enus"
      ? findRecyc?.recyclableNameEng
      : i18n.language === "zhch"
      ? findRecyc?.recyclableNameSchi
      : findRecyc?.recyclableNameTchi;
  };

  const recycleSubType = (id: string, subId: string) => {
    const parent: any = recycType?.find((item: any) => item.recycTypeId === id);
    const findSubRecyc: any = parent?.recycSubType?.find(
      (item: any) => item.recycSubTypeId === subId
    );
    return i18n.language === "enus"
      ? findSubRecyc?.recyclableNameEng
      : i18n.language === "zhch"
      ? findSubRecyc?.recyclableNameSchi
      : findSubRecyc?.recyclableNameTchi;
  };

  const findProductType = (id: string) => {
    const findProduct: any = productType?.find(
      (item: any) => item.productTypeId === id
    );
    return i18n.language === "enus"
      ? findProduct?.productNameEng
      : i18n.language === "zhch"
      ? findProduct?.productNameSchi
      : findProduct?.productNameTchi;
  };

  const findProductSubType = (typeId: string, subtypeId: string) => {
    const findProduct: any = productType?.find(
      (item: any) => item.productTypeId === typeId
    );
    if (findProduct) {
      const findSubProduct: any = findProduct?.productSubType?.find(
        (item: any) => item.productSubTypeId === subtypeId
      );

      return i18n.language === "enus"
        ? findSubProduct?.productNameEng
        : i18n.language === "zhch"
        ? findSubProduct?.productNameSchi
        : findSubProduct?.productNameTchi;
    }

    return "";
  };

  return (
    <div className="detail-inventory">
      <RightOverlayForm
        open={isShow}
        onClose={() => setIsShow(false)}
        anchor={"right"}
        action={"none"}
        headerProps={{
          title: t("checkinandcheckout.send_request"),
          subTitle: checkInOutData?.picoId,
          onCloseHeader: () => setIsShow(false),
        }}
      >
        <Divider />
        <Box sx={{ PaddingX: 2 }}>
          <div className="px-6 py-6">
            <div className="bg-light px-4 py-2 mb-4 flex items-center">
              {checkInOutData?.adjustmentFlg ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-4"
                >
                  <path
                    d="M14 4L6 12L2 8"
                    stroke="#79CA25"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className="w-[16px] h-[16px] text-red-primary mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -3 16 16"
                  width="28"
                  fill="currentColor"
                >
                  <path d="M7.314 5.9l3.535-3.536A1 1 0 1 0 9.435.95L5.899 4.485 2.364.95A1 1 0 1 0 .95 2.364l3.535 3.535L.95 9.435a1 1 0 1 0 1.414 1.414l3.535-3.535 3.536 3.535a1 1 0 1 0 1.414-1.414L7.314 5.899z"></path>
                </svg>
              )}
              <p className="text-grey-dark">
                {t("checkinandcheckout.adjust_inventory")}
              </p>
            </div>
            <div className="flex flex-col gap-y-4">
              <p className="text-grey-dark font-bold">
                {t("checkinandcheckout.shipping_info")}
              </p>
              <div className="flex flex-col">
                <p className="text-gray-middle text-smi m-0">
                  {t("checkinandcheckout.shipping_company")}
                </p>
                <p className="text-black font-bold">
                  {checkInOutData?.senderName
                    ? checkInOutData.senderName
                    : i18n.language === "enus"
                    ? accountData?.companyNameEng
                    : i18n.language === "zhhk"
                    ? accountData?.companyNameTchi
                    : accountData?.companyNameSchi}
                </p>
              </div>

              <div className="flex flex-col">
                <p className="text-gray-middle text-smi m-0">
                  {t("checkinandcheckout.receiver")}
                </p>
                <p className="text-black font-bold">
                  {checkInOutData?.receiverName
                    ? checkInOutData.receiverName
                    : i18n.language === "enus"
                    ? accountData?.companyNameEng
                    : i18n.language === "zhhk"
                    ? accountData?.companyNameTchi
                    : accountData?.companyNameSchi}
                </p>
              </div>

              <div className="flex flex-col">
                <p className="text-gray-middle text-smi m-0">
                  {t("checkinandcheckout.logistics_company")}
                </p>
                <p className="text-black font-bold">
                  {checkInOutData?.logisticName
                    ? checkInOutData?.logisticName
                    : "-"}
                </p>
              </div>

              <p className="text-grey-dark font-bold">
                {t("check_in.recyc_loc_info")}
              </p>

              <div className="flex">
                <div className="flex flex-col flex-1">
                  <p className="text-gray-middle text-smi m-0">
                    {t("checkinandcheckout.delivery_location")}
                  </p>
                  <p className="text-black font-bold">
                    {checkInOutData?.senderAddr
                      ? checkInOutData?.senderAddr
                      : senderLocation}
                  </p>
                </div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.2929 5.29289C12.6834 4.90237 13.3166 4.90237 13.7071 5.29289L19.7071 11.2929C20.0976 11.6834 20.0976 12.3166 19.7071 12.7071L13.7071 18.7071C13.3166 19.0976 12.6834 19.0976 12.2929 18.7071C11.9024 18.3166 11.9024 17.6834 12.2929 17.2929L16.5858 13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H16.5858L12.2929 6.70711C11.9024 6.31658 11.9024 5.68342 12.2929 5.29289Z"
                    fill="#D1D1D1"
                  />
                </svg>
                <div className="flex flex-col flex-1 ml-6">
                  <p className="text-gray-middle text-smi m-0">
                    {t("checkinandcheckout.arrived")}
                  </p>
                  <p className="text-black font-bold">
                    {checkInOutData?.receiverAddr
                      ? checkInOutData?.receiverAddr
                      : senderLocation}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-grey-dark text-smi -mb-1">
                  {t("check_in.recyclable_type_weight")}
                </p>
                {checkInOutData?.checkinDetail?.map((detail: any) => {
                  if (
                    detail?.recycTypeId !== null &&
                    detail?.recycTypeId !== ""
                  ) {
                    return (
                      <RecycleCard
                        key={detail?.recycTypeId}
                        name={recycleType(detail?.recycTypeId)}
                        bgcolor="#e1f4ff"
                        fontcolor="#66bff6"
                        weight={formatWeight(detail?.weight, decimalVal)}
                        showImage={true}
                        packageTypeId={detail?.packageTypeId}
                        recycleName={recycleSubType(
                          detail?.recycTypeId,
                          detail?.recycSubTypeId
                        )}
                        recycleType={recycleType(detail?.recycTypeId)}
                        images={detail?.checkinDetailPhoto}
                      />
                    );
                  } else {
                    return (
                      <ProductCard
                        key={detail?.productTypeId}
                        name={findProductType(detail?.productTypeId)}
                        bgcolor="#e1f4ff"
                        fontcolor="#66bff6"
                        weight={formatWeight(detail?.weight, decimalVal)}
                        showImage={true}
                        packageTypeId={detail?.packageTypeId}
                        productName={findProductSubType(
                          detail?.productTypeId,
                          detail?.productSubTypeId
                        )}
                        productType={findProductType(detail?.productTypeId)}
                        images={detail?.checkinDetailPhoto}
                      />
                    );
                  }
                })}
                {checkInOutData?.checkoutDetail?.map((detail: any) => {
                  if (
                    detail?.recycTypeId !== null &&
                    detail?.recycTypeId !== ""
                  ) {
                    return (
                      <RecycleCard
                        key={detail?.recycTypeId}
                        name={recycleType(detail?.recycTypeId)}
                        bgcolor="#e1f4ff"
                        fontcolor="#66bff6"
                        weight={formatWeight(detail?.weight, decimalVal)}
                        showImage={true}
                        packageTypeId={detail?.packageTypeId}
                        recycleName={recycleSubType(
                          detail?.recycTypeId,
                          detail?.recycSubTypeId
                        )}
                        recycleType={recycleType(detail?.recycTypeId)}
                        images={detail?.checkoutDetailPhoto}
                      />
                    );
                  } else {
                    return (
                      <ProductCard
                        key={detail?.productTypeId}
                        name={findProductType(detail?.productTypeId)}
                        bgcolor="#e1f4ff"
                        fontcolor="#66bff6"
                        weight={formatWeight(detail?.weight, decimalVal)}
                        showImage={true}
                        packageTypeId={detail?.packageTypeId}
                        productName={findProductSubType(
                          detail?.productTypeId,
                          detail?.productSubTypeId
                        )}
                        productType={findProductType(detail?.productTypeId)}
                        images={detail?.checkoutDetailPhoto}
                      />
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </Box>
      </RightOverlayForm>
    </div>
  );
}

export default CheckInAndCheckOutDetails;
