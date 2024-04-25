import { FunctionComponent, useState, useEffect } from 'react'
import {
  Box,
  Divider,
  Grid,
  Typography,
  Button,
  InputLabel,
  MenuItem,
  Card,
  FormControl,
  ButtonBase,
  ImageList,
  ImageListItem,
  OutlinedInput
} from '@mui/material'
import dayjs from 'dayjs'
import { CAMERA_OUTLINE_ICON } from '../../../themes/icons'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { EVENT_RECORDING } from '../../../constants/configs'
import { styles } from '../../../constants/styles'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'

import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import { Vehicle, CreateVehicle as CreateVehicleForm } from '../../../interfaces/vehicles'
import { formErr, format } from '../../../constants/constant'
import { returnErrorMsg, ImageToBase64, showErrorToast, showSuccessToast, returnApiToken } from '../../../utils/utils'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import { createVehicles as addVehicle, deleteVehicle, editVehicle } from '../../../APICalls/Collector/vehicles'
import { localStorgeKeyName } from "../../../constants/constant";
import i18n from '../../../setups/i18n'
import { Contract, CreateContract as CreateContractProps } from '../../../interfaces/contract'
import LabelField from '../../../components/FormComponents/CustomField'
import Switcher from '../../../components/FormComponents/CustomSwitch'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { createContract, editContract } from '../../../APICalls/Collector/contracts'
import { createCurrency, deleteCurrency, editCurrency } from '../../../APICalls/ASTD/currrency'

interface CurrencyListProps {
  createdAt: string
  createdBy: string
  monetary: string
  monetaryId: number
  status: string
  updatedAt: string
  updatedBy: string
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
  selectedItem,
}) => {
  const { t } = useTranslation()
  const [monetary, setMonetary] = useState<string>('')
  const [remark, setRemark] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<{field: string; error: string}[]>([])

  
  useEffect (() => {
    if (action === 'edit') {
      if (selectedItem !== null && selectedItem !== undefined) {
        setMonetary(selectedItem.monetary)
        // setRemark(selectedItem.remark)
      }
    }
  }, [selectedItem, action, drawerOpen])

  const resetData = () => {
    setMonetary('')
    setRemark('')
    setDescription('')
  }
  

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  const handleDelete = async () => {
    const token = returnApiToken()
    const currencyForm = {
      status: 'INACTIVE',
      updatedBy: token.loginId
    }
    if (selectedItem !== null && selectedItem !== undefined ) {
      try {
        const response = await deleteCurrency(selectedItem?.monetaryId, currencyForm)
        if (response) {
          onSubmitData('currency')
          showSuccessToast(t('notify.successDeleted'))
        }
      } catch (error) {
        console.error(error)
        showErrorToast(t('notify.errorDeleted'))
      }
    }
  }

  const handleSubmit = () => {
    const loginId = localStorage.getItem(localStorgeKeyName.username) || ""

    const currencyProps = {
      monetary: monetary,
      status: 'ACTIVE',
      createdBy: loginId,
      updatedBy: loginId
    }

    if (validation.length == 0) {
      action == 'add' ? createCurrencyData(currencyProps) : editCurrencyData(currencyProps)

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
      }
    } catch (error) {
      console.error(error)
      showErrorToast(t('errorCreated.errorCreated'))
    }
  }


 const editCurrencyData = async (data: any) => {
  if (selectedItem !== null && selectedItem !== undefined) {
    try {
      const response = await editCurrency(selectedItem?.monetaryId, data)
      if (response) {
        onSubmitData('currency')
        showSuccessToast(t('notify.successEdited'))
      }
    } catch (error) {
      console.error(error)
        showErrorToast(t('errorCreated.errorEdited'))
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
          title: t('general_settings.date_format'),
          submitText: t('add_warehouse_page.save'),
          cancelText: t('add_warehouse_page.delete'),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
          onDelete: handleDelete,
        }}
      >
        <Divider></Divider>
        <Box sx={{ marginX: 2 }}>
          <Box sx={{marginY: 2}}>
            <CustomField label={t('general_settings.date_format')}>
              <CustomTextField
                id="monetary"
                value={monetary}
                disabled={action === 'delete'}
                placeholder={t('general_settings.date_format')}
                onChange={(event) => setMonetary(event.target.value)}
                error={checkString(monetary)}
              />
            </CustomField>
          </Box>
          <Box sx={{marginY: 2}}>
            <CustomField label={t('common.remark')}>
              <CustomTextField
                id="remark"
                value={remark}
                disabled={action === 'delete'}
                placeholder={t('common.remark')}
                onChange={(event) => setMonetary(event.target.value)}
                error={checkString(monetary)}
              />
            </CustomField>
          </Box>
          <Box sx={{marginY: 2}}>
            <CustomField label={t('common.description')}>
              <CustomTextField
                id="description"
                value={description}
                disabled={action === 'delete'}
                placeholder={t('common.description')}
                onChange={(event) => setMonetary(event.target.value)}
                error={checkString(monetary)}
              />
            </CustomField>
          </Box>
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
      color: '#79CA25',
    }
  },
  DateItem: {
    display: 'flex',
    height: 'fit-content',
  }
}

export default CreateCurrency
