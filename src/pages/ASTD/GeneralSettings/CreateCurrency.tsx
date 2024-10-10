import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Divider } from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { styles } from '../../../constants/styles'
import { useTranslation } from 'react-i18next'
import {
  showErrorToast,
  showSuccessToast,
  returnApiToken,
  extractError
} from '../../../utils/utils'
import { STATUS_CODE, localStorgeKeyName } from '../../../constants/constant'
import {
  createCurrency,
  deleteCurrency,
  editCurrency
} from '../../../APICalls/ASTD/currrency'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { useNavigate } from 'react-router-dom'

interface CurrencyListProps {
  createdAt: string
  createdBy: string
  monetary: string
  monetaryId: number
  description: string
  remark: string
  status: string
  updatedAt: string
  updatedBy: string
  version: number
}

interface CreateCurrencyProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string) => void
  selectedItem: CurrencyListProps | null
}

const CreateCurrency: FunctionComponent<CreateCurrencyProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  selectedItem
}) => {
  const { t } = useTranslation()
  const [monetary, setMonetary] = useState<string>('')
  const [remark, setRemark] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<
    { field: string; error: string }[]
  >([])
  const [showError, setShowError] = useState<boolean>(false)
  const [version, setVersion] = useState<number>(0)
  const navigate = useNavigate()

  useEffect(() => {
    resetData()
    setShowError(false)
    if (action === 'edit' || action === 'delete') {
      if (selectedItem !== null && selectedItem !== undefined) {
        setMonetary(selectedItem.monetary)
        setRemark(selectedItem.remark)
        setDescription(selectedItem.description)
        setVersion(selectedItem.version)
      }
    }
  }, [selectedItem, action, drawerOpen])

  const resetData = () => {
    setMonetary('')
    setRemark('')
    setDescription('')
    setVersion(0)
  }

  const checkString = (s: string) => {
    return s == ''
  }

  const isInputFieldsEmpty = () => {
    const isEmpty = !monetary || !description || !remark
    return isEmpty
  }

  const handleDelete = async () => {
    const token = returnApiToken()
    const currencyForm = {
      status: 'INACTIVE',
      updatedBy: token.loginId,
      version: version
    }
    if (selectedItem !== null && selectedItem !== undefined) {
      try {
        const response = await deleteCurrency(
          selectedItem?.monetaryId,
          currencyForm
        )
        if (response) {
          onSubmitData('currency')
          showSuccessToast(t('notify.successDeleted'))
          resetData()
        }
      } catch (error: any) {
        const { state } = extractError(error)
        if (state.code === STATUS_CODE[503]) {
          navigate('/maintenance')
        } else if (state.code === STATUS_CODE[409]) {
          showErrorToast(error.response.data.message)
        }
      }
    }
  }

  const handleSubmit = () => {
    const loginId = localStorage.getItem(localStorgeKeyName.username) || ''

    const currencyProps = {
      monetary: monetary,
      description: description,
      remark: remark,
      status: selectedItem?.status ?? 'ACTIVE',
      createdBy: loginId,
      updatedBy: loginId,
      ...(action === 'edit' && { version: version })
    }
    if (isInputFieldsEmpty()) {
      setShowError(true)
    } else if (validation.length === 0) {
      action === 'add'
        ? createCurrencyData(currencyProps)
        : editCurrencyData(currencyProps)

      setValidation([])
    } else {
      setTrySubmited(true)
    }
  }

  const createCurrencyData = async (data: any) => {
    try {
      const response = await createCurrency(data)
      if (response) {
        onSubmitData('currency')
        showSuccessToast(t('notify.successCreated'))
        resetData()
      }
    } catch (error: any) {
      const { state } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      } else {
        showErrorToast(t('errorCreated.errorCreated'))
      }
    }
  }

  const editCurrencyData = async (data: any) => {
    if (selectedItem !== null && selectedItem !== undefined) {
      try {
        const response = await editCurrency(selectedItem?.monetaryId, data)
        if (response) {
          onSubmitData('currency')
          showSuccessToast(t('notify.SuccessEdited'))
          resetData()
        }
      } catch (error: any) {
        const { state } = extractError(error)
        if (state.code === STATUS_CODE[503]) {
          navigate('/maintenance')
        } else if (state.code === STATUS_CODE[409]) {
          showErrorToast(error.response.data.message)
        }
      }
    }
  }

  return (
    <div className="add-vehicle">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={action}
        headerProps={{
          title: t('general_settings.currency_category'),
          submitText: t('add_warehouse_page.save'),
          cancelText: t('add_warehouse_page.delete'),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
          onDelete: handleDelete,
          deleteText: t('common.deleteMessage')
        }}
      >
        <Divider></Divider>
        <Box sx={{ marginX: 2 }}>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('general_settings.name')} mandatory>
              <CustomTextField
                id="monetary"
                value={monetary}
                dataTestId="astd-currency-form-name-input-field-5357"
                disabled={action === 'delete'}
                placeholder={t('general_settings.enter_name')}
                onChange={(event) => setMonetary(event.target.value)}
                error={showError && checkString(monetary)}
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('general_settings.remark')} mandatory>
              <CustomTextField
                id="remark"
                dataTestId="astd-currency-form-remark-input-field-4081"
                value={remark}
                disabled={action === 'delete'}
                placeholder={t('general_settings.enter_remark')}
                onChange={(event) => setRemark(event.target.value)}
                error={showError && checkString(remark)}
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('general_settings.introduction')} mandatory>
              <CustomTextField
                id="description"
                dataTestId="astd-currency-form-description-input-field-6886"
                value={description}
                disabled={action === 'delete'}
                placeholder={t('general_settings.enter_remark')}
                onChange={(event) => setDescription(event.target.value)}
                error={showError && checkString(description)}
              />
            </CustomField>
          </Box>
          {showError && checkString(monetary) && (
            <FormErrorMsg
              field={t('general_settings.name')}
              dataTestId="astd-currency-form-name-err-warning-1499"
              errorMsg={t('form.error.shouldNotBeEmpty')}
              type={'error'}
            />
          )}
          {showError && checkString(remark) && (
            <FormErrorMsg
              field={t('common.remark')}
              dataTestId="astd-currency-form-remark-err-warning-9355"
              errorMsg={t('form.error.shouldNotBeEmpty')}
              type={'error'}
            />
          )}
          {showError && checkString(description) && (
            <FormErrorMsg
              field={t('common.description')}
              dataTestId="astd-currency-form-description-err-warning-2933"
              errorMsg={t('form.error.shouldNotBeEmpty')}
              type={'error'}
            />
          )}
        </Box>
      </RightOverlayForm>
    </div>
  )
}

const localstyles = {
  textField: {
    borderRadius: '10px',
    fontWeight: '500',
    '& .MuiOutlinedInput-input': {
      padding: '10px'
    }
  },
  imagesContainer: {
    width: '100%',
    height: 'fit-content'
  },
  image: {
    aspectRatio: '1/1',
    width: '100px',
    borderRadius: 2
  },
  cardImg: {
    borderRadius: 2,
    backgroundColor: '#E3E3E3',
    width: '100%',
    height: 150,
    boxShadow: 'none'
  },
  btnBase: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 10
  },
  imgError: {
    border: '1px solid red'
  },
  datePicker: {
    ...styles.textField,
    width: '250px',
    '& .MuiIconButton-edgeEnd': {
      color: '#79CA25'
    }
  },
  DateItem: {
    display: 'flex',
    height: 'fit-content'
  }
}

export default CreateCurrency
