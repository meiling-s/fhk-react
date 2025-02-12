import { FunctionComponent, useState, useEffect } from 'react'
import {
  Box,
  Divider,
  Grid,
  Typography,
  InputLabel,
  MenuItem,
  FormControl
} from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import CustomItemList from '../../../components/FormComponents/CustomItemList'
import { styles } from '../../../constants/styles'

import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import { formErr } from '../../../constants/constant'
import {
  returnErrorMsg,
  validateEmail,
  extractError,
  showErrorToast,
  showSuccessToast
} from '../../../utils/utils'
import { il_item } from '../../../components/FormComponents/CustomItemList'

import { localStorgeKeyName, STATUS_CODE } from '../../../constants/constant'
import Switches from '../../../components/FormComponents/CustomSwitch'
import LabelField from '../../../components/FormComponents/CustomField'
import { getUserGroup } from '../../../APICalls/commonManage'
import { CreateUserAccount, UserAccount } from '../../../interfaces/userAccount'
import { ToastContainer, toast } from 'react-toastify'
import {
  postUserAccount,
  updateUserAccount,
  deleteUserAccount
} from '../../../APICalls/userAccount'
import { getStaffList } from '../../../APICalls/staff'
import { useNavigate } from 'react-router-dom'
import UserConfirmModal from '../../../components/FormComponents/UserC'

interface UserAccountDetailsProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: () => void
  rowId?: number
  selectedItem?: UserAccount | null
  userList?: string[]
}

interface userAccountItem {
  loginId: string
  email: string
  contactNo: string
}

interface DropdownOption {
  groupId: number
  roleName: string
  // userAccount: userAccountItem
}

