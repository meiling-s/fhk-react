import { recycType } from 'src/interfaces/common'
import { Products } from 'src/interfaces/productType'
import i18n from 'src/setups/i18n'

export const mappingRecy = (
  typeId: string,
  recycTypeList: recycType[] | undefined
) => {
  const matchingRecycType = recycTypeList?.find(
    (item) => item.recycTypeId === typeId
  )
  if (matchingRecycType) {
    let name =
      i18n.language === 'enus'
        ? matchingRecycType.recyclableNameEng
        : i18n.language === 'zhch'
        ? matchingRecycType.recyclableNameSchi
        : i18n.language === 'zhhk'
        ? matchingRecycType.recyclableNameTchi
        : matchingRecycType.recyclableNameTchi
    return name
  }
  return '-'
}

export const mappingSubRecy = (
  recycTypeId: string,
  subTypeId: string,
  recycTypeList: recycType[] | undefined
) => {
  const matchingRecycType = recycTypeList?.find(
    (item) => item.recycTypeId === recycTypeId
  )
  if (matchingRecycType) {
    const matchrecycSubType = matchingRecycType.recycSubType?.find(
      (subtype: any) => subtype.recycSubTypeId === subTypeId
    )
    if (matchrecycSubType) {
      let name =
        i18n.language === 'enus'
          ? matchrecycSubType.recyclableNameEng
          : i18n.language === 'zhch'
          ? matchrecycSubType.recyclableNameSchi
          : i18n.language === 'zhhk'
          ? matchrecycSubType.recyclableNameTchi
          : matchrecycSubType.recyclableNameTchi
      return name
    }
  }
  return '-'
}

export const mappingProductType = (id: string, productType: Products[]) => {
  const matchingProductType = productType?.find(
    (item) => item.productTypeId === id
  )
  if (matchingProductType) {
    let name =
      i18n.language === 'enus'
        ? matchingProductType.productNameEng
        : i18n.language === 'zhch'
        ? matchingProductType.productNameTchi
        : i18n.language === 'zhhk'
        ? matchingProductType.productNameTchi
        : matchingProductType.productNameEng
    return name
  }
  return '-'
}

export const mappingSubProductType = (
  productTypeId: string,
  subId: string,
  productType: Products[]
) => {
  const matchingProductType = productType?.find(
    (item: any) => item.productTypeId === productTypeId
  )
  if (matchingProductType) {
    const matchingProductSubType = matchingProductType.productSubType?.find(
      (subtype: any) => subtype.productSubTypeId === subId
    )

    if (matchingProductSubType) {
      let name =
        i18n.language === 'enus'
          ? matchingProductSubType.productNameEng
          : i18n.language === 'zhch'
          ? matchingProductSubType.productNameTchi
          : i18n.language === 'zhhk'
          ? matchingProductSubType.productNameTchi
          : matchingProductSubType.productNameEng
      return name
    }
  }
  return '-'
}

export const mappingAddonsType = (
  productTypeId: string,
  productSubTypeId: string,
  addOnId: string,
  productType: Products[]
) => {
  const matchingProductType = productType?.find(
    (item: any) => item.productTypeId === productTypeId
  )
  if (matchingProductType) {
    const matchingProductSubType = matchingProductType.productSubType?.find(
      (subtype: any) => subtype.productSubTypeId === productSubTypeId
    )

    if (matchingProductSubType) {
      const matchingProductAddon =
        matchingProductSubType?.productAddonType?.find(
          (item: any) => item.productAddonTypeId === addOnId
        )

      if (matchingProductAddon) {
        let name =
          i18n.language === 'enus'
            ? matchingProductAddon.productNameEng
            : i18n.language === 'zhch'
            ? matchingProductAddon.productNameTchi
            : i18n.language === 'zhhk'
            ? matchingProductAddon.productNameTchi
            : matchingProductAddon.productNameEng
        return name
      }
    }
  }
  return '-'
}
