import React, { FunctionComponent, useState, useEffect } from 'react'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams
} from '@mui/x-data-grid'

import { Box, Button, Typography, Pagination } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  ADD_ICON,
  EDIT_OUTLINED_ICON,
  DELETE_OUTLINED_ICON
} from '../../../themes/icons'

import CircularLoading from '../../../components/CircularLoading'
import { styles } from '../../../constants/styles'

import useLocaleTextDataGrid from '../../../hooks/useLocaleTextDataGrid'
import { ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import DetailFactory from './DetailFactory'

type TableRow = {
  id: number
  [key: string]: any
}

const Factory: FunctionComponent = () => {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const navigate = useNavigate()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const { localeTextDataGrid } = useLocaleTextDataGrid()

  const dummyData = [
    {
      id: '1',
      tcName: '火炭工場',
      scName: '火炭工場',
      enName: 'Fo Tan',
      place: '火炭拗背灣街14號',
      warehouse: '貨倉1、貨倉2'
    },
    {
      id: '2',
      tcName: '火炭工場',
      scName: '火炭工場',
      enName: 'Fo Tan',
      place: '火炭拗背灣街14號',
      warehouse: '貨倉1、貨倉2'
    },
    {
      id: '3',
      tcName: '火炭工場',
      scName: '火炭工場',
      enName: 'Fo Tan',
      place: '火炭拗背灣街14號',
      warehouse: '貨倉1、貨倉2'
    }
  ]

  const columns: GridColDef[] = [
    {
      field: 'tcName',
      headerName: t('common.traditionalChineseName'),
      width: 200,
      type: 'string'
    },
    {
      field: 'scName',
      headerName: t('common.simplifiedChineseName'),
      width: 200,
      type: 'string'
    },
    {
      field: 'enName',
      headerName: t('common.englishName'),
      width: 250,
      type: 'string'
    },
    {
      field: 'place',
      headerName: t('warehouse_page.place'),
      width: 250,
      type: 'string'
    },
    {
      field: 'warehouse',
      headerName: t('factory.warehouse'),
      width: 300,
      type: 'string'
    },
    {
      field: 'actions',
      headerName: '',
      width: 300,
      filterable: false,
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <EDIT_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark mr-2"
              onClick={(event) => {
                event.stopPropagation()
                handleEdit(params.row.loginId)
              }}
              style={{ cursor: 'pointer' }}
            />
            <DELETE_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark"
              onClick={(event) => {
                event.stopPropagation()
                handleDelete(params.row.loginId)
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
        )
      }
    }
  ]

  const handleEdit = (rowId: string) => {
    setDrawerOpen(true)
  }

  const handleSelectRow = (params: GridRowParams) => {
    setDrawerOpen(true)
  }

  const handleDelete = (rowId: string) => {
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {}

  const onSubmitData = () => {}

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  return (
    <>
      <Box
        className="factory-page"
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          pr: 4
        }}
      >
        <ToastContainer></ToastContainer>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginY: 4
          }}
        >
          <Typography fontSize={16} color="grey" fontWeight="600">
            {t('factory.factory')}
          </Typography>
          <Button
            sx={[
              styles.buttonOutlinedGreen,
              {
                width: 'max-content',
                height: '40px'
              }
            ]}
            variant="outlined"
            onClick={() => {
              setDrawerOpen(true)
              setAction('add')
            }}
          >
            <ADD_ICON /> {t('top_menu.add_new')}
          </Button>
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: '100%' }}>
            {isLoading ? (
              <CircularLoading />
            ) : (
              <Box>
                <DataGrid
                  rows={dummyData}
                  getRowId={(row) => row.id}
                  hideFooter
                  columns={columns}
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
            )}
          </Box>
        </div>
        <DetailFactory
          drawerOpen={drawerOpen}
          handleDrawerClose={() => setDrawerOpen(false)}
          action={action}
          onSubmitData={onSubmitData}
        />
      </Box>
    </>
  )
}

export default Factory
