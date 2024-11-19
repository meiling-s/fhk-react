import { CreatePicoDetail } from 'src/interfaces/pickupOrder'
import { cloneData } from 'src/utils/utils'


const removeEmptyItem = ({ item, id }: { item: any, id: string }) => {
  if (item.hasOwnProperty(id) && !item[id]) {
    delete item[id]
  }
}

const arrStrictId = [
  'productTypeId',
  'productSubTypeId',
  'productAddonTypeId',
  'productSubTypeRemark',
  'productAddOnTypeRemark',
]


export const refactorPickUpOrderDetail = (data: CreatePicoDetail[]) => {

  try {

    const result = cloneData(data)?.map((item: any) => {

      if (item?.productType) {

        if (item.productType?.productTypeId) {

          item['productTypeId'] = item.productType?.productTypeId
          item['productSubTypeId'] = item.productSubType?.productSubTypeId
          item['productAddonTypeId'] = item.productAddonType?.productAddonTypeId

        }
        else {

          item['productTypeId'] = item.productType
          item['productSubTypeId'] = item.productSubType
          item['productAddonTypeId'] = item.productAddon

        }
        
      }

      // === Remove unused Front End Data ===

      delete item.productType
      delete item.productSubType
      delete item.productAddonType
      delete item.productAddon


      // === Remove empty data for Body API ===

      arrStrictId.forEach(i => {
        removeEmptyItem({ item, id: i })
      })
      
      return item

    })

    return result

  }
  catch (err) {

    return data

  }

}

export const getProductTypeFromDataRow = ({ row, dataProductType }: {
  row: any,
  dataProductType: any[],
}) => {
  const id = (row?.productType?.productTypeId || row?.productTypeId || row?.productType)
  const matchingProductType = Boolean(row?.productType) && dataProductType?.find((item) => item.productTypeId === id)

  return matchingProductType
}

export const getProductSubTypeFromDataRow = ({ row, dataProductType }: {
  row: any,
  dataProductType: any[],
}) => {
  const matchingProductType = getProductTypeFromDataRow({ row, dataProductType })
  const id = (row?.productSubType?.productSubTypeId || row?.productSubTypeId || row?.productSubType)
  const matchingProductSubType = matchingProductType?.productSubType?.find((item: any) => item.productSubTypeId === id)

  return matchingProductSubType
}

export const getProductAddonFromDataRow = ({ row, dataProductType }: {
  row: any,
  dataProductType: any[],
}) => {

  const matchingProductSubType = getProductSubTypeFromDataRow({ row, dataProductType })
  const id = (row?.productAddonType?.productAddonTypeId || row?.productAddonTypeId || row?.productAddonType || row?.productAddon || row?.productAddOnType)

  const matchingProductAddon = matchingProductSubType?.productAddonType?.find((item: any) => item.productAddonTypeId === id)

  return matchingProductAddon
}