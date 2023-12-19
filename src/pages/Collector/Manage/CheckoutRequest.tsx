import React, { FunctionComponent, useEffect, useState } from 'react'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams
} from '@mui/x-data-grid'
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  Modal,
  Button,
  Typography,
  Divider
} from '@mui/material'
import '../../../styles/Base.css'

import CustomItemList, {
  il_item
} from '../../../components/FormComponents/CustomItemList'
import {
  getAllCheckoutRequest,
  getCheckoutRequestById,
  updateCheckoutRequestStatus
} from '../../../APICalls/Collector/checkout'
import { LEFT_ARROW_ICON, SEARCH_ICON } from '../../../themes/icons'
import CheckInDetails from './CheckInDetails'

import { useTranslation } from 'react-i18next'

type rejectForm = {
  open: boolean
  onClose: () => void

  onRejected?: () => void
}

const RejectForm: React.FC<rejectForm> = ({
  open,
  onClose,
  // checkedShipments,
  onRejected
}) => {
  const { t } = useTranslation()

  const [rejectReasonId, setRejectReasonId] = useState<string[]>([])

  const reasons: il_item[] = [
    {
      id: '1',
      name: '原因 1'
    },
    {
      id: '2',
      name: '原因 2'
    },
    {
      id: '3',
      name: '原因 3'
    }
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styles.modal}>
        <Stack spacing={2}>
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold' }}
            >
              {t('check_in.confirm_reject')}
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography sx={styles.typo}>
              {t('check_in.reject_reasons')}
            </Typography>

            <CustomItemList items={reasons} multiSelect={setRejectReasonId} />
          </Box>

          <Box sx={{ alignSelf: 'center' }}>
            <button
              className="primary-btn mr-2 cursor-pointer"
              onClick={() => {
                onClose()
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
              {t('check_in.cancel')}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

type TableRow = {
  id: number
  [key: string]: any
}

interface CheckoutRequest {
  id: number
  chkOutId: number
  createdAt: string
  vehicleTypeId: string
  receiverName: string
  picoId: string
  adjustmentFlg: boolean
  logisticName: string
  receiverAddr: string
  receiverAddrGps: string
}

const CheckoutRequest: FunctionComponent = () => {
  const { t } = useTranslation()
  const titlePage = t('check_in.request_check_in')
  const approveLabel = t('check_in.approve')
  const rejectLabel = t('check_in.reject')
  const [checkedRows, setCheckedRows] = useState<TableRow[]>([])
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [rejFormModal, setRejFormModal] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [selectedRow, setSelectedRow] = useState<number>(0)
  const [checkoutRequestItem, setCheckoutRequestItem] = useState<
    CheckoutRequest[]
  >([])
  const checkoutHeader: GridColDef[] = [
    {
      field: 'createDate',
      headerName: t('check_out.created_at'),
      type: 'string'
    },
    {
      field: 'shipping_company',
      headerName: t('check_out.shipping_company'),
      width: 120,
      type: 'string'
    },
    {
      field: 'recipient',
      headerName: t('check_in.receiver_company'),
      type: 'string'
    },
    {
      field: 'poNumber',
      headerName: t('check_out.pickup_order_no'),
      width: 150,
      type: 'string'
    },
    {
      field: 'receiver_company',
      headerName: t('check_in.receiver_company'),
      width: 150,
      type: 'string'
    },
    {
      field: 'stockAdjust',
      headerName: t('check_out.stock_adjustment'),
      width: 150,
      type: 'string'
    },
    {
      field: 'logisticsCompany',
      headerName: t('check_out.logistic_company'),
      width: 150,
      type: 'string'
    },
    {
      field: 'deliveryAddr',
      headerName: t('check_in.receiver_addr'),
      type: 'string'
    },
    {
      field: 'arrivalLoc',
      headerName: t('check_out.arrival_location'),
      width: 200,
      type: 'string'
    }
  ]

  const transformToTableRow = (item: CheckoutRequest): TableRow => {
    return {
      id: item.chkOutId,
      createdAt: item.createdAt,
      vehicleTypeId: item.vehicleTypeId,
      receiverName: item.receiverName,
      picoId: item.picoId,
      adjustmentFlg: item.adjustmentFlg,
      logisticName: 'logistic comapny',
      receiverAddr: item.receiverAddr,
      receiverAddrGps: item.receiverAddrGps
    }
  }

  const getCheckoutRequest = async () => {
    const result = await getAllCheckoutRequest()
    const data = result?.data.content
    if (data && data.length > 0) {
      console.log('all checkout request ', data)
      const checkoutData = data.map(transformToTableRow)
      setCheckoutRequestItem(checkoutData)
      console.log(checkoutData)
    }
  }

  useEffect(() => {
    getCheckoutRequest()
  }, [])

  const handleSearch = (s: string) => {}

  const handleCompanyChange = (event: any) => {
    setCompany(event.target.value)
  }

  const handleLocChange = (event: any) => {
    setLocation(event.target.value)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  // const handleCheckAll = (checked: boolean) => {
  //   console.log('checkedAll', checked)
  //   if (checked) {
  //     setCheckedRows(CheckoutRequestItem) // Select all rows
  //   } else {
  //     setCheckedRows([]) // Unselect all rows
  //   }
  // }

  // Handle selecting/deselecting individual row
  // const handleCheckRow = (checked: boolean, row: TableRow) => {
  //   console.log('checkedRow', checked, row)
  //   if (checked) {
  //     setCheckedRows((prev) => [...prev, row])
  //   } else {
  //     setCheckedRows((prev) =>
  //       prev.filter(
  //         (existingRow) => JSON.stringify(existingRow) !== JSON.stringify(row)
  //       )
  //     )
  //   }
  //   console.log(checkedRows)
  // }

  const handleSelectRow = (params: GridRowParams) => {
    const row = params.row as TableRow
    setSelectedRow(row.id)
    setDrawerOpen(true)
  }

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  return (
    <Box className="container-wrapper w-full mr-11">
      <div className="overview-page bg-bg-primary">
        <div className="header-page flex justify-start items-center mb-8">
          <LEFT_ARROW_ICON fontSize="large" />
          <div className="title font-bold text-3xl pl-4 ">{titlePage}</div>
        </div>
        <div className="action-overview mb-8">
          <button className="primary-btn mr-2 cursor-pointer">
            {approveLabel}
          </button>
          <button
            className="secondary-btn cursor-pointer"
            onClick={() => setRejFormModal(true)}
          >
            {rejectLabel}
          </button>
        </div>
        <div className="filter-section flex justify-between items-center w-full">
          <TextField
            id="searchShipment"
            onChange={(event) => handleSearch(event.target.value)}
            sx={styles.inputState}
            label={t('check_in.search')}
            placeholder={t('check_in.search_input')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => {}}>
                    <SEARCH_ICON style={{ color: '#79CA25' }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <FormControl sx={styles.dropDown}>
            <InputLabel id="company-label">
              {t('check_in.sender_company')}
            </InputLabel>
            <Select
              labelId="company-label"
              id="company"
              value={company}
              label="寄件公司"
              onChange={handleCompanyChange}
            >
              <MenuItem value="">
                <em>{t('check_in.any')}</em>
              </MenuItem>
              {/* {shipments.map((item) => (
                  <MenuItem value={item.senderAddr}>{item.senderAddr}</MenuItem>
                ))} */}
            </Select>
          </FormControl>
          <FormControl sx={styles.dropDown}>
            <InputLabel id="location-label">
              {t('check_in.sender_addr')}
            </InputLabel>
            <Select
              labelId="location-label"
              id="location"
              value={location}
              label="送出地點"
              onChange={handleLocChange}
            >
              <MenuItem value="">
                <em>{t('check_in.any')}</em>
              </MenuItem>
              {/* {shipments.map((item) => (
                  <MenuItem value={item.senderAddr}>{item.senderAddr}</MenuItem>
                ))} */}
            </Select>
          </FormControl>
        </div>
        <div className="table-overview">
          <Box pr={4} pt={3} sx={{ flexGrow: 1, width: '100%' }}>
            <DataGrid
              rows={checkoutRequestItem}
              hideFooter
              columns={checkoutHeader}
              checkboxSelection
              disableRowSelectionOnClick
              onRowClick={handleSelectRow}
              getRowSpacing={getRowSpacing}
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  border: 'none'
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
          </Box>
          {/* <Box className="w-full">
            <TableBase
              header={headerTitles}
              dataRow={CheckoutRequestItem}
              useAction={false}
              checkAll={checkedRows.length === CheckoutRequestItem.length}
              onCheckAll={handleCheckAll}
              checkedRows={checkedRows}
              onCheckRow={handleCheckRow}
              onSelectRow={handleSelectRow}
              selectedRow={selectedRow}
            />
          </Box> */}
        </div>
      </div>
      <RejectForm
        open={rejFormModal}
        onClose={() => {
          setRejFormModal(false)
        }}
        // onRejected={() => initShipments()}
      />
      <CheckInDetails
        drawerOpen={drawerOpen}
        handleDrawerClose={handleDrawerClose}
      />
    </Box>
  )
}

let styles = {
  typo: {
    color: 'grey',
    fontSize: 14
  },
  inputState: {
    mt: 3,
    width: '100%',
    m: 1,
    borderRadius: '10px',
    bgcolor: 'white',
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '& fieldset': {
        borderColor: '#79CA25'
      },
      '&:hover fieldset': {
        borderColor: '#79CA25'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#79CA25'
      },
      '& label.Mui-focused': {
        color: '#79CA25' // Change label color when input is focused
      }
    }
  },
  dropDown: {
    mt: 3,
    m: 1,
    borderRadius: '10px',
    width: '100%',
    bgcolor: 'white',
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '& fieldset': {
        borderColor: '#79CA25'
      },
      '&:hover fieldset': {
        borderColor: '#79CA25'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#79CA25'
      }
    }
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
      width: '70%' /* Adjust the width for mobile devices */
    }
  }
}

export default CheckoutRequest
