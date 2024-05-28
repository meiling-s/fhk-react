import { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { Box, Divider, Grid } from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'

import { useTranslation } from 'react-i18next'
import { formValidate } from '../../../interfaces/common'
import { STATUS_CODE, formErr } from '../../../constants/constant'
import { extractError, returnApiToken, returnErrorMsg } from '../../../utils/utils'
import { localStorgeKeyName } from '../../../constants/constant'

import {
  CreateUserGroupProps,
  DeleteUserGroupProps,
  EditUserGroupProps,
  Functions,
  UserGroup
} from '../../../interfaces/userGroup'
import FunctionList from './FunctionList'
import {
  createUserGroup,
  deleteUserGroup,
  editUserGroup
} from '../../../APICalls/Collector/userGroup'
import { useNavigate } from 'react-router-dom'

interface Props {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  rowId?: number
  selectedItem?: UserGroup | null
  functionList: Functions[]
  groupNameList: string[]
}

const CreateUserGroup: FunctionComponent<Props> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  rowId,
  selectedItem,
  functionList,
  groupNameList = []
}) => {
  const { t } = useTranslation()
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const [roleName, setRoleName] = useState('')
  // const [realm, setRealm] = useState('')
  const [description, setDescription] = useState('')
  const [groupList, setGroupList] = useState<string[]>([])
  const [functions, setFunctions] = useState<number[]>([])
  var realm = localStorage.getItem(localStorgeKeyName.realm) || 'collector'
  const navigate = useNavigate();

  const mappingData = () => {
    if (selectedItem != null) {
      // setRealm('collector')
      setRoleName(selectedItem.roleName)
      let newFunctions: number[] = []
      selectedItem.functions.forEach((item) => {
        newFunctions.push(item.functionId)
      })
      setFunctions(newFunctions)
      setDescription(selectedItem.description)
    }
  }

  useEffect(() => {
    setValidation([])

    if (action !== 'add') {
      mappingData()
    } else {
      setTrySubmited(false)
      resetData()
    }

    //set groupRoleNameList
    if (selectedItem != null) {
      const temp = groupNameList.filter((item) => item != selectedItem.roleName)
      setGroupList(temp)
    } else {
      setGroupList(groupNameList)
    }
  }, [drawerOpen])

  const resetData = () => {
    //setRealm('')
    setRoleName('')
    setFunctions([])
    setDescription('')
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
      roleName?.toString() == '' &&
        tempV.push({
          field: 'roleName',
          problem: formErr.empty,
          type: 'error'
        })
      groupList.some((item) => item.toLowerCase() == roleName.toLowerCase()) &&
        tempV.push({
          field: t('userGroup.groupName'),
          problem: formErr.alreadyExist,
          type: 'error'
        })
      description?.toString() == '' &&
        tempV.push({
          field: 'description',
          problem: formErr.empty,
          type: 'error'
        })
      functions.length == 0 &&
        tempV.push({
          field: t('userGroup.availableFeatures'),
          problem: formErr.empty,
          type: 'error'
        })
      // console.log("tempV", tempV)
      setValidation(tempV)
    }

    validate()
  }, [roleName, description, functions])

  const handleSubmit = () => {
    const token = returnApiToken()

    if (action == 'add') {
      const formData: CreateUserGroupProps = {
        realm: realm,
        tenantId: token.tenantId,
        roleName: roleName,
        description: description,
        functions: functions,
        createdBy: token.loginId,
        status: 'ACTIVE'
      }
      handleCreateUserGroup(formData)
    } else {
      const formData: EditUserGroupProps = {
        functions: functions,
        roleName: roleName,
        description: description,
        updatedBy: token.loginId,
        status: 'ACTIVE'
      }
      handleEditUserGroup(formData)
    }
  }

  const handleCreateUserGroup = async (formData: CreateUserGroupProps) => {
    try {
      console.log('handleCreateUserGroup', functions)
      if (validation.length === 0) {
        const result = await createUserGroup(formData)
        if (result) {
          onSubmitData('success', t('notify.successCreated'))
          resetData()
          handleDrawerClose()
        } else {
          onSubmitData('error', t('notify.errorCreated'))
        }
      } else {
        setTrySubmited(true)
      }
    } catch (error:any) {
     const { state, realm } =  extractError(error);
     if(state.code === STATUS_CODE[503] || !error?.response){
        navigate('/maintenance')
     }
    }
  }

  const handleEditUserGroup = async (formData: EditUserGroupProps) => {
   try {
    if (validation.length === 0) {
      if (selectedItem != null) {
        const result = await editUserGroup(formData, selectedItem.groupId!)
        if (result) {
          onSubmitData('success', t('notify.SuccessEdited'))
          resetData()
          handleDrawerClose()
        } else {
          setTrySubmited(true)
          onSubmitData('error', t('notify.errorEdited'))
        }
      }
    } else {
      setTrySubmited(true)
    }
   } catch (error:any) {
    const { state, realm} =  extractError(error);
    if(state.code === STATUS_CODE[503] || !error?.response){
      navigate('/maintenance')
    }
   }
  }

  const handleDelete = async () => {
    const token = returnApiToken()
    const status = 'DELETED'
    if (selectedItem != null) {
      const formData: DeleteUserGroupProps = {
        updatedBy: token.loginId,
        status: status
      }
      const result = await deleteUserGroup(formData, selectedItem.groupId!)
      if (result) {
        if (result == 500) {
          setTrySubmited(true)
          onSubmitData('error', t('notify.userAccountUsed'))
        } else {
          onSubmitData('success', t('notify.successDeleted'))
          resetData()
          handleDrawerClose()
        }
      } else {
        setTrySubmited(true)
        onSubmitData('error', t('notify.errorDeleted'))
      }
    }
  }

  return (
    <div className="add-user-group">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={action}
        headerProps={{
          title:
            action == 'add'
              ? t('top_menu.add_new')
              : action == 'edit'
              ? t('userGroup.change')
              : t('userGroup.delete'),
          subTitle: t('userGroup.title'),
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
            <CustomField label={t('userGroup.groupName')}>
              <CustomTextField
                id="roleName"
                value={roleName}
                disabled={action === 'delete'}
                placeholder={t('userGroup.pleaseEnterName')}
                onChange={(event) => setRoleName(event.target.value)}
                error={checkString(roleName)}
              />
            </CustomField>
            <CustomField label={t('userGroup.description')}>
              <CustomTextField
                id="description"
                value={description}
                disabled={action === 'delete'}
                placeholder={t('userGroup.pleaseEnterText')}
                onChange={(event) => setDescription(event.target.value)}
                error={checkString(description)}
              />
            </CustomField>
            <CustomField label={t('userGroup.availableFeatures')}>
              {functionList.map((item: Functions, index) => (
                <FunctionList
                  key={index}
                  keyId={index}
                  item={item}
                  functions={functions}
                  disabled={action === 'delete'}
                  setFunctions={setFunctions}
                />
              ))}
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

export default CreateUserGroup
