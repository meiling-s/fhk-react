import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Divider, Grid, Autocomplete, TextField } from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import CustomItemList from '../../../components/FormComponents/CustomItemList'
import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import {
  editStaff,
  createStaff,
  getLoginIdList,
  getStaffTitle
} from '../../../APICalls/staff'

import { styles } from '../../../constants/styles'

import { formErr } from '../../../constants/constant'
import { returnErrorMsg } from '../../../utils/utils'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import { Staff, CreateStaff, EditStaff } from '../../../interfaces/staff'

import { localStorgeKeyName } from '../../../constants/constant'

interface CreateVehicleProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  selectedItem?: Staff | null
}

interface FormValues {
  [key: string]: string
}

const StaffDetail: FunctionComponent<CreateVehicleProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  selectedItem
}) => {
  const { t } = useTranslation()

  const initialFormValues = {
    loginId: '',
    staffNameTchi: '',
    staffNameEng: '',
    staffNameSchi: '',
    contactNo: '',
    email: '',
    titleId: ''
  }
  const [formData, setFormData] = useState<FormValues>(initialFormValues)
  const [loginIdList, setLoginIdList] = useState<il_item[]>([])
  const [selectedLoginId, setSelectedLoginId] = useState<string>('')
  const [staffTitleList, setStaffTitleList] = useState<il_item[]>([])
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const loginName = localStorage.getItem(localStorgeKeyName.username) || ''
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ''

  const staffField = [
    {
      label: t('staffManagement.loginName'),
      placeholder: t('staffManagement.enterName'),
      field: 'loginId',
      type: 'autocomplete'
    },
    {
      label: t('staffManagement.employeeChineseName'),
      placeholder: t('staffManagement.enterName'),
      field: 'staffNameTchi',
      type: 'text'
    },
    {
      label: t('staffManagement.employeeChineseCn'),
      placeholder: t('staffManagement.enterName'),
      field: 'staffNameSchi',
      type: 'text'
    },
    {
      label: 'Staff English Name',
      placeholder: t('staffManagement.enterName'),
      field: 'staffNameEng',
      type: 'text'
    },
    {
      label: t('staffManagement.position'),
      placeholder: '',
      field: 'titleId',
      type: 'option'
    },
    {
      label: t('staffManagement.contactNumber'),
      placeholder: t('staffManagement.enterContactNo'),
      field: 'contactNo',
      type: 'text'
    },
    {
      label: t('staffManagement.email'),
      placeholder: t('staffManagement.enterEmail'),
      field: 'email',
      type: 'text'
    }
  ]

  useEffect(() => {
    initLoginIdList()
    initStaffTitle()
  }, [drawerOpen])

  const initLoginIdList = async () => {
    const result = await getLoginIdList()
    if (result) {
      const data = result.data
      var loginIdMapping: il_item[] = []
      data.forEach((item: any) => {
        loginIdMapping.push({
          id: item.loginId,
          name: item.loginId
        })
      })
      setLoginIdList(loginIdMapping)
    }
  }

  const initStaffTitle = async () => {
    const result = await getStaffTitle()
    if (result) {
      const data = result.data.content
      var staffTitle: il_item[] = []
      data.forEach((item: any) => {
        staffTitle.push({
          id: item.titleId,
          name: item.titleNameTchi
        })
      })
      setStaffTitleList(staffTitle)
    }
  }

  const mappingData = () => {
    if (selectedItem != null) {
      console.log('selectedItem', selectedItem)
      setFormData({
        loginId: selectedItem.loginId,
        staffNameTchi: selectedItem.staffNameTchi,
        staffNameEng: selectedItem.staffNameEng,
        staffNameSchi: selectedItem.staffNameSchi,
        contactNo: selectedItem.contactNo,
        email: selectedItem.email,
        titleId: selectedItem.titleId
      })
      setSelectedLoginId(selectedItem.loginId)
    }
  }

  const resetFormData = () => {
    setFormData(initialFormValues)
    setValidation([])
    setTrySubmited(false)
    setSelectedLoginId('')
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

  useEffect(() => {
    const validate = async () => {
      const tempV: formValidate[] = []
      const fieldMapping: FormValues = {
        loginId: t('staffManagement.loginName'),
        staffNameTchi: t('staffManagement.employeeChineseName'),
        staffNameSchi: t('staffManagement.employeeChineseName'),
        staffNameEng: 'Staff English Name',
        titleId: t('staffManagement.position'),
        contactNo: t('staffManagement.contactNumber'),
        email: t('staffManagement.email')
      }
      Object.keys(formData).forEach((fieldName) => {
        formData[fieldName as keyof FormValues].trim() === '' &&
          tempV.push({
            field: fieldMapping[fieldName as keyof FormValues],
            problem: formErr.empty,
            type: 'error'
          })
      })
      setValidation(tempV)
    }

    validate()
  }, [formData.loginId, formData.staffNameTchi, formData.staffNameEng, formData.staffNameSchi, formData.contactNo, formData.email, formData.titleId ])

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const handleSubmit = () => {
    const staffData: CreateStaff = {
      tenantId: tenantId.toString(),
      staffNameTchi: formData.staffNameTchi,
      staffNameSchi: formData.staffNameSchi,
      staffNameEng: formData.staffNameEng,
      titleId: formData.titleId,
      contactNo: formData.contactNo,
      loginId: formData.loginId,
      status: 'ACTIVE',
      gender: 'M',
      email: formData.email,
      salutation: 'salutation',
      createdBy: loginName,
      updatedBy: loginName
    }

    if (action == 'add') {
      handleCreateVehicle(staffData)
    } else {
      handleEditVehicle()
    }
  }

  const handleCreateVehicle = async (staffData: CreateStaff) => {
    if (validation.length === 0) {
      const result = await createStaff(staffData)
      console.log('result', result?.data)
      if (result?.data) {
        console.log('result2', result?.data)
        onSubmitData('success', 'Success created data')
        resetFormData()
        handleDrawerClose()
      } else {
        onSubmitData('error', 'Failed created data')
      }
    } else {
      setTrySubmited(true)
    }
  }

  const handleEditVehicle = async () => {
    const editData: EditStaff = {
      staffNameTchi: formData.staffNameTchi,
      staffNameSchi: formData.staffNameSchi,
      staffNameEng: formData.staffNameEng,
      titleId: formData.titleId,
      contactNo: formData.contactNo,
      loginId: formData.loginId,
      status: 'ACTIVE',
      gender: 'M',
      email: formData.email,
      salutation: 'salutation',
      updatedBy: loginName
    }
    console.log("handleEditVehicle",validation.length )
    if (validation.length == 0) {
      if (selectedItem != null) {
        const result = await editStaff(editData, selectedItem.staffId)
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
    const editData: EditStaff = {
      staffNameTchi: formData.staffNameTchi,
      staffNameSchi: formData.staffNameSchi,
      staffNameEng: formData.staffNameEng,
      titleId: formData.titleId,
      contactNo: formData.contactNo,
      loginId: formData.loginId,
      status: 'DELETED',
      gender: 'M',
      email: formData.email,
      salutation: 'salutation',
      updatedBy: loginName
    }
    if (selectedItem != null) {
      const result = await editStaff(editData, selectedItem.staffId)
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
          title: t('top_menu.add_new'),
          subTitle: selectedItem?.staffId,
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
              item.type == 'text' ? (
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
              ) : item.type == 'autocomplete' ? (
                <CustomField label={item.label} mandatory>
                  {action === 'add' ? (
                    <Autocomplete
                      disablePortal
                      id="contractNo"
                      defaultValue={selectedLoginId}
                      options={loginIdList.map((login) => login.name)}
                      onChange={(event, value) => {
                        if (value) {
                          handleFieldChange(item.field as keyof FormValues, value)
                          setSelectedLoginId(value)
                        }
                      }}
                      value={selectedLoginId}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={item.placeholder}
                          sx={[styles.textField, { width: 320 }]}
                          InputProps={{
                            ...params.InputProps,
                            sx: styles.inputProps,
                            
                          }}
                          disabled={action != 'add'}
                          error={checkString(selectedLoginId)}
                        />
                      )}
                    />
                  ) : (
                    <TextField
                      placeholder={item.placeholder}
                      sx={[styles.textField, { width: 320 }]}
                      InputProps={{
                        readOnly: true,
                        sx: styles.inputProps,
                      }}
                      disabled={true}
                      value={selectedLoginId}
                    />
                  )}
                </CustomField>
              ) : (
                <CustomField label={t('staffManagement.position')} mandatory>
                  <CustomItemList
                    items={staffTitleList || []}
                    singleSelect={(values) => {
                      handleFieldChange(item.field as keyof FormValues, values)
                      
                    }}
                    value={formData[item.field as keyof FormValues]}
                    defaultSelected={selectedItem?.titleId}
                  />
                </CustomField>
              )
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

export default StaffDetail
