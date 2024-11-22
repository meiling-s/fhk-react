import React, { useEffect, useState } from 'react'
import { Box, Typography, Button, Collapse } from '@mui/material'
import { getThemeCustomList } from '../../utils/utils'
import { localStorgeKeyName } from '../../constants/constant'
import {
  ProductAddon,
  ProductSubType,
  Products
} from '../../interfaces/productType'
import CustomItemList, { il_item } from '../FormComponents/CustomItemList'
import { useTranslation } from 'react-i18next'
import CustomField from '../FormComponents/CustomField'
import CustomTextField from '../FormComponents/CustomTextField'
import ConfirmModal from './ConfirmationModal'

export type itemList = {
  bgColor: string
  borderColor: string
}

export type singleProduct = {
  productTypeId: string
  productSubTypeId: string
  productAddonId: string
  productSubTypeRemark: string
  productAddOnTypeRemark: string
  isProductSubTypeOthers?: boolean
  isProductAddonTypeOthers?: boolean
}

interface ProductListSingleSelectProps {
  label: string
  options: Products[]
  setState: (s: singleProduct) => void
  dataTestId?: string
  itemColor?: itemList
  showError?: boolean
  defaultProduct?: singleProduct
}

type productItem = {
  productType: il_item
  productSubType: il_item[]
  productAddon: il_item[]
}

