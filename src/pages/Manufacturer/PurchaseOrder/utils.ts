import { recycType } from 'src/interfaces/common'
import { CreatePicoDetail } from 'src/interfaces/pickupOrder'
import { Products } from 'src/interfaces/productType'
import { CreatePurchaseOrderDetail, PurchaseOrderDetail } from 'src/interfaces/purchaseOrder'
import { cloneData, objectFilter } from 'src/utils/utils'
import * as Yup from 'yup'

export const ValidateSchemaCreateRecycleFormPurchaseOrder = ({
  // values,
  editRow,
  isRecyc,
  data,
  productType,
  recycType,
  t,
}: {
  // values: any,
  editRow: any,
  isRecyc: boolean,
  data: PurchaseOrderDetail[],
  productType: Products[],
  recycType: any,
  t: any,
}) => {

  try {


    let prevData = []
    if (editRow) {
      prevData = data.filter((item: PurchaseOrderDetail) => item.id != editRow.id)
    } else {
      prevData = data
    }

    if (isRecyc) {
      return Yup.object().shape({
        pickupAt: Yup.string()
          .required(t('pick_up_order.error.pickuAt'))
          .test(
            'invalid-date',
            t('pick_up_order.error.invalid_pickup_time'),
            function (value) {
              if (value !== 'Invalid Date') return true
              if (value === undefined) return true
              return false
            }
          ),
        receiverAddr: Yup.string()
          .required(t('purchase_order.missing_arrived'))
        ,
        recycTypeId: Yup.string()
          .typeError(t('pick_up_order.error.recycType'))
          .required(t('pick_up_order.error.recycType'))
        ,
        recycSubTypeId: Yup.string()
          .typeError(t('pick_up_order.error.recycSubType'))
          .when('recycTypeId', {
            is: (value: string) => {

              const item: any = recycType && recycType?.length > 0 && recycType?.find((item: any) => item.recycTypeId == value)

              const isValid = item?.recycSubType?.length > 0
              return isValid
            },
            then: (schema) =>
              schema
                .required(t('pick_up_order.error.recycSubType')),
          })
        ,
        weight: Yup.number()
          .moreThan(0, t('pick_up_order.error.weightGreaterThanZero'))
          .required(t('pick_up_order.error.weight'))
      })
    } else {
      return Yup.object().shape({
        pickupAt: Yup.string()
          .required(t('pick_up_order.error.pickuAt'))
          .test(
            'invalid-date',
            t('pick_up_order.error.invalid_pickup_time'),
            function (value) {
              if (value !== 'Invalid Date') return true
              if (value === undefined) return true
              return false
              // return value !== t('pick_up_order.error.invalid_date')
            }
          ),
        receiverAddr: Yup.string()
          .required(t('purchase_order.missing_arrived'))
        ,
        productType: Yup.string()
          .required(t('pick_up_order.error.productType'))
          .typeError(t('pick_up_order.error.productType'))
        ,
        productSubType: Yup.string()
          .typeError(t('pick_up_order.error.productSubType'))
          .when('productType', {
            is: (value: string) => {
              const item: any = productType && productType?.length > 0 && productType?.find((item: any) => item.productType == value)
              const isValid = item?.productSubType?.length > 0
              return isValid
            },
            then: (schema) =>
              schema
                .required(t('pick_up_order.error.productSubType')),
          })
        ,
        productAddon: Yup.string()
          .when(['productType', 'productSubType'], {
            is: (value: string, value2: string) => {
              const itemProductType: any = productType && productType?.length > 0 && productType?.find((item: any) => item.productType == value)
              const itemSubProductType: any = itemProductType?.productSubType?.length > 0 && itemProductType?.productSubType?.find((item: any) => item.productSubType == value2)
              const isValid = itemSubProductType?.productAddonType?.length > 0
              return isValid

            },
            then: (schema) =>
              schema
                .required(t('pick_up_order.error.productAddon')),
          })
        ,
        weight: Yup.number()
          .moreThan(0, t('pick_up_order.error.weightGreaterThanZero'))
          .required(t('pick_up_order.error.weight'))
      })
    }


  }
  catch (err) {

    return undefined

  }

}

export const getDataDetailPO = ({
  row,
  productType,
  recycType,
}: {
  row: PurchaseOrderDetail,
  productType: Products[],
  recycType: recycType[],
}) => {

  try {

    let result

    if (!(row?.productNameEng && row?.recyclableNameEng)) {

      // ==== Newly added row detail ====

      if (row?.productType && productType?.length > 0) { // => Check type

        result = productType?.find(item => item.productTypeId)

      }
      else {

      }

    }

    return result

  }
  catch (err) {

    return row

  }

}


export const refactorPurchaseOrderDetail = (data: PurchaseOrderDetail[]) => {

  try {

    const result = data?.map((item: PurchaseOrderDetail) => {

      return objectFilter(item, [
        'productAddOnNameEng',
        'productAddOnNameSchi',
        'productAddOnNameTchi',
        'productNameEng',
        'productNameSchi',
        'productNameTchi',
        'productSubNameEng',
        'productSubNameSchi',
        'productSubNameTchi',
        'recyclableNameEng',
        'recyclableNameSchi',
        'recyclableNameTchi',
        'recyclableSubNameEng',
        'recyclableSubNameSchi',
        'recyclableSubNameTchi',
        'unitNameEng',
        'unitNameSchi',
        'unitNameTchi',
        'itemCategory',
      ])

    })

    return result

  }
  catch (err) {
    return data
  }

}