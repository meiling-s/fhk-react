import { CreatePicoDetail } from 'src/interfaces/pickupOrder'

type Props = {}

export const refactorPickUpOrderDetail = (data: CreatePicoDetail[]) => {

  try {

    console.log("🚀 ~ file: CreatePickupOrder.tsx ~ line 59 ~ refactorPickUpOrderDetail ~ data", data)

    const result = data?.map((item: any) => {

      item['productTypeId'] = item.productType
      item['productSubTypeId'] = item.productSubType
      item['productAddonTypeId'] = item.productAddon
      delete item.productType
      delete item.productSubType
      delete item.productAddon
      return item

    })

    return result

  }
  catch (err) {

    return data

  }

}

const usePickupOrder = ({ }: Props) => {



}

export default usePickupOrder