import { useEffect, useState } from 'react'
import {
  ProductAddon,
  ProductSubType,
  Products
} from '../../interfaces/productType'
import { il_item, itemList } from '../FormComponents/CustomItemList'
import CustomItemListRecyble from '../FormComponents/CustomItemListRecyble'
import { Collapse } from '@mui/material'
import CustomField from '../FormComponents/CustomField'
import { useTranslation } from 'react-i18next'
import CustomTextField from '../FormComponents/CustomTextField'

export type singleProduct = {
  productTypeId: string
  productSubTypeId: string
  productAddonId: string
  productSubTypeRemark: string
  productAddonTypeRemark: string
  isProductSubTypeOthers?: boolean
  isProductAddonTypeOthers?: boolean
}

type productAddonItem = {
  productAddon: il_item
  isProductAddonTypeOthers?: boolean
  productAddonTypeRemark: string
}

type productSubTypeItem = {
  productSubType: il_item
  productSubTypeRemark?: string
  isProductSubTypeOthers?: boolean
  productAddon: productAddonItem[]
}

export type productItem = {
  productType: il_item
  productSubType: productSubTypeItem[]
}

type productAddonVal = {
  productAddonId: string
  isProductAddonTypeOthers: boolean
  productAddonTypeRemark: string
}

type productSubTypeVal = {
  productSubTypeId: string
  productSubTypeRemark: string
  isProductSubTypeOthers: boolean
  productAddon: productAddonVal[]
}

export type productsVal = {
  productTypeId: string
  productSubType: productSubTypeVal[]
}

export type remarkVal = {
  id: string
  value: string
}

type props = {
  showError?: boolean
  showErrorSubtype?: boolean
  showErrorAddon?: boolean
  options: Products[]
  defaultProduct?: productItem[]
  setState: (s: productsVal[]) => void
  dataTestId?: string
  itemColor?: itemList
}

