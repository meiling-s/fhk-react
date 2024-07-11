import React, { FunctionComponent, useEffect, useState } from 'react'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridCellParams
} from '@mui/x-data-grid'
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  InputLabel,
  Button,
  FormControl,
  Pagination,
  MenuItem,
  Modal,
  Typography,
  Divider,
  Checkbox
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import '../../../styles/Base.css'
import { useNavigate } from 'react-router-dom'

import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

import CustomItemList from '../../../components/FormComponents/CustomItemList'
import {
  getAllCheckoutRequest,
  updateCheckoutRequestStatus,
  getCheckoutReasons
} from '../../../APICalls/Collector/checkout'
import { LEFT_ARROW_ICON, SEARCH_ICON } from '../../../themes/icons'
import CheckInDetails from './CheckOutDetails'
import { updateStatus } from '../../../interfaces/warehouse'
import { CheckOut } from '../../../interfaces/checkout'

import { useTranslation } from 'react-i18next'
import { styles, primaryColor } from '../../../constants/styles'
import { queryCheckout } from '../../../interfaces/checkout'
import { STATUS_CODE, localStorgeKeyName } from '../../../constants/constant'
import {
  displayCreatedDate,
  extractError,
  showSuccessToast
} from '../../../utils/utils'
import CustomButton from '../../../components/FormComponents/CustomButton'
import i18n from '../../../setups/i18n'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import useLocaleTextDataGrid from '../../../hooks/useLocaleTextDataGrid'
dayjs.extend(utc)
dayjs.extend(timezone)

type TableRow = {
  id: number
  [key: string]: any
}

type ApproveForm = {
  open: boolean
  onClose: () => void
  checkedCheckOut: number[]
  onApprove?: () => void
}

type RejectForm = {
  open: boolean
  onClose: () => void
  checkedCheckOut: number[]
  onRejected?: () => void
  reasonList: any
}

type Confirm = {
  open: boolean
  onClose: () => void
  title?: string
}

