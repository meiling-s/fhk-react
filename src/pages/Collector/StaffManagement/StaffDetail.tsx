import { FunctionComponent, useState, useEffect } from 'react'
import {
  Box,
  Divider,
  Grid,
  Autocomplete,
  TextField,
  Typography
} from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import CustomItemList from '../../../components/FormComponents/CustomItemList'
import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { StaffTitle, formValidate } from '../../../interfaces/common'
import {
  editStaff,
  createStaff,
  getLoginIdList,
  getStaffTitle,
  getStaffList
} from '../../../APICalls/staff'

import { styles } from '../../../constants/styles'

import { Languages, STATUS_CODE, formErr } from '../../../constants/constant'
import {
  extractError,
  returnErrorMsg,
  showErrorToast,
  showSuccessToast,
  validateEmail
} from '../../../utils/utils'
import UserConfirmModal from '../../../components/FormComponents/UserConfirmModal'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import { Staff, CreateStaff, EditStaff } from '../../../interfaces/staff'
import CustomItemListBoolean from '../../../components/FormComponents/CustomItemListBoolean'
import { localStorgeKeyName, Realm } from '../../../constants/constant'
import i18n from '../../../setups/i18n'
import { useNavigate } from 'react-router-dom'

interface CreateVehicleProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: () => void
  selectedItem?: Staff | null
  staffList: Staff[]
}

interface FormValues {
  [key: string]: string
}
type FieldName =
  | 'loginId'
  | 'staffNameTchi'
  | 'staffNameSchi'
  | 'staffNameEng'
  | 'titleId'
  | 'contactNo'
  | 'email'

type ErrorsStaffData = Record<FieldName, { status: boolean; message: string }>

const initialErrors = {
  loginId: { status: false, message: '' },
  staffNameTchi: { status: false, message: '' },
  staffNameSchi: { status: false, message: '' },
  staffNameEng: { status: false, message: '' },
  titleId: { status: false, message: '' },
  contactNo: { status: false, message: '' },
  email: { status: false, message: '' }
}

