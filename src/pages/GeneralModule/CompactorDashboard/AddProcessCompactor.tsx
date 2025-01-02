import { useEffect, useState, FunctionComponent, useCallback } from 'react'
import {
  Box,
  Divider,
  Button,
  Grid,
  FormControl,
  Typography,
  Select,
  SelectChangeEvent,
  MenuItem,
  InputAdornment,
  ButtonBase,
  Card,
  ImageList,
  ImageListItem
} from '@mui/material'
import CustomField from '../../../components/FormComponents/CustomField'
import Switcher from '../../../components/FormComponents/CustomSwitch'
import CustomTextField from '../../../components/FormComponents/CustomTextField'

import {
  onChangeWeight,
  formatWeight,
  getThemeColorRole,
  getThemeCustomList,
  extractError,
  showErrorToast,
  showSuccessToast,
  returnErrorMsg
} from '../../../utils/utils'

import {
  ADD_CIRCLE_FILL_ICON_,
  DELETE_OUTLINED_ICON
} from '../../../themes/icons'
import { styles } from '../../../constants/styles'
import { useTranslation } from 'react-i18next'
import { CAMERA_OUTLINE_ICON } from '../../../themes/icons'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined'

import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import RecyclablesListSingleSelect from '../../../components/SpecializeComponents/RecyclablesListSingleSelect'
import { singleRecyclable } from '../../../interfaces/collectionPoint'
import {
  formErr,
  localStorgeKeyName,
  STATUS_CODE
} from 'src/constants/constant'
import ProductListSingleSelect, {
  singleProduct
} from 'src/components/SpecializeComponents/ProductListSingleSelect'
import { il_item } from 'src/components/FormComponents/CustomItemList'
import i18n from 'src/setups/i18n'
import { getAllPackagingUnit } from 'src/APICalls/Collector/packagingUnit'
import { PackagingUnit } from 'src/interfaces/packagingUnit'
import { useNavigate } from 'react-router-dom'
import {
  CompactorProcessOut,
  ProcessOutItem
} from 'src/interfaces/processCompactor'
import { createCompactorProcessOut } from 'src/APICalls/compactorProcess'
import {
  mappingRecy,
  mappingSubRecy,
  mappingProductType,
  mappingSubProductType,
  mappingAddonsType
} from 'src/pages/Collector/ProccessOrder/utils'
import { getWeightUnit } from 'src/APICalls/ASTD/recycling'
import { formValidate } from 'src/interfaces/common'
import { FormErrorMsg } from 'src/components/FormComponents/FormErrorMsg'
import { WeightUnit } from 'src/interfaces/weightUnit'

type AddProcessCompactorProps = {
  chkInIds: number[]
  inItemId: number[]
  onSubmit: () => void
}

