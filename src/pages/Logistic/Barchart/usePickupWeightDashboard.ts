import { useEffect, useState } from "react";
import { useContainer } from "unstated-next";
import dayjs from "dayjs";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import i18n from "../../../setups/i18n";
import { Languages, STATUS_CODE } from "../../../constants/constant";
import { extractError, randomBackgroundColor } from "../../../utils/utils";
import {
  getDriverPickupWeight,
} from "../../../APICalls/Logistic/dashboard";
import { useNavigate } from "react-router-dom";
import { returnApiToken } from "../../../utils/utils";
import { getProductTypeList } from "../../../APICalls/ASTD/settings/productType";
import { Products } from "../../../interfaces/productType";
import { Vehicle } from "../../../interfaces/vehicles";
import { getAllVehicles } from "../../../APICalls/Logistic/vehicles";
interface Dataset {
  id: string;
  label: string;
  data: number[];
  backgroundColor: string;
}
interface categorys {
  id: string;
  label: string;
}
type VehiclesData = {
  plateNo: string;
  vehicleId: number;
};
const usePickupWeightDashboardWithIdRecycable = () => {
  const { recycType } = useContainer(CommonTypeContainer);
  const [labels, setLabels] = useState<string[]>([]);
  const [frmDate, setFrmDate] = useState<dayjs.Dayjs>(dayjs().startOf("month"));
  const [toDate, setToDate] = useState<dayjs.Dayjs>(dayjs());
  const [dataset, setDataSet] = useState<Dataset[]>([]);
  const { tenantId, decodeKeycloack } = returnApiToken();
  const [categoryList, setCategoryList] = useState<categorys[]>([]);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [categoryType, setCategoryType] = useState<string>("0");
  const [vehicleId, setVehicleId] = useState<string>("");
  const [plateNo, setPlateNo] = useState<string>("");
  const [productType, setProductType] = useState<Products[]>([]);
  const [vehicleList, setVehicleList] = useState<VehiclesData[]>([]);
  const navigate = useNavigate();
  const initVehicleData = async () => {
    const result = await getAllVehicles(0, 1000);
    const data = result?.data.content;
    if (data && data.length > 0) {
      const vehicles: VehiclesData[] = [];
      data.map((item: Vehicle) => {
        if (item?.plateNo)
          vehicles.push({
            plateNo: item.plateNo,
            vehicleId: item.vehicleId
          });
      });
      setVehicleId(String(vehicles[0].vehicleId));
      setPlateNo(String(vehicles[0].plateNo));
      setVehicleList(vehicles);
    }
  };
  useEffect(() => {
    initVehicleData();
  }, []);
  const getLabel = (type: string): string => {
    let languages: string = "";
    if (i18n.language === Languages.ENUS) {
      const recyclables = recycType?.find(
        (item) => item.recyclableNameEng === type
      );
      if (recyclables) languages = recyclables?.recyclableNameEng;
    } else if (i18n.language === Languages.ZHCH) {
      const recyclables = recycType?.find(
        (item) => item.recyclableNameEng === type
      );
      if (recyclables) languages = recyclables?.recyclableNameSchi;
    } else {
      const recyclables = recycType?.find(
        (item) => item.recyclableNameEng === type
      );
      if (recyclables) languages = recyclables?.recyclableNameTchi;
    }
    return languages;
  };
  const getLabelByProduct = (type: string): string => {
    let languages: string = "";
    if (i18n.language === Languages.ENUS) {
      const productlables = productType?.find(
        (item) => item.productNameEng === type
      );
      if (productlables) languages = productlables?.productNameEng;
    } else if (i18n.language === Languages.ZHCH) {
      const productlables = productType?.find(
        (item) => item.productNameEng === type
      );
      if (productlables) languages = productlables?.productNameSchi;
    } else {
      const productlables = productType?.find(
        (item) => item.productNameEng === type
      );
      if (productlables) languages = productlables?.productNameTchi;
    }
    return languages;
  };
  useEffect(() => {
    if (categoryType === "0") {
      const changeLang = dataset.map((item) => {
        return {
          ...item,
          label: getLabel(item.id)
        };
      });
      setDataSet(changeLang);
    } else {
      const changeLang = dataset.map((item) => {
        return {
          ...item,
          label: getLabelByProduct(item.id)
        };
      });
      setDataSet(changeLang);
    }
    const categoryList = getCategoryList(categoryType);
    setCategoryList(categoryList);
  }, [i18n.language]);

  const getProductType = async () => {
    const response = await getProductTypeList();
    const data = response.data;
    if (data) {
      setProductType(data);
    }
  };
  useEffect(() => {
    getProductType();
  }, []);
  const getCategoryList = (cateType: string | "0") => {
    const categoryData: categorys[] = [];
    if (cateType === "0") {
      if (recycType) {
        for (let type of recycType) {
          categoryData.push({
            id: type.recycTypeId,
            label: getLabel(type.recyclableNameEng)
          });
        }
      }
    } else {
      if (productType) {
        for (let type of productType) {
          categoryData.push({
            id: type.productTypeId,
            label: getLabelByProduct(type.productNameEng)
          });
        }
      }
    }
    return categoryData;
  };

  useEffect(() => {
    getPickupWeightData([], categoryType, plateNo);
  }, [plateNo, categoryType, recycType, productType, frmDate, toDate]);

  const getPickupWeightData = async (
    idList: string[],
    cateType: string,
    plateNo: string
  ) => {
    try {
      if (!recycType) return;
      let ids: string[] = [];
      const categoryData = getCategoryList(cateType);
      if (categoryList.length === 0) {
        setCategoryList(categoryData);
      }
      if (idList.length === 0) {
        ids = getNewCategory(categoryData, [], "", "");
      } else {
        ids = idList;
      }
      const params = {
        fromDate: frmDate.format("YYYY-MM-DD"),
        toDate: toDate.format("YYYY-MM-DD"),
        plateNo: plateNo,
        recycTypes: cateType === "0" ? ids : [],
        productTypes: cateType === "1" ? ids : []
      };

      if (ids && plateNo) {
        const response = await getDriverPickupWeight(params);
        const getDataWeights = (type: string, length: number): number[] => {
          const weights: number[] = [];
          if (!response) return weights;
          const recyclables: any = Object.values(response.data);

          for (let index = 0; index < length; index++) {
            const data: any = recyclables[index];
            if (data[type]) {
              weights.push(Number(data[type]?.weight) ?? 0);
            } else {
              
              weights.push(0);
            }
          }

          return weights;
        };

        if (response) {
          const labels: string[] = Object.keys(response.data);
          const datasets: Dataset[] = [];
          const cateList =
            ids.length > 0 ? ids : getNewCategory(categoryData, [], "", "");
          if (!recycType || !productType) return;
          if (cateType === "0") {
            const recycTypeList = getNewCategory(
              cateList,
              recycType,
              "newCategory",
              cateType
            );

            for (let type of recycTypeList) {
              datasets.push({
                id: type.recyclableNameEng,
                label: getLabel(type.recyclableNameEng),
                data: getDataWeights(type.recycTypeId, labels.length),
                backgroundColor: type?.backgroundColor
                  ? type?.backgroundColor
                  : randomBackgroundColor()
              });
            }
          } else {
            const productList = getNewCategory(
              cateList,
              productType,
              "newCategory",
              cateType
            );
            for (let type of productList) {
              datasets.push({
                id: type.productNameEng,
                label: getLabelByProduct(type.productNameEng),
                data: getDataWeights(type.productTypeId, labels.length),
                backgroundColor: randomBackgroundColor()
              });
            }
          }

          setLabels(labels);
          setDataSet(datasets);
        }
      }
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      }
    }
  };
  const onMultipleCategoryChange = (value: string[] | []) => {
    const categoryList = getCategoryList(categoryType);
    const ids: string[] = getNewCategory(categoryList, value, "ids", "");
    // setCategoryIds(ids);
    getPickupWeightData(ids, categoryType, plateNo);
  };
  const onCategoryChange = (value: string | "") => {
    setCategoryType(value);
    setCategoryList(getCategoryList(value));
  };
  const onVehicleNumberChange = (value: string | "") => {
    setVehicleId(value);
    const vehiclePlateNo = vehicleList.find(val => String(val?.vehicleId) === value)?.plateNo
    setPlateNo(vehiclePlateNo!);
  };

  const getNewCategory = (
    arr1: any[],
    arr2: any[] | [],
    type: string | "",
    cateType: string | "0"
  ) => {
    if (type === "ids") {
      const newItem: string[] = [];
      arr1.forEach((item1) => {
        arr2.forEach((item2) => {
          if (item1.label === item2) {
            newItem.push(item1.id);
          }
        });
      });
      return newItem;
    } else if (type === "newCategory") {
      const newItem: any[] = [];
      arr1.forEach((item1) => {
        arr2.forEach((item2) => {
          if (cateType === "0") {
            if (item1 === item2.recycTypeId) {
              newItem.push(item2);
            }
          } else {
            if (item1 === item2.productTypeId) {
              newItem.push(item2);
            }
          }
        });
      });
      return newItem;
    } else {
      const newItem: any[] = [];
      arr1.forEach((item1) => {
        newItem.push(item1.id);
      });
      return newItem;
    }
  };
  return {
    setFrmDatePick: setFrmDate,
    setToDatePick: setToDate,
    onMultipleCategoryChangePick: onMultipleCategoryChange,
    onCategoryChangePick: onCategoryChange,
    onVehicleNumberChangePick: onVehicleNumberChange,
    frmDatePick: frmDate,
    toDatePick: toDate,
    labelsPick: labels,
    datasetPick: dataset,
    vehicleListPick: vehicleList,
    categoryListPick: categoryList
  };
};

export default usePickupWeightDashboardWithIdRecycable;
