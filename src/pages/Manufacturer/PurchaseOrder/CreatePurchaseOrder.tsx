import { useFormik } from 'formik'
import PurchaseOrderCreateForm from '../../../components/FormComponents/PurchaseOrderCreateForm'
import { PurChaseOrder, PurchaseOrderDetail} from '../../../interfaces/purchaseOrder'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { extractError, returnApiToken, showErrorToast } from '../../../utils/utils'
import { STATUS_CODE, Status, localStorgeKeyName } from '../../../constants/constant'
import { postPurchaseOrder } from '../../../APICalls/Manufacturer/purchaseOrder'

const CreatePurchaseOrder = () => {
  const navigate = useNavigate()
  const [addRow, setAddRow] = useState<PurchaseOrderDetail[]>([])
  const { t } = useTranslation()
  const realm = localStorage.getItem(localStorgeKeyName.realm)
  const loginId = localStorage.getItem(localStorgeKeyName.username) || ''

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
    receiverName: Yup.string().required(
      t('purchase_order.create.this') + ' ' + 
      t('purchase_order.create.receiving_company_name') + ' ' + 
      t('purchase_order.create.is_required')
    ),
    contactName: Yup.string().required(
      t('purchase_order.create.this') + ' ' + 
      t('purchase_order.create.contact_name') + ' ' + 
      t('purchase_order.create.is_required')
    ),
    contactNo: Yup.string().required(
      t('purchase_order.create.this') + ' ' + 
      t('purchase_order.create.contact_number') + ' ' + 
      t('purchase_order.create.is_required')
    ),
    paymentType: Yup.string().required(
      t('purchase_order.create.this') + ' ' + 
      t('purchase_order.create.payment_method') + ' ' + 
      t('purchase_order.create.is_required')
    ),
    purchaseOrderDetail: Yup.array()
      .required(getErrorMsg(t('pick_up_order.recyle_loc_info'), 'empty'))
      .test(
        'has-rows',
        getErrorMsg(t('pick_up_order.recyle_loc_info'), 'empty')!!,
        (value) => {
          return value.length > 0 || addRow.length > 0
        }
      )
  })

  const submitPurchaseOrder = async (values: PurChaseOrder) => {
    try {
      return await postPurchaseOrder(values)
    } catch (error:any) {
      const {state, realm} =  extractError(error);
      if(state.code === STATUS_CODE[503] || !error?.response){
        navigate('/maintenance')
      } else {
        return null
      }
    }
  }
  

  const currentDate = new Date().toISOString()
  const createPurchaseOrder = useFormik({
    initialValues: {
      poId: '',
      picoId: '',
      cusTenantId: getTenantId(),
      receiverAddr: '',
      receiverAddrGps: [0],
      sellerTenantId: '',
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
    // validationSchema: validateSchema,
    onSubmit: async (values: PurChaseOrder) => {

      values.purchaseOrderDetail = addRow
      const result = await submitPurchaseOrder(values)
      const data = result?.data

      if (data) {
        navigate(`/${realm}/purchaseOrder`, { state: 'created' })
      } else {
        showErrorToast('fail to create purchase order')
      }
    }
  })

  return (
    <PurchaseOrderCreateForm
      formik={createPurchaseOrder}
      title={t('purchase_order.create.create_order')}
      setState={setAddRow}
      state={addRow}
      editMode={false}
    />
  )
}

export default CreatePurchaseOrder
