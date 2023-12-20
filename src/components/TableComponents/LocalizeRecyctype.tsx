import React from "react";
import { il_item } from "../FormComponents/CustomItemList";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import { useContainer } from "unstated-next";
import i18n from "../../setups/i18n";

type recycItem = {
  recycType: string;
  recycSubtype: string;
};

const LocalizeRecyctype = (data: any) => {
  const { recycType } = useContainer(CommonTypeContainer);
  if (data && data.length > 0) {
    const recycItems: recycItem[] = [];

    data.forEach((detail: any) => {
      const matchingRecycType = recycType?.find(
        (recyc) => detail.item.recycType === recyc.recycTypeId
      );

      if (matchingRecycType) {
        const matchRecycSubType = matchingRecycType.recycSubtype?.find(
          (subtype) => subtype.recycSubtypeId === detail.item.recycSubType
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
            subName = matchRecycSubType?.recyclableNameEng ?? "";
            break;
          case "zhch":
            subName = matchRecycSubType?.recyclableNameSchi ?? "";
            break;
          case "zhhk":
            subName = matchRecycSubType?.recyclableNameTchi ?? "";
            break;
          default:
            subName = matchRecycSubType?.recyclableNameTchi ?? ""; //default fallback language is zhhk
            break;
        }
        recycItems.push({
          recycType: name,
          recycSubtype: subName,
        });
      }
    });

    return recycItems; // Return the recycItems array
  }

  return null; // Return null if data is empty or not provided
};

export default LocalizeRecyctype;
