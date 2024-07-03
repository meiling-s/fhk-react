import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Typography
} from '@mui/material'
import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState
} from 'react'
import { styles } from '../../constants/styles'
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab'
import theme from '../../themes/palette'
import CustomField from './CustomField'
import { singleRecyclable } from '../../interfaces/collectionPoint'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import * as Yup from 'yup'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../contexts/CommonTypeContainer'
import CustomTextField from './CustomTextField'
import { useFormik } from 'formik'
import { CreatePicoDetail } from '../../interfaces/pickupOrder'
import RecyclablesListSingleSelect from '../SpecializeComponents/RecyclablesListSingleSelect'
import { collectorList, manuList } from '../../interfaces/common'
import CustomAutoComplete from './CustomAutoComplete'
import dayjs from 'dayjs'
import { Languages, localStorgeKeyName } from '../../constants/constant'
import { formatWeight, getThemeColorRole, getThemeCustomList, onChangeWeight } from '../../utils/utils'
import { useTranslation } from 'react-i18next'
import NotifContainer from '../../contexts/NotifContainer'
import i18n from '../../setups/i18n'

type props = {
  onClose: () => void
  setState: (val: CreatePicoDetail[]) => void
  data: CreatePicoDetail[]
  setId: Dispatch<SetStateAction<number>>
  picoHisId: string | null
  editRowId: number | null
  isEditing: boolean,
  index?: number | null
  editMode: boolean
}
const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
const initialTime: dayjs.Dayjs = dayjs()

const formattedTime = (pickupAtValue: dayjs.Dayjs) => {
  return pickupAtValue.format('HH:mm:ss')
}

export interface InitValue {
  picoDtlId?:      any;
  picoHisId:       string;
  senderId:        string;
  senderName:      string;
  senderAddr:      string;
  senderAddrGps:   number[];
  receiverId:      string;
  receiverName:    string;
  receiverAddr:    string;
  receiverAddrGps: number[];
  status:          string;
  createdBy:       string;
  updatedBy:       string;
  pickupAt:        string;
  recycType:    string;
  recycSubType: string;
  weight:       string;
  newDetail?: boolean;
  id?: number
  
}

const initValue:InitValue  = {
  picoHisId: '',
  senderId: '1',
  senderName: '',
  senderAddr: '',
  senderAddrGps: [0, 0],
  receiverId: '1',
  receiverName: '',
  receiverAddr: '',
  receiverAddrGps: [0, 0],
  status: 'CREATED',
  createdBy: loginId,
  updatedBy: loginId,
  pickupAt: '00:00:00',
  recycType: '',
  recycSubType: '',
  weight: '0',
  newDetail: true,
  id: 0,
  
}

