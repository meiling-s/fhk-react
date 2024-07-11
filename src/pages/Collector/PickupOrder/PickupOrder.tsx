import { Button, Modal, Typography, Pagination, Divider } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useLocation, useNavigate } from 'react-router'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams
} from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import CustomSearchField from '../../../components/TableComponents/CustomSearchField'
import PickupOrderForm from '../../../components/FormComponents/PickupOrderFormCustom'
import StatusCard from '../../../components/StatusCard'

import { PickupOrder, queryPickupOrder } from '../../../interfaces/pickupOrder'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import CustomItemList, {
  il_item
} from '../../../components/FormComponents/CustomItemList'
import {
  getAllPickUpOrder,
  getAllLogisticsPickUpOrder,
  getAllReason,
  editPickupOrderDetailStatus
} from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import { editPickupOrderStatus } from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import i18n from '../../../setups/i18n'
import { displayCreatedDate, extractError, showErrorToast, showSuccessToast } from '../../../utils/utils'
import TableOperation from '../../../components/TableOperation'
import {
  STATUS_CODE,
  localStorgeKeyName,
  Languages
} from '../../../constants/constant'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import useLocaleText from '../../../hooks/useLocaleTextDataGrid'
import { weekDs } from '../../../components/SpecializeComponents/RoutineSelect/predefinedOption'

dayjs.extend(utc)
dayjs.extend(timezone)

type Approve = {
  open: boolean
  onClose: () => void
  selectedRow: any
}

