import React, { useEffect, useState } from 'react'
import { localStorgeKeyName } from '../../constants/constant'
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
import { add } from 'date-fns'
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

type productItem = {
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

type props = {
  showError?: boolean
  options: Products[]
  defaultProduct?: productItem[]
  setState: (s: productsVal[]) => void
  dataTestId?: string
  itemColor?: itemList
}

export default function ProductListMultiSelect({
  showError,
  options,
  defaultProduct,
  setState,
  dataTestId,
  itemColor
}: props) {
  const [curProduct, setCurProduct] = useState<string>('')
  const [curSubProduct, setCurSubProduct] = useState<string>('')
  const [curAddonProduct, setCurAddonProduct] = useState<string>(' ')

  const [productType, setProductType] = useState<string[]>([])
  const [productSubType, setProductSubType] = useState<string[]>([])
  const [productAddon, setProductAddon] = useState<string[]>([])

  const [choosenProductType, setChoosenProductType] = useState<Products | null>(
    null
  )
  const [choosenProductSubType, setChoosenSubProductType] =
    useState<ProductSubType | null>(null)
  const [choosenProductAddon, setChoosenProductAddon] =
    useState<ProductAddon | null>(null)

  const [productWithNoSubItems, setProductWithNoSubItems] = useState<string[]>(
    []
  )
  const [subProductWithNoAddonItems, setSubProductWithNoAddonItems] = useState<
    string[]
  >([])

  const [productSubTypeRemark, setProductSubTypeRemark] = useState<string>('')
  const [productAddonTypeRemark, setProductAddonRemark] = useState<string>('')
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (defaultProduct) {
      setProductType(productList_getProductType(defaultProduct))
      setProductSubType(recyclables_getSubTypes(defaultProduct))
      setProductAddon(recyclables_getAddon(defaultProduct))
    }
  }, [])

  useEffect(() => {
    setState(toRecyclables())
  }, [productType, productSubType, productAddon, options])

  useEffect(() => {
    const productTypes = returnProductTypes()

    //set product with no sub item
    const noSubItems = productTypes
      .filter((item) => item.productSubType.length === 0)
      .map((item) => item.productType.id)
    setProductWithNoSubItems(noSubItems)

    console.log('productTypes', productTypes)
    //set sub-product with no add-on
    const subTypeIdsWithNoAddons = productTypes.flatMap((item) =>
      item.productSubType
        .filter((sub) => sub.productAddon.length === 0)
        .map((sub) => sub.productSubType.id)
    )

    setSubProductWithNoAddonItems(subTypeIdsWithNoAddons)
  }, [options, i18n.language])

  const toRecyclables = () => {
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
                    productAddonTypeRemark: addonData?.remark || ''
                  }
                }
              )

              return {
                productSubTypeId: subTypeId,
                productSubTypeRemark: subTypeData.remark || '',
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
      switch (i18n.language) {
        case 'enus':
          name = data.productNameEng
          break
        case 'zhch':
          name = data.productNameSchi
          break
        case 'zhhk':
          name = data.productNameTchi
          break
        default:
          name = data.productNameTchi
          break
      }
      dataItem.productType = { name: name, id: data.productTypeId }

      data.productSubType?.map((sub) => {
        let subName = ''
        switch (i18n.language) {
          case 'enus':
            subName = sub.productNameEng
            break
          case 'zhch':
            subName = sub.productNameSchi
            break
          case 'zhhk':
            subName = sub.productNameTchi
            break
          default:
            subName = sub.productNameTchi
            break
        }

        const productAddonItems = sub.productAddonType?.map((addon) => {
          let nameAddon = ''
          switch (i18n.language) {
            case 'enus':
              nameAddon = addon.productNameEng
              break
            case 'zhch':
              nameAddon = addon.productNameSchi
              break
            case 'zhhk':
              nameAddon = addon.productNameTchi
              break
            default:
              nameAddon = addon.productNameTchi
              break
          }

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
    //transforming recyclables to string array with main items name only
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
        if (productSubType.includes(sub)) {
          withSubItem.push(prod)
        }
      })
    })
    return withSubItem
  }

  const productList_getProductType = (productS: productItem[]) => {
    const productType: string[] = productS.map((prod) => {
      return prod.productType.id
    })
    return productType
  }

  const recyclables_getSubTypes = (productS: productItem[]) => {
    var subTypes: string[] = []
    productS.map((prod) => {
      prod.productSubType.map((sub) => {
        subTypes.push(sub.productSubType.id)
      })
    })

    return subTypes
  }

  const recyclables_getAddon = (productS: productItem[]) => {
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
    const item = returnProductTypes().find(
      (productType) => productType.productType.id === productId
    )
    return item ? item.productSubType.map((it) => it.productSubType) : []
  }

  const returnAddonList = (subProductId: string) => {
    const item = returnProductTypes().find(
      (productType) => productType.productType.id === curProduct
    )

    if (item) {
      const subItem = item.productSubType.find(
        (sub) => sub.productSubType.id === subProductId
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
      switch (i18n.language) {
        case 'enus':
          return productType.productNameEng
        case 'zhch':
          return productType.productNameSchi
        case 'zhhk':
          return productType.productNameTchi
        default:
          return productType.productNameEng
      }
    }
    return ''
  }

  const getNameFromSubId = (subId: string) => {
    const productType = options.find((prod) => {
      return prod.productTypeId == curProduct
    })
    if (productType) {
      const subProductType = productType.productSubType?.find(
        (sub) => sub.productSubTypeId === subId
      )

      if (subProductType) {
        switch (i18n.language) {
          case 'enus':
            return subProductType.productNameEng
          case 'zhch':
            return subProductType.productNameSchi
          case 'zhhk':
            return subProductType.productNameTchi
          default:
            return subProductType.productNameEng
        }
      }
    }
    return ''
  }

  const selectSubProduct = (selectedSubType: string[]) => {
    setProductSubType(selectedSubType)
  }

  const selectAddon = (selectedSubType: string[]) => {
    setProductAddon(selectedSubType)
  }

  return (
    <>
      <CustomItemListRecyble
        items={returnProducts(returnProductTypes())}
        withSubItems={returnWithSubItem()}
        multiSelect={selectProduct}
        setLastSelect={setCurProduct}
        error={showError && productType.length == 0}
        defaultSelected={
          defaultProduct ? productList_getProductType(defaultProduct) : []
        }
        noSubItems={productWithNoSubItems}
      />
      {curProduct != ' ' && !productWithNoSubItems.includes(curProduct) && (
        <Collapse sx={{ mt: 1 }} in={productType.length > 0} unmountOnExit>
          <CustomField
            label={getNameFromProductId(curProduct) + t('col.category')}
            mandatory
          >
            <CustomItemListRecyble
              items={returnSubProduct(curProduct)}
              withSubItems={returnWithSubItem()}
              multiSelect={selectSubProduct}
              setLastSelect={setCurSubProduct}
              defaultSelected={productSubType}
              noSubItems={subProductWithNoAddonItems}
            />
          </CustomField>
          {choosenProductSubType?.productNameEng === 'Others' && (
            <CustomField
              label={
                getNameFromSubId(curSubProduct) +
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
                  getNameFromSubId(curSubProduct) +
                  ' ' +
                  t('pick_up_order.product_type.subtype') +
                  ' ' +
                  t('general_settings.remark')
                }
                onChange={(event) => {
                  setProductSubTypeRemark(event.target.value)
                  setChoosenProductAddon(null)
                }}
                value={productSubTypeRemark}
                dataTestId="astd-create-edit-pickup-order-product-subtype-remark"
              />
            </CustomField>
          )}
        </Collapse>
      )}
      {curSubProduct != ' ' &&
        !subProductWithNoAddonItems.includes(curSubProduct) && (
          <Collapse sx={{ mt: 1 }} in={productSubType.length > 0} unmountOnExit>
            <CustomField
              label={getNameFromSubId(curSubProduct) + t('col.category')}
              mandatory
            >
              <CustomItemListRecyble
                items={returnAddonList(curSubProduct)}
                multiSelect={selectAddon}
                defaultSelected={productAddon}
              />
            </CustomField>
          </Collapse>
        )}
    </>
  )
}
