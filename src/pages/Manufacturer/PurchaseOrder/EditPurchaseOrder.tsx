import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PurchaseOrderCreateForm from "../../../components/FormComponents/PurchaseOrderCreateForm";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import {
  STATUS_CODE,
  Status,
  localStorgeKeyName,
} from "../../../constants/constant";
import {
  extractError,
  formatWeight,
  showErrorToast,
} from "../../../utils/utils";
import * as Yup from "yup";
import {
  PurChaseOrder,
  PurchaseOrderDetail,
} from "../../../interfaces/purchaseOrder";
import { UpdatePurchaseOrder } from "../../../APICalls/Customer/purchaseOrder";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import { refactorPurchaseOrderDetail } from "./utils";

const EditPurchaseOrder = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [addRow, setAddRow] = useState<PurchaseOrderDetail[]>([]);
  const poInfo: PurChaseOrder = state;
  const loginId = localStorage.getItem(localStorgeKeyName.username) || "";
  const realm = localStorage.getItem(localStorgeKeyName.realm) || "";
  const { decimalVal } = useContainer(CommonTypeContainer);
  const getErrorMsg = (field: string, type: string) => {
    switch (type) {
      case "empty":
        return field + " " + t("form.error.shouldNotBeEmpty");
      case "atLeastOnePicoExist":
        return field + " " + t("form.error.atLeastOnePicoExist");
      case "isInWrongFormat":
        return field + " " + t("form.error.isInWrongFormat");
    }
  };

  const submitUpdatePurchaseOrder = async (
    poId: string,
    values: PurChaseOrder
  ) => {
    try {
      return await UpdatePurchaseOrder(poId, values);
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else if (state.code === STATUS_CODE[409]) {
        showErrorToast(error.response.data.message);
      }
    }
  };

  const currentDate = new Date().toISOString();
  const updatePickupOrder = useFormik({
    initialValues: {
      poId: "",
      picoId: "",
      sellerTenantId: "",
      senderAddr: "",
      senderAddrGps: [0],
      senderName: "",
      receiverName: "",
      contactName: "",
      contactNo: "",
      paymentType: "",
      status: Status.CREATED,
      approvedAt: "",
      rejectedAt: "",
      approvedBy: "",
      rejectedBy: "",
      createdBy: loginId,
      updatedBy: loginId,
      createdAt: currentDate,
      updatedAt: currentDate,
      purchaseOrderDetail: [],
      version: 0,
    },
    // validationSchema: validateSchema,
    onSubmit: async (values: PurChaseOrder) => {
      values.purchaseOrderDetail = refactorPurchaseOrderDetail(addRow);
      const result = await submitUpdatePurchaseOrder(values.poId, values);
      if (result) {
        navigate(`/${realm}/purchaseOrder`, { state: "updated" });
      }
    },
  });

  const setPickupOrderDetail = () => {
    const picoDetails: PurchaseOrderDetail[] =
      poInfo?.purchaseOrderDetail?.map((item: PurchaseOrderDetail) => ({
        id: item.poDtlId,
        poDtlId: item.poDtlId,
        recycTypeId: item.recycTypeId,
        recyclableNameTchi: item.recyclableNameTchi,
        recyclableNameSchi: item.recyclableNameSchi,
        recyclableNameEng: item.recyclableNameEng,
        recycSubTypeId: item.recycSubTypeId,
        recyclableSubNameTchi: item.recyclableSubNameTchi,
        recyclableSubNameSchi: item.recyclableSubNameSchi,
        recyclableSubNameEng: item.recyclableSubNameEng,
        unitId: item.unitId,
        unitNameTchi: item.unitNameTchi,
        unitNameSchi: item.unitNameSchi,
        unitNameEng: item.unitNameEng,
        weight: formatWeight(item.weight, decimalVal),
        createdBy: item.createdBy,
        updatedBy: loginId,
        pickupAt: item.pickupAt,
        receiverAddr: item.receiverAddr,
        receiverAddrGps: item.receiverAddrGps,
        version: poInfo.version,
        status: item.status,
        productType: item?.productType, // => id
        productNameTchi: item?.productNameTchi,
        productNameSchi: item?.productNameSchi,
        productNameEng: item?.productNameEng,
        productSubType: item?.productSubType, // => id
        productSubNameTchi: item?.productSubNameTchi,
        productSubNameSchi: item?.productSubNameSchi,
        productSubNameEng: item?.productSubNameEng,
        productAddonType: item?.productAddonType, // => id
        productAddonNameTchi: item?.productAddonNameTchi,
        productAddonNameSchi: item?.productAddonNameSchi,
        productAddonNameEng: item?.productAddonNameEng,
        productSubTypeRemark: item?.productSubTypeRemark,
        productAddonTypeRemark: item?.productAddonTypeRemark,
      })) || [];

    setAddRow(picoDetails);
    return picoDetails;
  };

  useEffect(() => {
    if (poInfo) {
      const createPicoDetail: PurchaseOrderDetail[] = setPickupOrderDetail();

      updatePickupOrder.setValues({
        poId: poInfo.poId,
        picoId: poInfo.picoId,
        cusTenantId: poInfo.cusTenantId,
        sellerTenantId: poInfo.sellerTenantId,
        senderAddr: poInfo.senderAddr,
        senderAddrGps: poInfo.senderAddrGps,
        senderName: poInfo.senderName,
        receiverName: poInfo.receiverName,
        contactName: poInfo.contactName,
        contactNo: poInfo.contactNo,
        paymentType: poInfo.paymentType,
        status: Status.CREATED,
        approvedAt: poInfo.approvedAt,
        rejectedAt: poInfo.rejectedAt,
        approvedBy: poInfo.approvedBy,
        rejectedBy: poInfo.rejectedBy,
        createdBy: loginId,
        updatedBy: loginId,
        createdAt: currentDate,
        updatedAt: currentDate,
        purchaseOrderDetail: [],
        version: poInfo.version,
      });
    }
  }, [poInfo]);

  return (
    <PurchaseOrderCreateForm
      selectedPo={poInfo}
      title={t("pick_up_order.edit_pick_up_order")}
      formik={updatePickupOrder}
      setState={setAddRow}
      state={addRow}
      editMode={true}
    />
  );
};

export default EditPurchaseOrder;
