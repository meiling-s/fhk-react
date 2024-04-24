import { Formik, useFormik } from 'formik'
import PurchaseOrderCreateForm from '../../../components/FormComponents/PurchaseOrderCreateForm'
import { createPickUpOrder } from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import {
  PurChaseOrder,
  PurchaseOrderDetail,
} from '../../../interfaces/purchaseOrder'
import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { returnApiToken, showErrorToast } from '../../../utils/utils'
import { Status, localStorgeKeyName } from '../../../constants/constant'
import { postPurchaseOrder } from '../../../APICalls/Manufacturer/purchaseOrder'

const CreatePurchaseOrder = () => {
  const navigate = useNavigate()
  const [addRow, setAddRow] = useState<PurchaseOrderDetail[]>([])
  const { t } = useTranslation()
  const [picoTypeValue, setPicoType] = useState<string>('ROUTINE')
  const role = localStorage.getItem(localStorgeKeyName.role)
  const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
  function getTenantId() {
    const tenantId = returnApiToken().decodeKeycloack.substring(
      'company'.length
    )

    return tenantId
  }

  const getErrorMsg = (field: string, type: string) => {
    switch (type) {
      case 'empty':
        return field + ' ' + t('form.error.shouldNotBeEmpty')
      case 'atLeastOnePicoExist':
        return field + ' ' + t('form.error.atLeastOnePicoExist')
      case 'isInWrongFormat':
        return field + ' ' + t('form.error.isInWrongFormat')
    }
  }

  const validateSchema = Yup.object().shape({
    effFrmDate: Yup.string().required('This effFrmDate is required'),
    effToDate: Yup.string().required('This effToDate is required'),
    routineType:
      picoTypeValue == 'ROUTINE'
        ? Yup.string().required('This routineType is required')
        : Yup.string(),

    routine: Yup.lazy((value, schema) => {
      const routineType = schema.parent.routineType
      if (routineType === 'specificDate') {
        return Yup.array()
          .required('routine is required')
          .test(
            'is-in-range',
            t('pick_up_order.out_of_date_range'),
            function (value) {
              const { effFrmDate, effToDate } = schema.parent
              const fromDate = new Date(effFrmDate)
              const toDate = new Date(effToDate)

              const datesInDateObjects = value.map((date) => new Date(date))

              return datesInDateObjects.every(
                (date) => date >= fromDate && date <= toDate
              )
            }
          )
      } else {
        return Yup.array().required('routine is required')
      }
    }),
    logisticName: Yup.string().required(
      getErrorMsg(t('pick_up_order.choose_logistic'), 'empty')
    ),
    vehicleTypeId: Yup.string().required(
      getErrorMsg(t('pick_up_order.vehicle_category'), 'empty')
    ),
    platNo: Yup.string().required(
      getErrorMsg(t('pick_up_order.plat_number'), 'empty')
    ),
    contactNo: Yup.number().required(
      getErrorMsg(t('pick_up_order.contact_number'), 'empty')
    ),
    contractNo:
      picoTypeValue == 'ROUTINE'
        ? Yup.string().required(
            getErrorMsg(t('pick_up_order.routine.contract_number'), 'empty')
          )
        : Yup.string(),
    reason:
      picoTypeValue == 'AD_HOC'
        ? Yup.string().required(
            getErrorMsg(
              t('pick_up_order.adhoc.reason_get_off'),
              'isInWrongFormat'
            )
          )
        : Yup.string(),
    createPicoDetail: Yup.array()
      .required(getErrorMsg(t('pick_up_order.recyle_loc_info'), 'empty'))
      .test(
        'has-rows',
        getErrorMsg(t('pick_up_order.recyle_loc_info'), 'empty')!!,
        (value) => {
          return value.length > 0 || addRow.length > 0
        }
      )
  })
  

  const currentDate = new Date().toISOString()
  const createPurchaseOrder = useFormik({
    initialValues: {
      poId: '',
      picoId: '',
      cusTenantId: '',
      receiverAddr: '',
      receiverAddrGps: [0],
      sellerTenantId: getTenantId(),
      senderAddr: '',
      senderAddrGps: [0],
      senderName: '',
      receiverName: '',
      contactName: '',
      contactNo: '',
      paymentType: '',
      status: Status.CREATED,
      approvedAt: '',
      rejectedAt: '',
      approvedBy: '',
      rejectedBy: '',
      createdBy: loginId,
      updatedBy: loginId,
      createdAt: currentDate,
      updatedAt: currentDate,
      purchaseOrderDetail: []
    },
    // validationSchema: validateSchema,
    onSubmit: async (values: PurChaseOrder) => {
      console.log('purchase_order', values)
      values.purchaseOrderDetail = addRow
      const result = await postPurchaseOrder(values)
      const data = result?.data
      console.log('result', result)
      // if (data) {
      //   //console.log('all pickup order: ', data)
      //   const routeName = role
      //   navigate(`/${routeName}/purchaseOrder`, { state: 'created' })
      //   //navigate('/collector/PickupOrder', { state: 'created' })
      // } else {
      //   showErrorToast('fail to create pickup order')
      // }
    }
  })

  // useEffect(() => {
  //   setPicoType(createPickupOrder.values.picoType)
  // }, [createPickupOrder.values.picoType])

  return (
    <PurchaseOrderCreateForm
      formik={createPurchaseOrder}
      title={t('purchase_order.create.create_order')}
      setState={setAddRow}
      state={addRow}
      editMode={false}
    />
  )
}

export default CreatePurchaseOrder
