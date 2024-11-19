import { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { Box, Divider, Grid, Skeleton } from '@mui/material'

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
  returnErrorMsg,
} from '../../../utils/utils'
import { localStorgeKeyName } from '../../../constants/constant'
import { useNavigate } from 'react-router-dom'
import i18n from '../../../setups/i18n'
import CustomItemList from '../../../components/FormComponents/CustomItemList'
import { FactoryData, FactoryWarehouse, FactoryWarehouseData } from '../../../interfaces/factory'
import { editFactory, createFactory, deleteFactory, getFactoriesWarehouse } from '../../../APICalls/Collector/factory'
import { toast } from 'react-toastify'
import CircularLoading from '../../../components/CircularLoading'

interface IListItem {
  id: string;
  name: string;
}

interface Props {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  rowId?: number
  selectedItem?: any | null
  allFactoriesData: any[]
}

const DetailFactory: FunctionComponent<Props> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  rowId,
  selectedItem,
  allFactoriesData
}) => {
  const { t } = useTranslation()
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const [titleNameTchi, setTitleNameTchi] = useState<string>("")
  const [titleNameSchi, setTitleNameSchi] = useState<string>("")
  const [titleNameEng, setTitleNameEng] = useState<string>("")
  const [place, setPlace] = useState<string>("")
  const [introduction, setIntroduction] = useState<string>("")
  const [remark, setRemark] = useState<string>("")
  const [warehouse, setWarehouse] = useState<string>("")
  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([])
  const [formattedWarehouseList, setFormattedWarehouseList] = useState<IListItem[]>([])
  const [warehouseList, setWarehouseList] = useState<FactoryWarehouseData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  var realm = localStorage.getItem(localStorgeKeyName.realm) || 'collector'
  const navigate = useNavigate()

  const initWarehouseList = (async () => {
    setIsLoading(true)
    setWarehouseList([])
    const result = await getFactoriesWarehouse(selectedItem?.factoryId || '' )
    const data = result?.data 
  
    if (data) {
      setWarehouseList(data)
      setIsLoading(false)
    }   
  })

  useEffect(() => {
    if (warehouseList && warehouseList.length > 0) {
      const formatted: IListItem[] = warehouseList.map(warehouse => ({
        id: warehouse.warehouseId.toString(),
        name: getLocalizedWarehouseName(warehouse)
      }))
      setFormattedWarehouseList(formatted)
    }
  }, [warehouseList, i18n.language])

  const getLocalizedWarehouseName = (warehouse: FactoryWarehouseData): string => {
    switch (i18n.language) {
      case 'enus':
        return warehouse.warehouseNameEng || '';
      case 'zhch':
        return warehouse.warehouseNameSchi || '';
      default:
        return warehouse.warehouseNameTchi || '';
    }
  }

  const mappingData = () => {
    if (selectedItem != null) {
      setTitleNameEng(selectedItem.factoryNameEng)
      setTitleNameSchi(selectedItem.factoryNameSchi)
      setTitleNameTchi(selectedItem.factoryNameTchi)
      setPlace(selectedItem.address)
      setIntroduction(selectedItem.description)
      setRemark(selectedItem.remark)
      if (selectedItem.factoryWarehouse && Array.isArray(selectedItem.factoryWarehouse)) {
        const selectedWarehouseIds = selectedItem.factoryWarehouse.map(
          (warehouse: FactoryWarehouse) => warehouse.warehouseId.toString()
        )
        setSelectedWarehouses(selectedWarehouseIds)
      }
    }
  }

  useEffect(() => {
    setValidation([])
    initWarehouseList()
    if (action !== 'add') {
      mappingData()
    } else {
      setTrySubmited(false)
      resetData()
    }
  }, [drawerOpen])

  const resetData = () => {
    setTitleNameEng('')
    setTitleNameSchi('')
    setTitleNameTchi('')
    setPlace('')
    setIntroduction('')
    setRemark('')
    setSelectedWarehouses([])
  }

  const checkString = (s: string) => {
    if (!trySubmited) {
      return false
    }
    return s === ''
  }

  useEffect(() => {
    const otherFactories = allFactoriesData.filter(factory => 
      factory.factoryId !== selectedItem?.factoryId
    )

    const validate = async () => {
      const tempV: formValidate[] = []
        if (titleNameEng?.toString() === '') {
          tempV.push({
            field: t('common.englishName'),
            problem: formErr.empty,
            dataTestId: 'astd-factory-form-en-err-warning-9879',
            type: 'error'
          })
        } if (titleNameTchi?.toString() === '') {
          tempV.push({
            field: t('common.traditionalChineseName'),
            problem: formErr.empty,
            dataTestId: 'astd-factory-form-tc-err-warning-8786',
            type: 'error'
          })
        }  if (titleNameSchi?.toString() === '') {
          tempV.push({
            field: t('common.simplifiedChineseName'),
            problem: formErr.empty,
            dataTestId: 'astd-factory-form-sc-err-warning-9438',
            type: 'error'
          })
        }  if (place?.toString() === '') {
          tempV.push({
            field: t('report.address'),
            problem: formErr.empty,
            dataTestId: 'astd-factory-form-place-err-warning-4412',
            type: 'error'
          })
        } if (selectedWarehouses.length === 0) {
          tempV.push({
            field: t('factory.warehouse'),
            problem: formErr.empty,
            dataTestId: 'astd-factory-form-warehouse-err-warning-5123',
            type: 'error'
          })
        } if (titleNameEng && otherFactories.some(factory => 
          factory.factoryNameEng.toLowerCase() === titleNameEng.toLowerCase()
        )) {
          tempV.push({
            field: t('common.englishName'),
            problem: formErr.alreadyExist,
            dataTestId: 'astd-factory-form-en-err-warning-9879',
            type: 'error'
          })
        }  if (titleNameSchi && otherFactories.some(factory => 
          factory.factoryNameSchi === titleNameSchi
        )) {
          tempV.push({
            field: t('astd-factory-form-sc-err-warning-9438'),
            problem: formErr.alreadyExist,
            dataTestId: '',
            type: 'error'
          })
        } if (titleNameTchi && otherFactories.some(factory => 
          factory.factoryNameTchi === titleNameTchi
        )) {
          tempV.push({
            field: t('astd-factory-form-tc-err-warning-8786'),
            problem: formErr.alreadyExist,
            dataTestId: '',
            type: 'error'
          })
        }

      setValidation(tempV)
    }

    validate()
  }, [titleNameEng, titleNameSchi, titleNameTchi, selectedWarehouses, i18n.language])

  const handleSubmit = () => {
    const token = returnApiToken()

    const selectedWarehouseData: FactoryWarehouse[] = selectedWarehouses
    .filter(id => id) 
    .map(id => {
      const warehouse = warehouseList.find(w => w.warehouseId.toString() === id)
      if (warehouse) {
        return {
          factoryWarehouseId: selectedItem?.factoryId || 0,
          warehouseId: warehouse.warehouseId,
          createdBy: token.loginId,
          updatedBy: token.loginId
        }
      }
      return null
    })
    .filter((warehouse): warehouse is FactoryWarehouse => warehouse !== null)

    const formData: FactoryData = {
      factoryId: selectedItem?.factoryId ? selectedItem?.factoryId : 0,
      tenantId: Number(token.tenantId),
      factoryNameEng: titleNameEng,
      factoryNameSchi: titleNameSchi,
      factoryNameTchi: titleNameTchi,
      address: place,
      factoryWarehouse: selectedWarehouseData,
      description: introduction,
      remark: remark,
      createdBy: token.loginId,
      updatedBy: token.loginId,
    }

    if (action === 'add') {
      handleCreateUserGroup(formData)
    } else {
      handleEditUserGroup(formData)
    }
  }

  const handleCreateUserGroup = async (formData: FactoryData) => {
    if (validation.length === 0) {
      const result = await createFactory(formData)
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
  }

  const handleEditUserGroup = async (formData: FactoryData) => {
    try {
      if (validation.length === 0) {
        if (selectedItem != null) {
          const result = await editFactory(formData.factoryId.toString(), formData)
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
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const handleDelete = async () => {
    try {
      if (selectedItem != null) {
        const result = await deleteFactory(selectedItem.factoryId)
        if (result) {
          onSubmitData('success', t('common.deletedSuccessfully'))
          resetData()
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

  const showErrorToast = (msg: string) => {
    toast.error(msg, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <div className="add-factory">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={action}
        headerProps={{
          title:
            action === 'add'
              ? t('top_menu.add_new')
              : action === 'edit'
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
            <CustomField label={t('common.traditionalChineseName')} mandatory>
              <CustomTextField
                id="titleNameTchi"
                value={titleNameTchi}
                disabled={action === 'delete'}
                placeholder={t(
                  'settings_page.recycling.traditional_chinese_name_placeholder'
                )}
                dataTestId='astd-factory-form-tc-input-field-7241'
                onChange={(event) => setTitleNameTchi(event.target.value)}
                error={checkString(titleNameTchi)}
              />
            </CustomField>
            <CustomField label={t('common.simplifiedChineseName')} mandatory>
              <CustomTextField
              dataTestId='astd-factory-form-sc-input-field-4510'
                id="titleNameSchi"
                value={titleNameSchi}
                disabled={action === 'delete'}
                placeholder={t(
                  'settings_page.recycling.simplified_chinese_name'
                )}
                onChange={(event) => setTitleNameSchi(event.target.value)}
                error={checkString(titleNameSchi)}
              />
            </CustomField>
            <CustomField label={t('common.englishName')} mandatory>
              <CustomTextField
                dataTestId='astd-factory-form-en-input-field-5215'
                id="titleNameEng"
                value={titleNameEng}
                disabled={action === 'delete'}
                placeholder={t(
                  'settings_page.recycling.english_name_placeholder'
                )}
                onChange={(event) => setTitleNameEng(event.target.value)}
                error={checkString(titleNameEng)}
              />
            </CustomField>
            <CustomField label={t('report.address')} mandatory>
              <CustomTextField
                dataTestId='astd-factory-form-place-input-field-2208'
                id="place"
                value={place}
                placeholder={t('report.pleaseEnterAddress')}
                onChange={(event) => setPlace(event.target.value)}
                multiline={true}
                disabled={action === 'delete'}
              />
            </CustomField>
            <CustomField label={t('factory.warehouse')} mandatory>
              {isLoading ?         
                <Box style={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
                  <Skeleton variant="rounded" height={30} width="30%"/>
                  <Skeleton variant="rounded" height={30} width="30%"/>
                </Box> : (warehouseList && 
                (<CustomItemList
                  dataTestId='astd-factory-form-warehouse-select-button-2819'
                  items={formattedWarehouseList}
                  multiSelect={(selectedItems) => {
                    setSelectedWarehouses(selectedItems)
                  }}
                  editable={action !== 'delete'}
                  defaultSelected={selectedWarehouses}
                  needPrimaryColor={true}
                />
              )) }
            </CustomField>
            <CustomField label={t('factory.introduction')}>
              <CustomTextField
                dataTestId='astd-factory-form-introduction-input-field-1184'
                id="introduction"
                value={introduction}
                placeholder={t('packaging_unit.introduction_placeholder')}
                onChange={(event) => setIntroduction(event.target.value)}
                multiline={true}
                disabled={action === 'delete'}
              />
            </CustomField>
            <CustomField label={t('common.remark')}>
              <CustomTextField
                dataTestId='astd-factory-form-remark-input-field-1164'
                id="remark"
                value={remark}
                placeholder={t('packaging_unit.remark_placeholder')}
                onChange={(event) => setRemark(event.target.value)}
                multiline={true}
                disabled={action === 'delete'}
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
