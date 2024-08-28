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
import { updateDateFormat, getAllDateFormat } from '../../../APICalls/ASTD/date'
import { useNavigate } from 'react-router-dom'
interface DateFormat {
  createdAt: string
  createdBy: string
  dateFormat: string
  dateFormatId: number
  updatedAt: string
  updatedBy: string
}

interface DateFormatProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string) => void
  dateformat: DateFormat | null
}

const DateFormat: FunctionComponent<DateFormatProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  dateformat,
}) => {
  const { t } = useTranslation()
  const [dateFormat, setDateFormat] = useState('')
  const [dateFormatList, setDateFormatList] = useState<DateFormat[]>([])
  const [dateFormatId, setDateFormatId] = useState(0)
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const navigate = useNavigate();
  
  useEffect (() => {
    fetchDateFormats()
    if (action === 'edit') {
      if (dateformat) {
        setDateFormat(dateformat.dateFormat)
        setDateFormatId(dateformat.dateFormatId)
      }
    }
  }, [dateformat, action, drawerOpen])

  const resetData = () => {
    setDateFormat('')
  }
  
  const fetchDateFormats = async () => {
    try {
      const response = await getAllDateFormat()
    if (response) {
      const data = response.data
      const dateList: DateFormat[] = []
      data.forEach((item: any) => {
        dateList.push({
          createdAt: item.createdAt,
          createdBy: item.createdBy,
          dateFormat: item.dateFormat,
          dateFormatId: item.dateFormatId,
          updatedAt: item.updatedAt,
          updatedBy: item.updatedBy,
        })
      })
      setDateFormatList(dateList);
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
      handleUpdateDateFormat(formData)
    }
  }
  const handleUpdateDateFormat = async (formData: any) => {
   try {
    const result = await updateDateFormat(dateFormatId, formData)

    if (result) {
      onSubmitData("date")
      resetData()
      showSuccessToast(t('notify.SuccessEdited'))
    } else {
      showErrorToast(t('notify.errorEdited'))
    }
   } catch (error:any) {
    const {state } = extractError(error);
    if(state.code === STATUS_CODE[503] ){
      navigate('/maintenance')
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
          cancelText: '',
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
        }}
      >
        <Divider></Divider>
        <Box sx={{ marginX: 2 }}>
          <Box sx={{marginY: 2}}>
            <CustomField label={t('general_settings.date_format')}>
              <Autocomplete
                disablePortal
                id="dateFormat"
                defaultValue={dateFormat}
                options={dateFormatList.map((functionItem) => functionItem.dateFormat)}
                onChange={(event, value) => {
                  if (value) {
                    const selectedDateFormat = dateFormatList.find((item) => item.dateFormat === value);
                      if (selectedDateFormat) {
                        setDateFormat(selectedDateFormat.dateFormat);
                        setDateFormatId(selectedDateFormat.dateFormatId);
                      }
                    }
                }}
                value={dateFormat}
                disabled={action === 'delete'}
                renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={t('general_settings.date_format')}
                    sx={[styles.textField, { width: 320 }]}
                    InputProps={{
                    ...params.InputProps,
                    sx: styles.inputProps
                    }}
                    error={checkString(dateFormat)}
                />
                )}
                noOptionsText={t('common.noOptions')}
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

export default DateFormat
