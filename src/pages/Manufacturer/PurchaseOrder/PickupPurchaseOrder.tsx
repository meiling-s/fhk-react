import { Formik, useFormik } from "formik";
import PickupOrderCreateForm from "../../../components/FormComponents/PickupOrderCreateForm";
import {
  createPickUpOrder,
  editPickupOrder,
} from "../../../APICalls/Collector/pickupOrder/pickupOrder";
import {
  CreatePO,
  CreatePicoDetail,
  EditPo,
  PickupOrder,
} from "../../../interfaces/pickupOrder";
import { useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
  extractError,
  returnApiToken,
  showErrorToast,
} from "../../../utils/utils";
import {
  STATUS_CODE,
  Status,
  localStorgeKeyName,
} from "../../../constants/constant";
import {
  PurChaseOrder,
  PurchaseOrderDetail,
} from "../../../interfaces/purchaseOrder";
import { updateStatusPurchaseOrder } from "../../../APICalls/Manufacturer/purchaseOrder";
import dayjs from "dayjs";

const CreatePickupOrder = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const poInfo: PurChaseOrder = state;
  const [addRow, setAddRow] = useState<CreatePicoDetail[]>([]);
  const { t } = useTranslation();
  const [picoTypeValue, setPicoType] = useState<string>("AD_HOC");
  const role = localStorage.getItem(localStorgeKeyName.role);
  const loginId = localStorage.getItem(localStorgeKeyName.username) || "";

  function getTenantId() {
    const tenantId = returnApiToken().decodeKeycloack.substring(
      "company".length
    );

    return tenantId;
  }

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

  const submitPickUpOrder = async (values: CreatePO) => {
    try {
      return await createPickUpOrder(values);
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const currentDate = new Date().toISOString();
  const createPickupOrder = useFormik({
    initialValues: {
      tenantId: getTenantId(),
      picoType: picoTypeValue,
      effFrmDate: currentDate,
      effToDate: currentDate,
      routineType: "daily",
      routine: [],
      logisticId: "",
      logisticName: "",
      vehicleTypeId: "",
      platNo: "",
      contactNo: "",
      status: Status.CREATED,
      reason: "",
      normalFlg: true,
      contractNo: "",
      createdBy: loginId,
      updatedBy: loginId,
      createPicoDetail: [],
      specificDates: [],
    },
    onSubmit: async (values: CreatePO) => {
      values.createPicoDetail = addRow;
      const result = await submitPickUpOrder(values);
      const data = result?.data;

      if (data) {
        const updatePoStatus = {
          status: Status.CONFIRMED,
          updatedBy: loginId,
          picoId: data?.picoId,
          version: state.version,
        };
        try {
          const approve = await updateStatusPurchaseOrder(
            poInfo.poId,
            updatePoStatus
          );
          if (approve) {
            const routeName = role;
            navigate(`/${routeName}/purchaseOrder`, { state: "created" });
          }
        } catch (error: any) {
          if (state.code === STATUS_CODE[503]) {
            navigate("/maintenance");
          } else if (state.code === STATUS_CODE[409]) {
            showErrorToast(error.response.data.message);
          }
        }
      } else {
        showErrorToast("fail to create pickup order");
      }
    },
  });

  useEffect(() => {
    setPicoType(createPickupOrder.values.picoType);
  }, [createPickupOrder.values.picoType]);

  const setPickupOrderDetail = () => {
    console.log(poInfo, "poInfo");
    const picoDetails: CreatePicoDetail[] =
      poInfo?.purchaseOrderDetail?.map((item) => ({
        id: item?.poDtlId,
        picoHisId: "",
        senderId: "",
        senderName: poInfo.senderName,
        senderAddr: "",
        senderAddrGps: [0],
        receiverId: "",
        receiverName: poInfo.receiverName,
        receiverAddr: item?.receiverAddr ?? "",
        receiverAddrGps: [0],
        status: Status.CREATED,
        createdBy: item?.createdBy ?? "",
        updatedBy: item?.updatedBy ?? "",
        pickupAt: dayjs(item?.pickupAt).format("hh:mm:ss") ?? "",
        recycType: item?.recycTypeId ?? "",
        recycSubType: item?.recycSubTypeId ?? "",
        productType: item?.productTypeId ?? "",
        productSubType: item?.productSubTypeId ?? "",
        productAddonType: item?.productAddonTypeId ?? "",
        weight: item.weight.toString(),
      })) || [];

    setAddRow(picoDetails);
    return picoDetails;
  };

  useEffect(() => {
    if (poInfo) {
      const createPicoDetail: CreatePicoDetail[] = setPickupOrderDetail();

      createPickupOrder.setValues({
        tenantId: getTenantId(),
        picoType: picoTypeValue,
        effFrmDate: currentDate,
        effToDate: currentDate,
        routineType: "daily",
        routine: [],
        logisticId: "",
        logisticName: "",
        vehicleTypeId: "",
        platNo: "",
        contactNo: poInfo?.contactNo,
        status: Status.CREATED,
        reason: "",
        normalFlg: true,
        contractNo: "",
        createdBy: loginId,
        updatedBy: loginId,
        createPicoDetail: [],
        specificDates: [],
      });
    }
  }, [poInfo]);

  return (
    <PickupOrderCreateForm
      formik={createPickupOrder}
      title={t("pick_up_order.create_pick_up_order")}
      setState={setAddRow}
      state={addRow}
      editMode={true}
    />
  );
};

export default CreatePickupOrder;
