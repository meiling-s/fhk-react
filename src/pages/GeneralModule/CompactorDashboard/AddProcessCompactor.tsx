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

import { onChangeWeight, formatWeight } from '../../../utils/utils'

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

type processInOutItem = {
  id: number
  package: string
  categorytype: string
  recycTypeId: string
  recycSubTypeId: string
  weight: string
  image: ImageListType
}

const AddProcessCompactor: FunctionComponent = () => {
  const { t } = useTranslation()
  const { imgSettings, recycType, decimalVal } =
    useContainer(CommonTypeContainer)
  const [isShowForm, setShowForm] = useState<boolean>(false)
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [defaultRecyc, setDefaultRecyc] = useState<singleRecyclable>()

  //data
  const [itemProcessing, setItemProcessing] = useState<processInOutItem[]>([])
  const [selectedPackage, setSelectedPackage] = useState<string>('1')
  const [isRecylingCategory, setRecycleCategory] = useState<boolean>(true)
  const [weight, setWeight] = useState<string>('0')
  const [recycTypeId, setRecycTypeId] = useState('')
  const [recycSubTypeId, setRecycSubTypeId] = useState('')
  const [pictures, setPictures] = useState<ImageListType>([])

  const packageList = [
    {
      id: '1',
      label: 'package 1'
    },
    {
      id: '2',
      label: 'package 2'
    }
  ]
  const onImageChange = (imageList: ImageListType) => {
    setPictures(imageList)
  }

  const removeImage = (index: number) => {
    const newPictures = [...pictures]
    newPictures.splice(index, 1)
    setPictures(newPictures)
  }

  const addProcessItem = () => {
    let idx = itemProcessing.length + 1
    const newItem: processInOutItem = {
      id: idx,
      package: selectedPackage,
      categorytype: isRecylingCategory.toString(),
      recycTypeId: recycTypeId,
      recycSubTypeId: recycSubTypeId,
      weight: weight,
      image: pictures
    }
    setItemProcessing((prevItems) => [...prevItems, newItem])
    console.log('additem', itemProcessing)
  }

  const removeProcessItem = (idx: number) => {
    const updatedItems = [...itemProcessing]
    updatedItems.splice(idx, 1)
    setItemProcessing(updatedItems)
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
                className="p-8 border-[#AFE397] border-solid border-[1px] rounded-xl w-[300px] text-center cursor-pointer m-6
            "
                onClick={() => setShowForm(true)}
              >
                <ADD_CIRCLE_FILL_ICON_
                  sx={{ color: '#7FC738', fontSize: '30px' }}
                />
                <div className="text-base text-[#535353] font-bold">
                  {t('general_settings.new')}
                </div>
              </div>
              <Box sx={{ height: '600px', overflowY: 'auto' }}>
                {itemProcessing.map((item, idx) => (
                  <div
                    key={item.id + idx}
                    className="flex justify-between px-8 py-4 border-[#D1D1D1] border-solid border-[1px] rounded-xl w-[300px] text-center cursor-pointer m-6"
                  >
                    <div className="recyle-type flex items-center gap-2">
                      <div className="category" style={categoryRecyle}>
                        {item.recycTypeId.charAt(0)}
                      </div>
                      <div className="type-item text-justify">
                        <div className="type text-mini text-[#ACACAC] font-normal tracking-widest mb-2">
                          {/* {item.recycTypeId} */}回收物
                        </div>
                        <div className="sub-type text-xs text-black font-bold tracking-widest mb-2">
                          {/* {item.recycSubTypeId} */}報紙
                        </div>
                        <div className="type text-mini text-[#ACACAC] font-normal tracking-widest">
                          {/* {item.package} */}廢紙
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
                            // setSelectedItem(item)
                            // setDrawerRecyclable(true)
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
            {itemProcessing.length > 0 && (
              <Box sx={{ padding: 4 }}>
                <CustomField label={t('common.remark')}>
                  <CustomTextField
                    id="monetary"
                    sx={{ width: '100%' }}
                    value={''}
                    placeholder={t('packaging_unit.remark_placeholder')}
                    onChange={() => setWeight('0')}
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
              <Grid container direction={'column'} spacing={4}>
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
                        const selectedValue = packageList.find(
                          (item) => item.id === event.target.value
                        )
                        if (selectedValue) {
                          setSelectedPackage(selectedValue.id)
                        }
                      }}
                    >
                      {!packageList ? (
                        <MenuItem disabled value="">
                          <em>{t('common.noOptions')}</em>
                        </MenuItem>
                      ) : (
                        packageList.map((item, index) => (
                          <MenuItem key={index} value={item.id}>
                            {item.label}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <CustomField label={t('compactor.table.itemCategory')}>
                    <Switcher
                      onText={t('add_warehouse_page.yes')}
                      offText={t('add_warehouse_page.no')}
                      defaultValue={isRecylingCategory}
                      setState={(newValue) => {
                        setRecycleCategory(newValue)
                      }}
                    />
                  </CustomField>
                </Grid>
                <Grid item>
                  <CustomField label={t('compactor.table.weight')}>
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
                      value={weight}
                      sx={{ width: '100%' }}
                      endAdornment={
                        <InputAdornment position="end">kg</InputAdornment>
                      }
                    ></CustomTextField>
                  </CustomField>
                </Grid>
                <Grid item>
                  <CustomField label={t('col.recycType')} mandatory>
                    <RecyclablesListSingleSelect
                      recycL={recycType ?? []}
                      setState={(values) => {
                        setRecycTypeId(values?.recycTypeId)
                        setRecycSubTypeId(values?.recycSubTypeId)
                      }}
                      defaultRecycL={defaultRecyc}
                    />
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
                                (imageList.length === 0 ||
                                  imageList.length < 2) &&
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
                          {errors && (
                            <div>
                              {errors.maxFileSize && (
                                <span style={{ color: 'red' }}>
                                  Selected file size exceeds maximum file size{' '}
                                  {imgSettings?.ImgSize / 1000000} mb
                                </span>
                              )}
                            </div>
                          )}
                          <ImageList sx={localstyles.imagesContainer} cols={4}>
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
                    onClick={() => addProcessItem()}
                  >
                    {t('pick_up_order.finish')}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
        <Divider></Divider>
        <Box sx={{ padding: 4 }}>
          <Button sx={{ ...styles.buttonFilledGreen, width: '100%' }}>
            {t('compactor.ask')}
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
