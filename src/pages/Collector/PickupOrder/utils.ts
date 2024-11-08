import { CreatePicoDetail } from 'src/interfaces/pickupOrder'
import { cloneData } from 'src/utils/utils'


export const refactorPickUpOrderDetail = (data: CreatePicoDetail[]) => {

  try {

    const result = cloneData(data)?.map((item: any) => {

      if (item?.productType) {
        
        if (item.productType?.productTypeId) {

          item['productTypeId'] = item.productType?.productTypeId
          item['productSubTypeId'] = item.productSubType?.productSubTypeId
          item['productAddonTypeId'] = item.productAddonType?.productAddonTypeId
          console.log("🚀 ~ file: utils.ts ~ line 18 ~ result ~ item", item)
          
          delete item.productAddonType
          
      
        }
        else {

          item['productTypeId'] = item.productType
          item['productSubTypeId'] = item.productSubType
          item['productAddonTypeId'] = item.productAddon

        }

        delete item.productType
        delete item.productSubType
        delete item.productAddon

        if(!item['productTypeId']){
          delete item.productTypeId
        }
        if(!item['productSubTypeId']){
          delete item.productSubTypeId
        }
        if(!item['productAddonTypeId']){
          delete item.productAddonTypeId
        }

      }
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
  const id = (row?.productAddonType?.productAddonTypeId || row?.productAddonTypeId || row?.productAddonType || row?.productAddon)

  const matchingProductAddon = matchingProductSubType?.productAddonType?.find((item: any) => item.productAddonTypeId === id)

  return matchingProductAddon
}