const StaffDetail: FunctionComponent<CreateVehicleProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  selectedItem,
  staffList
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
  const realm = localStorage.getItem(localStorgeKeyName.realm)
  const [contractType, setContractType] = useState<number>(0)
  const [errors, setErrors] = useState<ErrorsStaffData>(initialErrors)
  const [staffListExisting, setStaffListExisting] = useState<Staff[]>([])
  const [existingEmail, setExistingEmail] = useState<string[]>([])
  const [showModalConfirm, setShowModalConfirm] = useState(false)
  const navigate = useNavigate()

  let staffField = [
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
      label: t('staffManagement.employeeEnglishName'),
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

  if (realm === Realm.collector) {
    staffField = [
      ...staffField,
      {
        label: t('staffManagement.fullTimeFlg'),
        placeholder: t('staffManagement.fullTimeFlg'),
        field: 'fullTimeFlg',
        type: 'boolean'
      }
    ]
  }
  const initStaffList = async () => {
    try {
      const result = await getStaffList(1 - 1, 1000, null)

      if (result) {
        const data = result.data.content
        setStaffListExisting(data)
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  useEffect(() => {
    initLoginIdList()
    initStaffTitle()
    initStaffList()
    getExistingEmail()
  }, [drawerOpen])

  const initLoginIdList = async () => {
    const result = await getLoginIdList()
    if (result) {
      const data = result.data
      var loginIdMapping: il_item[] = []

      data.forEach((item: any) => {
        const isUserExist = staffListExisting.find(
          (user) => user.loginId === item.loginId
        )
        if (!isUserExist) {
          loginIdMapping.push({
            id: item.loginId,
            name: item.loginId
          })
        }
      })
      setLoginIdList(loginIdMapping)
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

  const initStaffTitle = async () => {
    const result = await getStaffTitle()
    if (result) {
      const data = result.data.content

      let staffTitle: il_item[] = []
      data.forEach((item: StaffTitle) => {
        let title: il_item = {
          name: '',
          id: item.titleId
        }
        switch (i18n.language) {
          case Languages.ENUS:
            title.name = item.titleNameEng
            break
          case Languages.ZHCH:
            title.name = item.titleNameSchi
            break
          default:
            title.name = item.titleNameTchi
            break
        }
        staffTitle.push(title)
      })
      setStaffTitleList(staffTitle)
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
      if (realm === Realm.collector && selectedItem?.fullTimeFlg) {
        setContractType(0)
      } else if (realm === Realm.collector && !selectedItem?.fullTimeFlg) {
        setContractType(1)
      }
    }
  }

  const isEmailExisting = (email: string) => {
    const lowercaseEmail = email.toLowerCase()
    const isExisting = existingEmail.some(
      (existing) => existing.toLowerCase() === lowercaseEmail
    )

    return isExisting
  }

  const resetFormData = () => {
    setFormData(initialFormValues)
    setValidation([])
    setTrySubmited(false)
    setSelectedLoginId('')
  }

  useEffect(() => {
    setValidation([])
    if (action !== 'add') {
      mappingData()
    } else {
      setTrySubmited(false)
      resetFormData()
    }
  }, [drawerOpen])

  const checkString = (s: string) => {
    if (!trySubmited) {
      return false
    }
    return s == ''
  }

  const validateStaff = (): boolean => {
    let isValid: boolean = true

    if (!formData.loginId) {
      isValid = false
      setErrors((prev) => {
        return {
          ...prev,
          loginId: {
            status: true,
            message: t('purchase_order.create.required_field')
          }
        }
      })
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          loginId: {
            status: false,
            message: ''
          }
        }
      })
    }
    if (!formData.staffNameEng) {
      isValid = false
      setErrors((prev) => {
        return {
          ...prev,
          staffNameEng: {
            status: true,
            message: t('purchase_order.create.required_field')
          }
        }
      })
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          staffNameEng: {
            status: false,
            message: ''
          }
        }
      })
    }
    if (!formData.staffNameSchi) {
      isValid = false
      setErrors((prev) => {
        return {
          ...prev,
          staffNameSchi: {
            status: true,
            message: t('purchase_order.create.required_field')
          }
        }
      })
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          staffNameSchi: {
            status: false,
            message: ''
          }
        }
      })
    }
    if (!formData.staffNameTchi) {
      isValid = false
      setErrors((prev) => {
        return {
          ...prev,
          staffNameTchi: {
            status: true,
            message: t('purchase_order.create.required_field')
          }
        }
      })
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          staffNameTchi: {
            status: false,
            message: ''
          }
        }
      })
    }
    if (!formData.titleId) {
      isValid = false
      setErrors((prev) => {
        return {
          ...prev,
          titleId: {
            status: true,
            message: t('purchase_order.create.required_field')
          }
        }
      })
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          titleId: {
            status: false,
            message: ''
          }
        }
      })
    }
    if (!formData.contactNo) {
      isValid = false
      setErrors((prev) => {
        return {
          ...prev,
          contactNo: {
            status: true,
            message: t('purchase_order.create.required_field')
          }
        }
      })
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          contactNo: {
            status: false,
            message: ''
          }
        }
      })
    }
    if (!formData.email) {
      isValid = false
      setErrors((prev) => {
        return {
          ...prev,
          email: {
            status: true,
            message: t('purchase_order.create.required_field')
          }
        }
      })
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)
    ) {
      isValid = false
      setErrors((prev) => {
        return {
          ...prev,
          email: {
            status: true,
            message: 'invalid email'
          }
        }
      })
    } else if (formData.email.indexOf('.') === 0) {
      isValid = false
      setErrors((prev) => {
        return {
          ...prev,
          email: {
            status: true,
            message: 'invalid email'
          }
        }
      })
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          email: {
            status: false,
            message: ''
          }
        }
      })
    }
    return isValid
  }

  const validate = () => {
    const tempV: formValidate[] = []
    const fieldMapping: FormValues = {
      loginId: t('staffManagement.loginName'),
      staffNameTchi: t('staffManagement.employeeChineseName'),
      staffNameSchi: t('staffManagement.employeeChineseCn'),
      staffNameEng: t('staffManagement.employeeEnglishName'),
      titleId: t('staffManagement.position'),
      contactNo: t('staffManagement.contactNumber'),
      email: t('staffManagement.email')
    }

    if (selectedLoginId && action === 'add') {
      const filteredData = staffList.filter(
        (value) => value.loginId === selectedLoginId
      )

      if (filteredData.length > 0) {
        tempV.push({
          field: fieldMapping['loginId'],
          problem: formErr.hasBeenUsed,
          type: 'error'
        })
        showErrorToast(
          `${t('staffManagement.loginName')} ${t('form.error.hasBeenUsed')}`
        )
      }
    }

    Object.keys(formData).forEach((fieldName) => {
      const fieldValue = formData[fieldName as keyof FormValues]?.trim()

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
  }, [formData])

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    })
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
    updatedBy: loginName
  })

  const handleCreateOrEditStaff = () => {
    const staffData = createStaffData()
    setShowModalConfirm(false)
    handleCreateStaff(staffData)
  }

  const handleSubmit = () => {
    if (validation.length === 0) {
      const staffData = createStaffData()
      if (realm === Realm.collector) {
        staffData.fullTimeFlg = contractType === 0 ? true : false
      }

      // if (action == 'add') {
      //   handleCreateStaff(staffData)
      // } else {
      //   handleEditStaff()
      // }
      if (validation.length !== 0 && action === 'add') {
        setTrySubmited(true)
        return
      }

      action === 'add' ? handleAddStaff(staffData) : handleEditStaff()
    } else {
      setTrySubmited(true)
    }
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
    if (validation.length === 0) {
      const result = await createStaff(staffData)

      if (result) {
        onSubmitData()
        resetFormData()
        handleDrawerClose()
        showSuccessToast(t('notify.successCreated'))
      } else {
        setTrySubmited(true)
        onSubmitData()
        showErrorToast(t('notify.errorCreated'))
      }
    } else {
      setTrySubmited(true)
    }
  }

  const handleEditStaff = async () => {
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

    if (realm === Realm.collector) {
      editData.fullTimeFlg = contractType === 0 ? true : false
    }

    if (validation.length == 0) {
      if (selectedItem != null) {
        const result = await editStaff(editData, selectedItem.staffId)
        if (result) {
          onSubmitData()
          resetFormData()
          handleDrawerClose()
          showSuccessToast(t('notify.SuccessEdited'))
        }
      }
    } else {
      setTrySubmited(true)
      showErrorToast(t('notify.errorEdited'))
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
        onSubmitData()
        resetFormData()
        handleDrawerClose()
        showSuccessToast(t('notify.successDeleted'))
      }
    }
  }

  const contractTypeList = [
    {
      id: 'fulltime',
      name: t('staffManagement.fullTimeFlg')
    },
    {
      id: 'partime',
      name: t('staffManagement.partTime')
    }
  ]

  const onHandleDrawer = () => {
    handleDrawerClose()
    setErrors(initialErrors)
  }

  return (
    <div className="add-vehicle">
      <RightOverlayForm
        open={drawerOpen}
        onClose={onHandleDrawer}
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
                      disabled={action === 'delete'}
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
                            !trySubmited &&
                            formData[
                              item.field as keyof FormValues
                            ].toString() != ''
                          : checkString(
                              formData[item.field as keyof FormValues]
                            )
                      }
                    />
                  </CustomField>
                  {/* <Typography style={{color: 'red', fontWeight: '500'}}>
                      {errors[item.field as keyof ErrorsStaffData].status ? errors[item.field as keyof ErrorsStaffData].message : ''}
                    </Typography> */}
                </Grid>
              ) : item.type == 'autocomplete' ? (
                <Grid item>
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
                          } else {
                            handleFieldChange(
                              item.field as keyof FormValues,
                              ''
                            )
                            setSelectedLoginId('')
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
                  {/* <Typography style={{ color: 'red', fontWeight: '500' }}>
                    {errors[item.field as keyof ErrorsStaffData].status
                      ? errors[item.field as keyof ErrorsStaffData].message
                      : ''}
                  </Typography> */}
                </Grid>
              ) : item.type === 'option' ? (
                <Grid item>
                  <CustomField label={t('staffManagement.position')} mandatory>
                    <CustomItemList
                      items={staffTitleList || []}
                      singleSelect={(values) =>
                        handleFieldChange(item.field, values)
                      }
                      value={selectedItem ? selectedItem?.titleId : ''}
                      defaultSelected={
                        selectedItem ? selectedItem?.titleId : ''
                      }
                      needPrimaryColor={true}
                      editable={action === 'delete' ? false : true}
                    />
                  </CustomField>
                  {/* <Typography style={{ color: 'red', fontWeight: '500' }}>
                    {errors[item.field as keyof ErrorsStaffData].status
                      ? errors[item.field as keyof ErrorsStaffData].message
                      : ''}
                  </Typography> */}
                </Grid>
              ) : (
                <CustomField label={t('staffManagement.contractType')}>
                  <CustomItemListBoolean
                    items={contractTypeList}
                    setServiceFlg={setContractType}
                    value={contractType}
                    needPrimaryColor={true}
                  ></CustomItemListBoolean>
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

export default StaffDetail
