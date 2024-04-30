import { Formik, useFormik } from 'formik'
import PickupOrderCreateForm from '../../../components/FormComponents/PickupOrderCreateForm'
import { createPickUpOrder, editPickupOrder } from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import {
  CreatePO,
  CreatePicoDetail,
  EditPo,
  PickupOrder
} from '../../../interfaces/pickupOrder'
import { useNavigate, useLocation } from 'react-router'
import { useState, useEffect } from 'react'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { returnApiToken, showErrorToast } from '../../../utils/utils'
import { Status, localStorgeKeyName } from '../../../constants/constant'
import { PurChaseOrder, PurchaseOrderDetail } from '../../../interfaces/purchaseOrder'
import { updateStatusPurchaseOrder } from '../../../APICalls/Manufacturer/purchaseOrder'
import dayjs from 'dayjs'

const CreatePickupOrder = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const poInfo: PurChaseOrder = state
  const [addRow, setAddRow] = useState<CreatePicoDetail[]>([])
  const { t } = useTranslation()
  const [picoTypeValue, setPicoType] = useState<string>('AD_HOC')
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
    effFrmDate: Yup.string().required(t('pick_up_order.error.effFrmDate')),
    effToDate: Yup.string().required(t('pick_up_order.error.effToDate')),
    routineType:
      picoTypeValue == 'ROUTINE'
        ? Yup.string().required(t('pick_up_order.error.routineType'))
        : Yup.string(),

    routine: Yup.lazy((value, schema) => {
      const routineType = schema.parent.routineType
      if (routineType === 'specificDate') {
        return Yup.array()
          .required(t('pick_up_order.error.routine'))
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
  const createPickupOrder = useFormik({
    initialValues: {
      tenantId: getTenantId(),
      picoType: picoTypeValue,
      effFrmDate: currentDate,
      effToDate: currentDate,
      routineType: 'daily',
      routine: [],
      logisticId: '',
      logisticName: '',
      vehicleTypeId: '',
      platNo: '',
      contactNo: '',
      status: Status.CREATED,
      reason: '',
      normalFlg: true,
      contractNo: '',
      createdBy: loginId,
      updatedBy: loginId,
      createPicoDetail: []
    },
    validationSchema: validateSchema,
    onSubmit: async (values: CreatePO) => {
      values.createPicoDetail = addRow
      const result = await createPickUpOrder(values)
      const data = result?.data
      if (data) {
        const updatePoStatus = {
          status: Status.CONFIRMED,
          updatedBy: loginId,
          picoId: data?.picoId,
        }
        const approve = await updateStatusPurchaseOrder(poInfo.poId, updatePoStatus)
        if(approve){
          const routeName = role
          navigate(`/${routeName}/purchaseOrder`, { state: 'created' })
        }
      } else {
        showErrorToast('fail to create pickup order')
      }
    }
  })
  
  useEffect(() => {
    setPicoType(createPickupOrder.values.picoType)
  }, [createPickupOrder.values.picoType])

  const setPickupOrderDetail = ()   => {
    const picoDetails: CreatePicoDetail[] = poInfo?.purchaseOrderDetail?.map((item) => ({
        id: item?.poDtlId, 
        picoHisId: '',
        senderId: '',
        senderName: poInfo.senderName,
        senderAddr: '',
        senderAddrGps: [0],
        receiverId: '',
        receiverName: poInfo.receiverName,
        receiverAddr: poInfo?.receiverAddr ?? '',
        receiverAddrGps: [0],
        status: Status.CREATED,
        createdBy: item?.createdBy ?? '',
        updatedBy: item?.updatedBy ?? '',
        pickupAt: dayjs(item?.pickupAt).format('hh:mm:ss') ?? '',
        recycType: item?.recycTypeId ?? '',
        recycSubType: item?.recycSubTypeId ?? '',
        weight: item.weight
      })) || []

    setAddRow(picoDetails)
    return picoDetails
  }
  
  useEffect(() => {
    if (poInfo) {
      const createPicoDetail: CreatePicoDetail[] = setPickupOrderDetail()

      createPickupOrder.setValues({
        tenantId: getTenantId(),
        picoType: picoTypeValue,
        effFrmDate: currentDate,
        effToDate: currentDate,
        routineType: 'daily',
        routine: [],
        logisticId: '',
        logisticName: '',
        vehicleTypeId: '',
        platNo: '',
        contactNo: poInfo?.contactNo,
        status: Status.CREATED,
        reason: '',
        normalFlg: true,
        contractNo: '',
        createdBy: loginId,
        updatedBy: loginId,
        createPicoDetail: []
      })
    }
  }, [poInfo])

  return (
    <PickupOrderCreateForm
      formik={createPickupOrder}
      title={t('pick_up_order.create_pick_up_order')}
      setState={setAddRow}
      state={addRow}
      editMode={true}
    />
  )
}

export default CreatePickupOrder