const UserAccountDetails: FunctionComponent<UserAccountDetailsProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  selectedItem,
  userList
}) => {
  const { t } = useTranslation()
  const [staffId, setStaffId] = useState<string>('')
  const [loginId, setLoginId] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [contactNo, setContactNo] = useState<string>('')
  const [userGroup, setUserGroup] = useState<number>(0)
  const [userGroupList, setUserGroupList] = useState<DropdownOption[]>([])
  // const [isApprover , setApprover] = useState<boolean>(false)
  const [userStatus, setUserStatus] = useState<string>('ACTIVE')
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ''
  const logginUser = localStorage.getItem(localStorgeKeyName.username) || ''
  const realm = localStorage.getItem(localStorgeKeyName.realm) || ''
  const prohibitedLoginId: string[] = ['_astdadmin', '_superadmin', '_fhkadmin']
  const [existingEmail, setExistingEmail] = useState<string[]>([])
  const [showModalConfirm, setShowModalConfirm] = useState(false)
  const navigate = useNavigate()

  const statusList = () => {
    const colList: il_item[] = [
      {
        name: t('status.active'),
        id: 'ACTIVE'
      },
      {
        name: t('status.inactive'),
        id: 'INACTIVE'
      },
      {
        name: t('status.suspend'),
        id: 'SUSPEND'
      }
    ]
    return colList
  }

  const mappingData = () => {
    if (selectedItem) {
      const selectedStatus =
        selectedItem.status === 'ACTIVE'
          ? 'ACTIVE'
          : selectedItem.status === 'INACTIVE'
          ? 'INACTIVE'
          : 'SUSPEND'
      setLoginId(selectedItem.loginId)
      setUserGroup(selectedItem.userGroup.groupId)
      setUserStatus(selectedStatus)
    }
  }

  useEffect(() => {
    getUserGroupList()
    getExistingEmail()
    setValidation([])
    if (action !== 'add') {
      mappingData()
    } else {
      setTrySubmited(false)
      resetData()
    }
  }, [drawerOpen])

  useEffect(() => {
    if (userGroupList.length > 0 && action === 'add')
      setUserGroup(userGroupList[0].groupId)
  }, [userGroupList])

  const getUserGroupList = async () => {
    const result = await getUserGroup(0, 1000)
    const groupList: DropdownOption[] = []
    if (result) {
      result.content.map((item: any) => {
        groupList.push({
          groupId: item.groupId,
          roleName: item.roleName
        })
      })
      setUserGroupList(groupList)
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

  const resetData = () => {
    setLoginId('')
    setContactNo('')
    setEmail('')
    setUserGroup(0)
    setUserStatus('ACTIVE')
    setStaffId('')
    setUserGroupList([])
    setValidation([])
  }

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  const hasProhibitedSubstring = (
    loginId: string,
    prohibitedLoginId: string[]
  ) => {
    const lowerCaseLoginId = loginId?.toLowerCase()
    return prohibitedLoginId.includes(lowerCaseLoginId.toLowerCase())
  }

  useEffect(() => {
    const validate = async () => {
      //do validation here
      const tempV: formValidate[] = []
      loginId?.toString() == '' &&
        tempV.push({
          field: t('userAccount.loginName'),
          problem: formErr.empty,
          type: 'error',
          dataTestId: 'astd-user-form-login-name-err-warning-4845'
        })

      if (hasProhibitedSubstring(loginId, prohibitedLoginId)) {
        tempV.push({
          field: t('userAccount.loginName'),
          problem: formErr.loginIdProhibited,
          type: 'error'
        })
      }
      userList?.some((userLoginId) =>
        userLoginId.toLowerCase() == loginId.toLowerCase()
      ) &&
        tempV.push({
          field: t('userAccount.loginName'),
          problem: formErr.alreadyExist,
          type: 'error'
        })
      // userList?.includes(loginId) &&
      //   tempV.push({
      //     field: t('userAccount.loginName'),
      //     problem: formErr.alreadyExist,
      //     type: 'error'
      //   })
      contactNo?.toString() == '' &&
        tempV.push({
          field: t('staffManagement.contactNumber'),
          problem: formErr.empty,
          type: 'error',
          dataTestId: 'astd-user-form-email-address-err-warning-3197'
        })
      email?.toString() == '' &&
        tempV.push({
          field: t('userAccount.emailAddress'),
          problem: formErr.empty,
          type: 'error',
          dataTestId: 'astd-user-form-contact-number-err-warning-5232'
        })

      !validateEmail(email) &&
        email?.toString() != '' &&
        tempV.push({
          field: t('userAccount.emailAddress'),
          problem: formErr.wrongFormat,
          type: 'error'
        })

      setValidation(tempV)
    }

    validate()
  }, [loginId, contactNo, email, userGroup, userStatus])

  const handleCreateOrEditUser = () => {
    setShowModalConfirm(false)
    handleCreateUser()
  }

  const isEmailExisting = (email: string) => {
    const lowercaseEmail = email.toLowerCase()
    const isExisting = existingEmail.some(
      (existing) => existing.toLowerCase() === lowercaseEmail
    )

    return isExisting
  }

  // const handleSubmit = () => {
  //   if (validation.length === 0) {
  //     if (action == 'add') {
  //       if (!isEmailExisting(email)) {
  //         setTrySubmited(true)
  //         setShowModalConfirm(true)
  //       } else {
  //         handleCreateUser()
  //       }
  //     } else {
  //       handleEditUser()
  //     }
  //   }
  // }

  const handleSubmit = () => {
    if (validation.length !== 0 && action === 'add') {
      setTrySubmited(true)
      return
    }

    action === 'add' ? handleAddUser() : handleEditUser()
  }

  const handleAddUser = () => {
    if (isEmailExisting(email)) {
      setShowModalConfirm(true)
    } else {
      setTrySubmited(true)
      handleCreateUser()
    }
  }

  const handleCreateUser = async () => {
    const formData: CreateUserAccount = {
      loginId: loginId,
      realm,
      tenantId: tenantId,
      staffId: staffId,
      groupId: userGroup,
      status: userStatus,
      createdBy: logginUser,
      updatedBy: logginUser,
      firstName: loginId,
      lastName: '',
      sex: 'Male',
      email: email,
      role: ['ADMIN'],
      phoneNumber: contactNo,
      actions: ['UPDATE_PASSWORD']
    }
    if (validation.length === 0) {
      const result = await postUserAccount(formData)

      setValidation([])
      if (result && result?.status === 200) {
        onSubmitData()
        showSuccessToast(t('userAccount.successCreatedUser'))
        resetData()
        handleDrawerClose()
      } else if (result === 409) {
        //SET VALIDATION FOR USER WITH SAME EMAIL
        setTrySubmited(true)
        let tempV = []
        tempV.push({
          field: `${t('userAccount.emailAddress')} ${t(
            'localizedTexts.filterPanelOperatorOr'
          )} ${t('userAccount.loginName')}`,
          problem: formErr.alreadyExist,
          type: 'error'
        })
        setValidation(tempV)
      } else {
        // handle err response 500, 404, undifiend etc
        setTrySubmited(true)
        showErrorToast(t('userAccount.failedCreatedUser'))
      }
    } else {
      setTrySubmited(true)
      //showErrorToast(t('userAccount.failedCreatedUser'))
    }
  }

  const handleEditUser = async () => {
    const formData = {
      userGroupId: userGroup,
      status: userStatus,
      updatedBy: logginUser
    }
    if (selectedItem != null) {
      const result = await updateUserAccount(selectedItem.loginId, formData)
      if (result) {
        onSubmitData()
        showSuccessToast(t('userAccount.successEditUser'))
        resetData()
        handleDrawerClose()
      } else {
        setTrySubmited(true)
        showErrorToast(t('userAccount.failedEditUser'))
      }
    }
  }

  const handleDelete = async () => {
    const formData = {
      status: 'DELETED',
      updatedBy: logginUser
    }
    if (selectedItem != null) {
      const result = await deleteUserAccount(selectedItem.loginId, formData)
      if (result) {
        onSubmitData()
        showSuccessToast(t('userAccount.successDeleteUser'))
        resetData()
        resetData()
        handleDrawerClose()
      } else {
        showErrorToast(t('userAccount.failedDeleteUser'))
      }
    }
  }

  return (
    <div className="add-user-account">
      <ToastContainer></ToastContainer>
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={action}
        headerProps={{
          title:
            action == 'add' ? t('top_menu.add_new') : selectedItem?.loginId,
          subTitle: t('userAccount.user'),
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
            {action == 'add' && (
              <CustomField label={t('userAccount.staffId')}>
                <CustomTextField
                  dataTestId="astd-user-form-staff-id-input-field-6488"
                  id="staffId"
                  value={staffId}
                  placeholder={t('userAccount.pleaseEnterNumber')}
                  onChange={(event) => setStaffId(event.target.value)}
                />
              </CustomField>
            )}
            <CustomField label={t('userAccount.loginName')} mandatory>
              <CustomTextField
                id="LoginId"
                dataTestId="astd-user-form-login-name-input-field-1164"
                value={loginId}
                disabled={action === 'delete' || action === 'edit'}
                placeholder={t('userAccount.pleaseEnterName')}
                onChange={(event) => setLoginId(event.target.value.trim())}
                error={
                  checkString(loginId) ||
                  (userList?.includes(loginId) && trySubmited)
                }
              />
            </CustomField>
            {action == 'add' && (
              <Grid item>
                <Grid item sx={{ marginBottom: '16px' }}>
                  <CustomField label={t('userAccount.emailAddress')} mandatory>
                    <CustomTextField
                      id="email"
                      dataTestId="astd-user-form-email-address-input-field-7349"
                      value={email}
                      placeholder={t('userAccount.pleaseEnterEmailAddress')}
                      onChange={(event) => setEmail(event.target.value)}
                      error={!validateEmail(email) && trySubmited}
                    />
                  </CustomField>
                </Grid>

                <CustomField
                  label={t('staffManagement.contactNumber')}
                  mandatory
                >
                  <CustomTextField
                    id="contactNo"
                    dataTestId="astd-user-form-user-group-select-button-1083"
                    value={contactNo}
                    placeholder={t('staffManagement.enterContactNo')}
                    onChange={(event) => setContactNo(event.target.value)}
                    error={checkString(contactNo)}
                  />
                </CustomField>
              </Grid>
            )}
            <Grid item>
              <Typography sx={{ ...styles.header3, marginBottom: 2 }}>
                {t('userAccount.userGroup')}
              </Typography>
              <FormControl
                sx={{
                  width: '100%'
                }}
              >
                {/* <InputLabel id="userGroup">
                  {t('userAccount.userGroup')}
                </InputLabel> */}
                <Select
                  labelId="userGroup"
                  id="userGroup"
                  data-testid="astd-user-form-status-select-button-6538"
                  value={userGroup.toString()}
                  sx={{
                    borderRadius: '12px'
                  }}
                  disabled={action === 'delete'}
                  // label={t('userAccount.userGroup')}
                  onChange={(event: SelectChangeEvent<string>) => {
                    const selectedValue = userGroupList.find(
                      (item) => item.groupId === parseInt(event.target.value)
                    )
                    if (selectedValue) {
                      setUserGroup(selectedValue.groupId)
                    }
                  }}
                >
                  {!userGroupList ? (
                    <MenuItem disabled value="">
                      <em>{t('common.noOptions')}</em>
                    </MenuItem>
                  ) : (
                    userGroupList.map((item, index) => (
                      <MenuItem key={index} value={item.groupId}>
                        {item.roleName}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item>
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center">
              <LabelField
                label={t('userAccount.isItAReviewer')}
                mandatory={true}
              />
              <Switches
                onText={t('add_warehouse_page.yes')}
                offText={t('add_warehouse_page.no')}
                disabled={action === 'delete'}
                defaultValue={isApprover}
                setState={(newValue) => {
                  setApprover(newValue)
                }}
              />
            </div>
            </Grid>  */}
            <CustomField label={t('col.status')} mandatory={true}>
              <CustomItemList
                items={statusList()}
                singleSelect={(selectedItem) => {
                  setUserStatus(selectedItem)
                }}
                editable={action != 'delete'}
                defaultSelected={userStatus}
                needPrimaryColor={false}
              />
            </CustomField>
            <Grid item sx={{ width: '100%' }}>
              {trySubmited &&
                validation.map((val, index) => (
                  <FormErrorMsg
                    key={index}
                    field={t(val.field)}
                    errorMsg={returnErrorMsg(val.problem, t)}
                    type={val.type}
                    dataTestId={val.dataTestId}
                  />
                ))}
            </Grid>
          </Grid>
          <UserConfirmModal
            open={showModalConfirm}
            onClose={() => setShowModalConfirm(false)}
            onSubmit={handleCreateOrEditUser}
          ></UserConfirmModal>
        </Box>
      </RightOverlayForm>
    </div>
  )
}

const localstyles = {
  textField: {
    borderRadius: '10px',
    fontWeight: '500',
    '& .MuiOutlinedInput-input': {
      padding: '10px'
    }
  },
  imagesContainer: {
    width: '100%',
    height: 'fit-content'
  },
  image: {
    aspectRatio: '1/1',
    width: '100px',
    borderRadius: 2
  },
  cardImg: {
    borderRadius: 2,
    backgroundColor: '#E3E3E3',
    width: '100%',
    height: 150,
    boxShadow: 'none'
  },
  btnBase: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 10
  },
  imgError: {
    border: '1px solid red'
  }
}

export default UserAccountDetails
