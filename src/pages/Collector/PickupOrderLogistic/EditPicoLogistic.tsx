import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CreatePicoDetail,
  EditPo,
  PickupOrder
} from '../../../interfaces/pickupOrder'
import PickupOrderFormLogistic from '../../../components/FormComponents/PickupOrderFormLogistic'
import { useFormik } from 'formik'
import { editPickupOrder } from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import { useTranslation } from 'react-i18next'
import { localStorgeKeyName } from '../../../constants/constant'
import { showErrorToast, showSuccessToast } from '../../../utils/utils'
import * as Yup from 'yup'

const EditPicoLogistic = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [addRow, setAddRow] = useState<CreatePicoDetail[]>([])
  const poInfo: PickupOrder = state
  const loginId = localStorage.getItem(localStorgeKeyName.username) || ''

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

              // Check if every date in the routine array falls within the specified range
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

  const updatePickupOrderLogistic = useFormik({
    initialValues: {
      tenantId: '',
      picoType: '',
      effFrmDate: '2023-12-12',
      effToDate: '2023-12-12',
      routineType: 'string',
      routine: ['string'],
      logisticId: 'string',
      logisticName: 'hello',
      vehicleTypeId: 'string',
      platNo: 'string',
      contactNo: 'string',
      status: 'CREATED',
      reason: 'string',
      normalFlg: true,
      approvedAt: '2023-12-12T02:17:30.062Z',
      rejectedAt: '2023-12-12T02:17:30.062Z',
      approvedBy: 'string',
      rejectedBy: 'string',
      contractNo: '',
      updatedBy: loginId,
      refPicoId: '',
      createPicoDetail: []
    },
    validationSchema: validateSchema,
    onSubmit: async (values: EditPo) => {
      // console.log(JSON.stringify(values, null, 2))
      values.createPicoDetail = addRow
      const result = await editPickupOrder(poInfo.picoId, values)
      console.log(JSON.stringify(result, null, 2))

      const data = result?.data
      if (data) {
        console.log('all pickup order: ', data)
        navigate('/logistic/pickupOrder', { state: 'updated' })
      } else {
        //alert('fail to edit pickup order')
        showErrorToast('fail to create pickup order')
      }
    }
  })

  const setPickupOrderDetail = () => {
    const picoDetails: CreatePicoDetail[] =
      poInfo?.pickupOrderDetail?.map((item) => ({
        id: item.picoDtlId,
        picoHisId: item.picoHisId,
        senderId: item.senderId,
        senderName: item.senderName,
        senderAddr: item.senderAddr,
        senderAddrGps: item.senderAddrGps,
        receiverId: item.receiverId,
        receiverName: item.receiverName,
        receiverAddr: item.receiverAddr,
        receiverAddrGps: item.receiverAddrGps,
        status: item.status,
        createdBy: item.createdBy,
        updatedBy: item.updatedBy,
        pickupAt: item.pickupAt,
        recycType: item.recycType,
        recycSubType: item.recycSubType,
        weight: item.weight
      })) || []

    setAddRow(picoDetails)
    return picoDetails
  }

  useEffect(() => {
    if (poInfo) {
      console.log('selectedPo:', poInfo)
      const createPicoDetail: CreatePicoDetail[] = setPickupOrderDetail()

      updatePickupOrderLogistic.setValues({
        tenantId: poInfo.tenantId,
        picoType: poInfo.picoType,
        effFrmDate: poInfo.effFrmDate,
        effToDate: poInfo.effToDate,
        routineType: poInfo.routineType,
        routine: poInfo.routine,
        logisticId: poInfo.logisticId,
        logisticName: poInfo.logisticName,
        vehicleTypeId: poInfo.vehicleTypeId,
        platNo: poInfo.platNo,
        contactNo: poInfo.contactNo,
        status: 'CREATED',
        reason: poInfo.reason,
        normalFlg: true,
        approvedAt: '2023-12-12T02:17:30.062Z',
        rejectedAt: '2023-12-12T02:17:30.062Z',
        approvedBy: loginId,
        rejectedBy: loginId,
        contractNo: poInfo.contractNo,
        updatedBy: loginId,
        refPicoId: poInfo.refPicoId,
        createPicoDetail: []
      })
    }
  }, [poInfo])

  return (
    <PickupOrderFormLogistic
      selectedPo={poInfo}
      title={t('pick_up_order.edit_pick_up_order')}
      formik={updatePickupOrderLogistic}
      setState={setAddRow}
      state={addRow}
      editMode={true}
    />
  )
}

export default EditPicoLogistic
