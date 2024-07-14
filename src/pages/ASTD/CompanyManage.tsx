import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography,
  Grid,
  Divider,
  Pagination,
  CircularProgress,
  Alert,
  FormControl,
  MenuItem
} from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridCellParams
} from '@mui/x-data-grid'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { ADD_PERSON_ICON, SEARCH_ICON } from '../../themes/icons'
import { SyntheticEvent, useEffect, useState } from 'react'
import { visuallyHidden } from '@mui/utils'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'
import {
  createInvitation,
  getAllTenant,
  searchTenantById,
  updateTenantStatus,
  sendEmailInvitation
} from '../../APICalls/tenantManage'
import { STATUS_CODE, defaultPath, format } from '../../constants/constant'
import { styles } from '../../constants/styles'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import CustomDatePicker2 from '../../components/FormComponents/CustomDatePicker2'
import CustomField from '../../components/FormComponents/CustomField'
import CustomTextField from '../../components/FormComponents/CustomTextField'
import CustomItemList, {
  il_item
} from '../../components/FormComponents/CustomItemList'
import TenantDetails from './TenantDetails'
import { Company, UpdateStatus } from '../../interfaces/tenant'

import { useTranslation } from 'react-i18next'
import { ErrorMessage, useFormik, validateYupSchema } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import {
  extractError,
  returnApiToken,
  showErrorToast,
  showSuccessToast,
  validateEmail
} from '../../utils/utils'
import { ToastContainer } from 'react-toastify'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../contexts/CommonTypeContainer'
import i18n from '../../setups/i18n'
import useLocaleTextDataGrid from '../../hooks/useLocaleTextDataGrid'

dayjs.extend(utc)
dayjs.extend(timezone)

function createCompany(
  id: number,
  cName: string,
  eName: string,
  status: string,
  type: string,
  createDate: string,
  accountNum: number
): Company {
  return { id, cName, eName, status, type, createDate, accountNum }
}

type inviteModal = {
  open: boolean
  onClose: () => void
  id: string
  onSendInvitation: (isSend: boolean) => void
}

const Required = () => {
  return (
    <Typography
      sx={{
        color: 'red',
        ml: '5px'
      }}
    >
      *
    </Typography>
  )
}

type rejectModal = {
  tenantId: number
  open: boolean
  onClose: () => void
  onSubmit: () => void
}

