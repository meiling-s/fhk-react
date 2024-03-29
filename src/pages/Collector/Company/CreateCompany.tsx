import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Divider, Grid } from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import { editCompany, createCompany } from '../../../APICalls/Collector/company'
import { returnErrorMsg } from '../../../utils/utils'
import { localStorgeKeyName } from '../../../constants/constant'
import { Company, CreateCompany as CreateCompanyItem, UpdateCompany } from '../../../interfaces/company'

interface CreateCompany {
  companyType: string,
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  selectedItem?: Company | null
}

interface FormValues {
  [key: string]: string
}

const CompanyDetail: FunctionComponent<CreateCompany> = ({
  companyType,
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  selectedItem
}) => {
  const { t } = useTranslation()

  const initialFormValues = {
    loginId: '',
    nameTchi: '',
    nameEng: '',
    nameSchi: '',
    description: '',
    remark: '',
    companyId: ''
  }
  const [formData, setFormData] = useState<FormValues>(initialFormValues)
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const loginName : string = localStorage.getItem(localStorgeKeyName.username) ?? ''
  const [prefixItemName, setPrefixItemName] = useState<string>('')
  const staffField = [
    {
      label: t('common.traditionalChineseName'),
      placeholder: t('common.enterName'),
      field: 'nameTchi',
      type: 'text'
    },
    {
      label: t('common.simplifiedChineseName'),
      placeholder: t('common.enterName'),
      field: 'nameSchi',
      type: 'text'
    },
    {
      label: t('common.englishName'),
      placeholder: t('common.enterName'),
      field: 'nameEng',
      type: 'text'
    },
    {
      label: t('companyManagement.brNo'),
      placeholder: t('companyManagement.enterBrNo'),
      field: 'brBo',
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
        companyId: selectedItem.companyId,
        nameTchi: selectedItem.nameTchi,
        nameEng: selectedItem.nameEng,
        nameSchi: selectedItem.nameSchi,
        brNo: selectedItem.brNo,
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

  useEffect(() => {
    const prefixName = companyType === 'manulist' ? 'manufacturer' : companyType.replace('list', '')
    setPrefixItemName(prefixName)
    console.log({prefixName})
  }, [companyType])

  const checkString = (s: string) => {
    if (!trySubmited) {
      return false
    }
    return s == ''
  }

  const validate = async () => {
    const tempV: formValidate[] = []
    const fieldMapping: FormValues = {
      nameTchi: t('common.traditionalChineseName'),
      nameSchi: t('common.simplifiedChineseName'),
      nameEng: t('common.englishName'),
      brNo: t('companyManagement.brNo'),
      description: t('common.description'),
      remark: t('common.remark')
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
    formData.companyId,
    formData.nameTchi,
    formData.nameEng,
    formData.nameSchi,
    formData.brNo,
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
    const staffData: CreateCompanyItem = {
      nameTchi: formData.nameTchi,
      nameSchi: formData.nameSchi,
      nameEng: formData.nameEng,
      description: formData.description,
      brNo: formData.brNo,
      status: 'ACTIVE',
      remark: formData.remark,
      createdBy: loginName,
      updatedBy: loginName
    }

    if (action === 'add') {
      handleCreateCompany(staffData)
    } else {
      handleEditCompany()
    }
  }

  const handleCreateCompany = async (staffData: CreateCompanyItem) => {
    validate()
    if (validation.length === 0) {
      const data: {
        description: string,
        brNo: string,
        status: string,
        remark: string,
        createdBy: string,
        updatedBy: string,
        [key: string]: string,
      } = {
        description: staffData.description,
        brNo: staffData.brNo,
        status: staffData.status,
        remark: staffData.remark,
        createdBy: staffData.createdBy,
        updatedBy: staffData.updatedBy
      }
      data[`${prefixItemName}NameTchi`] = staffData.nameTchi
      data[`${prefixItemName}NameSchi`] = staffData.nameSchi
      data[`${prefixItemName}NameEng`] = staffData.nameEng
      const result = await createCompany(companyType, data)
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
  }

  const handleEditCompany = async () => {
    const editData: UpdateCompany = {
      nameTchi: formData.nameTchi,
      nameSchi: formData.nameSchi,
      nameEng: formData.nameEng,
      companyId: formData.companyId,
      description: formData.description,
      remark: formData.remark,
      status: 'ACTIVE',
      createdBy: formData.createdBy,
      updatedBy: loginName,
      brNo: formData.brNo,
    }
    const data: {
      description: string,
      brNo: string,
      status: string,
      remark: string,
      createdBy: string,
      updatedBy: string,
      [key: string]: string,
    } = {
      description: editData.description,
      brNo: editData.brNo,
      status: editData.status,
      remark: editData.remark,
      createdBy: editData.createdBy,
      updatedBy: editData.updatedBy
    }
    data[`${prefixItemName}NameTchi`] = editData.nameTchi
    data[`${prefixItemName}NameSchi`] = editData.nameSchi
    data[`${prefixItemName}NameEng`] = editData.nameEng
    if (validation.length === 0) {
      if (selectedItem != null) {
        console.log({companyType})
        const result = await editCompany(companyType, selectedItem.companyId, data)
        if (result) {
          onSubmitData('success', t('common.editSuccessfully'))
          resetFormData()
          handleDrawerClose()
        }
      }
    } else {
      setTrySubmited(true)
    }
  }

  const handleDelete = async () => {
    const editData: UpdateCompany = {
      nameTchi: formData.nameTchi,
      nameSchi: formData.nameSchi,
      nameEng: formData.nameEng,
      companyId: formData.companyId,
      brNo: formData.brNo,
      description: formData.description,
      remark: formData.remark,
      status: 'DELETED',
      createdBy: formData.createdBy,
      updatedBy: loginName,
    }
    const data: {
      description: string,
      brNo: string,
      status: string,
      remark: string,
      updatedBy: string,
      [key: string]: string,
    } = {
      description: editData.description,
      brNo: editData.brNo,
      status: editData.status,
      remark: editData.remark,
      createdBy: editData.createdBy,
      updatedBy: editData.updatedBy
    }
    data[`${prefixItemName}NameTchi`] = editData.nameTchi
    data[`${prefixItemName}NameSchi`] = editData.nameSchi
    data[`${prefixItemName}NameEng`] = editData.nameEng
    if (selectedItem != null) {
      const result = await editCompany(companyType, selectedItem.companyId, data)
      if (result) {
        onSubmitData('success', t('common.deletedSuccessfully'))
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
              : selectedItem?.nameTchi,
          subTitle:
            action == 'add'
              ? t(`companyManagement.${companyType}`)
              : selectedItem?.companyId,
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

export default CompanyDetail
