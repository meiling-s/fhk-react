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
    colors
  } from '@mui/material'
  import React, { FunctionComponent, useEffect, useState } from 'react'
  import { styles } from '../../../constants/styles'
  import ImageUploading, { ImageListType } from 'react-images-uploading'
  import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
  import { CAMERA_OUTLINE_ICON } from '../../../themes/icons'
  import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
  
  import RightOverlayForm from '../../../components/RightOverlayForm'
  import CustomField from '../../../components/FormComponents/CustomField'
  import CustomTextField from '../../../components/FormComponents/CustomTextField'
  import CustomItemList from '../../../components/FormComponents/CustomItemList'
  import theme from '../../../themes/palette'
  import RecyclablesListSingleSelect from '../../../components/SpecializeComponents/RecyclablesListSingleSelect'
  
  import { useTranslation } from 'react-i18next'
  import { useContainer } from 'unstated-next'
  import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
  import { il_item } from '../../../components/FormComponents/CustomItemList'
  import { EVENT_RECORDING } from '../../../constants/configs'
  import { ImageToBase64 } from '../../../utils/utils'
  import { generateNumericId } from '../../../utils/uuidgenerator'
  
  

  type createRecyclable = {
    id: number
    newData: true,
    poNum: string
    recycTypeId: string
    recycSubTypeId: string
    weight: string
    imagesList: string[]
  }
  interface EditProcessRecordProps {
    drawerOpen: boolean
    handleDrawerClose: () => void
    onCreateRecycle: (data: createRecyclable) => void
    editedData: createRecyclable | null
  }
  

  
  const EditRecyclableForm: FunctionComponent<EditProcessRecordProps> = ({
    drawerOpen,
    handleDrawerClose,
    onCreateRecycle,
    editedData
  }) => {
    const { t } = useTranslation()
    const [weight, setWeight] = useState('0')
    const [recycTypeId, setRecycTypeId] = useState('')
    const [recycSubTypeId, setRecycSubTypeId] = useState('')
    const { recycType } = useContainer(CommonTypeContainer)
    const [pictures, setPictures] = useState<ImageListType>([])
  
    const resetData = () => {
      setWeight('0')
      setPictures([])
    }
  
    const onSaveData = () => {
      const data: createRecyclable = {
        id: editedData? editedData.id : generateNumericId(),
        newData: true,
        poNum: 'RC020220',
        recycTypeId: recycTypeId,
        recycSubTypeId: recycSubTypeId,
        weight: weight,
        imagesList: ImageToBase64(pictures)
      }
      onCreateRecycle(data)
      resetData()
      handleDrawerClose()
    }
    const onImageChange = (imageList: ImageListType) => {
      setPictures(imageList)
    }
  
    const removeImage = (index: number) => {
      const newPictures = [...pictures]
      newPictures.splice(index, 1)
      setPictures(newPictures)
    }
  
    return (
      <>
        <div className="detail-inventory">
          <RightOverlayForm
            open={drawerOpen}
            onClose={handleDrawerClose}
            anchor={'right'}
            action={'edit'}
            headerProps={{
              title: t('processRecord.processingRecords'),
              subTitle: 'RC029939993',
              onSubmit: onSaveData,
              onDelete: handleDrawerClose,
              onCloseHeader: handleDrawerClose,
              submitText: t('col.save'),
              cancelText: t('col.cancel'),
              statusLabel:'processing'
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
                      {editedData ? editedData.poNum : 'RC029939993'}
                    </Typography>
                  </CustomField>
                </Grid>
                <CustomField label={t('col.recycType')}>
                  <RecyclablesListSingleSelect
                    recycL={recycType ?? []}
                    setState={(values) => {
                      setRecycSubTypeId(values?.recycTypeId)
                      setRecycSubTypeId(values?.recycSubTypeId)
                    }}
                  />
                  {/* <CustomItemList
                    items={recycTypeList || []}
                    singleSelect={(values) => setRecycleTypeId(values)}
                    value={recycTypeId}
                  /> */}
                </CustomField>
                <CustomField label={t('pick_up_order.recyclForm.weight')}>
                  <CustomTextField
                    id="weight"
                    placeholder="請輸入重量"
                    onChange={(event) => setWeight(event.target.value)}
                    value={weight}
                    sx={{ width: '100%' }}
                    endAdornment={
                      <InputAdornment position="end">kg</InputAdornment>
                    }
                  ></CustomTextField>
                </CustomField>
                <Grid item>
                  {/* image field */}
                  <Box key={t('report.picture')}>
                    <ImageUploading
                      multiple
                      value={pictures}
                      onChange={(imageList) => onImageChange(imageList)}
                      maxNumber={EVENT_RECORDING.maxImageNumber}
                      maxFileSize={EVENT_RECORDING.maxImageSize}
                      dataURLKey="data_url"
                    >
                      {({ imageList, onImageUpload, onImageRemove }) => (
                        <Box className="box">
                          <Card
                            sx={{
                              ...localStyle.cardImg
                              // ...(trySubmited &&
                              //   imageList.length === 0 &&
                              //   localstyles.imgError)
                            }}
                          >
                            <ButtonBase
                              sx={localStyle.btnBase}
                              onClick={(event) => onImageUpload()}
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
              </Grid>
            </Box>
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
  