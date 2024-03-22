import {
  Alert,
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useRef,
  useState
} from 'react'
import { styles } from '../../constants/styles'
import { DELETE_OUTLINED_ICON } from '../../themes/icons'
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import theme from '../../themes/palette'
import CustomField from './CustomField'
import CustomTimePicker from './CustomTimePicker'
import {
  recyclable,
  singleRecyclable,
  timePeriod
} from '../../interfaces/collectionPoint'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import RecyclablesList from '../SpecializeComponents/RecyclablesList'
import { t } from 'i18next'
import * as Yup from 'yup'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../contexts/CommonTypeContainer'
import CustomTextField from './CustomTextField'
import { ErrorMessage, useFormik } from 'formik'
import { CreatePicoDetail } from '../../interfaces/pickupOrder'
import RecyclablesListSingleSelect from '../SpecializeComponents/RecyclablesListSingleSelect'
import { dateToLocalTime } from '../Formatter'
import { v4 as uuidv4 } from 'uuid'
import { collectorList, manuList } from '../../interfaces/common'
import CustomAutoComplete from './CustomAutoComplete'
import i18n from '../../setups/i18n'
import dayjs, { Dayjs } from 'dayjs'
import { format } from '../../constants/constant'
import { localStorgeKeyName } from '../../constants/constant'

type props = {
  onClose: () => void
  setState: (val: CreatePicoDetail[]) => void
  data: CreatePicoDetail[]
  setId: Dispatch<SetStateAction<number>>
  picoHisId: string | null
  editRowId: number | null
  isEditing: boolean
}
type CombinedType = manuList[] | collectorList[]
const loginId = localStorage.getItem(localStorgeKeyName.username) || ''

const initValue = {
  id: -1,
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
  pickupAt: '',
  recycType: '',
  recycSubType: '',
  weight: 0
}

