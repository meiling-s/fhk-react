import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { Box, Typography, Button, Stack, Pagination } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams
} from '@mui/x-data-grid'
import StatusCard from '../../../components/StatusCard'
import CustomSearchField from '../../../components/TableComponents/CustomSearchField'
import CircularLoading from '../../../components/CircularLoading'

import { localStorgeKeyName, Languages } from '../../../constants/constant'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { getPrimaryColor, statusList } from '../../../utils/utils'
import DetailProcessOrder from './DetailProcessOrder'

import { useTranslation } from 'react-i18next'
import i18n from '../../../setups/i18n'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

interface Option {
  value: string
  label: string
}

interface ProcessOrderRow {
  id: number
  createdAt: string
  porId: string
  category: string
  workshop: string
  status: string
}

const ProcessOrder = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [detailDrawer, setDetailDrawer] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<ProcessOrderRow | null>(null)
  //   const [processOrderList, setProcessOrderList] = useState<ProcessOrderRow[]>(
  //     []
  //   )
  const realm = localStorage.getItem(localStorgeKeyName.realm) || ''

  const { dateFormat } = useContainer(CommonTypeContainer)

  const dummyPOR: ProcessOrderRow[] = [
    {
      id: 1,
      createdAt: '2023/09/18 18:00',
      porId: 'POR12345678',
      category: '分類、溶膠',
      workshop: '工場1',
      status: 'CREATED'
    },
    {
      id: 2,
      createdAt: '2023/09/18 18:00',
      porId: 'POR123456763',
      category: '分類、溶膠',
      workshop: '工場1',
      status: 'CREATED'
    }
  ]

  let columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: t('processOrder.porDatetime'),
      width: 200,
      renderCell: (params) => {
        return dayjs
          .utc(params.row.createdAt)
          .tz('Asia/Hong_Kong')
          .format(`${dateFormat} HH:mm`)
      }
    },
    {
      field: 'category',
      headerName: t('processOrder.porCategory'),
      width: 250,
      editable: true
    },
    {
      field: 'porId',
      headerName: t('processOrder.orderNumber'),
      type: 'string',
      width: 250,
      editable: true
    },
    {
      field: 'workshop',
      headerName: t('processOrder.workshop'),
      type: 'string',
      width: 200,
      editable: true
    },
    {
      field: 'status',
      headerName: t('pick_up_order.table.status'),
      type: 'string',
      width: 150,
      editable: true,
      renderCell: (params) => <StatusCard status={params.value} />
    }
  ]

  const searchfield = [
    {
      label: t('job_order.filter.search'),
      placeholder: t('processOrder.enterOrderNumber'),
      field: 'picoId'
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
      label: t('pick_up_order.filter.status'),
      options: getStatusOpion(),
      field: 'status'
    }
  ]

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

  const handleSearch = () => {}

  const handleRowClick = () => {
    setDetailDrawer(true)
  }

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  return (
    <>
      <ToastContainer />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: '6px' }}>
          <Typography fontSize={20} color="black" fontWeight="bold">
            {t('processOrder.processOrder')}
          </Typography>
          <Button
            onClick={() => {
              navigate(`/${realm}/createProcessOrder`)
            }}
            sx={{
              borderRadius: '20px',
              backgroundColor: getPrimaryColor(),
              '&.MuiButton-root:hover': { bgcolor: getPrimaryColor() },
              width: 'fit-content',
              height: '40px',
              marginLeft: '20px'
            }}
            variant="contained"
            data-testId={'astd-pickup-order-new-button-5743'}
          >
            + {t('col.create')}
          </Button>
        </Box>
        <Stack direction="row" mt={3}>
          {searchfield.map((s) => (
            <CustomSearchField
              key={s.field}
              label={s.label}
              placeholder={s?.placeholder}
              inputType={s.inputType}
              field={s.field}
              options={s.options || []}
              onChange={handleSearch}
            />
          ))}
        </Stack>
        <Box pr={4} pt={3} pb={3} sx={{ flexGrow: 1 }}>
          {isLoading ? (
            <CircularLoading />
          ) : (
            <Box>
              <DataGrid
                rows={dummyPOR}
                columns={columns}
                disableRowSelectionOnClick
                onRowClick={handleRowClick}
                getRowSpacing={getRowSpacing}
                hideFooter
                getRowClassName={(params) =>
                  selectedRow && params.id === selectedRow.porId
                    ? 'selected-row'
                    : ''
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
                count={Math.ceil(totalData)}
                page={page}
                onChange={(_, newPage) => {
                  setPage(newPage)
                }}
              />
            </Box>
          )}
        </Box>
        <DetailProcessOrder
          drawerOpen={detailDrawer}
          handleDrawerClose={() => setDetailDrawer(false)}
        ></DetailProcessOrder>
      </Box>
    </>
  )
}

export default ProcessOrder
