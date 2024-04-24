import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CreatePicoDetail,
  EditPo,
  PickupOrder,
  PickupOrderDetail
} from '../../../interfaces/pickupOrder'
import PurchaseOrderCreateForm from '../../../components/FormComponents/PurchaseOrderCreateForm'
import { useFormik } from 'formik'
import {
  editPickupOrder,
  getAllPickUpOrder
} from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import { useContainer } from 'unstated-next'
import { useTranslation } from 'react-i18next'
import { Status, localStorgeKeyName } from '../../../constants/constant'
import { returnApiToken, showErrorToast } from '../../../utils/utils'
import * as Yup from 'yup'
import { PurChaseOrder, PurchaseOrderDetail } from '../../../interfaces/purchaseOrder'

const EditPurchaseOrder = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [addRow, setAddRow] = useState<PurchaseOrderDetail[]>([])
  const poInfo: PurChaseOrder = state
  const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
  const role = localStorage.getItem(localStorgeKeyName.role)

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
  
  function getTenantId() {
    const tenantId = returnApiToken().decodeKeycloack.substring(
      'company'.length
    )

    return tenantId
  }
  const currentDate = new Date().toISOString()
  const updatePickupOrder = useFormik({
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
    validationSchema: validateSchema,
    onSubmit: async (values: PurChaseOrder) => {
      values.purchaseOrderDetail = addRow
      // const result = await editPickupOrder(poInfo.picoId, values)

      // const data = result?.data
      // if (data) {
      //   //navigate('/collector/PickupOrder', { state: 'updated' })
      //   const routeName = role
      //   navigate(`/${routeName}/PickupOrder`, { state: 'updated' })
      // } else {
      //   showErrorToast('fail to create pickup order')
      // }
    }
  })

  const setPickupOrderDetail = () => {
    const picoDetails: PurchaseOrderDetail[] =
      poInfo?.purchaseOrderDetail?.map((item) => ({
        // id: item.picoDtlId,
        // picoHisId: item.picoHisId,
        // senderId: item.senderId,
        // senderName: item.senderName,
        // senderAddr: item.senderAddr,
        // senderAddrGps: item.senderAddrGps,
        // receiverId: item.receiverId,
        // receiverName: item.receiverName,
        // receiverAddr: item.receiverAddr,
        // receiverAddrGps: item.receiverAddrGps,
        // status: item.status,
        // createdBy: item.createdBy,
        // updatedBy: item.updatedBy,
        // pickupAt: item.pickupAt,
        // recycType: item.recycType,
        // recycSubType: item.recycSubType,
        // weight: item.weight
        id: item.id,
        poDtlId: item.poDtlId,
        recycTypeId: item.recycTypeId,
        recyclableNameTchi: item.recyclableNameTchi,
        recyclableNameSchi: item.recyclableNameSchi,
        recyclableNameEng: item.recyclableNameEng,
        recycSubTypeId: item.recycSubTypeId,
        recyclableSubNameTchi: item.recyclableSubNameTchi,
        recyclableSubNameSchi: item.recyclableSubNameSchi,
        recyclableSubNameEng: item.recyclableSubNameEng,
        unitId: item.unitId,
        unitNameTchi: item.unitNameTchi,
        unitNameSchi: item.unitNameSchi,
        unitNameEng: item.unitNameEng,
        weight: item.weight,
        createdBy: item.createdBy,
        updatedBy: loginId,
        pickupAt: item.pickupAt,
        receiverAddr: item.receiverAddr,
      })) || []

    setAddRow(picoDetails)
    return picoDetails
  }

  useEffect(() => {
    if (poInfo) {
      //console.log('selectedPo:', poInfo)
      const createPicoDetail: PurchaseOrderDetail[] = setPickupOrderDetail()

      updatePickupOrder.setValues({
        // tenantId: poInfo.tenantId,
        // picoType: poInfo.picoType,
        // effFrmDate: poInfo.effFrmDate,
        // effToDate: poInfo.effToDate,
        // routineType: poInfo.routineType,
        // routine: poInfo.routine,
        // logisticId: poInfo.logisticId,
        // logisticName: poInfo.logisticName,
        // vehicleTypeId: poInfo.vehicleTypeId,
        // platNo: poInfo.platNo,
        // contactNo: poInfo.contactNo,
        // status: 'CREATED',
        // reason: poInfo.reason,
        // normalFlg: true,
        // approvedAt: '2023-12-12T02:17:30.062Z',
        // rejectedAt: '2023-12-12T02:17:30.062Z',
        // approvedBy: loginId,
        // rejectedBy: loginId,
        // contractNo: poInfo.contractNo,
        // updatedBy: loginId,
        // refPicoId: poInfo.refPicoId,
        // createPicoDetail: []
        poId: poInfo.poId,
        picoId: poInfo.picoId,
        cusTenantId: poInfo.cusTenantId,
        receiverAddr: poInfo.receiverAddr,
        receiverAddrGps: poInfo.receiverAddrGps,
        sellerTenantId: poInfo.sellerTenantId,
        senderAddr: poInfo.senderAddr,
        senderAddrGps: poInfo.senderAddrGps,
        senderName: poInfo.senderName,
        receiverName: poInfo.receiverName,
        contactName: poInfo.contactName,
        contactNo: poInfo.contactNo,
        paymentType: poInfo.paymentType,
        status: Status.CREATED,
        approvedAt: poInfo.approvedAt,
        rejectedAt: poInfo.rejectedAt,
        approvedBy: poInfo.approvedBy,
        rejectedBy: poInfo.rejectedBy,
        createdBy: loginId,
        updatedBy: loginId,
        createdAt: currentDate,
        updatedAt: currentDate,
        purchaseOrderDetail: []
      })
    }
  }, [poInfo])

  return (
    <PurchaseOrderCreateForm
      selectedPo={poInfo}
      title={t('pick_up_order.edit_pick_up_order')}
      formik={updatePickupOrder}
      setState={setAddRow}
      state={addRow}
      editMode={true}
    />
  )
}

export default EditPurchaseOrder