const CreateRecycleFormLogistic = ({
  onClose,
  setState,
  data,
  editRowId,
  isEditing,
  picoHisId
}: props) => {
  const { recycType, manuList, collectorList } =
    useContainer(CommonTypeContainer)
  const [editRow, setEditRow] = useState<CreatePicoDetail>()
  const [updateRow, setUpdateRow] = useState<CreatePicoDetail>()
  const [defaultRecyc, setDefaultRecyc] = useState<singleRecyclable>()
  const currentLanguage = localStorage.getItem('selectedLanguage') || 'zhhk'

  const setDefRecyc = (picoDtl: CreatePicoDetail) => {
    const defRecyc: singleRecyclable = {
      recycTypeId: picoDtl.recycType,
      recycSubTypeId: picoDtl.recycSubType
    }
    //console.log("set def", defRecyc);
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

      console.log(editRow)

      const index = data.indexOf(editRow)

      formik.setValues({
        id: index,
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
        weight: editRow.weight
      })
    }
  }, [editRow])

  useEffect(() => {
    console.log('defaultRecyc: ', defaultRecyc)
  }, [defaultRecyc])

  const validateSchema = Yup.lazy((values) => {
    let prevData: CreatePicoDetail[] = []
    if (editRow) {
      prevData = data.filter((item) => item.id != editRow.id)
    } else {
      prevData = data
    }

    console.log('prevData', prevData)
    return Yup.object().shape({
      pickupAt: Yup.string().test(
        'not-in-prev-data',
        'Pickup time already exists in previous data',
        function (value) {
          return !prevData.some((item) => item.pickupAt === value)
        }
      ),
      senderName: Yup.string().required('This sendername is required'),
      senderAddr: Yup.string()
        .required('This senderAddr is required')
        .test(
          'not-same-as-receiver',
          'Sender address cannot be the same as receiver address',
          function (value) {
            const receiverAddr = values.receiverAddr
            return value !== receiverAddr
          }
        )
        .test(
          'not-in-prev-data',
          'Sender address already exists in previous data',
          function (value) {
            return !prevData.some((item) => item.senderAddr === value)
          }
        ),
      receiverName: Yup.string().required('This receiverName is required'),
      receiverAddr: Yup.string()
        .required('This receiverAddr is required')
        .test(
          'not-same-as-sender',
          'Receiver address cannot be the same as sender address',
          function (value) {
            const senderAddr = values.senderAddr
            return value !== senderAddr
          }
        )
        .test(
          'not-in-prev-data',
          'Receiver address already exists in previous data',
          function (value) {
            return !prevData.some((item) => item.receiverAddr === value)
          }
        ),
      recycType: Yup.string().required('This recycType is required'),
      recycSubType: Yup.string().required('This recycSubType is required'),
      weight: Yup.number().required('This weight is required')
    })
  })

  //console.log(JSON.stringify(data)+'qwesss')

  const formik = useFormik({
    initialValues: initValue,
    validationSchema: validateSchema,

    onSubmit: (values, { resetForm }) => {
      console.log(values)
      // alert(JSON.stringify(values, null, 2));
      if (isEditing) {
        //editing row
        const updatedData = data.map((row, id) => {
          return id === values.id ? values : row
        })
        setState(updatedData)
      } else {
        //creating row
        var updatedValues: CreatePicoDetail = values
        updatedValues.id = data.length
        //console.log("data: ",data," updatedValues: ",updatedValues)
        setState([...data, updatedValues])
      }
      resetForm()
      onClose && onClose()
    }
  })

  const TextFields = [
    {
      label: t('pick_up_order.detail.sender_name'),
      id: 'senderName',
      value: formik.values.senderName,
      error: formik.errors.senderName && formik.touched.senderName
    },
    {
      label: t('pick_up_order.detail.receiver'),
      id: 'receiverName',
      value: formik.values.receiverName,
      error: formik.errors.receiverName && formik.touched.receiverName
    },
    {
      label: t('pick_up_order.detail.recycling_location'),
      id: 'senderAddr',
      value: formik.values.senderAddr,
      error: formik.errors.senderAddr && formik.touched.senderAddr
    },
    {
      label: t('pick_up_order.detail.arrived'),
      id: 'receiverAddr',
      value: formik.values.receiverAddr,
      error: formik.errors.receiverAddr && formik.touched.receiverAddr
    }
  ]

  const initialTime = '2024-02-10T09:00:00' // Example initial time string
  const parsedDate = new Date(initialTime) // Parse the string into a Date object

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={localstyles.modal} onClick={handleOverlayClick}>
            <Box sx={localstyles.container}>
              <Box
                sx={{ display: 'flex', flex: '1', p: 4, alignItems: 'center' }}
              >
                <Box>
                  <Typography sx={styles.header4}>
                    {editRow
                      ? t('pick_up_order.item.edit')
                      : t('add_warehouse_page.new')}
                  </Typography>
                  <Typography sx={styles.header3}>
                    {t('pick_up_order.recyclForm.expected_recycling')}
                  </Typography>
                </Box>

                <Box sx={{ marginLeft: 'auto' }}>
                  <Button
                    variant="outlined"
                    sx={localstyles.button}
                    type="submit"
                  >
                    {t('col.save')}
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      ...localstyles.button,
                      color: '#7CE495',
                      bgcolor: 'white'
                    }}
                    onClick={() => onClose && onClose()}
                  >
                    {t('col.cancel')}
                  </Button>
                  <IconButton sx={{ ml: '25px' }}>
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
                    value={
                      formik.values.pickupAt ? formik.values.pickupAt : null
                    }
                    onChange={(value) => {
                      if (value != null)
                        formik.setFieldValue(
                          'pickupAt',

                          dateToLocalTime(new Date(value))
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
                    defaultRecycL={defaultRecyc}
                    itemColor={{ bgColor: '#ECF5EE', borderColor: '#63D884' }}
                    key={formik.values.id}
                  />
                </CustomField>
                <CustomField
                  label={t('pick_up_order.recyclForm.weight')}
                  mandatory
                >
                  <CustomTextField
                    id="weight"
                    placeholder={t('userAccount.pleaseEnterNumber')}
                    onChange={formik.handleChange}
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
                            (option) => option.collectorNameTchi
                          ) ?? []),
                          ...(manuList?.map(
                            (option) => option.manufacturerNameTchi
                          ) ?? [])
                        ]}
                        sx={{ width: '100%' }}
                        onChange={(
                          _: SyntheticEvent,
                          newValue: string | null
                        ) => formik.setFieldValue(it.id, newValue)}
                        onInputChange={(event: any, newInputValue: string) => {
                          console.log(newInputValue) // Log the input value
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
    borderColor: '#7CE495',
    color: 'white',
    width: '100px',
    height: '35px',
    p: 1,
    bgcolor: '#7CE495',
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

export default CreateRecycleFormLogistic
