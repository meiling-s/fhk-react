import {
  FunctionComponent,
  useCallback,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
} from "@mui/x-data-grid";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ProgressLine from "../../../components/ProgressLine";
import StatusCard from "../../../components/StatusCard";
import { il_item } from "../../../components/FormComponents/CustomItemList";

import {
  STATUS_CODE,
  format,
  localStorgeKeyName,
  Languages,
} from "../../../constants/constant";

import {
  getCapacityWarehouse,
  getWeightbySubtype,
  getCheckInWarehouse,
  getCheckOutWarehouse,
  getCheckInOutWarehouse,
  getRecycSubTypeWeight,
  getWeightBySubType,
} from "../../../APICalls/warehouseDashboard";
import {
  astdSearchWarehouse,
  getAllWarehouse,
  getWarehouseById,
  manufacturerGetAllWarehouse,
} from "../../../APICalls/warehouseManage";
import { CheckInOutWarehouse } from "../../../interfaces/warehouse";

import { useTranslation } from "react-i18next";
import i18n from "../../../setups/i18n";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import { useContainer } from "unstated-next";
import { styles } from "../../../constants/styles";
import { SEARCH_ICON } from "../../../themes/icons";
import useDebounce from "../../../hooks/useDebounce";
import {
  extractError,
  getPrimaryColor,
  returnApiToken,
} from "../../../utils/utils";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import useLocaleTextDataGrid from "../../../hooks/useLocaleTextDataGrid";
dayjs.extend(utc);
dayjs.extend(timezone);

function createCheckInOutWarehouse(
  id: number,
  chkInId: number | null,
  chkOutId: number | null,
  createdAt: string,
  status: string,
  senderName: string,
  receiverName: string,
  picoId: string,
  adjustmentFlg: true,
  logisticName: string,
  senderAddr: string,
  receiverAddr: string
): CheckInOutWarehouse {
  return {
    id,
    chkInId,
    chkOutId,
    createdAt,
    status,
    senderName,
    receiverName,
    picoId,
    adjustmentFlg,
    logisticName,
    senderAddr,
    receiverAddr,
  };
}

interface warehouseSubtype {
  subTypeId: string;
  subtypeName: string;
  weight: number;
  capacity: number;
}

