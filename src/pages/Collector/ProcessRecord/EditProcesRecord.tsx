import { Box, Grid, Divider, Typography, Button } from '@mui/material'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { styles } from '../../../constants/styles'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined'
import { DELETE_OUTLINED_ICON } from '../../../themes/icons'
import RightOverlayForm from '../../../components/RightOverlayForm'
import EditRecyclableForm from './EditRecyclableForm'
import CustomField from '../../../components/FormComponents/CustomField'
import theme from '../../../themes/palette'
import {
  ProcessOut,
  processOutImage,
  ProcessOutItem,
  CreateRecyclable
} from '../../../interfaces/processRecords'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import dayjs from 'dayjs'
import { format } from '../../../constants/constant'
import { useTranslation } from 'react-i18next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import i18n from '../../../setups/i18n'
import { localStorgeKeyName } from '../../../constants/constant'
import { createProcessRecordItem } from '../../../APICalls/Collector/processRecords'
import { ImageToBase64 } from '../../../utils/utils'

type RecycItem = {
  itemId: number
  processOutId: number
  recycType: il_item
  recycSubtype: il_item
  weight: number
  images: string[]
}

interface EditProcessRecordProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  selectedRow?: ProcessOut | null
}

const EditProcessRecord: FunctionComponent<EditProcessRecordProps> = ({
  drawerOpen,
  handleDrawerClose,
  selectedRow
}) => {
  const { t } = useTranslation()
  const { recycType } = useContainer(CommonTypeContainer)
  const [drawerRecyclable, setDrawerRecyclable] = useState(false)
  const [action, setAction] = useState<
    'none' | 'add' | 'edit' | 'delete' | undefined
  >('add')
  const loginId = localStorage.getItem(localStorgeKeyName.username) || ''

  const [recycItem, setRecycItem] = useState<RecycItem[]>([])
  const [selectedItem, setSelectedItem] = useState<RecycItem | null>(null)
  const fieldItem = [
    {
      label: t('processRecord.creationDate'),
      value: selectedRow?.createdAt
        ? dayjs(new Date(selectedRow?.createdAt)).format(format.dateFormat1)
        : '-'
    },
    {
      label: t('processRecord.handleName'),
      value: selectedRow?.createdBy
    },
    {
      label: t('processRecord.processingLocation'),
      value: '處理地點'
    },
    {
      label: t('processRecord.handler'),
      value: '-'
    }
  ]

  const mappingRecyName = (recycTypeId: string, recycSubTypeId: string) => {
    const matchingRecycType = recycType?.find(
      (recyc) => recycTypeId === recyc.recycTypeId
    )

    if (matchingRecycType) {
      const matchRecycSubType = matchingRecycType.recycSubType?.find(
        (subtype) => subtype.recycSubTypeId === recycSubTypeId
      )
      var name = ''
      switch (i18n.language) {
        case 'enus':
          name = matchingRecycType.recyclableNameEng
          break
        case 'zhch':
          name = matchingRecycType.recyclableNameSchi
          break
        case 'zhhk':
          name = matchingRecycType.recyclableNameTchi
          break
        default:
          name = matchingRecycType.recyclableNameTchi
          break
      }
      var subName = ''
      switch (i18n.language) {
        case 'enus':
          subName = matchRecycSubType?.recyclableNameEng ?? ''
          break
        case 'zhch':
          subName = matchRecycSubType?.recyclableNameSchi ?? ''
          break
        case 'zhhk':
          subName = matchRecycSubType?.recyclableNameTchi ?? ''
          break
        default:
          subName = matchRecycSubType?.recyclableNameTchi ?? '' //default fallback language is zhhk
          break
      }

      return { name, subName }
    }
  }

  useEffect(() => {
    if (selectedRow && selectedRow?.processoutDetail?.length > 0) {
      const recycItems: RecycItem[] = []

      selectedRow.processoutDetail.forEach((detail: ProcessOutItem) => {
        const result = mappingRecyName(
          detail.recycTypeId,
          detail.recycSubTypeId
        )
        if (result) {
          const { name, subName } = result
          recycItems.push({
            itemId: detail.itemId,
            processOutId: detail.processOutDtlId,
            recycType: {
              name: name,
              id: detail.recycTypeId
            },
            recycSubtype: {
              name: subName,
              id: detail.recycSubTypeId
            },
            weight: detail.weight,
            images: detail.processoutDetailPhoto.map((item) => {
              return `data:image/jpeg;base64,${item.photo}`
            })
          })
        }
      })
      setRecycItem(recycItems)
    }
  }, [selectedRow, recycType])

  const onSaveData = async () => {
    const newItem = recycItem.filter((item) => item.processOutId == 0)

    if (newItem.length > 0) {
      const createItemsProcessOut: CreateRecyclable[] = newItem.map((item) => {
        const imgItems: processOutImage[] = item.images.map((item, idx) => {
          return {
            sid: idx,
            photo: item.split(',')[1] // change data again to base64
          }
        })

        return {
          itemId: item.itemId,
          recycTypeId: item.recycType.id,
          recycSubTypeId: item.recycSubtype.id,
          packageTypeId: '',
          weight: item.weight,
          unitId: 'kg',
          processoutDetailPhoto: imgItems,
          createdBy: loginId,
          updatedBy: loginId
        }
      })

      console.log('createItemsProcessOut', createItemsProcessOut)

      const result = await createProcessRecordItem(
        createItemsProcessOut,
        selectedRow!!.processOutId
      )

      if (result) {
        handleDrawerClose()
      }
    }
  }

  const handleCreateRecyc = (data: CreateRecyclable) => {
    const imgList: string[] = data.processoutDetailPhoto.map(
      (item: processOutImage) => {
        return `data:image/jpeg;base64,${item.photo}`
      }
    )

    const existingItemIndex = recycItem.findIndex(
      (item) => item.itemId === data.itemId
    )

    if (existingItemIndex !== -1) {
      // If the item with the same ID exists, update it
      setRecycItem((prevItems) => {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          weight: data.weight,
          images: imgList
        }
        return updatedItems
      })
    } else {
      // If the item with the same ID doesn't exist, add it to the array
      const result = mappingRecyName(data.recycTypeId, data.recycSubTypeId)
      setRecycItem((prevItems: any) => [
        ...prevItems,
        {
          itemId: data.itemId,
          processOutId: 0,
          recycType: {
            name: result ? result.name : '',
            id: result ? data.recycTypeId : ''
          },
          recycSubtype: {
            name: result ? result.name : '',
            id: result ? data.recycSubTypeId : ''
          },
          weight: data.weight,
          images: imgList
        }
      ])
    }
    setSelectedItem(null)
  }

  const handleDeleteItem = (itemId: number) => {
    const updatedRecycItem = recycItem.filter((item) => item.itemId !== itemId)
    setRecycItem(updatedRecycItem)
    setSelectedItem(null)
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
            subTitle: selectedRow?.processOutId.toString(),
            onSubmit: onSaveData,
            onDelete: handleDrawerClose,
            onCloseHeader: handleDrawerClose,
            submitText: t('col.save'),
            cancelText: t('col.cancel'),
            statusLabel: selectedRow?.status
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
                marginTop: { sm: 2, xs: 6 },
                marginLeft: {
                  xs: 0
                },
                paddingRight: 2
              }}
              className="sm:ml-0 mt-o w-full"
            >
              <Grid item>
                <Box>
                  <Typography sx={styles.header2}>
                    {t('processRecord.detail.processingData')}
                  </Typography>
                </Box>
              </Grid>
              {fieldItem.map((item, index) => (
                <Grid item key={index}>
                  <CustomField label={item.label}>
                    <Typography sx={localStyle.textField}>
                      {item.value}
                    </Typography>
                  </CustomField>
                </Grid>
              ))}
              <Grid item>
                <Box>
                  <Typography sx={styles.header2}>
                    {t('processRecord.detail.recyclingInformation')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box>
                  <div className="recyle-type-weight text-[13px] text-[#ACACAC] font-normal tracking-widest mb-4">
                    {t('processRecord.categoryWeight')}
                  </div>
                  {recycItem?.map((item, index) => (
                    <div
                      key={index}
                      className="recyle-item px-4 py-2 rounded-xl border border-solid border-[#E2E2E2] mt-4"
                    >
                      <div className="detail flex justify-between items-center">
                        <div className="recyle-type flex items-center gap-2">
                          <div className="category" style={categoryRecyle}>
                            {item.recycType.name.charAt(0)}
                          </div>
                          <div className="type-item">
                            <div className="sub-type text-xs text-black font-bold tracking-widest">
                              {item.recycType.name}
                            </div>
                            <div className="type text-mini text-[#ACACAC] font-normal tracking-widest mb-2">
                              {item.recycSubtype.name}
                            </div>
                          </div>
                        </div>
                        <div className="right action flex items-center gap-2">
                          <div className="weight font-bold font-base">
                            {item.weight}kg
                          </div>
                          {item.processOutId == 0 && (
                            <Box>
                              <DriveFileRenameOutlineOutlinedIcon
                                onClick={() => {
                                  setSelectedItem(item)
                                  setAction('edit')
                                  setDrawerRecyclable(true)
                                }}
                                fontSize="small"
                                className="text-gray cursor-pointer"
                              />
                              <DELETE_OUTLINED_ICON
                                onClick={() => {
                                  setSelectedItem(item)
                                  setAction('delete')
                                  setDrawerRecyclable(true)
                                }}
                                fontSize="small"
                                className="text-gray cursor-pointer"
                              ></DELETE_OUTLINED_ICON>
                            </Box>
                          )}
                        </div>
                      </div>
                      {item.images.length != 0 && (
                        <div className="images mt-3 grid lg:grid-cols-4 sm:rid grid-cols-2 gap-4">
                          {item.images.map((img, index) => (
                            <img
                              src={img}
                              alt=""
                              key={index}
                              className="lg:w-[100px] h-[100px] object-cover sm:w-16"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </Box>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setDrawerRecyclable(true)
                    setAction('add')
                  }}
                  sx={{
                    padding: '32px',
                    width: '100%',
                    borderColor: theme.palette.primary.main,
                    color: 'black',
                    borderRadius: '10px'
                  }}
                >
                  <div className="inline-grid">
                    <AddCircleIcon
                      sx={{ ...styles.endAdornmentIcon, pl: '3px' }}
                    />
                    {t('pick_up_order.new')}
                  </div>
                </Button>
              </Grid>
            </Grid>
          </Box>
          <EditRecyclableForm
            drawerOpen={drawerRecyclable}
            handleDrawerClose={() => setDrawerRecyclable(false)}
            onCreateRecycle={handleCreateRecyc}
            onDeleteItem={handleDeleteItem}
            editedData={selectedItem}
            processOut={selectedRow}
            action={action}
          />
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
export default EditProcessRecord
