import {
  Box,
  Card,
  Grid,
  Divider,
  Typography,
  InputAdornment,
  ButtonBase,
  ImageList,
  ImageListItem,
  Select,
  SelectChangeEvent,
  MenuItem,
} from '@mui/material'
import { FunctionComponent, useEffect, useState } from 'react'
import { styles } from '../../../constants/styles'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { CAMERA_OUTLINE_ICON } from '../../../themes/icons'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import RecyclablesListSingleSelect from '../../../components/SpecializeComponents/RecyclablesListSingleSelect'
import { useTranslation } from 'react-i18next'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import { formErr } from '../../../constants/constant'
import { ImageToBase64, formatWeight, getThemeColorRole, getThemeCustomList, onChangeWeight, returnErrorMsg } from '../../../utils/utils'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate, weightUnit } from '../../../interfaces/common'
import { generateNumericId } from '../../../utils/uuidgenerator'
import { singleRecyclable } from '../../../interfaces/collectionPoint'
import { processOutImage, ProcessOut } from '../../../interfaces/processRecords'
import { localStorgeKeyName } from '../../../constants/constant'
import ProductListSingleSelect, { singleProduct } from 'src/components/SpecializeComponents/ProductListSingleSelect'
import Switcher from 'src/components/FormComponents/CustomSwitch'
import useModalConfirmRemarksEmpty from "src/components/ModalConfirmRemarksEmpty";

type createRecyclable = {
  itemId: number
  itemType: 'GENERAL' | 'LEFTOVER' | 'WASTE' | string
  recycTypeId: string
  recycSubTypeId: string
  productTypeId: string,
  productSubTypeId: string,
  productSubTypeRemark: string,
  productAddonTypeId: string,
  productAddonTypeRemark: string,
  packageTypeId: string
  weight: number
  unitId: string
  status: string
  processoutDetailPhoto: processOutImage[]
  createdBy: string
  updatedBy: string
  version: number
}

type RecycItem = {  
  itemId: number
  itemType: 'GENERAL' | 'LEFTOVER' | 'WASTE' | string
  processOutDtlId?: number
  processInDtlId?: number
  recycType: il_item
  recycSubtype: il_item
  productType: il_item
  productSubtype : il_item
  productSubtypeRemark: string
  productAddonId :il_item
  productAddonRemark: string
  weight: number
  images?: string[]
  unitId?: string
  status?: string
  packageTypeId: string
  version: number
}
interface EditProcessRecordProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  onCreateRecycle: (data: createRecyclable) => void
  onEditRecycle: (data: createRecyclable, processOutDtlId: number ) => void
  onDeleteItem: (version: number, itemId: number) => void
  editedData: RecycItem | null
  processOut?: ProcessOut | null
  action: 'none' | 'add' | 'edit' | 'delete' | undefined
  weightUnits: weightUnit[]
}

