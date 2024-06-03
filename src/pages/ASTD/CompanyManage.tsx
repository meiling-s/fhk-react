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
  Alert
} from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridCellParams
} from '@mui/x-data-grid'
import { ADD_PERSON_ICON, SEARCH_ICON } from '../../themes/icons'
import { SyntheticEvent, useEffect, useState } from 'react'
import { visuallyHidden } from '@mui/utils'
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
import CustomAutoComplete from '../../components/FormComponents/CustomAutoComplete'
import { extractError, returnApiToken, showErrorToast } from '../../utils/utils'
import { ToastContainer } from 'react-toastify'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../contexts/CommonTypeContainer'

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
  const navigate = useNavigate();

  const reasons: il_item[] = [
    {
      id: '1',
      name: t('tenant.photo_blury')
    },
    {
      id: '2',
      name: t('tenant.bussniess_error')
    }
  ]

  const handleRejectRequest = async () => {
    try {
      const statData: UpdateStatus = {
        status: 'REJECTED',
        updatedBy: 'admin'
      }

      const result = await updateTenantStatus(statData, tenantId)
      const data = result?.data
      if (data) {
        // console.log('reject success success')
        onSubmit()
      }
    } catch (error:any) {
      const { state, realm} =  extractError(error);
      if(state.code === STATUS_CODE[503] ){
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
              Are you sure to reject the T0001 application?
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ paddingX: 3, paddingTop: 3 }}>
            <Typography sx={localstyles.typo}>
              {t('check_out.reject_reasons')}
            </Typography>
            <CustomItemList items={reasons} multiSelect={setRejectReasonId} />
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

  const sendInvitation = async () => {
    const titleInv = 'Invitation Tenant Account'
    const content = `are u invited to register as tenant member , ${
      defaultPath.tenantRegisterPath + id
    }`

    const result = await sendEmailInvitation(email, titleInv, content)
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
                setEmail(event.target.value)
              }}
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
              value={defaultPath.tenantRegisterPath + id}
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
                          defaultPath.tenantRegisterPath + id
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
}

