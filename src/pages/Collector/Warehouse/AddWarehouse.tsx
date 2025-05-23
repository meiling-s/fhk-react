import { FunctionComponent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RightOverlayForm from "../../../components/RightOverlayForm";
import TextField from "@mui/material/TextField";
import { Grid, FormHelperText, Autocomplete } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switcher from "../../../components/FormComponents/CustomSwitch";
import LabelField from "../../../components/FormComponents/CustomField";
import DeleteModal from "../../../components/FormComponents/deleteModal";
import { ADD_CIRCLE_ICON, REMOVE_CIRCLE_ICON } from "../../../themes/icons";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import {
  extractError,
  showErrorToast,
  showSuccessToast,
  returnApiToken,
} from "../../../utils/utils";
import {
  createWarehouse,
  getWarehouseById,
  editWarehouse,
  getRecycleType,
  editWarehouseStatus,
} from "../../../APICalls/warehouseManage";
import { getWeightbySubtype } from "../../../APICalls/warehouseDashboard";
import { getLocation } from "../../../APICalls/getLocation";
import { getCommonTypes } from "../../../APICalls/commonManage";
import { STATUS_CODE, localStorgeKeyName } from "../../../constants/constant";
import { getProductTypeList } from "src/APICalls/ASTD/settings/productType";
import {
  ProductAddon,
  Products,
  ProductSubType,
} from "src/interfaces/productType";
import ItemCategoryRow from "./ItemCategoryRow";

interface ItemCategory {
  type: "recyclable" | "product";
  recycTypeId?: string;
  recycSubTypeId?: string;
  recycTypeCapacity?: number;
  recycSubTypeCapacity?: number;
  productTypeId?: string;
  productSubTypeId?: string;
  productAddonTypeId?: string;
  productTypeCapacity?: number;
  productSubTypeCapacity?: number;
  productAddonTypeCapacity?: number;
  unitId: number;
}
interface RecyleItem {
  recycTypeId: string;
  recycSubTypeId: string;
  recycSubTypeCapacity: number;
  recycTypeCapacity: number;
}

interface Warehouse {
  id: number;
  warehouseId: number;
  warehouseNameTchi: string;
  warehouseNameSchi: string;
  warehouseNameEng: string;
  location: string;
  physicalFlg: string | boolean;
  contractNo: string[];
  status: string;
  warehouseRecyc: RecyleItem[];
}

interface AddWarehouseProps {
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  action?: "add" | "edit" | "delete";
  onSubmitData?: (type: string, id?: number, error?: boolean) => void;
  rowId: number;
  warehouseList: Warehouse[];
}

interface recyleItem {
  recycTypeId: string;
  recycSubTypeId: string;
  recycSubTypeCapacity: number;
  recycTypeCapacity: number;
}

interface productItem {
  productTypeId: string;
  productSubTypeId: string;
  productAddonTypeId: string;
  productTypeCapacity: number;
  productSubTypeCapacity: number;
  productAddonTypeCapacity: number;
}

interface recyleSubtyeData {
  recycSubTypeId: string;
  recyclableNameEng: string;
  recyclableNameSchi: string;
  recyclableNameTchi: string;
  remark: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
}

interface recyleTypeData {
  createdAt: string;
  createdBy: string;
  description: string;
  recycSubType: recyleSubtyeData[];
  recycTypeId: string;
  recyclableNameEng: string;
  recyclableNameSchi: string;
  recyclableNameTchi: string;
  remark: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
}

interface recyleTypeOption {
  id: string;
  recyclableNameEng: string;
  recyclableNameSchi: string;
  recyclableNameTchi: string;
}

interface recyleSubtypeOption {
  [key: string]: recyleSubtyeData[];
}

// Define types for state
export interface ProductTypeOption {
  id: string;
  productNameEng: string;
  productNameSchi: string;
  productNameTchi: string;
}

export interface ProductSubtypeMapping {
  [key: string]: ProductSubType[];
}

export interface productAddonMapping {
  [key: string]: ProductAddon[];
}

interface nameFields {
  warehouseNameTchi: string;
  warehouseNameSchi: string;
  warehouseNameEng: string;
}

const AddWarehouse: FunctionComponent<AddWarehouseProps> = ({
  drawerOpen,
  handleDrawerClose,
  action = "add",
  onSubmitData,
  rowId,
  warehouseList = [],
}) => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const currentLanguage = localStorage.getItem("selectedLanguage") || "zhhk";
  const [errorMsgList, setErrorMsgList] = useState<string[]>([]);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const [recycleType, setRecycleType] = useState<recyleTypeOption[]>([]);
  const [recycleSubType, setSubRecycleType] = useState<recyleSubtypeOption>({});
  const [productType, setProductType] = useState<ProductTypeOption[]>([]);
  const [productSubTypeMapping, setProductSubTypeMapping] =
    useState<ProductSubtypeMapping>({});
  const [productAddonTypeMapping, setproductAddonTypeMapping] =
    useState<productAddonMapping>({});
  const [contractList, setContractList] = useState<
    { contractNo: string; isEpd: boolean; frmDate: string; toDate: string }[]
  >([]);
  const [pysicalLocation, setPysicalLocation] = useState<boolean>(false);
  const [status, setStatus] = useState(true);
  const [workshopFlg, setWorkshopFlg] = useState<boolean>(false);
  const duplicateRecycleTypeIds = new Set<string>();
  const duplicateProductTypeIds = new Set<string>();
  const [zeroCapacityItems, setZeroCapacityItems] = useState<
    recyleTypeOption[]
  >([]);
  const [existingWarehouse, setExisitingWarehouse] = useState<Warehouse[]>([]);
  const [version, setVersion] = useState<number>(0);
  const navigate = useNavigate();
  const role = localStorage.getItem(localStorgeKeyName.role) || "collector";
  const [onDeleteWarehouseMsg, setOnDeleteWarehouseMsg] = useState<string>("");
  const [openWHDeleteModal, setOpenWHDeleteModal] = useState<boolean>(false);
  const [openWHCloseModal, setOpenWHCloseModal] = useState<boolean>(false);
  const [itemType, setItemType] = useState<boolean>(true);
  const [itemCategories, setItemCategories] = useState<ItemCategory[]>([
    {
      type: "recyclable",
      recycTypeId: "",
      recycSubTypeId: "",
      recycTypeCapacity: 0,
      recycSubTypeCapacity: 0,
      unitId: 0,
    },
  ]);
  const [hasErrors, setHasErrors] = useState(false);
  const [recycleTypeDataArray, setRecycleTypeDataArray] = useState<
    recyleTypeData[]
  >([]);
  const [productTypeDataArray, setProductTypeDataArray] = useState<Products[]>(
    []
  );

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [i18n, currentLanguage]);

  useEffect(() => {
    initType();
  }, []);

  const initType = async () => {
    try {
      const result = await getCommonTypes();
      if (result?.contract) {
        var conList: {
          contractNo: string;
          isEpd: boolean;
          frmDate: string;
          toDate: string;
        }[] = [];
        result.contract.map((con) => {
          conList.push({
            contractNo: con.contractNo,
            isEpd: con.epdFlg,
            frmDate: con.contractFrmDate,
            toDate: con.contractToDate,
          });
        });
        setContractList(conList);
      }
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const getRecyleCategory = async () => {
    try {
      const response = await getRecycleType();
      if (response) {
        setRecycleTypeDataArray(response.data);
        const dataReycleType: recyleTypeOption[] = response.data.map(
          (item: recyleTypeData) => ({
            id: item.recycTypeId,
            recyclableNameEng: item.recyclableNameEng,
            recyclableNameSchi: item.recyclableNameSchi,
            recyclableNameTchi: item.recyclableNameTchi,
          })
        );

        const subTypeMapping: recyleSubtypeOption = {};
        response.data.forEach((item: recyleTypeData) => {
          if (!subTypeMapping[item.recycTypeId]) {
            subTypeMapping[item.recycTypeId as keyof recyleTypeData] =
              item.recycSubType;
          } else {
            subTypeMapping[item.recycTypeId] = [
              ...subTypeMapping[item.recycTypeId],
              ...item.recycSubType,
            ];
          }
        });

        setRecycleType(dataReycleType);
        setSubRecycleType(subTypeMapping);
      }
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const getProductCategory = async () => {
    try {
      const response = await getProductTypeList();
      if (response) {
        setProductTypeDataArray(response.data);
        const dataProduct: ProductTypeOption[] = response.data.map(
          (item: Products) => ({
            id: item.productTypeId,
            productNameEng: item.productNameEng,
            productNameSchi: item.productNameSchi,
            productNameTchi: item.productNameTchi,
          })
        );

        const subTypeMapping: ProductSubtypeMapping = {};
        const addonTypeMapping: productAddonMapping = {};

        response.data.forEach((item: Products) => {
          if (item.productSubType && item.productSubType.length > 0) {
            subTypeMapping[item.productTypeId] = item.productSubType;

            item.productSubType.forEach((subType) => {
              if (
                subType.productAddonType &&
                subType.productAddonType.length > 0
              ) {
                addonTypeMapping[subType.productSubTypeId] =
                  subType.productAddonType;
              } else {
                addonTypeMapping[subType.productSubTypeId] = [];
              }
            });
          } else {
            subTypeMapping[item.productTypeId] = [];
          }
        });

        setProductType(dataProduct);
        setProductSubTypeMapping(subTypeMapping);
        setproductAddonTypeMapping(addonTypeMapping);
      }
    } catch (error) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  const resetForm = () => {
    setNamesField({
      warehouseNameTchi: "",
      warehouseNameSchi: "",
      warehouseNameEng: "",
    });
    setContractNum([...initContractNum]);
    setPlace("");
    setPysicalLocation(true);
    setWorkshopFlg(true);
    setStatus(true);
    setItemCategories([
      {
        type: "recyclable",
        recycTypeId: "",
        recycSubTypeId: "",
        recycTypeCapacity: 0,
        recycSubTypeCapacity: 0,
        unitId: 0,
      },
    ]);
  };

  const getWarehousebyId = async () => {
    try {
      const response = await getWarehouseById(rowId);
      if (response) {
        //mapping data
        const warehouse = response.data;
        setNamesField({
          warehouseNameTchi: warehouse.warehouseNameTchi,
          warehouseNameSchi: warehouse.warehouseNameSchi,
          warehouseNameEng: warehouse.warehouseNameEng,
        });
        setContractNum(
          warehouse.contractNo.length !== 0 ? [...warehouse.contractNo] : [""]
        );
        setPlace(warehouse.location);
        setPysicalLocation(warehouse.physicalFlg);
        if (warehouse?.physicalFlg) setWorkshopFlg(warehouse.workshopFlg);
        setStatus(warehouse.status === "ACTIVE");

        setExisitingWarehouse(
          warehouseList.filter((item) => item.id != warehouse.warehouseId)
        );
        setVersion(warehouse.version);

        const constructItemCategories = () => {
          const recyclableItems = warehouse.warehouseRecyc.map(
            (item: ItemCategory) => ({
              type: "recyclable" as const,
              recycTypeId: item.recycTypeId,
              recycSubTypeId: item.recycSubTypeId,
              recycTypeCapacity: item.recycTypeCapacity,
              recycSubTypeCapacity: item.recycSubTypeCapacity,
            })
          );

          const productItems = warehouse.warehouseProduct.map(
            (item: ItemCategory) => ({
              type: "product" as const,
              productTypeId: item.productTypeId,
              productSubTypeId: item.productSubTypeId,
              productAddonTypeId: item.productAddonTypeId,
              productTypeCapacity: item.productTypeCapacity,
              productSubTypeCapacity: item.productSubTypeCapacity,
              productAddonTypeCapacity: item.productAddonTypeCapacity,
            })
          );

          // Combine and update state
          setItemCategories([...recyclableItems, ...productItems]);
        };

        // Call constructItemCategories on load or event
        // e.g., useEffect(() => constructItemCategories(), []);
        constructItemCategories();
      }
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };

  useEffect(() => {
    if (action === "add") {
      resetForm();
      setTrySubmited(false);
      setExisitingWarehouse(warehouseList);
    } else if (action === "edit" || action === "delete") {
      getWarehousebyId();
    }

    getRecyleCategory();
    getProductCategory();
  }, [action, drawerOpen]);

  const name_fields = [
    {
      field: "warehouseNameTchi",
      label: t("warehouse_page.trad_name"),
      placeholder: t("add_warehouse_page.type_name"),
    },
    {
      field: "warehouseNameSchi",
      label: t("warehouse_page.simp_name"),
      placeholder: t("add_warehouse_page.type_name"),
    },
    {
      field: "warehouseNameEng",
      label: t("warehouse_page.english_name"),
      placeholder: t("add_warehouse_page.type_name"),
    },
  ];
  const [nameValue, setNamesField] = useState<nameFields>({
    // name fields
    warehouseNameTchi: "",
    warehouseNameSchi: "",
    warehouseNameEng: "",
  });
  const initContractNum: string[] = [""]; // contract field
  const [contractNum, setContractNum] = useState<string[]>(initContractNum);
  const [place, setPlace] = useState(""); // place field

  const initRecyleCategory: recyleItem[] = [
    // recyle category field
    {
      recycTypeId: "",
      recycSubTypeId: "",
      recycTypeCapacity: 0,
      recycSubTypeCapacity: 0,
    },
  ];

  const initProductCategory: productItem[] = [
    // product field
    {
      productTypeId: "",
      productSubTypeId: "",
      productAddonTypeId: "",
      productTypeCapacity: 0,
      productSubTypeCapacity: 0,
      productAddonTypeCapacity: 0,
    },
  ];

  const [validation, setValidation] = useState<
    { field: string; error: string }[]
  >([]);
  const [trySubmited, setTrySubmited] = useState<boolean>(false);

  const [recycleCategory, setRecycleCategory] =
    useState<recyleItem[]>(initRecyleCategory);

  const [productCategory, setProductCategory] =
    useState<productItem[]>(initProductCategory);

  const [locationGps, setLocationGps] = useState<number[]>([]);

  //get location from google map api
  useEffect(() => {
    getLocation(place)
      .then((res) => {
        if (res.data.results) {
          const latitude = res.data.results[0].geometry.location.lat;
          const longitude = res.data.results[0].geometry.location.lng;

          const newLocation = [latitude, longitude];
          setLocationGps(newLocation);
        }
      })
      .catch((err) => {
        // console.log('Fecthing google map api error: ', err)
      });
  }, [place]);

  // validation input text
  useEffect(() => {
    const tempV: { field: string; error: string }[] = [];

    Object.keys(nameValue).forEach((fieldName) => {
      nameValue[fieldName as keyof nameFields].trim() === "" &&
        tempV.push({
          field: fieldName,
          error: `${t(`add_warehouse_page.${fieldName}`)} ${t(
            "add_warehouse_page.shouldNotEmpty"
          )}`,
        });
    });

    existingWarehouse.forEach((item) => {
      if (
        item.warehouseNameTchi.toLowerCase() ===
        nameValue.warehouseNameTchi.toLowerCase()
      ) {
        tempV.push({
          field: "warehouseNameTchi",
          error: `${t("common.traditionalChineseName")} ${t(
            "form.error.alreadyExist"
          )}`,
        });
      }
      if (
        item.warehouseNameSchi.toLowerCase() ===
        nameValue.warehouseNameSchi.toLowerCase()
      ) {
        tempV.push({
          field: "warehouseNameSchi",
          error: `${t("common.simplifiedChineseName")} ${t(
            "form.error.alreadyExist"
          )}`,
        });
      }
      if (
        item.warehouseNameEng.toLowerCase() ===
        nameValue.warehouseNameEng.toLowerCase()
      ) {
        tempV.push({
          field: "warehouseNameEng",
          error: `${t("common.englishName")} ${t("form.error.alreadyExist")}`,
        });
      }
      if (item.location.toLowerCase() === place.toLowerCase()) {
        tempV.push({
          field: "place",
          error: `${t("add_warehouse_page.place")} ${t(
            "form.error.alreadyExist"
          )}`,
        });
      }
    });

    place.trim() === "" &&
      tempV.push({
        field: "place",
        error: `${t(`add_warehouse_page.place`)} ${t(
          "add_warehouse_page.shouldNotEmpty"
        )}`,
      });

    itemCategories.forEach((category, index) => {
      if (category.type === "recyclable") {
        const recycType = recycleTypeDataArray?.find(
          (type) => type.recycTypeId === category.recycTypeId
        );

        if (!category.recycTypeId) {
          tempV.push({
            field: `itemCategory[${index}].recycTypeId`,
            error: `${t("pick_up_order.card_detail.main_category")} ${t(
              "add_warehouse_page.shouldNotEmpty"
            )}`,
          });
        }

        if (
          recycType &&
          recycType.recycSubType.length > 0 &&
          !category.recycSubTypeId
        ) {
          tempV.push({
            field: `itemCategory[${index}].recycSubTypeId`,
            error: `${t("pick_up_order.card_detail.subcategory")} ${t(
              "add_warehouse_page.shouldNotEmpty"
            )}`,
          });
        }
        if (category.recycTypeCapacity === 0) {
          tempV.push({
            field: `itemCategory[${index}].recycTypeCapacity`,
            error: `${t("dashboard_recyclables.capacity")} ${t(
              "add_warehouse_page.shouldNotEmpty"
            )}`,
          });
        }
      } else if (category.type === "product") {
        const productType = productTypeDataArray.find(
          (type) => type.productTypeId === category.productTypeId
        );

        if (!category.productTypeId) {
          tempV.push({
            field: `itemCategory[${index}].productTypeId`,
            error: `${t("pick_up_order.product_type.product")} ${t(
              "add_warehouse_page.shouldNotEmpty"
            )}`,
          });
        }

        if (
          productType &&
          productType.productSubType !== undefined &&
          productType?.productSubType?.length > 0 &&
          !category.productSubTypeId
        ) {
          tempV.push({
            field: `itemCategory[${index}].productSubTypeId`,
            error: `${t("pick_up_order.product_type.subtype")} ${t(
              "add_warehouse_page.shouldNotEmpty"
            )}`,
          });
        }

        if (
          productType?.productSubType?.find(
            (subType) => subType.productSubTypeId === category?.productSubTypeId
          )?.productAddonType?.length &&
          !category?.productAddonTypeId
        ) {
          tempV.push({
            field: `itemCategory[${index}].productAddonTypeId`,
            error: `${t("pick_up_order.product_type.add-on")} ${t(
              "add_warehouse_page.shouldNotEmpty"
            )}`,
          });
        }
        if (category.productTypeCapacity === 0) {
          tempV.push({
            field: `itemCategory[${index}].productTypeCapacity`,
            error: `${t("dashboard_recyclables.capacity")} ${t(
              "add_warehouse_page.shouldNotEmpty"
            )}`,
          });
        }
      }
    });

    setValidation(tempV);
  }, [
    nameValue,
    place,
    contractNum,
    itemCategories,
    existingWarehouse,
    t,
    recycleTypeDataArray,
    productTypeDataArray,
  ]);

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false;
    }
    return s == "";
  };

  //handle methods
  const handleNameFields = (fieldName: string, value: string) => {
    setNamesField({ ...nameValue, [fieldName]: value });
  };

  const handlePlaceChange = (fieldName: string, value: string) => {
    setPlace(value);
  };

  const handleRemoveContact = (indexToRemove: number) => {
    const updatedContractNum = contractNum.filter(
      (_, index) => index !== indexToRemove
    );
    setContractNum(updatedContractNum);
  };

  const handleAddContact = () => {
    const updatedContractNum = [...contractNum, ""];
    setContractNum(updatedContractNum);
  };

  const handleContractChange = (value: string, index: number) => {
    const updatedContacts = [...contractNum];
    updatedContacts[index] = value;
    setContractNum(updatedContacts);
  };

  const createWareHouseData = async (addWarehouseForm: any) => {
    try {
      const response = await createWarehouse(addWarehouseForm);
      if (response) {
        showSuccessToast(t("common.saveSuccessfully"));
        handleClose();
      }
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else {
        console.error(error);
        showErrorToast(t("common.saveFailed"));
      }
    }
  };

  const editWarehouseData = async (addWarehouseForm: any, type: string) => {
    try {
      const isError = validation.length == 0;
      if (type === "delete") {
        const warehouseForm = {
          status: "DELETED",
          version: version,
        };
        if (role === "collector") {
          const response = await editWarehouseStatus(warehouseForm, rowId);
          if (response) {
            showSuccessToast(t("common.deletedSuccessfully"));
            handleClose();
          }
        } else {
          const response = await editWarehouse(addWarehouseForm, rowId);
          if (response) {
            showSuccessToast(t("common.deletedSuccessfully"));
            handleClose();
          }
        }
      } else {
        const response = await editWarehouse(addWarehouseForm, rowId);
        if (response) {
          showSuccessToast(t("common.editSuccessfully"));
          setOpenWHCloseModal(false);
          handleClose();
          setProductCategory(initProductCategory);
          setRecycleCategory(initRecyleCategory);

          if (
            onSubmitData &&
            typeof onSubmitData === "function" &&
            typeof rowId === "number"
          ) {
            onSubmitData(action, rowId, !isError);
          }
        }
      }
      setOpenWHDeleteModal(false);
      setOnDeleteWarehouseMsg("");
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else if (state.code === STATUS_CODE[409]) {
        showErrorToast(error.response.data.message);
      }
    }
  };

  const constructFormData = () => {
    let statusWarehouse = status ? "ACTIVE" : "INACTIVE";
    if (action == "delete") {
      statusWarehouse = "DELETED";
    }
    const filteredContractNum = contractNum.filter((num) => num !== "");
    const warehouseRecyc = itemCategories
      .filter((item) => item.type === "recyclable")
      .map(
        ({
          recycTypeId,
          recycSubTypeId,
          recycTypeCapacity,
          recycSubTypeCapacity,
        }) => ({
          recycTypeId,
          recycSubTypeId,
          recycTypeCapacity,
          recycSubTypeCapacity,
        })
      );

    const warehouseProduct = itemCategories
      .filter((item) => item.type === "product")
      .map(
        ({
          productTypeId,
          productSubTypeId,
          productAddonTypeId,
          productTypeCapacity,
        }) => ({
          productTypeId,
          productSubTypeId,
          productAddonTypeId,
          productTypeCapacity,
          productSubTypeCapacity: 0,
          productAddonTypeCapacity: 0,
        })
      );
    const addWarehouseForm = {
      warehouseNameTchi: nameValue.warehouseNameTchi,
      warehouseNameSchi: nameValue.warehouseNameSchi,
      warehouseNameEng: nameValue.warehouseNameEng,
      location: place,
      locationGps: locationGps,
      physicalFlg: pysicalLocation,
      contractNo: filteredContractNum,
      status: statusWarehouse,
      createdBy: "string",
      updatedBy: "string",
      warehouseRecyc: warehouseRecyc,
      warehouseProduct: warehouseProduct,
      ...(role === "collector" && { workshopFlg: workshopFlg }),
      version: version,
    };

    return addWarehouseForm;
  };

  //submit data
  const handleSubmit = async () => {
    const addWarehouseForm = constructFormData();
    getFormErrorMsg();
    if (validation.length === 0 && !hasErrors) {
      action === "add"
        ? //MOVE API CAL TO PARENT DATA, ONLY PARSING DATA HERE
          createWareHouseData(addWarehouseForm)
        : handleEditWH(addWarehouseForm);
      setValidation([]);
    } else {
      setTrySubmited(true);
    }
  };

  useEffect(() => {
    getFormErrorMsg();
  }, [validation]);

  const getFormErrorMsg = () => {
    const errorList: string[] = [];
    const seenErrors = new Set();

    validation.forEach((item) => {
      if (item.field === "contractNo") {
        if (!seenErrors.has("contractNo")) {
          errorList.push(item.error);
          seenErrors.add("contractNo");
        }
      } else {
        errorList.push(item.error);
      }
    });

    setErrorMsgList(errorList);
  };

  const handleClose = () => {
    setValidation([]);
    setErrorMsgList([]);
    setTrySubmited(false);
    handleDrawerClose();
    setItemCategories([
      {
        type: "recyclable",
        recycTypeId: "",
        recycSubTypeId: "",
        recycTypeCapacity: 0,
        recycSubTypeCapacity: 0,
        unitId: 0,
      },
    ]);
  };

  const checkWarehouseRecycble = async () => {
    const token = returnApiToken();
    const result = await getWeightbySubtype(rowId, token.decodeKeycloack);

    if (result) {
      return Object.keys(result.data).length != 0;
    }
    return false;
  };

  const handleEditWH = async (editWarehouseForm: any) => {
    const isRecybleExist = await checkWarehouseRecycble();

    if (editWarehouseForm.status === "INACTIVE" && isRecybleExist) {
      setOpenWHCloseModal(true);
    } else {
      editWarehouseData(editWarehouseForm, "edit");
    }
  };

  const handleCloseWH = () => {
    const editWarehouseForm = constructFormData();
    editWarehouseData(editWarehouseForm, "edit");
  };

  const handleDeleteWH = () => {
    const deleteform = {
      warehouseNameTchi: nameValue.warehouseNameTchi,
      warehouseNameSchi: nameValue.warehouseNameSchi,
      warehouseNameEng: nameValue.warehouseNameEng,
      location: place,
      locationGps: locationGps,
      physicalFlg: pysicalLocation,
      contractNo: contractNum,
      status: "DELETED",
      createdBy: "string",
      updatedBy: "string",
      warehouseRecyc: recycleCategory,
      version: version,
    };
    editWarehouseData(deleteform, "delete");
  };

  const onDeleteHeaderWH = async () => {
    try {
      // Check if warehouse recyclable data exists
      const isRecybleExist = await checkWarehouseRecycble();
      setOnDeleteWarehouseMsg("");
      if (!isRecybleExist) {
        setOnDeleteWarehouseMsg(t("add_warehouse_page.warningDeleteWarehouse"));
      } else {
        setOnDeleteWarehouseMsg(
          t("add_warehouse_page.warningDeleteExistingRecy")
        );
      }
      setOpenWHDeleteModal(true);
    } catch (error) {
      console.error("Error checking warehouse recyclable:", error);
    }
  };

  return (
    <div className="add-warehouse">
      <ToastContainer></ToastContainer>
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleClose}
        anchor={"right"}
        action={action}
        headerProps={{
          title:
            action == "add"
              ? t("top_menu.add_new")
              : action == "delete"
              ? t("add_warehouse_page.delete")
              : t("userGroup.change"),
          subTitle: t("top_menu.workshop"),
          submitText: t("add_warehouse_page.save"),
          cancelText: t("add_warehouse_page.delete"),
          onCloseHeader: handleClose,
          onSubmit: handleSubmit,
          onDelete: onDeleteHeaderWH,
          useDeleteConfirmation: false,
        }}
        width="900px"
      >
        {/* form warehouse */}
        <div
          style={{ borderTop: "1px solid lightgrey" }}
          className="form-container"
        >
          <div className="self-stretch flex flex-col items-start justify-start pt-[25px] px-[25px] pb-[75px] gap-[25px] text-left text-smi text-grey-middle">
            {name_fields.map((item, index) => (
              <div
                key={index + "name"}
                className="self-stretch flex flex-col items-start justify-center gap-2"
              >
                <LabelField label={item.label} mandatory={true} />
                <FormControl fullWidth variant="standard">
                  <TextField
                    value={nameValue[item.field as keyof nameFields]}
                    onChange={(e) =>
                      handleNameFields(item.field, e.target.value)
                    }
                    fullWidth
                    placeholder={item.placeholder}
                    id={`fullWidth-${index}`}
                    InputLabelProps={{ shrink: false }}
                    InputProps={{
                      sx: styles.textField,
                    }}
                    sx={styles.inputState}
                    disabled={action === "delete"}
                    error={checkString(
                      nameValue[item.field as keyof nameFields]
                    )}
                  />
                </FormControl>
              </div>
            ))}
            {/* <Switcher  Physical location/> */}
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center">
              <LabelField label={t("warehouse_page.location")} />
              <Switcher
                onText={t("add_warehouse_page.yes")}
                offText={t("add_warehouse_page.no")}
                disabled={action === "delete"}
                defaultValue={pysicalLocation}
                setState={(newValue) => {
                  setPysicalLocation(newValue);
                }}
              />
            </div>
            {/* contact number */}
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center text-mini text-black">
              <LabelField label={t("col.contractNo")} />
              <div className="self-stretch flex flex-col items-start justify-start">
                <div className="self-stretch ">
                  {contractNum.map((contact, index) => (
                    <div
                      className="flex flex-row items-center justify-start gap-[8px] mb-2"
                      key={contact + index}
                    >
                      <FormControl fullWidth variant="standard">
                        <Autocomplete
                          disablePortal
                          fullWidth
                          disabled={action === "delete"}
                          options={contractList
                            .filter(
                              (contract) =>
                                !contractNum.includes(contract.contractNo)
                            )
                            .map((contract) => contract.contractNo)}
                          value={contractNum[index]}
                          onChange={(_, value) => {
                            handleContractChange(value || "", index);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              placeholder={t("col.enterNo")}
                              InputLabelProps={{
                                shrink: false,
                              }}
                              InputProps={{
                                ...params.InputProps,
                                sx: styles.textField,
                              }}
                              sx={styles.inputState}
                              disabled={action === "delete"}
                            />
                          )}
                          noOptionsText={t("common.noOptions")}
                        />
                      </FormControl>
                      {index === contractNum.length - 1 ? (
                        <ADD_CIRCLE_ICON
                          fontSize="small"
                          className={`${
                            action === "delete"
                              ? "text-gray"
                              : "text-green-primary"
                          } " cursor-pointer"`}
                          onClick={
                            action !== "delete" ? handleAddContact : undefined
                          }
                        />
                      ) : (
                        index !== contractNum.length - 1 && (
                          <REMOVE_CIRCLE_ICON
                            fontSize="small"
                            className={`text-grey-light ${
                              contractNum.length === 1
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            } `}
                            onClick={() =>
                              action !== "delete"
                                ? handleRemoveContact(index)
                                : undefined
                            }
                          />
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Adress field */}
            <div className="self-stretch flex flex-col items-start justify-center gap-[8px]">
              <LabelField label={t("warehouse_page.place")} mandatory={true} />
              <div className="self-stretch flex flex-col items-start justify-center gap-[8px] text-center text-mini text-grey-darker">
                <FormControl fullWidth variant="standard">
                  <TextField
                    value={place}
                    onChange={(e) => handlePlaceChange("place", e.target.value)}
                    fullWidth
                    multiline
                    placeholder={t("add_warehouse_page.place_placeholders")}
                    rows={4}
                    InputLabelProps={{ shrink: false }}
                    InputProps={{
                      sx: styles.textArea,
                    }}
                    sx={styles.inputState}
                    disabled={action === "delete"}
                    error={checkString(place)}
                  />
                </FormControl>
              </div>
            </div>
            {/* <Switcher status/> */}
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center">
              <LabelField label={t("warehouse_page.status")} />
              <Switcher
                onText={t("add_warehouse_page.open")}
                offText={t("add_warehouse_page.close")}
                disabled={action === "delete"}
                defaultValue={status}
                setState={(newValue) => {
                  setStatus(newValue);
                }}
              />
            </div>
            {/* Recyle category */}
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px]">
              <LabelField
                label={t("add_warehouse_page.recyclable_subcategories")}
                mandatory={true}
              />
              {itemCategories.map((item, index) => (
                <ItemCategoryRow
                  key={index}
                  item={item}
                  index={index}
                  itemCategories={itemCategories}
                  setItemCategories={setItemCategories}
                  recycTypes={recycleTypeDataArray}
                  productTypes={productTypeDataArray}
                  setHasErrors={setHasErrors}
                  validation={validation}
                  isTriedSubmitted={trySubmited}
                  disabled={action === "delete"}
                />
              ))}
            </div>
            {/* Workshop flag */}
            {role === "collector" && (
              <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center">
                <LabelField label={t("add_warehouse_page.workshopFlag")} />
                <Switcher
                  onText={t("add_warehouse_page.yes")}
                  offText={t("add_warehouse_page.no")}
                  disabled={action === "delete"}
                  defaultValue={workshopFlg}
                  setState={(newValue) => {
                    setWorkshopFlg(newValue);
                  }}
                />
              </div>
            )}
            {/* error msg */}
            {validation.length > 0 && trySubmited && (
              <Grid item className="pt-3 w-full">
                {errorMsgList?.map((item, index) => (
                  <div className="bg-[#F7BCC6] text-red p-2 rounded-xl mb-2">
                    <FormHelperText error={true}>{item}</FormHelperText>
                  </div>
                ))}
              </Grid>
            )}
          </div>
          <DeleteModal
            open={openWHDeleteModal}
            onClose={() => setOpenWHDeleteModal(false)}
            onDelete={handleDeleteWH}
            deleteText={onDeleteWarehouseMsg}
          />
          <DeleteModal
            open={openWHCloseModal}
            onClose={() => setOpenWHCloseModal(false)}
            onDelete={handleCloseWH}
            deleteText={t("add_warehouse_page.warningCloseWarehouse")}
          />
        </div>
      </RightOverlayForm>
    </div>
  );
};

let styles = {
  textField: {
    borderRadius: "10px",
    fontWeight: "500",
    "& .MuiOutlinedInput-input": {
      padding: "15px 0px 15px 15px",
      margin: 0,
    },
  },
  textArea: {
    borderRadius: "10px",
    fontWeight: "500",
    "& .MuiOutlinedInput-input": {
      padding: 0,
      margin: 0,
    },
  },
  inputState: {
    "& .MuiOutlinedInput-root": {
      margin: 0,
      "&:not(.Mui-disabled):hover fieldset": {
        borderColor: "#79CA25",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#79CA25",
      },
    },
  },
  dropDown: {
    "& .MuiOutlinedInput-root-MuiSelect-root": {
      borderRadius: "10px",
    },
  },
  modal: {
    position: "absolute",
    top: "50%",
    width: "34%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    height: "fit-content",
    padding: 4,
    backgroundColor: "white",
    border: "none",
    borderRadius: 5,

    "@media (max-width: 768px)": {
      width: "70%" /* Adjust the width for mobile devices */,
    },
  },
};

export default AddWarehouse;
