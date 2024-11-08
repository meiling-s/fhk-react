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
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { refactorPickUpOrderDetail } from './utils'

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);


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
      const { state, realm } = extractError(error);
      if (state.code == STATUS_CODE[503]) {
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
      createPicoDetail: [],
      specificDates: []
    },

    // validationSchema: validateSchema,
    onSubmit: async (values: CreatePO) => {
      console.log("🚀 ~ file: CreatePickupOrder.tsx ~ line 92 ~ onSubmit: ~ values", JSON.stringify(values || {}))
      const refactorPicoDetail: any = refactorPickUpOrderDetail(addRow)
      values.createPicoDetail = refactorPicoDetail
      console.log("🚀 ~ file: CreatePickupOrder.tsx ~ line 126 ~ onSubmit: ~ refactorPicoDetail", refactorPicoDetail)


      if (picoTypeValue === 'AD_HOC') {
        values.routine = [];
      } else if (picoTypeValue === 'ROUTINE') {
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
          values.specificDates = [];
        }
      }

      console.log("🚀 ~ file: CreatePickupOrder.tsx ~ line 161 ~ onSubmit: ~ values", values)
      const result = await submitPickUpOrder(values);
      
      console.log("🚀 ~ file: CreatePickupOrder.tsx ~ line 161 ~ onSubmit: ~ result", result)

      // const data = result?.data;
      // if (data) {
      //     const routeName = role;
      //     navigate(`/${routeName}/PickupOrder`, { state: 'created' });
      // } else {
      //     showErrorToast('fail to create pickup order');
      // }
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
