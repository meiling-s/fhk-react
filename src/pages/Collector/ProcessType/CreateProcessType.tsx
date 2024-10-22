import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Divider, FormControl, Grid, MenuItem } from '@mui/material'
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
import { extractError, returnErrorMsg, showErrorToast } from '../../../utils/utils'
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
import { ProcessTypeItem } from '../../../interfaces/processType'
import { WeightUnit } from '../../../interfaces/weightUnit'

interface CreateProcessType {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  rowId?: number
  selectedItem?: ProcessTypeItem | null
  weightUnit: WeightUnit[]
}

const CreateProcessType: FunctionComponent<CreateProcessType> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  rowId,
  selectedItem,
  weightUnit
}) => {
  const { t } = useTranslation()
  const [tChineseName, setTChineseName] = useState<string>('')
  const [sChineseName, setSChineseName] = useState<string>('')
  const [englishName, setEnglishName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [remark, setRemark] = useState<string>('')
  const [packagingTypeId, setPackagingTypeId] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const [version, setVersion] = useState<number>(0)
  const [processTime, setProcessTime] = useState<string>('')
  const [processNumber, setProcessNumber] = useState<string>('')
  const [processWeight, setProcessWeight] = useState<string>('')
  const navigate = useNavigate();
  const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const time = ['Minutes', 'Hours']

  useEffect(() => {
    if (action === 'edit' || action === 'delete') {
      if (selectedItem !== null && selectedItem !== undefined) {
        // setPackagingTypeId(selectedItem.packagingTypeId)
        // setTChineseName(selectedItem.packagingNameTchi)
        // setSChineseName(selectedItem.packagingNameSchi)
        // setEnglishName(selectedItem.packagingNameEng)
        // setDescription(selectedItem.description)
        // setRemark(selectedItem.remark)
        // setStatus(selectedItem.status)
        // setVersion(selectedItem.version ?? 0)

        // // set existing name
        // setEngNameExisting(
        //   engNameList.filter((item) => item != selectedItem.packagingNameEng)
        // )
        // setSchiNameExisting(
        //   schiNameList.filter((item) => item != selectedItem.packagingNameSchi)
        // )
        // setTchiNameExisting(
        //   tchiNameList.filter((item) => item != selectedItem.packagingNameTchi)
        // )
      }
    } else if (action === 'add') {
      resetData()
    }
  }, [selectedItem, action, drawerOpen])

  const resetData = () => {
    setTChineseName('')
    setSChineseName('')
    setEnglishName('')
    setDescription('')
    setRemark('')
    setProcessNumber('')
    setProcessTime('')
    setProcessWeight('')
    setTrySubmited(false)
  }

  useEffect(() => {
    const validate = async () => {
      const tempV: formValidate[] = []

      tChineseName.toString() == '' &&
        tempV.push({
          field: t('process_type.traditional_chinese_name'),
          problem: formErr.empty,
          type: 'error'
        })
      sChineseName.toString() == '' &&
        tempV.push({
          field: t('process_type.simplified_chinese_name'),
          problem: formErr.empty,
          type: 'error'
        })
      englishName.toString() == '' &&
        tempV.push({
          field: t('process_type.english_name'),
          problem: formErr.empty,
          type: 'error'
        })
      processNumber.toString() == '' && processTime.toString() == '' && processWeight.toString() == '' &&
        tempV.push({
          field: t('process_type.time'),
          problem: formErr.empty,
          type: 'error'
        })

      setValidation(tempV)
    }

    validate()
  }, [tChineseName, sChineseName, englishName, processNumber, processTime, processWeight, i18n.language])

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
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      } else {
        if (error?.response?.data?.status === STATUS_CODE[500] ||
          error?.response?.data?.status === STATUS_CODE[409]) {
          setValidation(
            [
              {
                field: t('common.packageName'),
                problem: '',
                type: 'error'
              }
            ]
          )
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
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      } else {
        if (error?.response?.data?.status === STATUS_CODE[409]) {
          showErrorToast(error?.response?.data?.message);
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
        version: version,
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
      const { state } = extractError(error);
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
                : selectedItem?.processTypeId,
          subTitle: t('process_type.process_type'),
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
              label={t('process_type.traditional_chinese_name')}
              mandatory
            >
              <CustomTextField
                id="tChineseName"
                value={tChineseName}
                disabled={action === 'delete'}
                placeholder={t('process_type.traditional_chinese_name_placeholder')}
                onChange={(event) => setTChineseName(event.target.value)}
                error={checkString(tChineseName)}
              />
            </CustomField>
          </Box>

          <Box sx={{ marginY: 2 }}>
            <CustomField
              label={t('process_type.simplified_chinese_name')}
              mandatory
            >
              <CustomTextField
                id="sChineseName"
                value={sChineseName}
                disabled={action === 'delete'}
                placeholder={t('process_type.simplified_chinese_name_placeholder')}
                onChange={(event) => setSChineseName(event.target.value)}
                error={checkString(sChineseName)}
              />
            </CustomField>
          </Box>

          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('process_type.english_name')} mandatory>
              <CustomTextField
                id="englishName"
                value={englishName}
                disabled={action === 'delete'}
                placeholder={t('process_type.english_name_placeholder')}
                onChange={(event) => setEnglishName(event.target.value)}
                error={checkString(englishName)}
              />
            </CustomField>
          </Box>

          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('process_type.time')} mandatory />
            <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-mini">
              <div className="self-stretch overflow-hidden flex flex-row items-center justify-start gap-[8px]">
                <div className="w-full ">
                  <div
                    className="flex justify-center items-center gap-2 mb-2"
                  >
                    <FormControl sx={{ m: 1, width: '100%' }}>
                      <Select
                        value={processNumber}
                        onChange={(event: SelectChangeEvent<string>) => setProcessNumber(event.target.value)}
                        displayEmpty
                        disabled={action === 'delete'}
                        inputProps={{
                          'aria-label': 'Without label'
                        }}
                        sx={{
                          borderRadius: '12px'
                        }}
                        error={checkString(processNumber)}
                      >
                        {number.map((value, index) => (
                          <MenuItem value={value} key={index}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '100%' }}>
                      <Select
                        value={processTime}
                        onChange={(event: SelectChangeEvent<string>) => setProcessTime(event.target.value)}
                        displayEmpty
                        disabled={action === 'delete'}
                        inputProps={{
                          'aria-label': 'Without label'
                        }}
                        sx={{
                          borderRadius: '12px' // Adjust the value as needed
                        }}
                        error={checkString(processTime)}
                      >
                        {time.map((value, index) => (
                          <MenuItem value={value} key={index}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '100%' }}>
                      <Select
                        value={processWeight}
                        onChange={(event: SelectChangeEvent<string>) => setProcessWeight(event.target.value)}
                        displayEmpty
                        disabled={action === 'delete'}
                        inputProps={{
                          'aria-label': 'Without label'
                        }}
                        sx={{
                          borderRadius: '12px'
                        }}
                        error={checkString(processWeight)}
                      >
                        {weightUnit.map((value, index) => {
                          const name = i18n.language === 'enus' ? value.unitNameEng : i18n.language === 'zhhk' ? value.unitNameTchi : value.unitNameSchi
                          return (
                            <MenuItem value={value.unitId} key={index}>
                              {name}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>
          </Box>


          <Box sx={{ marginY: 2 }}>
            <CustomField
              label={t('process_type.introduction')}
              mandatory={false}
            >
              <CustomTextField
                id="description"
                placeholder={t('process_type.introduction_placeholder')}
                onChange={(event) => setDescription(event.target.value)}
                multiline={true}
                defaultValue={description}
              />
            </CustomField>
          </Box>

          <Box sx={{ marginY: 2 }}>
            <CustomField label={t('process_type.remark')} mandatory={false}>
              <CustomTextField
                id="remark"
                placeholder={t('process_type.remark_placeholder')}
                onChange={(event) => setRemark(event.target.value)}
                multiline={true}
                defaultValue={remark}
              />
            </CustomField>
          </Box>

          <Box sx={{ marginY: 2 }}>
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

export default CreateProcessType
