import { Formik, useFormik } from 'formik'
import PickupOrderCreateForm from '../../../components/FormComponents/PickupOrderCreateForm'
import { createPickUpOrder } from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import {
  CreatePO,
  CreatePicoDetail,
  PickupOrder
} from '../../../interfaces/pickupOrder'
import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { extractError, returnApiToken, showErrorToast } from '../../../utils/utils'
import { STATUS_CODE, localStorgeKeyName } from '../../../constants/constant'
import dayjs from 'dayjs'

const CreatePickupOrder = () => {
  const navigate = useNavigate()
  const [addRow, setAddRow] = useState<CreatePicoDetail[]>([])
  const { t } = useTranslation()
  const [picoTypeValue, setPicoType] = useState<string>('ROUTINE')
  const role = localStorage.getItem(localStorgeKeyName.role)

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


  const submitPickUpOrder = async (values: CreatePO) => {
    try {
      return await createPickUpOrder(values)
    } catch (error) {
      const { state, realm} = extractError(error);
      if(state.code == STATUS_CODE[503]){
        navigate('/maintenance')
      } else {
        return null
      }
    }
  }

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

    // validationSchema: validateSchema,
    onSubmit: async (values: CreatePO) => {
      // console.log(addRow, 'row')
      values.createPicoDetail = addRow;
      if(picoTypeValue === 'AD_HOC'){
        values.routine = [];
      }
      
      const result = await submitPickUpOrder(values)
      const data = result?.data
      if (data) {
        //console.log('all pickup order: ', data)
        const routeName = role
        navigate(`/${routeName}/PickupOrder`, { state: 'created' })
        //navigate('/collector/PickupOrder', { state: 'created' })
      } else {
        showErrorToast('fail to create pickup order')
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
