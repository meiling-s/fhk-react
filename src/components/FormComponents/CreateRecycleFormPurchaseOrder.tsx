import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  TextField
} from '@mui/material'
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState
} from 'react'
import { styles } from '../../constants/styles'
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab'
import theme from '../../themes/palette'
import CustomField from './CustomField'
import {
  singleRecyclable,
} from '../../interfaces/collectionPoint'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { t } from 'i18next'
import * as Yup from 'yup'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../contexts/CommonTypeContainer'
import CustomTextField from './CustomTextField'
import { useFormik } from 'formik'
import RecyclablesListSingleSelect from '../SpecializeComponents/RecyclablesListSingleSelect'
import { collectorList, manuList } from '../../interfaces/common'
import dayjs, { Dayjs } from 'dayjs'
import { Languages, format } from '../../constants/constant'
import { localStorgeKeyName } from '../../constants/constant'
import { formatWeight, getThemeColorRole, getThemeCustomList, onChangeWeight } from '../../utils/utils'
import { PurchaseOrderDetail } from '../../interfaces/purchaseOrder'
import { DatePicker } from '@mui/x-date-pickers'
import { getWeightUnit } from '../../APICalls/ASTD/recycling'
import i18n from '../../setups/i18n'
import { WeightUnit } from '../../interfaces/weightUnit'

type props = {
  onClose: () => void
  setState: (val: PurchaseOrderDetail[]) => void
  data: PurchaseOrderDetail[]
  setId: Dispatch<SetStateAction<number>>
  picoHisId: string | null
  editRowId: number | null
  isEditing: boolean
  receiverAddr?: string
  onChangeAddressReceiver? : (value: string) => void
}
type CombinedType = manuList[] | collectorList[]
const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
const initialTime: dayjs.Dayjs = dayjs()

const formattedTime = (pickupAtValue: dayjs.Dayjs) => {
  return pickupAtValue.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
}

const initValue = {
    id: -1,
    poDtlId: 0,
    recycTypeId: '',
    recyclableNameTchi: '',
    recyclableNameSchi: '',
    recyclableNameEng: '',
    recycSubTypeId: '',
    recyclableSubNameTchi: '',
    recyclableSubNameSchi: '',
    recyclableSubNameEng: '',
    unitId: 0,
    unitNameTchi: '',
    unitNameSchi: '',
    unitNameEng: '',
    weight: '0',
    pickupAt: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    receiverAddr: '',
    createdBy: loginId,
    updatedBy: loginId,
}

const ErrorMessages:React.FC<{message: string}> = ({message}) => {
  return <Typography style={{color: 'red', fontWeight: '400'}}>
{message}
</Typography>
}
type fieldName = 'receiverAddr' | 'weight' | 'recycTypeId' | 'recycSubTypeId' | 'pickupAt' | 'unitId';

type ErrorsField = Record<
  fieldName,
  {
    type: string
    status: boolean
    required: boolean
  }
>

const initialErrors = {
  receiverAddr: {
    type: 'string',
    status: false,
    required: true
  },
  weight: {
    type: 'string',
    status: false,
    required: true
  },
  recycTypeId: {
    type: 'string',
    status: false,
    required: true
  },
  recycSubTypeId: {
    type: 'string',
    status: false,
    required: true
  },
  pickupAt: {
    type: 'string',
    status: false,
    required: false
  },
  unitId: {
    type: 'string',
    status: false,
    required: true
  }
}

