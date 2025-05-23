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
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import EditProcessRecord from './EditProcesRecord'
import {
  STATUS_CODE,
  format,
  localStorgeKeyName
} from '../../../constants/constant'
import StatusCard from '../../../components/StatusCard'
import {
  ProcessOut,
  processOutImage,
  ProcessOutItem
} from '../../../interfaces/processRecords'
import {
  getAllProcessRecord,
  getProcessIn
} from '../../../APICalls/Collector/processRecords'
import CircularLoading from '../../../components/CircularLoading'
import { useTranslation } from 'react-i18next'
import i18n from '../../../setups/i18n'
import { displayCreatedDate, extractError, debounce } from '../../../utils/utils'
import { ProcessType } from '../../../interfaces/common'
import { useNavigate } from 'react-router-dom'
import { queryProcessRecord } from '../../../interfaces/processRecords'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import useLocaleTextDataGrid from '../../../hooks/useLocaleTextDataGrid'
dayjs.extend(utc)
dayjs.extend(timezone)

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
  updatedAt: string,
  address: string,
  packageTypeId: string,
  packageName: string,
  version: number,
  labelId?: string,
): ProcessOut {
  return {
    processOutId,
    status,
    processInId,
    createdBy,
    updatedBy,
    processoutDetail,
    createdAt,
    updatedAt,
    address,
    packageTypeId,
    packageName,
    version,
    labelId
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
  const {dateFormat, processTypeListData } = useContainer(CommonTypeContainer)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const navigate = useNavigate()
  const [query, setQuery] = useState<queryProcessRecord>({
    processOutId: null,
    processType: '',
    processAddress: ''
  })
  const { localeTextDataGrid } = useLocaleTextDataGrid()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    initProcessRecord()
  }, [page, query])

  const getProcessInDetail = async (processInId: number) => {
    try {
      const result = await getProcessIn(processInId)
      if (result) {
        // console.log("getProcessInDetail",result)
        return result.data
      }
    } catch (error) {
      throw error
    }
  }

  const initProcessRecord = async () => {
    setIsLoading(true)
    try {
      setTotalData(0)
      setProcesRecords([])
      const result = await getAllProcessRecord(page - 1, pageSize, query)
      if (result.status === STATUS_CODE[200]) {
        const data = result?.data
        var recordsMapping: any[] = []
        await Promise.all(
          data.content.map(async (item: any) => {
            const dateInHK = dayjs.utc(item.createdAt).tz('Asia/Hong_Kong')
            const createdAt = dateInHK.format(`${dateFormat} HH:mm`)
            const processName = mappingProcessName(item?.processTypeId)
            recordsMapping.push(
              createProcessRecord(
                item?.processOutId,
                item?.status,
                item?.processInId,
                item?.createdBy,
                item?.updatedBy,
                item?.processoutDetail,
                createdAt,
                item?.updatedAt,
                item?.address,
                item?.processTypeId,
                processName || '-',
                item.version,
                item.labelId,
              )
            )
          })
        )

        setTotalData(data.totalPages)
        setProcesRecords(recordsMapping)
        setFilteredProcessRecords(recordsMapping)
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      } else {
        setTotalData(0)
        setProcesRecords([])
        setFilteredProcessRecords([])
      }
    }
    setIsLoading(false)
  }

  const mappingProcessName = (processTypeId: string) => {
    const matchingProcess = processTypeListData?.find(
      (item: ProcessType) => item.processTypeId === processTypeId
    )

    if (matchingProcess) {
      var name = ''
      switch (i18n.language) {
        case 'enus':
          name = matchingProcess.processTypeNameEng
          break
        case 'zhch':
          name = matchingProcess.processTypeNameSchi
          break
        case 'zhhk':
          name = matchingProcess.processTypeNameTchi
          break
        default:
          name = matchingProcess.processTypeNameTchi
          break
      }
      return name
    } else {
      return 'N/A'
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: t('processRecord.creationDate'),
      width: 200,
      type: 'string'
    },
    {
      field: 'packageTypeId',
      headerName: t('processRecord.handleName'),
      width: 200,
      type: 'string',
      renderCell: (params) => {
        const processName = mappingProcessName(params.row.packageTypeId)

        return <div>{processName}</div>
      }
    },
    {
      field: 'labelId',
      headerName: t('processRecord.processingNumb'),
      width: 200,
      type: 'string'
    },
    {
      field: 'address',
      headerName: t('processRecord.processingLocation'),
      width: 200,
      type: 'string'
    },
    {
      field: 'createdBy',
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
    {
      label: t('processRecord.processingNumb'),
      placeholder: t('processRecord.enterProcessingNumber'),
      field: 'processOutId',
      // width: ''
    },
    {
      label: t('processRecord.handleName'),
      options: getUniqueOptions('packageTypeId'),
      field: 'processType'
      // width: '100%'
    },
    {
      label: t('processRecord.processingLocation'),
      options: getUniqueOptions('address'),
      field: 'processAddress'
      // width: '100%'
    }
  ]

  function getUniqueOptions(propertyName: keyof any) {
    const optionMap = new Map()
    procesRecords.forEach((row) => {
      optionMap.set(row[propertyName], row[propertyName])
    })
    const options: Option[] = Array.from(optionMap.values())
      .map((option) => {
        const label =
          propertyName === 'packageTypeId' ? mappingProcessName(option) : option
        return label !== undefined ? { value: option, label: label } : undefined
      })
      .filter((option): option is Option => option !== undefined)

    options.push({
      value: '',
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

  const updateQuery = (newQuery: Partial<queryProcessRecord>) => {
    setQuery({ ...query, ...newQuery })
  }

  const handleSearch = debounce((label: string, value: string) => {
    setPage(1)
    updateQuery({ [label]: value })
  }, 500)

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
            },
            width: '100%'
          }}
          mt={3}
        >
          {searchfield.map((s, index) => (
            <CustomSearchField
              key={index}
              label={s.label}
              field={s.field}
              placeholder={s?.placeholder}
              // width={s.width}
              options={s.options || []}
              onChange={handleSearch}
            />
          ))}
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: '100%' }}>
            {isLoading ? (
              <CircularLoading />
            ) : (
              <Box>
                <DataGrid
                  rows={filteredProcessRecords}
                  getRowId={(row) => row.processOutId}
                  hideFooter
                  columns={columns}
                  onRowClick={handleSelectRow}
                  getRowSpacing={getRowSpacing}
                  localeText={localeTextDataGrid}
                  getRowClassName={(params) =>
                    selectedRow && params.id === selectedRow.processOutId
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
          <EditProcessRecord
            drawerOpen={drawerEditOpen}
            handleDrawerClose={() => {
              setDrawerEditOpen(false)
              setSelectedRow(null)
            }}
            selectedRow={selectedRow}
          />
        </div>
      </Box>
    </>
  )
}

export default ProcessRecord