const ApproveModal: React.FC<Approve> = ({ open, onClose, selectedRow }) => {
  const { t } = useTranslation()

  const onApprove = async () => {
    const updatePoStatus = {
      status: 'CONFIRMED',
      reason: selectedRow.reason,
      updatedBy: selectedRow.updatedBy
    }
    try {
      const result = await editPickupOrderStatus(
        selectedRow.picoId,
        updatePoStatus
      )
      if (result) {
        toast.info(t('pick_up_order.approved_success'), {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        })
        onClose()
      }
    } catch (error) {
      console.error('Error approve:', error)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold' }}
            >
              {t('pick_up_order.confirm_approve_title')}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ alignSelf: 'center' }}>
            <button
              className="primary-btn mr-2 cursor-pointer"
              onClick={() => {
                onApprove()
              }}
            >
              {t('pick_up_order.confirm_approve')}
            </button>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={() => {
                onClose()
              }}
            >
              {t('pick_up_order.cancel')}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

const Required = () => {
  return (
    <Typography
      sx={{
        color: 'red',
        ml: '5px'
      }}
    >
      *
    </Typography>
  )
}

type rejectForm = {
  open: boolean
  onClose: () => void
  selectedRow: any
  reasonList: any
}

function RejectForm({ open, onClose, selectedRow, reasonList }: rejectForm) {
  const { t } = useTranslation()
  const [rejectReasonId, setRejectReasonId] = useState<string>('')
  const handleConfirmRejectOnClick = async (rejectReasonId: string) => {
    const rejectReasonItem = reasonList.find(
      (item: { id: string }) => item.id === rejectReasonId
    )
    const reason = rejectReasonItem?.name || ''
    const updatePoStatus = {
      status: 'REJECTED',
      reason: reason,
      updatedBy: selectedRow.updatedBy
    }
    try {
      const result = await editPickupOrderStatus(
        selectedRow.picoId,
        updatePoStatus
      )
      if (result) {
        toast.info(t('pick_up_order.rejected_success'), {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        })
        onClose()
      }
    } catch (error) {
      console.error('Error reject:', error)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold' }}
            >
              {t('pick_up_order.confirm_reject_title')}
            </Typography>
          </Box>
          <Box>
            <Typography sx={localstyles.typo}>
              {t('pick_up_order.reject_reasons')}
              <Required />
            </Typography>
            <CustomItemList
              items={reasonList}
              singleSelect={setRejectReasonId}
            />
          </Box>

          <Box sx={{ alignSelf: 'center' }}>
            <button
              className="primary-btn mr-2 cursor-pointer"
              onClick={() => {
                handleConfirmRejectOnClick(rejectReasonId)
                onClose()
              }}
            >
              {t('pick_up_order.confirm_reject')}
            </button>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={() => {
                onClose()
              }}
            >
              {t('pick_up_order.cancel')}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

interface Option {
  value: string
  label: string
}

interface StatusPickUpOrder {
  value: string
  labelEng: string
  labelSchi: string
  labelTchi: string
}

interface Company {
  nameEng?: string
  nameSchi?: string
  nameTchi?: string
}

const PickupOrders = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const [showOperationColumn, setShowOperationColumn] = useState<Boolean>(false)
  const role = localStorage.getItem(localStorgeKeyName.role)
  let columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: t('pick_up_order.table.created_datetime'),
      width: 150,
      renderCell: (params) => {
        return dayjs
          .utc(params.row.createdAt)
          .tz('Asia/Hong_Kong')
          .format(`${dateFormat} HH:mm`)
      }
    },
    {
      field: 'logisticCompany',
      headerName: t('pick_up_order.table.logistic_company'),
      width: 170,
      editable: true
    },
    {
      field: 'picoId',
      headerName: t('pick_up_order.table.pico_id'),
      type: 'string',
      width: 220,
      editable: true
    },
    {
      field: 'deliveryDate',
      headerName: t('pick_up_order.table.delivery_date'),
      type: 'string',
      width: 200,
      editable: true
    },
    {
      field: 'senderCompany',
      headerName: t('pick_up_order.table.sender_company'),
      type: 'sring',
      width: 260,
      editable: true
    },
    {
      field: 'receiver',
      headerName: t('pick_up_order.table.receiver'),
      type: 'string',
      width: 260,
      editable: true
    },
    {
      field: 'status',
      headerName: t('pick_up_order.table.status'),
      type: 'string',
      width: 120,
      editable: true,
      renderCell: (params) => <StatusCard status={params.value} />
    }
    // showOperationColumn && {
    //   field: "operation",
    //   headerName: t('pick_up_order.table.operation'),
    //   type: "string",
    //   width: 220,
    //   editable: true,
    //   filterable: false,
    //   renderCell: (params) => (
    //     <TableOperation
    //       row={params.row}
    //       onApprove={showApproveModal}
    //       onReject={showRejectModal}
    //       navigateToJobOrder={navigateToJobOrder}
    //     />
    //   ),
    // },
  ]

  if (role === 'logistic') {
    columns = [
      ...columns,
      {
        field: 'operation',
        headerName: t('pick_up_order.table.operation'),
        type: 'string',
        width: 220,
        editable: true,
        filterable: false,
        renderCell: (params) => (
          <TableOperation
            row={params.row}
            onApprove={showApproveModal}
            onReject={showRejectModal}
            navigateToJobOrder={navigateToJobOrder}
          />
        )
      }
    ]
  }
  const { recycType, dateFormat, manuList, collectorList, logisticList } =
    useContainer(CommonTypeContainer)
  const [actions, setActions] = useState<'add' | 'edit' | 'delete'>('add')
  // const {pickupOrder} = useContainer(CheckInRequestContainer)
  const [recycItem, setRecycItem] = useState<il_item[]>([])
  const location = useLocation()
  const action: string = location.state
  const [pickupOrder, setPickupOrder] = useState<PickupOrder[]>()
  const [rows, setRows] = useState<Row[]>([])
  const [filteredPico, setFilteredPico] = useState<Row[]>([])
  const [query, setQuery] = useState<queryPickupOrder>({
    picoId: '',
    effFromDate: '',
    effToDate: '',
    logisticName: '',
    recycType: '',
    senderName: '',
    status: null
  })
  const [approveModal, setApproveModal] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [reasonList, setReasonList] = useState<{reasonId: string, name: string}[]>([])
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [primaryColor, setPrimaryColor] = useState<string>('#79CA25')
  const statusList: StatusPickUpOrder[] = [
    {
      value: '0',
      labelEng: 'CREATED',
      labelSchi: '待处理',
      labelTchi: '待處理'
    },
    {
      value: '1',
      labelEng: 'STARTED',
      labelSchi: '处理中',
      labelTchi: '處理中'
    },
    {
      value: '2',
      labelEng: 'CONFIRMED',
      labelSchi: '已确认',
      labelTchi: '已確認'
    },
    {
      value: '3',
      labelEng: 'REJECTED',
      labelSchi: '已拒绝',
      labelTchi: '已拒絕'
    },
    {
      value: '4',
      labelEng: 'COMPLETED',
      labelSchi: '已完成',
      labelTchi: '已完成'
    },
    {
      value: '5',
      labelEng: 'CLOSED',
      labelSchi: '已取消',
      labelTchi: '已取消'
    },
    {
      value: '6',
      labelEng: 'OUTSTANDING',
      labelSchi: '已逾期',
      labelTchi: '已逾期'
    },
    {
      value: '',
      labelEng: t('localizedTexts.filterValueAny'),
      labelSchi: '任何',
      labelTchi: '任何'
    }
  ]
  const { localeTextDataGrid } = useLocaleText()

  let listCompany: Company[] = []
  if (collectorList && collectorList?.length >= 1) {
    const collectors: Company[] = collectorList?.map((item) => {
      return {
        nameEng: item.collectorNameEng,
        nameSchi: item.collectorNameSchi,
        nameTchi: item.collectorNameTchi
      }
    })
    listCompany = [...listCompany, ...collectors]
  }

  if (manuList && manuList.length >= 1) {
    const manus: Company[] = manuList?.map((item) => {
      return {
        nameEng: item.manufacturerNameEng,
        nameSchi: item.manufacturerNameSchi,
        nameTchi: item.manufacturerNameTchi
      }
    })
    listCompany = [...listCompany, ...manus]
  }

  const initPickupOrderRequest = async () => {
    try {
      setPickupOrder([])
      setTotalData(0)
      let result = null
      if (role === 'logistic') {
        result = await getAllLogisticsPickUpOrder(page - 1, pageSize, query)
      } else {
        result = await getAllPickUpOrder(page - 1, pageSize, query)
      }
      let data = result?.data.content
      if (data && data.length > 0) {
        data = data.map((item: any) => {
          const pickupOrderDetail = item?.pickupOrderDetail[0]
          const logisticName = item.logisticName
          const logistic = logisticList?.find((item) => {
            if (
              item.logisticNameEng === logisticName ||
              item.logisticNameSchi === logisticName ||
              item.logisticNameTchi === logisticName
            ) {
              return item
            }
          })

          if (logistic && i18n.language === Languages.ENUS) {
            item.logisticName = logistic.logisticNameEng
          } else if (logistic && i18n.language === Languages.ZHCH) {
            item.logisticName = logistic.logisticNameSchi
          } else if (logistic && i18n.language === Languages.ZHHK) {
            item.logisticName = logistic.logisticNameTchi
          }

          const receiver = listCompany.find((item) => {
            if (
              item.nameEng === pickupOrderDetail?.receiverName ||
              item.nameSchi === pickupOrderDetail.receiverName ||
              item.nameTchi === pickupOrderDetail.receiverName
            ) {
              return item
            }
          })

          if (receiver && i18n.language === Languages.ENUS) {
            pickupOrderDetail.receiverName = receiver.nameEng
          } else if (receiver && i18n.language === Languages.ZHCH) {
            pickupOrderDetail.receiverName = receiver.nameSchi
          } else if (receiver && i18n.language === Languages.ZHHK) {
            pickupOrderDetail.receiverName = receiver.nameTchi
          }

          const senderName = listCompany.find((item) => {
            if (
              item.nameEng === pickupOrderDetail?.senderName ||
              item.nameSchi === pickupOrderDetail.senderName ||
              item.nameTchi === pickupOrderDetail.senderName
            ) {
              return item
            }
          })

          if (senderName && i18n.language === Languages.ENUS) {
            pickupOrderDetail.senderName = senderName.nameEng
          } else if (senderName && i18n.language === Languages.ZHCH) {
            pickupOrderDetail.senderName = senderName.nameSchi
          } else if (senderName && i18n.language === Languages.ZHHK) {
            pickupOrderDetail.senderName = senderName.nameTchi
          }
          item.pickupOrderDetail[0] = pickupOrderDetail
          return item
        })
        setPickupOrder(data)
      } else {
        setPickupOrder([])
      }
      setTotalData(result?.data.totalPages)
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const showApproveModal = (row: any) => {
    setSelectedRow(row)
    setApproveModal(true)
  }
  const showRejectModal = (row: any) => {
    setSelectedRow(row)
    setRejectModal(true)
  }
  const navigateToJobOrder = (row: any) => {
    if (row?.picoId)
      navigate(`/logistic/createJobOrder/${row.picoId}?isEdit=false`)
  }
  const resetPage = async () => {
    setApproveModal(false)
    setRejectModal(false)
    initPickupOrderRequest()
  }

  const getRejectReason = async () => {
    try {
      let result = await getAllReason()
      if (result && result?.data && result?.data?.content.length > 0) {
        // let reasonName = ''
        // switch (i18n.language) {
        //   case 'enus':
        //     reasonName = 'reasonNameEng'
        //     break
        //   case 'zhch':
        //     reasonName = 'reasonNameSchi'
        //     break
        //   case 'zhhk':
        //     reasonName = 'reasonNameTchi'
        //     break
        //   default:
        //     reasonName = 'reasonNameEng'
        //     break
        // }

        const reasons: { reasonId: string; name: string }[] =
          result?.data?.content.map((item: any) => {
            if (i18n.language === Languages.ENUS) {
              return {
                id: item.reasonId,
                name: item.reasonNameEng
              }
            } else if (i18n.language === Languages.ZHCH) {
              return {
                id: item.reasonId,
                name: item.reasonNameSchi
              }
            } else {
              return {
                id: item.reasonId,
                name: item.reasonNameTchi
              }
            }
          })
        setReasonList(reasons)
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  useEffect(() => {
    setPrimaryColor(
      role === 'manufacturer' || role === 'customer' ? '#6BC7FF' : '#79CA25'
    )
  }, [role])

  useEffect(() => {
    setShowOperationColumn(role === 'logistic')
  }, [role, columns, i18n.language])

  useEffect(() => {
    initPickupOrderRequest()
    getRejectReason()
  }, [i18n.language])

  useEffect(() => {
    initPickupOrderRequest()
    getRejectReason()
    if (action) {
      var toastMsg = ''
      switch (action) {
        case 'created':
          toastMsg = t('pick_up_order.created_pickup_order')
          break
        case 'updated':
          toastMsg = t('pick_up_order.changed_pickup_order')
          break
      }
      toast.info(toastMsg, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      })
    }
    navigate(location.pathname, { replace: true })
  }, [page, query])

  useEffect(() => {
    const recycItems: il_item[] = []
    recycType?.forEach((item) => {
      var name = ''
      switch (i18n.language) {
        case Languages.ENUS:
          name = item.recyclableNameEng
          break
        case Languages.ZHCH:
          name = item.recyclableNameSchi
          break
        case Languages.ZHHK:
          name = item.recyclableNameTchi
          break
        default:
          name = item.recyclableNameTchi
          break
      }
      recycItems.push({
        name: name,
        id: item.recycTypeId.toString()
      })
    })

    setRecycItem(recycItems)
  }, [i18n.language])

  const getDeliveryDay = (deliveryDate: string[]) => {
    const weeks = ['mon', 'tue', 'wed', 'thur', 'fri', 'sat', 'sun']
    let delivery = deliveryDate.map((item) => item.trim())
    let isWeek = false

    for (let deliv of delivery) {
      if (weeks.includes(deliv)) {
        isWeek = true
      }
    }

    if (isWeek) {
      delivery = delivery.map((item) => {
        const days = weekDs.find((day) => day.id === item)
        if (days) {
          if (i18n.language === Languages.ENUS) {
            return days.engName
          } else if (i18n.language === Languages.ZHCH) {
            return days.schiName
          } else {
            return days.tchiName
          }
        } else {
          return ''
        }
      })
    }
    return delivery.join(',')
  }

  const getDeliveryDate = (row: PickupOrder) => {
    if (row.picoType === 'AD_HOC') {
      return `${dayjs
        .utc(row.effFrmDate)
        .tz('Asia/Hong_Kong')
        .format(`${dateFormat}`)} - ${dayjs
        .utc(row.effToDate)
        .tz('Asia/Hong_Kong')
        .format(`${dateFormat}`)}`
    } else if (row.routineType === 'daily') {
      if (i18n.language === Languages.ENUS) {
        return 'Daily'
      } else if(i18n.language === Languages.ZHCH){
        return '每日'
      } else {
        return '每日'
      }
    } else {
      return  t('pick_up_order.every') + ' '  + getDeliveryDay(row.routine)
    }
  }

  useEffect(() => {
    // const mappingData = () => {
    const tempRows: any[] = (
      pickupOrder?.map((item) => ({
        ...item,
        id: item.picoId,
        createdAt: item.createdAt,
        logisticCompany: item.logisticName,
        picoId: item.picoId,
        deliveryDate: getDeliveryDate(item),
        senderCompany:
          item.pickupOrderDetail.filter(
            (detail) => detail.senderName === query.senderName
          ).length > 0
            ? query.senderName
            : item.pickupOrderDetail[0].senderName,
        receiver: item.pickupOrderDetail[0]?.receiverName,
        status: item.status,
        recyType: item.pickupOrderDetail.map((item) => {
          return item.recycType
        }),
        operation: ''

        //}))??[])
      })) ?? []
    ).filter((item) => item.status !== 'CLOSED')
    setRows(tempRows)
    setFilteredPico(tempRows)
    // }
  }, [pickupOrder])

  interface Row {
    id: number
    tenantId: string
    createdAt: string
    logisticCompany: string
    picoId: number
    deliveryDate: string
    senderCompany: string
    receiver: string
    status: string
    recyType: string[]
  }
  const searchfield = [
    {
      label: t('purchase_order.table.pico_id'),
      placeholder: t('check_in.search_input'),
      field: 'picoId',
      width: '260px'
    },
    {
      label: t('pick_up_order.filter.dateby'),
      field: 'effFromDate',
      inputType: 'date'
    },
    {
      label: t('pick_up_order.filter.to'),
      field: 'effToDate',
      inputType: 'date'
    },
    {
      label: t('pick_up_order.filter.logistic_company'),
      options: getUniqueOptions('logisticCompany'),
      field: 'logisticName'
    },
    {
      label: t('check_in.location'),
      options: getUniqueOptions('senderCompany'),
      field: 'senderName'
    },
    {
      label: t('pick_up_order.filter.recycling_category'),
      options: getReycleOption(),
      field: 'recycType'
    },
    {
      label: t('pick_up_order.filter.status'),
      options: getStatusOpion(),
      field: 'status'
    }
  ]

  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<PickupOrder | null>(null)
  function getUniqueOptions(propertyName: keyof Row) {
    const optionMap = new Map()

    rows.forEach((row) => {
      optionMap.set(row[propertyName], row[propertyName])
    })

    let options: Option[] = Array.from(optionMap.values()).map((option) => ({
      value: option,
      label: option
    }))
    options.push({
      value: '',
      label: t('localizedTexts.filterValueAny')
    })
    return options
  }

  function getReycleOption() {
    const options: Option[] = recycItem.map((item) => ({
      value: item.id,
      label: item.name
    }))
    options.push({
      value: '',
      label: t('localizedTexts.filterValueAny')
    })
    return options
  }
  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])
  const handleCloses = () => {
    setOpenModal(false)
  }
  const handleRowClick = (params: GridRowParams) => {
    const row = params.row as PickupOrder
    setSelectedRow(row)
    setOpenModal(true)
  }

  const updateQuery = (newQuery: Partial<queryPickupOrder>) => {
    setQuery({ ...query, ...newQuery })
  }

  const handleSearch = (keyName: string, value: string) => {
    setPage(1)
    if (keyName == 'status') {
      // const statusMapping: { [key: string]: number } = {
      //   CREATED: 0,
      //   STARTED: 1,
      //   CONFIRMED: 2,
      //   REJECTED: 3,
      //   COMPLETED: 4,
      //   CLOSED: 5,
      //   OUTSTANDING: 6
      // };
      const mappedStatus = value != '' ? parseInt(value) : null
      updateQuery({ ...query, [keyName]: mappedStatus })
    } else {
      updateQuery({ [keyName]: value })
    }
  }

  function getStatusOpion() {
    const options: Option[] = statusList.map((item) => {
      if (i18n.language === Languages.ENUS) {
        return {
          value: item.value,
          label: item.labelEng
        }
      } else if (i18n.language === Languages.ZHCH) {
        return {
          value: item.value,
          label: item.labelSchi
        }
      } else {
        return {
          value: item.value,
          label: item.labelTchi
        }
      }
    })
    return options
  }
  const onDeleteModal = () => {
    setOpenDelete(prev => !prev)
  }

  const onDeleteClick = async () => {
    if (selectedRow) {
      const updatePoStatus = {
        status: 'CLOSED',
        reason: selectedRow.reason,
        updatedBy: selectedRow.updatedBy
      }
      const updatePoDtlStatus = {
        status: 'CLOSED',
        updatedBy: selectedRow.updatedBy
      }
      try {
        const result = await editPickupOrderStatus(
          selectedRow.picoId,
          updatePoStatus
        )
        if (result) {
          const detailUpdatePromises =
            selectedRow.pickupOrderDetail.map((detail) =>
              editPickupOrderDetailStatus(
                detail.picoDtlId.toString(),
                updatePoDtlStatus
              )
            )
          await Promise.all(detailUpdatePromises)
          await initPickupOrderRequest()
          onDeleteModal()
          setOpenModal(false)
          showSuccessToast(t('pick_up_order.error.succeedDeletePickupOrder'))
        }
        
        // navigate('/collector/PickupOrder')
      } catch (error) {
        showErrorToast(t('pick_up_order.error.failedDeletePickupOrder'))
        //console.error('Error updating field:', error)
      }
    } else {
      alert('No selected pickup order')
    }
  }

  return (
    <>
      <ToastContainer />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* <Modal open={openModal} onClose={handleCloses}> */}
          <PickupOrderForm
            openModal={openModal}
            actions={actions}
            onClose={handleCloses}
            selectedRow={selectedRow}
            pickupOrder={pickupOrder}
            initPickupOrderRequest={initPickupOrderRequest}
            onDeleteModal={onDeleteModal}
          />
        {/* </Modal> */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: '6px' }}>
          <Typography fontSize={20} color="black" fontWeight="bold">
            {t('pick_up_order.enquiry_pickup_order')}
          </Typography>
          <Button
            onClick={() => {
              const routeName = role
              navigate(`/${routeName}/createPickupOrder`)
            }}
            sx={{
              borderRadius: '20px',
              backgroundColor: primaryColor,
              '&.MuiButton-root:hover': { bgcolor: primaryColor },
              width: 'fit-content',
              height: '40px',
              marginLeft: '20px'
            }}
            variant="contained"
          >
            + {t('col.create')}
          </Button>
        </Box>
        <Box />
        <Stack direction="row" mt={3}>
          {searchfield.map((s) => (
            <CustomSearchField
              key={s.field}
              label={s.label}
              placeholder={s?.placeholder}
              width={s.width}
              inputType={s.inputType}
              field={s.field}
              options={s.options || []}
              onChange={handleSearch}
            />
          ))}
        </Stack>
        <Box pr={4} pt={3} pb={3} sx={{ flexGrow: 1 }}>
          <DataGrid
            rows={filteredPico}
            columns={columns}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            getRowSpacing={getRowSpacing}
            hideFooter
            localeText={localeTextDataGrid}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                border: 'none' // Remove the borders from the cells
              },
              '& .MuiDataGrid-row': {
                bgcolor: 'white',
                borderRadius: '10px'
              },
              '&>.MuiDataGrid-main': {
                '&>.MuiDataGrid-columnHeaders': {
                  borderBottom: 'none'
                }
              }
            }}
          />
          <Pagination
            count={Math.ceil(totalData)}
            page={page}
            onChange={(_, newPage) => {
              setPage(newPage)
            }}
          />
        </Box>

        <ApproveModal
          open={approveModal}
          onClose={resetPage}
          selectedRow={selectedRow}
        />
        <RejectForm
          open={rejectModal}
          onClose={() => {
            setRejectModal(false)
            resetPage()
          }}
          selectedRow={selectedRow}
          reasonList={reasonList}
        />
         <DeleteModal
          open={openDelete}
          selectedRow={selectedRow}
          onClose={onDeleteModal}
          onDelete={onDeleteClick}
        />
      </Box>
    </>
  )
}

