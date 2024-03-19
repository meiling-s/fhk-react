import { FunctionComponent, useState, useEffect } from 'react'
import {
  Box,
  Divider,
  Grid,
  Typography,
  InputLabel,
  MenuItem,
  Card,
  FormControl,
  ButtonBase,
  ImageList,
  ImageListItem,
  Stack,
  ToggleButton
} from '@mui/material'
import { CAMERA_OUTLINE_ICON } from '../../../themes/icons'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { EVENT_RECORDING } from '../../../constants/configs'
import { styles } from '../../../constants/styles'

import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import { formErr } from '../../../constants/constant'
import { returnErrorMsg, ImageToBase64, returnApiToken } from '../../../utils/utils'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import i18n from '../../../setups/i18n'
import { CreateUserGroupProps, DeleteUserGroupProps, EditUserGroupProps, Functions, UserGroup } from '../../../interfaces/userGroup'
import FunctionList from './FunctionList'
import { createUserGroup, deleteUserGroup, editUserGroup } from '../../../APICalls/Collector/userGroup'

interface Props {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  rowId?: number,
  selectedItem?: UserGroup | null
  functionList: Functions[]
}

const CreateUserGroup: FunctionComponent<Props> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  rowId,
  selectedItem,
  functionList
}) => {
  const { t } = useTranslation()
  const serviceList: il_item[] = [
    {
      id: 'basic',
      name: 'basic'
    },
    {
      id: 'additional',
      name: 'additional'
    }
  ]
  const [serviceType, setServiceType] = useState<il_item[]>(serviceList)
  const [selectedService, setSelectedService] = useState<il_item>( {
    id: 'basic',
    name: t('vehicle.basic')
  },)
  const [pictures, setPictures] = useState<ImageListType>([])
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const [roleName, setRoleName] = useState('')
  const [realm, setRealm] = useState('')
  const [description, setDescription] = useState('')
  const [functions, setFunctions] = useState<number[]>([])

  const mappingData = () => {
    if(selectedItem != null) {
      setRealm('collector')
      setRoleName(selectedItem.roleName)
      selectedItem.functions.forEach(item => {
        setFunctions(prev => ([...prev, item.functionId]))
      })
      setDescription(selectedItem.description)
    }
  }

  useEffect(() => {
    setValidation([])
    if(action !== 'add'){
      mappingData()
    } else {
      setTrySubmited(false)
      resetData()
    }
  }, [drawerOpen])

  const resetData = () => {
    setRealm('')
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
      realm?.toString() == '' &&
        tempV.push({
          field: 'realm',
          problem: formErr.empty,
          type: 'error'
        })
      roleName?.toString() == '' &&
        tempV.push({
          field: 'roleName',
          problem: formErr.empty,
          type: 'error'
        })
      description?.toString() == '' &&
        tempV.push({
          field: 'description',
          problem: formErr.empty,
          type: 'error'
        })
      console.log("tempV", tempV)
      setValidation(tempV)
    }

    validate()
  }, [realm, roleName])

  const handleSubmit = () => {
    const token = returnApiToken()

    if (action == 'add') {
      const formData: CreateUserGroupProps = {
        realm: realm,
        tenantId: token.tenantId,
        roleName: roleName,
        description: description,
        functions: functions,
        createdBy:  token.loginId,
        status: "ACTIVE",
      }
      handleCreateUserGroup(formData)
    } else {
      const formData: EditUserGroupProps = {
        functions: functions,
        roleName: roleName,
        description: description,
        updatedBy:  token.loginId,
        status: "ACTIVE",
      }
      handleEditUserGroup(formData)
    }
  }

  const handleCreateUserGroup = async (formData: CreateUserGroupProps) => {
    if (validation.length === 0) {
      const result = await createUserGroup(formData)
      if(result) {
        onSubmitData("success", "Success created data")
        resetData()
        handleDrawerClose()
      }else{
        onSubmitData("error", "Failed created data")
      }
    } else {
      setTrySubmited(true)
    }
  }

  const handleEditUserGroup = async (formData: EditUserGroupProps) => {
    if (validation.length === 0) {
      
      if(selectedItem != null){
        const result = await editUserGroup(formData, selectedItem.groupId!)
        if(result) {
          onSubmitData("success", "Edit data success")
          resetData()
          handleDrawerClose()
        }
      } 
    } else {
      setTrySubmited(true)
    }
  }

  const handleDelete = async () => {
    const token = returnApiToken()
    const status = 'DELETED'
    if(selectedItem != null){
      const formData: DeleteUserGroupProps = {
        updatedBy:  token.loginId,
        status: status,
      }
      const result = await deleteUserGroup(formData, selectedItem.groupId!)
      if(result) {
        onSubmitData("success", "Deleted data success")
        resetData()
        handleDrawerClose()
      } else {
        onSubmitData("error", "Deleted data success")
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
            <CustomField label={t('userGroup.introduction')}>
              <CustomTextField
                id="realm"
                value={realm}
                disabled={action === 'delete' || action === 'edit'}
                placeholder={t('userGroup.pleaseEnterText')}
                onChange={(event) => setRealm(event.target.value)}
                error={checkString(realm)}
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
              {functionList.map((item: Functions, key) => (
                <FunctionList
                  key={key}
                  item={item}
                  functions={functions}
                  setFunctions={setFunctions}
                />
              ))}
            </CustomField>
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

export default CreateUserGroup
