import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Divider, FormControl, Grid, MenuItem } from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import { STATUS_CODE, formErr } from '../../../constants/constant'
import { extractError, returnErrorMsg, showErrorToast } from '../../../utils/utils'
import { localStorgeKeyName } from '../../../constants/constant'
import { useNavigate } from 'react-router-dom'
import { CreateProcessTypeProps, ProcessTypeData } from '../../../interfaces/processType'
import { WeightUnit } from '../../../interfaces/weightUnit'
import { createProcessTypeData, deleteProcessTypeData, updateProcessTypeData } from '../../../APICalls/Collector/processType'

interface CreateProcessType {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  rowId?: number
  selectedItem?: ProcessTypeData | null
  weightUnit: WeightUnit[]
}

const CreateProcessType: FunctionComponent<CreateProcessType> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  rowId,
  selectedItem,
  weightUnit
}) => {
  const { t, i18n } = useTranslation()
  const [tChineseName, setTChineseName] = useState<string>('')
  const [sChineseName, setSChineseName] = useState<string>('')
  const [englishName, setEnglishName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [remark, setRemark] = useState<string>('')
  const [processTypeId, setProcessTypeId] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const [version, setVersion] = useState<number>(0)
  const [processTime, setProcessTime] = useState<string>('')
  const [processNumber, setProcessNumber] = useState<string>('')
  const [processWeight, setProcessWeight] = useState<string>('')
  const navigate = useNavigate();
  const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]
  const time = [
    {
      id: 'D',
      nameEn: 'Day',
      nameTchi: '日',
      nameSchi: '日',
    },
    {
      id: 'h',
      nameEn: 'Hour',
      nameTchi: '小時',
      nameSchi: '小时',
    },
    {
      id: 'm',
      nameEn: 'Minute',
      nameTchi: '分鐘',
      nameSchi: '分钟'
    },
    {
      id: 's',
      nameEn: 'Second',
      nameTchi: '秒',
      nameSchi: '秒'
    }
  ]

  useEffect(() => {
    if (action === 'edit' || action === 'delete') {
      if (selectedItem !== null && selectedItem !== undefined) {
        setProcessTypeId(selectedItem.processTypeId)
        setTChineseName(selectedItem.processTypeNameTchi)
        setSChineseName(selectedItem.processTypeNameSchi)
        setEnglishName(selectedItem.processTypeNameEng)
        setDescription(selectedItem.description)
        setRemark(selectedItem.remark)
        setStatus(selectedItem.status)
        setProcessTime(selectedItem.processingTimeUnit)
        setProcessNumber(selectedItem.processingTime.toString())
        setProcessWeight(selectedItem.processingWeightUnitId.toString())
        setVersion(selectedItem.version ?? 0)
      }
    } else if (action === 'add') {
      resetData()
    }
  }, [selectedItem, action, drawerOpen])

  const resetData = () => {
    setTChineseName('')
    setSChineseName('')
    setEnglishName('')
    setDescription('')
    setRemark('')
    setProcessNumber('')
    setProcessTime('')
    setProcessWeight('')
    setTrySubmited(false)
  }

  useEffect(() => {
    const validate = async () => {
      const tempV: formValidate[] = [];
  
      // Validate each individual field separately
      if (tChineseName.toString() === '') {
        tempV.push({
          field: t('process_type.traditional_chinese_name'),
          problem: formErr.empty,
          type: 'error',
          dataTestId: 'astd-product-type-form-tc-err-warning-3762'
        });
      }
  
      if (sChineseName.toString() === '') {
        tempV.push({
          field: t('process_type.simplified_chinese_name'),
          problem: formErr.empty,
          type: 'error',
          dataTestId: 'astd-product-type-form-sc-err-warning-3672'
        });
      }
  
      if (englishName.toString() === '') {
        tempV.push({
          field: t('process_type.english_name'),
          problem: formErr.empty,
          type: 'error',
          dataTestId: 'astd-product-type-form-en-err-warning-3278'
        });
      }
  
      // Grouped validation for processNumber, processTime, and processWeight
      if (
        processNumber.toString() === '' ||
        processTime.toString() === '' ||
        processWeight.toString() === ''
      ) {
        tempV.push({
          field: t('process_type.time'),  // You can adjust this field label if needed
          problem: formErr.empty,
          type: 'error',
          dataTestId: 'astd-product-type-form-time-err-warning-6697'
        });
      }
  
      setValidation(tempV);
    };
  
    validate();
  }, [tChineseName, sChineseName, englishName, processNumber, processTime, processWeight, i18n.language]);
  

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  const handleSubmit = () => {
    const formData: CreateProcessTypeProps = {
      processTypeNameTchi: tChineseName,
      processTypeNameSchi: sChineseName,
      processTypeNameEng: englishName,
      description: description,
      remark: remark,
      status: 'ACTIVE',
      processingTime: Number(processNumber),
      processingTimeUnit: processTime,
      processingWeightUnitId: Number(processWeight),
      ...(action === 'edit' && {version: version}),
      // ...(action === 'delete' && {version: version})

    }
    if (action == 'add') {
      handleCreateProcessType(formData)
    } else if (action == 'edit') {
      handleEditProcessType(formData, processTypeId)
    } else if (action == 'delete') {
      handleDelete()
    }
  }

  const handleCreateProcessType = async (formData: CreateProcessTypeProps) => {
    try {
      if (validation.length === 0) {
        const result = await createProcessTypeData(formData)
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
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      } else {
        if (error?.response?.data?.status === STATUS_CODE[409]) {
          showErrorToast(error?.response?.data?.message);
        }
        // if (error?.response?.data?.status === STATUS_CODE[500] ||
        //   error?.response?.data?.status === STATUS_CODE[409]) {
        //   setValidation(
        //     [
        //       {
        //         field: t('common.packageName'),
        //         problem: '',
        //         type: 'error'
        //       }
        //     ]
        //   )
        // }
        setTrySubmited(true)
        // onSubmitData('error', t('common.saveFailed'))
      }
    }
  }

  const handleEditProcessType = async (
    formData: CreateProcessTypeProps,
    processTypeId: string
  ) => {
    try {
      if (validation.length === 0) {
        const result = await updateProcessTypeData(formData, processTypeId)
        if (result) {
          onSubmitData('success', t('common.editSuccessfully'))
          resetData()
          handleDrawerClose()
        }
      } else {
        setTrySubmited(true)
      }
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      } else {
        if (error?.response?.data?.status === STATUS_CODE[409]) {
          showErrorToast(error?.response?.data?.message);
        }
      }
    }
  }

  const handleDelete = async () => {
    try {
      if (selectedItem != null) {
        const result = await deleteProcessTypeData(processTypeId)
        if (result) {
          onSubmitData('success', t('common.deletedSuccessfully'))
          resetData()
          handleDrawerClose()
        } else {
          onSubmitData('error', t('common.deleteFailed'))
        }
      }
    } catch (error: any) {
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
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
          title:
            action == 'add'
              ? t('top_menu.add_new')
              : action == 'delete'
                ? t('common.delete')
                : selectedItem?.processTypeId,
          subTitle: t('process_type.process_type'),
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
            <CustomField
              label={t('process_type.traditional_chinese_name')}
              mandatory
            >
              <CustomTextField
                id="tChineseName"
                value={tChineseName}
                disabled={action === 'delete'}
                placeholder={t('process_type.traditional_chinese_name_placeholder')}
                onChange={(event) => setTChineseName(event.target.value)}
                error={checkString(tChineseName)}
                dataTestId='astd-product-type-form-tc-input-field-1266'
              />
            </CustomField>
          </Box>

          <Box sx={{ marginY: 2 }}>
            <CustomField
              label={t('process_type.simplified_chinese_name')}
              mandatory
            >
              <CustomTextField
                id="sChineseName"
                value={sChineseName}
                disabled={action === 'delete'}
                placeholder={t('process_type.simplified_chinese_name_placeholder')}
                onChange={(event) => setSChineseName(event.target.value)}
                error={checkString(sChineseName)}
                dataTestId='astd-product-type-form-sc-input-field-6727'
              />
            </CustomField>
          </Box>

          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('process_type.english_name')} mandatory>
              <CustomTextField
                id="englishName"
                value={englishName}
                disabled={action === 'delete'}
                placeholder={t('process_type.english_name_placeholder')}
                onChange={(event) => setEnglishName(event.target.value)}
                error={checkString(englishName)}
                dataTestId='astd-product-type-form-en-input-field-4655'
              />
            </CustomField>
          </Box>

          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('process_type.time')} mandatory />
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-mini">
              <div className="self-stretch overflow-hidden flex flex-row items-center justify-start gap-[8px]">
                <div className="w-full ">
                  <div
                    className="flex justify-center items-center gap-2 mb-2"
                  >
                    <FormControl sx={{ m: 1, width: '100%' }}>
                      <Select
                        value={processNumber}
                        onChange={(event: SelectChangeEvent<string>) => setProcessNumber(event.target.value)}
                        displayEmpty
                        disabled={action === 'delete'}
                        inputProps={{
                          'aria-label': 'Without label'
                        }}
                        sx={{
                          borderRadius: '12px'
                        }}
                        error={checkString(processNumber)}
                        data-testId='astd-product-type-duration-select-button-4196'
                      >
                        {number.map((value, index) => (
                          <MenuItem value={value} key={index}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '100%' }}>
                      <Select
                        value={processTime}
                        onChange={(event: SelectChangeEvent<string>) => setProcessTime(event.target.value)}
                        displayEmpty
                        disabled={action === 'delete'}
                        inputProps={{
                          'aria-label': 'Without label'
                        }}
                        sx={{
                          borderRadius: '12px' // Adjust the value as needed
                        }}
                        error={checkString(processTime)}
                        data-testId='astd-product-type-duration-type-select-button-4370'
                      >
                        {time.map((value, index) => {
                          const selectedLang = i18n.language === 'enus' ? value.nameEn : i18n.language === 'zhhk' ? value.nameTchi : value.nameSchi
                          return (
                            <MenuItem value={value.id} key={index}>
                              {selectedLang}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '100%' }}>
                      <Select
                        value={processWeight}
                        onChange={(event: SelectChangeEvent<string>) => setProcessWeight(event.target.value)}
                        displayEmpty
                        disabled={action === 'delete'}
                        inputProps={{
                          'aria-label': 'Without label'
                        }}
                        sx={{
                          borderRadius: '12px'
                        }}
                        error={checkString(processWeight)}
                        data-testId='astd-product-type-weight-unit-select-button-3108'
                      >
                        {weightUnit.map((value, index) => {
                          const name = i18n.language === 'enus' ? value.unitNameEng : i18n.language === 'zhhk' ? value.unitNameTchi : value.unitNameSchi
                          return (
                            <MenuItem value={value.unitId} key={index}>
                              {name}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>
          </Box>


          <Box sx={{ marginY: 2 }}>
            <CustomField
              label={t('process_type.introduction')}
              mandatory={false}
            >
              <CustomTextField
                id="description"
                placeholder={t('process_type.introduction_placeholder')}
                onChange={(event) => setDescription(event.target.value)}
                multiline={true}
                defaultValue={description}
                disabled={action === 'delete'}
                dataTestId='astd-product-type-desc-input-field-2290'
              />
            </CustomField>
          </Box>

          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('process_type.remark')} mandatory={false}>
              <CustomTextField
                id="remark"
                placeholder={t('process_type.remark_placeholder')}
                onChange={(event) => setRemark(event.target.value)}
                multiline={true}
                defaultValue={remark}
                disabled={action === 'delete'}
                dataTestId='astd-product-type-remark-input-field-4854'
              />
            </CustomField>
          </Box>

          <Box sx={{ marginY: 2 }}>
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

        </Box>
      </RightOverlayForm>
    </div>
  )
}

export default CreateProcessType
