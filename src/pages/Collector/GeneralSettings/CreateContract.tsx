import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Divider, Grid } from '@mui/material'
import dayjs from 'dayjs'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { EVENT_RECORDING } from '../../../constants/configs'
import { styles } from '../../../constants/styles'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'

import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import {
  Vehicle,
  CreateVehicle as CreateVehicleForm
} from '../../../interfaces/vehicles'
import { STATUS_CODE, formErr, format } from '../../../constants/constant'
import { extractError, returnErrorMsg } from '../../../utils/utils'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import { localStorgeKeyName } from '../../../constants/constant'
import i18n from '../../../setups/i18n'
import {
  Contract,
  CreateContract as CreateContractProps
} from '../../../interfaces/contract'
import LabelField from '../../../components/FormComponents/CustomField'
import Switcher from '../../../components/FormComponents/CustomSwitch'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
  createContract,
  editContract,
  deleteContract
} from '../../../APICalls/Collector/contracts'
import { useNavigate } from 'react-router-dom'

interface CreateVehicleProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  rowId?: number
  selectedItem?: Contract | null
  contractList: Contract[]
}

const CreateContract: FunctionComponent<CreateVehicleProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  rowId,
  selectedItem,
  contractList = []
}) => {
  const { t } = useTranslation()
  const [contractNo, setContractNo] = useState('')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [contractStatus, setContractStatus] = useState(false)
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs())
  const [endDate, setEndDate] = useState<dayjs.Dayjs>(dayjs())
  const [remark, setRemark] = useState('')
  const [whether, setWhether] = useState(false)
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const [existingContract, setExistingContract] = useState<Contract[]>([])
  const navigate = useNavigate();

  useEffect(() => {
    resetData()
    if (action === 'edit') {
      if (selectedItem !== null && selectedItem !== undefined) {
        setContractNo(selectedItem?.contractNo)
        setReferenceNumber(selectedItem?.parentContractNo)
        setContractStatus(selectedItem?.status === 'ACTIVE' ? true : false)
        setStartDate(dayjs(selectedItem?.contractFrmDate))
        setEndDate(dayjs(selectedItem?.contractToDate))
        setRemark(selectedItem?.remark)
        setWhether(selectedItem?.epdFlg)

        setExistingContract(
          contractList.filter(
            (item) => item.contractNo != selectedItem.contractNo
          )
        )
      }
    } else if (action === 'add') {
      resetData()
      setExistingContract(contractList)
    }
  }, [selectedItem, action, drawerOpen])

  const resetData = () => {
    setContractNo('')
    setReferenceNumber('')
    setContractStatus(false)
    setStartDate(dayjs())
    setEndDate(dayjs())
    setRemark('')
    setValidation([])
    setWhether(false)
    setTrySubmited(false)
  }

  useEffect(() => {
    const validate = async () => {
      const tempV: formValidate[] = []

      contractNo.toString() == '' &&
        tempV.push({
          field: t('general_settings.name'),
          problem: formErr.empty,
          type: 'error'
        })
      existingContract.forEach((item) => {
        if (item.contractNo.toLowerCase() === contractNo.toLowerCase()) {
          tempV.push({
            field: t('general_settings.name'),
            problem: formErr.alreadyExist,
            type: 'error'
          })
        }
      })
      startDate > endDate &&
        tempV.push({
          field: t('general_settings.start_date'),
          problem: formErr.startDateBehindEndDate,
          type: 'error'
        })
      endDate < startDate &&
        tempV.push({
          field: t('general_settings.end_date'),
          problem: formErr.endDateEarlyThanStartDate,
          type: 'error'
        })

      setValidation(tempV)
    }

    validate()
  }, [contractNo, startDate, endDate, i18n])

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  const handleSubmit = () => {
    const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
    const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ''

    const formData: CreateContractProps = {
      tenantId: tenantId,
      contractNo: contractNo,
      parentContractNo: referenceNumber,
      status: contractStatus === true ? 'ACTIVE' : 'INACTIVE',
      contractFrmDate: startDate.format('YYYY-MM-DD'),
      contractToDate: endDate.format('YYYY-MM-DD'),
      remark: remark,
      epdFlg: whether,
      createdBy: loginId,
      updatedBy: loginId
    }

    if (action == 'add') {
      handleCreateContract(formData)
    } else if (action == 'edit') {
      handleEditContract(formData)
    } else if (action === 'delete') {
      handleDelete()
    }
  }

  const handleCreateContract = async (formData: CreateContractProps) => {
    try {
      if (validation.length === 0) {
        const result = await createContract(formData)
        if (result) {
          onSubmitData('success', t('common.saveSuccessfully'))
          resetData()
          handleDrawerClose()
        } else {
          onSubmitData('error', t('common.saveFailed'))
        }
      } else {
        setTrySubmited(true)
      }
    } catch (error:any) {
      const { state, realm} = extractError(error);
      if(state.code === STATUS_CODE[503] || !error?.response){
        navigate('/maintenance')
      } else {
        onSubmitData('error', t('common.saveFailed'))
      }
    }
  }

  const handleEditContract = async (formData: CreateContractProps) => {
    try {
      if (validation.length === 0) {
        const result = await editContract(formData)
        if (result) {
          onSubmitData('success', t('common.editSuccessfully'))
          resetData()
          handleDrawerClose()
        }
      } else {
        setTrySubmited(true)
      }
    } catch (error:any) {
      const { state, realm} = extractError(error);
      if(state.code === STATUS_CODE[503] || !error?.response){
        navigate('/maintenance')
      }
    }
  }

  const handleDelete = async () => {
    try {
      const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
      const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ''
  
      const formData: any = {
        // tenantId: tenantId,
        // contractNo: contractNo,
        // parentContractNo: referenceNumber,
        status: 'DELETED',
        // contractFrmDate: startDate.format('YYYY-MM-DD'),
        // contractToDate: endDate.format('YYYY-MM-DD'),
        // remark: remark,
        // epdFlg: whether,
        // createdBy: loginId,
        updatedBy: loginId
      }
      if (selectedItem != null) {
        const result = await deleteContract(formData, selectedItem.contractNo)
        if (result) {
          onSubmitData('success', t('common.deletedSuccessfully'))
          resetData()
          handleDrawerClose()
        } else {
          onSubmitData('error', t('common.deleteFailed'))
        }
      }
    } catch (error:any) {
      const { state, realm} = extractError(error);
      if(state.code === STATUS_CODE[503] || !error?.response){
        navigate('/maintenance')
      } else {
        onSubmitData('error', t('common.deleteFailed'))
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
          title:
            action == 'add'
              ? t('top_menu.add_new')
              : action == 'delete'
              ? t('common.delete')
              : selectedItem?.contractNo,
          subTitle: t('general_settings.contracts'),
          submitText: t('add_warehouse_page.save'),
          cancelText: t('add_warehouse_page.delete'),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
          onDelete: handleDelete
        }}
      >
        <Divider></Divider>
        <Box sx={{ marginX: 2 }}>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('general_settings.name')}>
              <CustomTextField
                id="contractNo"
                value={contractNo}
                disabled={action != 'add'}
                placeholder={t('general_settings.name')}
                onChange={(event) =>
                  setContractNo(event.target.value)
                }
                error={checkString(contractNo)}
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('general_settings.reference_number')}>
              <CustomTextField
                id="referenceNumber"
                value={referenceNumber}
                disabled={action === 'delete'}
                placeholder={t('general_settings.reference_number')}
                onChange={(event) => setReferenceNumber(event.target.value)}
              />
            </CustomField>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center">
              <LabelField label={t('general_settings.state')} />
              <Switcher
                onText={t('general_settings.activate')}
                offText={t('general_settings.deactive')}
                disabled={action === 'delete'}
                defaultValue={contractStatus}
                setState={(newValue) => {
                  setContractStatus(newValue)
                }}
              />
            </div>
          </Box>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="zh-cn"
          >
            <Box
              className="filter-date"
              sx={{
                marginY: 2,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly'
              }}
            >
              <Box sx={{ ...localstyles.DateItem, flexDirection: 'column' }}>
                <LabelField label={t('general_settings.start_date')} />
                <DatePicker
                  defaultValue={dayjs(startDate)}
                  format={format.dateFormat2}
                  onChange={(value) => setStartDate(value!!)}
                  sx={{ ...localstyles.datePicker }}
                />
              </Box>
              <Box sx={{ ...localstyles.DateItem, flexDirection: 'column' }}>
                <LabelField label={t('general_settings.end_date')} />
                <DatePicker
                  defaultValue={dayjs(endDate)}
                  format={format.dateFormat2}
                  onChange={(value) => setEndDate(value!!)}
                  sx={{ ...localstyles.datePicker }}
                />
              </Box>
            </Box>
          </LocalizationProvider>
          <CustomField label={t('common.remark')} mandatory={false}>
            <CustomTextField
              id="remark"
              value={remark}
              placeholder={t('common.remark')}
              onChange={(event) => setRemark(event.target.value)}
              multiline={true}
            />
          </CustomField>
          <Box sx={{ marginY: 2 }}>
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center">
              <LabelField label={t('general_settings.whether')} />
              <Switcher
                onText={t('general_settings.true')}
                offText={t('general_settings.false')}
                disabled={action === 'delete'}
                defaultValue={whether}
                setState={(newValue) => {
                  setWhether(newValue)
                }}
              />
            </div>
          </Box>
          <Grid item>
            {trySubmited &&
              validation.map((val, index) => (
                <FormErrorMsg
                  key={index}
                  field={t(val.field)}
                  errorMsg={returnErrorMsg(val.problem, t)}
                  type={val.type}
                />
              ))}
          </Grid>
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

export default CreateContract
