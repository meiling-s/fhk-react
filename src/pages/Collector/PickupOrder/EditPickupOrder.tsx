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
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { refactorPickUpOrderDetail } from './utils'

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const EditPickupOrder = () => {
  const { t, i18n } = useTranslation()
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

  const submitEditPickUpOrder = async (pickupOrderId: string, values: EditPo) => {
    try {
      return await editPickupOrder(pickupOrderId, values)
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      } else if (state.code === STATUS_CODE[409]) {
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
      specificDates: []
    },
    // validationSchema: validateSchema,
    onSubmit: async (values: EditPo) => {

      const refactorPicoDetail: any = refactorPickUpOrderDetail(addRow)
      values.updatePicoDetail = refactorPicoDetail

      if (values.picoType === 'AD_HOC') {
        values.routine = [];
      } else if (values.picoType === 'ROUTINE') {
        if (values.routineType === 'specificDate') {
          // Get current time (hour and minute) from the user's local time
          const currentHour = dayjs().hour();
          const currentMinute = dayjs().minute();

          values.specificDates = values.routine
            .map(value => {
              // Format to 'YYYY-MM-DD' first, then parse it in the user's timezone
              const formattedDate = dayjs(value).format('YYYY-MM-DD');
              const parsedDate = dayjs.tz(formattedDate, dayjs.tz.guess());

              if (!parsedDate.isValid()) {
                console.error(`Invalid date format: ${value}`);
                return null; // Handle invalid dates as needed
              }

              // Set current hour and minute, then convert to ISO string
              return parsedDate
                .set('hour', currentHour)
                .set('minute', currentMinute)
                .toISOString();
            })
            .filter(date => date !== null) as string[]; // Filter out nulls and cast as string[]
        } else if (values.routineType === 'weekly') {
          values.specificDates = []
        }
      }
      console.log("🚀 ~ file: EditPickupOrder.tsx ~ line 128 ~ onSubmit: ~ values", values)
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
        productType: item.productType,
        productSubType: item.productSubType,
        productAddonType: item.productAddonType,
        productSubTypeRemark: item.productSubTypeRemark,
        productAddonTypeRemark: item.productAddonTypeRemark,
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
          version: data.version ?? 0,
          specificDates: data.specificDates
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
