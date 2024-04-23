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
import { returnErrorMsg, ImageToBase64 } from '../../../utils/utils'
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

interface DateFormatProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  weightformat: string
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
  const [trySubmited, setTrySubmited] = useState<boolean>(false)

  
  useEffect (() => {
    if (action === 'edit') {
      if (weightformat) {
        setWeightFormat(weightFormat)
      }
    }
  }, [weightformat, action, drawerOpen])

  const resetData = () => {
    setWeightFormat('')
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

    // const formData: CreateContractProps = {
    //   tenantId: tenantId,
    //   contractNo: contractNo,
    //   parentContractNo: referenceNumber,
    //   status: contractStatus === true ? 'ACTIVE' : 'INACTIVE',
    //   contractFrmDate: startDate.format('YYYY-MM-DD'),
    //   contractToDate: endDate.format('YYYY-MM-DD'),
    //   remark: remark,
    //   epdFlg: whether,
    //   createdBy: loginId,
    //   updatedBy: loginId
    // }

    // if (action == 'add') {
    //   handleCreateContract(formData)
    // } else if (action == 'edit') {
    //   handleEditContract(formData)
    // }
  }

  const handleCreateContract = async (formData: CreateContractProps) => {
      const result = await createContract(formData)
      if(result) {
        onSubmitData("success", t("common.saveSuccessfully"))
        resetData()
        handleDrawerClose()
      }else{
        onSubmitData("error", t("common.saveFailed"))
      }
  }

  const handleEditContract = async (formData: CreateContractProps) => {
    const result = await editContract(formData)
    if(result) {
      onSubmitData("success", t("common.editSuccessfully"))
      resetData()
      handleDrawerClose()
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
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
        }}
      >
        <Divider></Divider>
        <Box sx={{ marginX: 2 }}>
          <Box sx={{marginY: 2}}>
            <CustomField label={t('general_settings.date_format')}>
              <CustomTextField
                id="contractNo"
                value={weightFormat}
                disabled={action === 'delete'}
                placeholder={t('general_settings.date_format')}
                onChange={(event) => setWeightFormat(event.target.value)}
                error={checkString(weightFormat)}
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

export default WeightFormat