const EditRecyclableForm: FunctionComponent<EditProcessRecordProps> = ({
  drawerOpen,
  handleDrawerClose,
  onCreateRecycle,
  onEditRecycle,
  onDeleteItem,
  editedData,
  processOut,
  action,
  weightUnits
}) => {
  const { t } = useTranslation()
  const [weight, setWeight] = useState<string>('0')
  const [recycTypeId, setRecycTypeId] = useState('')
  const [recycSubTypeId, setRecycSubTypeId] = useState('')
  const [defaultRecyc, setDefaultRecyc] = useState<singleRecyclable>()
  const [defaultProduct, setDefaultProduct] = useState<singleProduct>()
  const {recycType, productType, imgSettings, decimalVal } = useContainer(CommonTypeContainer)
  const [pictures, setPictures] = useState<ImageListType>([])
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const [selectedWeightId, setSelectedWeightId] = useState<string>('')
  const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
  const [isRecyc, setIsRecyc] = useState<boolean>(true);
  const [productTypeId, setProductTypeId] = useState('');
  const [productSubTypeId, setProductSubTypeId] = useState('');
  const [productAddon, setProductAddon] = useState('');
  const [productSubtypeRemark, setProductSubtypeRemark] = useState('');
  const [productAddonRemark, setProductAddonRemark] = useState('');
  const [selectedLeftOver, setSelectedLeftOver] = useState('')


  const {
    resetModal,
    openConfirmModal,
    setOpenConfirmModal,
    validateRemarks,
    ModalConfirmRemarksEmpty,
  } = useModalConfirmRemarksEmpty({
    onConfirm: () => {
      handleSaveData()
    },
  });

  const role =
  localStorage.getItem(localStorgeKeyName.role) || "collectoradmin";
  const colorTheme: string = getThemeColorRole(role) || "#79CA25";
  const customListTheme = getThemeCustomList(role) || "#E4F6DC";

  useEffect(() => {
    setTrySubmited(false)
    resetData()
  }, [editedData, action])

  const resetData = () => {
    setWeight('0')
    setDefaultRecyc(undefined)
    setPictures([])
    resetModal()
  }

  useEffect(() => {
    if (editedData != null) {
      //mapping edited data
      const defRecyc: singleRecyclable = {
        recycTypeId: editedData.recycType.id || '',
        recycSubTypeId: editedData.recycSubtype.id || ''
      }

      const defProduct: singleProduct = {
        productTypeId: editedData.productType.id,
        productSubTypeId: editedData.productSubtype?.id || '',
        productSubTypeRemark: editedData.productSubtypeRemark||'',
        productAddonId: editedData.productAddonId?.id ||'',  
        productAddonTypeRemark: productAddonRemark || '',
        isProductAddonTypeOthers: false
      }

      setDefaultRecyc(defRecyc)
      setDefaultProduct(defProduct)
      setIsRecyc(Boolean(editedData.recycType?.id))
      setWeight(formatWeight(editedData.weight.toString(), decimalVal))
      const initialItemType = editedData.itemType || "GENERAL";
      setSelectedLeftOver(initialItemType);
      
      const imageList: any = editedData?.images?.map(
        (url: string, index: number) => {
          return {
            data_url: url, //url already imge bsae64
            file: {
              name: `image${index + 1}`,
              size: 0,
              type: 'image/jpeg'
            }
          }
        }
        )
        setPictures(imageList)
        setSelectedWeightId(editedData.unitId ?? '12')
      } else {
      setDefaultRecyc(undefined)
    }
  }, [action, drawerOpen])

  useEffect(() => {
    const validate = async () => {
      //do validation here
      const tempV: formValidate[] = []
      // recycTypeId === '' || productTypeId === '' &&
      //   tempV.push({
      //     field: t('col.recycType'),
      //     problem: formErr.empty,
      //     type: 'error'
      //   })
      if (isRecyc) {
        const matchingRecycType = recycType?.find(
          (recyc) => recycTypeId === recyc.recycTypeId
        );
  
        if (!recycTypeId) {
          tempV.push({
            field: t("pick_up_order.error.recycType"),
            problem: formErr.empty,
            type: "error",
          });
        }
        if (matchingRecycType) {
          // Check if Recycle Type requires a Subtype
          const hasSubType = matchingRecycType.recycSubType && matchingRecycType.recycSubType.length > 0;
          
  
          if (hasSubType && !recycSubTypeId) {
            tempV.push({
              field: t("pick_up_order.error.recycSubType"),
              problem: formErr.empty,
              type: "error",
            });
          }
        }
      } 
      // Check for Products
      else {
        const matchingProductType = productType?.find(
          (product) => product.productTypeId === productTypeId
        );
  
        if (!productTypeId) {
          tempV.push({
            field: t("pick_up_order.error.productType"),
            problem: formErr.empty,
            type: "error",
          });
        }
        if (matchingProductType) {
          // Check Product Subtype
          const hasSubType = matchingProductType.productSubType && matchingProductType.productSubType.length > 0;
          
  
          if (hasSubType && !productSubTypeId) {
            tempV.push({
              field: t("pick_up_order.error.productSubType"),
              problem: formErr.empty,
              type: "error",
            });
          }
  
          // Check Product Addon
          if (productSubTypeId) {
            const matchProductSubType = matchingProductType.productSubType?.find(
              (subtype) => subtype.productSubTypeId === productSubTypeId
            );
  
            const hasAddonType = matchProductSubType?.productAddonType && 
                                  matchProductSubType.productAddonType.length > 0;
  
            // If addon types exist and remark is entered, addon must be selected
            if (hasAddonType && !productAddon) {
              tempV.push({
                field: t("pick_up_order.error.productAddon"),
                problem: formErr.empty,
                type: "error",
              });
            }
          }
        }
      }
      weight === '0' &&
        tempV.push({
          field: t('pick_up_order.recyclForm.weight'),
          problem: formErr.empty,
          type: 'error'
        })
      pictures.length == 0 &&
        tempV.push({
          field: t('vehicle.picture'),
          problem: formErr.empty,
          type: 'error'
        })
      setValidation(tempV)
    }

    validate()
  }, [recycTypeId, recycSubTypeId, productTypeId, productSubTypeId, productSubtypeRemark, productAddon, productAddonRemark ,weight, pictures, isRecyc])

  const onSaveData = () => {
    const isRemarksValid = validateRemarks({
      openConfirmModal,
      values: {
        productSubTypeRemark: productSubtypeRemark,
        productAddonTypeRemark: productAddonRemark,
      },
    });

    if (!isRemarksValid) {
      setOpenConfirmModal({
        isOpen: true,
        tempData: {
          ...openConfirmModal.tempData,
          isConfirmed: false,
        },
      });
    } else {
      handleSaveData();
    }
  };

  const handleSaveData = () => {
    const imgItems: processOutImage[] = ImageToBase64(pictures).map(
      (item, idx) => ({
        sid: idx,
        photo: item
      })
    );

    const data: createRecyclable = {
      itemId: editedData ? editedData.processOutDtlId! || editedData.processInDtlId! : generateNumericId(),
      itemType: selectedLeftOver || 'GENERAL',
      recycTypeId: recycTypeId,
      recycSubTypeId: recycSubTypeId,
      productTypeId: productTypeId,
      productSubTypeId: productSubTypeId,
      productSubTypeRemark: productSubtypeRemark,
      productAddonTypeId: productAddon,
      productAddonTypeRemark: productAddonRemark,
      packageTypeId: '',
      weight: parseFloat(weight),
      unitId: selectedWeightId,
      status: "ACTIVE",
      processoutDetailPhoto: imgItems,
      createdBy: loginId,
      updatedBy: loginId,
      version: editedData?.version ?? 0
    };

    if (validation.length === 0) {
      action == 'add' ? 
        onCreateRecycle(data) : onEditRecycle(data, editedData?.processOutDtlId || editedData?.processInDtlId!);
      resetData();
      handleDrawerClose();
    } else {
      setTrySubmited(true);
    }
  };


  // const onSaveData = () => {
  //   const isRemarksConfirmed = validateRemarks({
  //     openConfirmModal,
  //     values: {
  //       productSubTypeRemark: productSubtypeRemark,
  //       productAddonTypeRemark: productAddonRemark,
  //     },
  //   });

  //   setOpenConfirmModal({
  //     ...openConfirmModal,
  //     isOpen: true,
  //   });
  //   if (!isRemarksConfirmed) {
  //     return;
  //   } else {
  //     resetModal();
  //   }
    
  //   const imgItems: processOutImage[] = ImageToBase64(pictures).map(
  //     (item, idx) => {
  //       return {
  //         sid: idx,
  //         photo: item
  //       }
  //     }
  //   )

  //   const data: createRecyclable = {
  //     itemId: editedData ? editedData.processOutDtlId : generateNumericId(),
  //     recycTypeId: recycTypeId,
  //     recycSubTypeId: recycSubTypeId,
  //     productTypeId: productTypeId,
  //     productSubTypeId: productSubTypeId,
  //     productSubTypeRemark: productSubtypeRemark,
  //     productAddonTypeId: productAddon,
  //     productAddonTypeRemark: productAddonRemark,
  //     packageTypeId: '',
  //     weight: parseFloat(weight),
  //     unitId: selectedWeightId,
  //     status: "ACTIVE",
  //     processoutDetailPhoto: imgItems,
  //     createdBy: loginId,
  //     updatedBy: loginId,
  //     version: editedData?.version ?? 0
  //   }

  //   if (validation.length === 0) {

  //     action == 'add' ? 
  //     onCreateRecycle(data) : onEditRecycle(data, editedData!!.processOutDtlId)
  //     resetData()
  //     handleDrawerClose()
  //   } else {
  //     setTrySubmited(true)
  //   }
  // }

  const onHandleDelete = () => {
    if (editedData != null) {
      onDeleteItem(editedData?.version ?? 0, editedData.processOutDtlId || editedData.processInDtlId!)
      resetData()
      handleDrawerClose()
    }
  }

  const onImageChange = (imageList: ImageListType) => {
    setPictures(imageList)
  }

  const removeImage = (index: number) => {
    const newPictures = [...pictures]
    newPictures.splice(index, 1)
    setPictures(newPictures)
  }

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  const handleRecycChange = (values: any) => {
    setOpenConfirmModal({
      ...openConfirmModal,
      tempData: {
        ...openConfirmModal.tempData,
        isProductSubTypeOthers: false,
        isProductAddonTypeOthers: false
      }
    })
    if(values && values.recycTypeId){
        const newDefaultRecyc: singleRecyclable = {
          recycTypeId: values.recycTypeId,
          recycSubTypeId: values.recycSubTypeId,
        };
        
        setRecycTypeId(values.recycTypeId);
        setDefaultProduct(undefined);
        setProductAddon('')
        setProductSubTypeId('')
        setProductTypeId('');
        setProductAddonRemark('');
        setProductSubtypeRemark('')
        setRecycSubTypeId(values.recycSubTypeId);
    
        setDefaultRecyc(newDefaultRecyc);
      } else if (values === undefined){
        setRecycTypeId('')
        setRecycTypeId('')
        setDefaultRecyc(undefined)
      }
      
    };

  const handleProductChange = (values: any) => {
    console.log('Product Change Values:', values);
    if (values && values.productTypeId) {
      console.log('Product Addon Remark:', values.productAddOnTypeRemark);
      console.log('Product Addon ID:', values.productAddonId);
        const newDefaultProduct: singleProduct = {
            productTypeId: values.productTypeId || '',
            productSubTypeId: values.productSubTypeId || '',
            productAddonId: values.productAddonId || '',
            productAddonTypeRemark: values.productAddonTypeRemark || '',
            productSubTypeRemark:  values.productSubTypeRemark || '',
            isProductAddonTypeOthers: false,
        };
        setDefaultProduct(newDefaultProduct);
        setProductTypeId(values.productTypeId);
        setProductAddonRemark(values.productAddonTypeRemark);
        setProductSubtypeRemark(values.productSubTypeRemark)
        setRecycTypeId('')
        setRecycSubTypeId('')
        setOpenConfirmModal({
          ...openConfirmModal,
          tempData: {
            ...openConfirmModal.tempData,
            isProductSubTypeOthers: Boolean(
              values?.isProductSubTypeOthers
            ),
            isProductAddonTypeOthers: Boolean(
              values?.isProductAddonTypeOthers
            ),
          },
        });
        console.log(openConfirmModal)
        
        setProductSubTypeId(values.productSubTypeId);
        setProductAddon(values.productAddonId);

      } else if(values === undefined){
      setDefaultProduct(undefined);
        setProductAddon('')
        setProductSubTypeId('')
        setProductTypeId('');
        setProductAddonRemark('');
        setProductSubtypeRemark('')
        setOpenConfirmModal({
          ...openConfirmModal,
          tempData: {
            ...openConfirmModal.tempData,
            isProductSubTypeOthers: false,
            isProductAddonTypeOthers: false
          }
        })
    }
  };


  return (
    <>
      <div className="detail-inventory">
        <RightOverlayForm
          open={drawerOpen}
          onClose={handleDrawerClose}
          anchor={'right'}
          action={action}
          headerProps={{
            title: t('processRecord.processingRecords'),
            subTitle: processOut?.labelId ? processOut?.labelId.toString() : '',
            onSubmit: onSaveData,
            onDelete: onHandleDelete,
            onCloseHeader: handleDrawerClose,
            submitText: t('col.save'),
            cancelText: t('add_warehouse_page.delete'),
            statusLabel: processOut?.status
          }}
        >
          <Divider />
          <Box sx={{ PaddingX: 2 }}>
            <Grid
              container
              direction={'column'}
              spacing={4}
              sx={{
                width: { xs: '100%' },
                marginTop: { sm: 2, xs: 2 },
                marginLeft: {
                  xs: 0
                },
                paddingRight: 2
              }}
              className="sm:ml-0 mt-o w-full"
            >
              <Grid item>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={handleDrawerClose}
                >
                  <ArrowBackIosIcon
                    sx={{ fontSize: 16, marginX: 0.5 }}
                    className="text-gray"
                  />
                  <Typography sx={styles.header2}>
                    {t('processRecord.create.modifyRecycl')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <CustomField label={t('processRecord.create.recycNum')}>
                  <Typography sx={localStyle.textField}>
                    {processOut?.labelId ? processOut?.labelId : processOut?.processOutId}
                  </Typography>
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={t('pick_up_order.recyclForm.item_category')}>
                    <Switcher
                        onText={t('recyclables')}
                        offText={t('product')}
                        defaultValue={isRecyc}
                        setState={(newValue: boolean) => {
                            setIsRecyc(newValue);
                            if(newValue){
                              handleRecycChange(undefined)
                            } else {
                              handleProductChange(undefined)
                            }
                        }}
                    />
                </CustomField>
            </Grid>

              <Grid item>
                {isRecyc ? (
                  <CustomField label={t('col.recycType')} mandatory>
                      <RecyclablesListSingleSelect
                          showError={undefined} 
                          recycL={recycType ?? []}
                          setState={(values) => handleRecycChange(values)}
                          itemColor={{
                          bgColor: customListTheme ? customListTheme.bgColor : '#E4F6DC',
                          borderColor: customListTheme ? customListTheme.border : '79CA25'
                          }}
                          defaultRecycL={defaultRecyc}
                          key={recycSubTypeId}
                      />
                      </CustomField>
                  ) : (
                      <CustomField label={t('pick_up_order.product_type.product')} mandatory>
                      <ProductListSingleSelect
                          showError={undefined} 
                          label={t('pick_up_order.product_type.product')}
                          options={productType ?? []}
                          setState={(values) => handleProductChange(values)}
                          itemColor={{
                          bgColor: customListTheme ? customListTheme.bgColor : '#E4F6DC',
                          borderColor: customListTheme ? customListTheme.border : '79CA25'
                          }}
                          defaultProduct={defaultProduct}
                          key={productTypeId}
                      />
                      </CustomField>
                  )}
              </Grid>
              <Grid item>
                <CustomField label={t('inventory.leftOverTitle')}>
                  <Select
                    labelId="selectedLeftOver"
                    disabled={action === 'delete'}
                    id="selectedLeftOver"
                    value={selectedLeftOver}
                    sx={{
                      borderRadius: '12px',
                      width: '30%'
                    }}
                    onChange={(event) => {
                        setSelectedLeftOver(event.target.value)
                    }}
                  >       
                      <MenuItem value={"LEFTOVER"}>
                        <em>{t('inventory.leftOver')}</em>                      
                      </MenuItem>                
                      <MenuItem value={"WASTE"}>
                        <em>{t('inventory.waste')}</em>
                      </MenuItem>
                  </Select>
                </CustomField>
              </Grid>
              <CustomField label={t('pick_up_order.recyclForm.weight')}>
                <CustomTextField
                  id="weight"
                  placeholder="請輸入重量"
                  onChange={(event) => onChangeWeight(event.target.value, decimalVal, setWeight)}
                  onBlur={(event) => {
                    const value = formatWeight(event.target.value, decimalVal)
                    setWeight(value)
                  }}
                  value={weight}
                  sx={{ width: '70%' }}
                  disabled={action === 'delete'}
                  error={weight === '0' && trySubmited}
                ></CustomTextField>
                <Select
                  labelId="selectedWeight"
                  disabled={action === 'delete'}
                  id="selectedWeight"
                  value={selectedWeightId}
                  sx={{
                    borderRadius: '12px',
                    width: '30%'
                  }}
                  onChange={(event) => {
                    const selectedValue = weightUnits.find(
                      (item: weightUnit) => item.unitId.toString() == event.target.value
                    )
                    if (selectedValue) {
                      setSelectedWeightId(selectedValue.unitId.toString())
                    }
                  }}
                >
                  {weightUnits.length > 0? (weightUnits.map((item: weightUnit, index: number) => (
                    <MenuItem key={index} value={item.unitId}>
                      {item.unitNameEng}
                    </MenuItem>
                  ))) : (
                    <MenuItem disabled value="">
                      <em>{t('common.noOptions')}</em>
                    </MenuItem>
                  )}
                </Select>
              </CustomField>
              <Grid item>
                {/* image field */}
                <Box key={t('report.picture')}>
                  <ImageUploading
                    multiple
                    value={pictures}
                    onChange={(imageList) => onImageChange(imageList)}
                    maxNumber={imgSettings?.ImgQuantity}
                    maxFileSize={imgSettings?.ImgSize}
                    dataURLKey="data_url"
                    acceptType={['jpg', 'jpeg', 'png']}
                  >
                    {({ imageList, onImageUpload, onImageRemove }) => (
                      <Box className="box">
                        <Card
                          sx={{
                            ...localStyle.cardImg,
                            ...(trySubmited &&
                              imageList.length === 0 &&
                              localStyle.imgError)
                          }}
                        >
                          <ButtonBase
                            sx={localStyle.btnBase}
                            onClick={(event) => onImageUpload()}
                            disabled={action === 'delete'}
                          >
                            <CAMERA_OUTLINE_ICON style={{ color: '#ACACAC' }} />
                            <Typography
                              sx={[styles.labelField, { fontWeight: 'bold' }]}
                            >
                              {t('report.uploadPictures')}
                            </Typography>
                          </ButtonBase>
                        </Card>
                        <ImageList sx={localStyle.imagesContainer} cols={4}>
                          {imageList.map((image, index) => (
                            <ImageListItem
                              key={image['file']?.name}
                              style={{ position: 'relative', width: '100px' }}
                            >
                              <img
                                style={localStyle.image}
                                src={image['data_url']}
                                alt={image['file']?.name}
                                loading="lazy"
                              />
                              <ButtonBase
                                onClick={(event) => {
                                  onImageRemove(index)
                                  removeImage(index)
                                }}
                                disabled={action === 'delete'}
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
              {/* error msg */}
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
          <ModalConfirmRemarksEmpty />  
        </RightOverlayForm>
      </div>
    </>
  )
}

let localStyle = {
  textField: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  card: {
    borderColor: 'ACACAC',
    borderRadius: '10px',
    padding: 2,
    borderWidth: '1px',
    borderStyle: 'solid'
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
export default EditRecyclableForm
