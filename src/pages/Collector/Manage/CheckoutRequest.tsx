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
  Modal,
  Typography,
  Divider
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import '../../../styles/Base.css'

import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

import CustomItemList, {
  il_item
} from '../../../components/FormComponents/CustomItemList'
import {
  getAllCheckoutRequest,
  // getCheckoutRequestById,
  updateCheckoutRequestStatus
} from '../../../APICalls/Collector/checkout'
import { LEFT_ARROW_ICON, SEARCH_ICON } from '../../../themes/icons'
import CheckInDetails from './CheckOutDetails'
import { updateStatus } from '../../../interfaces/warehouse'
import { CheckOut } from '../../../interfaces/checkout'

import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { format } from '../../../constants/constant'

// interface CheckOut {
//   id: number
//   chkOutId: number
//   createdAt: string
//   vehicleTypeId: string
//   receiverName: string
//   picoId: string
//   adjustmentFlg: boolean
//   logisticName: string
//   receiverAddr: string
//   receiverAddrGps: string
// }

type TableRow = {
  id: number
  [key: string]: any
}

type ApproveForm = {
  open: boolean
  onClose: () => void
  checkedCheckOut: CheckOut[]
  onApprove?: () => void
}

type RejectForm = {
  open: boolean
  onClose: () => void
  onRejected?: () => void
}

type Confirm = {
  open: boolean
  onClose: () => void
  title?: string
}

// const dummyCheckoutbyId: CheckOut = {
//   chkOutId: 1,
//   logisticName: 'string',
//   logisticId: 'string',
//   vehicleTypeId: 'string',
//   plateNo: 'string',
//   receiverName: 'string',
//   receiverId: 'string',
//   receiverAddr: 'string',
//   receiverAddrGps: [0],
//   warehouseId: 0,
//   colId: 0,
//   collectorId: 0,
//   status: 'COMPLETED',
//   reason: ['string'],
//   picoId: 'null',
//   signature: 'string',
//   normalFlg: true,
//   adjustmentFlg: true,
//   createdBy: 'string',
//   updatedBy: 'string',
//   checkoutDetail: [
//     {
//       chkOutDtlId: 1,
//       recycTypeId: 'string',
//       recycSubtypeId: 'string',
//       packageTypeId: 'string',
//       weight: 0,
//       unitId: 'string',
//       itemId: 'string',
//       checkoutDetailPhoto: [
//         {
//           sid: 1,
//           photo: 'string'
//         }
//       ],
//       pickupOrderHistory: null,
//       createdBy: 'string',
//       updatedBy: 'string'
//     }
//   ],
//   createdAt: '2023-12-19T10:09:26.576964',
//   updatedAt: '2023-12-19T10:19:01.799599'
// }

