import { FunctionComponent, useState, useEffect } from 'react'
import {
  Box,
  Divider,
  Grid,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
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
import { returnErrorMsg } from '../../../utils/utils'
import { il_item } from '../../../components/FormComponents/CustomItemList'

import { localStorgeKeyName } from "../../../constants/constant";
import Switches from '../../../components/FormComponents/CustomSwitch'
import LabelField from '../../../components/FormComponents/CustomField'
import { getUserGroup } from '../../../APICalls/commonManage'
import { CreateUserAccount, UserAccount } from '../../../interfaces/userAccount'
import { ToastContainer, toast } from 'react-toastify'
import { postUserAccount, updateUserAccount, deleteUserAccount } from '../../../APICalls/userAccount'

interface UserAccountDetailsProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: () => void
  rowId?: number,
  selectedItem?: UserAccount | null
}

interface userAccountItem  {
    loginId: string;
    email: string;
    contactNo: string;
}

interface DropdownOption {
    groupId: number;
    roleName: string;
    // userAccount: userAccountItem
  }

const UserAccountDetails: FunctionComponent<UserAccountDetailsProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  selectedItem
}) => {
  const { t } = useTranslation()
  const [contactNo, setContactNo] = useState<string>("")
  const [loginId, setLoginId] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [userGroup, setUserGroup] = useState<number>(0);
  const [userGroupList, setUserGroupList] = useState<DropdownOption[]>([])
  const [isApprover , setApprover] = useState<boolean>(false)
  const [userStatus, setUserStatus] = useState<string>('ACTIVE')
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ""
  const logginUser =  localStorage.getItem(localStorgeKeyName.username) || ""

  const statusList = () => {
    const colList: il_item[] = [
      {
        name: t('userAccount.active'),
        id: "ACTIVE"
      },
      {
        name: t('userAccount.inactive'),
        id: "INACTIVE"
      },
      {
        name:t('userAccount.suspend'),
        id: "SUSPEND"
      },
      {
        name: t('userAccount.deleted'),
        id: "DELETED"
      },
    ]
    return colList
  };

  const mappingData = () => {
    console.log("selectedItem", selectedItem)
   if(selectedItem) {
    const selectedStatus = selectedItem.status == 'ACTIVE' ? "ACTIVE" : "INACTIVE" ?  'INACTIVE' : 'TERMINATED'
    setLoginId(selectedItem.loginId)
    setUserGroup(selectedItem.userGroup.groupId)
    setUserStatus(selectedStatus)
   }
  }


  useEffect(() => {
    getUserGroupList()
    setValidation([])
    if(action !== 'add'){
      mappingData()
    } else {
      setTrySubmited(false)
      resetData()
    }
  }, [drawerOpen])

  const getUserGroupList = async () => {
    const result = await getUserGroup()
    const groupList: DropdownOption[]= []
    if(result) {
        result.map((item: any) =>{
            
            groupList.push({
                groupId: item.groupId,
                roleName: item.roleName
            })
        })
        setUserGroupList(groupList)
        if(groupList.length> 0) setUserGroup(groupList[0].groupId)
    }
  }


  const resetData = () => {
    setLoginId("")
    setContactNo("")
    setEmail("")
    setUserGroup(0)
    setUserStatus("ACTIVE")
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

  useEffect(() => {
    const validate = async () => {
      //do validation here
      const tempV: formValidate[] = []
      loginId?.toString() == ''  &&
        tempV.push({
          field: t('userAccount.loginName'),
          problem: formErr.empty,
          type: 'error'
        })
        contactNo?.toString() == ''  &&
        tempV.push({
            field: t('userAccount.addByNumber'),
            problem: formErr.empty,
            type: 'error'
        })
        email?.toString() == ''  &&
        tempV.push({
            field: t('userAccount.emailAddress'),
            problem: formErr.empty,
            type: 'error'
        })
      setValidation(tempV)
    }

    validate()
  }, [loginId, contactNo, email, userGroup, userStatus])

  const showErrorToast = (msg: string) => {
    toast.error(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    })
  }

  const showSuccessToast = (msg: string) => {
    toast.info(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    })
  }

  const handleSubmit = () => {
    if (action == 'add') {
      handleCreateVehicle()
    } else {
      handleEditUser()
    }
  }

  const handleCreateVehicle = async () => {
    const formData: CreateUserAccount = {
        loginId: loginId,
        realm: "collector",
        tenantId: tenantId,
        staffId: "",
        groupId: userGroup,
        status: 'ACTIVE',
        createdBy: logginUser,
        updatedBy: logginUser,
        firstName: loginId,
        lastName: "",
        sex: "Male",
        email: email,
        role: [
           'ADMIN'
        ],
        phoneNumber: contactNo,
        actions: [
          "UPDATE_PASSWORD"
        ]
    }
    if (validation.length === 0) {
      const result = await postUserAccount(formData)
      if(result) {
        onSubmitData()
        showSuccessToast(t('userAccount.successCreatedUser'))
        resetData()
        handleDrawerClose()
      }else{
        showErrorToast(t('userAccount.failedCreatedUser'))
      }
    } else {
      setTrySubmited(true)
      showErrorToast(t('userAccount.failedCreatedUser'))
    }
  }

  const handleEditUser = async () => {
    const formData = {
        userGroupId: userGroup,
        status: userStatus,
        updatedBy: logginUser
    }
      if(selectedItem != null){
        const result = await updateUserAccount(selectedItem.loginId, formData)
        if(result) {
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
        status: "INACTIVE",
        updatedBy: logginUser
    }
    if(selectedItem != null){
      const result = await deleteUserAccount(selectedItem.loginId, formData)
      if(result) {
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
          title: selectedItem?.loginId ? selectedItem?.loginId : t('top_menu.add_new'),
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
            {
                action == 'add' && (
                    <CustomField label={t('userAccount.addByNumber')} mandatory>
                    <CustomTextField
                      id="contactNo"
                      value={contactNo}
                      placeholder={t('userAccount.pleaseEnterNumber')}
                      onChange={(event) => setContactNo(event.target.value)}
                      error={checkString(contactNo)}
                    />
                  </CustomField>
                )
            }
            <CustomField label={t('userAccount.loginName')} mandatory>
              <CustomTextField
                id="LoginId"
                value={loginId}
                disabled={action === 'delete' || action === 'edit'}
                placeholder={t('userAccount.pleaseEnterName')}
                onChange={(event) => setLoginId(event.target.value)}
                error={checkString(loginId)}
              />
            </CustomField>
            {
                action == 'add' && (
                    <CustomField label={t('userAccount.emailAddress')} mandatory>
                    <CustomTextField
                      id="email"
                      value={email}
                      placeholder={t('userAccount.pleaseEnterEmailAddress')}
                      onChange={(event) => setEmail(event.target.value)}
                      error={checkString(contactNo)}
                    />
                  </CustomField>
                )
            }
            <Grid item>
              <Typography sx={{ ...styles.header3, marginBottom: 2 }}>
                {t('userAccount.userGroup')}
              </Typography>
              <FormControl
                sx={{
                  width: '100%'
                }}
              >
                <InputLabel id="userGroup">
                  {t('userAccount.userGroup')}
                </InputLabel>
                <Select
                  labelId="userGroup"
                  id="userGroup"
                  value={userGroup.toString()}
                  sx={{
                    borderRadius: '12px'
                  }}
                  disabled={action === 'delete'}
                  label={t('userAccount.userGroup')}
                  onChange={(event: SelectChangeEvent<string>) => {
                    const selectedValue = userGroupList.find(item => item.groupId === parseInt(event.target.value));
                    if (selectedValue) {
                      setUserGroup(selectedValue.groupId);
                    }
                  }}
                  
                >
                  {userGroupList.map((item, index) => (
                    <MenuItem key={index} value={item.groupId}>{item.roleName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
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
            </Grid> 
            <CustomField label={t('userAccount.status')} mandatory={true}>
              <CustomItemList
                items={statusList()}
                singleSelect={(selectedItem) => {
                  
                  setUserStatus(selectedItem)
                }}
                editable={action != 'delete'}
                defaultSelected={userStatus}
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
                    />
                  ))}
              </Grid>
          </Grid>
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