const CreateRecycleForm = ({
  onClose,
  setState,
  data,
  editRowId,
  isEditing,
  picoHisId,
  receiverAddr,
  onChangeAddressReceiver
}: props) => {
  const { recycType, weightUnits, decimalVal } = useContainer(CommonTypeContainer)
  const [editRow, setEditRow] = useState<PurchaseOrderDetail>()
  const [defaultRecyc, setDefaultRecyc] = useState<singleRecyclable>()
  const currentLanguage = localStorage.getItem('selectedLanguage') || 'zhhk'

  //---set custom style each role---

  const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'
  const colorTheme: string = getThemeColorRole(role) || '#79CA25'
  const customListTheme = getThemeCustomList(role) || '#E4F6DC'
  //---end set custom style each role---
  const [errorsField, setErrorsField] = useState<ErrorsField>(initialErrors)
  const {dateFormat} = useContainer(CommonTypeContainer)

  const setDefRecyc = (picoDtl: PurchaseOrderDetail) => {
    const defRecyc: singleRecyclable = {
      recycTypeId: picoDtl.recycTypeId,
      recycSubTypeId: picoDtl.recycSubTypeId
    }
    setDefaultRecyc(defRecyc)
  }

  useEffect(() => {
    if (editRowId == null) {
      setDefaultRecyc(undefined)
      formik.setValues(initValue)
    } else {
      const editR = data.at(editRowId)
      if (editR) {
        setDefRecyc(editR)
        setEditRow(editR)
      }
    }
  }, [editRowId])

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // If the overlay is clicked (not its children), close the modal
      onClose && onClose()
    }
  }

  useEffect(() => {
    if (editRow) {
      // Set the form field values based on the editRow data

      const index = data.indexOf(editRow)

      formik.setValues({
        id: index,
        poDtlId: editRow.poDtlId,
        recycTypeId: editRow.recycTypeId,
        recyclableNameTchi: editRow.recyclableNameTchi,
        recyclableNameSchi: editRow.recyclableNameSchi,
        recyclableNameEng: editRow.recyclableNameEng,
        recycSubTypeId: editRow.recycSubTypeId,
        recyclableSubNameTchi: editRow.recyclableSubNameTchi,
        recyclableSubNameSchi: editRow.recyclableSubNameSchi,
        recyclableSubNameEng: editRow.recyclableSubNameEng,
        unitId: editRow.unitId,
        unitNameTchi: editRow.unitNameTchi,
        unitNameSchi: editRow.unitNameSchi,
        unitNameEng: editRow.unitNameEng,
        weight: formatWeight(editRow.weight, decimalVal),
        pickupAt: editRow?.pickupAt || '',
        createdBy: editRow.createdBy,
        updatedBy: editRow.updatedBy,
        receiverAddr:  editRow.receiverAddr || '' 
      })
    }
  }, [editRow])

  const validateSchema = Yup.lazy((values) => {
    let prevData: PurchaseOrderDetail[] = []
    if (editRow) {
      prevData = data.filter((item) => item.poDtlId != editRow.poDtlId)
    } else {
      prevData = data
    }

    return Yup.object().shape({
      pickupAt: Yup.string().required(
        t('purchase_order.create.this') + ' ' + 
        t('purchase_order.create.receipt_date_and_time') + ' ' + 
        t('purchase_order.create.is_required')
      ),
      recycTypeId: Yup.string().required(
        t('purchase_order.create.this') + ' ' + 
        t('col.recycType') + ' ' + 
        t('purchase_order.create.is_required')
      ),
      recycSubTypeId: Yup.string().required(
        t('purchase_order.create.this') + ' ' + 
        t('col.recycType') + ' ' + 
        t('purchase_order.create.is_required')
      ),
      weight: Yup.number().required(
        t('purchase_order.create.this') + ' ' + 
        t('purchase_order.create.weight') + ' ' + 
        t('purchase_order.create.is_required')
      ),
      receiverAddr: Yup.string().required(
        t('purchase_order.create.this') + ' ' + 
        t('purchase_order.create.arrived') + ' ' + 
        t('purchase_order.create.is_required')
      ),
    })
  })
 
  const validateData = () => {
    let isValid = true;
    if(formik.values.pickupAt === ''){
      setErrorsField(prev => {
        return{
          ...prev,
          'pickupAt': {
            ...prev.pickupAt,
            status: true
          }
        }
      })
      isValid = false
    }  
    if (formik.values.recycTypeId === ''){
      setErrorsField(prev => {
        return{
          ...prev,
          'recycTypeId': {
            ...prev.recycTypeId,
            status: true
          }
        }
      })
      isValid = false
    } 
    if (formik.values.recycSubTypeId === ''){
      setErrorsField(prev => {
        return{
          ...prev,
          'recycSubTypeId': {
            ...prev.recycSubTypeId,
            status: true
          }
        }
      })
      isValid = false
    } 
    if(Number(formik.values.weight) <= 0){
      setErrorsField(prev => {
        return{
          ...prev,
          'weight': {
            ...prev.weight,
            status: true
          }
        }
      })
      isValid = false
    } 
    
    if(formik.values.receiverAddr === ''){
      setErrorsField(prev => {
        return{
          ...prev,
          'receiverAddr': {
            ...prev.receiverAddr,
            status: true
          }
        }
      })
      isValid = false
    }

    if(formik.values.unitId === 0){
      setErrorsField(prev => {
        return{
          ...prev,
          'unitId': {
            ...prev.unitId,
            status: true
          }
        }
      })
      isValid = false
    }
    return isValid
  }


  const formik = useFormik({
    initialValues: initValue,
    // validationSchema: validateSchema,

    onSubmit: (values, { resetForm }) => {
      if (isEditing) {
        const updatedData = data.map((row, id) => {
          return id === values.id ? values : row
        })
        setState(updatedData)
      } else {
        //creating row
        var updatedValues: PurchaseOrderDetail = values
        updatedValues.id = data.length
        setState([...data, updatedValues])
      }
      resetForm()
      onClose && onClose()
    }
  })

  const onHandleError = (serviceName: fieldName, message: string) => {    
    if(message === 'succeed') {
      setErrorsField(prev => {
        return{
          ...prev,
          [serviceName]: {
            ...prev[serviceName],
            status: false
          }
        }
      })
    } else {
      setErrorsField(prev => {
        return{
          ...prev,
          [serviceName]: {
            ...prev[serviceName],
            status: true
          }
        }
      })
    }
    
  };

  const onChangeContent = (field: fieldName, value: any) => {
    if(value === '' || value === 0){
      formik.setFieldValue(field, '')
      onHandleError(field, 'failed')
    } else if(field === 'recycTypeId'){
      formik.setFieldValue('recycTypeId', value)
      formik.setFieldValue('recycSubTypeId', '')
      onHandleError('recycTypeId', 'succeed')
      onHandleError('recycSubTypeId', 'succeed')
    } else {
      formik.setFieldValue(field, value)
      onHandleError(field, 'succeed')
    }
  }

  const onhandleSubmit = () => {
    const isValid = validateData()
    if(!isValid) return
    formik.handleSubmit()
  }
  


  const getWeightUnits = ():{unitId: number, lang: string}[] => {
    let units:{unitId: number, lang: string}[] = []
    if(i18n.language === Languages.ENUS){
      units = weightUnits.map(item => {
        return {
          unitId: item?.unitId,
          lang: item?.unitNameEng
        }
      })
    } else if(i18n.language === Languages.ZHCH){
      units = weightUnits.map(item => {
        return {
          unitId: item?.unitId,
          lang: item?.unitNameSchi
        }
      })
    } else {
      units = weightUnits.map(item => {
        return {
          unitId: item?.unitId,
          lang: item?.unitNameTchi
        }
      })
    }

    return units
  }

  const getUnitName = (unitId: number):{unitId: number, lang: string} => {
    let unitName:{unitId: number, lang: string} = {unitId: 0, lang: ''}
    const unit = getWeightUnits().find(item => item.unitId === unitId);
    if(unit){
      unitName = unit
    }
    return unitName
  }
 
  return (
    <>
      {/* <form onSubmit={onhandleSubmit}> */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={localstyles.modal} onClick={handleOverlayClick}>
            <Box sx={localstyles.container}>
              <Box sx={{ display: 'flex', flex: '1', p: 4, alignItems: 'center' }}>
                <Box>
                  <Typography sx={styles.header4}>
                    {isEditing ? t('userGroup.change') : t('top_menu.add_new')}
                  </Typography>
                  <Typography sx={styles.header3}>
                    {t('purchase_order.create.expected_recycling')}
                  </Typography>
                </Box>

                <Box sx={{ marginLeft: 'auto' }}>
                  <Button
                    variant="outlined"
                    sx={{
                      ...localstyles.button,
                      color: 'white',
                      bgcolor: colorTheme,
                      borderColor: colorTheme
                    }}
                    onClick={onhandleSubmit}
                    // type="submit"
                  >
                    {t('col.save')}
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      ...localstyles.button,
                      color: colorTheme,
                      bgcolor: 'white',
                      borderColor: colorTheme
                    }}
                    onClick={() => onClose && onClose()}
                  >
                    {t('col.cancel')}
                  </Button>
                  <IconButton
                    sx={{ ml: '25px' }}
                    onClick={() => onClose && onClose()}
                  >
                    <KeyboardTabIcon sx={{ fontSize: '30px' }} />
                  </IconButton>
                </Box>
              </Box>
              <Divider />
              <Stack spacing={2} sx={localstyles.content}>
               <Grid item>
                  <CustomField
                    label={t('purchase_order.create.receipt_date_and_time')}
                    mandatory
                  >
                    <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
                      <Box sx={{ ...localstyles.DateItem }}>
                        <DatePicker
                          value={dayjs(formik.values.pickupAt)}
                          format={dateFormat}
                          onChange={(value) => {
                              formik.setFieldValue(
                                'pickupAt',
                                value ? formattedTime(value) : ''
                              )
                            }}
                          sx={{ ...localstyles.datePicker }}
                        />
                      </Box>
                      <Box sx={{ ...localstyles.timePeriodItem }}>
                        <TimePicker
                          value={dayjs(formik.values.pickupAt)}
                          onChange={(value) => {
                              formik.setFieldValue(
                                'pickupAt',
                                value ? formattedTime(value) : ''
                              )
                            }}
                          sx={{ ...localstyles.timePicker }}
                        />
                      </Box>
                    </Box>
                  </CustomField>
                  {
                    errorsField['pickupAt' as keyof ErrorsField].required && errorsField['pickupAt' as keyof ErrorsField].status ? 
                    <ErrorMessages  message={t('purchase_order.create.required_field')}/> : ''
                  }
               </Grid>
              <Grid item>
                  <CustomField label={t('col.recycType')} mandatory>
                    <RecyclablesListSingleSelect
                      showError={
                        (formik.errors?.recycTypeId && formik.touched?.recycTypeId) ||
                        undefined
                      }
                      recycL={recycType ?? []}
                      setState={(values) => {
                        if(values.recycTypeId) onChangeContent('recycTypeId', values?.recycTypeId)
                        if(values.recycSubTypeId) onChangeContent('recycSubTypeId', values?.recycSubTypeId)
                      }}
                      itemColor={{
                        bgColor: customListTheme ? customListTheme.bgColor : '#E4F6DC',
                        borderColor: customListTheme ? customListTheme.border: '79CA25'
                      }}
                      defaultRecycL={defaultRecyc}
                      key={formik.values.id}
                    />
                  </CustomField>
                  {
                    errorsField['recycSubTypeId' as keyof ErrorsField].required && errorsField['recycSubTypeId' as keyof ErrorsField].status ? 
                    <ErrorMessages  message={t('purchase_order.create.required_field')}/> : ''
                  }
              </Grid>
              <Grid item>
                <CustomField
                  label={t('purchase_order.create.weight')}
                  mandatory
                >
                  <CustomTextField
                    id="weight"
                    placeholder={t('userAccount.pleaseEnterNumber')}
                    // onChange={formik.handleChange}
                    onChange={(event) => {
                      // onChangeContent('weight', event.target.value)
                      onChangeWeight(event.target.value, decimalVal, (value: string) => {
                        formik.setFieldValue('weight', value)
                        if (value) {
                          onHandleError('weight', 'succeed')
                        }
                      })
                    }}
                    onBlur={(event) => {
                      const value = formatWeight(event.target.value, decimalVal)
                      formik.setFieldValue('weight', value)
                      if (value) {
                        onHandleError('weight', 'succeed')
                      }
                    }}
                    value={formik.values.weight}
                    error={
                      (formik.errors?.weight && formik.touched?.weight) ||
                      undefined
                    }
                    sx={{ width: '100%' }}
                    endAdornment={
                      <Autocomplete
                        disablePortal
                        id="unitId"
                        sx={{ width: 100, border: 0 }}
                        value={getUnitName(formik.values.unitId)}
                        options={getWeightUnits()}
                        getOptionLabel={(option) => option.lang}
                        onChange={(event, value) => {
                         if(value?.unitId){
                          onChangeContent('unitId', value?.unitId)
                         } else {
                          formik.setFieldValue('unitId', 0)
                         }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t('purchase_order.create.unit')}
                            sx={[localstyles.textField, { width: 400, border: 'none', borderColor: ''}]}
                            InputProps={{
                              ...params.InputProps,
                            }}
                          />
                        )}
                      />
                    }
                  ></CustomTextField>
                </CustomField>
                {/* { errors.weight.required && errors.weight.status &&  <ErrorMessages  message={t('purchase_order.create.required_field')}/>} */}
                {
                  (
                    errorsField['weight' as keyof ErrorsField].required && errorsField['weight' as keyof ErrorsField].status ||
                    errorsField['unitId' as keyof ErrorsField].required && errorsField['unitId' as keyof ErrorsField].status
                  ) ? 
                  <ErrorMessages  message={t('purchase_order.create.required_field')}/> : ''
                }
              </Grid>
              <Grid item>
                <CustomField
                  label={t('purchase_order.create.arrived')}
                  mandatory
                >
                 <CustomTextField
                    id={'receiverAddr'}
                    placeholder={t('purchase_order.create.arrived')}
                    rows={4}
                    multiline={true}
                    onChange={(event) => {
                      onChangeContent('receiverAddr', event.target.value)
                      // formik.setFieldValue('receiverAddr', event.target.value)
                      onChangeAddressReceiver && onChangeAddressReceiver(event.target.value)
                    }}
                    value={receiverAddr}
                    sx={{ width: '100%', height: '100%' }}
                    error={
                      (formik.errors?.receiverAddr && formik.touched?.receiverAddr) ||
                      undefined
                    }
                  />
                </CustomField>
                {
                  errorsField['receiverAddr' as keyof ErrorsField].required && errorsField['receiverAddr' as keyof ErrorsField].status ? 
                  <ErrorMessages  message={t('purchase_order.create.required_field')}/> : ''
                }
              </Grid>
                {/* <Stack spacing={2}>
                  {formik.errors.createdBy && formik.touched.createdBy && (
                    <Alert severity="error">{formik.errors.createdBy} </Alert>
                  )}
                  {formik.errors?.recycTypeId && formik.touched?.recycTypeId && (
                    <Alert severity="error">{formik.errors?.recycTypeId} </Alert>
                  )}
                  {formik.errors?.recycSubTypeId &&
                    formik.touched?.recycSubTypeId && (
                      <Alert severity="error">
                        {formik.errors?.recycSubTypeId}{' '}
                      </Alert>
                    )}
                  {formik.errors?.weight && formik.touched?.weight && (
                    <Alert severity="error">{formik.errors?.weight} </Alert>
                  )}
                  {formik.errors.createdBy && formik.touched.createdBy && (
                    <Alert severity="error">{formik.errors.createdBy} </Alert>
                  )}
                  {formik.errors.createdBy &&
                    formik.touched.createdBy && (
                      <Alert severity="error">
                        {formik.errors.createdBy}{' '}
                      </Alert>
                    )}
                  {formik.errors.createdBy && formik.touched.createdBy && (
                    <Alert severity="error">{formik.errors.createdBy} </Alert>
                  )}
                  {formik.errors.createdBy &&
                    formik.touched.createdBy && (
                      <Alert severity="error">
                        {formik.errors.createdBy}{' '}
                      </Alert>
                    )}
                </Stack> */}
              </Stack>
            </Box>
          </Box>
        </LocalizationProvider>
      {/* </form> */}
    </>
  )
}