const CreateRecycleForm = ({
  onClose,
  setState,
  data,
  editRowId,
  isEditing,
  picoHisId,
  index,
  editMode
}: props) => {
  const { recycType, manuList, collectorList, decimalVal, getManuList, getCollectorList } =
    useContainer(CommonTypeContainer)
  const [editRow, setEditRow] = useState<CreatePicoDetail>()
  const [defaultRecyc, setDefaultRecyc] = useState<singleRecyclable>()
  const { marginTop } = useContainer(NotifContainer);

  //---set custom style each role---
  const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'
  const colorTheme: string = getThemeColorRole(role) || '#79CA25'
  const customListTheme = getThemeCustomList(role) || '#E4F6DC'
  //---end set custom style each role---
  const { t } = useTranslation()
  const setDefRecyc = (picoDtl: CreatePicoDetail) => {
    const defRecyc: singleRecyclable = {
      recycTypeId: picoDtl.recycType,
      recycSubTypeId: picoDtl.recycSubType
    }
    //console.log("set def", defRecyc);
    setDefaultRecyc(defRecyc)
  }

  useEffect(() => {
    if(editRowId && editMode){
      const editR = data.find(item => item.picoDtlId === editRowId)
      if (editR) {
        setDefRecyc(editR)
        setEditRow(editR)
      }
    } else if(editRowId == null && index && editMode){
      const editR = data.find(item => item.id === index)
      if (editR) {
       setDefRecyc(editR)
       setEditRow(editR)
     }
    } else if(editMode)  {
      setDefaultRecyc(undefined)
      initValue.id = data.length;
      formik.setValues(initValue)
    }

    if(!editMode && index !== null && index !== undefined){
      const edit = data.find(item => item.id === index);
      if(edit){
        setDefRecyc(edit)
        setEditRow(edit)
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
        picoDtlId: editRowId ?? 0,
        picoHisId: picoHisId ?? '',
        senderId: editRow.senderId,
        senderName: editRow.senderName,
        senderAddr: editRow.senderAddr,
        senderAddrGps: editRow.senderAddrGps,
        receiverId: editRow.receiverId,
        receiverName: editRow.receiverName,
        receiverAddr: editRow.receiverAddr,
        receiverAddrGps: editRow.receiverAddrGps,
        status: editRow.status,
        createdBy: editRow.createdBy,
        updatedBy: editRow.updatedBy,
        pickupAt: editRow.pickupAt,
        recycType: editRow.recycType,
        recycSubType: editRow.recycSubType,
        weight: formatWeight(editRow.weight, decimalVal)
      })
    }
  }, [editRow])

  useEffect(() => {
    // console.log('defaultRecyc: ', defaultRecyc)
  }, [defaultRecyc])

  const validateSchema = Yup.lazy((values) => {
    let prevData: CreatePicoDetail[] = []
    if (editRow) {
      prevData = data.filter((item) => item.id != editRow.id)
    } else {
      prevData = data
    }

    return Yup.object().shape({
      pickupAt: Yup.string()
        .required(t('pick_up_order.error.pickuAt'))
        .test(
          t('pick_up_order.error.invalid_date'),
          t('pick_up_order.error.invalid_pickup_time'),
          function (value) {
            return value !== t('pick_up_order.error.invalid_date')
          }
        )
        .test(
          t('pick_up_order.error.not_in_prev_data'),
          t('pick_up_order.error.pickup_time'),
          function (value) {
            return !prevData.some((item) => item.pickupAt === value)
          }
        ),

      senderName: Yup.string().required(t('pick_up_order.error.senderName')),
      senderAddr: Yup.string()
        .required(t('pick_up_order.error.senderAddr'))
        .test(
          t('pick_up_order.error.not_same_as_receiver'),
          t('pick_up_order.error.sender_address'),
          function (value) {
            const receiverAddr = values.receiverAddr
            return value !== receiverAddr
          }
        )
        .test(
          t('pick_up_order.error.not_in_prev_data'),
          t('pick_up_order.error.sender_address_exists'),
          function (value) {
            return !prevData.some((item) => item.senderAddr === value)
          }
        ),
      receiverName: Yup.string().required(t('pick_up_order.error.receiverName')),
      receiverAddr: Yup.string()
        .required(t('pick_up_order.error.receiverAddr'))
        .test(
          t('pick_up_order.error.not_same_as_sender'),
          t('pick_up_order.error.receiver_address_cannot'),
          function (value) {
            const senderAddr = values.senderAddr
            return value !== senderAddr
          }
        )
        .test(
          t('pick_up_order.error.not_in_prev_data'),
          t('pick_up_order.error.receiver_address_exists'),
          function (value) {
            return !prevData.some((item) => item.receiverAddr === value)
          }
        ),
      recycType: Yup.string().required(t('pick_up_order.error.recycType')),
      recycSubType: Yup.string().required(t('pick_up_order.error.recycSubType')),
      weight: Yup.number().moreThan(0, t('pick_up_order.error.weightGreaterThanZero')).required(t('pick_up_order.error.weight'))
    })
  })

  //console.log(JSON.stringify(data)+'qwesss')

  const formik = useFormik({
    initialValues: initValue,
    validationSchema: validateSchema,

    onSubmit: (values, { resetForm }) => {
      //console.log(values)
      // alert(JSON.stringify(values, null, 2));
      if (isEditing) {
        //editing row
        //const {id, ...updateValue} = values
        if(editMode){
          const updatedData = data.map((row, id) => {
            if(editRowId === row.picoDtlId){
              return values
            } else {
              return row
            }
          })
          setState(updatedData)
        } else {
          const updatedData = data.map((row, id) => {
            if(index === row.id){
              return {
                ...values,
                id: index
              }
            } else {
              return row
            }
          })
          setState(updatedData)
        }
       
      } else {
        //creating row
        var updatedValues: CreatePicoDetail = values
        if(!editMode){
          updatedValues.id = data.length
        }
        //console.log("data: ",data," updatedValues: ",updatedValues)
        setState([...data, updatedValues])
      }
      resetForm()
      onClose && onClose()
    }
  })

  const TextFields = [
    {
      label: t('pick_up_order.item.sender_name'),
      id: 'senderName',
      value: formik.values.senderName,
      error: formik.errors.senderName && formik.touched.senderName
    },
    {
      label: t('pick_up_order.recyclForm.receiver'),
      id: 'receiverName',
      value: formik.values.receiverName,
      error: formik.errors.receiverName && formik.touched.receiverName
    },
    {
      label: t('check_out.shipping_location'),
      id: 'senderAddr',
      value: formik.values.senderAddr,
      error: formik.errors.senderAddr && formik.touched.senderAddr
    },
    {
      label: t('pick_up_order.recyclForm.arrived'),
      id: 'receiverAddr',
      value: formik.values.receiverAddr,
      error: formik.errors.receiverAddr && formik.touched.receiverAddr
    }
  ]

  const formatTimePickAt = (timeValue: string) => {
    const times = timeValue.split(':')
    return initialTime
      .hour(Number(times[0]))
      .minute(Number(times[1]))
      .second(Number(times[2]))
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{...localstyles.modal, marginTop}} onClick={handleOverlayClick}>
            <Box sx={localstyles.container}>
              <Box
                sx={{ display: 'flex', flex: '1', p: 4, alignItems: 'center' }}
              >
                <Box>
                  <Typography sx={styles.header4}>
                    {isEditing ? t('userGroup.change') : t('top_menu.add_new')}
                  </Typography>
                  <Typography sx={styles.header3}>
                    {t('pick_up_order.recyclForm.expected_recycling')}
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
                    type="submit"
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
                <CustomField
                  label={t('pick_up_order.recyclForm.shipping_time')}
                  mandatory
                >
                  <TimePicker
                    sx={{ width: '100%' }}
                    value={formatTimePickAt(formik.values.pickupAt)}
                    onChange={(value) => {
                      formik.setFieldValue(
                        'pickupAt',
                        value ? formattedTime(value) : ''
                      )
                    }}
                  />
                </CustomField>

                <CustomField label={t('col.recycType')} mandatory>
                  <RecyclablesListSingleSelect
                    showError={
                      (formik.errors?.recycType && formik.touched?.recycType) ||
                      undefined
                    }
                    recycL={recycType ?? []}
                    setState={(values) => {
                      formik.setFieldValue('recycType', values?.recycTypeId)
                      formik.setFieldValue(
                        'recycSubType',
                        values?.recycSubTypeId
                      )
                    }}
                    itemColor={{
                      bgColor: customListTheme ? customListTheme.bgColor : '#E4F6DC',
                      borderColor: customListTheme ? customListTheme.border: '79CA25'
                    }}
                    defaultRecycL={defaultRecyc}
                    key={formik.values.picoDtlId}
                  />
                </CustomField>
                <CustomField
                  label={t('pick_up_order.recyclForm.weight')}
                  mandatory
                >
                  <CustomTextField
                    id="weight"
                    placeholder={t('userAccount.pleaseEnterNumber')}
                    // onChange={formik.handleChange}
                    onChange={(event) => {
                      onChangeWeight(event.target.value, decimalVal, (value: string) => {
                        formik.setFieldValue('weight', value)
                      })
                    }}
                    onBlur={(event) => {
                      const value = formatWeight(event.target.value, decimalVal)
                      formik.setFieldValue('weight', value)
                    }}
                    value={formik.values.weight}
                    error={
                      (formik.errors?.weight && formik.touched?.weight) ||
                      undefined
                    }
                    sx={{ width: '100%' }}
                    endAdornment={
                      <InputAdornment position="end">kg</InputAdornment>
                    }
                  ></CustomTextField>
                </CustomField>
                {TextFields.map((it) => (
                  <CustomField mandatory label={it.label}>
                    {it.id === 'senderName' || it.id === 'receiverName' ? (
                      <CustomAutoComplete
                        placeholder={''}
                        option={[
                          ...(collectorList?.map(
                            (option) => {
                              if(i18n.language === Languages.ENUS){
                                return option.collectorNameEng
                              } else if(i18n.language === Languages.ZHCH){
                                return option.collectorNameSchi
                              } else {
                                return option.collectorNameTchi
                              }
                            }
                          ) ?? []),
                          ...(manuList?.map(
                            (option) => {
                              if(i18n.language === Languages.ENUS){
                                return option.manufacturerNameEng
                              } else if(i18n.language === Languages.ZHCH){
                                return option.manufacturerNameSchi
                              } else {
                                return option.manufacturerNameTchi
                              }
                            }
                          ) ?? [])
                        ]}
                        sx={{ width: '100%' }}
                        onChange={(
                          _: SyntheticEvent,
                          newValue: string | null
                        ) => formik.setFieldValue(it.id, newValue)}
                        onInputChange={(event: any, newInputValue: string) => {
                          formik.setFieldValue(it.id, newInputValue) // Update the formik field value if needed
                        }}
                        value={it.value}
                        inputValue={it.value}
                        error={it.error || undefined}
                      />
                    ) : (
                      <CustomTextField
                        id={it.id}
                        placeholder={t('pick_up_order.recyclForm.placeholder')}
                        rows={4}
                        onChange={formik.handleChange}
                        value={it.value}
                        sx={{ width: '100%' }}
                        error={it.error || undefined}
                      />
                    )}
                  </CustomField>
                ))}
                <Stack spacing={2}>
                  {formik.errors.pickupAt && formik.touched.pickupAt && (
                    <Alert severity="error">{formik.errors.pickupAt} </Alert>
                  )}
                  {formik.errors?.recycType && formik.touched?.recycType && (
                    <Alert severity="error">{formik.errors?.recycType} </Alert>
                  )}
                  {formik.errors?.recycSubType &&
                    formik.touched?.recycSubType && (
                      <Alert severity="error">
                        {formik.errors?.recycSubType}{' '}
                      </Alert>
                    )}
                  {formik.errors?.weight && formik.touched?.weight && (
                    <Alert severity="error">{formik.errors?.weight} </Alert>
                  )}
                  {formik.errors.senderName && formik.touched.senderName && (
                    <Alert severity="error">{formik.errors.senderName} </Alert>
                  )}
                  {formik.errors.receiverName &&
                    formik.touched.receiverName && (
                      <Alert severity="error">
                        {formik.errors.receiverName}{' '}
                      </Alert>
                    )}
                  {formik.errors.senderAddr && formik.touched.senderAddr && (
                    <Alert severity="error">{formik.errors.senderAddr} </Alert>
                  )}
                  {formik.errors.receiverAddr &&
                    formik.touched.receiverAddr && (
                      <Alert severity="error">
                        {formik.errors.receiverAddr}{' '}
                      </Alert>
                    )}
                </Stack>
              </Stack>
            </Box>
          </Box>
        </LocalizationProvider>
      </form>
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
  }
}

export default CreateRecycleForm
