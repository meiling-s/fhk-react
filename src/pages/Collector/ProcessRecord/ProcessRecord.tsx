import { useEffect, useState, FunctionComponent, useCallback } from 'react'
import { Box, Typography, Pagination, Stack } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridRenderCellParams
} from '@mui/x-data-grid'
import { styles } from '../../../constants/styles'
import CustomSearchField from '../../../components/TableComponents/CustomSearchField'
import { useContainer } from 'unstated-next'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import EditProcessRecord from './EditProcesRecord'
import { format } from '../../../constants/constant'
import dayjs from 'dayjs'
import StatusCard from '../../../components/StatusCard'
import {
  ProcessOut,
  processOutImage,
  ProcessOutItem
} from '../../../interfaces/processRecords'
import { getAllProcessRecord } from '../../../APICalls/Collector/processRecords'

import { useTranslation } from 'react-i18next'
import i18n from '../../../setups/i18n'
import { displayCreatedDate } from '../../../utils/utils'

interface Option {
  value: string
  label: string
}

function createProcessRecord(
  processOutId: number,
  status: string,
  processInId: number,
  createdBy: string,
  updatedBy: string,
  processoutDetail: ProcessOutItem[],
  createdAt: string,
  updatedAt: string
): ProcessOut {
  return {
    processOutId,
    status,
    processInId,
    createdBy,
    updatedBy,
    processoutDetail,
    createdAt,
    updatedAt
  }
}

const ProcessRecord: FunctionComponent = () => {
  const { t } = useTranslation()
  const [drawerEditOpen, setDrawerEditOpen] = useState(false)
  const [procesRecords, setProcesRecords] = useState<any[]>([])
  const [filteredProcessRecords, setFilteredProcessRecords] = useState<any[]>(
    []
  )
  const [selectedRow, setSelectedRow] = useState<ProcessOut | null>(null)
  const [selectedProcessOutId, setProcessOutId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)

  useEffect(() => {
    initProcessRecord()
  }, [page, drawerEditOpen])

  const initProcessRecord = async () => {
    setTotalData(0)
    setProcesRecords([])
    const result = await getAllProcessRecord(page - 1, pageSize)
    const data = result?.data
    if (data) {
      var recordsMapping: any[] = []
      data?.content.map((item: any) => {
        recordsMapping.push(
          createProcessRecord(
            item?.processOutId,
            item?.status,
            item?.processInId,
            item?.createdBy,
            item?.updatedBy,
            item?.processoutDetail,
            item?.createdAt,
            item?.updatedAt
          )
        )
      })
      setTotalData(data.totalPages)
      console.log('initProcessRecord', recordsMapping)
      setProcesRecords(recordsMapping)
      setFilteredProcessRecords(recordsMapping)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: t('processRecord.creationDate'),
      width: 200,
      type: 'string',
      renderCell: (params) => {
        const dateFormatted = displayCreatedDate(params.row.createdAt)
        
        return <div>{dateFormatted}</div>
      }
    },
    {
      field: 'createdBy',
      headerName: t('processRecord.handleName'),
      width: 200,
      type: 'string'
    },
    {
      field: 'processOutId',
      headerName: t('processRecord.processingNumb'),
      width: 200,
      type: 'string'
    },
    {
      field: 'disposalLoc',
      headerName: t('processRecord.processingLocation'),
      width: 200,
      type: 'string',
      renderCell: (params) => {
        return '-'
      }
    },
    {
      field: '',
      headerName: t('processRecord.handler'),
      width: 200,
      type: 'string'
    },
    {
      field: 'status',
      headerName: t('processRecord.status'),
      width: 200,
      type: 'string',
      renderCell: (params) => {
        return <StatusCard status={params.row.status} />
      }
    }
  ]

  const searchfield = [
    { label: t('processRecord.enterProcessingNumber'), field: 'search', width: '20%' },
    {
      label: t('processRecord.handleName'),
      width: '20%',
      options: getUniqueOptions('createdBy'),
      field: 'recycTypeId'
    },
    {
      label: t('processRecord.location'),
      width: '20%',
      options: getUniqueOptions('disposalLoc'),
      field: 'recycSubTypeId'
    }
  ]

  function getUniqueOptions(propertyName: keyof any) {
    const optionMap = new Map()
    procesRecords.forEach((row) => {
      optionMap.set(row[propertyName], row[propertyName])
    })
    const options: Option[] = Array.from(optionMap.values()).map((option) => ({
      value: option,
      label: option
    }))

    options.push({
      value: "",
      label: t('check_in.any')
    })
    return options
  }

  const handleSelectRow = (params: GridRowParams) => {
    const selectedProcessOut = procesRecords.find(
      (item) => item.processOutId == params.row.processOutId
    )
    setSelectedRow(selectedProcessOut)
    setDrawerEditOpen(true)
  }

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  const handleSearch = (label: string, value: string) => {
    console.log('hanlde search', label, value)
    if (label == 'search') {
      if (value == '') return setFilteredProcessRecords(procesRecords)
      const filtered: ProcessOut[] = procesRecords.filter(
        (item) => item.processOutId == value
      )
      filtered
        ? setFilteredProcessRecords(filtered)
        : setFilteredProcessRecords(procesRecords)
    }

    if (label == 'createdBy') {
      const filtered: ProcessOut[] = procesRecords.filter(
        (item) => item.createdBy == value
      )
      filtered
        ? setFilteredProcessRecords(filtered)
        : setFilteredProcessRecords(procesRecords)
    }
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          pr: 4
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginY: {
              sm: 4,
              xs: 6
            },
            marginLeft: {
              xs: 3
            },
            marginBottom: {
              xs: 0
            }
          }}
        >
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t('processRecord.processingRecords')}
          </Typography>
        </Box>
        <Box
          sx={{
            display: {
              sm: 'flex',
              xs: 'block'
            }
          }}
          mt={3}
        >
          {searchfield.map((s, index) => (
            <CustomSearchField
              key={index}
              label={s.label}
              field={s.field}
              width={s.width}
              options={s.options || []}
              onChange={handleSearch}
            />
          ))}
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: '100%' }}>
            <DataGrid
              rows={filteredProcessRecords}
              getRowId={(row) => row.processOutId}
              hideFooter
              columns={columns}
              checkboxSelection={false}
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
            <Pagination
              className="mt-4"
              count={Math.ceil(totalData)}
              page={page}
              onChange={(_, newPage) => {
                setPage(newPage)
              }}
            />
          </Box>
          <EditProcessRecord
            drawerOpen={drawerEditOpen}
            handleDrawerClose={() => setDrawerEditOpen(false)}
            selectedRow={selectedRow}
          />
        </div>
      </Box>
    </>
  )
}

export default ProcessRecord