const ConfirmModal: React.FC<Confirm> = ({ open, onClose, title }) => {
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
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'medium' }}
            >
              {t('check_out.success_approve')}
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
  const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
  const handleApproveRequest = async () => {
    const confirmReason: string[] = ['Confirmed']
    const statReason: updateStatus = {
      status: 'CONFIRMED',
      reason: confirmReason,
      updatedBy: loginId
    }

    const results = await Promise.allSettled(
      checkedCheckOut.map(async (chkOutId) => {
        try {
          const result = await updateCheckoutRequestStatus(chkOutId, statReason)
          const data = result?.data
          if (data) {
            // console.log('updated check-in status: ', data)
            if (onApprove) {
              onApprove()
            }
          }
        } catch (error) {
          console.error(
            `Failed to update check-in status for id ${chkOutId}: `,
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
      <Box sx={localstyles.modal}>
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
          {/* <Box className="flex gap-2 justify-start">
            <Typography sx={localstyles.typo}>
              {t('check_out.total_checkout') + checkedCheckOut.length}
            </Typography>
          </Box> */}

          <Box sx={{ alignSelf: 'center' }}>
            <CustomButton
              text={t('check_out.confirm_approve_btn')}
              color="blue"
              style={{ width: '150px', marginRight: '10px' }}
              onClick={() => {
                handleApproveRequest()
              }}
            />
            <CustomButton
              text={t('check_in.cancel')}
              color="blue"
              outlined
              style={{ width: '150px', marginRight: '10px' }}
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

const RejectModal: React.FC<RejectForm> = ({
  open,
  onClose,
  checkedCheckOut,
  onRejected,
  reasonList
}) => {
  const { t } = useTranslation()
  const [rejectReasonId, setRejectReasonId] = useState<string[]>([])

  const handleRejectRequest = async (rejectReasonId: string[]) => {
    const rejectReason = rejectReasonId.map((id) => {
      const reasonItem = reasonList.find(
        (reason: { id: string }) => reason.id === id
      )
      return reasonItem ? reasonItem.name : ''
    })
    const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
    const statReason: updateStatus = {
      status: 'REJECTED',
      reason: rejectReason,
      updatedBy: loginId
    }

    const results = await Promise.allSettled(
      checkedCheckOut.map(async (chkOutId) => {
        try {
          const result = await updateCheckoutRequestStatus(chkOutId, statReason)
          const data = result?.data
          if (data) {
            // console.log('updated check-out status: ', data)
            if (onRejected) {
              onRejected()
            }
          }
        } catch (error) {
          console.error(
            `Failed to update check-in status for id ${chkOutId}: `,
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
      <Box sx={localstyles.modal}>
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
            <Typography sx={localstyles.typo}>
              {t('check_out.reject_reasons')}
            </Typography>
            {/* <Typography sx={localstyles.typo}>
              {t('check_out.total_checkout') + checkedCheckOut.length}
            </Typography> */}
            <CustomItemList
              items={reasonList}
              multiSelect={setRejectReasonId}
              itemColor={{ bgColor: '#F0F9FF', borderColor: primaryColor }}
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

const CheckoutRequest: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const titlePage = t('check_out.request_check_out')
  const approveLabel = t('check_out.approve')
  const rejectLabel = t('check_out.reject')
  const [location, setLocation] = useState('')
  const [rejFormModal, setRejectModal] = useState<boolean>(false)
  const [approveModal, setApproveModal] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<CheckOut>()
  const [checkedCheckOut, setCheckedCheckOut] = useState<number[]>([])
  const [company, setCompany] = useState('')
  const [filterCheckOut, setFilterCheckOut] = useState<CheckOut[]>([])
  const [checkOutRequest, setCheckoutRequest] = useState<CheckOut[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const [query, setQuery] = useState<queryCheckout>({
    picoId: '',
    receiverName: '',
    receiverAddr: ''
  })
  const [reasonList, setReasonList] = useState<any>([])
  const { dateFormat } = useContainer(CommonTypeContainer)
  const { localeTextDataGrid } = useLocaleTextDataGrid()

  const getRejectReason = async () => {
    try {
      let result = await getCheckoutReasons()
      if (result?.data?.content.length > 0) {
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
        result?.data?.content.map(
          (item: { [x: string]: any; id: any; reasonId: any; name: any }) => {
            item.id = item.reasonId
            item.name = item[reasonName]
          }
        )
        setReasonList(result?.data?.content)
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setSelectAll(checked)
    const selectedRows = checked
      ? filterCheckOut.map((row) => row.chkOutId)
      : []
    setCheckedCheckOut(selectedRows)
    // console.log('handleSelectAll', selectedRows)
  }

  const handleRowCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    chkOutId: number
  ) => {
    setDrawerOpen(false)
    setSelectedRow(undefined);

    const checked = event.target.checked
    const updatedChecked = checked
      ? [...checkedCheckOut, chkOutId]
      : checkedCheckOut.filter((rowId) => rowId != chkOutId)
    setCheckedCheckOut(updatedChecked)
    // console.log(updatedChecked)

    const allRowsChecked = filterCheckOut.every((row) =>
      updatedChecked.includes(row.chkOutId)
    )
    setSelectAll(allRowsChecked)
  }

  const HeaderCheckbox = (
    <Checkbox
      checked={selectAll}
      onChange={handleSelectAll}
      color="primary"
      inputProps={{ 'aria-label': 'Select all rows' }}
    />
  )

  const checkboxColumn: GridColDef = {
    field: 'customCheckbox',
    headerName: t('localizedTexts.select'),
    width: 80,
    sortable: false,
    filterable: false,
    renderHeader: () => HeaderCheckbox,
    renderCell: (params) => (
      <Checkbox
        checked={selectAll || checkedCheckOut.includes(params.row?.chkOutId)}
        onChange={(event) =>
          handleRowCheckboxChange(event, params.row.chkOutId)
        }
        color="primary"
      />
    )
  }

  const checkoutHeader: GridColDef[] = [
    checkboxColumn,
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
      field: 'senderAddr',
      headerName: t('check_out.sender_addr'),
      type: 'string',
      width: 200
    },
    {
      field: 'receiverAddr',
      headerName: t('check_out.receiver_addr'),
      width: 200,
      type: 'string'
    }
  ]

  const transformToTableRow = (item: CheckOut): TableRow => {
    const dateInHK = dayjs.utc(item.createdAt).tz('Asia/Hong_Kong')
    const createdAt = dateInHK.format(`${dateFormat} HH:mm`)
    return {
      id: item.chkOutId,
      chkOutId: item.chkOutId,
      createdAt: createdAt,
      vehicleTypeId: item.vehicleTypeId,
      receiverName: item.receiverName,
      picoId: item.picoId,
      adjustmentFlg: item.adjustmentFlg,
      logisticName: item.logisticName,
      receiverAddr: item.receiverAddr,
      receiverAddrGps: '-',
      status: item.status
    }
  }

  const getCheckoutRequest = async () => {
    try {
      const result = await getAllCheckoutRequest(page - 1, pageSize, query)
      const data = result?.data.content
      if (data && data.length > 0) {
        const checkoutData = data
          .map(transformToTableRow)
          .filter((item: CheckOut) => item.status === 'CREATED')
        setCheckoutRequest(
          data.filter((item: CheckOut) => item.status === 'CREATED')
        )
        setFilterCheckOut(checkoutData)
      } else {
        setFilterCheckOut([])
      }
      setTotalData(result?.data.totalPages)
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  useEffect(() => {
    getCheckoutRequest()
    getRejectReason()
  }, [page, query])

  const updateQuery = (newQuery: Partial<queryCheckout>) => {
    setQuery({ ...query, ...newQuery })
  }

  const handleSearchByPoNumb = (searchWord: string) => {
    updateQuery({ picoId: searchWord })
  }

  const handleCompanyChange = (event: SelectChangeEvent) => {
    // console.log("company", event.target.value)
    setCompany(event.target.value)
    var searchWord = event.target.value
    updateQuery({ receiverName: searchWord })
  }

  const handleLocChange = (event: SelectChangeEvent) => {
    setLocation(event.target.value)
    var searchWord = event.target.value
    updateQuery({ receiverAddr: searchWord })
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
    setSelectedRow(undefined)
  }

  const handleSelectRow = (params: GridRowParams) => {
    const row = params.row
    // console.log('row', row)
    const selectedItem = checkOutRequest?.find(
      (item) => item.chkOutId === row.chkOutId
    )
    setSelectedRow(selectedItem)

    setDrawerOpen(true)
  }

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  const resetPage = async () => {
    setConfirmModal(false)
    setCheckedCheckOut([])
    await getCheckoutRequest()
  }

  const [primaryColor, setPrimaryColor] = useState<string>('#79CA25')
  const role = localStorage.getItem(localStorgeKeyName.role)

  useEffect(() => {
    setPrimaryColor(
      role === 'manufacturer' || role === 'customer' ? '#6BC7FF' : '#79CA25'
    )
  }, [role])

  return (
    <Box className="container-wrapper w-full mr-11">
      <div className="overview-page bg-bg-primary">
        <div
          className="header-page flex justify-start items-center mb-4 cursor-pointer"
          onClick={() => navigate('/warehouse')}
        >
          <LEFT_ARROW_ICON fontSize="large" />
          <div className="title font-bold text-3xl pl-4 ">{titlePage}</div>
        </div>
        <div className="action-overview mb-2">
          <Button
            sx={[
              styles.buttonFilledGreen,
              {
                mt: 3,
                width: '90px',
                height: '40px',
                m: 0.5,
                backgroundPositionXackground:
                  checkedCheckOut.length === 0 ? 'white' : '',
                cursor: checkedCheckOut.length === 0 ? 'not-allowed' : 'pointer'
              }
            ]}
            disabled={checkedCheckOut.length === 0}
            variant="outlined"
            onClick={() => setApproveModal(checkedCheckOut.length > 0)}
          >
            {approveLabel}
          </Button>
          <Button
            sx={[
              styles.buttonOutlinedGreen,
              {
                mt: 3,
                width: '90px',
                height: '40px',
                m: 0.5
              }
            ]}
            disabled={checkedCheckOut.length === 0}
            variant="outlined"
            onClick={() => setRejectModal(checkedCheckOut.length > 0)}
          >
            {rejectLabel}
          </Button>
        </div>
        <div className="filter-section flex justify-between items-center w-full">
          <TextField
            id="searchShipment"
            onChange={(event) => handleSearchByPoNumb(event.target.value)}
            sx={styles.inputStyle}
            label={t('check_in.pickup_order_no')}
            placeholder={t('check_in.input_po_no')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => {}}>
                    <SEARCH_ICON style={{ color: primaryColor }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <FormControl sx={styles.inputStyle}>
            <InputLabel id="company-label" sx={styles.textFieldLabel}>
              {t('check_out.receiver_company')}
            </InputLabel>
            <Select
              labelId="company-label"
              id="company"
              value={company}
              label={t('check_in.receiver_company')}
              onChange={handleCompanyChange}
            >
              {filterCheckOut
                ?.filter(
                  (item, index, self) =>
                    index ===
                    self.findIndex((t) => t.receiverName === item.receiverName)
                )
                .map((item, index) => (
                  <MenuItem key={index} value={item.receiverName}>
                    {item.receiverName}
                  </MenuItem>
                ))}
              <MenuItem value="">
                <em>{t('check_in.any')}</em>
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={styles.inputStyle}>
            <InputLabel id="location-label" sx={styles.textFieldLabel}>
              {t('check_out.location')}
            </InputLabel>
            <Select
              labelId="location-label"
              id="location"
              value={location}
              label={t('check_out.location')}
              onChange={handleLocChange}
            >
              {filterCheckOut
                ?.filter(
                  (item, index, self) =>
                    index ===
                    self.findIndex((t) => t.receiverAddr === item.receiverAddr)
                )
                .map((item, index) => (
                  <MenuItem key={index} value={item.receiverAddr}>
                    {item.receiverAddr}
                  </MenuItem>
                ))}
              <MenuItem value="">
                <em>{t('check_out.any')}</em>
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="table-overview">
          <Box pr={4} pt={3} sx={{ flexGrow: 1, width: '100%' }}>
            <DataGrid
              rows={filterCheckOut}
              getRowId={(row) => row.chkOutId}
              hideFooter
              columns={checkoutHeader}
              checkboxSelection={false}
              disableRowSelectionOnClick
              onRowClick={handleSelectRow}
              getRowSpacing={getRowSpacing}
              localeText={localeTextDataGrid}
              getRowClassName={(params) => 
                `${selectedRow && params.row.chkOutId === selectedRow.chkOutId ? 'selected-row ' : ''}${checkedCheckOut && checkedCheckOut.includes(params.row.chkOutId) ? 'checked-row' : ''}`
              }
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
                },
                '.checked-row':{
                  backgroundColor: `rgba(25, 118, 210, 0.08)`
                },
                '.MuiDataGrid-columnHeaderTitle': { 
                  fontWeight: 'bold !important',
                  overflow: 'visible !important'
                },
                '& .selected-row': {
                    backgroundColor: '#F6FDF2 !important',
                    border: '1px solid #79CA25'
                  }
              }}
            />
            <Pagination
              className="mt-4"
              count={Math.ceil(totalData)}
              page={page}
              onChange={(_, newPage) => {
                setPage(newPage)
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
        checkedCheckOut={checkedCheckOut}
        reasonList={reasonList}
        onRejected={() => {
          setRejectModal(false)
          showSuccessToast(t('pick_up_order.rejected_success'))
          resetPage()
          // setConfirmModal(true)
        }}
      />
      <ApproveModal
        open={approveModal}
        onClose={() => {
          setApproveModal(false)
        }}
        onApprove={() => {
          setApproveModal(false)
          showSuccessToast(t('pick_up_order.approved_success'))
          resetPage()
          // setConfirmModal(true)
        }}
        checkedCheckOut={checkedCheckOut}
      />
      <ConfirmModal open={confirmModal} onClose={resetPage} />
      <CheckInDetails
        drawerOpen={drawerOpen}
        handleDrawerClose={handleDrawerClose}
        selectedCheckOut={selectedRow}
      />
    </Box>
  )
}
let localstyles = {
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
      width: '70%' /* Adjust the width for mobile devices */
    }
  }
}

export default CheckoutRequest