const ConfirmModal: React.FC<Confirm> = ({ open, onClose, title }) => {
  const { t } = useTranslation()

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
              sx={{ fontWeight: 'medium' }}
            >
              {title + t('check_out.success_approve')}
            </Typography>
          </Box>
          <Box sx={{ alignSelf: 'center' }}>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={() => {
                onClose()
              }}
            >
              {t('check_out.ok')}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

const ApproveModal: React.FC<ApproveForm> = ({
  open,
  onClose,
  checkedCheckOut,
  onApprove
}) => {
  const { t } = useTranslation()
  const idsCheckOut: number[] = checkedCheckOut?.map((item) => {
    return item.chkOutId
  })

  const handleApproveRequest = async () => {
    const confirmReason: string[] = ['Confirmed']
    const statReason: updateStatus = {
      status: 'CONFIRMED',
      reason: confirmReason,
      updatedBy: 'admin'
    }

    const results = await Promise.allSettled(
      idsCheckOut.map(async (checkOutId) => {
        try {
          const result = await updateCheckoutRequestStatus(
            checkOutId,
            statReason
          )
          const data = result?.data
          if (data) {
            console.log('updated check-in status: ', data)
            if (onApprove) {
              onApprove()
            }
          }
        } catch (error) {
          console.error(
            `Failed to update check-in status for id ${checkOutId}: `,
            error
          )
        }
      })
    )
  }

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
              {t('check_out.confirm_approve')}
            </Typography>
          </Box>
          <Divider />
          <Box className="flex gap-2 justify-start">
            {idsCheckOut?.map((id) => (
              <Typography sx={styles.typo}>{id}</Typography>
            ))}
          </Box>

          <Box sx={{ alignSelf: 'center' }}>
            <button
              className="primary-btn mr-2 cursor-pointer"
              onClick={() => {
                handleApproveRequest()
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

const RejectModal: React.FC<RejectForm> = ({
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
              {t('check_out.confirm_reject')}
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography sx={styles.typo}>
              {t('check_out.reject_reasons')}
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

const CheckoutRequest: FunctionComponent = () => {
  const { t } = useTranslation()
  const titlePage = t('check_out.request_check_out')
  const approveLabel = t('check_out.approve')
  const rejectLabel = t('check_out.reject')
  const [location, setLocation] = useState('')
  const [rejFormModal, setRejectModal] = useState<boolean>(false)
  const [approveModal, setApproveModal] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [selectedRow, setSelectedRow] = useState<CheckOut>()
  const [checkedCheckOut, setCheckedCheckOut] = useState<CheckOut[]>([])
  const [company, setCompany] = useState('')
  const [filterCheckOut, setFilterCheckOut] = useState<CheckOut[]>([])
  const [checkOutRequest, setCheckoutRequest] = useState<CheckOut[]>([])
  const checkoutHeader: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: t('check_out.created_at'),
      type: 'string',
      width: 200
    },
    {
      field: 'vehicleTypeId',
      headerName: t('check_out.shipping_company'),
      width: 150,
      type: 'string'
    },
    {
      field: 'receiverName',
      headerName: t('check_in.receiver_company'),
      type: 'string',
      width: 150
    },
    {
      field: 'picoId',
      headerName: t('check_out.pickup_order_no'),
      width: 150,
      type: 'string'
    },
    {
      field: 'adjustmentFlg',
      headerName: t('check_out.stock_adjustment'),
      width: 150,
      type: 'string',
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            {params.row.adjustmentFlg ? (
              <CheckIcon className="text-green-primary" />
            ) : (
              <CloseIcon className="text-red" />
            )}
          </div>
        )
      }
    },
    {
      field: 'logisticName',
      headerName: t('check_out.logistic_company'),
      width: 200,
      type: 'string'
    },
    {
      field: 'receiverAddr',
      headerName: t('check_in.receiver_addr'),
      type: 'string',
      width: 200
    },
    {
      field: 'receiverAddrGps',
      headerName: t('check_out.arrival_location'),
      width: 200,
      type: 'string'
    }
  ]

  const transformToTableRow = (item: CheckOut): TableRow => {
    const createdDate = item.createdAt
      ? dayjs(new Date(item.createdAt)).format(format.dateFormat1)
      : '-'
    return {
      id: item.chkOutId,
      chkOutId: item.chkOutId,
      createdAt: createdDate,
      vehicleTypeId: item.vehicleTypeId,
      receiverName: item.receiverName,
      picoId: item.picoId,
      adjustmentFlg: item.adjustmentFlg,
      logisticName: item.logisticName,
      receiverAddr: item.receiverAddr,
      receiverAddrGps: "-"
    }
  }

  const getCheckoutRequest = async () => {
    const result = await getAllCheckoutRequest()
    const data = result?.data.content
    if (data && data.length > 0) {
      const checkoutData = data.map(transformToTableRow)
      setCheckoutRequest(data)
      setFilterCheckOut(checkoutData)
    }
  }

  useEffect(() => {
    getCheckoutRequest()
  }, [])

  const handleSearchByPoNumb = (searchWord: string) => {
    if (searchWord != '') {
      const filteredCheckOut: CheckOut[] = []
      checkOutRequest.map((item) => {
        if (item.picoId.includes(searchWord)) {
          filteredCheckOut.push(item)
        }
      })
      if (filteredCheckOut) {
        setFilterCheckOut(filteredCheckOut)
      }
    } else {
      setFilterCheckOut(checkOutRequest)
    }
  }

  const handleCompanyChange = (event: SelectChangeEvent) => {
    setCompany(event.target.value)
    var searchWord = event.target.value
    if (searchWord != '') {
      const filteredCheckOut: CheckOut[] = []
      checkOutRequest.map((item) => {
        if (item.logisticName.includes(searchWord)) {
          filteredCheckOut.push(item)
        }
      })

      if (filteredCheckOut) {
        setFilterCheckOut(filteredCheckOut)
      }
    } else {
      setFilterCheckOut(checkOutRequest)
    }
  }

  const handleLocChange = (event: SelectChangeEvent) => {
    setLocation(event.target.value)
    var searchWord = event.target.value
    //console.log(searchWord);
    if (searchWord != '') {
      const filteredShipments: CheckOut[] = []
      checkOutRequest.map((item) => {
        if (item.receiverAddr.includes(searchWord)) {
          filteredShipments.push(item)
        }
      })

      if (filteredShipments) {
        setFilterCheckOut(filteredShipments)
      }
    } else {
      setFilterCheckOut(checkOutRequest)
    }
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  const handleSelectRow = (params: GridRowParams) => {
    const row = params.row 
    console.log("row", row)
    const selectedItem = checkOutRequest?.find(
      (item) => item.chkOutId === row.chkOutId
    )
    console.log("selectedItem", selectedItem)
    setSelectedRow(selectedItem) //
    // setSelectedRow(row)

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
          <button
            className="primary-btn mr-2 cursor-pointer"
            onClick={() => setApproveModal(checkedCheckOut.length > 0)}
          >
            {approveLabel}
          </button>
          <button
            className="secondary-btn cursor-pointer"
            onClick={() => setRejectModal(checkedCheckOut.length > 0)}
          >
            {rejectLabel}
          </button>
        </div>
        <div className="filter-section flex justify-between items-center w-full">
          <TextField
            id="searchShipment"
            onChange={(event) => handleSearchByPoNumb(event.target.value)}
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
            <InputLabel id="company-label">{t('check_out.company')}</InputLabel>
            <Select
              labelId="company-label"
              id="company"
              value={company}
              label={t('check_out.any')}
              onChange={handleCompanyChange}
            >
              <MenuItem value="">
                <em>{t('check_in.any')}</em>
              </MenuItem>
              {checkOutRequest.map((item) => (
                <MenuItem value={item.logisticName}>
                  {item.logisticName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={styles.dropDown}>
            <InputLabel id="location-label">
              {t('check_out.receiver_addr')}
            </InputLabel>
            <Select
              labelId="location-label"
              id="location"
              value={location}
              label={t('check_out.any')}
              onChange={handleLocChange}
            >
              <MenuItem value="">
                <em>{t('check_out.any')}</em>
              </MenuItem>
              {checkOutRequest.map((item) => (
                <MenuItem value={item.receiverAddr}>
                  {item.receiverAddr}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="table-overview">
          <Box pr={4} pt={3} sx={{ flexGrow: 1, width: '100%' }}>
            <DataGrid
              rows={filterCheckOut}
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
        </div>
      </div>
      <RejectModal
        open={rejFormModal}
        onClose={() => {
          setRejectModal(false)
        }}
        // onRejected={() => initShipments()}
      />
      <ApproveModal
        open={approveModal}
        onClose={() => {
          setApproveModal(false)
        }}
        checkedCheckOut={checkedCheckOut}
        // onRejected={() => initShipments()}
      />
      <CheckInDetails
        drawerOpen={drawerOpen}
        handleDrawerClose={handleDrawerClose}
        selectedCheckOut={selectedRow}
        //selectedCheckOut={dummyCheckoutbyId}
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
        color: '#79CA25'
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