function RejectModal({ tenantId, open, onClose, onSubmit }: rejectModal) {
  const { t } = useTranslation()
  const [rejectReasonId, setRejectReasonId] = useState<string[]>([])
  const navigate = useNavigate()

  const getReason = () => {
    const reasonList = [
      {
        id: '1',
        reasonEn: 'Photo is blurry',
        reasonSchi: '照片模糊"',
        reasonTchi: '照片模糊'
      },
      {
        id: '2',
        reasonEn: 'Business number does not match',
        reasonSchi: '商业编号不匹配',
        reasonTchi: '商業編號不匹配'
      }
    ]
    const reasons: il_item[] = []
    reasonList.forEach((item) => {
      var name = ''
      switch (i18n.language) {
        case 'enus':
          name = item.reasonEn
          break
        case 'zhch':
          name = item.reasonSchi
          break
        case 'zhhk':
          name = item.reasonTchi
          break
        default:
          name = item.reasonTchi //default fallback language is zhhk
          break
      }
      const reasonItem: il_item = {
        id: item.id,
        name: name
      }
      reasons.push(reasonItem)
    })
    return reasons
  }
  const handleRejectRequest = async () => {
    try {
      const statData: UpdateStatus = {
        status: 'REJECTED',
        updatedBy: 'admin'
      }

      const result = await updateTenantStatus(statData, tenantId)
      // const data = result?.data
      if (result.status === 200) {
        onSubmit()
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          <Box sx={{ paddingX: 3, paddingTop: 3 }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h3"
              sx={{ fontWeight: 'bold' }}
            >
              {`${t('tenant.are_sure_to_reject')} ${tenantId}?`}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ paddingX: 3, paddingTop: 3 }}>
            <Typography sx={localstyles.typo}>
              {t('check_out.reject_reasons')}
            </Typography>
            <CustomItemList
              items={getReason() || []}
              multiSelect={setRejectReasonId}
            />
          </Box>

          <Box sx={{ alignSelf: 'center', paddingY: 3 }}>
            <button
              className="primary-btn mr-2 cursor-pointer"
              onClick={() => {
                handleRejectRequest()
                onClose()
              }}
            >
              {t('check_in.confirm')}
            </button>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={() => {
                onClose()
              }}
            >
              {t('check_in.cancel')}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

interface ModalNotif {
  open?: boolean
  onClose?: () => void
  isSend?: boolean
}

const ModalNotification: React.FC<ModalNotif> = ({
  open = false,
  onClose,
  isSend = false
}) => {
  const { t } = useTranslation()
  const msgModal = isSend
    ? t('tenant.invite_modal.invite_success')
    : t('tenant.invite_modal.invite_failed')

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          <Box sx={{ paddingX: 3, paddingTop: 3, textAlign: 'center' }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h3"
              sx={{ fontWeight: 'bold' }}
            >
              {msgModal}
            </Typography>
          </Box>

          <Box sx={{ alignSelf: 'center', paddingY: 3 }}>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={onClose}
            >
              {t('check_out.ok')}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

function InviteModal({ open, onClose, id, onSendInvitation }: inviteModal) {
  const { t } = useTranslation()
  const [email, setEmail] = useState<string>('')
  const [emailErr, setEmailErr] = useState<boolean>(false)

  const sendInvitation = async () => {
    const titleInv = 'Invitation Tenant Account'
    const content = `are u invited to register as tenant member , ${
      defaultPath.tenantRegisterPath + id
    }`

    const result = await sendEmailInvitation(email, id.toString().padStart(6, '0'))
    if (result) {
      onSendInvitation(true)
    } else {
      onSendInvitation(false)
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          <Box sx={{ paddingX: 3, paddingTop: 3 }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold' }}
            >
              {t('tenant.invite_modal.invite_company')}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ paddingX: 3 }}>
            <Typography sx={localstyles.typo}>
              {t('tenant.invite_modal.invite_by_email')}
              <Required />
            </Typography>
            <TextField
              fullWidth
              placeholder={t('tenant.invite_modal.enter_email')}
              onChange={(event) => {
                setEmailErr(validateEmail(email))
                setEmail(event.target.value)
              }}
              error={emailErr}
              InputProps={{
                sx: styles.textField,
                endAdornment: (
                  <InputAdornment position="end" sx={{ height: '100%' }}>
                    <Button
                      sx={[
                        styles.buttonOutlinedGreen,
                        {
                          width: '90px',
                          height: '100%'
                        }
                      ]}
                      variant="outlined"
                      onClick={sendInvitation}
                      disabled={emailErr}
                    >
                      {t('tenant.invite_modal.send')}
                    </Button>
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Box sx={{ paddingX: 3, paddingBottom: 3 }}>
            <Typography variant="h6" component="h2" sx={{ marginBottom: 2 }}>
              {t('tenant.invite_modal.or')}
            </Typography>
            <Typography sx={localstyles.typo}>
              {t('tenant.invite_modal.link_invitation')}
            </Typography>
            <TextField
              fullWidth
              value={defaultPath.tenantRegisterPath + id.toString().padStart(6, '0')}
              onChange={(event: { target: { value: any } }) => {
                //console.log(event.target.value)
              }}
              InputProps={{
                sx: styles.textField,
                endAdornment: (
                  <InputAdornment position="end" sx={{ height: '100%' }}>
                    <Button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          defaultPath.tenantRegisterPath + id.toString().padStart(6, '0')
                        )
                      }
                      sx={[
                        styles.buttonOutlinedGreen,
                        {
                          width: '90px',
                          height: '100%'
                        }
                      ]}
                      variant="outlined"
                    >
                      {t('tenant.invite_modal.copy')}
                    </Button>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

type InviteTenant = {
  tenantId: number
  companyNumber: string
  companyCategory: string
  companyZhName: string
  companyCnName: string
  companyEnName: string
  bussinessNumber: string
  effFrmDate: string
  effToDate: string
  remark: string
}

type inviteForm = {
  open: boolean
  isLoading: boolean
  onClose: () => void
  onSubmitForm: (formikValues: InviteTenant) => void
  isDuplicated: boolean
  isTenantErr: boolean
}

function InviteForm({
  open,
  isLoading,
  onClose,
  onSubmitForm,
  isDuplicated,
  isTenantErr,
}: inviteForm) {
  const { t } = useTranslation()
  //const [submitable, setSubmitable] = useState<boolean>(false)

  const validateSchema = Yup.object().shape({
    companyCategory: Yup.string().required(
      `${t('tenant.invite_form.company_category')} ${t(
        'purchase_order.create.is_required'
      )}`
    ),
    companyZhName: Yup.string().required(
      `${t('tenant.invite_form.company_zh_name')} ${t(
        'purchase_order.create.is_required'
      )}`
    ),
    companyCnName: Yup.string().required(
      `${t('tenant.invite_form.company_cn_name')} ${t(
        'purchase_order.create.is_required'
      )}`
    ),
    companyEnName: Yup.string().required(
      `${t('tenant.invite_form.company_en_name')} ${t(
        'purchase_order.create.is_required'
      )}`
    ),
    bussinessNumber: Yup.string().required(
      `${t('tenant.invite_form.bussiness_number')} ${t(
        'purchase_order.create.is_required'
      )}`
    ),
    remark: Yup.string().required(
      `${t('tenant.invite_form.remark')} ${t(
        'purchase_order.create.is_required'
      )}`
    ),
    effFrmDate: Yup.date()
      .nullable()
      .required(
        `${t('pick_up_order.shipping_validity')} ${t(
          'purchase_order.create.is_required'
        )}`
      )
      .test(
        'is-before-end-date',
        `${t('pick_up_order.shipping_validity')} ${t(
          'tenant.invite_modal.err_date'
        )} `,
        function (value) {
          const { effToDate } = this.parent
          return !effToDate || !value || new Date(value) <= new Date(effToDate)
        }
      ),
    effToDate: Yup.date()
      .nullable()
      .required(
        `${t('pick_up_order.to')} ${t('purchase_order.create.is_required')}`
      )
      .test(
        'is-after-start-date',
        `${t('pick_up_order.to')} ${t('tenant.invite_modal.err_date')} `,
        function (value) {
          const { effFrmDate } = this.parent

          return (
            !effFrmDate || !value || new Date(value) >= new Date(effFrmDate)
          )
        }
      )
  })

  const initialValues = {
    tenantId: 0,
    companyNumber: '',
    companyCategory: 'collector',
    companyZhName: '',
    companyCnName: '',
    companyEnName: '',
    bussinessNumber: '',
    effFrmDate: new Date().toDateString(),
    effToDate: new Date().toDateString(),
    remark: ''
  }

  const formik = useFormik<InviteTenant>({
    initialValues,
    validationSchema: validateSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmitForm(values)
        // resetForm()
        //onClose && onClose()
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    }
  })

  useEffect(() => {
    if (open) {
      formik.resetForm()
    }
  }, [open])

  const TextFields = [
    {
      label: t('tenant.invite_form.company_number'),
      placeholder: t('tenant.invite_form.enter_company_number'),
      id: 'companyNumber',
      value: formik.values.companyNumber,
      error: formik.errors.companyNumber && formik.touched.companyNumber,
      mandatory: false,
    },
    {
      label: t('tenant.invite_form.company_category'),
      placeholder: t('tenant.invite_form.enter_company_category'),
      id: 'companyCategory',
      value: formik.values.companyCategory,
      error: formik.errors.companyCategory && formik.touched.companyCategory,
      mandatory: true,
      options: [
        {
          key: 'collector',
          label: t('tenant.invite_form.collector_company')
        },
        {
          key: 'logistic',
          label: t('tenant.invite_form.logistic_company')
        },
        {
          key: 'manufacturer',
          label: t('tenant.invite_form.manufacturer_company')
        },
        {
          key: 'customer',
          label: t('tenant.invite_form.customer_company')
        }
      ]
    },
    {
      label: t('tenant.invite_form.company_zh_name'),
      placeholder: t('tenant.invite_form.enter_company_zh_name'),
      id: 'companyZhName',
      value: formik.values.companyZhName,
      error: formik.errors.companyZhName && formik.touched.companyZhName,
      mandatory: true,
    },
    {
      label: t('tenant.invite_form.company_cn_name'),
      placeholder: t('tenant.invite_form.enter_company_cn_name'),
      id: 'companyCnName',
      value: formik.values.companyCnName,
      error: formik.errors.companyCnName && formik.touched.companyCnName,
      mandatory: true,
    },
    {
      label: t('tenant.invite_form.company_en_name'),
      placeholder: t('tenant.invite_form.enter_company_en_name'),
      id: 'companyEnName',
      value: formik.values.companyEnName,
      error: formik.errors.companyEnName && formik.touched.companyEnName,
      mandatory: true,
    },
    {
      label: t('tenant.invite_form.bussiness_number'),
      placeholder: t('tenant.invite_form.enter_bussiness_number'),
      id: 'bussinessNumber',
      value: formik.values.bussinessNumber,
      error: formik.errors.bussinessNumber && formik.touched.bussinessNumber,
      mandatory: true,
    }
  ]

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    await formik.handleSubmit()
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
        <Modal
          open={open}
          onClose={onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={[
              localstyles.modal,
              {
                height: '90%',
                width: 'max-content',
                overflowY: 'auto'
              }
            ]}
          >
            <Stack spacing={2}>
              <Box
                sx={{
                  paddingX: 3,
                  paddingTop: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: 'bold' }}
                >
                  {t('tenant.invite_modal.invite_company')}
                </Typography>
                <CloseIcon
                  className="text-black cursor-pointer"
                  onClick={onClose}
                />
              </Box>
              <Divider />
              <Box sx={{ paddingX: 3, paddingTop: 3 }}>
                {TextFields.map((t, index) => (
                  <Grid item sx={{ marginBottom: 3 }} key={index}>
                    <CustomField mandatory={t.mandatory} label={t.label}>
                      {t.id === 'companyCategory' ? (
                        <Grid item>
                          <FormControl
                            sx={{
                              width: '100%'
                            }}
                          >
                            <Select
                              labelId="userGroup"
                              id="userGroup"
                              value={t.value}
                              sx={{
                                borderRadius: '12px'
                              }}
                              onChange={(event: SelectChangeEvent<string>) => {
                                const selectedValue = t?.options?.find(
                                  (item) => item.key === event.target.value
                                )
                                if (selectedValue) {
                                  formik.setFieldValue(
                                    'companyCategory',
                                    selectedValue.key
                                  )
                                }
                              }}
                            >
                              {t?.options?.map((item, index) => (
                                <MenuItem key={index} value={item.key}>
                                  {item.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      ) : t.id === 'companyNumber' ? (
                        <Box>
                          <TextField
                            fullWidth
                            InputProps={{
                              sx: styles.textField
                            }}
                            placeholder={t.placeholder}
                            onChange={(event) => {
                              const numericValue = event.target.value.replace(
                                /\D/g,
                                ''
                              )
                              formik.setFieldValue(
                                'companyNumber',
                                numericValue
                              )
                            }}
                            sx={localstyles.inputState}
                            value={t.value}
                            inputProps={{
                              inputMode: 'numeric',
                              pattern: '[0-9]*',
                              maxLength: 6
                            }}
                            error={t.error || undefined}
                          />
                        </Box>
                      ) : (
                        <CustomTextField
                          id={t.id}
                          placeholder={t.placeholder}
                          rows={4}
                          onChange={formik.handleChange}
                          value={t.value}
                          sx={{ width: '100%' }}
                          error={t.error || undefined}
                        />
                      )}
                    </CustomField>
                  </Grid>
                ))}
                <Grid item display="flex">
                  <CustomDatePicker2
                    pickupOrderForm={true}
                    setDate={(values) => {
                      formik.setFieldValue('effFrmDate', values.startDate)
                      formik.setFieldValue('effToDate', values.endDate)
                    }}
                    defaultStartDate={new Date()}
                    defaultEndDate={new Date()}
                  />
                </Grid>
              </Box>
              <Box sx={{ paddingX: 3 }}>
                <CustomField mandatory label={t('tenant.invite_form.remark')}>
                  <CustomTextField
                    id={'remark'}
                    placeholder={t('tenant.invite_form.enter_remark')}
                    multiline={true}
                    rows={4}
                    onChange={formik.handleChange}
                    value={formik.values.remark}
                    sx={{ width: '100%' }}
                    error={
                      (formik.errors?.remark && formik.touched?.remark) ||
                      undefined
                    }
                  ></CustomTextField>
                </CustomField>
                <Stack spacing={2} marginTop={2}>
                  {formik.errors.companyNumber &&
                    formik.touched.companyNumber && (
                      <Alert severity="error">
                        {formik.errors.companyNumber}{' '}
                      </Alert>
                    )}
                  {formik.errors.companyCategory &&
                    formik.touched.companyCategory && (
                      <Alert severity="error">
                        {formik.errors.companyCategory}{' '}
                      </Alert>
                    )}

                  {formik.errors.companyZhName &&
                    formik.touched.companyZhName && (
                      <Alert severity="error">
                        {formik.errors.companyZhName}{' '}
                      </Alert>
                    )}
                  {formik.errors.companyCnName &&
                    formik.touched.companyCnName && (
                      <Alert severity="error">
                        {formik.errors.companyCnName}{' '}
                      </Alert>
                    )}
                  {formik.errors.companyEnName &&
                    formik.touched.companyEnName && (
                      <Alert severity="error">
                        {formik.errors.companyEnName}{' '}
                      </Alert>
                    )}
                  {formik.errors.bussinessNumber &&
                    formik.touched.bussinessNumber && (
                      <Alert severity="error">
                        {formik.errors.bussinessNumber}{' '}
                      </Alert>
                    )}
                  {formik.errors.effFrmDate && formik.touched.effFrmDate && (
                    <Alert severity="error">{formik.errors.effFrmDate} </Alert>
                  )}
                  {formik.errors.effToDate && formik.touched.effToDate && (
                    <Alert severity="error">{formik.errors.effToDate} </Alert>
                  )}
                  {formik.errors.remark && formik.touched.remark && (
                    <Alert severity="error">{formik.errors.remark} </Alert>
                  )}
                  {isDuplicated && (
                    <Alert severity="error">
                      {t('tenant.invite_modal.err_duplicated')}{' '}
                    </Alert>
                  )}
                  {isTenantErr && (
                    <Alert severity="error">
                      {t('tenant.invite_modal.err_companyIdLength')}{' '}
                    </Alert>
                  )}
                </Stack>
              </Box>
              <Box sx={{ alignSelf: 'center' }}>
                {isLoading && <CircularProgress color="success" />}
              </Box>
              <Box sx={{ alignSelf: 'center', paddingBottom: '16px' }}>
                <Button
                  disabled={!formik.isValid || isLoading}
                  onClick={handleSubmit}
                  type="submit"
                  // onClick={async () => {
                  //   await onSubmit(formik.values, formik.submitForm)
                  //   formik.resetForm() // Reset the form after the onSubmit function completes
                  // }}
                  sx={[
                    styles.buttonFilledGreen,
                    {
                      mt: 3,
                      color: 'white',
                      width: 'max-content',
                      height: '40px'
                    }
                  ]}
                >
                  {t('changePass.submitPassword')}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Modal>
      </LocalizationProvider>
    </form>
  )
}

function CompanyManage() {
  const { t } = useTranslation()

  const [searchText, setSearchText] = useState<string>('')
  const [selected, setSelected] = useState<string[]>([])
  const [invFormModal, setInvFormModal] = useState<boolean>(false)
  const [invSendModal, setInvSendModal] = useState<boolean>(false)
  const [modalNotification, setModalNotification] = useState<boolean>(false)
  const [successSendInv, setSuccessSendInv] = useState<boolean>(false)
  const [rejectModal, setRejectModal] = useState<boolean>(false)
  const [InviteId, setInviteId] = useState<string>('')
  const [companies, setCompanies] = useState<Company[]>([])
  const [filterCompanies, setFilterCompanies] = useState<Company[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [checkedCompanies, setCheckedCompanies] = useState<number[]>([])
  const [openDetail, setOpenDetails] = useState<boolean>(false)
  const [selectedTenanId, setSelectedTenantId] = useState(0)
  const [isLoadingInvite, setIsLoadingInvite] = useState<boolean>(false)
  const [rejectedId, setRejectId] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const { dateFormat } = useContainer(CommonTypeContainer)
  const [duplicatedData, setDuplicatedData] = useState<boolean>(false)
  const [tenantIdErr, setTenantIdErr] = useState<boolean>(false)
  const realmOptions = [
    {
      key: 'collector',
      label: t('tenant.invite_form.collector_company')
    },
    {
      key: 'logistic',
      label: t('tenant.invite_form.logistic_company')
    },
    {
      key: 'manufacturer',
      label: t('tenant.invite_form.manufacturer_company')
    },
    {
      key: 'customer',
      label: t('tenant.invite_form.customer_company')
    }
  ]
  const navigate = useNavigate()
  const { localeTextDataGrid } = useLocaleTextDataGrid()

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setSelectAll(checked)
    const selectedRows = checked ? filterCompanies.map((row) => row.id) : []
    setCheckedCompanies(selectedRows)
  }

  const handleRowCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    tenantId: number
  ) => {
    setOpenDetails(false)
    const checked = event.target.checked
    const updatedChecked = checked
      ? [...checkedCompanies, tenantId]
      : checkedCompanies.filter((rowId) => rowId != tenantId)
    setCheckedCompanies(updatedChecked)

    const allRowsChecked = filterCompanies.every((row) =>
      updatedChecked.includes(row.id)
    )
  }

  const handleApproveTenant = async (tenantId: number) => {
    try {
      setOpenDetails(false)
      const statData: UpdateStatus = {
        status: 'CONFIRMED',
        updatedBy: 'admin'
      }

      const result = await updateTenantStatus(statData, tenantId)
      if (result?.status == 200) {
        showSuccessToast(t('common.approveSuccess'))
        initCompaniesData()
      }
      //  window.location.reload()
      setOpenDetails(false)
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const handleRejectTenant = (tenantId: number) => {
    setRejectId(tenantId)
    setRejectModal(true)
  }

  const HeaderCheckbox = (
    <Checkbox
      checked={selectAll}
      onChange={handleSelectAll}
      color="primary"
      inputProps={{ 'aria-label': 'Select all rows' }}
    />
  )

  const checkboxColumn: GridColDef = {
    field: 'customCheckbox',
    headerName: t('localizedTexts.select'),
    width: 80,
    sortable: false,
    filterable: false,
    renderHeader: () => HeaderCheckbox,
    renderCell: (params) => (
      <Checkbox
        checked={selected.includes(params.row.id) || selectAll}
        onChange={(event) => handleRowCheckboxChange(event, params.row.id)}
        color="primary"
      />
    )
  }

  const headCells: GridColDef[] = [
    checkboxColumn,
    {
      field: 'id',
      headerName: t('tenant.company_number'),
      type: 'string',
      width: 200,
      valueFormatter: (params) => {
        return params.value.toString().padStart(6, '0');
      }
    },
    {
      field: 'cName',
      headerName: t('tenant.company_cn_name'),
      width: 150,
      type: 'string'
    },
    {
      field: 'eName',
      headerName: t('tenant.company_en_name'),
      type: 'string',
      width: 150
    },
    {
      field: 'status',
      headerName: t('tenant.status'),
      width: 150,
      type: 'string',
      renderCell: (params) => {
        return t(`status.${params.row.status.toLowerCase()}`).toUpperCase()
      }
    },
    {
      field: 'type',
      headerName: t('tenant.company_category'),
      width: 150,
      type: 'string',
      valueGetter: (params) => {
        return (
          realmOptions.find((item) => item.key === params.row.type)?.label || ''
        )
      }
    },
    {
      field: 'createDate',
      headerName: t('tenant.created_date'),
      width: 150,
      type: 'string',
      valueGetter: (params) => {
        return dayjs
          .utc(params.row?.createDate)
          .tz('Asia/Hong_Kong')
          .format(`${dateFormat} HH:mm`)
      }
    },
    {
      field: 'accountNum',
      headerName: t('tenant.number_of_acc'),
      width: 150,
      type: 'string'
    },
    {
      field: 'action',
      headerName: t('pick_up_order.item.actions'),
      width: 250,
      type: 'string',
      filterable: false,
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            {params.row.status === 'CREATED' ? (
              <div>
                <Button
                  sx={[
                    styles.buttonFilledGreen,
                    {
                      width: 'max-content',
                      height: '40px',
                      marginRight: '8px'
                    }
                  ]}
                  variant="outlined"
                  onClick={(event) => {
                    handleApproveTenant(params.row.id)
                    event.stopPropagation()
                  }}
                >
                  {t('check_out.approve')}
                </Button>
                <Button
                  sx={[
                    styles.buttonOutlinedGreen,
                    {
                      width: 'max-content',
                      height: '40px'
                    }
                  ]}
                  variant="outlined"
                  onClick={(event) => {
                    handleRejectTenant(params.row.id)
                    event.stopPropagation() // Prevent event bubbling
                  }}
                >
                  {t('check_out.reject')}
                </Button>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        )
      }
    }
  ]

  useEffect(() => {
    initCompaniesData()
  }, [page])

  const mappingTenantData = (data: any) => {
    var tenantList: Company[] = []
    data.map((com: any) => {
      tenantList.push(
        createCompany(
          com?.tenantId,
          com?.companyNameTchi,
          com?.companyNameEng,
          com?.status,
          com?.tenantType,
          com?.createdAt,
          com?.decimalPlace || 0
        )
      )
    })

    return tenantList
  }

  async function initCompaniesData() {
    try {
      const result = await getAllTenant(page - 1, pageSize)
      const data = result?.data.content
      if (data.length > 0) {
        const tenantList = mappingTenantData(data)
        setCompanies(tenantList)
        setFilterCompanies(tenantList)
      }
      setTotalData(result?.data.totalPages)
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const handleFilterCompanies = async (searchWord: string) => {
    try {
      if (searchWord != '') {
        const tenantId = parseInt(searchWord)
        const result = await searchTenantById(page - 1, pageSize, tenantId)
        const data = result?.data.content
        if (data?.length > 0) {
          const tenantList = mappingTenantData(data)
          setCompanies(tenantList)
          setFilterCompanies(tenantList)
          setTotalData(result?.data.totalPages)
        }
      } else {
        initCompaniesData()
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const onRejectModal = () => {
    initCompaniesData()
    console.log('onRejectModal', onRejectModal)
    showSuccessToast(t('common.rejectSuccess'))
    setOpenDetails(false)
  }

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  const handleSelectRow = (params: GridRowParams) => {
    setSelectedTenantId(params.row.id)
    console.log('clicked')
    setOpenDetails(true)
  }

  const handleDrawerClose = () => {
    setSelectedTenantId(0)
    setOpenDetails(false)
  }

  const handleCloseInvite = () => {
    setInvSendModal(false)
    setDuplicatedData(false)
    initCompaniesData()
  }

  const handleSendInvitation = (isSend: boolean) => {
    setInvSendModal(false)
    setModalNotification(true)
    setSuccessSendInv(isSend)
  }

  const onChangeStatus = () => {
    initCompaniesData()
  }

  const onInviteFormSubmit = async (
    formikValues: InviteTenant
    //submitForm: () => void
  ) => {
    if (formikValues.companyNumber && formikValues.companyNumber.length !== 6) {
      setTenantIdErr(true)
      setIsLoadingInvite(false);
      return;
    } else {
      try {
        setIsLoadingInvite(true)
        const realmType =
          realmOptions.find((item) => item.key == formikValues.companyCategory)
            ?.key || 'collector'
  
        const result = await createInvitation(
          {
            tenantId: parseInt(formikValues.companyNumber),
            companyNameTchi: formikValues.companyZhName,
            companyNameSchi: formikValues.companyCnName,
            companyNameEng: formikValues.companyEnName,
            tenantType: realmType,
            status: 'CREATED',
            brNo: formikValues.bussinessNumber,
            remark: formikValues.remark,
            contactNo: '',
            email: '',
            contactName: '',
            decimalPlace: 0,
            monetaryValue: '',
            inventoryMethod: '',
            allowImgSize: 0,
            allowImgNum: 0,
            effFrmDate: formikValues.effFrmDate,
            effToDate: formikValues.effToDate,
            createdBy: 'admin',
            updatedBy: 'admin'
          },
          realmType
        )
  
        if (result?.data?.tenantId) {
          console.log(result)
          setInviteId(result?.data?.tenantId)
          setInvSendModal(true)
          setInvFormModal(false)
          setIsLoadingInvite(false)
          setDuplicatedData(false)
          setTenantIdErr(false)
        } else {
          showErrorToast(t('common.saveFailed'))
          setIsLoadingInvite(false)
        }
      } catch (error: any) {
        const { state, realm } = extractError(error)
        if (state.code === STATUS_CODE[503]) {
          navigate('/maintenance')
        } else {
          showErrorToast(`${t('common.saveFailed')}`)
          setDuplicatedData(true)
          setTenantIdErr(false)
          // console.log("test", "lalal2")
          setIsLoadingInvite(false)
        }
      }
      
    }
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          pr: 4
        }}
      >
        <ToastContainer></ToastContainer>
        <Typography fontSize={20} color="black" fontWeight="bold">
          {t('tenant.company')}
        </Typography>
        <Button
          sx={[
            styles.buttonOutlinedGreen,
            {
              mt: 3,
              width: 'max-content',
              height: '40px'
            }
          ]}
          variant="outlined"
          onClick={() => {
            setInvFormModal(true)
            setDuplicatedData(false)
          }}
        >
          <ADD_PERSON_ICON sx={{ marginX: 1 }} /> {t('tenant.invite')}
        </Button>
        <TextField
          id="searchCompany"
          onChange={(event) => {
            const numericValue = event.target.value.replace(/\D/g, '')
            handleFilterCompanies(numericValue)
          }}
          sx={{
            mt: 3,
            width: '100%',
            bgcolor: 'white',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#79CA25'
              },
              '&:hover fieldset': {
                borderColor: '#79CA25'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#79CA25'
              }
            }
          }}
          label={t('tenant.company_number')}
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*',
            maxLength: 6
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => {}}>
                  <SEARCH_ICON style={{ color: '#79CA25' }} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <div className="table-tenant">
          <Box pr={4} pt={3} sx={{ flexGrow: 1, width: '100%' }}>
            <DataGrid
              rows={filterCompanies}
              getRowId={(row) => row.id}
              hideFooter
              columns={headCells}
              checkboxSelection={false}
              disableRowSelectionOnClick
              onRowClick={handleSelectRow}
              getRowSpacing={getRowSpacing}
              localeText={localeTextDataGrid}
              getRowClassName={(params) => 
                selectedTenanId && params.id === selectedTenanId? 'selected-row' : ''
              }
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  border: 'none'
                },
                '& .MuiDataGrid-row': {
                  bgcolor: 'white',
                  borderRadius: '10px'
                },
                '&>.MuiDataGrid-main': {
                  '&>.MuiDataGrid-columnHeaders': {
                    borderBottom: 'none'
                  }
                },
                '.MuiDataGrid-columnHeaderTitle': { 
                  fontWeight: 'bold !important',
                  overflow: 'visible !important'
                },
                '& .selected-row': {
                    backgroundColor: '#F6FDF2 !important',
                    border: '1px solid #79CA25'
                  }
              }}
            />
            <Pagination
              className="mt-4"
              count={Math.ceil(totalData)}
              page={page}
              onChange={(_, newPage) => {
                setPage(newPage)
              }}
            />
          </Box>
        </div>
        <InviteForm
          open={invFormModal}
          isLoading={isLoadingInvite}
          onClose={() => {setInvFormModal(false); setTenantIdErr(false)}}
          onSubmitForm={onInviteFormSubmit}
          isDuplicated={duplicatedData}
          isTenantErr={tenantIdErr}
        />

        <InviteModal
          open={invSendModal}
          onClose={handleCloseInvite}
          id={InviteId}
          onSendInvitation={handleSendInvitation}
        />
        <ModalNotification
          open={modalNotification}
          onClose={() => setModalNotification(false)}
          isSend={successSendInv}
        />

        <RejectModal
          tenantId={rejectedId}
          open={rejectModal}
          onClose={() => setRejectModal(false)}
          onSubmit={onRejectModal}
        />
        {selectedTenanId != 0 && (
          <TenantDetails
            drawerOpen={openDetail}
            handleDrawerClose={handleDrawerClose}
            tenantId={selectedTenanId}
            onChangeStatus={onChangeStatus}
          />
        )}
      </Box>
    </>
  )
}

let localstyles = {
  btn_WhiteGreenTheme: {
    borderRadius: '20px',
    borderWidth: 1,
    borderColor: '#79ca25',
    backgroundColor: 'white',
    color: '#79ca25',
    fontWeight: 'bold',
    '&.MuiButton-root:hover': {
      bgcolor: '#F4F4F4',
      borderColor: '#79ca25'
    }
  },
  table: {
    minWidth: 750,
    borderCollapse: 'separate',
    borderSpacing: '0px 10px'
  },
  headerRow: {
    borderRadius: 10,
    mb: 1,
    'th:first-child': {
      borderRadius: '10px 0 0 10px'
    },
    'th:last-child': {
      borderRadius: '0 10px 10px 0'
    }
  },
  row: {
    backgroundColor: '#FBFBFB',
    borderRadius: 10,
    mb: 1,
    'td:first-child': {
      borderRadius: '10px 0 0 10px'
    },
    'td:last-child': {
      borderRadius: '0 10px 10px 0'
    }
  },
  headCell: {
    border: 'none',
    fontWeight: 'bold'
  },
  bodyCell: {
    border: 'none'
  },
  typo: {
    color: 'grey',
    fontSize: 14,
    display: 'flex'
  },
  textField: {
    borderRadius: '10px',
    fontWeight: '500',
    '& .MuiOutlinedInput-input': {
      padding: '10px'
    }
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '34%',
    height: 'fit-content',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: 5
  },
  textArea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    borderColor: '#ACACAC',
    borderRadius: 5
  },
  formButton: {
    width: '150px',
    borderRadius: 5,
    backgroundColor: '#79CA25',
    color: 'white',
    '&.MuiButton-root:hover': {
      backgroundColor: '#7AD123'
    }
  },
  borderRadius: '10px',
  fontWeight: '500',
  '& .MuiOutlinedInput-input': {
    padding: '15px 20px',
    margin: 0
  },
  inputState: {
    '& .MuiInputLabel-root': {
      color: '#ACACAC'
      /* Add any other custom styles here */
    },
    '& .MuiOutlinedInput-root': {
      margin: 0,
      '&:not(.Mui-disabled):hover fieldset': {
        borderColor: '#79CA25'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#79CA25'
      }
    }
  }
}

export default CompanyManage
