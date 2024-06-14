import { FunctionComponent, useState, useEffect } from 'react'
import {
  Box,
  Divider,
  Grid,
  Typography,
  Card,
  ButtonBase,
  ImageList,
  ImageListItem,
  TextField,
  FormControl,
  InputLabel,
  MenuItem
} from '@mui/material'
import { CAMERA_OUTLINE_ICON } from '../../../../themes/icons'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import RightOverlayForm from '../../../../components/RightOverlayForm'
import CustomField from '../../../../components/FormComponents/CustomField'
import CustomTextField from '../../../../components/FormComponents/CustomTextField'
import { styles } from '../../../../constants/styles'
import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../../interfaces/common'
import {
  LogisticVehicle,
  CreateLogisticVehicle
} from '../../../../interfaces/vehicles'
import { formErr } from '../../../../constants/constant'
import { returnErrorMsg, ImageToBase64 } from '../../../../utils/utils'
import { localStorgeKeyName } from '../../../../constants/constant'
import {
  createVehicles,
  deleteVehicle,
  editVehicle
} from '../../../../APICalls/Logistic/vehicles'
import i18n from '../../../../setups/i18n'
import { il_item } from '../../../../components/FormComponents/CustomItemList'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../../contexts/CommonTypeContainer'

interface CreateVehicleProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'add' | 'edit' | 'delete' | 'none'
  onSubmitData: (type: string, msg: string) => void
  rowId?: number
  selectedItem?: LogisticVehicle | null
  plateListExist: string[]
}

