import { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { Box, Divider, Grid } from '@mui/material'

import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { useTranslation } from 'react-i18next'
import { formValidate } from '../../../interfaces/common'
import { STATUS_CODE, formErr } from '../../../constants/constant'
import {
  extractError,
  returnApiToken,
  returnErrorMsg
} from '../../../utils/utils'
import { localStorgeKeyName } from '../../../constants/constant'
import { useNavigate } from 'react-router-dom'
import i18n from '../../../setups/i18n'
import CustomItemList from '../../../components/FormComponents/CustomItemList'

interface Props {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  rowId?: number
  selectedItem?: any | null
}

const DetailFactory: FunctionComponent<Props> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  rowId,
  selectedItem
}) => {
  const { t } = useTranslation()
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const [titleNameTchi, setTitleNameTchi] = useState<string>('')
  const [titleNameSchi, setTitleNameSchi] = useState<string>('')
  const [titleNameEng, setTitleNameEng] = useState<string>('')
  const [place, setPlace] = useState<string>('')
  const [introduction, setIntroduction] = useState<string>('')
  const [remark, setRemark] = useState<string>('')
  const [warehouse, setWarehouse] = useState<string>('')

  var realm = localStorage.getItem(localStorgeKeyName.realm) || 'collector'
  const navigate = useNavigate()

  const mappingData = () => {
    if (selectedItem != null) {
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
  }, [drawerOpen])

  const resetData = () => {}

  const checkString = (s: string) => {
    if (!trySubmited) {
      return false
    }
    return s == ''
  }

  useEffect(() => {
    const validate = async () => {
      const tempV: formValidate[] = []
      //   roleName?.toString() == '' &&
      //     tempV.push({
      //       field: t('userGroup.groupName'),
      //       problem: formErr.empty,
      //       dataTestId: 'astd-user-group-form-group-name-err-warning-3882',
      //       type: 'error'
      //     })

      // console.log("tempV", tempV)
      setValidation(tempV)
    }

    validate()
  }, [])

  const handleSubmit = () => {
    const token = returnApiToken()

    // if (action == 'add') {
    //   const formData: CreateUserGroupProps = {
    //     realm: realm,
    //     tenantId: token.tenantId,
    //     roleName: roleName,
    //     description: description,
    //     functions: functions,
    //     createdBy: token.loginId,
    //     status: 'ACTIVE',
    //     isAdmin: isAdmin
    //   }
    //   handleCreateUserGroup(formData)
    // } else {
    //   const formData: EditUserGroupProps = {
    //     functions: functions,
    //     roleName: roleName,
    //     description: description,
    //     updatedBy: token.loginId,
    //     status: 'ACTIVE',
    //     isAdmin: isAdmin
    //   }
    //   handleEditUserGroup(formData)
    // }
  }

  const handleCreateUserGroup = async () => {}

  const handleEditUserGroup = async () => {
    // try {
    //   if (validation.length === 0) {
    //     if (selectedItem != null) {
    //       const result = await editUserGroup(formData, selectedItem.groupId!)
    //       if (result) {
    //         onSubmitData('success', t('notify.SuccessEdited'))
    //         resetData()
    //         handleDrawerClose()
    //       } else {
    //         setTrySubmited(true)
    //         onSubmitData('error', t('notify.errorEdited'))
    //       }
    //     }
    //   } else {
    //     setTrySubmited(true)
    //   }
    // } catch (error: any) {
    //   const { state, realm } = extractError(error)
    //   if (state.code === STATUS_CODE[503]) {
    //     navigate('/maintenance')
    //   }
    // }
  }

  const handleDelete = async () => {}

  return (
    <div className="add-factory">
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
          subTitle: t('factory.factory'),
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
            <CustomField label={t('common.traditionalChineseName')}>
              <CustomTextField
                id="titleNameTchi"
                value={titleNameTchi}
                disabled={action === 'delete'}
                placeholder={t(
                  'settings_page.recycling.traditional_chinese_name_placeholder'
                )}
                onChange={(event) => setTitleNameTchi(event.target.value)}
                error={checkString(titleNameTchi)}
              />
            </CustomField>
            <CustomField label={t('common.simplifiedChineseName')}>
              <CustomTextField
                id="titleNameSchi"
                value={titleNameTchi}
                disabled={action === 'delete'}
                placeholder={t(
                  'settings_page.recycling.simplified_chinese_name'
                )}
                onChange={(event) => setTitleNameSchi(event.target.value)}
                error={checkString(titleNameSchi)}
              />
            </CustomField>
            <CustomField label={t('common.englishName')}>
              <CustomTextField
                id="titleNameEng"
                value={titleNameTchi}
                disabled={action === 'delete'}
                placeholder={t(
                  'settings_page.recycling.english_name_placeholder'
                )}
                onChange={(event) => setTitleNameEng(event.target.value)}
                error={checkString(titleNameEng)}
              />
            </CustomField>
            <CustomField label={t('warehouse_page.place')}>
              <CustomTextField
                id="place"
                value={place}
                placeholder={'火炭拗背灣街14號'}
                onChange={(event) => setPlace(event.target.value)}
                multiline={true}
              />
            </CustomField>
            <CustomField label={t('factory.warehouse')}>
              <CustomItemList
                items={[
                  { id: '1', name: '貨倉1' },
                  { id: '2', name: '貨倉2' }
                ]}
                singleSelect={(selectedItem) => {
                  setWarehouse(selectedItem)
                }}
                editable={action != 'delete'}
                defaultSelected={warehouse}
                needPrimaryColor={true}
              />
            </CustomField>
            <CustomField label={t('factory.introduction')}>
              <CustomTextField
                id="introduction"
                value={introduction}
                placeholder={t('common.enterText')}
                onChange={(event) => setIntroduction(event.target.value)}
                multiline={true}
              />
            </CustomField>
            <CustomField label={t('common.remark')}>
              <CustomTextField
                id="remark"
                value={remark}
                placeholder={t('common.enterText')}
                onChange={(event) => setRemark(event.target.value)}
                multiline={true}
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
        </Box>
      </RightOverlayForm>
    </div>
  )
}

export default DetailFactory
