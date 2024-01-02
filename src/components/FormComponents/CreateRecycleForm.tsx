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
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { styles } from '../../constants/styles'
import { DELETE_OUTLINED_ICON } from '../../themes/icons'
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import theme from '../../themes/palette'
import CustomField from './CustomField'
import CustomTimePicker from './CustomTimePicker'
import { recyclable, timePeriod } from '../../interfaces/collectionPoint'
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
import { Navigate, useNavigate } from 'react-router'
import RecyclablesListSingleSelect from '../SpecializeComponents/RecyclablesListSingleSelect'
import { dateToLocalTime } from '../Formatter'
import { useTranslation } from 'react-i18next'
import dayjs, { Dayjs } from 'dayjs'

const CreateRecycleForm = ({
  onClose,
  setState,
  setId,
  data,
  id,
  editRowId
}: {
  onClose: () => void
  setState: (val: CreatePicoDetail[]) => void
  data: CreatePicoDetail[]
  setId: Dispatch<SetStateAction<number>>
  id: number
  editRowId: number | null
}) => {
  const [recyclables, setRecyclables] = useState<recyclable[]>([])
  const { recycType } = useContainer(CommonTypeContainer)
  const editRow = data.find((row) => row.id === editRowId)
  const { t } = useTranslation()

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
      formik.setValues({
        id: id,
        senderId: '1',
        senderName: editRow.senderName,
        senderAddr: editRow.senderAddr,
        senderAddrGps: [11, 12],
        receiverId: '1',
        receiverName: editRow.receiverName,
        receiverAddr: editRow.receiverAddr,
        receiverAddrGps: [11, 12],
        status: 'CREATED',
        createdBy: 'ADMIN',
        updatedBy: 'ADMIN',
        pickupAt: '',
        recycType: editRow.recycType,
        recycSubType: editRow.recycSubType,
        weight: editRow.weight
      })
    }
  }, [editRow])

  const validateSchema = Yup.object().shape({
    senderName: Yup.string().required('This sendername is required'),
    senderAddr: Yup.string().required('This senderAddr is required'),
    receiverName: Yup.string().required('This receiverName is required'),
    receiverAddr: Yup.string().required('This receiverAddr is required'),
    recycType: Yup.string().required('This recycType is required'),
    recycSubType: Yup.string().required('This recycSubType is required'),
    weight: Yup.number().required('This weight is required')
  })

  const formik = useFormik({
    initialValues: {
      id: id,
      senderId: '1',
      senderName: '',
      senderAddr: '',
      senderAddrGps: [11, 12],
      receiverId: '1',
      receiverName: '',
      receiverAddr: '',
      receiverAddrGps: [11, 12],
      status: 'CREATED',
      createdBy: 'ADMIN',
      updatedBy: 'ADMIN',
      pickupAt: '',
      recycType: '',
      recycSubType: '',
      weight: 0
    },
    validationSchema: validateSchema,

    onSubmit: (values) => {
      console.log(values)
      alert(JSON.stringify(values, null, 2))
      const updatedValues: any = {
        ...values,
        id: id + 1
        // items:items,
      }

      setState([...data, updatedValues])
      setId(id + 1)
      onClose && onClose()
    }
  })
  console.log(formik.errors)

  const TextFields = [
    {
      label: t('pick_up_order.recyclForm.shipping_company'),
      placeholder: t('pick_up_order.recyclForm.placeholder'),
      id: 'senderName',
      value: formik.values.senderName,
      error: formik.errors.senderName && formik.touched.senderName
    },
    {
      label: t('pick_up_order.recyclForm.receiver'),
      placeholder: t('pick_up_order.recyclForm.placeholder'),
      id: 'receiverName',
      value: formik.values.receiverName,
      error: formik.errors.receiverName && formik.touched.receiverName
    },
    {
      label: t('pick_up_order.recyclForm.recycling_location'),
      placeholder: t('pick_up_order.recyclForm.placeholder'),
      id: 'senderAddr',
      value: formik.values.senderAddr,
      error: formik.errors.senderAddr && formik.touched.senderAddr
    },
    {
      label: t('pick_up_order.recyclForm.arrived'),
      placeholder: t('pick_up_order.recyclForm.placeholder'),
      id: 'receiverAddr',
      value: formik.values.receiverAddr,
      error: formik.errors.receiverAddr && formik.touched.receiverAddr
    }
  ]

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
                    {t('pick_up_order.recyclForm.new')}
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
                    {t('pick_up_order.recyclForm.finish')}
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      ...localstyles.button,
                      color: theme.palette.primary.main,
                      bgcolor: 'white'
                    }}
                    onClick={() => onClose && onClose()}
                  >
                    {t('pick_up_order.recyclForm.cancel')}
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
                    value={formik.values.pickupAt}
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
                  />
                </CustomField>
                <CustomField
                  label={t('pick_up_order.recyclForm.weight')}
                  mandatory
                >
                  <CustomTextField
                    id="weight"
                    placeholder="请輸入重量"
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
                {TextFields.map((t) => (
                  <CustomField mandatory label={t.label}>
                    <CustomTextField
                      id={t.id}
                      placeholder={t.placeholder}
                      multiline={true}
                      rows={4}
                      onChange={formik.handleChange}
                      value={t.value}
                      sx={{ width: '100%' }}
                      error={t.error || undefined}
                    ></CustomTextField>
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
    bgcolor: theme.palette.primary.main,
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
