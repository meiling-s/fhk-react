import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Stack,
  TableRow,
  TextField,
  Typography,
  Pagination,
  Divider
} from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams
} from '@mui/x-data-grid'
import CloseIcon from '@mui/icons-material/Close'
import { SEARCH_ICON, LEFT_ARROW_ICON } from '../../themes/icons'
import { useEffect, useState } from 'react'
import React from 'react'
import { primaryColor, styles } from '../../constants/styles'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import CheckIcon from '@mui/icons-material/Check'
import { useNavigate } from 'react-router-dom'
import CustomItemList from '../../components/FormComponents/CustomItemList'
import {
  getAllCheckInRequests,
  updateCheckinStatus,
  getCheckinReasons
} from '../../APICalls/Collector/warehouseManage'
import { updateStatus } from '../../interfaces/warehouse'
import RequestForm from '../../components/FormComponents/RequestForm'
import { CheckIn } from '../../interfaces/checkin'
import { STATUS_CODE, localStorgeKeyName } from '../../constants/constant'
import { displayCreatedDate, extractError, showSuccessToast } from '../../utils/utils'
import { useTranslation } from 'react-i18next'
import { queryCheckIn } from '../../interfaces/checkin'
import CustomButton from '../../components/FormComponents/CustomButton'
import i18n from '../../setups/i18n'

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../contexts/CommonTypeContainer'
import useLocaleTextDataGrid from '../../hooks/useLocaleTextDataGrid'

dayjs.extend(utc)
dayjs.extend(timezone)


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

type rejectForm = {
  open: boolean
  onClose: () => void
  checkedShipments: number[]
  onRejected?: () => void
  reasonList: any
}

