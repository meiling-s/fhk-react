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

import {
  localStorgeKeyName,
  Languages,
  STATUS_CODE
} from '../../../constants/constant'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import {
  getPrimaryColor,
  porStatusList,
  debounce,
  extractError,
  showSuccessToast
} from '../../../utils/utils'
import DetailProcessOrder from './DetailProcessOrder'
import { getFactories, getProcessOrder } from '../../../APICalls/processOrder'
import {
  PorQuery,
  ProcessOrderItem
} from '../../../interfaces/processOrderQuery'

import { useTranslation } from 'react-i18next'
import i18n from '../../../setups/i18n'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { getAllWarehouse } from '../../../APICalls/warehouseManage'
import { il_item } from '../../../components/FormComponents/CustomItemList'

dayjs.extend(utc)
dayjs.extend(timezone)

interface Option {
  value: string
  label: string
}

const ProcessOrder = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [detailDrawer, setDetailDrawer] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<ProcessOrderItem | undefined>(
    undefined
  )
  const [processOrderList, setProcessOrderList] = useState<ProcessOrderItem[]>(
    []
  )
  const [warehouseSource, setWarehouseSource] = useState<il_item[]>([])
  const [factoriesSource, setFactoriesSource] = useState<il_item[]>([])
  const [factoryList, setFactoryList] = useState<il_item[]>([])
  const [searchQuery, setSearchQuery] = useState<PorQuery | null>({
    labelId: '',
    frmCreatedDate: '',
    toCreatedDate: '',
    status: ''
  } as PorQuery)

  const realm = localStorage.getItem(localStorgeKeyName.realm) || ''
  const { dateFormat, getProcessTypeList, processTypeListData } =
    useContainer(CommonTypeContainer)

  let columns: GridColDef[] = [
    {
      field: 'processStartAt',
      headerName: t('processOrder.porDatetime'),
      width: 200,
      renderCell: (params) => {
        return dayjs
          .utc(params.row.processStartAt)
          // .tz('Asia/Hong_Kong')
          .format(`${dateFormat} HH:mm`)
      }
    },
    {
      field: 'processTypeId',
      headerName: t('processOrder.porCategory'),
      width: 200,
      renderCell: (params) => {
        const processTypeIds: string[] = Array.from(
          new Set(
            params.row.processOrderDetail.flatMap(
              (detail: any) => detail.processTypeId
            )
          )
        )

        const processTypeRow = processTypeIds
          .map((id: string) => {
            const processName = processTypeListData?.find(
              (it) => it.processTypeId === id
            )
            return processName
              ? i18n.language === 'zhhk'
                ? processName.processTypeNameTchi
                : i18n.language === 'zhch'
                ? processName.processTypeNameSchi
                : processName.processTypeNameEng
              : null
          })
          .filter(Boolean)
          .join(', ')
        return (
          <div>
            {params.row.processOrderDetail.length > 0 && (
              <div>{processTypeIds ? `${processTypeRow}` : '-'}</div>
            )}
          </div>
        )
      }
    },
    {
      field: 'labelId',
      headerName: t('processOrder.orderNumber'),
      type: 'string',
      width: 250
    },
    {
      field: 'factoryId',
      headerName: t('processOrder.workshop'),
      type: 'string',
      width: 300,
      renderCell: (params) => {
        const factory = factoryList.find(
          (f) => parseInt(f.id) === params.row.factoryId
        )
        let factoryName = factory ? factory?.name : '-'

        return factoryName
      }
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
      label: t('processOrder.orderNumber'),
      placeholder: t('processOrder.enterOrderNumber'),
      field: 'labelId'
    },
    {
      label: t('pick_up_order.filter.dateby'),
      field: 'frmCreatedDate',
      inputType: 'date'
    },
    {
      label: t('pick_up_order.filter.to'),
      field: 'toCreatedDate',
      inputType: 'date'
    },
    {
      label: t('pick_up_order.filter.status'),
      options: getStatusOpion(),
      field: 'status'
    }
  ]

  function getStatusOpion() {
    const options: Option[] = porStatusList.map((item) => {
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

  const initWarehouse = async () => {
    //to: move to utils
    try {
      const result = await getAllWarehouse(0, 1000)
      if (result) {
        let warehouse: il_item[] = []
        setWarehouseSource(result.data.content)
        const data = result.data.content
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const initFactory = async () => {
    const result = await getFactories(0, 1000)
    if (result) {
      let factory: il_item[] = []
      const data = result.data.content
      setFactoriesSource(data)
      data.forEach((item: any) => {
        var factoryName =
          i18n.language === 'zhhk'
            ? item.factoryNameTchi
            : i18n.language === 'zhch'
            ? item.factoryNameSchi
            : item.factoryNameEng

        factory.push({
          id: item.factoryId.toString(),
          name: factoryName
        })
      })

      setFactoryList(factory)
    }
  }

  const initProcessOrderList = async () => {
    setIsLoading(true)
    const result = await getProcessOrder(page - 1, pageSize, searchQuery)
    const data = result?.data.content
    if (data && data.length > 0) {
      setProcessOrderList(data)
    } else {
      setProcessOrderList([])
    }
    setTotalData(result?.data.totalPages)
    setIsLoading(false)
  }

  useEffect(() => {
    initProcessOrderList()
  }, [page, searchQuery, processTypeListData])

  useEffect(() => {
    initWarehouse()
    initFactory()
    getProcessTypeList()
  }, [i18n.language])

  const updateQuery = (newQuery: Partial<PorQuery>) => {
    setSearchQuery({ ...searchQuery, ...newQuery } as PorQuery)
  }

  const handleSearch = debounce((keyName: string, value: string) => {
    setPage(1)
    updateQuery({ [keyName]: value })
  }, 1000)

  const handleRowClick = (params: GridRowParams) => {
    const row = params.row as ProcessOrderItem
    setSelectedRow(row)
    setDetailDrawer(true)
  }

  const onSubmitReason = () => {
    showSuccessToast(t('common.cancelSuccessfully'))
    initProcessOrderList()
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
                rows={processOrderList}
                columns={columns}
                getRowId={(row) => row.processOrderId}
                disableRowSelectionOnClick
                onRowClick={handleRowClick}
                getRowSpacing={getRowSpacing}
                hideFooter
                getRowClassName={(params) =>
                  selectedRow && params.id === selectedRow.processOrderId
                    ? 'selected-row'
                    : ''
                }
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell': {
                    border: 'none'
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    height: processOrderList.length > 0 ? '0' : '50px'
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
          selectedRow={selectedRow}
          onSubmitReason={onSubmitReason}
          processTypeListData={processTypeListData}
          warehouseSource={warehouseSource}
          factoriesSource={factoriesSource}
        ></DetailProcessOrder>
      </Box>
    </>
  )
}

export default ProcessOrder
