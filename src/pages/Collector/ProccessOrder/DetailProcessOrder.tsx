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

import { ProcessOrderItem } from '../../../interfaces/processOrderQuery'
import { getPrimaryColor } from '../../../utils/utils'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import { styles } from '../../../constants/styles'
import CustomButton from '../../../components/FormComponents/CustomButton'
import CustomItemList from '../../../components/FormComponents/CustomItemList'
import dayjs from 'dayjs'

type CancelForm = {
  open: boolean
  onClose: () => void
  onRejected?: () => void
  reasonList: any
}

const CancelModal: React.FC<CancelForm> = ({
  open,
  onClose,
  onRejected,
  reasonList
}) => {
  const { t } = useTranslation()
  const [rejectReasonId, setRejectReasonId] = useState<string[]>([])
  const reasons = [
    {
      id: '1',
      name: t('check_out.reason_1')
    },
    {
      id: '1',
      name: t('check_out.reason_2')
    }
  ]
  const handleRejectRequest = async (rejectReasonId: string[]) => {}

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
              items={reasons}
              multiSelect={setRejectReasonId}
              itemColor={{ bgColor: '#F0F9FF', borderColor: getPrimaryColor() }}
            />
          </Box>

          <Box sx={{ alignSelf: 'center' }}>
            <CustomButton
              text={t('check_in.confirm')}
              color="blue"
              style={{ width: '175px', marginRight: '10px' }}
              onClick={() => {
                handleRejectRequest(rejectReasonId)
                onClose()
              }}
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

const DetailProcessOrder = ({
  drawerOpen,
  handleDrawerClose,
  selectedRow
}: {
  drawerOpen: boolean
  handleDrawerClose: () => void
  selectedRow: ProcessOrderItem | null
}) => {
  const { t } = useTranslation()
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false)
  const { dateFormat } = useContainer(CommonTypeContainer)
  const warehouselist = selectedRow?.processOrderDetail
    .flatMap((detail: any) => detail.processOrderDetailWarehouse)
    .map((warehouse: any) => warehouse.warehouseId)
    .join(', ')

  const onDeleteData = () => {
    setCancelModalOpen(true)
  }

  const handleDelete = () => {}

  let porDetails: any = []

  selectedRow?.processOrderDetail.map((item) => {
    porDetails.push({
      category: item.processAction,
      startTime: item.plannedStartAt,
      weight: item.estInWeight,
      warehouse: item.processOrderDetailWarehouse
        .map((item) => item)
        .join(', '),
      items: [
        {
          status: selectedRow.status,
          details: {
            itemCategory: 'Recycling product',
            mainCategory: 'productTypeId, recycTypeId',
            subcategory: 'productSubTypeId, recycSubTypeId'
          }
        }
      ]
    })
  })

  useEffect(()=> {})

  const dummyData = [
    {
      category: '分類 1',
      items: [
        {
          status: '待處理',
          details: []
        },
        {
          status: '處理後',
          details: []
        }
      ]
    },
    {
      category: '溶膠 2',
      items: [
        {
          status: '待處理',
          details: []
        },
        {
          status: '處理後',
          details: []
        }
      ]
    }
  ]

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
            subTitle: 'POR12333333',
            onSubmit: onDeleteData,
            onDelete: handleDrawerClose,
            onCloseHeader: handleDrawerClose,
            submitText: t('common.delete'),
            cancelText: '',
            statusLabel: 'STARTED'
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
                    {warehouselist}
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
              {porDetails.map((it: any, idx: number) => (
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
                      {it.category}
                    </Typography>
                    <Divider></Divider>
                    {it.items.map((item: any, index: number) => (
                      <Box key={index}>
                        <Typography sx={localStyles.header2}>
                          {item.status}
                        </Typography>

                        <Box sx={localStyles.label}>
                          <div className="flex items-normal w-44">
                            <CalendarTodayIcon sx={localStyles.labelIcon} />
                            <Typography sx={localStyles.label}>
                              {t('processOrder.details.startdateTime')}
                            </Typography>
                          </div>
                          <Typography sx={localStyles.value}>
                            {item.startTime}
                          </Typography>
                        </Box>

                        <Box sx={localStyles.label}>
                          <div className="flex items-normal w-44">
                            <WarehouseIcon sx={localStyles.labelIcon} />
                            <Typography sx={localStyles.label}>
                              {t('processOrder.create.warehouse')}
                            </Typography>
                          </div>
                          <Typography sx={localStyles.value}>
                            {item.warehouse}
                          </Typography>
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
                            <RecyclingIcon sx={localStyles.labelIcon} />
                            <Typography sx={localStyles.label}>
                              {t('processOrder.details.itemCategory')}
                            </Typography>
                          </div>
                          <Box>
                            <Typography
                              sx={{ ...localStyles.value, marginBottom: 1 }}
                            >
                              回收物
                            </Typography>
                            <Typography sx={localStyles.value}>產品</Typography>
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
                            <Typography
                              sx={{ ...localStyles.value, marginBottom: 1 }}
                            >
                              報紙
                            </Typography>
                            <Typography sx={localStyles.value}>
                              1號膠
                            </Typography>
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
                            <Typography sx={localStyles.value}>廢紙</Typography>
                            <Typography sx={localStyles.value}>水樽</Typography>
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
            onClose={handleDrawerClose}
            reasonList={[]}
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