export default function ProductListMultiSelect({
  showError,
  showErrorSubtype,
  showErrorAddon,
  options,
  defaultProduct,
  setState
}: props) {
  const { t, i18n } = useTranslation()
  //current product
  const [currProductType, setCurrProductType] = useState<string>('')
  const [currSubProductType, setCurrSubProductType] = useState<string>('')
  const [currAddonType, setCurrAddonType] = useState<string>(' ')

  //choosen product
  const [productType, setProductType] = useState<string[]>([])
  const [productSubType, setProductSubType] = useState<string[]>([])
  const [productAddon, setProductAddon] = useState<string[]>([])

  //choosen product
  const [choosenProductSubType, setChoosenSubProductType] =
    useState<ProductSubType | null>(null)
  const [choosenProductAddon, setChoosenProductAddon] =
    useState<ProductAddon | null>(null)

  //product with no child
  const [productWithNoSubItems, setProductWithNoSubItems] = useState<string[]>(
    []
  )
  const [subProductWithNoAddonItems, setSubProductWithNoAddonItems] = useState<
    string[]
  >([])

  //remarks
  // const [currSubRemark, setCurrSubRemark] = useState<string>('')
  // const [currAddonRemark, setCurrAddonRemark] = useState<string>('')
  const [subTypeRemarkData, setSubTypeRemarkData] = useState<
    remarkVal[] | null
  >([])
  const [addonTypeRemarkData, setAddonRemarkData] = useState<
    remarkVal[] | null
  >([])

  useEffect(() => {
    const subTypeData: remarkVal[] = []
    const addonData: remarkVal[] = []

    options.forEach((item) => {
      item.productSubType?.forEach((sub) => {
        subTypeData.push({
          id: sub.productSubTypeId,
          value: sub.remark || ''
        })

        sub.productAddonType?.forEach((addon) => {
          addonData.push({
            id: addon.productAddonTypeId,
            value: addon.remark || ''
          })
        })
      })
    })

    setSubTypeRemarkData(subTypeData)
    setAddonRemarkData(addonData)
  }, [])

  useEffect(() => {
    if (defaultProduct) {
      const types = product_getProducts(defaultProduct)
      const subTypes = product_getSubtype(defaultProduct)
      const addons = product_getAddon(defaultProduct)

      setProductType(types)
      setProductSubType(subTypes)
      setProductAddon(addons)
      //set remarks

      setSubTypeRemarkData((prev) => updateSubtypeRemarks(defaultProduct, prev))

      // Update addon remarks
      setAddonRemarkData((prev) => updateAddonRemarks(defaultProduct, prev))

      setCurrProductType(types.at(-1)!!)
      let tempCurrProduct = types.at(-1)!!
      selectSubProduct(subTypes, tempCurrProduct)
      selectAddon(addons, tempCurrProduct, subTypes.at(-1))

      setState(toProduct())
    }
  }, [])

  useEffect(() => {
    setState(toProduct())
  }, [
    productType,
    productSubType,
    productAddon,
    options,
    subTypeRemarkData,
    addonTypeRemarkData
  ])

  useEffect(() => {
    const productTypes = returnProductTypes()
    //set product with no sub item
    const noSubItems = productTypes
      .filter((item) => item.productSubType.length === 0)
      .map((item) => item.productType.id)
    setProductWithNoSubItems(noSubItems)

    //set sub-product with no add-on
    const subTypeIdsWithNoAddons = productTypes.flatMap((item) =>
      item.productSubType
        .filter((sub) => sub.productAddon.length === 0)
        .map((sub) => sub.productSubType.id)
    )

    setSubProductWithNoAddonItems(subTypeIdsWithNoAddons)
  }, [options, i18n.language])

  const toProduct = () => {
    var productS: productsVal[] = []
    productType.map((prod) => {
      const prodType = options.find((p) => p.productTypeId === prod)

      if (
        prodType &&
        prodType?.productSubType &&
        prodType?.productSubType?.length > 0
      ) {
        const subIdList = returnSubTypesId(prod)
        const filteredSubTypes = productSubType.filter((sub) =>
          subIdList.includes(sub)
        )

        let subTypeItems: productSubTypeVal[] = []

        subTypeItems = filteredSubTypes
          .map((subTypeId) => {
            const subTypeData = prodType.productSubType?.find(
              (sub) => sub.productSubTypeId === subTypeId
            )

            if (subTypeData) {
              // Retrieve associated addons
              const addonIdList = subTypeData.productAddonType?.map(
                (item) => item.productAddonTypeId
              )
              const filteredAddons = productAddon.filter((addonId) =>
                addonIdList?.includes(addonId)
              )

              const addonItems: productAddonVal[] = filteredAddons.map(
                (addonId) => {
                  const addonData = subTypeData.productAddonType?.find(
                    (addon) => addon.productAddonTypeId === addonId
                  )

                  return {
                    productAddonId: addonId,
                    isProductAddonTypeOthers:
                      addonData?.productNameEng === 'Others',
                    productAddonTypeRemark:
                      addonTypeRemarkData?.find((addon) => addon.id === addonId)
                        ?.value || '-'
                  }
                }
              )

              return {
                productSubTypeId: subTypeId,
                productSubTypeRemark: subTypeRemarkData?.find(
                  (sub) => sub.id === subTypeId
                )?.value,
                isProductSubTypeOthers: subTypeData.productNameEng === 'Others',
                productAddon: addonItems
              }
            }

            return undefined
          })
          .filter((item): item is productSubTypeVal => !!item)
        productS.push({ productTypeId: prod, productSubType: subTypeItems })
      } else {
        productS.push({ productTypeId: prod, productSubType: [] })
      }
    })

    console.log('productslalal', productS)
    return productS
  }

  const updateSubtypeRemarks = (
    defaultProduct: any[],
    prev: remarkVal[] | null
  ): remarkVal[] => {
    const updatedRemarks = [...(prev || [])]

    defaultProduct.forEach((product) => {
      product.productSubType.forEach((subType: productSubTypeItem) => {
        const existingRemarkIndex = updatedRemarks.findIndex(
          (remark) => remark.id === subType.productSubType.id
        )

        if (existingRemarkIndex > -1) {
          updatedRemarks[existingRemarkIndex] = {
            ...updatedRemarks[existingRemarkIndex],
            value: subType.productSubTypeRemark || ''
          }
        } else {
          updatedRemarks.push({
            id: subType.productSubType.id,
            value: subType.productSubTypeRemark || ''
          })
        }
      })
    })

    return updatedRemarks
  }

  // Function to update addon remarks
  const updateAddonRemarks = (
    defaultProduct: any[],
    prev: remarkVal[] | null
  ): remarkVal[] => {
    const updatedAddons = [...(prev || [])]

    defaultProduct.forEach((product) => {
      product.productSubType.forEach((subType: productSubTypeItem) => {
        subType.productAddon?.forEach((addon: productAddonItem) => {
          const existingAddonIndex = updatedAddons.findIndex(
            (remark) => remark.id === addon.productAddon.id
          )

          if (existingAddonIndex > -1) {
            // Update existing addon remark
            updatedAddons[existingAddonIndex] = {
              ...updatedAddons[existingAddonIndex],
              value: addon.productAddonTypeRemark || ''
            }
          } else {
            // Add new addon remark
            updatedAddons.push({
              id: addon.productAddon.id,
              value: addon.productAddonTypeRemark || ''
            })
          }
        })
      })
    })

    return updatedAddons
  }

  const returnProductTypes = () => {
    const products: productItem[] = []

    options.map((data) => {
      let dataItem: productItem = {
        productType: { name: '', id: '' },
        productSubType: []
      }
      let subItem: productSubTypeItem[] = []
      let name = ''
      name =
        i18n.language === 'enus'
          ? data.productNameEng
          : i18n.language === 'zhch'
          ? data.productNameSchi
          : data.productNameTchi

      dataItem.productType = { name: name, id: data.productTypeId }

      data.productSubType?.map((sub) => {
        let subName = ''
        subName =
          i18n.language === 'enus'
            ? sub.productNameEng
            : i18n.language === 'zhch'
            ? sub.productNameSchi
            : sub.productNameTchi

        const productAddonItems = sub.productAddonType?.map((addon) => {
          let nameAddon = ''
          nameAddon =
            i18n.language === 'enus'
              ? addon.productNameEng
              : i18n.language === 'zhch'
              ? addon.productNameSchi
              : addon.productNameTchi

          return {
            productAddon: { name: nameAddon, id: addon.productAddonTypeId },
            isProductAddonTypeOthers: addon.remark ? true : false,
            productAddonTypeRemark: addon.remark
          }
        })

        subItem.push({
          productSubType: { name: subName, id: sub.productSubTypeId },
          productAddon: productAddonItems || []
        })
      })

      dataItem.productSubType = subItem

      products.push(dataItem)
    })
    return products
  }

  const returnProducts = (productS: productItem[]) => {
    const productList: il_item[] = productS.map((product) => {
      return product.productType
    })

    return productList
  }

  const returnSubTypesId = (id: string) => {
    var subTypesId: string[] = []
    const re = returnProductTypes().find((prod) => {
      return prod.productType.id == id
    })
    if (re) {
      re.productSubType.map((sub) => {
        subTypesId.push(sub.productSubType.id)
      })
    }
    return subTypesId
  }

  const returnAddonTypesId = (prodId: string, subProdId: string) => {
    var addonTypesId: string[] = []
    const re = returnProductTypes().find((prod) => {
      return prod.productType.id == prodId
    })
    if (re) {
      const subItem = re.productSubType.find(
        (sub) => sub.productSubType.id === subProdId
      )
      if (subItem) {
        subItem.productAddon.map((add_on) =>
          addonTypesId.push(add_on.productAddon.id)
        )
      }
    }
    return addonTypesId
  }

  const selectProduct = (str: string[]) => {
    //do select and unselect action for main item
    if (productType.length < str.length) {
      //selecting new item
      setProductType(str)
    } else if (productType.length > str.length) {
      //unselecting an item
      const removeProduct = productType.find((prod) => {
        return !str.includes(prod)
      })
      if (removeProduct) {
        const subId = returnSubTypesId(removeProduct)
        const subList = productSubType.filter((sub) => {
          return !subId.includes(sub)
        })
        setProductSubType(subList)
      }
      setProductType(str)
    }
  }

  const returnWithSubItem = () => {
    var withSubItem: string[] = []
    productType.map((prod) => {
      const subId = returnSubTypesId(prod)
      subId.map((sub) => {
        const addonIds = returnAddonTypesId(prod, sub)
        if (addonIds.length === 0) {
          if (productSubType.includes(sub)) {
            withSubItem.push(prod)
          }
        } else {
          addonIds.map((addonIds) => {
            if (productAddon.includes(addonIds)) {
              withSubItem.push(prod)
            }
          })
        }
      })
    })
    return withSubItem
  }

  const product_getProducts = (productS: productItem[]) => {
    const productType: string[] = productS.map((prod) => {
      return prod.productType.id
    })

    return productType
  }

  const product_getSubtype = (productS: productItem[]) => {
    var subTypes: string[] = []
    productS.map((prod) => {
      prod.productSubType.map((sub) => {
        subTypes.push(sub.productSubType.id)
      })
    })

    return subTypes
  }

  const product_getAddon = (productS: productItem[]) => {
    var addonTypes: string[] = []
    productS.map((prod) => {
      prod.productSubType.map((sub) => {
        sub.productAddon.map((addon) => {
          addonTypes.push(addon.productAddon.id)
        })
      })
    })

    return addonTypes
  }

  const returnSubProduct = (productId: string) => {
    const selectedProductId = productId
      ? productId
      : productType[productType.length - 1] || ''

    const item = returnProductTypes().find(
      (productType) => productType.productType.id === selectedProductId
    )
    return item ? item.productSubType.map((it) => it.productSubType) : []
  }

  const returnAddonList = (subProductId: string) => {
    const selectedProductId = currProductType
      ? currProductType
      : productType[productType.length - 1] || ''

    const item = returnProductTypes().find(
      (productType) => productType.productType.id === selectedProductId
    )

    const selectedSubId = subProductId
      ? subProductId
      : productSubType[productSubType.length - 1] || ''

    if (item) {
      const subItem = item.productSubType.find(
        (sub) => sub.productSubType.id === selectedSubId
      )

      return subItem ? subItem.productAddon.map((it) => it.productAddon) : []
    }

    return []
  }

  const getNameFromProductId = (id: string) => {
    const productType = options.find((prod) => {
      return prod.productTypeId == id
    })
    if (productType) {
      return i18n.language === 'enus'
        ? productType.productNameEng
        : i18n.language === 'zhch'
        ? productType.productNameSchi
        : productType.productNameTchi
    }
    return ''
  }

  const getNameFromSubId = (subId: string) => {
    const productType = options.find((prod) => {
      return prod.productTypeId == currProductType
    })
    if (productType) {
      const subProductType = productType.productSubType?.find(
        (sub) => sub.productSubTypeId === subId
      )

      if (subProductType) {
        return i18n.language === 'enus'
          ? subProductType.productNameEng
          : i18n.language === 'zhch'
          ? subProductType.productNameSchi
          : subProductType.productNameEng
      }
    }
    return ''
  }

  const selectSubProduct = (
    selectedSubType: string[],
    tempCurrProduct?: string
  ) => {
    const lastSubId = selectedSubType[selectedSubType.length - 1] || ''
    const currProduct = options.find(
      (item) =>
        item.productTypeId ===
        (currProductType ? currProductType : tempCurrProduct)
    )

    if (currProduct && lastSubId) {
      const subItem = currProduct.productSubType?.find(
        (item) => item.productSubTypeId === lastSubId
      )
      if (subItem) {
        setChoosenSubProductType(subItem)
      }
    }

    setProductSubType(selectedSubType)
    setCurrAddonType('')
  }

  const selectAddon = (
    selectedAddOn: string[],
    tempCurrProduct?: string,
    tempSubProduct?: string
  ) => {
    const lastAddonId = selectedAddOn[selectedAddOn.length - 1] || ''
    const currProduct = options.find(
      (item) =>
        item.productTypeId ===
        (currProductType ? currProductType : tempCurrProduct)
    )

    if (currProduct) {
      const subItem = currProduct.productSubType?.find(
        (item) =>
          item.productSubTypeId ===
          (choosenProductSubType?.productSubTypeId || tempSubProduct)
      )
      if (subItem) {
        const addOnItem = subItem.productAddonType?.find(
          (item) => item.productAddonTypeId === lastAddonId
        )

        if (addOnItem) setChoosenProductAddon(addOnItem)
      }
    }
    setProductAddon(selectedAddOn)
    setCurrAddonType('')
  }

  const onChangeAddonRemark = (value: string) => {
    if (choosenProductAddon) {
      setAddonRemarkData((prev) =>
        prev
          ? prev.map((addon) =>
              addon.id === choosenProductAddon?.productAddonTypeId
                ? { ...addon, value }
                : addon
            )
          : []
      )
    }
  }

  const onChangeSubRemark = (value: string) => {
    if (choosenProductSubType) {
      setSubTypeRemarkData(
        (prev) =>
          prev?.map((sub) =>
            sub.id === choosenProductSubType.productSubTypeId
              ? { ...sub, value }
              : sub
          ) || []
      )
    }
  }

  return (
    <>
      <CustomItemListRecyble
        items={returnProducts(returnProductTypes())}
        withSubItems={returnWithSubItem()}
        multiSelect={selectProduct}
        setLastSelect={(s: string) => setCurrProductType(s)}
        error={showError && productType.length == 0}
        defaultSelected={
          defaultProduct ? product_getProducts(defaultProduct) : []
        }
        noSubItems={productWithNoSubItems}
      />
      {currProductType != '' &&
        !productWithNoSubItems.includes(currProductType) && (
          <Collapse sx={{ mt: 1 }} in={productType.length > 0} unmountOnExit>
            <CustomField
              label={
                getNameFromProductId(currProductType) +
                ' - ' +
                t('pick_up_order.product_type.subtype')
              }
              mandatory
            >
              <CustomItemListRecyble
                items={returnSubProduct(currProductType)}
                multiSelect={selectSubProduct}
                setLastSelect={(s: string) => setCurrSubProductType(s)}
                defaultSelected={productSubType}
                error={
                  showErrorSubtype &&
                  !returnSubProduct(currProductType).some((it) =>
                    productSubType.includes(it.id)
                  )
                }
              />
            </CustomField>
            {choosenProductSubType?.productNameEng === 'Others' && (
              <CustomField
                label={
                  getNameFromProductId(currProductType) +
                  ' ' +
                  t('pick_up_order.product_type.subtype') +
                  ' ' +
                  t('general_settings.remark')
                }
                mandatory={false}
                style={{ my: '1rem' }}
              >
                <CustomTextField
                  id="subtype-remark"
                  placeholder={
                    getNameFromSubId(currSubProductType) +
                    ' ' +
                    t('pick_up_order.product_type.subtype') +
                    ' ' +
                    t('general_settings.remark')
                  }
                  onChange={(event) => {
                    onChangeSubRemark(event.target.value)
                  }}
                  value={
                    subTypeRemarkData?.find(
                      (sub) => sub.id === choosenProductSubType.productSubTypeId
                    )?.value
                  }
                />
              </CustomField>
            )}
          </Collapse>
        )}
      {returnAddonList(currSubProductType).length > 0 &&
        !subProductWithNoAddonItems.includes(currSubProductType) && (
          <Collapse sx={{ mt: 1 }} in={productSubType.length > 0} unmountOnExit>
            <CustomField
              label={
                getNameFromSubId(currSubProductType) +
                ' - ' +
                t('pick_up_order.product_type.add-on')
              }
              mandatory
            >
              <CustomItemListRecyble
                items={returnAddonList(currSubProductType)}
                multiSelect={selectAddon}
                setLastSelect={(s) => setCurrAddonType(s)}
                error={
                  showErrorAddon &&
                  !returnAddonList(currSubProductType).some((it) =>
                    productAddon.includes(it.id)
                  )
                }
                defaultSelected={productAddon}
              />
            </CustomField>
            {choosenProductAddon?.productNameEng === 'Others' && (
              <CustomField
                label={
                  getNameFromSubId(currSubProductType) +
                  ' ' +
                  t('pick_up_order.product_type.add-on') +
                  ' ' +
                  t('general_settings.remark')
                }
                mandatory={false}
                style={{ my: '1rem' }}
              >
                <CustomTextField
                  id="addon-remark"
                  placeholder={
                    getNameFromSubId(currSubProductType) +
                    ' ' +
                    t('pick_up_order.product_type.add-on') +
                    ' ' +
                    t('general_settings.remark')
                  }
                  onChange={(event) => {
                    onChangeAddonRemark(event.target.value)
                  }}
                  value={
                    addonTypeRemarkData?.find(
                      (item) =>
                        item.id === choosenProductAddon.productAddonTypeId
                    )?.value
                  }
                />
              </CustomField>
            )}
          </Collapse>
        )}
    </>
  )
}
