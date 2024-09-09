import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CreatePicoDetail,
  EditPo,
  PickupOrder,
} from '../../../interfaces/pickupOrder'
import PickupOrderCreateForm from '../../../components/FormComponents/PickupOrderCreateForm'
import { useFormik } from 'formik'
import {
  editPickupOrder, getPicoById,
} from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import { useContainer } from 'unstated-next'
import { useTranslation } from 'react-i18next'
import { STATUS_CODE, localStorgeKeyName } from '../../../constants/constant'
import { extractError, formatWeight, showErrorToast } from '../../../utils/utils'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'

const EditPickupOrder = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [addRow, setAddRow] = useState<CreatePicoDetail[]>([])
  const poInfo: PickupOrder = state
  const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
  const role = localStorage.getItem(localStorgeKeyName.role)
  const { decimalVal } = useContainer(CommonTypeContainer)

  console.log(poInfo, 'poInfo')
  
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

  const submitEditPickUpOrder = async (pickupOrderId: string, values:EditPo) => {
    try {
      return await editPickupOrder(pickupOrderId, values)
    } catch (error:any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      } else if (state.code === STATUS_CODE[409]){
        showErrorToast(error.response.data.message);
      }
    }
  }

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
      approvedAt: '',
      rejectedAt: '',
      approvedBy: 'string',
      rejectedBy: 'string',
      contractNo: '',
      updatedBy: loginId,
      refPicoId: '',
      updatePicoDetail: [],
      version: 0,
    },
    // validationSchema: validateSchema,
    onSubmit: async (values: EditPo) => {
      values.updatePicoDetail = addRow
      if(values.picoType === 'AD_HOC'){
        values.routine = [];
      }
      const result = await submitEditPickUpOrder(poInfo.picoId, values)

      const data = result?.data
      if (data) {
        //navigate('/collector/PickupOrder', { state: 'updated' })
        const routeName = role
        navigate(`/${routeName}/PickupOrder`, { state: 'updated' })
      }
    }
  })

  const setPickupOrderDetail = (data: any) => {
    const picoDetails: CreatePicoDetail[] =
      data?.pickupOrderDetail?.map((item: any) => ({
        id: item.picoDtlId,
        picoDtlId: item.picoDtlId,
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
        weight: formatWeight(item.weight, decimalVal),
        newDetail: false,
        version: poInfo.version
      })) || []

    setAddRow(picoDetails)
    return picoDetails
  }
  
  const initGetPickUpOrderData = async (picoId: string) => {
    const result = await getPicoById(picoId.toString())
    if (result) {
      const data = result.data
      if (data) {
        const createPicoDetail: CreatePicoDetail[] = setPickupOrderDetail(data)
        updatePickupOrder.setValues({
          tenantId: data.tenantId,
          picoType: data.picoType,
          effFrmDate: data.effFrmDate,
          effToDate: data.effToDate,
          routineType: data.routineType,
          routine: data.routine,
          logisticId: data.logisticId,
          logisticName: data.logisticName,
          vehicleTypeId: data.vehicleTypeId,
          platNo: data.platNo,
          contactNo: data.contactNo,
          status: 'CREATED',
          reason: data.reason,
          normalFlg: true,
          approvedAt: '',
          rejectedAt: '',
          approvedBy: loginId,
          rejectedBy: loginId,
          contractNo: data.contractNo,
          updatedBy: loginId,
          refPicoId: data?.refPicoId,
          updatePicoDetail: [],
          version: data.version ?? 0
        })
      }
    }
  }
  useEffect(() => {
    if (poInfo) {
      initGetPickUpOrderData(poInfo.picoId)
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
