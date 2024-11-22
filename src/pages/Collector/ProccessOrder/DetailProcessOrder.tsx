import { useEffect, useState } from 'react'

import { Box, Divider, Grid, Modal, Stack, Typography } from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import { ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'

import CustomField from '../../../components/FormComponents/CustomField'

import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import ScaleIcon from '@mui/icons-material/Scale'
import RecyclingIcon from '@mui/icons-material/Recycling'
import {
  mappingRecy,
  mappingSubRecy,
  mappingProductType,
  mappingSubProductType,
  mappingAddOnsType
} from './utils'

import {
  ProcessOrderItem,
  CancelFormPor,
  PorReason,
  ProcessOrderDetail,
  ProcessOrderDetailRecyc,
  ProcessOrderDetailProduct
} from '../../../interfaces/processOrderQuery'
import {
  getPrimaryColor,
  returnErrorMsg,
  showErrorToast
} from '../../../utils/utils'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import { styles } from '../../../constants/styles'
import CustomButton from '../../../components/FormComponents/CustomButton'
import CustomItemList from '../../../components/FormComponents/CustomItemList'
import dayjs from 'dayjs'
import {
  DenialReason,
  DenialReasonCollectors
} from 'src/interfaces/denialReason'
import { formErr, localStorgeKeyName } from 'src/constants/constant'
import { getDenialReasonCollectors } from 'src/APICalls/Collector/denialReasonCollectors'
import { getAllDenialReason } from 'src/APICalls/Collector/denialReason'
import { deleteProcessOrder } from 'src/APICalls/processOrder'
import { il_item } from 'src/components/FormComponents/CustomItemListRecyble'
import i18n from 'src/setups/i18n'
import CustomTextField from 'src/components/FormComponents/CustomTextField'
import { ProcessType } from 'src/interfaces/common'
import { FormErrorMsg } from 'src/components/FormComponents/FormErrorMsg'
import { factory } from 'typescript'

type CancelForm = {
  open: boolean
  onClose: () => void
  onRejected: () => void
  processOrderId: number | undefined
}

const CancelModal: React.FC<CancelForm> = ({
  open,
  onClose,
  onRejected,
  processOrderId
}) => {
  const { t } = useTranslation()
  const role = localStorage.getItem(localStorgeKeyName.role) || ''
  const isCollectors = () => {
    return role === 'collector'
  }
  const [reasonList, setReasonList] = useState<il_item[]>([])
  const [rejectReasonId, setRejectReasonId] = useState<string[]>([])
  const [otherReason, setOtherReason] = useState<il_item | undefined>(undefined)
  const [showRemark, setShowRemark] = useState<boolean>(false)
  const [remarkVal, setRemarkVal] = useState<string>('')
  const [trySubmited, setTrySubmited] = useState<boolean>(false)

  const initDenialReasonList = async () => {
    let result = null
    if (isCollectors()) {
      result = await getDenialReasonCollectors(0, 1000)
    } else {
      result = await getAllDenialReason(0, 1000)
    }
    const data = result?.data
    if (data.content.length > 0) {
      let reason: il_item[] = []
      data.content.map((item: DenialReasonCollectors | DenialReason) => {
        const reasonLabel =
          i18n.language === 'zhhk'
            ? item.reasonNameTchi
            : i18n.language === 'zhch'
            ? item.reasonNameSchi
            : item.reasonNameEng

        reason.push({
          id: item.reasonId.toString(),
          name: reasonLabel
        })
      })
      setReasonList(reason)
      const otherRegex = /^(others?|其他的|其它的)$/i
      setOtherReason(reason.find((re) => otherRegex.test(re.name)))
    }
  }

  useEffect(() => {
    initDenialReasonList()
  }, [i18n.language])

  const handleSelectReason = (rejectReasonIdList: string[]) => {
    setRejectReasonId(rejectReasonIdList)
    if (otherReason) {
      setShowRemark(rejectReasonIdList.includes(otherReason.id))
    }
  }

  const handleDeleteRequest = async () => {
    setTrySubmited(true)
    let reasonData: PorReason[] = []
    rejectReasonId.map((item) => {
      reasonData.push({
        reasonId: parseInt(item),
        remark: ''
      })
    })

    const form: CancelFormPor = {
      status: 'DELETED',
      updatedBy: role,
      version: 1,
      processOrderRejectReason: reasonData
    }

    if (showRemark && remarkVal === '') {
      return
    }

    const result = await deleteProcessOrder(form, processOrderId!!)
    if (result) {
      setTrySubmited(false)
      onClose()
      onRejected()
    } else {
      setTrySubmited(true)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localStyles.modal}>
        <Stack spacing={2}>
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold' }}
            >
              {t('processOrder.details.cancelTitle')}
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography sx={localStyles.typo}>
              {t('processOrder.details.cancelSubTitle')}
            </Typography>

            <CustomItemList
              items={reasonList}
              multiSelect={handleSelectReason}
              itemColor={{ bgColor: '#F0F9FF', borderColor: getPrimaryColor() }}
            />
            {showRemark && (
              <Box>
                <CustomField label={t('common.remark')} mandatory>
                  <CustomTextField
                    id="remark"
                    value={remarkVal}
                    placeholder={t(
                      'settings_page.recycling.remark_placeholder'
                    )}
                    onChange={(event) => setRemarkVal(event.target.value)}
                    error={showRemark && remarkVal === '' && trySubmited}
                  />
                </CustomField>
              </Box>
            )}
          </Box>

          <Grid item sx={{ width: '100%' }}>
            {showRemark && remarkVal === '' && trySubmited && (
              <FormErrorMsg
                key={'remark'}
                field={t('common.remark')}
                errorMsg={returnErrorMsg(formErr.empty, t)}
                type={'error'}
              />
            )}
          </Grid>

          <Box sx={{ alignSelf: 'center' }}>
            <CustomButton
              text={t('check_in.confirm')}
              color="blue"
              style={{ width: '175px', marginRight: '10px' }}
              onClick={handleDeleteRequest}
            />
            <CustomButton
              text={t('check_in.cancel')}
              color="blue"
              outlined
              style={{ width: '175px' }}
              onClick={() => {
                onClose()
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

type DetailPORItem = {
  procesAction: string
  startTime: string
  warehouse: string
  weight: string
  porItem: {
    productTypeIds: string[]
    productSubTypeIds: ProcessOrderDetailProduct[]
    productAddonTypeIds: ProcessOrderDetailProduct[]
    recycTypeIds: string[]
    recycSubTypeIds: ProcessOrderDetailRecyc[]
  }
}

type DetailPOR = {
  processTypeId: string
  processTypeLabel: string
  item: DetailPORItem[]
}

const DetailProcessOrder = ({
  drawerOpen,
  handleDrawerClose,
  selectedRow,
  onSubmitReason,
  processTypeListData,
  warehouseSource,
  factoriesSource
}: {
  drawerOpen: boolean
  handleDrawerClose: () => void
  selectedRow: ProcessOrderItem | undefined
  onSubmitReason: () => void
  processTypeListData: ProcessType[] | undefined
  warehouseSource: any[]
  factoriesSource: any[]
}) => {
  const { t } = useTranslation()
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false)
  const { dateFormat, recycType, productType, getProductType } =
    useContainer(CommonTypeContainer)
  const [processTypeList, setProcessTypeList] = useState<il_item[]>([])
  const [porDetails, setPorDetails] = useState<DetailPOR[]>([])
  const [warehouseList, setWarehouseList] = useState<il_item[]>([])
  const [factoryList, setFactoryList] = useState<il_item[]>([])
  const [selectedFactory, setSelectedFactory] = useState<string>('')

  const onDeleteData = () => {
    setCancelModalOpen(true)
  }

  const initProcessType = async () => {
    let processList: il_item[] = []

    if (processTypeListData) {
      processTypeListData?.forEach((item: any) => {
        var name =
          i18n.language === 'zhhk'
            ? item.processTypeNameTchi
            : i18n.language === 'zhch'
            ? item.processTypeNameSchi
            : item.processTypeNameEng

        processList.push({
          id: item.processTypeId.toString(),
          name: name
        })
      })
      setProcessTypeList(processList)
      mappingDetail()
    }
  }

  const initWarehouse = async () => {
    if (warehouseSource) {
      let warehouse: il_item[] = []

      warehouseSource.forEach((item: any) => {
        var warehouseName =
          i18n.language === 'zhhk'
            ? item.warehouseNameTchi
            : i18n.language === 'zhch'
            ? item.warehouseNameSchi
            : item.warehouseNameTchi

        warehouse.push({
          id: item.warehouseId.toString(),
          name: warehouseName
        })
      })
      setWarehouseList(warehouse)
      mappingDetail()
    }
  }

  const initFactory = async () => {
    if (factoriesSource) {
      let factory: il_item[] = []
      factoriesSource.forEach((item: any) => {
        var factoryName =
          i18n.language === 'zhhk'
            ? item.factoryNameTchi
            : i18n.language === 'zhch'
            ? item.factoryNameSchi
            : item.factoryNameEng

        factory.push({
          id: item.factoryId.toString(),
          name: factoryName
        })
      })
      if (factory.length > 0) {
        setFactoryList(factory)
      }
    }
    mappingDetail()
  }

  const mappingDetail = () => {
    let rawPorDetails: DetailPOR[] = []

    //set factories
    if (selectedRow?.factoryId) {
      setSelectedFactory(
        factoryList?.find((item) => parseInt(item.id) === selectedRow.factoryId)
          ?.name || '-'
      )
    }

    processTypeList.map((type) => {
      let selectedItem = selectedRow?.processOrderDetail.filter(
        (it) => type.id === it.processTypeId
      )
      let rawItem: DetailPORItem[] = []
      if (selectedItem && selectedItem?.length > 0) {
        selectedItem.map((it) => {
          //set warehouse data
          const warehouseIds = selectedRow?.processOrderDetail
            .flatMap((detail: any) => detail.processOrderDetailWarehouse)
            .map((warehouse: any) => warehouse.warehouseId)
          const warehouseListName = warehouseIds
            ?.map((id: string) => {
              const warehouse = warehouseList.find(
                (it) => it.id === id.toString()
              )
              return warehouse ? warehouse.name : null
            })
            .filter(Boolean)
            .join(', ')

          rawItem.push({
            procesAction: it.processAction,
            startTime: it.plannedStartAt,
            warehouse: warehouseListName ?? '-',
            weight: it.estInWeight ? it.estInWeight.toString() : '0',
            porItem: {
              productTypeIds: it.processOrderDetailProduct.map(
                (p) => p.productTypeId
              ),
              productSubTypeIds: it.processOrderDetailProduct,
              productAddonTypeIds: it.processOrderDetailProduct,
              recycTypeIds: it.processOrderDetailRecyc.flatMap(
                (r) => r.recycTypeId
              ),
              recycSubTypeIds: it.processOrderDetailRecyc
            }
          })
        })
        rawPorDetails.push({
          processTypeId: type.id,
          processTypeLabel: type.name,
          item: rawItem
        })
      }
    })

    setPorDetails(rawPorDetails)
    console.log('rawPorDetails', rawPorDetails)
  }

  useEffect(() => {
    if (processTypeListData && warehouseSource && factoriesSource) {
      initProcessType()
      initWarehouse()
      initFactory()
      getProductType()
    }
  }, [processTypeListData, warehouseSource, factoriesSource, i18n.language])

  useEffect(() => {
    if (
      warehouseList.length > 0 &&
      processTypeList.length > 0 &&
      selectedRow &&
      factoriesSource
    ) {
      mappingDetail()
    }
  }, [warehouseList, processTypeList, selectedRow, factoriesSource])

  const onDeleteReason = () => {
    handleDrawerClose()
    onSubmitReason()
  }

  //todo: move to utils

  const mappingRecyName = (typeId: string) => {
    return mappingRecy(typeId, recycType)
  }

  const mappingSubRecyName = (typeId: string, subTypeId: string) => {
    return mappingSubRecy(typeId, subTypeId, recycType)
  }

  const mappingProductTypeName = (id: string) => {
    return mappingProductType(id, productType)
  }

  const mappingSubProductTypeName = (productTypeId: string, subId: string) => {
    return mappingSubProductType(productTypeId, subId, productType)
  }

  const mappingAddOnsTypeName = (
    productTypeId: string,
    productSubTypeId: string,
    addOnId: string
  ) => {
    return mappingAddOnsType(
      productTypeId,
      productSubTypeId,
      addOnId,
      productType
    )
  }

  return (
    <>
      <Box>
        <ToastContainer></ToastContainer>
        <RightOverlayForm
          open={drawerOpen}
          onClose={handleDrawerClose}
          anchor={'right'}
          action={'edit'}
          headerProps={{
            title: t('processOrder.details.oderDetail'),
            subTitle: selectedRow?.labelId,
            onSubmit: onDeleteData,
            onDelete: handleDrawerClose,
            onCloseHeader: handleDrawerClose,
            submitText: t('common.cancel'),
            cancelText: '',
            statusLabel: selectedRow?.status
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
              <Grid item>
                <Box>
                  <Typography sx={styles.header2}>
                    {t('processOrder.createdate')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <CustomField label={t('processOrder.porDatetime')}>
                  <Typography sx={localStyles.textField}>
                    {selectedRow?.processStartAt
                      ? dayjs
                          .utc(selectedRow?.processStartAt)
                          .tz('Asia/Hong_Kong')
                          .format(`${dateFormat} HH:mm`)
                      : ''}
                  </Typography>
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={t('processOrder.workshop')}>
                  <Typography sx={localStyles.textField}>
                    {selectedFactory}
                  </Typography>
                </CustomField>
              </Grid>
              <Grid item>
                <Box>
                  <Typography sx={localStyles.header2}>
                    {t('processOrder.porCategory')}
                  </Typography>
                </Box>
              </Grid>
              {/* //box item */}
              {porDetails.map((it: DetailPOR, idx: number) => (
                <Grid item key={idx}>
                  <Box
                    sx={{
                      background: '#FBFBFB',
                      padding: 2,
                      borderRadius: '16px',
                      border: '1px solid #E2E2E2',
                      marginBottom: 4
                    }}
                  >
                    <Typography sx={localStyles.header2}>
                      {it.processTypeLabel}
                    </Typography>
                    <Divider></Divider>
                    {it.item.map((item: DetailPORItem, index: number) => (
                      <Box>
                        <Typography sx={localStyles.header2}>
                          {item.procesAction === 'PROCESS_IN'
                            ? t('processOrder.table.processIn')
                            : t('processOrder.table.processOut')}
                        </Typography>

                        <Box sx={localStyles.label}>
                          <div className="flex items-normal w-44">
                            <CalendarTodayIcon sx={localStyles.labelIcon} />
                            <Typography sx={localStyles.label}>
                              {t('processOrder.details.startdateTime')}
                            </Typography>
                          </div>
                          <Typography sx={localStyles.value}>
                            {item.startTime
                              ? dayjs
                                  .utc(selectedRow?.processStartAt)
                                  .tz('Asia/Hong_Kong')
                                  .format(`${dateFormat} HH:mm`)
                              : ''}
                          </Typography>
                        </Box>

                        <Box sx={localStyles.label}>
                          <div className="flex items-normal w-44">
                            <WarehouseIcon sx={localStyles.labelIcon} />

                            <Typography sx={localStyles.label}>
                              {t('processOrder.create.warehouse')}
                            </Typography>
                          </div>
                          <div className="max-w-[250px]">
                            <Typography sx={localStyles.value}>
                              {item.warehouse}
                            </Typography>
                          </div>
                        </Box>

                        <Box sx={localStyles.label}>
                          <div className="flex items-normal w-44">
                            <ScaleIcon sx={localStyles.labelIcon} />
                            <Typography sx={localStyles.label}>
                              {t('jobOrder.weight')}
                            </Typography>
                          </div>
                          <Typography sx={localStyles.value}>
                            {item.weight}kg
                          </Typography>
                        </Box>

                        <Box sx={localStyles.label}>
                          <div className="flex items-normal w-44">
                            <RecyclingIcon
                              sx={(localStyles.labelIcon, { color: '#79CA25' })}
                            />
                            <Typography sx={localStyles.label}>
                              {t('processOrder.details.itemCategory')}
                            </Typography>
                          </div>
                          <Box>
                            {item.porItem.productTypeIds.map((p) => (
                              <Typography sx={{ ...localStyles.value }}>
                                {mappingProductTypeName(p)}
                              </Typography>
                            ))}
                            {item.porItem.recycTypeIds.map((r) => (
                              <Typography sx={{ ...localStyles.value }}>
                                {mappingRecyName(r)}
                              </Typography>
                            ))}
                          </Box>
                        </Box>

                        <Box sx={localStyles.label}>
                          <div className="flex items-normal w-44">
                            <Typography
                              sx={{ ...localStyles.label, marginLeft: '18px' }}
                            >
                              {t('settings_page.recycling.main_category')}
                            </Typography>
                          </div>
                          <Box>
                            {item.porItem.recycSubTypeIds.map((r) => (
                              <Typography sx={{ ...localStyles.value }}>
                                {mappingSubRecyName(
                                  r.recycTypeId,
                                  r.recycSubTypeId
                                )}
                              </Typography>
                            ))}
                            {item.porItem.productSubTypeIds.map((p) => (
                              <Typography
                                sx={{ ...localStyles.value, marginBottom: 1 }}
                              >
                                {mappingSubProductTypeName(
                                  p.productTypeId,
                                  p.productSubTypeId
                                )}
                              </Typography>
                            ))}
                          </Box>
                        </Box>

                        <Box sx={localStyles.label}>
                          <div className="flex items-normal w-44">
                            <Typography
                              sx={{ ...localStyles.label, marginLeft: '18px' }}
                            >
                              {t('settings_page.recycling.sub_category')}
                            </Typography>
                          </div>
                          <Box>
                            {item.porItem.productAddonTypeIds.map((p) => (
                              <Typography
                                sx={{ ...localStyles.value, marginBottom: 1 }}
                              >
                                {mappingAddOnsTypeName(
                                  p.productTypeId,
                                  p.productSubTypeId,
                                  p.productAddonId
                                )}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          <CancelModal
            open={cancelModalOpen}
            onClose={() => {
              setCancelModalOpen(false)
              handleDrawerClose()
            }}
            onRejected={onDeleteReason}
            processOrderId={selectedRow?.processOrderId}
          ></CancelModal>
        </RightOverlayForm>
      </Box>
    </>
  )
}

let localStyles = {
  textField: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  header1: {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '8px'
  },
  header2: {
    fontSize: '16',
    fontWeight: 500,
    color: '#535353',
    marginTop: '8px',
    marginBottom: '8px'
  },
  subheader: {
    fontSize: '13px',
    color: '#717171',
    fontWeight: 500
  },
  labelIcon: {
    fontSize: '18px',
    color: '#ACACAC',
    marginRight: '4px'
  },
  label: {
    color: '#ACACAC',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'normal',
    gap: '28px',
    justifycontent: 'start',
    marginBottom: '8px'
  },
  value: {
    fontWeight: 500,
    color: ' #535353',
    fontSize: '12px'
  },
  section: {
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    marginBottom: '16px'
  },
  typo: {
    color: 'grey',
    fontSize: 14
  },
  modal: {
    position: 'absolute',
    top: '50%',
    width: '34%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    height: 'fit-content',
    padding: 4,
    backgroundColor: 'white',
    border: 'none',
    borderRadius: 5,

    '@media (max-width: 768px)': {
      width: '70%'
    }
  }
}
export default DetailProcessOrder
