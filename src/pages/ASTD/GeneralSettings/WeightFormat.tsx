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
import { returnErrorMsg, ImageToBase64, showSuccessToast, showErrorToast } from '../../../utils/utils'
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
import { updateWeightTolerance } from '../../../APICalls/ASTD/weight'

interface WeightToleranceProps {
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  weightVariance: string
  weightVarianceId: number
}

interface DateFormatProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string) => void
  weightformat: WeightToleranceProps | null
}

const WeightFormat: FunctionComponent<DateFormatProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  weightformat,
}) => {
  const { t } = useTranslation()
  const [weightFormat, setWeightFormat] = useState('')
  const [weightFormatId, setWeightFormatId] = useState(0)
  const [showError, setShowError] = useState<boolean>(false)
  
  useEffect (() => {
    if (action === 'edit') {
      if (weightformat) {
        setShowError(false)
        setWeightFormat(weightformat.weightVariance)
        setWeightFormatId(weightformat.weightVarianceId)
      }
    }
  }, [weightformat, action, drawerOpen])

  const resetData = () => {
    setWeightFormat('')
  }
  

  const checkString = (s: string) => {
    return s === ''
  }

  const handleSubmit = () => {
    const loginId = localStorage.getItem(localStorgeKeyName.username) || ""
    const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ""

    const formData = {
      weightVariance: weightFormat,
      updatedBy: loginId
    }

    if (weightFormat.trim() === '') {
      showErrorToast(t('notify.errorCreated')); 
      setShowError(true);
      return;
    } else if (formData) {
      handleUpdateWeight(formData)
    }
  }

  const handleUpdateWeight = async (formData: any) => {
    const result = await updateWeightTolerance(weightFormatId, formData)
    
    if(result) {
      onSubmitData("weight")
      resetData()
      showSuccessToast(t('notify.SuccessEdited'))
    } else {
      showErrorToast(t('notify.errorEdited'))
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
          title: t('general_settings.weight_tolerance'),
          submitText: t('add_warehouse_page.save'),
          cancelText: '',
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
        }}
      >
        <Divider></Divider>
        <Box sx={{ marginX: 2 }}>
          <Box sx={{marginY: 2}}>
            <CustomField label={t('general_settings.weight_tolerance')}>
              <CustomTextField
                id="weightFormat"
                value={weightFormat}
                disabled={action === 'delete'}
                placeholder={t('general_settings.weight_tolerance')}
                onChange={(event) => setWeightFormat(event.target.value)}
                error={showError}
              />
            </CustomField>
          </Box>
          {showError && (
            <FormErrorMsg
              key={0}
              field={t('general_settings.weight_tolerance')}
              errorMsg={t('form.error.shouldNotBeEmpty')}
              type={'error'}
            />
            )
          }
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

export default WeightFormat
