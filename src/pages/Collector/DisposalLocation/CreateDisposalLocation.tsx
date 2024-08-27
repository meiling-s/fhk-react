import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Divider, Grid } from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import {
  editDisposalLocation,
  createDisposalLocation
} from '../../../APICalls/Collector/disposalLocation'
import { extractError, returnErrorMsg } from '../../../utils/utils'
import { STATUS_CODE, formErr, localStorgeKeyName } from '../../../constants/constant'
import {
  DisposalLocation,
  CreateDisposalLocation as CreateDisposalLocationItem,
  UpdateDisposalLocation
} from '../../../interfaces/disposalLocation'
import { useNavigate } from 'react-router-dom'

interface CreateDisposalLocation {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  selectedItem?: DisposalLocation | null
  disposalList: DisposalLocation[]
}

interface FormValues {
  [key: string]: string
}

const DisposalLocationDetail: FunctionComponent<CreateDisposalLocation> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  selectedItem,
  disposalList = []
}) => {
  const { t } = useTranslation()

  const initialFormValues = {
    disposalLocNameTchi: '',
    disposalLocNameEng: '',
    disposalLocNameSchi: '',
    description: '',
    remark: ''
  }
  const [formData, setFormData] = useState<FormValues>(initialFormValues)
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const loginName = localStorage.getItem(localStorgeKeyName.username) || ''
  const [existingDisposal, setExistingDisposal] = useState<DisposalLocation[]>(
    []
  )
  const navigate = useNavigate();

  const staffField = [
    {
      label: t('common.traditionalChineseName'),
      placeholder: t('common.enterName'),
      field: 'disposalLocNameTchi',
      type: 'text'
    },
    {
      label: t('common.simplifiedChineseName'),
      placeholder: t('common.enterName'),
      field: 'disposalLocNameSchi',
      type: 'text'
    },
    {
      label: t('common.englishName'),
      placeholder: t('common.enterName'),
      field: 'disposalLocNameEng',
      type: 'text'
    },
    {
      label: t('common.description'),
      placeholder: t('common.enterText'),
      field: 'description',
      type: 'text'
    },
    {
      label: t('common.remark'),
      placeholder: t('common.enterText'),
      field: 'remark',
      type: 'text'
    }
  ]

  const mappingData = () => {
    if (selectedItem != null) {
      setFormData({
        disposalLocNameTchi: selectedItem.disposalLocNameTchi,
        disposalLocNameEng: selectedItem.disposalLocNameEng,
        disposalLocNameSchi: selectedItem.disposalLocNameSchi,
        description: selectedItem.description,
        remark: selectedItem.remark
      })
      //set existing disposal
      setExistingDisposal(
        disposalList.filter(
          (item) => item.disposalLocId != selectedItem.disposalLocId
        )
      )
    }
  }

  const resetFormData = () => {
    setFormData(initialFormValues)
    setValidation([])
    setTrySubmited(false)
  }

  useEffect(() => {
    if (action !== 'add') {
      setValidation([])
      setTrySubmited(false)
      mappingData()
    } else {
      resetFormData()
      setValidation([])
      setTrySubmited(false)
      setExistingDisposal(disposalList)
    }
  }, [drawerOpen])

  const checkString = (s: string) => {
    if (!trySubmited) {
      return false
    }
    return s == ''
  }

  const validate = async () => {
    const tempV: formValidate[] = []
    const fieldMapping: FormValues = {
      disposalLocNameTchi: t('common.traditionalChineseName'),
      disposalLocNameSchi: t('common.simplifiedChineseName'),
      disposalLocNameEng: t('common.englishName'),
      description: t('common.description'),
      remark: t('common.remark')
    }
    Object.keys(formData).forEach((fieldName) => {
      formData[fieldName as keyof FormValues].trim() === '' &&
        tempV.push({
          field: fieldMapping[fieldName as keyof FormValues],
          problem: formErr.empty,
          type: 'error'
        })
    })

    existingDisposal.forEach((item) => {
      if (
        item.disposalLocNameTchi.toLowerCase() ===
        formData.disposalLocNameTchi.toLowerCase()
      ) {
        tempV.push({
          field: t('common.traditionalChineseName'),
          problem: formErr.alreadyExist,
          type: 'error'
        })
      }
      if (
        item.disposalLocNameSchi.toLowerCase() ===
        formData.disposalLocNameSchi.toLowerCase()
      ) {
        tempV.push({
          field: t('common.simplifiedChineseName'),
          problem: formErr.alreadyExist,
          type: 'error'
        })
      }
      if (
        item.disposalLocNameEng.toLowerCase() ===
        formData.disposalLocNameEng.toLowerCase()
      ) {
        tempV.push({
          field: t('common.englishName'),
          problem: formErr.alreadyExist,
          type: 'error'
        })
      }
    })
    setValidation(tempV)
    return tempV.length === 0
  }

  useEffect(() => {
    validate()
  }, [
    formData.disposalLocNameTchi,
    formData.disposalLocNameEng,
    formData.disposalLocNameSchi,
    formData.description,
    formData.remark
  ])

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const handleSubmit = async () => {
    const isValid = await validate()
    if (isValid) {
      const staffData: CreateDisposalLocationItem = {
        disposalLocNameTchi: formData.disposalLocNameTchi,
        disposalLocNameSchi: formData.disposalLocNameSchi,
        disposalLocNameEng: formData.disposalLocNameEng,
        description: formData.description,
        location: '',
        locationGps: [],
        status: 'ACTIVE',
        remark: formData.remark,
        createdBy: loginName,
        updatedBy: loginName
      }

      if (action === 'add') {
        handleCreateDisposalLocation(staffData)
      } else {
        handleEditDisposalLocation()
      }
    } else {
      setTrySubmited(true)
    }
  }

  const handleCreateDisposalLocation = async (
    staffData: CreateDisposalLocationItem
  ) => {
    try {
      if (validation.length === 0) {
        const result = await createDisposalLocation(staffData)
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
    } catch (error:any) {
      const {state} =  extractError(error);
      if(state.code === STATUS_CODE[503] ){
        navigate('/maintenance')
      } else {
        setTrySubmited(true)
        let field = t('common.saveFailed');
        let problem = ''
        if(error?.response?.data?.status === STATUS_CODE[500]){
          field = t('general_settings.disposalLocation')
          problem = formErr.alreadyExist
        } 
        setValidation(
          [
            {
              field,
              problem,
              type: 'error'
            }
          ]
        )
        setTrySubmited(true)
        // onSubmitData('error', t('common.saveFailed'))
      }
    }
  }

  const handleEditDisposalLocation = async () => {
   try {
    const editData: UpdateDisposalLocation = {
      disposalLocId: selectedItem?.disposalLocId || '',
      disposalLocNameTchi: formData.disposalLocNameTchi,
      disposalLocNameSchi: formData.disposalLocNameSchi,
      disposalLocNameEng: formData.disposalLocNameEng,
      description: formData.description,
      status: 'ACTIVE',
      remark: formData.remark,
      updatedBy: loginName,
      location: '',
      locationGps: []
    }
    if (validation.length == 0) {
      if (selectedItem != null) {
        const result = await editDisposalLocation(
          selectedItem.disposalLocId,
          editData
        )
        if (result) {
          onSubmitData('success', t('common.editSuccessfully'))
          resetFormData()
          handleDrawerClose()
        }
      }
    } else {
      setTrySubmited(true)
    }
   } catch (error:any) {
    const {state} =  extractError(error);
    if(state.code === STATUS_CODE[503] ){
      navigate('/maintenance')
    }
   }
  }

  const handleDelete = async () => {
   try {
    const editData: UpdateDisposalLocation = {
      disposalLocId: formData?.disposalLocId || '',
      disposalLocNameTchi: formData.disposalLocNameTchi,
      disposalLocNameSchi: formData.disposalLocNameSchi,
      disposalLocNameEng: formData.disposalLocNameEng,
      description: formData.description,
      status: 'DELETED',
      remark: formData.remark,
      updatedBy: loginName,
      location: '',
      locationGps: []
    }
    if (selectedItem != null) {
      const result = await editDisposalLocation(
        selectedItem.disposalLocId,
        editData
      )
      if (result) {
        onSubmitData('success', t('common.deletedSuccessfully'))
        resetFormData()
        handleDrawerClose()
      }
    }
   } catch (error:any) {
    const {state} =  extractError(error);
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
          title:
            action == 'add'
              ? t('top_menu.add_new')
              : action == 'delete'
              ? t('add_warehouse_page.delete')
              : selectedItem?.disposalLocNameTchi,
          subTitle:
            action == 'add'
              ? t('top_menu.waste_disposal')
              : selectedItem?.disposalLocId,
          submitText: t('common.save'),
          cancelText: t('common.delete'),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
          onDelete: handleDelete,
          deleteText: t('common.deleteMessage')
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
            {staffField.map((item, index) => (
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
                    error={checkString(
                      formData[item.field as keyof FormValues]
                    )}
                  />
                </CustomField>
              </Grid>
            ))}
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
          </Grid>
        </Box>
      </RightOverlayForm>
    </div>
  )
}

export default DisposalLocationDetail
