import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Divider, Grid } from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { styles } from '../../../constants/styles'

import { useTranslation } from 'react-i18next'
import { formValidate } from '../../../interfaces/common'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import {
  createPackaging,
  editPackaging
} from '../../../APICalls/Collector/packagingUnit'
import { extractError, returnApiToken } from '../../../utils/utils'
import {
  createPackagingUnit,
  editPackagingUnit
} from '../../../APICalls/Customer/packagingUnit'
import { STATUS_CODE, formErr } from '../../../constants/constant'
import { returnErrorMsg } from '../../../utils/utils'
import i18n from '../../../setups/i18n'
import CustomItemList from '../../../components/FormComponents/CustomItemList'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import { useNavigate } from 'react-router-dom'

interface PackagingUnit {
  packagingTypeId: string
  tenantId: string
  packagingNameTchi: string
  packagingNameSchi: string
  packagingNameEng: string
  description: string
  remark: string
  status: string
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}

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

const CreatePackagingUnit: FunctionComponent<CreatePackagingProps> = ({
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
  const [brNo, setBRNumber] = useState('')
  const [description, setDescription] = useState('')
  const [remark, setRemark] = useState('')
  const [packagingId, setPackagingId] = useState('')
  const [status, setStatus] = useState('ACTIVE')
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const [engNameExisting, setEngNameExisting] = useState<string[]>([])
  const [schiNameExisting, setSchiNameExisting] = useState<string[]>([])
  const [tchiNameExisting, setTchiNameExisting] = useState<string[]>([])
  const navigate = useNavigate();

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
        setPackagingId(selectedItem.packagingTypeId)
        setTChineseName(selectedItem.packagingNameTchi)
        setSChineseName(selectedItem.packagingNameSchi)
        setEnglishName(selectedItem.packagingNameEng)
        setDescription(selectedItem.description)
        setRemark(selectedItem.remark)
        setStatus(selectedItem.status)

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
    setPackagingId('')
    setTChineseName('')
    setSChineseName('')
    setEnglishName('')
    setBRNumber('')
    setDescription('')
    setRemark('')
    setStatus('')
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
      //   brNo.toString() == '' &&
      //     tempV.push({
      //       field: t('general_settings.reference_number'),
      //       problem: formErr.empty,
      //       type: 'error'
      //     })

      setValidation(tempV)
    }

    validate()
  }, [tChineseName, sChineseName, englishName, brNo, i18n.language])

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  const handleSubmit = () => {
    const token = returnApiToken()

    const formData = {
      tenantId: token.tenantId,
      packagingNameTchi: tChineseName,
      packagingNameSchi: sChineseName,
      packagingNameEng: englishName,
      description: description,
      remark: remark,
      status: status,
      createdBy: token.loginId,
      updatedBy: token.loginId
    }

    if (action == 'add') {
      handleCreatePackaging(formData)
    } else if (action == 'edit') {
      handleEditPackaging(formData, packagingId)
    } else if (action === 'delete') {
      handleDelete()
    }
  }

  const handleCreatePackaging = async (formData: any) => {
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
    } catch (error:any) {
      const {state} = extractError(error);
      if(state.code === STATUS_CODE[503] ){
        navigate('/maintenance')
      } else {
        let field = t('common.saveFailed');
        let problem = ''
        if(error?.response?.data?.status === STATUS_CODE[500]){
          field = t('general_settings.packageNameAlreadyExist')
          problem = formErr.alreadyExist
        } 
        setValidation(
          [
            {
              field,
              problem,
              type: 'error'
            }
          ]
        )
        setTrySubmited(true)
        // onSubmitData('error', t('common.saveFailed'))
      }
    }
  }

  const handleEditPackaging = async (formData: any, collectorId: string) => {
   try {
    if (validation.length === 0) {
      const result = await editPackaging(formData, collectorId)
      if (result) {
        onSubmitData('success', t('common.editSuccessfully'))
        resetData()
        handleDrawerClose()
      }
    } else {
      setTrySubmited(true)
    }
   } catch (error:any) {
    const {state} = extractError(error);
    if(state.code === STATUS_CODE[503] ){
      navigate('/maintenance')
    } else {
      let field = t('common.saveFailed');
      let problem = ''
      if(error?.response?.data?.status === STATUS_CODE[500]){
        field = t('general_settings.packageNameAlreadyExist')
        problem = formErr.alreadyExist
      } 
      setValidation(
        [
          {
            field,
            problem,
            type: 'error'
          }
        ]
      )
      setTrySubmited(true)
    }
   }
  }

  const handleDelete = async () => {
    try {
      const token = returnApiToken()

    const formData = {
      tenantId: token.tenantId,
      packagingNameTchi: tChineseName,
      packagingNameSchi: sChineseName,
      packagingNameEng: englishName,
      description: description,
      remark: remark,
      status: 'DELETED',
      createdBy: token.loginId,
      updatedBy: token.loginId
    }

    if (selectedItem != null) {
      const result = await editPackaging(formData, packagingId)
      if (result) {
        onSubmitData('success', t('common.deletedSuccessfully'))
        resetData()
        handleDrawerClose()
      } else {
        onSubmitData('error', t('common.deleteFailed'))
      }
    }
    } catch (error:any) {
      const {state} = extractError(error);
      if(state.code === STATUS_CODE[503] ){
        navigate('/maintenance')
      } else {
        onSubmitData('error', t('common.deleteFailed'))
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
                placeholder={t('packaging_unit.traditional_chinese_name_placeholder')}
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
                placeholder={t('packaging_unit.simplified_chinese_name_placeholder')}
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
          {/* <Box sx={{ marginY: 2 }}>
            <CustomField label={t('general_settings.reference_number')}>
              <CustomTextField
                id="brNo"
                value={brNo}
                disabled={action === 'delete'}
                placeholder={t('general_settings.reference_number_placeholder')}
                onChange={(event) => setBRNumber(event.target.value)}
                error={checkString(brNo)}
              />
            </CustomField>
          </Box> */}
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
          <CustomField label={t('packaging_unit.remark')} mandatory={false}>
            <CustomTextField
              id="remark"
              placeholder={t('packaging_unit.remark_placeholder')}
              onChange={(event) => setRemark(event.target.value)}
              multiline={true}
              defaultValue={remark}
            />
          </CustomField>
          <CustomField label={t('col.status')} mandatory={true}>
            <CustomItemList
              items={statusList()}
              singleSelect={(selectedItem) => {
                setStatus(selectedItem)
              }}
              editable={action != 'delete'}
              defaultSelected={status}
              needPrimaryColor={true}
            />
          </CustomField>
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

export default CreatePackagingUnit
