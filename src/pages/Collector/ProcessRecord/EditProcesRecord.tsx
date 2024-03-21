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
  CreateRecyclable,
} from '../../../interfaces/processRecords'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import dayjs from 'dayjs'
import { format } from '../../../constants/constant'
import { useTranslation } from 'react-i18next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import i18n from '../../../setups/i18n'
import { localStorgeKeyName } from '../../../constants/constant'
import { createProcessRecordItem, 
  editProcessRecordItem, 
  deleteProcessOutItem, 
  getProcessRecordDetail, 
deleteProcessOutRecord} from '../../../APICalls/Collector/processRecords'
import { displayCreatedDate } from '../../../utils/utils'
import { ToastContainer, toast } from 'react-toastify'
import { ProcessType } from '../../../interfaces/common'

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
  const [reloadData, setReloadData] = useState(false);
  const [recycItem, setRecycItem] = useState<RecycItem[]>([])
  const [selectedItem, setSelectedItem] = useState<RecycItem | null>(null)
  const {processType} = useContainer(CommonTypeContainer)

  console.log(processType+'11111111111')

  const mappingProcessName = (processTypeId: string) => {
    
    const  matchingProcess = processType?.find((item: ProcessType)=> item.processTypeId == processTypeId)
 
    if(matchingProcess) {
    var name = ""
    switch (i18n.language) {
     case 'enus':
       name = matchingProcess.processTypeNameEng
       break
     case 'zhch':
       name = matchingProcess.processTypeNameSchi
       break
     case 'zhhk':
       name = matchingProcess.processTypeNameTchi
       break
     default:
       name = matchingProcess.processTypeNameTchi
       break
     }
     return name
   }
   }

  const fieldItem = [
    {
      label: t('processRecord.creationDate'),
      value: selectedRow?.createdAt
        ? displayCreatedDate(selectedRow?.createdAt)
        : '-'
    },
    {
      label: t('processRecord.handleName'),
      value: selectedRow?.packageTypeId ? mappingProcessName(selectedRow.packageTypeId) : selectedRow?.packageName
    },
    {
      label: t('processRecord.processingLocation'),
      value: selectedRow?.address
    },
    {
      label: t('processRecord.handler'),
      value: selectedRow?.createdBy
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

  const showErrorToast = (toastMsg: string) => {
    toast.error(toastMsg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    })
  }

  const showSuccessToast = (toastMsg : string) => {
    toast.info(toastMsg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    })
  }

  const getProcessDetail = async () => {
    if(selectedRow ){
      const result = await getProcessRecordDetail(selectedRow?.processOutId)
      if(result) {
        return result.data
      } else {
        return null
      }
    }
  }

  useEffect(() => {
    const getDetail = async () => {
       const processOut = await getProcessDetail();
      if (selectedRow && processOut ) {
      
        const recycItems: RecycItem[] = []
  
        processOut.processoutDetail.forEach((detail: ProcessOutItem) => {
          const result = mappingRecyName(
            detail.recycTypeId,
            detail.recycSubTypeId
          )
          if (result) {
            const { name, subName } = result
            recycItems.push({
              itemId: detail.itemId,
              processOutDtlId: detail.processOutDtlId,
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
        setReloadData(false);
      }
    };
    getDetail();

   
  }, [selectedRow, recycType, reloadData])

  const onSaveData = async () => {
   
  }

  const constractForm = (data: CreateRecyclable) => {
    const imgItems: processOutImage[] =  data.processoutDetailPhoto.map((item, idx) => {
      return {
        sid: idx,
        photo: item.photo
      }
    })

    const createItemsProcessOut: CreateRecyclable = {
      itemId: data.itemId,
      recycTypeId: data.recycTypeId,
      recycSubTypeId: data.recycSubTypeId,
      packageTypeId: selectedRow?.packageTypeId || "",
      weight: data.weight,
      unitId: 'kg',
      status: data.status,
      processoutDetailPhoto: imgItems,
      createdBy: loginId,
      updatedBy: loginId
    }

    return createItemsProcessOut

  }

  const handleCreateRecyc = async (data: CreateRecyclable) => {
    const createItemsProcessOut:CreateRecyclable[] = [constractForm(data)]
    const result = await createProcessRecordItem(createItemsProcessOut, selectedRow!!.processOutId)
  
    if (result) {
      setReloadData(true);
      showSuccessToast(t('processRecord.createProcessOutSuccess'))
    } else {
      showErrorToast(t('processRecord.createProcessOutFailed'))
    }
    setSelectedItem(null)
  }

  const handleEditRecyc = async (data: CreateRecyclable, processOutDtlId: number) =>{
    const editItemsProcessOut:CreateRecyclable = constractForm(data)
    const response = await editProcessRecordItem(editItemsProcessOut,  selectedRow!!.processOutId, processOutDtlId)
  
    if (response) {
      setReloadData(true);
      showSuccessToast(t('processRecord.editProcessOutSuccess'))
    } else {
      showErrorToast(t('processRecord.editProcessOutFailed'))
    }

    setSelectedItem(null)
  }

  const handleDeleteRecyc = async (processOutDtlId: number) => {
    const result = await deleteProcessOutItem('INACTIVE', processOutDtlId)
    if(result) {
      setReloadData(true);
      showSuccessToast(t('processRecord.deleteProcessOutSuccess'))
    } else {
      showErrorToast(t('processRecord.deleteProcessOutFailed'))
    } 
    setSelectedItem(null)
  }

  const handleDeleteProcessOut = async () => {
    if(selectedRow){
      const result = await deleteProcessOutRecord(selectedRow.processOutId)
      if(result){
        handleDrawerClose()
        showSuccessToast("刪除進程成功")
      } else {
        showErrorToast("刪除進程失敗")
      } 
    }
  }

  return (
    <>
      <div className="detail-inventory">
      <ToastContainer></ToastContainer>
        <RightOverlayForm
          open={drawerOpen}
          onClose={handleDrawerClose}
          anchor={'right'}
          action={'none'}
          headerProps={{
            title: t('processRecord.processingRecords'),
            subTitle: selectedRow?.processOutId.toString(),
            onSubmit: onSaveData,
            onDelete: handleDrawerClose,
            onCloseHeader: handleDrawerClose,
            submitText: t('col.save'),
            cancelText: t('add_warehouse_page.delete'),
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
                          {/* {item.processOutId == 0 && ( */}
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
                          {/* )} */}
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
            onDeleteItem={handleDeleteRecyc}
            onEditRecycle={handleEditRecyc}
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
