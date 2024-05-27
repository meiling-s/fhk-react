import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Divider, Grid, Autocomplete, TextField } from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import { editDenialReason, createDenialReason } from '../../../APICalls/Collector/denialReason'
import { styles } from '../../../constants/styles'
import { STATUS_CODE, formErr } from '../../../constants/constant'
import { extractError, returnErrorMsg } from '../../../utils/utils'
import { DenialReason, CreateDenialReason, UpdateDenialReason } from '../../../interfaces/denialReason'
import { localStorgeKeyName } from '../../../constants/constant'
import { getAllFunction } from '../../../APICalls/Collector/userGroup';
import i18n from '../../../setups/i18n'
import { useNavigate } from 'react-router-dom'

interface CreateDenialReasonProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  selectedItem?: DenialReason | null
}

interface FormValues {
  [key: string]: string
}

const DenialReasonDetail: FunctionComponent<CreateDenialReasonProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  selectedItem
}) => {
  const { t } = useTranslation()

  const initialFormValues = {
    reasonNameTchi: '',
    reasonNameSchi: '',
    reasonNameEng: '',
    functionId: '',
    description: '',
    remark: '',
  }
  const [formData, setFormData] = useState<FormValues>(initialFormValues)
  const [selectedFunctionId, setSelectedFunctionId] = useState<string>('')
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const loginName = localStorage.getItem(localStorgeKeyName.username) || ''
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ''
  const [functionList, setFunctionList] = useState<{ functionId: string; functionNameEng: string; functionNameSChi: string; reasonTchi: string; name: string; }[]>([]);
  const navigate = useNavigate();

  const initFunctionList = async () => {
   try {
    const result = await getAllFunction();
    const data = result?.data;
    if (data.length > 0) {
      let name = ''
      data.map((item: { functionId: string; functionNameEng: string; functionNameSChi: string; functionNameTChi: string; name: string; }) => {
        switch (i18n.language) {
          case 'enus':
            name = item.functionNameEng
            break
          case 'zhch':
            name = item.functionNameSChi
            break
          case 'zhhk':
            name = item.functionNameTChi
            break
          default:
            name = item.functionNameTChi
            break
        }
        item.name = name
      })
    }
    setFunctionList(data);
   } catch (error) {
    const {state} =  extractError(error)
    if(state.code === STATUS_CODE[503]){
      navigate('/maintenance')
    }
   }
  };
  const denialReasonField = [
    {
      label: t('denial_reason.reason_name_tchi'),
      placeholder: t('denial_reason.enter_name'),
      field: 'reasonNameTchi',
      type: 'text'
    },
    {
      label: t('denial_reason.reason_name_schi'),
      placeholder: t('denial_reason.enter_name'),
      field: 'reasonNameSchi',
      type: 'text'
    },
    {
      label: t('denial_reason.reason_name_eng'),
      placeholder: t('denial_reason.enter_name'),
      field: 'reasonNameEng',
      type: 'text'
    },
    {
      label: t('denial_reason.corresponding_functions'),
      placeholder: t('denial_reason.select_function'),
      field: 'functionId',
      type: 'autocomplete'
    },
    {
      label: t('denial_reason.description'),
      placeholder: t('denial_reason.enter_text'),
      field: 'description',
      type: 'text',
      textarea: true,
    },
    {
      label: t('denial_reason.remark'),
      placeholder: t('denial_reason.enter_text'),
      field: 'remark',
      type: 'text',
      textarea: true,
    }
  ]

  useEffect(() => {
    if (drawerOpen) {
      initFunctionList();
    }
  }, [drawerOpen])

  const mappingData = () => {
    if (selectedItem != null) {
      const selectedValue = functionList.find((el) => el.functionId === selectedItem.functionId)
      if (selectedValue) {
        setSelectedFunctionId(selectedValue.name)
      }
      setFormData({
        functionId: selectedValue?.name || '',
        reasonNameTchi: selectedItem.reasonNameTchi,
        reasonNameEng: selectedItem.reasonNameEng,
        reasonNameSchi: selectedItem.reasonNameSchi,
        description: selectedItem.description,
        remark: selectedItem.remark,
      })
    }
  }

  const resetFormData = () => {
    setFormData(initialFormValues)
    setValidation([])
    setTrySubmited(false)
    setSelectedFunctionId('')
  }

  useEffect(() => {
    if (action !== 'add') {
      mappingData()
    } else {
      resetFormData()
    }
  }, [functionList, drawerOpen])

  const checkString = (s: string) => {
    if (!trySubmited) {
      return false
    }
    return s == ''
  }

  const validate = async () => {
    const tempV: formValidate[] = []
    const fieldMapping: FormValues = {
      functionId: t('denial_reason.corresponding_functions'),
      reasonNameTchi: t('denial_reason.reason_name_tchi'),
      reasonNameSchi: t('denial_reason.reason_name_schi'),
      reasonNameEng: t('denial_reason.reason_name_eng'),
      description: t('denial_reason.description'),
      remark: t('denial_reason.remark')
    }
    Object.keys(formData).forEach((fieldName) => {
      if (typeof formData[fieldName as keyof FormValues] !== 'number') {
        formData[fieldName as keyof FormValues]?.trim() === '' &&
          tempV.push({
            field: fieldMapping[fieldName as keyof FormValues],
            problem: formErr.empty,
            type: 'error'
          })
      }
    })
    setValidation(tempV)
    return tempV.length === 0;
  }

  useEffect(() => {
    validate()
  }, [
    formData.functionId,
    formData.reasonNameTchi,
    formData.reasonNameEng,
    formData.reasonNameSchi,
    formData.description,
    formData.remark,
    formData.titleId
  ])

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const handleSubmit = async () => {
    const isValid = await validate();
    if (isValid) {
      const selectedValue = functionList.find((el) => el.name === formData.functionId)
      if (selectedValue) {
        formData.functionId = selectedValue.functionId
      }
      const denialReasonData: CreateDenialReason = {
        tenantId: tenantId.toString(),
        reasonNameTchi: formData.reasonNameTchi,
        reasonNameSchi: formData.reasonNameSchi,
        reasonNameEng: formData.reasonNameEng,
        description: formData.description,
        functionId: formData.functionId,
        remark: formData.remark,
        status: 'ACTIVE',
        createdBy: loginName,
        updatedBy: loginName
      }

      if (action == 'add') {
        handleCreateDenialReason(denialReasonData)
      } else {
        handleEditDenialReason()
      }
    } else {
      setTrySubmited(true);
    }
  }

  const handleCreateDenialReason = async (denialReasonData: CreateDenialReason) => {
  try {
    if (validation.length === 0) {
      const result = await createDenialReason(denialReasonData)
      if (result?.data) {
        onSubmitData('success', t('common.saveSuccessfully'))
        resetFormData()
        handleDrawerClose()
      } else {
        setTrySubmited(true)
        onSubmitData('error', t('common.saveFailed'))
      }
    } else {
      setTrySubmited(true)
    }
  } catch (error) {
    const {state} =  extractError(error)
    if(state.code === STATUS_CODE[503]){
      navigate('/maintenance')
    } else {
      setTrySubmited(true)
      onSubmitData('error', t('common.saveFailed'))
    }
  }
  }

  const handleEditDenialReason = async () => {
    try {
      const selectedValue = functionList.find((el) => el.name === formData.functionId)
      if (selectedValue) {
        formData.functionId = selectedValue.functionId
      }
      const editData: UpdateDenialReason = {
        reasonNameTchi: formData.reasonNameTchi,
        reasonNameSchi: formData.reasonNameSchi,
        reasonNameEng: formData.reasonNameEng,
        description: formData.description,
        functionId: formData.functionId,
        status: 'ACTIVE',
        remark: formData.remark,
        updatedBy: loginName
      }
      if (validation.length === 0) {
        if (selectedItem != null) {
          const result = await editDenialReason(selectedItem.reasonId, editData)
          if (result) {
            onSubmitData('success', t('common.editSuccessfully'))
            resetFormData()
            handleDrawerClose()
          }
        }
      } else {
        setTrySubmited(true)
      }
    } catch (error) {
      const {state} =  extractError(error)
      if(state.code === STATUS_CODE[503]){
        navigate('/maintenance')
      }
    }
  }

  const handleDelete = async () => {
    const selectedValue = functionList.find((el) => el.name === formData.functionId)
    if (selectedValue) {
      formData.functionId = selectedValue.functionId
    }
    const editData: UpdateDenialReason = {
      reasonNameTchi: formData.reasonNameTchi,
      reasonNameSchi: formData.reasonNameSchi,
      reasonNameEng: formData.reasonNameEng,
      description: formData.description,
      functionId: formData.functionId,
      status: 'DELETED',
      remark: formData.remark,
      updatedBy: loginName
    }
    if (selectedItem != null) {
      const result = await editDenialReason(selectedItem.reasonId, editData)
      if (result) {
        onSubmitData('success', t('common.deletedSuccessfully'))
        resetFormData()
        handleDrawerClose()
      }
    }
  }

  return (
    <div>
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
              : selectedItem?.reasonNameTchi,
          subTitle: t('top_menu.denial_reason'),
          submitText: t('common.save'),
          cancelText: t('common.delete'),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
          onDelete: handleDelete
        }}
      >
        <Divider></Divider>
        <Box sx={{ PaddingX: 2 }}>
          <Grid
            container
            direction={'column'}
            spacing={4}
            sx={{
              width: { xs: '100%' },
              marginTop: { sm: 2, xs: 6 },
              marginLeft: {
                xs: 0
              },
              paddingRight: 2
            }}
            className="sm:ml-0 mt-o w-full"
          >
            {denialReasonField.map((item, index) =>
              item.type === 'text' ? (
                <Grid item key={index}>
                  <CustomField label={item.label} mandatory>
                    <CustomTextField
                      id={item.label}
                      value={formData[item.field as keyof FormValues]}
                      disabled={action === 'delete'}
                      placeholder={item.placeholder}
                      onChange={(event) =>
                        handleFieldChange(
                          item.field as keyof FormValues,
                          event.target.value
                        )
                      }
                      textarea = {item.textarea}
                      multiline = {item.textarea}
                      error={checkString(
                        formData[item.field as keyof FormValues]
                      )}
                    />
                  </CustomField>
                </Grid>
              ) : item.type == 'autocomplete' ? (
                <CustomField label={item.label} mandatory>
                  <Autocomplete
                    disablePortal
                    id="contractNo"
                    defaultValue={selectedFunctionId}
                    options={functionList.map((functionItem) => functionItem.name)}
                    onChange={(event, value) => {
                      if (value) {
                        handleFieldChange(
                          item.field as keyof FormValues,
                          value
                        )
                        setSelectedFunctionId(value)
                      }
                    }}
                    value={selectedFunctionId}
                    disabled={action === 'delete'}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={item.placeholder}
                        sx={[styles.textField, { width: 320 }]}
                        InputProps={{
                          ...params.InputProps,
                          sx: styles.inputProps
                        }}
                        error={checkString(selectedFunctionId)}
                      />
                    )}
                  />
              </CustomField>
              ) : <></>
            )}
            <Grid item sx={{ width: '100%' }}>
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
          </Grid>
        </Box>
      </RightOverlayForm>
    </div>
  )
}

export default DenialReasonDetail
