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
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'

import { useTranslation } from 'react-i18next'
import i18n from '../../../setups/i18n'

interface Option {
  value: string
  label: string
}

function createProcessRecord(
  id: number,
  handleName: number,
  processingNum: string,
  disposalLoc: string,
  handler: number,
  condition: string,
  createdAt: string
): any {
  return {
    id,
    handleName,
    processingNum,
    disposalLoc,
    handler,
    condition,
    createdAt
  }
}

const ProcessRecord: FunctionComponent = () => {
  const { t } = useTranslation()
  const [drawerEditOpen, setDrawerEditOpen] = useState(false)
  const [procesRecords, setProcesRecords] = useState<any[]>([])
  const [filteredProcessRecords, setFilteredProcessRecords] = useState<any[]>(
    []
  )
  const [selectedRow, setSelectedRow] = useState<any | null>(null)
  const [rowId, setRowId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)

  useEffect(() => {
    initProcessRecord()
  }, [])

  const dummyRecord = [
    {
      id: 1,
      createdAt: '2023/09/18 18:00',
      handleName: 'Classification and weight',
      processingNum: 'PI12345678',
      disposalLoc: 'Disposal location',
      handler: 'Chen Dawen',
      condition: 'processing'
    },
    {
      id: 2,
      createdAt: '2023/09/18 18:00',
      handleName: 'Classification and weight',
      processingNum: 'PI12345678',
      disposalLoc: 'Disposal location',
      handler: 'Chen Dawen',
      condition: 'confirmed'
    },
    {
      id: 3,
      createdAt: '2023/09/18 18:00',
      handleName: 'Classification and weight',
      processingNum: 'PI12345678',
      disposalLoc: 'Disposal location',
      handler: 'Chen Dawen',
      condition: 'pending'
    },
    {
      id: 4,
      createdAt: '2023/09/18 18:00',
      handleName: 'Classification and weight',
      processingNum: 'PI12345678',
      disposalLoc: 'Disposal location',
      handler: 'Chen Dawen',
      condition: 'rejected'
    },
    {
      id: 5,
      createdAt: '2023/09/18 18:00',
      handleName: 'Classification and weight',
      processingNum: 'PI12345678',
      disposalLoc: 'Disposal location',
      handler: 'Chen Dawen',
      condition: 'completed'
    },
    {
      id: 6,
      createdAt: '2023/09/18 18:00',
      handleName: 'Classification and weight',
      processingNum: 'PI12345678',
      disposalLoc: 'Disposal location',
      handler: 'Chen Dawen',
      condition: 'cancelled'
    },
    {
      id: 7,
      createdAt: '2023/09/18 18:00',
      handleName: 'Classification and weight',
      processingNum: 'PI12345678',
      disposalLoc: 'Disposal location',
      handler: 'Chen Dawen',
      condition: 'overdue'
    }
  ]

  const initProcessRecord = async () => {
    var recordsMapping: any[] = []
    dummyRecord.map((item: any) => {
      recordsMapping.push(
        createProcessRecord(
          item?.id,
          item?.handleName,
          item?.processingNum,
          item?.disposalLoc,
          item?.handler,
          item?.condition,
          item?.createdAt
        )
      )
    })
    setProcesRecords(recordsMapping)
    // setTotalData(data.totalPages)
  }

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: t('processRecord.creationDate'),
      width: 200,
      type: 'string',
      renderCell: (params) => {
        const dateFormatted = dayjs(new Date(params.row.createdAt)).format(
          format.dateFormat1
        )
        return <div>{dateFormatted}</div>
      }
    },
    {
      field: 'handleName',
      headerName: t('processRecord.handleName'),
      width: 200,
      type: 'string'
    },
    {
      field: 'processingNum',
      headerName: t('processRecord.processingNumb'),
      width: 200,
      type: 'string'
    },
    {
      field: 'disposalLoc',
      headerName: t('processRecord.processingLocation'),
      width: 200,
      type: 'string'
    },
    {
      field: 'handler',
      headerName: t('processRecord.handler'),
      width: 200,
      type: 'string'
    },
    {
      field: 'condition',
      headerName: t('processRecord.status'),
      width: 200,
      type: 'string',
      renderCell: (params) => {
        return <StatusCard status={params.row.condition.toLowerCase()} />
      }
    }
  ]

  const searchfield = [
    { label: t('pick_up_order.filter.search'), width: '100%' },
    {
      label: t('processRecord.handleName'),
      width: '100%',
      options: [],
      //options: getUniqueOptions('handleName'),
      field: 'recycTypeId'
    },
    {
      label: t('processRecord.location'),
      width: '100%',
      options: [],
      //options: getUniqueOptions('disposalLoc'),
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
    return options
  }

  const handleSelectRow = (params: GridRowParams) => {
    const selectedInv = procesRecords.find(
      (item) => item.itemId == params.row.itemId
    )
    setSelectedRow(selectedInv)
    setDrawerEditOpen(true)
  }

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  const handleSearch = (label: string, value: string) => {
    console.log('hanlde search', label, value)
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
            marginY: 4
          }}
        >
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t('processRecord.processingRecords')}
          </Typography>
        </Box>
        <Stack direction="row" mt={3}>
          {searchfield.map((s, index) => (
            <CustomSearchField
              key={index}
              label={s.label}
              //   field={s.field}
              width={s.width}
              options={s.options || []}
              //   onChange={handleSearch}
            />
          ))}
        </Stack>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: '100%' }}>
            <DataGrid
              rows={procesRecords}
              getRowId={(row) => row.id}
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
