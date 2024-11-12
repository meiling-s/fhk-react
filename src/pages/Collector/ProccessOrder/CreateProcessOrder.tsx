import { useState, useEffect, SyntheticEvent } from 'react'
import {
  Box,
  Grid,
  Button,
  Typography,
  FormControl,
  MenuItem,
  Divider
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import {
  DatePicker,
  LocalizationProvider,
  TimePicker
} from '@mui/x-date-pickers'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import InputProcessForm from '../../Collector/ProccessOrder/InputProcessForm'
import { styles } from '../../../constants/styles'
import {
  extractError,
  getThemeColorRole,
  getPrimaryColor,
  showErrorToast,
  showSuccessToast
} from '../../../utils/utils'
import { localStorgeKeyName, STATUS_CODE } from '../../../constants/constant'
import {
  CreatePorForm,
  PorDetail,
  CreateProcessOrderDetail
} from '../../../interfaces/processOrderQuery'
import { createProcessOrder } from '../../../APICalls/processOrder'

import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { getAllWarehouse } from '../../../APICalls/warehouseManage'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import dayjs from 'dayjs'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'

type rowPorDtl = {
  id: number
  processTypeLabel: string
  processTypeId: string
  datetime: string
  warehouse: string[]
  weight: string
  itemCategory: string
  mainCategory: string
  subCategory: string
  additionalInfo: string
}

type ProcessInDtlData = {
  id: string
  name: string
  rows: rowPorDtl[]
}

const CreateProcessOrder = ({}: {}) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [inputProcessDrawer, setInputProcessDrawer] = useState<boolean>(false)
  const [warehouseList, setWarehouseList] = useState<il_item[]>([])
  const [processStartAt, setProcessStartAt] = useState<dayjs.Dayjs>(dayjs())
  const [selectedWarehouse, setSelectedWarehouse] = useState<il_item | null>(
    null
  )
  const [processOrderDtlSource, setProcessOrderDtlSource] = useState<
    PorDetail[]
  >([])

  const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'
  const colorTheme: string = getThemeColorRole(role)
  const { dateFormat, processType } = useContainer(CommonTypeContainer)
  const [processTypeList, setProcessTypeList] = useState<il_item[]>([])

  const buttonFilledCustom = {
    borderRadius: '40px',
    borderColor: '#7CE495',
    backgroundColor: colorTheme,
    color: 'white',
    fontWeight: 'bold',
    transition: '0.3s',
    '&.MuiButton-root:hover': {
      backgroundColor: colorTheme,
      borderColor: '#D0DFC2',
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)'
    }
  }

  const buttonOutlinedCustom = {
    borderRadius: '40px',
    border: 1,
    borderColor: colorTheme,
    backgroundColor: 'white',
    color: colorTheme,
    fontWeight: 'bold',
    '&.MuiButton-root:hover': {
      bgcolor: '#F4F4F4'
    },
    width: 'max-content'
  }

  const columns: GridColDef[] = [
    {
      field: 'processTypeLabel',
      headerName: '',
      width: 150,
      renderCell: (params) => {
        return t('processOrder.table.processIn')
      }
    },

    {
      field: 'datetime',
      headerName: t('processOrder.table.startOrFinishDate'),
      width: 180,
      renderCell: (params) => {
        return dayjs
          .utc(params.row.datetime)
          .tz('Asia/Hong_Kong')
          .format(`${dateFormat} HH:mm`)
      }
    },
    {
      field: 'warehouse',
      headerName: t('processOrder.create.warehouse'),
      width: 150
    },
    { field: 'weight', headerName: t('inventory.weight'), width: 100 },
    {
      field: 'itemCategory',
      headerName: t('processOrder.create.itemCategory'),
      width: 150,
      renderCell: (params) => {
        const categoryLabel =
          params.row.itemCategory === 'product'
            ? t('processOrder.create.product')
            : t('processOrder.create.recycling')
        return categoryLabel
      }
    },
    {
      field: 'mainCategory',
      headerName: t('settings_page.recycling.main_category'),
      width: 150
    },
    {
      field: 'subCategory',
      headerName: t('settings_page.recycling.sub_category'),
      width: 150
    },
    {
      field: 'additionalInfo',
      headerName: t('settings_page.recycling.additional_category'),
      width: 150
    }
  ]

  const [rows, setRows] = useState<rowPorDtl[]>([])
  const [processInDetailData, setProcessInDetailData] = useState<
    ProcessInDtlData[]
  >([])

  const initProcessType = async () => {
    let processList: il_item[] = []

    if (processType) {
      processType?.forEach((item: any) => {
        var name =
          i18n.language === 'zhhk'
            ? item.processTypeNameTchi
            : i18n.language === 'zhch'
            ? item.processTypeNameSchi
            : item.processTypeNameEng

        processList.push({
          id: item.processTypeId.toString(),
          name: name
        })
      })
      setProcessTypeList(processList)
    }
  }

  const initWarehouse = async () => {
    try {
      const result = await getAllWarehouse(0, 1000)
      if (result) {
        let warehouse: il_item[] = []
        const data = result.data.content
        data.forEach((item: any) => {
          var warehouseName =
            i18n.language === 'zhhk'
              ? item.warehouseNameTchi
              : i18n.language === 'zhch'
              ? item.warehouseNameSchi
              : item.warehouseNameTchi

          warehouse.push({
            id: item.warehouseId.toString(),
            name: warehouseName
          })
        })
        warehouse.push({
          id: '',
          name: t('check_in.any')
        })
        setWarehouseList(warehouse)
        if (warehouse.length > 0) setSelectedWarehouse(warehouse[0])
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  useEffect(() => {
    initWarehouse()
    initProcessType()
  }, [])

  const mappingProcessDtl = (updatedProcessOrderDtlSource: PorDetail[]) => {
    let rowData: rowPorDtl[] = []
    updatedProcessOrderDtlSource.map((item: PorDetail) => {
      rowData.push({
        id: item.id,
        processTypeLabel: '',
        processTypeId: item.processTypeId,
        datetime: item.plannedStartAt,
        warehouse: item.processOrderDetailWarehouse,
        weight: item.estInWeight,
        itemCategory: item.itemCategory,
        mainCategory:
          item.processOrderDetailProduct.productTypeId != ''
            ? item.processOrderDetailProduct.productTypeId
            : item.processOrderDetailRecyc.recycTypeId,
        subCategory:
          item.processOrderDetailProduct.productSubTypeId != ''
            ? item.processOrderDetailProduct.productSubTypeId
            : item.processOrderDetailRecyc.recycSubTypeId,
        additionalInfo: item.processOrderDetailProduct.productAddonId
      })
    })
    setRows(rowData)

    let rawProcessOrderInDtl: ProcessInDtlData[] = []
    processTypeList.map((item) => {
      const selectedRow = rowData.filter((it) => it.processTypeId === item.id)
      if (selectedRow.length > 0) {
        rawProcessOrderInDtl.push({
          id: item.id,
          name: item.name,
          rows: selectedRow
        })
      }
    })

    setProcessInDetailData(rawProcessOrderInDtl)
  }

  const onSaveProcessDtl = async (data: any) => {
    setProcessOrderDtlSource((prevProcessOrderDtlSource) => {
      const updatedProcessOrderDtlSource: PorDetail[] = [
        ...prevProcessOrderDtlSource,
        ...data
      ].flat()
      mappingProcessDtl(updatedProcessOrderDtlSource)
      return updatedProcessOrderDtlSource
    })
  }

  const submitProcessOrder = async () => {
    //constract detail data
    let processOrderDetailTemp: CreateProcessOrderDetail[] = []
    processInDetailData.map((item) => {
      item.rows.map((row) => {
        processOrderDetailTemp.push({
          processTypeId: row.processTypeId,
          estInWeight: parseFloat(row.weight),
          estOutWeight: 0,
          plannedStartAt: row.datetime,
          processOrderDetailProduct:
            row.itemCategory === 'product'
              ? [
                  {
                    productTypeId: row.mainCategory,
                    productSubTypeId: row.subCategory,
                    productAddonTypeId: row.additionalInfo
                  }
                ]
              : [],
          processOrderDetailRecyc:
            row.itemCategory === 'recycling'
              ? [
                  {
                    recycTypeId: row.mainCategory,
                    recycSubTypeId: row.subCategory
                  }
                ]
              : [],
          processOrderDetailWarehouse: row.warehouse.map((wr) => ({
            warehouseId: parseInt(wr)
          }))
        })
      })
    })
    const formData: CreatePorForm = {
      factoryId: 0,
      processStartAt: formattedDate(processStartAt),
      createdBy: role,
      processOrderDetail: processOrderDetailTemp
    }

    const result = await createProcessOrder(formData)
    console.log('result', result)
    if (result) {
      showSuccessToast(t('common.saveFailed'))
      navigate(-1)
    } else {
      showErrorToast(t('common.saveFailed'))
    }
  }

  const formattedDate = (dateData: dayjs.Dayjs) => {
    return dateData.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  }

  return (
    <>
      <Box sx={[styles.innerScreen_container, { paddingRight: 0 }]}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          <Grid
            container
            direction={'column'}
            spacing={2.5}
            sx={{ ...styles.gridForm }}
          >
            <Grid item>
              <Button sx={[styles.headerSection]} onClick={() => navigate(-1)}>
                <ArrowBackIosIcon sx={{ fontSize: 15, marginX: 0.5 }} />
                <Typography sx={styles.header1}>
                  {t('purchase_order.create.create_order')}
                </Typography>
              </Button>
            </Grid>
            <Grid item>
              <Typography sx={styles.header3}>
                {t('processOrder.createdate')}
              </Typography>
              <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Box sx={{ ...localstyles.DateItem }}>
                  <DatePicker
                    defaultValue={dayjs(processStartAt)}
                    format={dateFormat}
                    onChange={(value) => setProcessStartAt(value!!)}
                    sx={{ ...localstyles.datePicker }}
                  />
                </Box>
                <Box sx={{ ...localstyles.timePeriodItem }}>
                  <TimePicker
                    value={processStartAt}
                    onChange={(value) => setProcessStartAt(value!!)}
                    sx={{ ...localstyles.timePicker }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Typography sx={{ ...styles.header3, marginBottom: 2 }}>
                {t('processOrder.workshop')}
              </Typography>
              <FormControl
                sx={{
                  width: '100%'
                }}
              >
                <Select
                  labelId="workshop"
                  id="workshop"
                  placeholder="Select warehouse"
                  value={selectedWarehouse?.id || ''}
                  sx={{
                    borderRadius: '12px',
                    width: '309px',
                    background: 'white'
                  }}
                  onChange={(event: SelectChangeEvent<string>) => {
                    const selectedValue = warehouseList.find(
                      (item) => item.id === event.target.value
                    )
                    if (selectedValue) {
                      setSelectedWarehouse(selectedValue)
                    }
                  }}
                >
                  {warehouseList?.length > 0 ? (
                    warehouseList?.map((item, index) => (
                      <MenuItem value={item?.id} key={index}>
                        {item?.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      <em>{t('common.noOptions')}</em>
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item sx={{ width: '100%' }}>
              <Typography
                sx={{
                  ...styles.header2,
                  marginBottom: 2
                }}
              >
                {t('processOrder.porCategory')}
              </Typography>

              {/* datagrid display proccessInList */}
              {processInDetailData.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    height: 'max-content',
                    width: '100%',
                    background: 'white',
                    padding: 2,
                    borderRadius: '16px',
                    marginBottom: 4
                  }}
                >
                  <div>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                  </div>
                  <Divider></Divider>
                  <DataGrid
                    rows={item.rows}
                    columns={columns}
                    hideFooter
                    checkboxSelection={false}
                    getRowClassName={(params) =>
                      params.indexRelativeToCurrentPage % 2 === 1
                        ? 'row-divider'
                        : ''
                    }
                    sx={{
                      border: 'none',
                      '& .MuiDataGrid-cell': {
                        border: 'none'
                      },
                      '& .row-divider': {
                        borderRadius: '0px !important',
                        borderBottom: '1px solid #e0e0e0' // Divider style
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
                      '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                        display: 'none'
                      },
                      '& .MuiDataGrid-overlay': {
                        display: 'none'
                      }
                    }}
                  />
                </Box>
              ))}

              {/* form input process In */}
              <InputProcessForm
                drawerOpen={inputProcessDrawer}
                handleDrawerClose={() => setInputProcessDrawer(false)}
                plannedStartAt={formattedDate(processStartAt)}
                dataSet={processOrderDtlSource}
                onSave={onSaveProcessDtl}
              ></InputProcessForm>
              <Button
                variant="outlined"
                startIcon={
                  <AddCircleIcon
                    sx={{ fontSize: 25, color: colorTheme, pr: 1 }}
                  />
                }
                onClick={() => {
                  setInputProcessDrawer(true)
                }}
                sx={{
                  height: '40px',
                  width: '100%',
                  mt: '20px',
                  borderColor: colorTheme,
                  color: 'black',
                  borderRadius: '10px'
                }}
              >
                {t('pick_up_order.new')}
              </Button>
            </Grid>
            <Grid item>
              <Typography
                sx={{
                  ...styles.header3,
                  paddingX: '4px',
                  paddingRight: '16px'
                }}
              >
                {t('common.createdDatetime') +
                  ' : ' +
                  dayjs
                    .utc(new Date())
                    .tz('Asia/Hong_Kong')
                    .format(`${dateFormat} HH:mm`)}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                sx={[
                  buttonFilledCustom,
                  { width: '200px', fontSize: 18, mr: 3 }
                ]}
                onClick={submitProcessOrder}
              >
                {t('pick_up_order.finish')}
              </Button>
              <Button
                sx={[
                  buttonOutlinedCustom,
                  { width: '200px', fontSize: 18, mr: 3 }
                ]}
                onClick={() => {
                  navigate(-1)
                }}
              >
                {t('pick_up_order.cancel')}
              </Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Box>
    </>
  )
}

const localstyles = {
  datePicker: {
    ...styles.textField,
    maxWidth: '370px',
    '& .MuiIconButton-edgeEnd': {
      color: getPrimaryColor()
    }
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 10
  },
  DateItem: {
    display: 'flex',
    height: 'fit-content',
    alignItems: 'center'
  },

  timePicker: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: 'white',
    '& fieldset': {
      borderWidth: 0
    },
    '& input': {
      paddingX: 0
    },
    '& .MuiIconButton-edgeEnd': {
      color: getPrimaryColor()
    }
  },
  timePeriodItem: {
    display: 'flex',
    height: 'fit-content',
    paddingX: 2,
    alignItems: 'center',
    backgroundColor: 'white',
    border: 2,
    borderRadius: 3,
    borderColor: '#E2E2E2'
  }
}

export default CreateProcessOrder
