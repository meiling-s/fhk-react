import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Divider, Grid } from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import { editStaff, createStaff } from '../../../APICalls/staff'
import { formErr } from '../../../constants/constant'
import { returnErrorMsg } from '../../../utils/utils'
import { localStorgeKeyName } from '../../../constants/constant'
import { StaffTitle, CreateStaffTitle as CreateStaffTitleItem, UpdateStaffTitle } from '../../../interfaces/staffTitle'

interface CreateStaffTitle {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  selectedItem?: StaffTitle | null
}

interface FormValues {
  [key: string]: string
}

const StaffTitleDetail: FunctionComponent<CreateStaffTitle> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  selectedItem
}) => {
  const { t } = useTranslation()

  const initialFormValues = {
    loginId: '',
    titleNameTchi: '',
    titleNameEng: '',
    titleNameSchi: '',
    description: '',
    remark: '',
    titleId: ''
  }
  const [formData, setFormData] = useState<FormValues>(initialFormValues)
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const loginName = localStorage.getItem(localStorgeKeyName.username) || ''
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ''

  const staffField = [
    {
      label: t('staff_title.staff_title_tchi'),
      placeholder: t('staff_title.enterName'),
      field: 'titleNameTchi',
      type: 'text'
    },
    {
      label: t('staff_title.staff_title_schi'),
      placeholder: t('staff_title.enterName'),
      field: 'titleNameSchi',
      type: 'text'
    },
    {
      label: t('staff_title.staff_title_eng'),
      placeholder: t('staff_title.enterName'),
      field: 'titleNameEng',
      type: 'text'
    },
    {
      label: t('staff_title.duty'),
      placeholder: '',
      field: 'duty',
      type: 'text'
    },
    {
      label: t('staff_title.description'),
      placeholder: t('staff_title.enter_text'),
      field: 'description',
      type: 'text'
    },
    {
      label: t('staff_title.remark'),
      placeholder: t('staff_title.enter_text'),
      field: 'remark',
      type: 'text'
    }
  ]

  const mappingData = () => {
    if (selectedItem != null) {
      setFormData({
        titleId: selectedItem.titleId,
        duty: selectedItem.duty,
        titleNameTchi: selectedItem.titleNameTchi,
        titleNameEng: selectedItem.titleNameEng,
        titleNameSchi: selectedItem.titleNameSchi,
        description: selectedItem.description,
        remark: selectedItem.remark,
      })
    }
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
      titleNameTchi: t('staff_title.staff_title_tchi'),
      titleNameSchi: t('staff_title.staff_title_schi'),
      titleNameEng: t('staff_title.staff_title_eng'),
      duty: t('staff_title.duty'),
      description: t('staff_title.description'),
      remark: t('staff_title.remark')
    }
    Object.keys(formData).forEach((fieldName) => {
      console.log({fieldName})
      console.log(formData[fieldName])
      // formData[fieldName as keyof FormValues].trim() === '' &&
      //   tempV.push({
      //     field: fieldMapping[fieldName as keyof FormValues],
      //     problem: formErr.empty,
      //     type: 'error'
      //   })
    })
    setValidation(tempV)
  }

  useEffect(() => {
    validate()
  }, [
    formData.titleId,
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
      [field]: value
    })
  }

  const handleSubmit = () => {
    const staffData: CreateStaffTitleItem = {
      tenantId: tenantId.toString(),
      titleNameTchi: formData.titleNameTchi,
      titleNameSchi: formData.titleNameSchi,
      titleNameEng: formData.titleNameEng,
      description: formData.description,
      duty: formData.duty,
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
  }

  const handleCreateStaff = async (staffData: CreateStaffTitleItem) => {
    validate()
    if (validation.length === 0) {
      const result = await createStaff(staffData)
      if (result?.data) {
        onSubmitData('success', 'Success created data')
        resetFormData()
        handleDrawerClose()
      } else {
        setTrySubmited(true)
        onSubmitData('error', 'Failed created data')
      }
    } else {
      setTrySubmited(true)
    }
  }

  const handleEditStaff = async () => {
    const editData: UpdateStaffTitle = {
      titleNameTchi: formData.titleNameTchi,
      titleNameSchi: formData.titleNameSchi,
      titleNameEng: formData.titleNameEng,
      titleId: formData.titleId,
      description: formData.description,
      duty: formData.duty,
      status: 'ACTIVE',
      remark: formData.remark,
      updatedBy: loginName
    }
    if (validation.length == 0) {
      if (selectedItem != null) {
        const result = await editStaff(editData, selectedItem.titleId)
        if (result) {
          onSubmitData('success', 'Edit data success')
          resetFormData()
          handleDrawerClose()
        }
      }
    } else {
      setTrySubmited(true)
    }
  }

  const handleDelete = async () => {
    const editData: UpdateStaffTitle = {
      titleNameTchi: formData.titleNameTchi,
      titleNameSchi: formData.titleNameSchi,
      titleNameEng: formData.titleNameEng,
      titleId: formData.titleId,
      description: formData.description,
      duty: formData.loginId,
      status: 'DELETED',
      remark: formData.remark,
      updatedBy: loginName
    }
    if (selectedItem != null) {
      const result = await editStaff(editData, selectedItem.titleId)
      if (result) {
        onSubmitData('success', 'Deleted data success')
        resetFormData()
        handleDrawerClose()
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
              : selectedItem?.titleNameTchi,
          subTitle:
            action == 'add'
              ? t('staff_title.staff')
              : selectedItem?.titleId,
          submitText: t('add_warehouse_page.save'),
          cancelText: t('add_warehouse_page.delete'),
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
            {staffField.map((item, index) =>
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

export default StaffTitleDetail