const AddProcessCompactor: FunctionComponent<AddProcessCompactorProps> = ({
  chkInIds,
  inItemId,
  onSubmit
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { imgSettings, recycType, decimalVal, productType, getProductType } =
    useContainer(CommonTypeContainer)
  const [isShowForm, setShowForm] = useState<boolean>(false)
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'
  const colorTheme: string = getThemeColorRole(role) || '#79CA25'
  const customListTheme = getThemeCustomList(role) || '#E4F6DC'
  const [packagingList, setPackagingList] = useState<il_item[]>([])
  const [defaultRecyc, setDefaultRecyc] = useState<
    singleRecyclable | undefined
  >()
  const [defaultProduct, setDefaultProduct] = useState<
    singleProduct | undefined
  >()
  const [editedItem, setEditedItem] = useState<ProcessOutItem | null>(null)
  const [validation, setValidation] = useState<formValidate[]>([])

  //data
  const [processOutItem, setProcessOutItem] = useState<ProcessOutItem[]>([])
  const [selectedPackage, setSelectedPackage] = useState<string>('')
  const [isRecylingCategory, setRecycleCategory] = useState<boolean>(true) //true => recyling, false => product
  const [weight, setWeight] = useState<string>('0')
  const [selectedRecyc, setSelectedRecyc] = useState<
    singleRecyclable | undefined
  >(undefined)
  const [selectedProduct, setSelectedProduct] = useState<
    singleProduct | undefined
  >(undefined)
  const [pictures, setPictures] = useState<ImageListType>([])
  const [remark, setRemark] = useState<string>('')
  const [weightUnit, setWeightUnit] = useState<string>('')

  useEffect(() => {
    initPackagingUnit()
    getProductType()
    initWeightUnit()
  }, [i18n.language])

  useEffect(() => {
    initPackagingUnit()
    getProductType()
  }, [editedItem])

  const initPackagingUnit = async () => {
    try {
      const result = await getAllPackagingUnit(0, 1000)
      const data = result?.data.content
      if (data) {
        let packageUnit: il_item[] = []
        data?.forEach((item: PackagingUnit) => {
          var name =
            i18n.language === 'zhhk'
              ? item.packagingNameTchi
              : i18n.language === 'zhch'
              ? item.packagingNameSchi
              : item.packagingNameEng

          packageUnit.push({
            id: item.packagingTypeId,
            name: name
          })
        })
        setPackagingList(packageUnit)
        if (packageUnit.length > 0 && !editedItem)
          setSelectedPackage(packageUnit[0].id)
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const initWeightUnit = async () => {
    try {
      const result = await getWeightUnit(0, 1000)
      const data = result?.data

      const selectedUnit = data.find(
        (item: WeightUnit) => item.unitNameEng === 'kg'
      )
      setWeightUnit(selectedUnit ? selectedUnit.unitId : '')
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const onImageChange = (imageList: ImageListType) => {
    setPictures(imageList)
  }

  useEffect(() => {
    const validate = async () => {
      const tempV: formValidate[] = []

      if (isRecylingCategory) {
        selectedRecyc?.recycTypeId === '' &&
          tempV.push({
            field: t('jobOrder.main_category'),
            problem: formErr.empty,
            type: 'error'
          })

        const selectedRecy = recycType?.find(
          (src) => src.recycTypeId === selectedRecyc?.recycTypeId
        )
        if (selectedRecy) {
          if (
            selectedRecy.recycSubType.length > 0 &&
            selectedRecyc?.recycSubTypeId === ''
          ) {
            tempV.push({
              field: t('jobOrder.subcategory'),
              problem: formErr.empty,
              type: 'error'
            })
          }
        }
      } else {
        selectedProduct?.productTypeId === '' &&
          tempV.push({
            field: t('pick_up_order.product_type.product'),
            problem: formErr.empty,
            type: 'error'
          })

        const selectedProdItem = productType?.find(
          (src) => src.productTypeId === selectedProduct?.productSubTypeId
        )
        if (selectedProdItem) {
          if (
            selectedProdItem.productSubType!!.length > 0 &&
            selectedProduct?.productSubTypeId === ''
          ) {
            tempV.push({
              field: t('pick_up_order.product_type.subtype'),
              problem: formErr.empty,
              type: 'error'
            })
          }
        }
      }

      if (parseFloat(weight) <= 0)
        tempV.push({
          field: t('compactor.table.weight'),
          problem: formErr.empty,
          type: 'error'
        })

      if (pictures.length === 0)
        tempV.push({
          field: t('report.picture'),
          problem: formErr.empty,
          type: 'error'
        })

      setValidation(tempV)
    }
    validate()
  }, [weight, pictures, selectedProduct, selectedRecyc, i18n.language])

  const editItemCompactor = (item: ProcessOutItem) => {
    console.log('item', item)
    setEditedItem(item)
    const defRecyc: singleRecyclable = {
      recycTypeId: item.recycTypeId,
      recycSubTypeId: item.recycSubTypeId
    }

    const defProduct: singleProduct = {
      productTypeId: item.productTypeId,
      productSubTypeId: item.productSubTypeId,
      productAddonId: item.productAddonTypeId,
      productSubTypeRemark: item.productSubTypeRemark,
      productAddonTypeRemark: item.productAddonTypeRemark
    }
    //mapping edited item
    setSelectedPackage(item.packageTypeId)
    setRecycleCategory(item.recycTypeId != '' ? true : false)
    setDefaultRecyc(defRecyc)
    setSelectedRecyc(defRecyc)
    setDefaultProduct(defProduct)

    setWeight(item.weight.toString())

    const photoList: any = item.photos.map((url: string, index: number) => {
      return {
        data_url: url,
        file: {
          name: `image${index + 1}`,
          size: 0,
          type: 'image/jpeg'
        }
      }
    })
    setPictures(photoList)
  }

  const removeImage = (index: number) => {
    const newPictures = [...pictures]
    newPictures.splice(index, 1)
    setPictures(newPictures)
  }

  const resetForm = () => {
    setRecycleCategory(false)
    setSelectedProduct(undefined)
    setSelectedRecyc(undefined)
    setDefaultRecyc(undefined)
    setWeight('0')
    setPictures([])
    setEditedItem(null)
    setTrySubmited(false)
  }

  const addProcessItem = () => {
    if (validation.length !== 0) {
      setTrySubmited(true)
      return
    }

    const photosData = pictures.map((item) => item.data_url)

    const newItem: ProcessOutItem = {
      id: editedItem?.id || processOutItem.length + 1, // Use `editedItem.id` if editing, otherwise assign a new ID
      warehouseId: 0,
      recycTypeId: selectedRecyc?.recycTypeId ?? '',
      recycSubTypeId: selectedRecyc?.recycSubTypeId ?? '',
      productTypeId: selectedProduct?.productTypeId ?? '',
      productSubTypeId: selectedProduct?.productSubTypeId ?? '',
      productSubTypeRemark: selectedProduct?.productSubTypeRemark ?? '',
      productAddonTypeId: selectedProduct?.productAddonId ?? '',
      productAddonTypeRemark: selectedProduct?.productAddonTypeRemark ?? '',
      packageTypeId: selectedPackage,
      weight: parseInt(weight),
      unitId: weightUnit,
      photos: photosData
    }

    setProcessOutItem((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === newItem.id
      )

      if (existingIndex !== -1) {
        // Edit existing item
        const updatedItems = [...prevItems]
        updatedItems[existingIndex] = newItem
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, newItem]
      }
    })

    resetForm()
  }

  const removeProcessItem = (idx: number) => {
    const updatedItems = [...processOutItem]
    updatedItems.splice(idx, 1)
    setProcessOutItem(updatedItems)
  }

  const submitProcessOut = async () => {
    const formData: CompactorProcessOut = {
      chkInIds: chkInIds,
      inItemId: inItemId,
      items: processOutItem,
      createdBy: role,
      remarks: remark,
      processInDatetime: new Date().toISOString(),
      processOutDatetime: new Date().toISOString()
    }

    const result = await createCompactorProcessOut(formData)

    if (result) {
      showSuccessToast(t('common.saveSuccessfully'))
      setProcessOutItem([])
      resetForm()
      onSubmit()
    } else {
      showErrorToast(t('common.saveFailed'))
    }
  }

  return (
    <>
      <Box>
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              borderRight: '1px solid #D1D1D1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <div
                className="p-8 border-solid border-[1px] rounded-xl w-[300px] text-center cursor-pointer m-6
            "
                style={{ borderColor: colorTheme }}
                onClick={() => {
                  setShowForm(true)
                  resetForm()
                }}
              >
                <ADD_CIRCLE_FILL_ICON_
                  sx={{ color: colorTheme, fontSize: '30px' }}
                />
                <div className="text-base text-[#535353] font-bold">
                  {t('compactor.new')}
                </div>
              </div>
              <Box sx={{ height: '600px', overflowY: 'auto' }}>
                {processOutItem.map((item, idx) => (
                  <div
                    key={item.id + idx}
                    className="flex justify-between px-8 py-4 border-[#D1D1D1] border-solid border-[1px] rounded-xl w-[300px] text-center cursor-pointer m-6"
                  >
                    <div className="recyle-type flex items-center gap-2">
                      <div className="category" style={categoryRecyle}>
                        {packagingList
                          ?.find((it) => item.packageTypeId === it.id)
                          ?.name.charAt(0)
                          .toUpperCase() || '-'}
                      </div>
                      <div className="type-item text-justify">
                        <div className="type text-mini text-[#ACACAC] font-normal tracking-widest mb-2">
                          {item.recycTypeId
                            ? mappingRecy(item.recycTypeId, recycType)
                            : mappingProductType(
                                item.productTypeId,
                                productType
                              )}
                        </div>
                        <div className="sub-type text-xs text-black font-bold tracking-widest mb-2">
                          {item.recycSubTypeId != ''
                            ? mappingSubRecy(
                                item.recycTypeId,
                                item.recycSubTypeId,
                                recycType
                              )
                            : mappingSubProductType(
                                item.productTypeId,
                                item.productSubTypeId,
                                productType
                              )}
                        </div>
                        <div className="type text-mini text-[#ACACAC] font-normal tracking-widest">
                          {item.productAddonTypeId != '' &&
                            mappingAddonsType(
                              item.productTypeId,
                              item.productSubTypeId,
                              item.productAddonTypeId,
                              productType
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="right action flex items-center gap-2">
                      <div className="weight font-bold font-base">
                        {item.weight}
                        {'kg'}
                      </div>
                      <Box>
                        <DriveFileRenameOutlineOutlinedIcon
                          onClick={() => {
                            editItemCompactor(item)
                          }}
                          fontSize="small"
                          className="text-gray cursor-pointer"
                        />
                        <DELETE_OUTLINED_ICON
                          onClick={() => {
                            removeProcessItem(idx)
                          }}
                          fontSize="small"
                          className="text-gray cursor-pointer"
                        ></DELETE_OUTLINED_ICON>
                      </Box>
                    </div>
                  </div>
                ))}
              </Box>
            </Box>
            {processOutItem.length > 0 && (
              <Box sx={{ padding: 4 }}>
                <CustomField label={t('common.remark')}>
                  <CustomTextField
                    id="monetary"
                    sx={{ width: '100%' }}
                    value={remark}
                    placeholder={t('packaging_unit.remark_placeholder')}
                    onChange={(event) => setRemark(event.target.value)}
                  />
                </CustomField>
              </Box>
            )}
          </Box>
          {!isShowForm ? (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div className="text-[#ACACAC] text-[18px]">
                {t('compactor.clickToAddItem')}
              </div>
            </Box>
          ) : (
            <Box sx={{ margin: '24px', width: '100%' }}>
              <Grid
                container
                direction={'column'}
                spacing={4}
                sx={{ width: '100%' }}
              >
                <Grid item>
                  <Typography sx={{ ...styles.header3, marginBottom: 1 }}>
                    {t('packaging_unit.packaging_unit')}
                  </Typography>
                  <FormControl
                    sx={{
                      width: '30%'
                    }}
                  >
                    <Select
                      labelId="packageList"
                      id="packageList"
                      value={selectedPackage}
                      sx={{
                        borderRadius: '12px'
                      }}
                      onChange={(event: SelectChangeEvent<string>) => {
                        const selectedValue = packagingList.find(
                          (item) => item.id === event.target.value
                        )
                        if (selectedValue) {
                          setSelectedPackage(selectedValue.id)
                        }
                      }}
                    >
                      {!packagingList ? (
                        <MenuItem disabled value="">
                          <em>{t('common.noOptions')}</em>
                        </MenuItem>
                      ) : (
                        packagingList.map((item, index) => (
                          <MenuItem key={index} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <CustomField
                    label={t('pick_up_order.recyclForm.item_category')}
                  >
                    <Switcher
                      onText={t('recyclables')}
                      offText={t('product')}
                      defaultValue={isRecylingCategory}
                      setState={(newValue) => {
                        setRecycleCategory(newValue)
                        setSelectedProduct(undefined)
                        setSelectedRecyc(undefined)
                      }}
                    />
                  </CustomField>
                </Grid>
                {isRecylingCategory ? (
                  <CustomField label={t('col.recycType')} mandatory>
                    <RecyclablesListSingleSelect
                      showError={
                        isRecylingCategory &&
                        selectedRecyc?.recycTypeId != '' &&
                        trySubmited
                      }
                      recycL={recycType ?? []}
                      setState={(values) => {
                        setSelectedRecyc(values)
                      }}
                      itemColor={{
                        bgColor: customListTheme
                          ? customListTheme.bgColor
                          : '#E4F6DC',
                        borderColor: customListTheme
                          ? customListTheme.border
                          : '79CA25'
                      }}
                      defaultRecycL={defaultRecyc}
                    />
                  </CustomField>
                ) : (
                  <CustomField
                    label={t('pick_up_order.product_type.product')}
                    mandatory
                  >
                    <ProductListSingleSelect
                      showError={
                        !isRecylingCategory &&
                        selectedProduct?.productTypeId != '' &&
                        trySubmited
                      }
                      label={t('pick_up_order.product_type.product')}
                      options={productType ?? []}
                      setState={(values) => {
                        setSelectedProduct(values)
                      }}
                      itemColor={{
                        bgColor: customListTheme
                          ? customListTheme.bgColor
                          : '#E4F6DC',
                        borderColor: customListTheme
                          ? customListTheme.border
                          : '79CA25'
                      }}
                      defaultProduct={defaultProduct}
                    />
                  </CustomField>
                )}
                <Grid item>
                  <CustomField label={t('compactor.table.weight')} mandatory>
                    <CustomTextField
                      id="weight"
                      placeholder={t('userAccount.pleaseEnterNumber')}
                      onChange={(event) => {
                        onChangeWeight(
                          event.target.value,
                          decimalVal,
                          (value: string) => {
                            setWeight(value)
                          }
                        )
                      }}
                      onBlur={(event) => {
                        const value = formatWeight(
                          event.target.value,
                          decimalVal
                        )
                        setWeight(value)
                      }}
                      error={parseFloat(weight) <= 0 && trySubmited}
                      value={weight}
                      sx={{ width: '100%' }}
                      endAdornment={
                        <InputAdornment position="end">kg</InputAdornment>
                      }
                    ></CustomTextField>
                  </CustomField>
                </Grid>
                <Grid item>
                  <Box key={t('report.picture')}>
                    <ImageUploading
                      multiple
                      value={pictures}
                      onChange={(imageList, addUpdateIndex) =>
                        onImageChange(imageList)
                      }
                      maxNumber={imgSettings?.ImgQuantity}
                      maxFileSize={imgSettings?.ImgSize}
                      dataURLKey="data_url"
                      acceptType={['jpg', 'jpeg', 'png']}
                    >
                      {({
                        imageList,
                        onImageUpload,
                        onImageRemove,
                        errors
                      }) => (
                        <Box className="box">
                          <Card
                            sx={{
                              ...localstyles.cardImg,
                              ...(trySubmited &&
                                imageList.length === 0 &&
                                localstyles.imgError)
                            }}
                          >
                            <ButtonBase
                              sx={localstyles.btnBase}
                              onClick={(event) => onImageUpload()}
                            >
                              <CAMERA_OUTLINE_ICON
                                style={{ color: '#ACACAC' }}
                              />
                              <Typography
                                sx={[styles.labelField, { fontWeight: 'bold' }]}
                              >
                                {t('report.uploadPictures')}
                              </Typography>
                            </ButtonBase>
                          </Card>
                          <ImageList sx={localstyles.imagesContainer} cols={6}>
                            {imageList.map((image, index) => (
                              <ImageListItem
                                key={image['file']?.name}
                                style={{ position: 'relative', width: '100px' }}
                              >
                                <img
                                  style={localstyles.image}
                                  src={image['data_url']}
                                  alt={image['file']?.name}
                                  loading="lazy"
                                />
                                <ButtonBase
                                  onClick={(event) => {
                                    onImageRemove(index)
                                    removeImage(index)
                                  }}
                                  style={{
                                    position: 'absolute',
                                    top: '2px',
                                    right: '2px',
                                    padding: '4px'
                                  }}
                                >
                                  <CancelRoundedIcon className="text-white" />
                                </ButtonBase>
                              </ImageListItem>
                            ))}
                          </ImageList>
                        </Box>
                      )}
                    </ImageUploading>
                  </Box>
                </Grid>
                <Grid item>
                  <Button
                    sx={{ ...styles.buttonFilledGreen, width: '200px' }}
                    disabled={
                      (isRecylingCategory &&
                        selectedRecyc?.recycTypeId === '') ||
                      (!isRecylingCategory &&
                        selectedProduct?.productTypeId === '')
                    }
                    onClick={() => addProcessItem()}
                  >
                    {t('pick_up_order.finish')}
                  </Button>
                </Grid>
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
              </Grid>
            </Box>
          )}
        </Box>
        <Divider></Divider>
        <Box sx={{ padding: 4 }}>
          <Button
            sx={{ ...styles.buttonFilledGreen, width: '100%' }}
            disabled={processOutItem.length === 0}
            onClick={submitProcessOut}
          >
            {t('common.submit')}
          </Button>
        </Box>
      </Box>
    </>
  )
}

const localstyles = {
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

const categoryRecyle: React.CSSProperties = {
  height: '25px',
  width: '25px',
  padding: '4px',
  textAlign: 'center',
  background: 'lightskyblue',
  lineHeight: '25px',
  borderRadius: '25px',
  color: 'darkblue'
}

export default AddProcessCompactor
