import React, { useEffect, useState } from 'react'
import CreatePickupOrder from './CreatePickupOrder'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CreatePicoDetail,
  EditPo,
  PickupOrder,
  PickupOrderDetail
} from '../../../interfaces/pickupOrder'
import PickupOrderCreateForm from '../../../components/FormComponents/PickupOrderCreateForm'
import { useFormik } from 'formik'
import {
  editPickupOrder,
  getAllPickUpOrder
} from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import { useContainer } from 'unstated-next'
import { useTranslation } from 'react-i18next'
import { localStorgeKeyName } from '../../../constants/constant'

const EditPickupOrder = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [addRow, setAddRow] = useState<CreatePicoDetail[]>([])
  const poInfo: PickupOrder = state
  const loginId = localStorage.getItem(localStorgeKeyName.username) || ''

  const updatePickupOrder = useFormik({
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

    onSubmit: async (values: EditPo) => {
      // console.log(JSON.stringify(values, null, 2))
      //alert(JSON.stringify(values, null, 2))
      values.createPicoDetail = addRow
      const result = await editPickupOrder(poInfo.picoId, values)
      // alert(JSON.stringify(result, null, 2))
      console.log(JSON.stringify(result, null, 2))

      const data = result?.data
      if (data) {
        console.log('all pickup order: ', data)
        navigate('/collector/PickupOrder', { state: 'updated' })
      } else {
        alert('fail to edit pickup order')
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

      updatePickupOrder.setValues({
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
    <PickupOrderCreateForm
      selectedPo={poInfo}
      title={t('pick_up_order.edit_pick_up_order')}
      formik={updatePickupOrder}
      setState={setAddRow}
      state={addRow}
      editMode={true}
    />
  )
}

export default EditPickupOrder