const WarehouseDashboard: FunctionComponent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { recycType, dateFormat, companies, productType } =
    useContainer(CommonTypeContainer);

  const [currentCapacity, setCurrentCapacity] = useState<number>(0);
  const [totalCapacity, setTotalCapacity] = useState<number>(1000);
  const [warehouseList, setWarehouseList] = useState<il_item[]>([]);
  const [checkIn, setCheckIn] = useState<number>(0);
  const [checkOut, setCheckOut] = useState<number>(0);
  const [selectedWarehouse, setSelectedWarehouse] = useState<il_item | null>(
    null
  );
  const [warehouseSubtype, setWarehouseSubtype] = useState<warehouseSubtype[]>(
    []
  );
  const [checkInOut, setCheckInOut] = useState<CheckInOutWarehouse[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const realmApi = localStorage.getItem(localStorgeKeyName.realmApiRoute);
  const role = localStorage.getItem(localStorgeKeyName.role);
  const debouncedSearchValue: string = useDebounce(searchText, 1000);
  const { localeTextDataGrid } = useLocaleTextDataGrid();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingCheckInCheckOut, setIsLoadingCheckInCheckOut] =
    useState<boolean>(false);

  useEffect(() => {
    if (realmApi !== "account") {
      initWarehouse();
    }
  }, [i18n.language, realmApi]);

  useEffect(() => {
    initCapacity();
    initCheckIn();
    initCheckOut();
    initWarehouseSubType();
    initCheckInOut();
  }, [selectedWarehouse, i18n.language]);

  const initWarehouse = async () => {
    try {
      let result;
      if (realmApi === "account") {
        result = await astdSearchWarehouse(0, 1000, searchText);
      } else {
        result = await getAllWarehouse(0, 1000);
      }
      if (result) {
        let capacityTotal = 0;
        let warehouse: il_item[] = [];
        const data = result.data.content;
        data.forEach((item: any) => {
          item.warehouseRecyc?.forEach((recy: any) => {
            capacityTotal += recy.recycSubTypeCapacity;
          });
          var warehouseName = "";
          switch (i18n.language) {
            case "zhhk":
              warehouseName = item.warehouseNameTchi;
              break;
            case "zhch":
              warehouseName = item.warehouseNameSchi;
              break;
            case "enus":
              warehouseName = item.warehouseNameEng;
              break;
            default:
              warehouseName = item.warehouseNameTchi;
              break;
          }
          warehouse.push({
            id: item.warehouseId,
            name: warehouseName,
          });
        });
        setWarehouseList(warehouse);
        if (warehouse.length > 0) setSelectedWarehouse(warehouse[0]);
        setTotalCapacity(capacityTotal);
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const getWeightSubtypeWarehouse = async () => {
    //init weight for each subtype also calculate current subtype
    const token = returnApiToken();
    if (selectedWarehouse) {
      let result;
      result = await getWeightBySubType(
        parseInt(selectedWarehouse.id),
        token.decodeKeycloack
      );
      if (result) {
        const data = result.data;
        var currCapacityWarehouse = 0;
        Object.keys(data).forEach((item) => {
          currCapacityWarehouse += data[item].weight;
        });
        setCurrentCapacity(Math.ceil(currCapacityWarehouse * 1000) / 1000);
        return result.data;
      }
    }
  };

  const initCapacity = async () => {
    try {
      const token = returnApiToken();
      if (selectedWarehouse) {
        let result;
        if (realmApi === "account") {
          result = await getCapacityWarehouse(
            parseInt(selectedWarehouse.id),
            debouncedSearchValue
          );
        } else {
          result = await getCapacityWarehouse(
            parseInt(selectedWarehouse.id),
            token.decodeKeycloack
          );
        }
        if (result) setTotalCapacity(result.data);
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const initCheckIn = async () => {
    try {
      const token = returnApiToken();
      if (selectedWarehouse) {
        let result;
        if (realmApi === "account") {
          result = await getCheckInWarehouse(
            parseInt(selectedWarehouse.id),
            debouncedSearchValue
          );
        } else {
          result = await getCheckInWarehouse(
            parseInt(selectedWarehouse.id),
            token.decodeKeycloack
          );
        }
        if (result) setCheckIn(result.data);
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const initCheckOut = async () => {
    try {
      const token = returnApiToken();
      if (selectedWarehouse) {
        let result;
        if (realmApi === "account") {
          result = await getCheckOutWarehouse(
            parseInt(selectedWarehouse.id),
            debouncedSearchValue
          );
        } else {
          result = await getCheckOutWarehouse(
            parseInt(selectedWarehouse.id),
            token.decodeKeycloack
          );
        }
        if (result) setCheckOut(result.data);
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const mappingName = (typeId: string) => {
    if (typeId.startsWith("RC") || typeId.startsWith("RSC")) {
      const isRecycType = typeId.startsWith("RC") && !typeId.startsWith("RSC");
      const isRecycSubType = typeId.startsWith("RSC");

      if (isRecycType) {
        const matchingRecycType = recycType?.find(
          (recyc) => recyc.recycTypeId === typeId
        );
        if (matchingRecycType) {
          switch (i18n.language) {
            case "enus":
              return matchingRecycType.recyclableNameEng;
            case "zhch":
              return matchingRecycType.recyclableNameSchi;
            case "zhhk":
              return matchingRecycType.recyclableNameTchi;
            default:
              return matchingRecycType.recyclableNameTchi;
          }
        }
      } else if (isRecycSubType) {
        for (const recyc of recycType || []) {
          const matchingRecycSubType = recyc.recycSubType?.find(
            (subType) => subType.recycSubTypeId === typeId
          );
          if (matchingRecycSubType) {
            switch (i18n.language) {
              case "enus":
                return matchingRecycSubType.recyclableNameEng;
              case "zhch":
                return matchingRecycSubType.recyclableNameSchi;
              case "zhhk":
                return matchingRecycSubType.recyclableNameTchi;
              default:
                return matchingRecycSubType.recyclableNameTchi;
            }
          }
        }
      }
    } else if (
      typeId.startsWith("APD") ||
      typeId.startsWith("SPD") ||
      typeId.startsWith("PD")
    ) {
      if (typeId.startsWith("APD")) {
        for (const product of productType || []) {
          for (const subType of product.productSubType || []) {
            const matchingAddon = subType.productAddonType?.find(
              (addon) => addon.productAddonTypeId === typeId
            );
            if (matchingAddon) {
              switch (i18n.language) {
                case "enus":
                  return `${subType.productNameEng} (${matchingAddon.productNameEng})`;
                case "zhch":
                  return `${subType.productNameSchi} (${matchingAddon.productNameSchi})`;
                case "zhhk":
                  return `${subType.productNameTchi} (${matchingAddon.productNameTchi})`;
                default:
                  return `${subType.productNameTchi} (${matchingAddon.productNameTchi})`;
              }
            }
          }
        }
      } else if (typeId.startsWith("SPD")) {
        // Handle ProductSubType
        for (const product of productType || []) {
          const matchingSubType = product.productSubType?.find(
            (subType) => subType.productSubTypeId === typeId
          );
          if (matchingSubType) {
            switch (i18n.language) {
              case "enus":
                return matchingSubType.productNameEng;
              case "zhch":
                return matchingSubType.productNameSchi;
              case "zhhk":
                return matchingSubType.productNameTchi;
              default:
                return matchingSubType.productNameTchi;
            }
          }
        }
      } else if (typeId.startsWith("PD")) {
        const matchingProductType = productType?.find(
          (product) => product.productTypeId === typeId
        );
        if (matchingProductType) {
          switch (i18n.language) {
            case "enus":
              return matchingProductType.productNameEng;
            case "zhch":
              return matchingProductType.productNameSchi;
            case "zhhk":
              return matchingProductType.productNameTchi;
            default:
              return matchingProductType.productNameTchi;
          }
        }
      }
    }

    return "Unknown";
  };

  const initWarehouseSubType = async () => {
    setIsLoading(true);
    if (selectedWarehouse) {
      if (realmApi === "account") {
        const weightSubtype = await initGetRecycSubTypeWeight();

        if (weightSubtype.length > 0) {
          let subtypeWarehouse: warehouseSubtype[] = [];

          weightSubtype.forEach((item: any) => {
            const recyItem = mappingName(item.typeId);

            subtypeWarehouse.push({
              subTypeId: item.typeId,
              subtypeName: recyItem ? recyItem : "-",
              weight: item.weight,
              capacity: item.capacity,
            });
          });
          setWarehouseSubtype(subtypeWarehouse);
        }
      } else {
        const weightSubtype = await getWeightSubtypeWarehouse();

        if (weightSubtype.length > 0) {
          let subtypeWarehouse: warehouseSubtype[] = [];

          weightSubtype.forEach((item: any) => {
            const recyItem = mappingName(item.typeId);

            subtypeWarehouse.push({
              subTypeId: item.typeId,
              subtypeName: recyItem ? recyItem : "-",
              weight: item.weight,
              capacity: item.capacity,
            });
          });
          setWarehouseSubtype(subtypeWarehouse);
        }
      }
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const initCheckInOut = async () => {
    setIsLoadingCheckInCheckOut(true);
    try {
      const token = returnApiToken();
      if (selectedWarehouse) {
        let result;
        if (realmApi === "account") {
          result = await getCheckInOutWarehouse(
            parseInt(selectedWarehouse.id),
            debouncedSearchValue
          );
        } else {
          result = await getCheckInOutWarehouse(
            parseInt(selectedWarehouse.id),
            token.decodeKeycloack
          );
        }
        if (result) {
          const data = result.data;
          let checkinoutMapping: CheckInOutWarehouse[] = [];
          data.map((item: any, index: number) => {
            const dateInHK = dayjs.utc(item.createdAt).tz("Asia/Hong_Kong");
            const createdAt = dateInHK.format(`${dateFormat} HH:mm`);

            if (item.logisticId) {
              const logistic = companies.find(
                (company) => company.id == item.logisticId
              );
              if (logistic) {
                if (i18n.language === Languages.ENUS)
                  item.logisticName = logistic.nameEng;
                if (i18n.language === Languages.ZHCH)
                  item.logisticName = logistic.nameSchi;
                if (i18n.language === Languages.ZHHK)
                  item.logisticName = logistic.nameTchi;
              }
            }

            if (item.receiverId) {
              const receiverName = companies.find(
                (company) => company.id == item.receiverId
              );
              if (receiverName) {
                if (i18n.language === Languages.ENUS)
                  item.receiverName = receiverName.nameEng;
                if (i18n.language === Languages.ZHCH)
                  item.receiverName = receiverName.nameSchi;
                if (i18n.language === Languages.ZHHK)
                  item.receiverName = receiverName.nameTchi;
              }
            }

            if (item.senderId) {
              const senderName = companies.find(
                (company) => company.id == item.senderId
              );

              if (senderName) {
                if (i18n.language === Languages.ENUS)
                  item.senderName = senderName.nameEng;
                if (i18n.language === Languages.ZHCH)
                  item.senderName = senderName.nameSchi;
                if (i18n.language === Languages.ZHHK)
                  item.senderName = senderName.nameTchi;
              }
            }

            checkinoutMapping.push(
              createCheckInOutWarehouse(
                item?.chkInId || index + item?.chkInId,
                item?.chkInId,
                item?.chkOutId,
                createdAt,
                item?.status,
                item?.senderName,
                item?.receiverName,
                item?.picoId,
                item?.adjustmentFlg,
                item?.logisticName,
                item?.senderAddr,
                item?.receiverAddr
              )
            );
          });

          setCheckInOut(checkinoutMapping);
        }
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
    setIsLoadingCheckInCheckOut(false);
  };

  const initGetRecycSubTypeWeight = async () => {
    const token = returnApiToken();
    if (selectedWarehouse) {
      const result = await getRecycSubTypeWeight(
        parseInt(selectedWarehouse.id),
        debouncedSearchValue
      );
      if (result) {
        const data = result.data;
        var currCapacityWarehouse = 0;
        Object.keys(data).forEach((item) => {
          currCapacityWarehouse += data[item].weight;
        });
        setCurrentCapacity(currCapacityWarehouse);
        return result.data;
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: t("dashboardOverview.createdAt"),
      width: 150,
      type: "string",
    },
    {
      field: "status",
      headerName: t("col.status"),
      width: 150,
      type: "string",
      renderCell: (params) => {
        return <StatusCard status={params.row.status} />;
      },
    },
    {
      field: "",
      headerName: t("notification.menu_staff.type"),
      width: 150,
      type: "string",
      renderCell: (params) => {
        return params.row.chkInId || params.row.chkOutId ? (
          <div>
            {params.row.chkInId
              ? t("dashboardOverview.checkin")
              : t("dashboardOverview.checkout")}
          </div>
        ) : null;
      },
    },
    {
      field: "senderName",
      headerName: t("dashboardOverview.shippingCompany"),
      width: 200,
      type: "string",
    },
    {
      field: "receiverName",
      headerName: t("check_in.receiver_company"),
      width: 200,
      type: "string",
    },
    {
      field: "picoId",
      headerName: t("check_out.pickup_order_no"),
      width: 200,
      type: "string",
    },
    {
      field: "adjustmentFlg",
      headerName: t("check_out.stock_adjustment"),
      width: 100,
      type: "string",
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            {params.row.adjustmentFlg ? (
              <CheckIcon className="text-green-primary" />
            ) : (
              <CloseIcon className="text-red" />
            )}
          </div>
        );
      },
    },
    {
      field: "senderAddr",
      headerName: t("dashboardOverview.inventoryLocation"),
      width: 150,
      type: "string",
    },
    {
      field: "logisticName",
      headerName: t("check_out.logistic_company"),
      width: 200,
      type: "string",
    },
    {
      field: "receiverAddr",
      headerName: t("check_out.arrival_location"),
      width: 200,
      type: "string",
    },
  ];

  const onChangeWarehouse = (event: SelectChangeEvent) => {
    const warehouseId = event.target.value;
    const selectedWarehouse = warehouseList.find(
      (item) => item.id == warehouseId
    );
    if (selectedWarehouse) {
      setSelectedWarehouse(selectedWarehouse);
    }
  };

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
    };
  }, []);

  const generateRandomPastelColor = () => {
    const r = Math.floor(Math.random() * 156) + 100; // Red component (100-255)
    const g = Math.floor(Math.random() * 156) + 100; // Green component (100-255)
    const b = Math.floor(Math.random() * 156) + 100; // Blue component (100-255)
    const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

    return color;
  };

  const handleSearchByTenantId = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value === "") {
      resetData();
    }

    const numericValue = event.target.value.replace(/\D/g, "");
    event.target.value = numericValue;

    if (numericValue.length === 6) {
      setSearchText(`company${numericValue}`);
    }
  };

  const resetData = () => {
    setWarehouseList([]);
    setCurrentCapacity(0);
    setTotalCapacity(0);
    setCheckIn(0);
    setCheckOut(0);
    setSelectedWarehouse(null);
    setWarehouseSubtype([]);
    setCheckInOut([]);
  };

  useEffect(() => {
    if (debouncedSearchValue) {
      resetData();
      initWarehouse();
    }
  }, [debouncedSearchValue, i18n.language]);

  return (
    <Box className="container-wrapper w-full mt-4">
      <Box sx={{ marginBottom: 2 }}>
        {realmApi === "account" && (
          <TextField
            id="search-tenantId-warehouse"
            onChange={handleSearchByTenantId}
            sx={styles.inputStyle}
            label={t("tenant.invite_form.company_number")}
            placeholder={t("tenant.enter_company_number")}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 6,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => {}}>
                    <SEARCH_ICON style={{ color: getPrimaryColor() }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
        <FormControl sx={dropDownStyle}>
          <Select
            id="warehouse"
            placeholder="Select warehouse"
            value={selectedWarehouse?.id || ""}
            label={t("check_out.any")}
            onChange={onChangeWarehouse}
          >
            {warehouseList?.length > 0 ? (
              warehouseList?.map((item, index) => (
                <MenuItem value={item?.id} key={index}>
                  {item?.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                <em>{t("common.noOptions")}</em>
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>
      <Box className="capacity-section">
        {isLoading ? (
          <Box sx={{ textAlign: "center", paddingY: 12, width: "100%" }}>
            <CircularProgress
              color={
                role === "manufacturer" || role === "customer"
                  ? "primary"
                  : "success"
              }
            />
          </Box>
        ) : (
          <Card
            sx={{
              borderRadius: 2,
              backgroundColor: "white",
              padding: 2,
              boxShadow: "none",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box className={"total-capacity"} sx={{ flexGrow: 1 }}>
              <Typography fontSize={16} color="gray" fontWeight="light">
                {t("warehouseDashboard.currentCapacity")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "baseline" }}>
                <Typography fontSize={22} color="black" fontWeight="bold">
                  {currentCapacity}
                </Typography>
                <Typography fontSize={13} color="black" fontWeight="bold">
                  /{totalCapacity}kg
                </Typography>
              </Box>

              <Box sx={{ marginTop: 3, marginBottom: 2 }}>
                <ProgressLine
                  value={currentCapacity}
                  total={totalCapacity}
                ></ProgressLine>
              </Box>

              <Typography
                fontSize={14}
                color={
                  (currentCapacity / totalCapacity) * 100 > 70 ? "red" : "green"
                }
                fontWeight="light"
              >
                {(currentCapacity / totalCapacity) * 100 < 70
                  ? t("warehouseDashboard.thereStillEnoughSpace")
                  : t("warehouseDashboard.noMoreRoom")}
              </Typography>
            </Box>
            {realmApi !== "account" && (
              <Box
                className={"checkin-checkout"}
                sx={{ display: "flex", gap: "12px" }}
              >
                <Card
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#A7D676",
                    padding: 2,
                    boxShadow: "none",
                    color: "white",
                    width: "84px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/warehouse/shipment")}
                >
                  <LoginIcon
                    fontSize="small"
                    className="bg-[#7FC738] rounded-[50%] p-1"
                  />
                  <div className="text-sm font-bold mb-4">
                    {t("warehouseDashboard.check-in")}
                  </div>
                  <div className="flex gap-1 items-baseline">
                    <Typography fontSize={22} color="white" fontWeight="bold">
                      {checkIn}
                    </Typography>
                    <Typography fontSize={11} color="white" fontWeight="bold">
                      {t("warehouseDashboard.toBeConfirmed")}
                    </Typography>
                  </div>
                </Card>
                <Card
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#7ADFF1",
                    padding: 2,
                    boxShadow: "none",
                    color: "white",
                    width: "84px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/warehouse/checkout")}
                >
                  <LogoutIcon
                    fontSize="small"
                    className="bg-[#6BC7FF] rounded-[50%] p-1"
                  />
                  <div className="text-sm font-bold mb-4">
                    {t("warehouseDashboard.check-out")}
                  </div>
                  <div className="flex gap-1 items-baseline">
                    <Typography fontSize={22} color="white" fontWeight="bold">
                      {checkOut}
                    </Typography>
                    <Typography fontSize={11} color="white" fontWeight="bold">
                      {t("warehouseDashboard.toBeConfirmed")}
                    </Typography>
                  </div>
                </Card>
              </Box>
            )}
          </Card>
        )}
      </Box>
      <Box className="capacity-item" sx={{ marginY: 6 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <Typography fontSize={16} color="#535353" fontWeight="bold">
            {t("warehouseDashboard.recyclingInformation")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/${role}/inventory`)}
          >
            <Typography fontSize={13} color="gray" fontWeight="light">
              {t("warehouseDashboard.all")}
            </Typography>
            <ChevronRightIcon
              fontSize="small"
              className="text-gray"
            ></ChevronRightIcon>
          </Box>
        </Box>
        {isLoading ? (
          <Box sx={{ textAlign: "center", paddingY: 12 }}>
            <CircularProgress
              color={
                role === "manufacturer" || role === "customer"
                  ? "primary"
                  : "success"
              }
            />
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>
            {warehouseSubtype.length > 0 ? (
              warehouseSubtype.map((item) => (
                <Card
                  key={item.subTypeId}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "white",
                    padding: 2,
                    boxShadow: "none",
                    color: "white",
                    width: "110px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    className="circle-color w-[30px] h-[30px] rounded-[50px]"
                    style={{
                      background: generateRandomPastelColor(),
                    }}
                  ></div>
                  <div className="text-sm font-bold text-black mt-2 mb-10 min-h-12">
                    {item.subtypeName}
                  </div>
                  <div className="flex items-baseline">
                    <div className="text-3xl font-bold text-black">
                      {item.weight}
                    </div>
                    <div className="text-2xs font-bold text-black ">
                      /{item.capacity}kg
                    </div>
                  </div>
                  <Box sx={{ marginTop: 1 }}>
                    <ProgressLine
                      value={item.weight}
                      total={item.capacity}
                    ></ProgressLine>
                  </Box>
                </Card>
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: "24px",
                }}
              >
                {t("common.noData")}
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Box className="table-checkin-out">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <Typography fontSize={16} color="#535353" fontWeight="bold">
            {t("warehouseDashboard.recentEntryAndExitRecords")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/${role}/checkInAndCheckout`)}
          >
            <Typography fontSize={13} color="gray" fontWeight="light">
              {t("warehouseDashboard.all")}
            </Typography>
            <ChevronRightIcon
              fontSize="small"
              className="text-gray"
            ></ChevronRightIcon>
          </Box>
        </Box>
        {isLoadingCheckInCheckOut ? (
          <Box sx={{ textAlign: "center", paddingY: 12, width: "100%" }}>
            <CircularProgress
              color={
                role === "manufacturer" || role === "customer"
                  ? "primary"
                  : "success"
              }
            />
          </Box>
        ) : (
          <Box pr={4} pt={3} pb={3} sx={{ flexGrow: 1 }}>
            <DataGrid
              rows={checkInOut}
              getRowId={(row) => row.id}
              hideFooter
              columns={columns}
              getRowSpacing={getRowSpacing}
              localeText={localeTextDataGrid}
              sx={{
                border: "none",
                "& .MuiDataGrid-cell": {
                  border: "none",
                },
                "& .MuiDataGrid-row": {
                  bgcolor: "white",
                  borderRadius: "10px",
                },
                "&>.MuiDataGrid-main": {
                  "&>.MuiDataGrid-columnHeaders": {
                    borderBottom: "none",
                  },
                },
                "& .MuiDataGrid-virtualScroller": {
                  height: "300px",
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

let dropDownStyle = {
  mt: 3,
  borderRadius: "10px",
  width: "max-content",
  bgcolor: "transparent",
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },
    ".MuiSelect-select": {
      fontSize: 22,
      fontWeight: "bold",
    },
  },
};

export default WarehouseDashboard;
