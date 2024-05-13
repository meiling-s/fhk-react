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
import { ImageToBase64, formatWeight, onChangeWeight, returnErrorMsg } from '../../../utils/utils'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import { generateNumericId } from '../../../utils/uuidgenerator'
import { singleRecyclable } from '../../../interfaces/collectionPoint'
import { processOutImage, ProcessOut } from '../../../interfaces/processRecords'
import { localStorgeKeyName } from '../../../constants/constant'

type createRecyclable = {
  itemId: number
  recycTypeId: string
  recycSubTypeId: string
  packageTypeId: string
  weight: number
  unitId: string
  status: string
  processoutDetailPhoto: processOutImage[]
  createdBy: string
  updatedBy: string
}

type RecycItem = {
  itemId: number
  processOutDtlId: number
  recycType: il_item
  recycSubtype: il_item
  weight: number
  images: string[]
}
interface EditProcessRecordProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  onCreateRecycle: (data: createRecyclable) => void
  onEditRecycle: (data: createRecyclable, processOutDtlId: number ) => void
  onDeleteItem: (itemId: number) => void
  editedData: RecycItem | null
  processOut?: ProcessOut | null
  action: 'none' | 'add' | 'edit' | 'delete' | undefined
}

const EditRecyclableForm: FunctionComponent<EditProcessRecordProps> = ({
  drawerOpen,
  handleDrawerClose,
  onCreateRecycle,
  onEditRecycle,
  onDeleteItem,
  editedData,
  processOut,
  action
}) => {
  const { t } = useTranslation()
  const [weight, setWeight] = useState<string>('0')
  const [recycTypeId, setRecycTypeId] = useState('')
  const [recycSubTypeId, setRecycSubTypeId] = useState('')
  const [defaultRecyc, setDefaultRecyc] = useState<singleRecyclable>()
  const { recycType, imgSettings, decimalVal } = useContainer(CommonTypeContainer)
  const [pictures, setPictures] = useState<ImageListType>([])
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const loginId = localStorage.getItem(localStorgeKeyName.username) || ''

  useEffect(() => {
    setTrySubmited(false)
    resetData()
  }, [editedData, action])

  const resetData = () => {
    setWeight('0')
    setDefaultRecyc(undefined)
    setPictures([])
  }

  useEffect(() => {
    if (editedData != null) {
      //mapping edited data
      const defRecyc: singleRecyclable = {
        recycTypeId: editedData.recycType.id,
        recycSubTypeId: editedData.recycSubtype.id
      }
      setDefaultRecyc(defRecyc)
      setWeight(formatWeight(editedData.weight.toString(), decimalVal))

      const imageList: any = editedData.images.map(
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
    } else {
      setDefaultRecyc(undefined)
    }
  }, [action, drawerOpen])

  useEffect(() => {
    const validate = async () => {
      //do validation here
      const tempV: formValidate[] = []
      recycTypeId == '' &&
        tempV.push({
          field: t('col.recycType'),
          problem: formErr.empty,
          type: 'error'
        })
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
  }, [recycTypeId, recycSubTypeId, weight, pictures])

  const onSaveData = () => {
    const imgItems: processOutImage[] = ImageToBase64(pictures).map(
      (item, idx) => {
        return {
          sid: idx,
          photo: item
        }
      }
    )

    const data: createRecyclable = {
      itemId: editedData ? editedData.processOutDtlId : generateNumericId(),
      recycTypeId: recycTypeId,
      recycSubTypeId: recycSubTypeId,
      packageTypeId: '',
      weight: parseFloat(weight),
      unitId: 'kg',
      status: "ACTIVE",
      processoutDetailPhoto: imgItems,
      createdBy: loginId,
      updatedBy: loginId
    }
    if (validation.length === 0) {
      action == 'add' ? onCreateRecycle(data) : onEditRecycle(data, editedData!!.processOutDtlId)
      resetData()
      handleDrawerClose()
    } else {
      setTrySubmited(true)
    }
  }

  const onHandleDelete = () => {
    if (editedData != null) {
      onDeleteItem(editedData.processOutDtlId)
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
            subTitle: processOut?.processOutId.toString(),
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
                    {processOut?.processOutId}
                  </Typography>
                </CustomField>
              </Grid>
              <CustomField label={t('col.recycType')}>
                <RecyclablesListSingleSelect
                  recycL={recycType ?? []}
                  key="proccess-typeid"
                  setState={(values) => {
                    setRecycTypeId(values?.recycTypeId)
                    setRecycSubTypeId(values?.recycSubTypeId)
                  }}
                  defaultRecycL={defaultRecyc}
                  showError={checkString(recycTypeId)}
                />
              </CustomField>
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
                  sx={{ width: '100%' }}
                  endAdornment={
                    <InputAdornment position="end">kg</InputAdornment>
                  }
                  disabled={action == 'delete'}
                  error={weight === '0' && trySubmited}
                ></CustomTextField>
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
