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

import { ADD_CIRCLE_FILL_ICON_ } from '../../../themes/icons'
import { styles } from '../../../constants/styles'
import { useTranslation } from 'react-i18next'
import { CAMERA_OUTLINE_ICON } from '../../../themes/icons'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import ImageUploading, { ImageListType } from 'react-images-uploading'

import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import RecyclablesListSingleSelect from '../../../components/SpecializeComponents/RecyclablesListSingleSelect'
import { singleRecyclable } from '../../../interfaces/collectionPoint'

const AddProcessCompactor: FunctionComponent = () => {
  const { t } = useTranslation()
  const [itemProcessing, setItemProcessing] = useState([])
  const [isShowForm, setShowForm] = useState<boolean>(false)
  const [isRecylingCategory, setRecycleCategory] = useState<boolean>(true)
  const [pictures, setPictures] = useState<ImageListType>([])
  const { imgSettings, recycType } = useContainer(CommonTypeContainer)
  const [trySubmited, setTrySubmited] = useState<boolean>(false)

  const [defaultRecyc, setDefaultRecyc] = useState<singleRecyclable>()
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
  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setPictures(imageList)
  }

  const removeImage = (index: number) => {
    // Remove the image at the specified index
    const newPictures = [...pictures]
    newPictures.splice(index, 1)
    setPictures(newPictures)
  }

  return (
    <>
      <Box>
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRight: '1px solid #D1D1D1'
            }}
          >
            <div
              className="p-8 border-[#AFE397] border-solid border-[1px] rounded-xl w-[300px] text-center cursor-pointer m-6
            "
              onClick={() => setShowForm(true)}
            >
              <ADD_CIRCLE_FILL_ICON_
                sx={{ color: '#7FC738', fontSize: '30px' }}
              />
              <div className="text-base text-[#535353] font-bold">{'新增'}</div>
            </div>
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
                按新增為壓縮品輸入資料
              </div>
            </Box>
          ) : (
            <Box sx={{ margin: '24px', width: '100%' }}>
              <Grid container direction={'column'} spacing={4}>
                <Grid item>
                  <Typography sx={{ ...styles.header3, marginBottom: 1 }}>
                    {t('package list')}
                  </Typography>
                  <FormControl
                    sx={{
                      width: '50%'
                    }}
                  >
                    <Select
                      labelId="userGroup"
                      id="userGroup"
                      data-testid="astd-user-form-status-select-button-6538"
                      value={''}
                      sx={{
                        borderRadius: '12px'
                      }}
                      onChange={(event: SelectChangeEvent<string>) => {
                        // const selectedValue = userGroupList.find(
                        //   (item) => item.groupId === parseInt(event.target.value)
                        // )
                        // if (selectedValue) {
                        //   setUserGroup(selectedValue.groupId)
                        // }
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
                  <CustomField label={t('recycling_unit.main_category')}>
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
                  <CustomField
                    label={t('pick_up_order.recyclForm.weight')}
                    mandatory
                  >
                    <CustomTextField
                      id="weight"
                      placeholder={t('userAccount.pleaseEnterNumber')}
                      onChange={(event) => {
                        // onChangeWeight(
                        //   event.target.value,
                        //   decimalVal,
                        //   (value: string) => {
                        //     formik.setFieldValue('weight', value)
                        //   }
                        // )
                      }}
                      onBlur={(event) => {
                        // const value = formatWeight(
                        //   event.target.value,
                        //   decimalVal
                        // )
                        // formik.setFieldValue('weight', value)
                      }}
                      value={0}
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
                      setState={(values) => {}}
                      defaultRecycL={defaultRecyc}
                    />
                  </CustomField>
                </Grid>
                <Grid item>
                  <Box key={t('report.picture')}>
                    <Typography sx={{ ...styles.header3, marginBottom: 2 }}>
                      {t('report.picture')}
                    </Typography>
                    <ImageUploading
                      multiple
                      value={pictures}
                      onChange={(imageList, addUpdateIndex) =>
                        onImageChange(imageList, addUpdateIndex)
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
                  <Button sx={{ ...styles.buttonFilledGreen, width: '200px' }}>
                    完成
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
        <Divider></Divider>
        <Box sx={{ padding: 4 }}>
          <Button sx={{ ...styles.buttonFilledGreen, width: '100%' }}>
            請求
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

export default AddProcessCompactor
