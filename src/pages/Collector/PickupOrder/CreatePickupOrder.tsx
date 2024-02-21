import { useFormik } from 'formik'
import PickupOrderCreateForm from '../../../components/FormComponents/PickupOrderCreateForm'
import {
  createPickUpOrder,
} from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import { CreatePO, CreatePicoDetail, PickupOrder } from '../../../interfaces/pickupOrder'
import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { returnApiToken } from '../../../utils/utils'

const CreatePickupOrder = () => {
  const navigate = useNavigate()
  const [addRow, setAddRow] = useState<CreatePicoDetail[]>([])
  const { t } = useTranslation()
  const [picoTypeValue, setPicoType] = useState<string>('ROUTINE')
  
 

  function getTenantId() {

    const tenantId = returnApiToken().decodeKeycloack.substring("company".length);

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
    // picoType: Yup.string().required(getErrorMsg(t('pick_up_order.select_shipping_category'), 'empty')),
    effFrmDate: Yup.string().required('This effFrmDate is required'),
    effToDate: Yup.string().required('This effToDate is required'),
    routineType:
      picoTypeValue == 'ROUTINE'
        ? Yup.string().required('This routineType is required')
        : Yup.string(),
    routine:
      picoTypeValue == 'ROUTINE'
        ? Yup.array().required('routine is required')
        : Yup.array(),
    logisticName: Yup.string().required(getErrorMsg(t('pick_up_order.choose_logistic'), 'empty')),
    vehicleTypeId: Yup.string().required(getErrorMsg(t('pick_up_order.vehicle_category'), 'empty')),
    platNo: Yup.string().required(getErrorMsg(t('pick_up_order.plat_number'), 'empty')),
    contactNo: Yup.number().required(getErrorMsg(t('pick_up_order.contact_number'), 'empty')),
    contractNo:
      picoTypeValue == 'ROUTINE'
        ? Yup.string().required(getErrorMsg(t('pick_up_order.routine.contract_number'), 'empty'))
        : Yup.string(),
    reason:
      picoTypeValue == 'AD_HOC'
        ? Yup.string().required(getErrorMsg(t('pick_up_order.adhoc.reason_get_off'), 'isInWrongFormat'))
        : Yup.string(),
    createPicoDetail: Yup.array()
      .required(getErrorMsg(t('pick_up_order.recyle_loc_info'), 'empty'))
      .test('has-rows', (getErrorMsg(t('pick_up_order.recyle_loc_info'), 'empty'))!!, (value) => {
        return value.length > 0 || addRow.length > 0
      })
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
      status: 'CREATED',
      reason: '',
      normalFlg: true,
      contractNo: '',
      createdBy: 'Admin',
      updatedBy: 'Admin',
      createPicoDetail: []
    },
    validationSchema: validateSchema,
    onSubmit: async (values: CreatePO) => {
      values.createPicoDetail = addRow
      //alert(JSON.stringify(values, null, 2))
      console.log(JSON.stringify(values, null, 2))
      const result = await createPickUpOrder(values)
      const data = result?.data
      if (data) {
        console.log('all pickup order: ', data)
        navigate('/collector/PickupOrder', { state: 'created' })
      } else {
        alert('fail to create pickup order')
      }
    }
  })

  useEffect(() => {
    setPicoType(createPickupOrder.values.picoType)
  }, [createPickupOrder.values.picoType])

  return (
    <PickupOrderCreateForm
      formik={createPickupOrder}
      title={t('pick_up_order.create_pick_up_order')}
      setState={setAddRow}
      state={addRow}
      editMode={false}
    />
  )
}

export default CreatePickupOrder
 
