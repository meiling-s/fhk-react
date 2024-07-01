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
          .min(1, getErrorMsg(t('pick_up_order.routine.period_should_not_empty'), 'empty'))
          .test(
            'is-in-range',
            t('pick_up_order.out_of_date_range'),
            function (value) {
              const { effFrmDate, effToDate } = schema.parent
              // const fromDate = new Date(effFrmDate)
              // const toDate = new Date(effToDate)
              
              const fromDate = dayjs(effFrmDate).format('YYYY-MM-DD')
              const toDate =  dayjs(effToDate).format('YYYY-MM-DD')
             
              const datesInDateObjects = value.map((date) => new Date(date))
              return datesInDateObjects.every(
                (date) => {
                  const currentDate = dayjs(date).format('YYYY-MM-DD')
                  return currentDate >= fromDate && currentDate <= toDate
                }
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
    validationSchema: validateSchema,
    onSubmit: async (values: CreatePO) => {
      values.createPicoDetail = addRow
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