function InviteForm({ open, isLoading, onClose, onSubmitForm }: inviteForm) {
  const { t } = useTranslation()
  const [submitable, setSubmitable] = useState<boolean>(false)

  const validateSchema = Yup.object().shape({
    companyNumber: Yup.number().required(
      `${t('tenant.invite_form.company_number')} is required`
    ),
    companyCategory: Yup.string().required(
      `${t('tenant.invite_form.company_category')} is required`
    ),
    companyZhName: Yup.string().required(
      `${t('tenant.invite_form.company_zh_name')} is required`
    ),
    companyCnName: Yup.string().required(
      `${t('tenant.invite_form.company_cn_name')} is required`
    ),
    companyEnName: Yup.string().required(
      `${t('tenant.invite_form.company_en_name')} is required`
    ),
    bussinessNumber: Yup.string().required(
      `${t('tenant.invite_form.bussiness_number')} is required`
    ),
    remark: Yup.string().required(
      `${t('tenant.invite_form.remark')} is required`
    )
  })

  const initialValues = {
    tenantId: 0,
    companyNumber: '',
    companyCategory: '',
    companyZhName: '',
    companyCnName: '',
    companyEnName: '',
    bussinessNumber: '',
    effFrmDate: '',
    effToDate: '',
    remark: ''
  }

  const formik = useFormik<InviteTenant>({
    initialValues,
    validationSchema: validateSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmitForm(values)
        resetForm()
        onClose && onClose()
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
      error: formik.errors.companyNumber && formik.touched.companyNumber
    },
    {
      label: t('tenant.invite_form.company_category'),
      placeholder: t('tenant.invite_form.enter_company_category'),
      id: 'companyCategory',
      value: formik.values.companyCategory,
      error: formik.errors.companyCategory && formik.touched.companyCategory,
      options: ['Collector', 'Logistic', 'Manufacturer', 'Customer']
    },
    {
      label: t('tenant.invite_form.company_zh_name'),
      placeholder: t('tenant.invite_form.enter_company_zh_name'),
      id: 'companyZhName',
      value: formik.values.companyZhName,
      error: formik.errors.companyZhName && formik.touched.companyZhName
    },
    {
      label: t('tenant.invite_form.company_cn_name'),
      placeholder: t('tenant.invite_form.enter_company_cn_name'),
      id: 'companyCnName',
      value: formik.values.companyCnName,
      error: formik.errors.companyCnName && formik.touched.companyCnName
    },
    {
      label: t('tenant.invite_form.company_en_name'),
      placeholder: t('tenant.invite_form.enter_company_en_name'),
      id: 'companyEnName',
      value: formik.values.companyEnName,
      error: formik.errors.companyEnName && formik.touched.companyEnName
    },
    {
      label: t('tenant.invite_form.bussiness_number'),
      placeholder: t('tenant.invite_form.enter_bussiness_number'),
      id: 'bussinessNumber',
      value: formik.values.bussinessNumber,
      error: formik.errors.bussinessNumber && formik.touched.bussinessNumber
    }
  ]

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    formik.handleSubmit()
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
                width: '40%',
                overflowY: 'auto'
              }
            ]}
          >
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
              <Box sx={{ paddingX: 3, paddingTop: 3 }}>
                {TextFields.map((t, index) => (
                  <Grid item sx={{ marginBottom: 3 }} key={index}>
                    <CustomField mandatory label={t.label}>
                      {t.id === 'companyCategory' ? (
                        <CustomAutoComplete
                          placeholder={t.placeholder}
                          option={t.options?.map((option) => option)}
                          sx={{ width: '100%' }}
                          onChange={(
                            _: SyntheticEvent,
                            newValue: string | null
                          ) => {
                            formik.setFieldValue('companyCategory', newValue)
                          }}
                          value={t.value}
                          inputValue={t.value}
                          error={t.error || undefined}
                        />
                      ) : t.id === 'companyNumber' ? (
                        <Box>
                          <TextField
                            fullWidth
                            InputProps={{
                              sx: styles.textField
                            }}
                            label={t.placeholder}
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
                  {formik.errors.remark && formik.touched.remark && (
                    <Alert severity="error">{formik.errors.remark} </Alert>
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
                  提交
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
  const {dateFormat} = useContainer(CommonTypeContainer)
  const realmOptions = [
    {
      key: 'collector',
      label: 'Collector'
    },
    {
      key: 'logistic',
      label: 'Logistic'
    },
    {
      key: 'manufacturer',
      label: 'Manufacturer'
    },
    {
      key: 'customer',
      label: 'Customer'
    }
  ]
  const navigate = useNavigate();

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
      const data = result?.data
      if (data) {
        console.log('approve success')
        initCompaniesData()
      }
      window.location.reload()
      setOpenDetails(false)
    } catch (error:any) {
      const { state, realm } = extractError(error);
      if(state.code === STATUS_CODE[503] ){
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
    headerName: 'Select',
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
      width: 200
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
      type: 'string'
    },
    {
      field: 'createDate',
      headerName: t('tenant.created_date'),
      width: 150,
      type: 'string'
    },
    {
      field: 'accountNum',
      headerName: t('tenant.number_of_acc'),
      width: 150,
      type: 'string'
    },
    {
      field: 'action',
      headerName: '',
      width: 250,
      type: 'string',
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
          dayjs.utc(new Date(com?.createdAt)).tz('Asia/Hong_Kong').format(`${dateFormat} HH:mm`),
          0
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
    } catch (error:any) {
      const { state, realm } = extractError(error);
      if(state.code === STATUS_CODE[503] ){
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
    } catch (error:any) {
      const { state, realm } = extractError(error);
      if(state.code === STATUS_CODE[503] ){
        navigate('/maintenance')
      }
    }
  }

  const onRejectModal = () => {
    initCompaniesData()
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
    try {
      setIsLoadingInvite(true)
      const realmType =
        realmOptions.find((item) => item.label == formikValues.companyCategory)
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
      } else {
        showErrorToast('failed to create tenant')
        setIsLoadingInvite(false)
      }
    } catch (error:any) {
      const { state, realm} = extractError(error);
      if(state.code === STATUS_CODE[503] ){
        navigate('/maintenance')
      } else {
        showErrorToast('failed to create tenant')
        setIsLoadingInvite(false)
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
          onClick={() => setInvFormModal(true)}
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
          label={t('tenant.search')}
          placeholder={t('tenant.enter_company_number')}
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
          onClose={() => setInvFormModal(false)}
          onSubmitForm={onInviteFormSubmit}
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