let localstyles = {
  modal: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    justifyContent: 'flex-end'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '40%',
    bgcolor: 'white',
    overflowY: 'scroll'
  },

  button: {
    borderColor: theme.palette.primary.main,
    color: 'white',
    width: '100px',
    height: '35px',
    p: 1,
    borderRadius: '18px',
    mr: '10px'
  },
  content: {
    flex: 9,
    p: 4
  },
  typo_header: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#858585',
    letterSpacing: '2px',
    mt: '10px'
  },
  typo_fieldTitle: {
    fontSize: '15px',
    color: '#ACACAC',
    letterSpacing: '2px'
  },
  typo_fieldContent: {
    fontSize: '17PX',
    letterSpacing: '2px'
  },
  DateItem: {
    display: 'flex',
    height: 'fit-content',
    alignItems: 'center'
  },
  timePeriodItem: {
    display: 'flex',
    height: 'fit-content',
    paddingX: 2,
    alignItems: 'center',
    backgroundColor: 'white',
    border: 2,
    borderRadius: 3,
    borderColor: '#E2E2E2'
  },
  datePicker: {
    ...styles.textField,
    maxWidth: '370px',
    '& .MuiIconButton-edgeEnd': {
      color: '#79CA25'
    }
  },
  timePicker: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: 'white',
    '& fieldset': {
      borderWidth: 0
    },
    '& input': {
      paddingX: 0
    },
    '& .MuiIconButton-edgeEnd': {
      color: '#79CA25'
    }
  },
  textField: {
    // borderRadius: '12px',
    width: {
      xs: '280px',
      md: '100%'
    },
    backgroundColor: 'white',
    '& fieldset': {
      borderRadius: '12px'
    },
    marginLeft: '13px'
  },
}

export default CreateRecycleForm
