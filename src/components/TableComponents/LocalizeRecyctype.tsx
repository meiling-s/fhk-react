import React from "react";
import { il_item } from "../FormComponents/CustomItemList";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import { useContainer } from "unstated-next";
import i18n from "../../setups/i18n";
import { PurchaseOrderDetail } from "src/interfaces/purchaseOrder";

export type productItem = {
  productTypeName: string,
  productSubTypeName: string,
  productAddonTypeName: string,
}
export type recycItem = {
  recycType: string,
  recycSubType: string,
}

export type itemType = {
  typeName: string;
  subTypeName: string;
  addonTypeName?: string; // => currently only type Product will use this addon
};

export const LocalizeProductType = ({ data }: {
  data: {
    productNameEng: string,
    productNameSchi: string,
    productNameTchi: string,
  }
}) => {

  switch (i18n.language) {
    case 'enus':
      return data?.productNameEng
    case 'zhch':
      return data?.productNameSchi
    case 'zhhk':
      return data?.productNameTchi
    default:
      return data?.productNameTchi
  }
}

export type TypeReturnLocalizeRecyctype = null | itemType[]

const LocalizeRecyctype = (data: any): TypeReturnLocalizeRecyctype => {

  const { recycType } = useContainer(CommonTypeContainer)

  if (data && data.length > 0) {

    const result: itemType[] = []

    data.forEach((detail: any) => {
      const matchingRecycType = recycType?.find(
        (recyc) => detail.recycType === recyc.recycTypeId
      );

      if (matchingRecycType) {
        const matchrecycSubType = matchingRecycType.recycSubType?.find(
          (subtype) => subtype.recycSubTypeId === detail.recycSubType
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
        result.push({
          typeName: name,
          subTypeName: subName,
        })
      }
      if (detail?.productType) {

        let name = LocalizeProductType({ data: detail?.productType })
        let subName = LocalizeProductType({ data: detail?.productSubType })
        let addonName = LocalizeProductType({ data: detail?.productAddonType })

        result.push({
          typeName: name,
          subTypeName: subName,
          addonTypeName: addonName,
        })

      }
    })


    return result; // Return the recycItems array

  }

  return null; // Return null if data is empty or not provided

}

export default LocalizeRecyctype;

export const LocalizeRecycleProductTypePO = ({ data }: { data: any }): undefined | itemType => {

  try {

    let result = {
      typeName: '',
      subTypeName: '',
      addonTypeName: '',
    }

    const isProductType = Boolean(data?.productType || data?.productTypeId || data?.productSubTypeId || data?.productAddonTypeId) // => if data type is Recyclable or Product

    switch (i18n.language) {

      case "enus": {

        if (isProductType) {

          result.typeName = data.productNameEng
          result.subTypeName = data.productSubNameEng
          result.addonTypeName = data.productAddOnNameEng

        }
        else {

          result.typeName = data.recyclableNameEng
          result.subTypeName = data.recyclableSubNameEng

        }

      } break

      case "zhch": {

        if (isProductType) {

          result.typeName = data.productNameSchi
          result.subTypeName = data.productSubNameSchi
          result.addonTypeName = data.productAddOnNameSchi

        }
        else {

          result.typeName = data.recyclableNameSchi
          result.subTypeName = data.recyclableSubNameSchi

        }


      } break

      case "zhhk":
      default: {

        if (isProductType) {

          result.typeName = data.productNameTchi
          result.subTypeName = data.productSubNameTchi
          result.addonTypeName = data.productAddOnNameTchi
        }

        else {

          result.typeName = data.recyclableNameTchi
          result.subTypeName = data.recyclableSubNameTchi

        }
      } break
    }

    return result

  }
  catch (err) {

  }

}