const CreateVehicle: FunctionComponent<CreateVehicleProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  onSubmitData,
  rowId,
  selectedItem,
  plateListExist
}) => {
  const { t } = useTranslation()
  const [vehicleTypeId, setVehicleTypeId] = useState<string>('')
  const [selectedVehicle, setSelectedVehicle] = useState<il_item>({
    id: '1',
    name: 'Van'
  })
  const [licensePlate, setLicensePlate] = useState('')
  const [pictures, setPictures] = useState<ImageListType>([])
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const [vehicleWeight, setVehicleWeight] = useState<string>('')
  const { vehicleType, imgSettings } = useContainer(CommonTypeContainer)
  const [vehicleTypeList, setVehicleType] = useState<il_item[]>([])
  const mappingData = () => {
    if (selectedItem != null) {
      setLicensePlate(selectedItem.plateNo)
      setVehicleTypeId(selectedItem.vehicleTypeId)
      setVehicleWeight(selectedItem.netWeight.toString())

      const imageList: any = selectedItem.photo.map(
        (url: string, index: number) => {
          const format = url.startsWith('data:image/png') ? 'png' : 'jpeg'
          const imgdata = `data:image/${format};base64,${url}`

          return {
            data_url: imgdata,
            file: {
              name: `image${index + 1}`,
              size: 0,
              type: 'image/jpeg'
            }
          }
        }
      )

      setPictures(imageList)
    }
  }

  useEffect(() => {
    getserviceList()
    getVehiclesLogisticType()
    setValidation([])
    if (action !== 'add') {
      mappingData()
    } else {
      setTrySubmited(false)
      resetData()
    }
  }, [drawerOpen])

  const getserviceList = () => {}

  const resetData = () => {
    setLicensePlate('')
    setVehicleTypeId('')
    setVehicleWeight('')
    setPictures([])
    setValidation([])
  }

  const getVehiclesLogisticType = () => {
    if (vehicleType) {
      const carType: il_item[] = []
      vehicleType?.forEach((vehicle) => {
        var name = ''
        switch (i18n.language) {
          case 'enus':
            name = vehicle.vehicleTypeNameEng
            break
          case 'zhch':
            name = vehicle.vehicleTypeNameSchi
            break
          case 'zhhk':
            name = vehicle.vehicleTypeNameTchi
            break
          default:
            name = vehicle.vehicleTypeNameTchi
            break
        }
        const vehicleType: il_item = {
          id: vehicle.vehicleTypeId,
          name: name
        }
        carType.push(vehicleType)
      })
      setVehicleType(carType)
    }
  }

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

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  useEffect(() => {
    const validate = async () => {
      //do validation here
      const tempV: formValidate[] = []
      licensePlate?.toString() == '' &&
        tempV.push({
          field: t('driver.vehicleMenu.license_plate_number'),
          problem: formErr.empty,
          type: 'error'
        })
      pictures.length == 0 &&
        tempV.push({
          field: t('driver.vehicleMenu.picture'),
          problem: formErr.empty,
          type: 'error'
        })
      pictures.length < 2 &&
        tempV.push({
          field: t('driver.vehicleMenu.picture'),
          problem: formErr.minMoreOneImgUploded,
          type: 'error'
        })
      vehicleWeight?.toString() == '0' &&
        tempV.push({
          field: t('driver.vehicleMenu.vehicle_cargo_capacity'),
          problem: formErr.empty,
          type: 'error'
        })
      vehicleTypeId?.toString() == '' &&
        tempV.push({
          field: t('driver.vehicleMenu.vehicle_type'),
          problem: formErr.empty,
          type: 'error'
        })
      setValidation(tempV)
    }

    validate()
  }, [licensePlate, pictures, vehicleWeight, vehicleTypeId, i18n.language])

  const handleSubmit = () => {
    const loginId = localStorage.getItem(localStorgeKeyName.username) || ''

    const formData: CreateLogisticVehicle = {
      plateNo: licensePlate,
      photo: ImageToBase64(pictures),
      status: 'ACTIVE',
      createdBy: loginId,
      updatedBy: loginId,
      vehicleTypeId: vehicleTypeId,
      netWeight: Number(vehicleWeight)
    }
    //console.log('iamge', ImageToBase64(pictures))
    if (action == 'add') {
      handleCreateVehicle(formData)
    } else {
      handleEditVehicle(formData)
    }
  }

  const handleCreateVehicle = async (formData: CreateLogisticVehicle) => {
    if (validation.length === 0) {
      const result = await createVehicles(formData)
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

  const handleEditVehicle = async (formData: CreateLogisticVehicle) => {
    if (validation.length === 0) {
      if (selectedItem != null) {
        const result = await editVehicle(formData, selectedItem.vehicleId)
        if (result) {
          onSubmitData('success', t('common.editSuccessfully'))
          resetData()
          handleDrawerClose()
        }
      }
    } else {
      setTrySubmited(true)
    }
  }

  const handleDelete = async () => {
    const status = 'DELETED'
    if (selectedItem != null) {
      const result = await deleteVehicle(status, selectedItem.vehicleId)
      if (result) {
        onSubmitData('success', t('common.deletedSuccessfully'))
        resetData()
        handleDrawerClose()
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
              ? t('add_warehouse_page.delete')
              : t('userGroup.change'),
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
            <CustomField label={t('driver.vehicleMenu.license_plate_number')} mandatory>
              <CustomTextField
                id="licensePlate"
                value={licensePlate}
                disabled={action === 'delete'}
                placeholder={t(
                  'driver.vehicleMenu.license_plate_number_placeholder'
                )}
                onChange={(event) => setLicensePlate(event.target.value)}
                error={checkString(licensePlate)}
              />
            </CustomField>
            <Grid item className="vehicle_type">
              <CustomField
                label={t('driver.vehicleMenu.vehicle_type')} mandatory
              ></CustomField>
              <FormControl sx={{ ...localstyles.dropdown, width: '100%' }}>
                <Select
                  labelId="vehicleType"
                  id="vehicleType"
                  value={vehicleTypeId}
                  sx={{
                    borderRadius: '12px'
                  }}
                  disabled={action === 'delete'}
                  onChange={(event: SelectChangeEvent<string>) => {
                    const selectedValue = vehicleTypeList.find(
                      (item) => item.id === event.target.value
                    )
                    if (selectedValue) {
                      setVehicleTypeId(selectedValue.id)
                    }
                  }}
                  error={checkString(vehicleTypeId)}
                  defaultValue={selectedItem?.vehicleTypeId}
                >
                  <MenuItem value="">
                    <em>{t('check_in.any')}</em>
                  </MenuItem>
                  {vehicleTypeList.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item>
              <CustomField
                label={t('driver.vehicleMenu.vehicle_cargo_capacity')} mandatory
              ></CustomField>
              <TextField
                id="vehicleWeight"
                value={vehicleWeight}
                onChange={(event) => {
                  const numericValue = event.target.value.replace(/\D/g, '')
                  event.target.value = numericValue
                  setVehicleWeight(numericValue)
                }}
                disabled={action === 'delete'}
                sx={{ ...localstyles.inputState, margin: 0 }}
                placeholder={t(
                  'driver.vehicleMenu.vehicle_cargo_capacity_placeholder'
                )}
                error={checkString(vehicleWeight.toString())}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                InputProps={{
                  endAdornment: <Typography>kg</Typography>
                }}
              />
            </Grid>
            <Grid item>
              {/* image field */}
              <Box key={t('report.picture')}>
              <CustomField
                label= {t('report.picture')} mandatory
              ></CustomField>
                <ImageUploading
                  multiple
                  value={pictures}
                  onChange={(imageList, addUpdateIndex) =>
                    onImageChange(imageList, addUpdateIndex)
                  }
                  maxNumber={imgSettings?.ImgQuantity}
                  maxFileSize={imgSettings?.ImgSize}
                  dataURLKey="data_url"
                >
                  {({ imageList, onImageUpload, onImageRemove }) => (
                    <Box className="box">
                      <Card
                        sx={{
                          ...localstyles.cardImg,
                          ...(trySubmited &&
                            (imageList.length === 0 || imageList.length < 2) &&
                            localstyles.imgError)
                        }}
                      >
                        <ButtonBase
                          sx={localstyles.btnBase}
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
              <div className="note">
                <p className="text-sm text-gray">{t('vehicle.imgNote')}</p>
              </div>
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
          </Grid>
        </Box>
      </RightOverlayForm>
    </div>
  )
}

const localstyles = {
  typo: {
    color: '#ACACAC',
    fontSize: 13,
    fontWeight: '500'
  },
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
  inputState: {
    mt: 0,
    width: '100%',

    borderRadius: '10px',
    bgcolor: 'white',
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '& fieldset': {
        borderColor: '#C4C4C4'
      },
      '&:hover fieldset': {
        borderColor: '#79CA25'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#79CA25'
      },
      '& label.Mui-focused': {
        color: '#79CA25'
      }
    }
  },
  dropdown: {
    borderRadius: '10px',
    width: '100%',
    bgcolor: 'white',
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)'
      },
      '&:hover fieldset': {
        borderColor: '#79CA25'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#79CA25'
      }
    }
  }
}

export default CreateVehicle
