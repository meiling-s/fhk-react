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
  OutlinedInput,
  Autocomplete,
  TextField
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
import { STATUS_CODE, formErr, format } from '../../../constants/constant'
import { returnErrorMsg, ImageToBase64, showSuccessToast, showErrorToast, extractError } from '../../../utils/utils'
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
import { updateDecimalValue, getAllDecimalValue } from '../../../APICalls/ASTD/decimal'
import { useNavigate } from 'react-router-dom'
interface DecimalValueProps {
  createdAt: string
  createdBy: string
  decimalVal: string
  decimalValId: number
  updatedAt: string
  updatedBy: string
}

interface NumberFormatProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string) => void
  numberFormat: DecimalValueProps | null
}

const NumberFormat: FunctionComponent<NumberFormatProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  numberFormat,
}) => {
  const { t } = useTranslation()
  const [numFormat, setNumFormat] = useState('')
  const [decimalValId, setDecimalValId] = useState(0)
  const [decimalValList, setDecimalValList] = useState<DecimalValueProps[]>([])
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const navigate = useNavigate();
  
  useEffect (() => {
    fetchDecimalVal()
    if (action === 'edit') {
      if (numberFormat) {
        setNumFormat(numberFormat.decimalVal)
        setDecimalValId(numberFormat.decimalValId)
      }
    }
  }, [numberFormat, action, drawerOpen])

  const resetData = () => {
    setNumFormat('')
  }
  
  const fetchDecimalVal = async () => {
    try {
      const response = await getAllDecimalValue()
    if (response) {
      const data = response.data
      const decimalList: DecimalValueProps[] = []
      data.forEach((item: any) => {
        decimalList.push({
          createdAt: item.createdAt,
          createdBy: item.createdBy,
          decimalVal: item.decimalVal,
          decimalValId: item.decimalValId,
          updatedAt: item.updatedAt,
          updatedBy: item.updatedBy,
        })
      })
      setDecimalValList(decimalList);
      }
    } catch (error) {
      showErrorToast(t('notify.errorFetchingData'))
    }
  }

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  const handleSubmit = () => {
    const loginId = localStorage.getItem(localStorgeKeyName.username) || ""
    const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ""

    const formData = {
      status: "ACTIVE",
      updatedBy: loginId
    }

    if (formData) {
      handleUpdateDecimalValue(formData)
    }

  }

  const handleUpdateDecimalValue = async (formData: any) => {
      try {
        const result = await updateDecimalValue(formData, decimalValId)

        if(result) {
          onSubmitData("decimal")
          resetData()
          showSuccessToast(t('notify.SuccessEdited'))
        } else {
          showErrorToast(t('notify.errorEdited'))
        }
      } catch (error:any) {
        const {state} =  extractError(error);
        if(state.code === STATUS_CODE[503] ){
          navigate('/maintenance')
        } else {
          showErrorToast(t('notify.errorEdited'))
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
          title: t('general_settings.number_format'),
          submitText: t('add_warehouse_page.save'),
          cancelText: '',
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
        }}
      >
        <Divider></Divider>
        <Box sx={{ marginX: 2 }}>
          <Box sx={{marginY: 2}}>
            <CustomField label={t('general_settings.number_format')}>
              {/* <CustomTextField
                id="contractNo"
                value={numFormat}
                disabled={action === 'delete'}
                placeholder={t('general_settings.number_format')}
                onChange={(event) => setNumFormat(event.target.value)}
                error={checkString(numFormat)}
              /> */}
              <Autocomplete
                disablePortal
                id="numFormat"
                defaultValue={numFormat}
                options={decimalValList.map((functionItem) => functionItem.decimalVal)}
                onChange={(event, value) => {
                  if (value) {
                    const selecteddecimalVal = decimalValList.find((item) => item.decimalVal === value);
                      if (selecteddecimalVal) {
                        setNumFormat(selecteddecimalVal.decimalVal);
                        setDecimalValId(selecteddecimalVal.decimalValId);
                      }
                    }
                }}
                value={numFormat}
                disabled={action === 'delete'}
                renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={t('general_settings.number_format')}
                    sx={[styles.textField, { width: 320 }]}
                    InputProps={{
                    ...params.InputProps,
                    sx: styles.inputProps
                    }}
                    error={checkString(numFormat)}
                />
                )}
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

export default NumberFormat