type DeleteModalProps = {
  open: boolean
  selectedRow?: PickupOrder | null
  onClose: () => void
  onDelete: () => void,
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  selectedRow,
  onClose,
  onDelete,
}) => {
  const { t } = useTranslation()
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          <Box sx={{ paddingX: 3, paddingTop: 3 }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold' }}
            >
              {t('pick_up_order.delete_msg')}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ alignSelf: 'center', paddingBottom: 3 }}>
            <button
              className="primary-btn mr-2 cursor-pointer"
              onClick={() => {
                if(selectedRow) onDelete()
              }}
            >
              {t('check_in.confirm')}
            </button>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={() => {
                onClose()
              }}
            >
              {t('check_out.cancel')}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

export default PickupOrders

let localstyles = {
  btn_WhiteGreenTheme: {
    borderRadius: '20px',
    borderWidth: 1,
    borderColor: '#79ca25',
    backgroundColor: 'white',
    color: '#79ca25',
    fontWeight: 'bold',
    '&.MuiButton-root:hover': {
      bgcolor: '#F4F4F4',
      borderColor: '#79ca25'
    }
  },
  table: {
    minWidth: 750,
    borderCollapse: 'separate',
    borderSpacing: '0px 10px'
  },
  headerRow: {
    //backgroundColor: "#97F33B",
    borderRadius: 10,
    mb: 1,
    'th:first-child': {
      borderRadius: '10px 0 0 10px'
    },
    'th:last-child': {
      borderRadius: '0 10px 10px 0'
    }
  },
  row: {
    backgroundColor: '#FBFBFB',
    borderRadius: 10,
    mb: 1,
    'td:first-child': {
      borderRadius: '10px 0 0 10px'
    },
    'td:last-child': {
      borderRadius: '0 10px 10px 0'
    }
  },
  headCell: {
    border: 'none',
    fontWeight: 'bold'
  },
  bodyCell: {
    border: 'none'
  },
  typo: {
    color: '#ACACAC',
    fontSize: 13,
    // fontWeight: "bold",
    display: 'flex'
  },
  textField: {
    borderRadius: '10px',
    fontWeight: '500',
    '& .MuiOutlinedInput-input': {
      padding: '10px'
    }
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '34%',
    height: 'fit-content',
    padding: 4,
    backgroundColor: 'white',
    border: 'none',
    borderRadius: 5
  },
  textArea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    borderColor: '#ACACAC',
    borderRadius: 5
  }
}
