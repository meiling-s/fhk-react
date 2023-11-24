import { FunctionComponent, useCallback, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material'
import '../../../styles/Base.css'

import TableBase from '../../../components/TableBase'
import { LEFT_ARROW_ICON } from '../../../themes/icons'

const Overview: FunctionComponent = () => {
  // const navigate = useNavigate()
  const titlePage = '送入請求'
  const approveLabel = '接受'
  const rejectLabel = '拒絕'
  const headerTitles = [
    {
      type: 'text',
      field: 'created',
      label: '建立日期'
    },
    {
      type: 'text',
      field: 'shipping_company',
      label: '寄件公司'
    },
    {
      type: 'text',
      field: 'receiver',
      label: '收件公司'
    },
    {
      type: 'text',
      field: 'bill_number',
      label: '運單編號'
    },
    {
      type: 'status',
      field: 'status_inventory',
      label: '調整庫存'
    },
    {
      type: 'text',
      field: 'logistic_company',
      label: '物流公司'
    },
    {
      type: 'text',
      field: 'delivery_location',
      label: '送出地點'
    },
    {
      type: 'text',
      field: 'arrived',
      label: '到達地點'
    }
  ]
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [overviewItems, setOverviewItem] = useState([
    {
      id: '1',
      created: '2023/09/18 18:00',
      shipping_company: '寄件公司',
      receiver: '收件公司',
      bill_number: 'PO12345678',
      status_inventory: 'checked',
      logistic_company: '快捷物流',
      delivery_location: '送出地點',
      arrived: '到達地點'
    },
    {
      id: '1',
      created: '2023/09/18 18:00',
      shipping_company: '寄件公司',
      receiver: '收件公司',
      bill_number: 'PO12345678',
      status_inventory: 'checked',
      logistic_company: '快捷物流',
      delivery_location: '送出地點',
      arrived: '到達地點'
    },
    {
      id: '2',
      created: '2023/09/18 18:00',
      shipping_company: '寄件公司',
      receiver: '收件公司',
      bill_number: 'PO12345678',
      status_inventory: 'checked',
      logistic_company: '快捷物流',
      delivery_location: '送出地點',
      arrived: '到達地點'
    }
  ])

  const handleSearch = () => {}

  return (
    <Box className="container-wrapper w-full">
      <div className="overview-page bg-bg-primary pl-10">
        <div className="header-page flex justify-start items-center mb-8">
          <LEFT_ARROW_ICON fontSize="large" />
          <div className="title font-bold text-3xl pl-4 ">{titlePage}</div>
        </div>
        <div className="action-overview mb-8">
          <button className="primary-btn mr-2 cursor-pointer">
            {approveLabel}
          </button>
          <button className="secondary-btn cursor-pointer">
            {rejectLabel}
          </button>
        </div>
        <div className="filter-section flex justify-between items-center w-full">
          <Box>
            <TextField
              fullWidth
              placeholder="輸入運單編號"
              type="text"
              InputProps={{
                sx: styles.textField,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>{}</IconButton>
                  </InputAdornment>
                )
              }}
              onChange={(event: {
                target: { value: React.SetStateAction<string> }
              }) => {
                setKeyword(event.target.value)
              }}
            />
          </Box>
        </div>
        <div className="table-overview">
          <Box className="w-full">
            <TableBase header={headerTitles} dataRow={overviewItems} />
          </Box>
        </div>
      </div>
    </Box>
  )
}

let styles = {
  typo: {
    color: 'grey',
    fontSize: 14
  },
  textField: {
    borderRadius: '10px',
    fontWeight: '500',
    '& .MuiOutlinedInput-input': {
      padding: '10px 15px'
    }
  }
}

export default Overview