const ProductListSingleSelect: React.FC<ProductListSingleSelectProps> = ({
  options,
  setState,
  dataTestId,
  itemColor,
  showError,
  defaultProduct
}) => {
  const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'
  const [curProduct, setCurProduct] = useState<string>(' ')
  const [curSubProduct, setCurSubProduct] = useState<string>(' ')
  const [curAddonProduct, setCurAddonProduct] = useState<string>(' ')
  const [productType, setProductType] = useState<string>('')
  const [productSubType, setProductSubType] = useState<string>('')
  const [productAddon, setProductAddon] = useState<string>('')
  const [choosenProductType, setChoosenProductType] = useState<Products | null>(null)

  const [choosenProductSubType, setChoosenSubProductType] = useState<ProductSubType | null>(null)
  const [choosenProductAddon, setChoosenProductAddon] = useState<ProductAddon | null>(null)

  const [productSubTypeRemark, setProductSubTypeRemark] = useState<string>('')
  const [productAddOnTypeRemark, setProductAddonRemark] = useState<string>('')
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (curProduct !== null) {
      const filteredProduct = options.filter(
        (value) => value.productTypeId === curProduct
      ) as Products[]
      if (filteredProduct.length > 0) {
        setChoosenProductType(filteredProduct[0])
      }
      if (curSubProduct !== null && filteredProduct.length > 0) {
        const filteredSubProduct = filteredProduct[0]?.productSubType?.filter(
          (value) => value.productSubTypeId === curSubProduct
        )
        if (filteredSubProduct !== undefined && filteredSubProduct.length > 0) {
          setChoosenSubProductType(filteredSubProduct[0])
        }
        if (
          curAddonProduct !== null &&
          filteredSubProduct !== undefined &&
          filteredSubProduct.length > 0
        ) {
          const filteredAddon = filteredSubProduct[0]?.productAddonType?.filter(
            (value) => value.productAddonTypeId === curAddonProduct
          )
          if (filteredAddon !== undefined && filteredAddon.length > 0) {
            setChoosenProductAddon(filteredAddon[0])
          }
        }
      }
    }
  }, [curProduct, curSubProduct, curAddonProduct])

  useEffect(() => {
    if (defaultProduct) {
      setCurProduct(defaultProduct.productTypeId)
      setProductType(defaultProduct.productTypeId)
      setCurSubProduct(defaultProduct.productSubTypeId)
      setProductSubType(defaultProduct.productSubTypeId)
      setProductSubTypeRemark(defaultProduct.productSubTypeRemark)
      setCurAddonProduct(defaultProduct.productAddonId)
      setProductAddon(defaultProduct.productAddonId)
      setProductAddonRemark(defaultProduct.productAddOnTypeRemark)
    }
  }, [defaultProduct])

  useEffect(() => {
    setState(toSingleProduct())
  }, [productType, productSubType, productAddon, productSubTypeRemark, productAddOnTypeRemark, choosenProductAddon, choosenProductSubType])

  const returnProductTypes = () => {
    const products: productItem[] = []

    options.map((data) => {
      let dataItem: productItem = {
        productType: { name: '', id: '' },
        productSubType: [],
        productAddon: []
      }
      let subItem: il_item[] = []
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
        subItem.push({ name: subName, id: sub.productSubTypeId })
      })
      dataItem.productSubType = subItem

      products.push(dataItem)
    })
    return products
  }

  const toSingleProduct = () => {
    const singleProduct: singleProduct = {
      productTypeId: productType,
      productSubTypeId: productSubType,
      productAddonId: productAddon,
      productSubTypeRemark: productSubTypeRemark,
      productAddOnTypeRemark: productAddOnTypeRemark,
      isProductSubTypeOthers: choosenProductSubType?.productNameEng === 'Others',
      isProductAddonTypeOthers: choosenProductAddon?.productNameEng === 'Others',
    }

    return singleProduct
  }
  const getNameFromProductId = (id: string) => {
    const product = options.find((data) => {
      return data.productTypeId === id
    })
    if (product) {
      switch (i18n.language) {
        case 'enus':
          return product.productNameEng
        case 'zhch':
          return product.productNameSchi
        case 'zhhk':
          return product.productNameTchi
        default:
          return product.productNameTchi
      }
    }
    return ''
  }

  const getNameFromProductSubId = (id: string) => {
    if (choosenProductSubType !== null) {
      switch (i18n.language) {
        case 'enus':
          return choosenProductSubType.productNameEng
        case 'zhch':
          return choosenProductSubType.productNameSchi
        case 'zhhk':
          return choosenProductSubType.productNameTchi
        default:
          return choosenProductSubType.productNameTchi
      }
    }
    return ''
  }

  const getNameFromProductAddon = (id: string) => {
    if (choosenProductAddon !== null) {
      switch (i18n.language) {
        case 'enus':
          return choosenProductAddon.productNameEng
        case 'zhch':
          return choosenProductAddon.productNameSchi
        case 'zhhk':
          return choosenProductAddon.productNameTchi
        default:
          return choosenProductAddon.productNameTchi
      }
    }
  }

  const returnProducts = (productData: productItem[]) => {
    return productData.map((data) => data.productType)
  }

  const returnSubProducts = (productId: string) => {
    const item = returnProductTypes().find(
      (productType) => productType.productType.id === productId
    )
    return item ? item.productSubType : []
  }

  const returnAddon = (productId: string) => {
    const subItem: il_item[] = []
    choosenProductSubType?.productAddonType?.map((data) => {
      let subName = ''
      switch (i18n.language) {
        case 'enus':
          subName = data.productNameEng
          break
        case 'zhch':
          subName = data.productNameSchi
          break
        case 'zhhk':
          subName = data.productNameTchi
          break
        default:
          subName = data.productNameTchi
          break
      }
      subItem.push({ name: subName, id: data.productAddonTypeId })
    })
    return subItem
  }

  return (
    <Box>
      <CustomItemList
        items={returnProducts(returnProductTypes())}
        singleSelect={(s) => {
          setProductType(s)
          setProductSubType('')
          setProductAddon('')
        }}
        itemColor={itemColor || null}
        setLastSelect={setCurProduct}
        error={showError && productType.length === 0}
        defaultSelected={defaultProduct ? defaultProduct.productTypeId : []}
      />
      <Collapse
        sx={{ mt: 1 }}
        in={
          curProduct !== ' ' &&
          productType.length > 0 &&
          choosenProductType?.productSubType !== undefined &&
          choosenProductType?.productSubType?.length > 0
        }
        unmountOnExit
      >
        <CustomField
          label={
            curProduct === ' '
              ? ''
              : getNameFromProductId(curProduct) +
                ' ' +
                t('pick_up_order.product_type.subtype')
          }
          key={productType}
          mandatory={true}
        >
          <CustomItemList
            items={returnSubProducts(curProduct)}
            singleSelect={(s) => {
              setProductSubType(s)
              setProductAddon('')
            }}
            defaultSelected={productSubType}
            itemColor={itemColor || null}
            setLastSelect={setCurSubProduct}
            dataTestId="astd-create-edit-pickup-order-form-product-subtype-select-button-5078"
          />
        </CustomField>
        {choosenProductSubType?.productNameEng === 'Others' && (
          <CustomField
            label={
              getNameFromProductSubId(curSubProduct) +
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
                getNameFromProductSubId(curSubProduct) +
                ' ' +
                t('pick_up_order.product_type.subtype') +
                ' ' +
                t('general_settings.remark')
              }
              onChange={(event) => setProductSubTypeRemark(event.target.value)}
              value={productSubTypeRemark}
              dataTestId="astd-create-edit-pickup-order-product-subtype-remark"
            />
          </CustomField>
        )}
      </Collapse>
      <Collapse
        sx={{ mt: 1 }}
        in={
          curSubProduct !== ' ' &&
          productSubType.length > 0 &&
          choosenProductSubType?.productAddonType !== undefined &&
          choosenProductSubType?.productAddonType?.length > 0
        }
        unmountOnExit
      >
        <CustomField
          label={
            choosenProductSubType === null
              ? ''
              : getNameFromProductSubId(curSubProduct) +
                ' ' +
                t('pick_up_order.product_type.add-on')
          }
          key={productSubType}
          mandatory={true}
        >
          <CustomItemList
            items={returnAddon(curSubProduct)}
            singleSelect={setProductAddon}
            defaultSelected={productAddon}
            itemColor={itemColor || null}
            setLastSelect={setCurAddonProduct}
            dataTestId="astd-create-edit-pickup-order-form-product-add-on-select-button-5872"
          />
        </CustomField>
        {choosenProductAddon?.productNameEng === 'Others' && (
          <CustomField
            label={
              getNameFromProductSubId(curAddonProduct) +
              ' ' +
              t('pick_up_order.product_type.add-on') +
              ' ' +
              t('general_settings.remark')
            }
            mandatory={false}
            style={{ mt: '1rem', mb: '0.5rem' }}
          >
            <CustomTextField
              id="addon-remark"
              placeholder={
                getNameFromProductAddon(curAddonProduct) +
                ' ' +
                t('pick_up_order.product_type.add-on') +
                ' ' +
                t('general_settings.remark')
              }
              onChange={(event) => setProductAddonRemark(event.target.value)}
              value={productAddOnTypeRemark}
              dataTestId='astd-create-edit-pickup-order-product-addon-remark'
            />
          </CustomField>
        )}
      </Collapse>
    </Box>
  )
}

export default ProductListSingleSelect
