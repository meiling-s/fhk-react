import { useEffect, useState, FunctionComponent, useCallback } from "react";
import {
  Box,
  Typography,
  Pagination,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { styles } from "../../../constants/styles";
import CustomSearchField from "../../../components/TableComponents/CustomSearchField";
import { useContainer } from "unstated-next";
import {
  InventoryItem,
  InventoryDetail as InvDetails,
  GIDQuery,
  GIDItem,
  GIDValue,
} from "../../../interfaces/inventory";
import { il_item } from "../../../components/FormComponents/CustomItemList";
import {
  astdGetAllInventory,
  astdGetInventoryByGIDLabel,
  getAllInventory,
  getItemTrackInventory,
} from "../../../APICalls/Collector/inventory";
import {
  format,
  Languages,
  localStorgeKeyName,
  STATUS_CODE,
} from "../../../constants/constant";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import {
  getPicoById,
  getAllLogisticsPickUpOrder,
  getAllPickUpOrder,
} from "../../../APICalls/Collector/pickupOrder/pickupOrder";
import { PickupOrder } from "../../../interfaces/pickupOrder";
import { astdSearchWarehouse } from "../../../APICalls/warehouseManage";
import { useTranslation } from "react-i18next";
import i18n from "../../../setups/i18n";
import { ADD_ICON, SEARCH_ICON } from "../../../themes/icons";
import useDebounce from "../../../hooks/useDebounce";
import CircularLoading from "../../../components/CircularLoading";
import {
  returnApiToken,
  extractError,
  getPrimaryColor,
  debounce,
  showErrorToast,
  showSuccessToast,
} from "../../../utils/utils";
import { getAllWarehouse } from "../../../APICalls/warehouseManage";
import useLocaleTextDataGrid from "../../../hooks/useLocaleTextDataGrid";
import { InventoryQuery } from "../../../interfaces/inventory";
import { getAllPackagingUnit } from "../../../APICalls/Collector/packagingUnit";
import { PackagingUnit } from "../../../interfaces/packagingUnit";
import {
  getAllFactories,
  getAllFactoriesWarehouse,
} from "../../../APICalls/Collector/factory";
import { getCollectionPoint } from "../../../APICalls/Collector/collectionPointManage";
import { collectionPoint } from "src/interfaces/collectionPoint";
import { FactoryData, FactoryWarehouseData } from "src/interfaces/factory";
import InventoryDetail from "src/pages/Collector/Inventory/DetailInventory";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Option {
  value: string;
  label: string;
}

type productItem = {
  productType: il_item;
  productSubType: il_item[];
  productAddonType: il_item[];
};

type recycItem = {
  recycType: il_item;
  recycSubType: il_item[];
};

function createGID(
  labelId: string,
  recycTypeId: string,
  recycSubTypeId: string,
  productTypeId: string,
  productSubTypeId: string,
  productSubTypeRemark: string,
  productAddonTypeId: string,
  productAddonTypeRemark: string,
  recyName: string,
  subName: string,
  productName: string,
  productSubName: string,
  productAddOnName: string,
  packageTypeId: string,
  weight: number,
  unitId: string,
  updatedBy: string,
  createdBy: string,
  createdAt: string,
  updatedAt: string,
  gid: number,
  packageName: string
): GIDItem {
  return {
    labelId,
    recycTypeId,
    recycSubTypeId,
    productTypeId,
    productSubTypeId,
    productSubTypeRemark,
    productAddonTypeId,
    productAddonTypeRemark,
    recyName,
    subName,
    productName,
    productSubName,
    productAddOnName,
    packageTypeId,
    weight,
    unitId,
    updatedBy,
    createdBy,
    createdAt,
    updatedAt,
    gid,
    packageName,
  };
}

const Inventory: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [inventoryList, setInventory] = useState<any[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [rowId, setRowId] = useState<number>(1);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalData, setTotalData] = useState<number>(0);
  const { recycType, dateFormat, productType } =
    useContainer(CommonTypeContainer);
  const [recycItem, setRecycItem] = useState<recycItem[]>([]);
  const [picoList, setPicoList] = useState<PickupOrder[]>([]);
  const [selectedPico, setSelectedPico] = useState<PickupOrder[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const realmApi = localStorage.getItem(localStorgeKeyName.realmApiRoute);
  const debouncedSearchValue: string = useDebounce(searchText, 1000);
  const { localeTextDataGrid } = useLocaleTextDataGrid();
  const [query, setQuery] = useState<GIDQuery>({
    gid: "",
    warehouseId: null,
    recycTypeId: "",
    recycSubTypeId: "",
    idleDays: null,
  });
  const [warehouseList, setWarehouseList] = useState<Option[]>([]);
  const [recycList, setRecycList] = useState<Option[]>([]);
  const [packagingMapping, setPackagingMapping] = useState<PackagingUnit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const role =
    localStorage.getItem(localStorgeKeyName.role) || "collectoradmin";
  const [colList, setColList] = useState<collectionPoint[]>([]);
  const [allFactoryDataList, setAllFactoryDataList] = useState<FactoryData[]>(
    []
  );
  const [warehouseDataList, setWarehouseDataList] = useState<
    FactoryWarehouseData[]
  >([]);
  const [productItem, setProductItem] = useState<productItem[]>([]);

  async function initCollectionPoint() {
    setIsLoading(true);
    try {
      const result = await getCollectionPoint(0, 1000);
      if (result?.status === STATUS_CODE[200]) {
        setColList([]);
        const data = result?.data.content;
        if (data && data.length > 0) {
          setColList(data);
        }
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
    setIsLoading(false);
  }

  const initAllFactoryList = async () => {
    setIsLoading(true);
    setAllFactoryDataList([]);
    const result = await getAllFactories(0, 1000);
    const data = result?.data;

    if (data) {
      setAllFactoryDataList(data.content);
      setIsLoading(false);
    }
  };

  const initWarehouseList = async () => {
    setIsLoading(true);
    setWarehouseDataList([]);
    const result = await getAllFactoriesWarehouse();
    const data = result?.data;

    if (data) {
      setWarehouseDataList(data);
      setIsLoading(false);
    }
  };

  const initpackagingUnit = async () => {
    try {
      const result = await getAllPackagingUnit(0, 1000);
      const data = result?.data;

      if (data) {
        setPackagingMapping(data.content);
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  useEffect(() => {
    mappingRecyleItem();
    mappingProductItem();
    initpackagingUnit();
    getAllPickupOrder();
  }, [recycType, productType, i18n.language]);

  useEffect(() => {
    if (query.gid !== "") {
      initInventory();
    }
  }, [query]);

  const mappingProductItem = () => {
    const productMapping: productItem[] = [];

    productType?.forEach((product) => {
      var productItem: productItem = {
        productType: { name: "", id: "" },
        productSubType: [],
        productAddonType: [],
      };

      var name = "";
      switch (i18n.language) {
        case "enus":
          name = product.productNameEng;
          break;
        case "zhch":
          name = product.productNameSchi;
          break;
        case "zhhk":
          name = product.productNameTchi;
          break;
        default:
          name = product.productNameTchi;
          break;
      }
      productItem.productType = { name: name, id: product.productTypeId };

      product.productSubType?.forEach((subType) => {
        var subName = "";
        switch (i18n.language) {
          case "enus":
            subName = subType.productNameEng;
            break;
          case "zhch":
            subName = subType.productNameSchi;
            break;
          case "zhhk":
            subName = subType.productNameTchi;
            break;
          default:
            subName = subType.productNameTchi;
            break;
        }

        productItem.productSubType.push({
          name: subName,
          id: subType.productSubTypeId,
        });

        subType.productAddonType?.forEach((addonType) => {
          var addonName = "";
          switch (i18n.language) {
            case "enus":
              addonName = addonType.productNameEng;
              break;
            case "zhch":
              addonName = addonType.productNameSchi;
              break;
            case "zhhk":
              addonName = addonType.productNameTchi;
              break;
            default:
              addonName = addonType.productNameTchi;
              break;
          }

          productItem.productAddonType.push({
            name: addonName,
            id: addonType.productAddonTypeId,
          });
        });
      });

      productMapping.push(productItem);
    });

    setProductItem(productMapping);
  };

  const mappingRecyleItem = () => {
    const recyleMapping: recycItem[] = [];
    recycType?.forEach((re) => {
      var reItem: recycItem = {
        recycType: { name: "", id: "" },
        recycSubType: [],
      };
      var subItem: il_item[] = [];
      var name = "";
      switch (i18n.language) {
        case "enus":
          name = re.recyclableNameEng;
          break;
        case "zhch":
          name = re.recyclableNameSchi;
          break;
        case "zhhk":
          name = re.recyclableNameTchi;
          break;
        default:
          name = re.recyclableNameTchi;
          break;
      }
      reItem.recycType = { name: name, id: re.recycTypeId };

      re.recycSubType.map((sub) => {
        var subName = "";
        switch (i18n.language) {
          case "enus":
            subName = sub.recyclableNameEng;
            break;
          case "zhch":
            subName = sub.recyclableNameSchi;
            break;
          case "zhhk":
            subName = sub.recyclableNameTchi;
            break;
          default:
            subName = sub.recyclableNameTchi;
            break;
        }

        reItem.recycSubType = subItem;
        subItem.push({ name: subName, id: sub.recycSubTypeId });
      });
      reItem.recycSubType = subItem;
      recyleMapping.push(reItem);
    });
    setRecycItem(recyleMapping);
  };

  // const getPicoDetail = async (sourcePicoId: string) => {
  //   try {
  //     const result = await getPicoById(sourcePicoId)
  //     if (result) return result
  //   } catch (error) {
  //     return null
  //   }
  // }

  // const getAllPickupOrder = async (data: InventoryItem[]) => {
  //   const picoData: PickupOrder[] = []
  //   for (let index = 0; index < data.length; index++) {
  //     const item = data[index]
  //     for (let index = 0; index < item.inventoryDetail.length; index++) {
  //       const invDetail = item.inventoryDetail[index]
  //       const result = await getPicoDetail(invDetail.sourcePicoId)
  //       if (result?.data) {
  //         picoData.push(result.data)
  //       }
  //     }
  //   }

  //   setPicoList(picoData)
  //   return picoData
  // }

  const getAllPickupOrder = async () => {
    const result = await getAllPickUpOrder(page - 1, 1000);
    let data = result?.data.content;
    if (data && data.length > 0) {
      setPicoList(data);
    }
  };

  const initInventory = async () => {
    setIsLoading(true);
    setFilteredInventory([]);
    let result;
    result = await astdGetInventoryByGIDLabel(query.gid);
    const data = result?.data;
    setInventoryData(data || []);

    if (data.length > 0) {
      var inventoryMapping: GIDItem[] = [];
      data.map((item: GIDItem) => {
        let recyName: string = "-";
        let subName: string = "-";
        let productName = "-";
        let productSubName = "-";
        let productAddOnName = "-";
        item.packageName = item.packageTypeId;
        const recyclables = recycType?.find(
          (re) => re.recycTypeId === item.recycTypeId
        );

        if (recyclables) {
          if (i18n.language === Languages.ENUS)
            recyName = recyclables.recyclableNameEng;
          if (i18n.language === Languages.ZHCH)
            recyName = recyclables.recyclableNameSchi;
          if (i18n.language === Languages.ZHHK)
            recyName = recyclables.recyclableNameTchi;
          const subs = recyclables.recycSubType.find(
            (sub) => sub.recycSubTypeId === item.recycSubTypeId
          );
          if (subs) {
            if (i18n.language === Languages.ENUS)
              subName = subs.recyclableNameEng;
            if (i18n.language === Languages.ZHCH)
              subName = subs.recyclableNameSchi;
            if (i18n.language === Languages.ZHHK)
              subName = subs.recyclableNameTchi;
          }
        }

        const product = productType?.find(
          (re) => re.productTypeId === item.productTypeId
        );

        if (product) {
          const matchingProductType = productType?.find(
            (product) => product.productTypeId === item.productTypeId
          );

          if (matchingProductType) {
            // Product Type Name
            switch (i18n.language) {
              case Languages.ENUS:
                productName = matchingProductType.productNameEng || "";
                break;
              case Languages.ZHCH:
                productName = matchingProductType.productNameSchi || "";
                break;
              case Languages.ZHHK:
                productName = matchingProductType.productNameTchi || "";
                break;
              default:
                productName = matchingProductType.productNameTchi || "";
                break;
            }

            // Product Subtype
            const matchProductSubType =
              matchingProductType.productSubType?.find(
                (subtype) => subtype.productSubTypeId === item.productSubTypeId
              );

            if (matchProductSubType) {
              switch (i18n.language) {
                case Languages.ENUS:
                  productSubName = matchProductSubType.productNameEng || "";
                  break;
                case Languages.ZHCH:
                  productSubName = matchProductSubType.productNameSchi || "";
                  break;
                case Languages.ZHHK:
                  productSubName = matchProductSubType.productNameTchi || "";
                  break;
                default:
                  productSubName = matchProductSubType.productNameTchi || "";
                  break;
              }
            }

            // Product Addon Type
            const matchProductAddonType =
              matchProductSubType?.productAddonType?.find(
                (addon) => addon.productAddonTypeId === item.productAddonTypeId
              );

            if (matchProductAddonType) {
              switch (i18n.language) {
                case Languages.ENUS:
                  productAddOnName = matchProductAddonType.productNameEng || "";
                  break;
                case Languages.ZHCH:
                  productAddOnName =
                    matchProductAddonType.productNameSchi || "";
                  break;
                case Languages.ZHHK:
                  productAddOnName =
                    matchProductAddonType.productNameTchi || "";
                  break;
                default:
                  productAddOnName =
                    matchProductAddonType.productNameTchi || "";
                  break;
              }
            }
          }
        }

        const packages = packagingMapping.find(
          (packageItem) => packageItem.packagingTypeId === item.packageTypeId
        );

        if (packages) {
          if (i18n.language === Languages.ENUS)
            item.packageName = packages.packagingNameEng;
          if (i18n.language === Languages.ZHCH)
            item.packageName = packages.packagingNameSchi;
          if (i18n.language === Languages.ZHHK)
            item.packageName = packages.packagingNameTchi;
        }

        const dateInHK = dayjs.utc(item.createdAt).tz("Asia/Hong_Kong");
        const createdAt = dateInHK.format(`${dateFormat} HH:mm`);

        inventoryMapping.push(
          createGID(
            item.labelId,
            item.recycTypeId,
            item.recycSubTypeId,
            item.productTypeId,
            item.productSubTypeId,
            item.productSubTypeRemark,
            item.productAddonTypeId,
            item.productAddonTypeRemark,
            recyName,
            subName,
            productName,
            productSubName,
            productAddOnName,
            item.packageTypeId,
            item.weight,
            item.unitId,
            item.updatedBy,
            item.createdBy,
            createdAt,
            item.updatedAt,
            item.gid,
            item?.packageName
          )
        );
      });

      setInventory(inventoryMapping);
      setFilteredInventory(inventoryMapping);
    }
    setIsLoading(false);
  };

  const columns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: t("inventory.date"),
      width: 200,
      type: "string",
    },
    {
      field: "category",
      headerName: t("processOrder.details.itemCategory"),
      width: 200,
      type: "string",
      valueGetter: (params) =>
        params.row.recycTypeId ? t("recyclables") : t("product"),
    },
    {
      field: "type",
      headerName: t("settings_page.recycling.main_category"),
      width: 200,
      type: "string",
      valueGetter: (params) =>
        params.row.recycTypeId
          ? params.row.recyName || "-"
          : params.row.productName || "-",
    },
    {
      field: "subType",
      headerName: t("settings_page.recycling.sub_category"),
      width: 200,
      type: "string",
      valueGetter: (params) =>
        params.row.recycTypeId
          ? params.row.subName || "-"
          : params.row.productSubName || "-",
    },
    {
      field: "Addon",
      headerName: t("settings_page.recycling.additional_category"),
      width: 200,
      type: "string",
      valueGetter: (params) =>
        params.row.recycTypeId ? "-" : params.row.productAddOnName || "-",
    },
    {
      field: "packageName",
      headerName: t("inventory.package"),
      width: 200,
      type: "string",
    },
    {
      field: "labelId",
      headerName: t("inventory.recyclingNumber"),
      width: 200,
      type: "string",
    },
    {
      field: "weight",
      headerName: t("inventory.weight"),
      width: 200,
      type: "string",
      renderCell: (params) => {
        return <div>{params.row.weight} kg</div>;
      },
    },
  ];

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
        let warehouse: { label: string; value: string }[] = [];
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
            value: item.warehouseId,
            label: warehouseName,
          });
        });
        warehouse.push({
          value: "",
          label: t("check_in.any"),
        });
        setWarehouseList(warehouse);
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const searchfield = [
    {
      label: t("globalItemId.globalItemId"),
      field: "gid",
      placeholder: t("globalItemId.enterGlobalItemId"),
      width: "280px",
    },
  ];

  const handleSelectRow = (params: GridRowParams) => {
    const selectedInv: InventoryItem = inventoryList.find(
      (item) => item.gid == params.row.gid
    );
    let selectedPicoList: PickupOrder[] = [];
    selectedInv.inventoryDetail?.forEach((item) => {
      const pico = picoList.find((pico) => pico.picoId == item.sourcePicoId);
      if (pico) {
        selectedPicoList.push(pico);
      }
    });

    console.log(selectedInv, "inv");
    setSelectedRow(selectedInv);
    setSelectedPico(selectedPicoList);
    setDrawerOpen(true);
  };

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
    };
  }, []);

  const updateQuery = (newQuery: Partial<GIDQuery>) => {
    setQuery({ ...query, ...newQuery });
  };

  const handleSearch = debounce((keyName, value) => {
    if (value.trim() === "" && query.gid == null) {
      return;
    }
    updateQuery({ [keyName]: value });
    setPage(1);
  }, 500);

  const handleGetHyperlinkData = async (gidValue: GIDValue) => {
    const gid = gidValue.gid.toString();
    var inventoryMapping: GIDItem[] = [];
    let result;
    result = await getItemTrackInventory(gid);
    const data = result?.data;
    // setInventoryData(data?.content || []);
    if (data) {
      // const picoData = await getAllPickUpOrder()
      let recyName: string = "-";
      let subName: string = "-";
      let productName = "-";
      let productSubName = "-";
      let productAddOnName = "-";
      data.packageName = data.packageTypeId;
      const recyclables = recycType?.find(
        (re) => re.recycTypeId === data.recycTypeId
      );
      if (recyclables) {
        if (i18n.language === Languages.ENUS)
          recyName = recyclables.recyclableNameEng;
        if (i18n.language === Languages.ZHCH)
          recyName = recyclables.recyclableNameSchi;
        if (i18n.language === Languages.ZHHK)
          recyName = recyclables.recyclableNameTchi;
        const subs = recyclables.recycSubType.find(
          (sub) => sub.recycSubTypeId === data.recycSubTypeId
        );
        if (subs) {
          if (i18n.language === Languages.ENUS)
            subName = subs.recyclableNameEng;
          if (i18n.language === Languages.ZHCH)
            subName = subs.recyclableNameSchi;
          if (i18n.language === Languages.ZHHK)
            subName = subs.recyclableNameTchi;
        }
      }
      const product = productType?.find(
        (re) => re.productTypeId === data.productTypeId
      );

      if (product) {
        const matchingProductType = productType?.find(
          (product) => product.productTypeId === data.productTypeId
        );

        if (matchingProductType) {
          // Product Type Name
          switch (i18n.language) {
            case Languages.ENUS:
              productName = matchingProductType.productNameEng || "";
              break;
            case Languages.ZHCH:
              productName = matchingProductType.productNameSchi || "";
              break;
            case Languages.ZHHK:
              productName = matchingProductType.productNameTchi || "";
              break;
            default:
              productName = matchingProductType.productNameTchi || "";
              break;
          }

          // Product Subtype
          const matchProductSubType = matchingProductType.productSubType?.find(
            (subtype) => subtype.productSubTypeId === data.productSubTypeId
          );

          if (matchProductSubType) {
            switch (i18n.language) {
              case Languages.ENUS:
                productSubName = matchProductSubType.productNameEng || "";
                break;
              case Languages.ZHCH:
                productSubName = matchProductSubType.productNameSchi || "";
                break;
              case Languages.ZHHK:
                productSubName = matchProductSubType.productNameTchi || "";
                break;
              default:
                productSubName = matchProductSubType.productNameTchi || "";
                break;
            }
          }

          // Product Addon Type
          const matchProductAddonType =
            matchProductSubType?.productAddonType?.find(
              (addon) => addon.productAddonTypeId === data.productAddonTypeId
            );

          if (matchProductAddonType) {
            switch (i18n.language) {
              case Languages.ENUS:
                productAddOnName = matchProductAddonType.productNameEng || "";
                break;
              case Languages.ZHCH:
                productAddOnName = matchProductAddonType.productNameSchi || "";
                break;
              case Languages.ZHHK:
                productAddOnName = matchProductAddonType.productNameTchi || "";
                break;
              default:
                productAddOnName = matchProductAddonType.productNameTchi || "";
                break;
            }
          }
        }
      }
      const packages = packagingMapping.find(
        (packageItem) => packageItem.packagingTypeId === data.packageTypeId
      );

      if (packages) {
        if (i18n.language === Languages.ENUS)
          data.packageName = packages.packagingNameEng;
        if (i18n.language === Languages.ZHCH)
          data.packageName = packages.packagingNameSchi;
        if (i18n.language === Languages.ZHHK)
          data.packageName = packages.packagingNameTchi;
      }

      const dateInHK = dayjs.utc(data.createdAt).tz("Asia/Hong_Kong");
      const createdAt = dateInHK.format(`${dateFormat} HH:mm`);

      inventoryMapping.push(
        createGID(
          data.labelId,
          data.recycTypeId,
          data.recycSubTypeId,
          data.productTypeId,
          data.productSubTypeId,
          data.productSubTypeRemark,
          data.productAddonTypeId,
          data.productAddonTypeRemark,
          recyName,
          subName,
          productName,
          productSubName,
          productAddOnName,
          data.packageTypeId,
          data.weight,
          data.unitId,
          data.updatedBy,
          data.createdBy,
          createdAt,
          data.updatedAt,
          data.gid,
          data?.packageName
        )
      );
      setSelectedRow(inventoryMapping[0]);
    }
  };

  useEffect(() => {
    if (debouncedSearchValue) {
      setInventory([]);
      setFilteredInventory([]);
      setSelectedRow(null);
      setPage(1);
      setTotalData(0);
      setPicoList([]);
      setSelectedPico([]);
      initInventory();
      initWarehouse();
    }
  }, [debouncedSearchValue, query, i18n.language]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          pr: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginY: 4,
          }}
        >
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t("globalItemId.globalItemId")}
          </Typography>
          {realmApi !== "account" && (
            <Button
              onClick={() => {
                setCreateDrawerOpen(true);
              }}
              sx={{
                borderRadius: "20px",
                backgroundColor: getPrimaryColor(),
                "&.MuiButton-root:hover": { bgcolor: getPrimaryColor() },
                width: "fit-content",
                height: "40px",
                marginLeft: "20px",
              }}
              variant="contained"
              data-testId={"astd-pickup-order-new-button-5743"}
            >
              + {t("col.create")}
            </Button>
          )}
        </Box>
        <Stack direction="row" mt={3}>
          {searchfield.map((s, index) => (
            <CustomSearchField
              key={index}
              label={s.label}
              width={s?.width}
              placeholder={s.placeholder}
              field={s.field}
              onChange={handleSearch}
            />
          ))}
        </Stack>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
            {isLoading ? (
              <CircularLoading />
            ) : (
              <Box>
                <DataGrid
                  rows={filteredInventory}
                  getRowId={(row) => row.gid}
                  hideFooter
                  columns={columns}
                  onRowClick={handleSelectRow}
                  getRowSpacing={getRowSpacing}
                  localeText={localeTextDataGrid}
                  getRowClassName={(params) =>
                    selectedRow && params.row.gid === selectedRow.gid
                      ? "selected-row"
                      : ""
                  }
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
                    ".MuiDataGrid-columnHeaderTitle": {
                      fontWeight: "bold !important",
                      overflow: "visible !important",
                    },
                    "& .selected-row": {
                      backgroundColor: "#F6FDF2 !important",
                      border: "1px solid #79CA25",
                    },
                  }}
                />
                <Pagination
                  className="mt-4"
                  count={Math.ceil(totalData)}
                  page={page}
                  onChange={(_, newPage) => {
                    setPage(newPage);
                  }}
                />
              </Box>
            )}
          </Box>
          <InventoryDetail
            drawerOpen={drawerOpen}
            handleDrawerClose={() => {
              setDrawerOpen(false);
              setSelectedRow(null);
            }}
            selectedRow={selectedRow}
            handleGetHyperlinkData={handleGetHyperlinkData}
          />
        </div>
      </Box>
    </>
  );
};

export default Inventory;