function RejectForm({
  open,
  onClose,
  checkedShipments,
  onRejected,
  reasonList
}: rejectForm) {
  const { t } = useTranslation()

  const [rejectReasonId, setRejectReasonId] = useState<string[]>([])

  const handleConfirmRejectOnClick = async (rejectReasonId: string[]) => {
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
      checkedShipments.map(async (checkInId) => {
        try {
          const result = await updateCheckinStatus(checkInId, statReason)
          const data = result?.data
          if (data) {
            // console.log("updated check-in status: ", data);
            if (onRejected) {
              onRejected()
            }
          }
        } catch (error) {
          console.error(
            `Failed to update check-in status for id ${checkInId}: `,
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
              {t('check_in.confirm_reject')}
            </Typography>
          </Box>
          <Box>
            <Typography sx={localstyles.typo}>
              {t('check_in.reject_reasons')}
              <Required />
            </Typography>
            {/* <Typography sx={localstyles.typo}>
              {t('check_out.total_checkout') + checkedShipments.length}
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
                handleConfirmRejectOnClick(rejectReasonId)
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

type ApproveForm = {
  open: boolean
  onClose: () => void
  checkedCheckIn: number[]
  onApprove?: () => void
}

const ApproveModal: React.FC<ApproveForm> = ({
  open,
  onClose,
  checkedCheckIn,
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
    console.log('hit', checkedCheckIn)

    const results = await Promise.allSettled(
      checkedCheckIn.map(async (checkInId) => {
        try {
          const result = await updateCheckinStatus(checkInId, statReason)
          const data = result?.data
          if (data) {
            // console.log('updated check-in status: ', data)
            if (onApprove) {
              onApprove()
            }
          }
        } catch (error) {
          console.error(
            `Failed to update check-in status for id ${checkInId}: `,
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
              {t('check_out.total_checkout') + checkedCheckIn.length}
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

type TableRow = {
  id: number
  [key: string]: any
}

function ShipmentManage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedCheckin, setSelectedCheckin] = useState<number[]>([])
  const [filterShipments, setFilterShipments] = useState<CheckIn[]>([])
  const [rejFormModal, setRejectModal] = useState<boolean>(false)
  const [approveModal, setApproveModal] = useState<boolean>(false)
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [checkedShipments, setCheckedShipments] = useState<CheckIn[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [selectAll, setSelectAll] = useState(false)
  const [selectedRow, setSelectedRow] = useState<CheckIn>()
  const [checkInRequest, setCheckInRequest] = useState<CheckIn[]>()
  const [page, setPage] = useState(1)
  const [confirmModal, setConfirmModal] = useState(false)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const [query, setQuery] = useState<queryCheckIn>({
    picoId: '',
    senderName: '',
    senderAddr: ''
  })
  const [reasonList, setReasonList] = useState<any>([])
  const {dateFormat} = useContainer(CommonTypeContainer)
  const { localeTextDataGrid } = useLocaleTextDataGrid()

  const getRejectReason = async () => {
    try {
      let result = await getCheckinReasons()
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
    } catch (error:any) {
      const {state, realm} =  extractError(error);
      if(state.code === STATUS_CODE[503] ){
        navigate('/maintenance')
      }
    }
  }
  useEffect(() => {
    initCheckInRequest()
    getRejectReason()
  }, [page, query])

  const transformToTableRow = (item: CheckIn): TableRow => {
    const dateInHK = dayjs.utc(item.createdAt).tz('Asia/Hong_Kong')
    const createdAt = dateInHK.format(`${dateFormat} HH:mm`)
    return {
      id: item.chkInId,
      chkInId: item.chkInId,
      createdAt: createdAt,
      senderName: item.senderName,
      recipientCompany: '-',
      picoId: item.picoId,
      adjustmentFlg: item.adjustmentFlg,
      logisticName: item.logisticName,
      senderAddr: item.senderAddr,
      deliveryAddress: '-',
      status: item.status,
      checkinDetail: item.checkinDetail
    }
  }

  const initCheckInRequest = async () => {
    try {
      const result = await getAllCheckInRequests(page - 1, pageSize, query)
      if (result) {
        const data = result?.data?.content
        if (data && data.length > 0) {
          const checkinData = data.map(transformToTableRow)
          setCheckInRequest(data)
          setFilterShipments(checkinData)
        } else {
          setFilterShipments([])
        }
        setTotalData(result?.data.totalPages)
      }
    } catch (error:any) {
      const {state, realm} =  extractError(error);
      if(state.code === STATUS_CODE[503] ){
        navigate('/maintenance')
      }
    }
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setSelectAll(checked)
    const selectedRows = checked
      ? filterShipments.map((row) => row.chkInId)
      : []
    setSelectedCheckin(selectedRows)
  }

  const handleRowCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    chkInId: number
  ) => {
    setOpen(false)

    const checked = event.target.checked
    const updatedChecked = checked
      ? [...selectedCheckin, chkInId]
      : selectedCheckin.filter((rowId) => rowId != chkInId)
    setSelectedCheckin(updatedChecked)
    // console.log(updatedChecked)

    const allRowsChecked = filterShipments.every((row) =>
      updatedChecked.includes(row.chkInId)
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
    headerName: 'Select',
    width: 80,
    sortable: false,
    filterable: false,
    renderHeader: () => HeaderCheckbox,
    renderCell: (params) => (
      <Checkbox
        checked={selectAll || selectedCheckin?.includes(params.row?.chkInId)}
        onChange={(event) => handleRowCheckboxChange(event, params.row.chkInId)}
        color="primary"
      />
    )
  }

  const headCells: GridColDef[] = [
    checkboxColumn,
    {
      field: 'createdAt',
      type: 'string',
      headerName: t('check_in.created_at'),
      width: 150
    },
    {
      field: 'senderName',
      type: 'string',
      headerName: t('check_in.sender_company'),
      width: 200
    },
    {
      field: 'recipientCompany',
      type: 'string',
      headerName: t('check_in.receiver_company'),
      width: 200
    },
    {
      field: 'picoId',
      type: 'string',
      headerName: t('check_in.pickup_order_no'),
      width: 200
    },
    {
      field: 'adjustmentFlg',
      headerName: t('check_in.stock_adjustment'),
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
      type: 'string',
      headerName: t('check_in.logistic_company'),
      width: 200
    },
    {
      field: 'senderAddr',
      type: 'string',
      headerName: t('check_in.sender_addr'),
      width: 200
    },
    {
      field: 'deliveryAddress',
      type: 'string',
      headerName: t('check_in.receiver_addr'),
      width: 200
    },
    // {
    //   field: 'status',
    //   type: 'string',
    //   headerName: t('processRecord.status'),
    //   width: 200
    // }
  ]

  const updateQuery = (newQuery: Partial<queryCheckIn>) => {
    setQuery({ ...query, ...newQuery })
  }

  const handleFilterPoNum = (searchWord: string) => {
    updateQuery({ picoId: searchWord })
  }

  const handleComChange = (event: SelectChangeEvent) => {
    setCompany(event.target.value)
    var searchWord = event.target.value
    updateQuery({ senderName: searchWord })
  }

  const handleLocChange = (event: SelectChangeEvent) => {
    setLocation(event.target.value)
    var searchWord = event.target.value
    updateQuery({ senderAddr: searchWord })
  }

  // const handleApproveOnClick = async () => {
  //   // console.log(checkedShipments);
  //   const checkInIds = checkedShipments.map(
  //     (checkedShipments) => checkedShipments.chkInId
  //   );
  //   console.log("checkin ids are " + checkInIds);
  //   const confirmReason: string[] = ["Confirmed"];
  //   const statReason: updateStatus = {
  //     status: "CONFIRMED",
  //     reason: confirmReason,
  //     updatedBy: "admin",
  //   };

  //   const results = await Promise.allSettled(
  //     checkInIds.map(async (checkInId) => {
  //       try {
  //         const result = await updateCheckinStatus(checkInId, statReason);
  //         const data = result?.data;
  //         if (data) {
  //           console.log("updated check-in status: ", data);
  //           // initShipments();
  //         }
  //       } catch (error) {
  //         console.error(
  //           `Failed to update check-in status for id ${checkInId}: `,
  //           error
  //         );
  //       }
  //     })
  //   );

  //   setSelectedCheckin([]);
  //   // initTable();
  // };

  const onRejectCheckin = () => {
    setRejectModal(false)
    showSuccessToast(t('pick_up_order.rejected_success'))
    resetPage()
    // setConfirmModal(true)
  }

  const resetPage = async () => {
    setConfirmModal(false)
    setSelectedCheckin([])
    initCheckInRequest()
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSelectRow = (params: GridRowParams) => {
    setOpen(true)

    const selectedItem = filterShipments?.find(
      (item) => item.chkInId === params.row.chkInId
    )
    setSelectedRow(selectedItem)
  }

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <RequestForm onClose={handleClose} selectedItem={selectedRow} />
      </Modal>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          pr: 4
        }}
      >
        <Grid container alignItems="center">
          <Grid item>
            <div
              className="header-page flex justify-start items-center mb-4 cursor-pointer"
              onClick={() => navigate('/warehouse')}
            >
              <LEFT_ARROW_ICON fontSize="large" />
              <div className="title font-bold text-3xl pl-4 ">
                {t('check_in.request_check_in')}
              </div>
            </div>
          </Grid>
        </Grid>
        <Box>
          <Button
            sx={[
              styles.buttonFilledGreen,
              {
                mt: 3,
                width: '90px',
                height: '40px',
                m: 0.5,
                cursor: selectedCheckin.length === 0 ? 'not-allowed' : 'pointer'
              }
            ]}
            disabled={selectedCheckin.length === 0}
            variant="outlined"
            onClick={() => {
              //handleApproveOnClick();
              setApproveModal(selectedCheckin.length > 0)
            }}
          >
            {' '}
            {t('check_in.approve')}
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
            variant="outlined"
            disabled={selectedCheckin.length === 0}
            onClick={() => setRejectModal(selectedCheckin.length > 0)}
          >
            {' '}
            {t('check_in.reject')}
          </Button>
        </Box>
        <Box className="filter-section flex justify-between items-center w-full">
          <TextField
            id="searchShipment"
            onChange={(event) => {
              handleFilterPoNum(event.target.value)
            }}
            sx={styles.inputStyle}
            label={t('check_in.search')}
            InputLabelProps={{
              style: { color: primaryColor },
              focused: true
            }}
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
              {t('check_in.sender_company')}
            </InputLabel>
            <Select
              labelId="company-label"
              id="company"
              value={company}
              label={t('check_in.sender_company')}
              onChange={handleComChange}
            >
              <MenuItem value="">
                {' '}
                <em>{t('check_in.any')}</em>
              </MenuItem>
              {checkInRequest?.map((item, index) => (
                <MenuItem key={index} value={item.senderName}>
                  {item.senderName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={styles.inputStyle}>
            <InputLabel id="location-label" sx={styles.textFieldLabel}>
              {t('check_in.sender_addr')}
            </InputLabel>
            <Select
              labelId="location-label"
              id="location"
              value={location}
              label={t('check_in.sender_addr')}
              onChange={handleLocChange}
            >
              <MenuItem value="">
                {' '}
                <em>{t('check_in.any')}</em>
              </MenuItem>
              {checkInRequest?.map((item, index) => (
                <MenuItem key={index} value={item.senderAddr}>
                  {item.senderAddr}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <div className="table-overview">
          <Box pr={4} pt={3} sx={{ flexGrow: 1, width: '100%' }}>
            <DataGrid
              rows={filterShipments}
              getRowId={(row) => row.chkInId}
              hideFooter
              columns={headCells}
              checkboxSelection={false}
              disableRowSelectionOnClick
              onRowClick={handleSelectRow}
              getRowSpacing={getRowSpacing}
              localeText={localeTextDataGrid}
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
        <RejectForm
          checkedShipments={selectedCheckin}
          open={rejFormModal}
          reasonList={reasonList}
          onClose={() => {
            setRejectModal(false)
          }}
          onRejected={onRejectCheckin}
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
          checkedCheckIn={selectedCheckin}
        />
        <ConfirmModal open={confirmModal} onClose={resetPage} />
      </Box>
    </>
  )
}

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
  },
  formButton: {
    ...styles.buttonFilledGreen,
    width: '150px'
  },
  cancelButton: {
    ...styles.buttonOutlinedGreen,
    width: '150px'
  }
}

export default ShipmentManage
