import { productItem } from 'src/components/SpecializeComponents/ProductListMultiSelect'
import { singleProduct } from 'src/components/SpecializeComponents/ProductListSingleSelect'
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
        ? matchingProductType.productNameSchi
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
          ? matchingProductSubType.productNameSchi
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
            ? matchingProductAddon.productNameSchi
            : i18n.language === 'zhhk'
            ? matchingProductAddon.productNameTchi
            : matchingProductAddon.productNameEng
        return name
      }
    }
  }
  return '-'
}

export function transformData(
  data: singleProduct[],
  productType: Products[]
): productItem[] {
  // Group data by productTypeId
  const productMap = new Map<string, productItem>()

  data.forEach((item) => {
    const {
      productTypeId,
      productSubTypeId,
      productAddonId,
      productSubTypeRemark,
      productAddonTypeRemark,
      isProductSubTypeOthers,
      isProductAddonTypeOthers
    } = item

    // Find or create productType
    if (!productMap.has(productTypeId)) {
      const selectedProd = productType.find(
        (it) => it.productTypeId === productTypeId
      )

      const name =
        i18n.language === 'zhhk'
          ? selectedProd?.productNameTchi
          : i18n.language === 'zhch'
          ? selectedProd?.productNameSchi
          : selectedProd?.productNameEng

      productMap.set(productTypeId, {
        productType: { id: productTypeId, name: name || 'Unknown' },
        productSubType: []
      })
    }
    const product = productMap.get(productTypeId)!

    // Find or create productSubType
    let subType = product.productSubType.find(
      (st) => st.productSubType.id === productSubTypeId
    )

    if (!subType) {
      // Fetch the subtype name from the productType source
      const subTypeItem = productType
        .find((it) => it.productTypeId === productTypeId)
        ?.productSubType?.find(
          (sub) => sub.productSubTypeId === productSubTypeId
        )

      const subTypeName =
        i18n.language === 'zhhk'
          ? subTypeItem?.productNameTchi
          : i18n.language === 'zhch'
          ? subTypeItem?.productNameSchi
          : subTypeItem?.productNameEng

      subType = {
        productSubType: {
          id: productSubTypeId,
          name: subTypeName || '-'
        },
        productSubTypeRemark,
        isProductSubTypeOthers,
        productAddon: []
      }
      product.productSubType.push(subType)
    }

    // Add productAddon to productSubType
    if (productAddonId || productAddonTypeRemark) {
      // Fetch the addon name from the productType source
      const addonItem = productType
        .find((it) => it.productTypeId === productTypeId)
        ?.productSubType?.find(
          (sub) => sub.productSubTypeId === productSubTypeId
        )
        ?.productAddonType?.find(
          (addon) => addon.productAddonTypeId === productAddonId
        )

      const addonName =
        i18n.language === 'zhhk'
          ? addonItem?.productNameTchi
          : i18n.language === 'zhch'
          ? addonItem?.productNameSchi
          : addonItem?.productNameEng

      subType.productAddon.push({
        productAddon: { id: productAddonId, name: addonName || '-' },
        isProductAddonTypeOthers,
        productAddonTypeRemark
      })
    }
  })

  return Array.from(productMap.values())
}
