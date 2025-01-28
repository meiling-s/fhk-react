import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Divider, Grid } from '@mui/material'
import dayjs from 'dayjs'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { styles } from '../../../constants/styles'

import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import {
  Vehicle,
  CreateVehicle as CreateVehicleForm
} from '../../../interfaces/vehicles'
import { STATUS_CODE, formErr } from '../../../constants/constant'
import {
  extractError,
  returnErrorMsg,
  showErrorToast
} from '../../../utils/utils'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import { localStorgeKeyName } from '../../../constants/constant'
import i18n from '../../../setups/i18n'

import {
  CreatePackagingUnit as CreatePackagingUnitProps,
  PackagingUnit
} from '../../../interfaces/packagingUnit'
import {
  createPackaging,
  editPackaging
} from '../../../APICalls/Collector/packagingUnit'
import CustomItemList from '../../../components/FormComponents/CustomItemList'
import { useNavigate } from 'react-router-dom'

interface CreatePackagingProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  rowId?: number
  selectedItem?: PackagingUnit | null
  engNameList: string[]
  schiNameList: string[]
  tchiNameList: string[]
}

const CreatePackaging: FunctionComponent<CreatePackagingProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  rowId,
  selectedItem,
  engNameList = [],
  schiNameList = [],
  tchiNameList = []
}) => {
  const { t } = useTranslation()
  const [tChineseName, setTChineseName] = useState('')
  const [sChineseName, setSChineseName] = useState('')
  const [englishName, setEnglishName] = useState('')
  const [description, setDescription] = useState('')
  const [remark, setRemark] = useState('')
  const [packagingTypeId, setPackagingTypeId] = useState('')
  const [status, setStatus] = useState('')
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const [engNameExisting, setEngNameExisting] = useState<string[]>([])
  const [schiNameExisting, setSchiNameExisting] = useState<string[]>([])
  const [tchiNameExisting, setTchiNameExisting] = useState<string[]>([])
  const [version, setVersion] = useState<number>(0)
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
      }
    ]
    return colList
  }

  useEffect(() => {
    if (action === 'edit' || action === 'delete') {
      if (selectedItem !== null && selectedItem !== undefined) {
        setPackagingTypeId(selectedItem.packagingTypeId)
        setTChineseName(selectedItem.packagingNameTchi)
        setSChineseName(selectedItem.packagingNameSchi)
        setEnglishName(selectedItem.packagingNameEng)
        setDescription(selectedItem.description)
        setRemark(selectedItem.remark)
        setStatus(selectedItem.status)
        setVersion(selectedItem.version ?? 0)

        // set existing name
        setEngNameExisting(
          engNameList.filter((item) => item != selectedItem.packagingNameEng)
        )
        setSchiNameExisting(
          schiNameList.filter((item) => item != selectedItem.packagingNameSchi)
        )
        setTchiNameExisting(
          tchiNameList.filter((item) => item != selectedItem.packagingNameTchi)
        )
      }
    } else if (action === 'add') {
      resetData()
      setEngNameExisting(engNameList)
      setSchiNameExisting(schiNameList)
      setTchiNameExisting(tchiNameList)
    }
  }, [selectedItem, action, drawerOpen])

  const resetData = () => {
    setTChineseName('')
    setSChineseName('')
    setEnglishName('')
    setDescription('')
    setRemark('')
    setTrySubmited(false)
  }

  useEffect(() => {
    const validate = async () => {
      const tempV: formValidate[] = []

      tChineseName.toString() == '' &&
        tempV.push({
          field: t('packaging_unit.traditional_chinese_name'),
          problem: formErr.empty,
          type: 'error'
        })
      tchiNameExisting.some(
        (item) => item.toLowerCase() == tChineseName.toLowerCase()
      ) &&
        tempV.push({
          field: t('packaging_unit.traditional_chinese_name'),
          problem: formErr.alreadyExist,
          type: 'error'
        })
      sChineseName.toString() == '' &&
        tempV.push({
          field: t('packaging_unit.simplified_chinese_name'),
          problem: formErr.empty,
          type: 'error'
        })
      schiNameExisting.some(
        (item) => item.toLowerCase() == sChineseName.toLowerCase()
      ) &&
        tempV.push({
          field: t('packaging_unit.simplified_chinese_name'),
          problem: formErr.alreadyExist,
          type: 'error'
        })
      englishName.toString() == '' &&
        tempV.push({
          field: t('packaging_unit.english_name'),
          problem: formErr.empty,
          type: 'error'
        })
      engNameExisting.some(
        (item) => item.toLowerCase() == englishName.toLowerCase()
      ) &&
        tempV.push({
          field: t('packaging_unit.english_name'),
          problem: formErr.alreadyExist,
          type: 'error'
        })

      status.toString() == '' &&
        tempV.push({
          field: t('col.status'),
          problem: formErr.empty,
          type: 'error'
        })

      setValidation(tempV)
    }

    validate()
  }, [tChineseName, sChineseName, englishName, i18n.language])

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  const handleSubmit = () => {
    const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
    const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ''

    const formData: CreatePackagingUnitProps = {
      tenantId: tenantId,
      packagingNameTchi: tChineseName,
      packagingNameSchi: sChineseName,
      packagingNameEng: englishName,
      description: description,
      remark: remark,
      status: status,
      createdBy: loginId,
      updatedBy: loginId,
      ...(action === 'edit' && { version: version })
    }

    if (action == 'add') {
      handleCreatePackaging(formData)
    } else if (action == 'edit') {
      handleEditPackaging(formData, packagingTypeId)
    } else if (action === 'delete') {
      handleDelete()
    }
  }

  const handleCreatePackaging = async (formData: CreatePackagingUnitProps) => {
    try {
      if (validation.length === 0) {
        const result = await createPackaging(formData)
        if (result) {
          onSubmitData('success', t('common.saveSuccessfully'))
          resetData()
          handleDrawerClose()
        } else {
          onSubmitData('error', t('common.saveFailed'))
        }
      } else {
        setTrySubmited(true)
      }
    } catch (error: any) {
      const { state } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      } else {
        if (
          error?.response?.data?.status === STATUS_CODE[500] ||
          error?.response?.data?.status === STATUS_CODE[409]
        ) {
          setValidation([
            {
              field: t('common.packageName'),
              problem: '',
              type: 'error'
            }
          ])
        }
        setTrySubmited(true)
        // onSubmitData('error', t('common.saveFailed'))
      }
    }
  }

  const handleEditPackaging = async (
    formData: CreatePackagingUnitProps,
    packagingTypeId: string
  ) => {
    try {
      if (validation.length === 0) {
        const result = await editPackaging(formData, packagingTypeId)
        if (result) {
          onSubmitData('success', t('common.editSuccessfully'))
          resetData()
          handleDrawerClose()
        }
      } else {
        setTrySubmited(true)
      }
    } catch (error: any) {
      const { state } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      } else {
        if (error?.response?.data?.status === STATUS_CODE[409]) {
          showErrorToast(error?.response?.data?.message)
        }
      }
    }
  }

  const handleDelete = async () => {
    try {
      const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
      const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ''

      const formData: CreatePackagingUnitProps = {
        tenantId: tenantId,
        packagingNameTchi: tChineseName,
        packagingNameSchi: sChineseName,
        packagingNameEng: englishName,
        description: description,
        remark: remark,
        status: 'DELETED',
        createdBy: loginId,
        updatedBy: loginId,
        version: version
      }

      if (selectedItem != null) {
        const result = await editPackaging(formData, packagingTypeId)
        if (result) {
          onSubmitData('success', t('common.deletedSuccessfully'))
          resetData()
          handleDrawerClose()
        } else {
          onSubmitData('error', t('common.deleteFailed'))
        }
      }
    } catch (error: any) {
      const { state } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
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
              ? t('common.delete')
              : selectedItem?.packagingTypeId,
          subTitle: t('packaging_unit.packaging_unit'),
          submitText: t('add_warehouse_page.save'),
          cancelText: t('add_warehouse_page.delete'),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
          onDelete: handleDelete,
          deleteText: t('common.deleteMessage')
        }}
      >
        <Divider></Divider>
        <Box sx={{ marginX: 2 }}>
          <Box sx={{ marginY: 2 }}>
            <CustomField
              label={t('packaging_unit.traditional_chinese_name')}
              mandatory
            >
              <CustomTextField
                id="tChineseName"
                value={tChineseName}
                disabled={action === 'delete'}
                placeholder={t(
                  'packaging_unit.traditional_chinese_name_placeholder'
                )}
                onChange={(event) => setTChineseName(event.target.value)}
                error={checkString(tChineseName)}
              />
            </CustomField>
          </Box>

          <Box sx={{ marginY: 2 }}>
            <CustomField
              label={t('packaging_unit.simplified_chinese_name')}
              mandatory
            >
              <CustomTextField
                id="sChineseName"
                value={sChineseName}
                disabled={action === 'delete'}
                placeholder={t(
                  'packaging_unit.simplified_chinese_name_placeholder'
                )}
                onChange={(event) => setSChineseName(event.target.value)}
                error={checkString(sChineseName)}
              />
            </CustomField>
          </Box>

          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('packaging_unit.english_name')} mandatory>
              <CustomTextField
                id="englishName"
                value={englishName}
                disabled={action === 'delete'}
                placeholder={t('packaging_unit.english_name_placeholder')}
                onChange={(event) => setEnglishName(event.target.value)}
                error={checkString(englishName)}
              />
            </CustomField>
          </Box>

          <Box sx={{ marginY: 2 }}>
            <CustomField
              label={t('packaging_unit.introduction')}
              mandatory={false}
            >
              <CustomTextField
                id="description"
                placeholder={t('packaging_unit.introduction_placeholder')}
                onChange={(event) => setDescription(event.target.value)}
                multiline={true}
                defaultValue={description}
              />
            </CustomField>
          </Box>

          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('packaging_unit.remark')} mandatory={false}>
              <CustomTextField
                id="remark"
                placeholder={t('packaging_unit.remark_placeholder')}
                onChange={(event) => setRemark(event.target.value)}
                multiline={true}
                defaultValue={remark}
              />
            </CustomField>
          </Box>

          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('col.status')} mandatory={true}>
              <CustomItemList
                items={statusList()}
                singleSelect={(selectedItem) => {
                  setStatus(selectedItem)
                }}
                editable={action != 'delete'}
                defaultSelected={status}
                needPrimaryColor={false}
                error={checkString(status)}
              />
            </CustomField>
          </Box>

          <Box sx={{ marginY: 2, paddingBottom: 2 }}>
            <Grid item>
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
          </Box>
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
  },
  datePicker: {
    ...styles.textField,
    width: '250px',
    '& .MuiIconButton-edgeEnd': {
      color: '#79CA25'
    }
  },
  DateItem: {
    display: 'flex',
    height: 'fit-content'
  }
}

export default CreatePackaging
