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
  getStaffTitle,
  getStaffList
} from '../../../APICalls/staff'

import { styles } from '../../../constants/styles'
import UserConfirmModal from '../../../components/FormComponents/UserC'
import { formErr } from '../../../constants/constant'
import {
  returnErrorMsg,
  validateEmail,
  extractError,
  showErrorToast
} from '../../../utils/utils'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import { Staff, CreateStaff, EditStaff } from '../../../interfaces/staff'
import { useNavigate } from 'react-router-dom'
import { localStorgeKeyName, STATUS_CODE } from '../../../constants/constant'
import {
  postUserManufacturer,
  updateUserManufacturer
} from '../../../APICalls/userManufacturer'

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

const StaffManufacturerDetails: FunctionComponent<CreateVehicleProps> = ({
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
  const [existingEmail, setExistingEmail] = useState<string[]>([])
  const [showModalConfirm, setShowModalConfirm] = useState(false)
  const [version, setVersion] = useState<number>(0)
  const navigate = useNavigate()

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
    getExistingEmail()
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

  const getExistingEmail = async () => {
    try {
      const result = await getStaffList(0, 1000, null)

      if (result) {
        let tempEmail: string[] = []
        const data = result.data.content
        data.map((item: any) => {
          tempEmail.push(item.email)
        })

        setExistingEmail(tempEmail)
        console.log('existing', existingEmail)
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const mappingData = () => {
    if (selectedItem != null) {
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
      setVersion(selectedItem.version)
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

  const validate = async () => {
    const tempV: formValidate[] = []
    const fieldMapping: FormValues = {
      loginId: t('staffManagement.loginName'),
      staffNameTchi: t('staffManagement.employeeChineseName'),
      staffNameSchi: t('staffManagement.employeeChineseCn'),
      staffNameEng: 'Staff English Name',
      titleId: t('staffManagement.position'),
      contactNo: t('staffManagement.contactNumber'),
      email: t('staffManagement.email')
    }
    Object.keys(formData).forEach((fieldName) => {
      const fieldValue = formData[fieldName as keyof FormValues].trim()

      if (fieldValue === '') {
        tempV.push({
          field: fieldMapping[fieldName as keyof FormValues],
          problem: formErr.empty,
          type: 'error'
        })
      }

      if (
        fieldName === 'email' &&
        fieldValue != '' &&
        !validateEmail(fieldValue)
      ) {
        tempV.push({
          field: fieldMapping[fieldName as keyof FormValues],
          problem: formErr.wrongFormat,
          type: 'error'
        })
      }
    })

    setValidation(tempV)
  }

  useEffect(() => {
    validate()
  }, [
    formData.loginId,
    formData.staffNameTchi,
    formData.staffNameEng,
    formData.staffNameSchi,
    formData.contactNo,
    formData.email,
    formData.titleId
  ])

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const isEmailExisting = (email: string) => {
    const lowercaseEmail = email.toLowerCase()
    const isExisting = existingEmail.some(
      (existing) => existing.toLowerCase() === lowercaseEmail
    )

    return isExisting
  }

  const createStaffData = (): CreateStaff => ({
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
    updatedBy: loginName,
  })

  const handleCreateOrEditStaff = () => {
    const staffData = createStaffData()
    setShowModalConfirm(false)
    handleCreateStaff(staffData)
  }

  const handleSubmit = () => {
    const staffData = createStaffData()

    if (validation.length !== 0 && action === 'add') {
      setTrySubmited(true)
      return
    }

    action === 'add' ? handleAddStaff(staffData) : handleEditStaff()

    // if (action == 'add') {
    //   handleCreateStaff(staffData)
    // } else {
    //   handleEditStaff()
    // }
  }

  const handleAddStaff = (staffData: CreateStaff) => {
    if (isEmailExisting(formData.email)) {
      setShowModalConfirm(true)
    } else {
      setTrySubmited(true)
      handleCreateStaff(staffData)
    }
  }

  const handleCreateStaff = async (staffData: CreateStaff) => {
    validate()
    if (validation.length === 0) {
      const result = await postUserManufacturer(staffData)
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
    try {
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
        updatedBy: loginName,
        version: version,
      }
      if (validation.length == 0) {
        if (selectedItem != null) {
          const result = await updateUserManufacturer(
            selectedItem.staffId,
            editData
          )
          if (result) {
            onSubmitData('success', 'Edit data success')
            resetFormData()
            handleDrawerClose()
          }
        }
      } else {
        setTrySubmited(true)
      }
    } catch (error: any) {
      const {state} = extractError(error);
        if (state.code === STATUS_CODE[503]) {
          navigate('/maintenance')
        } else if (state.code === STATUS_CODE[409]){
          showErrorToast(error.response.data.message);
        }
    }
  }

  const handleDelete = async () => {
    try {
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
        updatedBy: loginName,
        version: version,
      }
      if (selectedItem != null) {
        const result = await updateUserManufacturer(
          selectedItem.staffId,
          editData
        )
        if (result) {
          onSubmitData('success', 'Deleted data success')
          resetFormData()
          handleDrawerClose()
        }
      }
    } catch (error: any) {
      const {state} = extractError(error);
        if (state.code === STATUS_CODE[503]) {
          navigate('/maintenance')
        } else if (state.code === STATUS_CODE[409]){
          showErrorToast(error.response.data.message);
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
              : selectedItem?.staffNameTchi,
          subTitle:
            action == 'add'
              ? t('staffManagement.staff')
              : selectedItem?.staffId,
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
                      disabled={action == 'delete'}
                      placeholder={item.placeholder}
                      onChange={(event) =>
                        handleFieldChange(
                          item.field as keyof FormValues,
                          event.target.value
                        )
                      }
                      error={
                        item.field === 'email'
                          ? !validateEmail(
                              formData[item.field as keyof FormValues]
                            ) &&
                            trySubmited &&
                            formData[
                              item.field as keyof FormValues
                            ].toString() != ''
                          : checkString(
                              formData[item.field as keyof FormValues]
                            )
                      }
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
                          handleFieldChange(
                            item.field as keyof FormValues,
                            value
                          )
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
                            sx: styles.inputProps
                          }}
                          disabled={action != 'add'}
                          error={checkString(selectedLoginId)}
                        />
                      )}
                      noOptionsText={t('common.noOptions')}
                    />
                  ) : (
                    <TextField
                      placeholder={item.placeholder}
                      sx={[styles.textField, { width: 320 }]}
                      InputProps={{
                        readOnly: true,
                        sx: styles.inputProps
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
                    editable={!(action == 'delete')}
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
          <UserConfirmModal
            open={showModalConfirm}
            onClose={() => setShowModalConfirm(false)}
            onSubmit={handleCreateOrEditStaff}
          ></UserConfirmModal>
        </Box>
      </RightOverlayForm>
    </div>
  )
}

export default StaffManufacturerDetails
