import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Divider, Grid } from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import {
  createStaffTitle,
  editStaffTitle
} from '../../../APICalls/Collector/staffTitle'
import { extractError, returnErrorMsg, showErrorToast } from '../../../utils/utils'
import { STATUS_CODE, formErr, localStorgeKeyName } from '../../../constants/constant'
import {
  StaffTitle,
  CreateStaffTitle as CreateStaffTitleItem,
  UpdateStaffTitle
} from '../../../interfaces/staffTitle'
import { useNavigate } from 'react-router-dom'

interface CreateStaffTitle {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  selectedItem?: StaffTitle | null
  engNameList: string[]
  schiNameList: string[]
  tchiNameList: string[]
}

interface FormValues {
  [key: string]: string
}

const StaffTitleDetail: FunctionComponent<CreateStaffTitle> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  selectedItem,
  engNameList = [],
  schiNameList = [],
  tchiNameList = []
}) => {
  const { t } = useTranslation()

  const initialFormValues = {
    titleNameTchi: '',
    titleNameSchi: '',
    titleNameEng: '',
    duty: '',
    description: '',
    remark: ''
  }
  const [formData, setFormData] = useState<FormValues>(initialFormValues)
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const loginName = localStorage.getItem(localStorgeKeyName.username) || ''
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ''
  const [engNameExisting, setEngNameExisting] = useState<string[]>([])
  const [schiNameExisting, setSchiNameExisting] = useState<string[]>([])
  const [tchiNameExisting, setTchiNameExisting] = useState<string[]>([])
  const [version, setVersion] = useState<number>(0)

  const staffField = [
    {
      label: t('common.traditionalChineseName'),
      placeholder: t('common.enterName'),
      field: 'titleNameTchi',
      type: 'text'
    },
    {
      label: t('common.simplifiedChineseName'),
      placeholder: t('common.enterName'),
      field: 'titleNameSchi',
      type: 'text'
    },
    {
      label: t('common.englishName'),
      placeholder: t('common.enterName'),
      field: 'titleNameEng',
      type: 'text'
    },
    {
      label: t('staff_title.duty'),
      placeholder: t('staff_title.enter_duty'),
      field: 'duty',
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
  const navigate = useNavigate();

  const mappingData = () => {
    if (selectedItem != null) {
      setFormData({
        titleId: selectedItem.titleId,
        // duty: selectedItem.duty.length > 0 ? selectedItem.duty[0] : '',
        duty: selectedItem.duty.toString(),
        titleNameTchi: sanitizeString(selectedItem.titleNameTchi),
        titleNameEng: sanitizeString(selectedItem.titleNameEng),
        titleNameSchi: sanitizeString(selectedItem.titleNameSchi),
        description: sanitizeString(selectedItem.description),
        remark: sanitizeString(selectedItem.remark)
      })

      setVersion(selectedItem.version ?? 0)
      setEngNameExisting(
        engNameList.filter((item) => item != selectedItem.titleNameEng)
      )
      setSchiNameExisting(
        schiNameList.filter((item) => item != selectedItem.titleNameSchi)
      )
      setTchiNameExisting(
        tchiNameList.filter((item) => item != selectedItem.titleNameTchi)
      )
    }
  }

  const sanitizeString = (str: string) => {
    return str.replace(/\u0000/g, '')
  }

  const resetFormData = () => {
    setFormData(initialFormValues)
    setValidation([])
    setTrySubmited(false)
  }

  useEffect(() => {
    if (action !== 'add') {
      mappingData()
    } else {
      resetFormData()
      setEngNameExisting(engNameList)
      setSchiNameExisting(schiNameList)
      setTchiNameExisting(tchiNameList)
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
      titleNameTchi: t('common.traditionalChineseName'),
      titleNameSchi: t('common.simplifiedChineseName'),
      titleNameEng: t('common.englishName'),
      duty: t('staff_title.duty'),
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

    // if (
    //   tchiNameExisting.some(
    //     (item) => item.toLowerCase() === formData.titleNameTchi.toLowerCase()
    //   )
    // ) {
    //   tempV.push({
    //     field: t('common.traditionalChineseName'),
    //     problem: formErr.alreadyExist,
    //     type: 'error'
    //   })
    // }

    // // Check for existing titles in Simplified Chinese
    // if (
    //   schiNameExisting.some(
    //     (item) => item.toLowerCase() === formData?.titleNameSchi.toLowerCase()
    //   )
    // ) {
    //   tempV.push({
    //     field: t('common.simplifiedChineseName'),
    //     problem: formErr.alreadyExist,
    //     type: 'error'
    //   })
    // }
    // console.log(engNameExisting, formData.titleNameEng)
    // // Check for existing titles in English
    // if (
    //   engNameExisting.some(
    //     (item) => item.toLowerCase() === formData.titleNameEng.toLowerCase()
    //   )
    // ) {
    //   tempV.push({
    //     field: t('common.englishName'),
    //     problem: formErr.alreadyExist,
    //     type: 'error'
    //   })
    // }

    setValidation(tempV)
    return tempV.length === 0
  }

  useEffect(() => {
    validate()
  }, [
    formData.titleNameTchi,
    formData.titleNameEng,
    formData.titleNameSchi,
    formData.duty,
    formData.description,
    formData.remark
  ])

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setFormData({
      ...formData,
      [field]: sanitizeString(value)
    })
  }

  const handleSubmit = async () => {
    const isValid = await validate()
    if (isValid) {
      const staffData: CreateStaffTitleItem = {
        tenantId: tenantId.toString(),
        titleNameTchi: formData.titleNameTchi,
        titleNameSchi: formData.titleNameSchi,
        titleNameEng: formData.titleNameEng,
        description: formData.description,
        duty: [formData.duty],
        status: 'ACTIVE',
        remark: formData.remark,
        createdBy: loginName,
        updatedBy: loginName
      }

      if (action === 'add') {
        handleCreateStaff(staffData)
      } else {
        handleEditStaff()
      }
    } else {
      setTrySubmited(true)
    }
  }

  const handleCreateStaff = async (staffData: CreateStaffTitleItem) => {
   try {
    validate()
    if (validation.length === 0) {
      const result = await createStaffTitle(staffData)
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
    const { state } = extractError(error);
    setTrySubmited(true)
    if(state.code === STATUS_CODE[503] ){
      navigate('/maintenance')
    } else {
      setTrySubmited(true)
      if(error?.response?.data?.status === STATUS_CODE[500]){
        setValidation(
          [
            {
              field: t('common.theNameAlreadyExist'),
              problem: '',
              type: 'error'
            }
          ]
        )
      }
      // onSubmitData('error', t('common.saveFailed'))
    }
    if (state.code === STATUS_CODE[409]) {
      const errorMessage = error.response.data.message
      if (errorMessage.includes('[titleNameDuplicate]')) {
        showErrorToast(handleDuplicateErrorMessage(errorMessage))
      } else {
        showErrorToast(error.response.data.message);
      }
    }
   }
  }

  const handleEditStaff = async () => {
   try {
    const editData: UpdateStaffTitle = {
      titleId: selectedItem?.titleId || '',
      titleNameTchi: formData.titleNameTchi,
      titleNameSchi: formData.titleNameSchi,
      titleNameEng: formData.titleNameEng,
      description: formData.description,
      duty: [formData.duty],
      status: 'ACTIVE',
      remark: formData.remark,
      updatedBy: loginName,
      version: version,
    }
    if (validation.length === 0) {
      if (selectedItem != null) {
        const result = await editStaffTitle(selectedItem.titleId, editData)
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
    const { state } = extractError(error);
    if(state.code === STATUS_CODE[503] ){
      navigate('/maintenance')
    } else if (state.code === STATUS_CODE[409]) {
      const errorMessage = error.response.data.message
      if (errorMessage.includes('[titleNameDuplicate]')) {
        showErrorToast(handleDuplicateErrorMessage(errorMessage))
      } else {
        showErrorToast(error.response.data.message);
      }
    }
   }
  }

  const handleDelete = async () => {
    const editData: UpdateStaffTitle = {
      titleId: selectedItem?.titleId || '',
      titleNameTchi: formData.titleNameTchi,
      titleNameSchi: formData.titleNameSchi,
      titleNameEng: formData.titleNameEng,
      description: formData.description,
      duty: [formData.duty],
      status: 'DELETED',
      remark: formData.remark,
      updatedBy: loginName,
      version: version,
    }
    if (selectedItem != null) {
      const result = await editStaffTitle(selectedItem.titleId, editData)
      if (result) {
        onSubmitData('success', t('common.deletedSuccessfully'))
        resetFormData()
        handleDrawerClose()
      }
    }
  }

  const handleDuplicateErrorMessage = (input: string) => {
    const replacements: { [key: string]: string } = {
      '[tchi]': 'Traditional Chinese Name',
      '[eng]': 'English Name',
      '[schi]': 'Simplified Chinese Name'
    };
  
    let result = input.replace(/\[titleNameDuplicate\]/, '');
  
    const matches = result.match(/\[(tchi|eng|schi)\]/g);
  
    if (matches) {
      const replaced = matches.map(match => replacements[match as keyof typeof replacements]);
  
      let formatted: string;
      if (replaced.length === 1) {
        formatted = replaced[0];
      } else if (replaced.length === 2) {
        formatted = replaced.join(' and ');
      } else if (replaced.length === 3) {
        formatted = `${replaced[0]}, ${replaced[1]} and ${replaced[2]}`;
      }
  
      result = result.replace(/\[(tchi|eng|schi)\]+/, formatted!);
  
      result = result.replace(/\[(tchi|eng|schi)\]/g, '');
    }
  
    return result.trim();
  };

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
              : selectedItem?.titleNameTchi,
          subTitle:
            action == 'add'
              ? t('top_menu.staff_positions')
              : selectedItem?.titleId,
          submitText: t('add_warehouse_page.save'),
          cancelText: t('add_warehouse_page.delete'),
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

export default StaffTitleDetail
