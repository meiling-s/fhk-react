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
import PurchaseOrderForm from './PurchaseOrderForm'

import StatusCard from '../../../components/StatusCard'

import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import CustomItemList, {
  il_item
} from '../../../components/FormComponents/CustomItemList'

import {
  getAllPurchaseOrder,
  updateStatusPurchaseOrder,
  getPurchaseOrderReason
} from '../../../APICalls/Manufacturer/purchaseOrder'

import { getStatusList } from '../../../APICalls/status'

import {
  PurChaseOrder,
  PurchaseOrderDetail,
  queryPurchaseOrder
} from '../../../interfaces/purchaseOrder'
import i18n from '../../../setups/i18n'
import { displayCreatedDate } from '../../../utils/utils'
import TableOperation from '../../../components/TableOperation'
import { Languages, Roles, localStorgeKeyName } from '../../../constants/constant'
import dayjs from 'dayjs'

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
      updatedBy: selectedRow.updatedBy
    }

    try {
      const result = await updateStatusPurchaseOrder(
        selectedRow.poId,
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
      updatedBy: selectedRow.updatedBy
    }
    try {
      const result = await updateStatusPurchaseOrder(
        selectedRow.poId,
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

const PurchaseOrder = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0);
  const realm = localStorage.getItem(localStorgeKeyName.realm) || '';
  const userRole = localStorage.getItem(localStorgeKeyName.role) || '';
  const rolesEnableCreatePO = [Roles.customerAdmin]

  let columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: t('purchase_order.table.created_datetime'),
      width: 150
    },
    {
      field: 'poId',
      headerName: t('purchase_order.table.order_number'),
      width: 220,
      editable: true
    },
    {
      field: 'picoId',
      headerName: t('purchase_order.table.pico_id'),
      type: 'string',
      width: 220,
      editable: true
    },
    {
      field: 'receiverAddr',
      headerName: t('purchase_order.table.place_receipt'),
      type: 'string',
      width: 200,
      editable: true
    },
    {
      field: 'createdAt',
      headerName: t('purchase_order.table.receipt_date_time'),
      type: 'sring',
      width: 260,
      editable: true,
      valueGetter: (params) => {
        return params?.row?.purchaseOrderDetail[0]?.pickupAt
      }
    },
    {
      field: 'status',
      headerName: t('purchase_order.table.status'),
      type: 'string',
      width: 150,
      editable: true,
      renderCell: (params) => <StatusCard status={params.value} />
    },
    {
      field: 'operation',
      headerName: t('purchase_order.table.operation'),
      type: 'string',
      width: 250,
      editable: true,
      renderCell: (params) => (
        <TableOperation
          row={params.row}
          onApprove={showApproveModal}
          onReject={showRejectModal}
          navigateToJobOrder={navigateToJobOrder}
          color="blue"
        />
      )
    }
  ]

  if(rolesEnableCreatePO.includes(userRole)){
    columns = [
      {
        field: 'createdAt',
        headerName: t('purchase_order.table.created_datetime'),
        width: 150
      },
      {
        field: 'senderName',
        headerName: t('purchase_order_customer.table.recycling_plant'),
        width: 150
      },
      {
        field: 'poId',
        headerName: t('purchase_order.table.order_number'),
        width: 220,
        editable: true
      },
      {
        field: 'picoId',
        headerName: t('purchase_order.table.pico_id'),
        type: 'string',
        width: 220,
        editable: true
      },
      {
        field: 'receiverAddr',
        headerName: t('purchase_order.table.place_receipt'),
        type: 'string',
        width: 200,
        editable: true
      },
      {
        field: 'approvedAt',
        headerName: t('purchase_order.table.receipt_date_time'),
        type: 'sring',
        width: 260,
        editable: true,
        valueGetter: (params) => {
          if(params?.row?.purchaseOrderDetail[0]?.pickupAt){
            return dayjs(params?.row?.purchaseOrderDetail[0]?.pickupAt).format('YYYY/MM/DD hh:mm')
          } 
        }
      },
      {
        field: 'status',
        headerName: t('purchase_order.table.status'),
        type: 'string',
        width: 150,
        editable: true,
        renderCell: (params) => <StatusCard status={params.value} />
      },
    ]
  }

  const { recycType } = useContainer(CommonTypeContainer)
  const [recycItem, setRecycItem] = useState<il_item[]>([])
  const location = useLocation()
  const action: string = location.state
  const [purchaseOrder, setPurchaseOrder] = useState<PurChaseOrder[]>()
  const [rows, setRows] = useState<Row[]>([])
  const [filteredPico, setFilteredPico] = useState<Row[]>([])
  const [query, setQuery] = useState<queryPurchaseOrder>({
    poId: '',
    fromCreatedAt: '',
    toCreatedAt: '',
    receiverAddr: '',
    recycType: '',
    status: ''
  })
  const [approveModal, setApproveModal] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [reasonList, setReasonList] = useState<any>([])
  const role = localStorage.getItem(localStorgeKeyName.role)
  const [primaryColor, setPrimaryColor] = useState<string>('#79CA25')
  const statusList: Option[] = [
    {
      value: '0',
      label: 'CREATED'
    },
    {
      value: '1',
      label: 'CONFIRMED'
    },
    {
      value: '2',
      label: 'REJECTED'
    },
    {
      value: '3',
      label: 'COMPLETED'
    },
    {
      value: '4',
      label: 'CLOSED'
    },
    {
      value: '',
      label: 'any'
    },
  ]

  const initPurchaseOrderRequest = async () => {
    setPurchaseOrder([])
    setTotalData(0)
    let result = null

    result = await getAllPurchaseOrder(page - 1, pageSize, query)

    const data = result?.data.content
    if (data && data.length > 0) {
      setPurchaseOrder(data)
    } else {
      setPurchaseOrder([])
    }
    setTotalData(result?.data.totalPages)
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
    initPurchaseOrderRequest()
  }

  const getRejectReason = async () => {
    let result = await getPurchaseOrderReason()

    if (result && result?.data && result?.data.content.length > 0) {
      let reasonName = ''
      switch (i18n.language) {
        case 'enus':
          reasonName = 'reasonNameEng'
          break
        case 'zhch':
          reasonName = 'reasonNameSchi'
          break
        case 'zhhk':
          reasonName = 'reasonNameTchi'
          break
        default:
          reasonName = 'reasonNameEng'
          break
      }
      result?.data.content.map(
        (item: { [x: string]: any; id: any; reasonId: any; name: any }) => {
          item.id = item.reasonId
          item.name = item[reasonName]
        }
      )
      setReasonList(result?.data.content)
    }
  }

  useEffect(() => {
    setPrimaryColor(
      role === 'manufacturer' || role === 'customer' ? '#6BC7FF' : '#79CA25'
    )
  }, [role])

  useEffect(() => {
    initPurchaseOrderRequest()
  }, [i18n.language])

  useEffect(() => {
    initPurchaseOrderRequest()
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

  useEffect(() => {
    const tempRows: any[] = (
      purchaseOrder?.map((item) => ({
        ...item,
        id: item.poId,
        createdAt: displayCreatedDate(item.createdAt),
        poId: item.poId,
        picoId: item.picoId,
        receiverAddr: item.receiverAddr,
        approvedAt: displayCreatedDate(item.approvedAt),
        status: item.status,
        recyType: item.purchaseOrderDetail.map((item) => {
          return item.recycTypeId
        })
      })) ?? []
    ).filter((item) => item.status !== 'CLOSED')
    setRows(tempRows)
    setFilteredPico(tempRows)
  }, [purchaseOrder])

  interface Row {
    id: number
    createdAt: string
    poId: string
    picoId: string
    receiverAddr: string
    approvedAt: string
    status: string
    recyType: string
  }
  const searchfield = [
    { label: t('pick_up_order.filter.search'), width: '14%', field: 'poId' },
    {
      label: t('pick_up_order.filter.dateby'),
      width: '10%',
      options: getUniqueOptionsDate('createdAt'),
      field: 'fromCreatedAt'
    },
    {
      label: t('pick_up_order.filter.to'),
      width: '10%',
      options: getUniqueOptionsDate('approvedAt'),
      field: 'toCreatedAt'
    },
    {
      label: t('warehouse_page.place'),
      width: '14%',
      options: getUniqueOptions('receiverAddr'),
      field: 'receiverAddr'
    },

    {
      label: t('pick_up_order.filter.recycling_category'),
      width: '14%',
      options: getReycleOption(),
      field: 'recycType'
    },
    {
      label: t('pick_up_order.filter.status'),
      width: '14%',
      options: statusList,
      field: 'status'
    }
  ]

  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<Row | null>(null)

  function getUniqueOptionsDate(propertyName: keyof Row) {
    const optionMap = new Map()
   
    rows.forEach((row) => {
      if(row[propertyName] !== '') {
        const date = dayjs(row[propertyName]).format('YYYY-MM-DD')
        optionMap.set(date, date)
      }
    })

    let options: Option[] = Array.from(optionMap.values()).map((option) => ({
      value: option,
      label: option
    }))
    options.push({
      value: '',
      label: 'any'
    })
    return options
  }

  function getUniqueOptions(propertyName: keyof Row) {
    const optionMap = new Map()

    rows.forEach((row) => {
      if(row[propertyName] !== '') {
        optionMap.set(row[propertyName], row[propertyName])
      }
    })

    let options: Option[] = Array.from(optionMap.values()).map((option) => ({
      value: option,
      label: option
    }))
    options.push({
      value: '',
      label: 'any'
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
      label: 'any'
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
    const row = params.row as Row
    setSelectedRow(row)
    setOpenModal(true)
  }

  const updateQuery = (newQuery: Partial<queryPurchaseOrder>) => {
    setQuery({ ...query, ...newQuery })
  }

  const handleSearch = (keyName: string, value: string) => {
    updateQuery({ [keyName]: value })
  }
  
  return (
    <>
      <ToastContainer />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Modal open={openModal} onClose={handleCloses}>
          <PurchaseOrderForm
            onClose={handleCloses}
            selectedRow={selectedRow}
            purchaseOrder={purchaseOrder}
            initPickupOrderRequest={initPurchaseOrderRequest}
          />
        </Modal>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: '6px' }}>
          <Typography fontSize={20} color="black" fontWeight="bold">
            {t('purchase_order.all_order')}
          </Typography>

          {rolesEnableCreatePO.includes(userRole) && (
             <Button
                // onClick={() => navigate(`/${realm}/createPurchaseOrder`)}
                sx={{
                  borderRadius: "20px",
                  backgroundColor: "#6BC7FF",
                  '&.MuiButton-root:hover':{bgcolor: '#6BC7FF'},
                  width:'fit-content',
                  height: "40px",
                  marginLeft:'20px'
                }}
                variant='contained'
              >
                + {t("col.create")}
            </Button>
          )}
         
        </Box>
        <Box />
        <Stack direction="row" mt={3}>
          {searchfield.map((s) => (
            <CustomSearchField
              key={s.field}
              label={s.label}
              width={s.width}
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
            checkboxSelection
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            getRowSpacing={getRowSpacing}
            hideFooter
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
      </Box>
    </>
  )
}

export default PurchaseOrder

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
