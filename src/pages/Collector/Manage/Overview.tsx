import { FunctionComponent, useCallback, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import TableBase from '../../../components/TableBase'
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

interface OverviewItem {
  id: number
  created: string
  shipping_company: string
  receiver: string
  bill_number: string
  status_inventory: boolean
  logistic_company: string
  delivery_location: string
  arrived: string
}

const Overview: FunctionComponent = () => {
  const { t } = useTranslation()
  // const navigate = useNavigate()
  const titlePage = t('check_in.request_check_in')
  const approveLabel = t('check_in.approve')
  const rejectLabel = t('check_in.reject')
  const [checkedRows, setCheckedRows] = useState<TableRow[]>([])
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [rejFormModal, setRejFormModal] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const headerTitles = [
    {
      type: 'text',
      field: 'created',
      label: t('check_in.created_at')
    },
    {
      type: 'text',
      field: 'shipping_company',
      label: t('check_in.sender_company')
    },
    {
      type: 'text',
      field: 'receiver',
      label: t('check_in.receiver_company')
    },
    {
      type: 'text',
      field: 'bill_number',
      label: t('check_in.pickup_order_no')
    },
    {
      type: 'text',
      field: 'status_inventory',
      label: '調整庫存'
    },
    {
      type: 'text',
      field: 'logistic_company',
      label: t('check_in.logistic_company')
    },
    {
      type: 'text',
      field: 'delivery_location',
      label: t('check_in.receiver_addr')
    },
    {
      type: 'text',
      field: 'arrived',
      label: '到達地點'
    }
  ]

  const [keyword, setKeyword] = useState('')

  const initialOverviewItems: OverviewItem[] = [
    {
      id: 10,
      created: '2023/09/18 18:00',
      shipping_company: '寄件公司',
      receiver: '收件公司',
      bill_number: 'PO12345678',
      status_inventory: true,
      logistic_company: '快捷物流',
      delivery_location: '送出地點',
      arrived: '到達地點'
    },
    {
      id: 1,
      created: '2023/09/18 18:00',
      shipping_company: '寄件公司',
      receiver: '收件公司',
      bill_number: 'PO12345678',
      status_inventory: true,
      logistic_company: '快捷物流',
      delivery_location: '送出地點',
      arrived: '到達地點'
    },
    {
      id: 2,
      created: '2023/09/18 18:00',
      shipping_company: '寄件公司',
      receiver: '收件公司',
      bill_number: 'PO12345678',
      status_inventory: true,
      logistic_company: '快捷物流',
      delivery_location: '送出地點',
      arrived: '到達地點'
    }
  ]
  const [overviewItem, setOverviewItem] =
    useState<OverviewItem[]>(initialOverviewItems)

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

  const handleCheckAll = (checked: boolean) => {
    console.log('checkedAll', checked)
    if (checked) {
      setCheckedRows(overviewItem) // Select all rows
    } else {
      setCheckedRows([]) // Unselect all rows
    }
  }

  // Handle selecting/deselecting individual row
  const handleCheckRow = (checked: boolean, row: TableRow) => {
    console.log('checkedRow', checked, row)
    if (checked) {
      setCheckedRows((prev) => [...prev, row])
    } else {
      setCheckedRows((prev) =>
        prev.filter(
          (existingRow) => JSON.stringify(existingRow) !== JSON.stringify(row)
        )
      )
    }
    setDrawerOpen(true)
    console.log(checkedRows)
  }

  return (
    <Box className="container-wrapper w-full">
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
        <div className="filter-section flex justify-between items-center w-[96%]">
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
          <Box className="w-full">
            <TableBase
              header={headerTitles}
              dataRow={overviewItem}
              useAction={false}
              checkAll={checkedRows.length === overviewItem.length}
              onCheckAll={handleCheckAll}
              checkedRows={checkedRows}
              onCheckRow={handleCheckRow}
            />
          </Box>
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
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '34%',
    height: 'fit-content',
    padding: 4,
    backgroundColor: 'white',
    border: 'none',
    borderRadius: 5
  }
  // formButton: {
  //   ...styles.buttonFilledGreen,
  //   width: '150px'
  // },
  // cancelButton: {
  //   ...styles.buttonOutlinedGreen,
  //   width: '150px'
  // }
}

export default Overview
