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
  value: ''
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
  const [currSubRemark, setCurrSubRemark] = useState<string>('')
  const [currAddonRemark, setCurrAddonRemark] = useState<string>('')
  const [productSubTypeRemark, setProductSubTypeRemark] = useState<
    remarkVal[] | null
  >([])
  const [productAddonTypeRemark, setProductAddonRemark] = useState<
    remarkVal[] | null
  >([])

  useEffect(() => {
    if (defaultProduct) {
      const types = product_getProducts(defaultProduct)
      const subTypes = product_getSubtype(defaultProduct)
      const addons = product_getAddon(defaultProduct)

      setProductType(types)
      setProductSubType(subTypes)
      setProductAddon(addons)
      setState(toProduct())

      setCurrProductType(types.at(-1)!!)
      let tempCurrProduct = types.at(-1)!!
      selectSubProduct(subTypes, tempCurrProduct)
      selectAddon(addons, tempCurrProduct, subTypes.at(-1))
    }
  }, [])

  useEffect(() => {
    setState(toProduct())
  }, [
    productType,
    productSubType,
    productAddon,
    options,
    currSubRemark,
    currAddonRemark
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
              const addonIdList = returnAddonList(subTypeId).map((it) => it.id)
              const filteredAddons = productAddon.filter((addonId) =>
                addonIdList.includes(addonId)
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
                      addonData?.remark ||
                      productAddonTypeRemark?.find(
                        (addon) => addon.id === addonId
                      )?.value ||
                      ''
                  }
                }
              )

              return {
                productSubTypeId: subTypeId,
                productSubTypeRemark:
                  subTypeData.remark ||
                  productSubTypeRemark?.find(
                    (sub) => sub.id === subTypeId || ''
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
    return productS
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
      re.productSubType.map((sub) => {
        sub.productAddon.map((addOn) => {
          addonTypesId.push(addOn.productAddon.id)
        })
      })
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

  const onChangeSubRemark = (value: string) => {
    setCurrSubRemark(value)
    if (choosenProductSubType && value) {
      const newRemark = value
      setProductSubTypeRemark((prevRemarks: any) => {
        if (prevRemarks === null)
          return [
            {
              id: choosenProductSubType.productSubTypeId,
              value: newRemark
            }
          ]

        const updatedRemarks = prevRemarks.map((remark: any) =>
          remark.id === choosenProductSubType.remark
            ? { ...remark, value: newRemark }
            : remark
        )

        if (
          !updatedRemarks.some(
            (remark: any) =>
              remark.id === choosenProductSubType.productSubTypeId
          )
        ) {
          updatedRemarks.push({
            id: choosenProductSubType.productSubTypeId,
            value: newRemark
          })
        }

        return updatedRemarks
      })
    }
  }

  const onChangeAddonRemark = (value: string) => {
    if (choosenProductAddon && value) {
      const newRemark = value
      setProductSubTypeRemark((prevRemarks: any) => {
        if (prevRemarks === null)
          return [
            {
              id: choosenProductAddon.productAddonTypeId,
              value: newRemark
            }
          ]

        const updatedRemarks = prevRemarks.map((remark: any) =>
          remark.id === choosenProductAddon.remark
            ? { ...remark, value: newRemark }
            : remark
        )

        if (
          !updatedRemarks.some(
            (remark: any) =>
              remark.id === choosenProductAddon.productAddonTypeId
          )
        ) {
          updatedRemarks.push({
            id: choosenProductAddon.productAddonTypeId,
            value: newRemark
          })
        }

        console.log('remark', updatedRemarks)

        return updatedRemarks
      })
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
                  getNameFromSubId(currSubProductType) +
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
                  value={currSubRemark}
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
                    setCurrAddonRemark(event.target.value)
                    onChangeAddonRemark(event.target.value)
                  }}
                  value={currAddonRemark}
                />
              </CustomField>
            )}
          </Collapse>
        )}
    </>
  )
}
