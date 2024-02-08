import { useFormik } from 'formik'
import PickupOrderCreateForm from '../../../components/FormComponents/PickupOrderCreateForm'
import {
  createPickUpOrder,
  getAllPickUpOrder
} from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import { CreatePO, CreatePicoDetail, PickupOrder } from '../../../interfaces/pickupOrder'
import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { useContainer } from 'unstated-next'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { localStorgeKeyName } from '../../../constants/constant'
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

  const validateSchema = Yup.object().shape({
    picoType: Yup.string().required('This picoType is required'),
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
    logisticName: Yup.string().required('This logistic is required'),
    vehicleTypeId: Yup.string().required('This vehicleType is required'),
    platNo: Yup.string().required('This platNo is required'),
    contactNo: Yup.number().required('This contactNo is required'),
    contractNo:
      picoTypeValue == 'ROUTINE'
        ? Yup.string().required('This contractNo is invalid')
        : Yup.string(),
    reason:
      picoTypeValue == 'AD_HOC'
        ? Yup.string().required('This reason is required')
        : Yup.string(),
    createPicoDetail: Yup.array()
      .required('This field is required')
      .test('has-rows', 'At least one Pico Detail is required', (value) => {
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
 
