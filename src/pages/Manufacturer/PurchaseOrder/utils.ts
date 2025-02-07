import { manuList, recycType } from 'src/interfaces/common'
import { CreatePicoDetail } from 'src/interfaces/pickupOrder'
import { Products } from 'src/interfaces/productType'
import { CreatePurchaseOrderDetail, PurchaseOrderDetail } from 'src/interfaces/purchaseOrder'
import { cloneData, objectFilter } from 'src/utils/utils'
import i18n from "../../../setups/i18n";
import { Languages } from 'src/constants/constant'
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
          .required(t('pick_up_order.error.weight')),
          unitId: Yup.number()
          .typeError(`${t("purchase_order.create.unit")} ${t('form.error.shouldNotBeEmpty')}`) 
          .moreThan(0, `${t("purchase_order.create.unit")} ${t('form.error.shouldNotBeEmpty')}`)
          .required(`${t("purchase_order.create.unit")} ${t('form.error.shouldNotBeEmpty')}`),
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
              const item: any = productType && productType?.length > 0 && productType?.find((item: any) => item.productTypeId == value)
              const isValid = item?.productSubType?.length > 0
              return isValid
            },
            then: (schema) =>
              schema
                .required(t('pick_up_order.error.productSubType')),
          })
        ,
        productAddonType: Yup.string()
          .when(['productType', 'productSubType'], {
            is: (value: string, value2: string) => {
              const itemProductType: any = productType && productType?.length > 0 && productType?.find((item: any) => item.productTypeId == value)
              const itemSubProductType: any = itemProductType?.productSubType?.length > 0 && itemProductType?.productSubType?.find((item: any) => item.productSubTypeId == value2)
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
          .required(t('pick_up_order.error.weight')),
          unitId: Yup.number()
          .typeError(`${t("purchase_order.create.unit")} ${t('form.error.shouldNotBeEmpty')}`)
          .moreThan(0, `${t("purchase_order.create.unit")} ${t('form.error.shouldNotBeEmpty')}`)
          .required(`${t("purchase_order.create.unit")} ${t('form.error.shouldNotBeEmpty')}`),
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
        'productAddonNameEng',
        'productAddonNameSchi',
        'productAddonNameTchi',
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

export const getManufacturerBasedLang = (senderName: string, manuList: manuList[] | undefined) => {
  try {
    var manu = null;
    manu = manuList?.find(val => val?.manufacturerNameEng === senderName);
    if (manu === null || manu === undefined) {
      manu = manuList?.find(val => val?.manufacturerNameSchi === senderName);
    }

    if (manu === null || manu === undefined) {
      manu = manuList?.find(val => val?.manufacturerNameTchi === senderName);
    }

    if (manu === null || manu === undefined) {
      return senderName;
    }

    if (i18n.language === Languages.ENUS) {
      return manu?.manufacturerNameEng;
    } else if (i18n.language === Languages.ZHCH) {
      return manu?.manufacturerNameSchi;
    } else {
      return manu?.manufacturerNameTchi;
    }
  } catch(error) {
    console.log('errorManu', error);
    return senderName;
  }
};