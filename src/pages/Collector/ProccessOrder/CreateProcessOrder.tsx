import { useState, useEffect, SyntheticEvent } from 'react'
import {
  Box,
  Grid,
  Button,
  Typography,
  FormControl,
  MenuItem,
  Divider,
  Stack,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import {
  DatePicker,
  LocalizationProvider,
  TimePicker
} from '@mui/x-date-pickers'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
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
  showSuccessToast,
  formatWeight,
  returnErrorMsg
} from '../../../utils/utils'
import {
  formErr,
  localStorgeKeyName,
  STATUS_CODE
} from '../../../constants/constant'
import {
  CreatePorForm,
  CreateProcessOrderDetailPairs,
  QueryEstEndDatetime
} from '../../../interfaces/processOrderQuery'
import {
  createProcessOrder,
  getEstimateEndTime,
  getFactories
} from '../../../APICalls/processOrder'

import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { getAllWarehouse } from '../../../APICalls/warehouseManage'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import dayjs from 'dayjs'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import { DELETE_OUTLINED_ICON, EDIT_OUTLINED_ICON } from 'src/themes/icons'
import { formValidate } from 'src/interfaces/common'
import { FormErrorMsg } from 'src/components/FormComponents/FormErrorMsg'
import {
  mappingRecy,
  mappingSubRecy,
  mappingProductType,
  mappingSubProductType,
  mappingAddonsType
} from './utils'
import React from 'react'

type rowPorDtl = {
  id: string
  processTypeId: string
  processAction: string
  datetime: string
  warehouse: string
  weight: string | number
  itemCategory: string
  mainCategory: string
  subCategory: string
  additionalInfo: string
}

type ProcessInDtlData = {
  id: string
  name: string
  idPair: number
  rows: rowPorDtl[]
}

interface RowData {
  id: number
  name: string
  children?: RowData[]
}

type DeleteModalProps = {
  open: boolean
  selectedItem: ProcessInDtlData | null
  onClose: () => void
  onDelete: (item: ProcessInDtlData) => void
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  selectedItem,
  onClose,
  onDelete
}) => {
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
          <Box sx={{ paddingX: 3, paddingTop: 3 }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold' }}
            >
              {t('pick_up_order.delete_msg')}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ alignSelf: 'center', paddingBottom: 3 }}>
            <button
              className="primary-btn mr-2 cursor-pointer"
              onClick={() => onDelete(selectedItem!!)}
            >
              {t('check_in.confirm')}
            </button>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={() => {
                onClose()
              }}
            >
              {t('check_out.cancel')}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

const CreateProcessOrder = ({}: {}) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [inputProcessDrawer, setInputProcessDrawer] = useState<boolean>(false)
  const [warehouseList, setWarehouseList] = useState<il_item[]>([])
  const [processStartAt, setProcessStartAt] = useState<dayjs.Dayjs | null>(
    dayjs()
  )
  const [factoryList, setFactoryList] = useState<il_item[]>([])
  const [selectedFactory, setSelectedFactory] = useState<il_item | null>(null)
  const [processOrderDtlSource, setProcessOrderDtlSource] = useState<
    CreateProcessOrderDetailPairs[]
  >([])
  const [action, setAction] = useState<'add' | 'edit' | 'delete' | 'none'>(
    'add'
  )
  const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'
  const colorTheme: string = getThemeColorRole(role)
  const {
    dateFormat,
    decimalVal,
    getProcessTypeList,
    processTypeListData,
    recycType,
    productType,
    getProductType
  } = useContainer(CommonTypeContainer)
  const [processTypeList, setProcessTypeList] = useState<il_item[]>([])
  const [processInDetailData, setProcessInDetailData] = useState<
    ProcessInDtlData[]
  >([])
  const [selectedDetailPOR, setSelectedPOR] = useState<
    CreateProcessOrderDetailPairs[] | null
  >(null)
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [selectedDeletedItem, setSelectedDeletedItem] =
    useState<ProcessInDtlData | null>(null)
  const [errCreatedDate, setErrCreatedDate] = useState<boolean>(false)
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
      field: 'processAction',
      headerName: '',
      width: 150,
      renderCell: (params) => {
        let processLabel = ''
        if (params.row.processAction != '') {
          processLabel =
            params.row.processAction === 'PROCESS_IN'
              ? t('processOrder.table.processIn')
              : t('processOrder.table.processOut')
        }
        return processLabel
      }
    },

    {
      field: 'datetime',
      headerName: t('processOrder.table.startOrFinishDate'),
      width: 180,
      renderCell: (params) => {
        let dateTime = ''
        if (params.row.processAction !== '') {
          if (params.row.processAction === 'PROCESS_IN') {
            dateTime = params.row.datetime
              ? dayjs.utc(params.row.datetime).format(`${dateFormat} HH:mm`)
              : dayjs.utc(params.row?.datetime).format(`${dateFormat} HH:mm`)
          } else {
            dateTime = dayjs
              .utc(params.row?.datetime)

              .format(`${dateFormat} HH:mm`)
          }
        }

        return dateTime
      }
    },
    {
      field: 'warehouse',
      headerName: t('processOrder.create.warehouse'),
      width: 400,
      cellClassName: 'wrapText',
      renderCell: (params) => {
        let warehouseListName = ''
        if (params.row.warehouse != '') {
          const warehouseIds = params.row.warehouse.split(',')

          if (warehouseIds.length > 0) {
            warehouseListName = warehouseIds
              ?.map((id: string) => {
                const warehouse = warehouseList.find(
                  (it) => it.id === id.toString()
                )
                return warehouse ? warehouse.name : null
              })
              .filter(Boolean)
              .join(', ')
          }
        }

        return (
          <div
            style={{
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              maxWidth: '400px',
              overflow: 'auto',
              padding: '8px'
            }}
          >
            {warehouseListName}
          </div>
        )
      }
    },
    { field: 'weight', headerName: t('inventory.weight'), width: 100 },
    {
      field: 'itemCategory',
      headerName: t('processOrder.details.itemCategory'),
      width: 150,
      renderCell: (params) => {
        const categoryLabel =
          params.row.itemCategory != ''
            ? params.row.itemCategory === 'product'
              ? t('processOrder.create.product')
              : t('processOrder.create.recycling')
            : '-'
        return categoryLabel
      }
    },
    {
      field: 'mainCategory',
      headerName: t('settings_page.recycling.main_category'),
      width: 150,
      renderCell: (params) => {
        let name = ''
        if (params.row.itemCategory != 'product') {
          name = mappingRecy(params.row.mainCategory, recycType)
        } else {
          name = mappingProductType(params.row.mainCategory, productType)
        }
        return name
      }
    },
    {
      field: 'subCategory',
      headerName: t('settings_page.recycling.sub_category'),
      width: 150,
      renderCell: (params) => {
        let name = ''
        if (params.row.itemCategory != 'product') {
          name = mappingSubRecy(
            params.row.mainCategory,
            params.row.subCategory,
            recycType
          )
        } else {
          name = mappingSubProductType(
            params.row.mainCategory,
            params.row.subCategory,
            productType
          )
        }
        return name
      }
    },
    {
      field: 'additionalInfo',
      headerName: t('settings_page.recycling.additional_category'),
      width: 150,
      renderCell: (params) => {
        let name = ''
        if (params.row.itemCategory === 'product') {
          name = mappingAddonsType(
            params.row.mainCategory,
            params.row.subCategory,
            params.row.additionalInfo,
            productType
          )
        }
        return name
      }
    }
  ]

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const initProcessType = async () => {
    let processList: il_item[] = []

    if (processTypeListData) {
      processTypeListData?.forEach((item: any) => {
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
              : item.warehouseNameEng

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
      if (factory.length > 0)
        setSelectedFactory(selectedFactory?.id ? selectedFactory : factory[0])
    }
  }

  const getEstimateEndDate = async (
    processTypeId: string,
    plannedStartAt: string,
    estInWeight: string
  ) => {
    const params: QueryEstEndDatetime = {
      processTypeId: processTypeId,
      estInWeight: parseInt(estInWeight),
      plannedStartAt: dayjs(plannedStartAt).format('YYYY-MM-DDTHH:mm:ss')
    }
    let plannedEndAt = ''
    const result = await getEstimateEndTime(params)
    if (result) {
      plannedEndAt = result.data
    }

    return plannedEndAt
  }

  const updateDateOnProcessDetail = async (
    dataSet: CreateProcessOrderDetailPairs[]
  ) => {
    if (processStartAt && processStartAt.isValid())
      for (let index = 0; index < dataSet.length; index++) {
        const detail = dataSet[index]

        if (index == 0) {
          detail.processIn.plannedStartAt = formattedDate(processStartAt)
        } else {
          detail.processIn.plannedStartAt =
            dataSet[index - 1].processOut.plannedEndAt
        }

        detail.processOut.plannedEndAt = await getEstimateEndDate(
          detail.processIn.processTypeId,
          processStartAt.toISOString(),
          detail.processIn.estInWeight as string
        )
      }
    mappingProcessOrderDtl(dataSet)
  }

  useEffect(() => {
    getProcessTypeList()
    initWarehouse()
    initProcessType()
    initFactory()
    getProductType()
  }, [])

  useEffect(() => {
    initWarehouse()
    initProcessType()
    initFactory()
  }, [i18n.language])

  useEffect(() => {
    updateDateOnProcessDetail(processOrderDtlSource)
  }, [processStartAt])

  useEffect(() => {
    const validate = async () => {
      const tempV: formValidate[] = []
      if (processStartAt === null) {
        tempV.push({
          field: t('processOrder.createdate'),
          problem: formErr.empty,
          type: 'error'
        })
      } else {
        !processStartAt?.isValid() &&
          tempV.push({
            field: t('processOrder.createdate'),
            problem: formErr.wrongFormat,
            type: 'error'
          })
      }
      processOrderDtlSource.length === 0 &&
        tempV.push({
          field: t('processOrder.porCategory'),
          problem: formErr.empty,
          type: 'error'
        })

      setValidation(tempV)
    }

    validate()
  }, [processOrderDtlSource, processStartAt])

  const mappingProcessOrderDtl = (
    updatedSource: CreateProcessOrderDetailPairs[]
  ) => {
    let rawProcessOrderInDtl: ProcessInDtlData[] = []
    let rowData: rowPorDtl[] = []
    console.log('updated source', updatedSource)

    let processNameFirst: string = ''
    updatedSource.map((item: CreateProcessOrderDetailPairs) => {
      rowData = []
      Object.entries(item).map(([key, value]) => {
        // constract product
        value.processOrderDetailProduct.map((val1, idx1) => {
          if (processNameFirst !== value.processAction) {
            processNameFirst = value.processAction
            rowData.push({
              id: 'product-' + value.processAction + value.processTypeId,
              processTypeId: value.processTypeId,
              processAction: value.processAction,
              datetime:
                value.processAction === 'PROCESS_IN'
                  ? item.processIn.plannedStartAt
                  : item.processOut.plannedEndAt,
              warehouse: value.processOrderDetailWarehouse
                .map((item) => item.warehouseId)
                .join(','),
              weight:
                value.processAction === 'PROCESS_IN'
                  ? item.processIn.estInWeight
                  : item.processOut.estOutWeight,
              itemCategory: 'product',
              mainCategory: val1.productTypeId,
              subCategory: val1.productSubTypeId,
              additionalInfo: val1.productAddonId
            })
          } else {
            rowData.push({
              id: 'product-' + val1.productTypeId + idx1,
              processTypeId: '',
              processAction: '',
              datetime: '',
              warehouse: '',
              weight: '',
              itemCategory: 'product',
              mainCategory: val1.productTypeId,
              subCategory: val1.productSubTypeId,
              additionalInfo: val1.productAddonId
            })
          }
        })

        // constract recylcling
        value.processOrderDetailRecyc.map((val1, idx1) => {
          if (processNameFirst !== value.processAction) {
            processNameFirst = value.processAction
            rowData.push({
              id: 'recyling-' + value.processAction + value.processTypeId,
              processTypeId: value.processTypeId,
              processAction: value.processAction,
              datetime:
                value.processAction === 'PROCESS_IN'
                  ? item.processIn.plannedStartAt
                  : item.processOut.plannedEndAt,
              warehouse: value.processOrderDetailWarehouse
                .map((item) => item.warehouseId)
                .join(','),
              weight:
                value.processAction === 'PROCESS_IN'
                  ? item.processIn.estInWeight
                  : item.processOut.estOutWeight,
              itemCategory: 'recybel',
              mainCategory: val1.recycTypeId,
              subCategory: val1.recycSubTypeId ?? '-',
              additionalInfo: '-'
            })
          } else {
            rowData.push({
              id: 'recyling-' + val1.recycTypeId + idx1,
              processTypeId: '',
              processAction: '',
              datetime: '',
              warehouse: '',
              weight: '',
              itemCategory: 'recybel',
              mainCategory: val1.recycTypeId,
              subCategory: val1.recycSubTypeId ?? '-',
              additionalInfo: '-'
            })
          }
        })
      })

      /**set process name */
      const processType = processTypeListData?.find(
        (type) => type.processTypeId === item.processIn.processTypeId
      )

      const processName =
        i18n.language === 'zhhk'
          ? processType?.processTypeNameTchi
          : i18n.language === 'zhch'
          ? processType?.processTypeNameSchi
          : processType?.processTypeNameEng

      rawProcessOrderInDtl.push({
        id: item.processIn.processTypeId,
        name: processName ?? '-',
        idPair: item.processIn.idPair,
        rows: rowData
      })
    })

    setProcessInDetailData(rawProcessOrderInDtl)
    console.log('setProcessInDetailData', rawProcessOrderInDtl)
  }

  const onSaveProcessDtl = (
    data: CreateProcessOrderDetailPairs[],
    isUpdate: boolean
  ) => {
    let updatedSource = []
    if (isUpdate) {
      updatedSource = processOrderDtlSource.map((item) => {
        if (item.processIn.idPair === data[0].processIn.idPair) {
          item = data[0]
        }
        return item
      })
    } else {
      updatedSource =
        processOrderDtlSource.length > 0
          ? [...processOrderDtlSource, ...data]
          : data
    }

    setProcessOrderDtlSource(updatedSource)
    mappingProcessOrderDtl(updatedSource)
  }

  const processOrderDetailTemp = (
    details: CreateProcessOrderDetailPairs[]
  ): CreateProcessOrderDetailPairs[] => {
    return details.map((detail) => {
      const { itemCategory, ...processInWithoutItemCategory } = detail.processIn
      const {
        itemCategory: outItemCategory,
        ...processOutWithoutItemCategory
      } = detail.processOut

      return {
        processIn: {
          ...processInWithoutItemCategory,
          estInWeight: formatWeight(detail.processIn.estInWeight, decimalVal)
        },
        processOut: {
          ...processOutWithoutItemCategory,
          estOutWeight: formatWeight(detail.processOut.estOutWeight, decimalVal)
        }
      }
    })
  }

  const submitProcessOrder = async () => {
    if (validation.length !== 0) {
      setTrySubmited(true)
      return
    }

    const processedDetailsPair = processOrderDetailTemp(processOrderDtlSource)

    // temporary solution since the productAddonId type field is used on many components and changes it directly might cause bugs
    if (processStartAt)
      for (const value of processedDetailsPair) {
        if (value.processIn.processOrderDetailProduct.length > 0) {
          value.processIn.processOrderDetailProduct.map((item) => {
            item.productAddonTypeId = item.productAddonId
            return item
          })
        }
        if (value.processOut.processOrderDetailProduct.length > 0) {
          value.processOut.processOrderDetailProduct.map((item) => {
            item.productAddonTypeId = item.productAddonId
            return item
          })
        }
      }

    const formData: CreatePorForm = {
      factoryId: selectedFactory ? parseInt(selectedFactory.id) : null,
      processStartAt: formattedDate(processStartAt!!),
      createdBy: role,
      processOrderDetailPairs: processedDetailsPair
    }

    const result = await createProcessOrder(formData)
    if (result) {
      showSuccessToast(t('common.saveSuccessfully'))
      navigate(-1)
    } else {
      showErrorToast(t('common.saveFailed'))
    }
  }

  const formattedDate = (dateData: dayjs.Dayjs) => {
    return dayjs(dateData).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  }

  const handleEdit = (item: ProcessInDtlData) => {
    setAction('edit')
    const selectedProcessOrderDtlSource = processOrderDtlSource.filter(
      (it) => it.processIn.idPair === item.idPair
    )

    setSelectedPOR(selectedProcessOrderDtlSource)
    setInputProcessDrawer(true)
  }

  const handleDelete = (item: ProcessInDtlData) => {
    const idPair = item.idPair
    const updatedProcessInDetailData = processInDetailData.filter(
      (item) => item.idPair !== idPair
    )
    const updatedProcessOrderDtlSource = processOrderDtlSource.filter(
      (item) => item.processIn.idPair !== idPair
    )
    setProcessInDetailData(updatedProcessInDetailData)
    setProcessOrderDtlSource(updatedProcessOrderDtlSource)
    // update plannedAt and plannedEnd
    updateDateOnProcessDetail(updatedProcessOrderDtlSource)
    setSelectedDeletedItem(null)
    setOpenDelete(false)
  }

  const renderRow = (row: rowPorDtl) => {
    let processLabel = ''
    if (row.processAction != '') {
      processLabel =
        row.processAction === 'PROCESS_IN'
          ? t('processOrder.table.processIn')
          : t('processOrder.table.processOut')
    }

    let dateTime = ''
    if (row.processAction !== '') {
      if (row.processAction === 'PROCESS_IN') {
        dateTime = row.datetime
          ? dayjs.utc(row.datetime).format(`${dateFormat} HH:mm`)
          : dayjs.utc(row?.datetime).format(`${dateFormat} HH:mm`)
      } else {
        dateTime = dayjs
          .utc(row?.datetime)

          .format(`${dateFormat} HH:mm`)
      }
    }

    const warehouses = row.warehouse ? row.warehouse.split(',') : []
    const hasMultipleWarehouses = warehouses.length > 1

    let warehouseListName: string[] = []
    if (row.warehouse != '') {
      const warehouseIds = row.warehouse.split(',')

      if (warehouseIds.length > 0) {
        warehouseListName = warehouseIds
          ?.map((id: string) => {
            const warehouse = warehouseList.find(
              (it) => it.id === id.toString()
            )
            return warehouse ? warehouse.name : '' // Ensure it always returns a string
          })
          .filter((name): name is string => name !== '')
      }
    }

    const firstWarehouse =
      warehouseListName.length > 0 ? warehouseListName[0] : ''
    const remainingWarehouses = hasMultipleWarehouses
      ? warehouseListName.slice(1).join(',')
      : []

    const categoryLabel =
      row.itemCategory != ''
        ? row.itemCategory === 'product'
          ? t('processOrder.create.product')
          : t('processOrder.create.recycling')
        : '-'

    let mainCategory = ''
    if (row.itemCategory != 'product') {
      mainCategory = mappingRecy(row.mainCategory, recycType)
    } else {
      mainCategory = mappingProductType(row.mainCategory, productType)
    }

    let subCategory = ''
    if (row.itemCategory != 'product') {
      subCategory = mappingSubRecy(row.mainCategory, row.subCategory, recycType)
    } else {
      subCategory = mappingSubProductType(
        row.mainCategory,
        row.subCategory,
        productType
      )
    }

    let addOnName = ''
    if (row.itemCategory === 'product') {
      addOnName = mappingAddonsType(
        row.mainCategory,
        row.subCategory,
        row.additionalInfo,
        productType
      )
    }

    const isHaveDivider = () => row.processAction === 'PROCESS_OUT'

    const styleDivider = {
      border: 'none',
      borderTop: isHaveDivider() ? '1px solid #e0e0e0' : 'none'
    }

    return (
      <React.Fragment key={row.id}>
        <TableRow>
          <TableCell style={{ width: '150px', ...styleDivider }}>
            {processLabel}
          </TableCell>
          <TableCell style={{ width: '250px', ...styleDivider }}>
            {dateTime}
          </TableCell>
          <TableCell
            style={{
              width: '400px',
              ...styleDivider
            }}
          >
            {hasMultipleWarehouses ? (
              <Box>
                <IconButton
                  sx={{ '&:hover': { backgroundColor: 'transparent' } }}
                  size="small"
                  onClick={() => toggleRow(row.id)}
                >
                  {expandedRows[row.id] ? (
                    <Box
                      sx={{
                        color: 'black',
                        fontSize: '14px',
                        textAlign: 'left'
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {t('processOrder.table.showLess')}
                        <KeyboardArrowUp />
                      </Box>
                      {warehouseListName.join(',')}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        color: 'black',
                        fontSize: '14px',
                        textAlign: 'left'
                      }}
                    >
                      {firstWarehouse}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {t('processOrder.table.showMore')}
                        <KeyboardArrowDown />
                      </Box>
                    </Box>
                  )}
                </IconButton>
              </Box>
            ) : (
              <Box>{firstWarehouse}</Box>
            )}
          </TableCell>
          <TableCell
            style={{
              width: '150px',
              ...styleDivider
            }}
          >
            {row.weight}
          </TableCell>
          <TableCell
            style={{
              width: '200px',
              ...styleDivider
            }}
          >
            {categoryLabel}
          </TableCell>
          <TableCell
            style={{
              width: '220px',
              ...styleDivider
            }}
          >
            {mainCategory}
          </TableCell>
          <TableCell
            style={{
              width: '220px',
              ...styleDivider
            }}
          >
            {subCategory}
          </TableCell>
          <TableCell
            style={{
              width: '220px',
              ...styleDivider
            }}
          >
            {addOnName}
          </TableCell>
        </TableRow>
        {/* {
          expandedRows[row.id] && hasMultipleWarehouses && (
            // remainingWarehouses.map((wh: string, index: number) => (
            <TableRow key={`${row.id}`}>
              <TableCell style={{ width: '150px', border: 'none' }}></TableCell>
              <TableCell style={{ width: '250px', border: 'none' }}></TableCell>
              <TableCell
                style={{
                  width: '200px',
                  border: 'none'
                }}
              >
                {remainingWarehouses}
              </TableCell>
              <TableCell style={{ width: '150px', border: 'none' }}></TableCell>
              <TableCell style={{ width: '200px', border: 'none' }}></TableCell>
              <TableCell style={{ width: '200px', border: 'none' }}></TableCell>
              <TableCell style={{ width: '200px', border: 'none' }}></TableCell>
              <TableCell style={{ width: '200px', border: 'none' }}></TableCell>
            </TableRow>
          )
          // ))
        } */}
      </React.Fragment>
    )
  }

  const onChangeCreatedDate = (value: dayjs.Dayjs | null) => {
    if (value) {
      if (value?.isValid()) {
        setProcessStartAt(value!!)
        setErrCreatedDate(false)
      } else {
        setProcessStartAt(value)
        setErrCreatedDate(true)
      }
    } else {
      setErrCreatedDate(true)
      setProcessStartAt(null)
    }
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
                    onChange={(value) => onChangeCreatedDate(value)}
                    sx={{ ...localstyles.datePicker }}
                  />
                </Box>
                <Box sx={{ ...localstyles.timePeriodItem }}>
                  <TimePicker
                    value={processStartAt}
                    onChange={(value) => onChangeCreatedDate(value)}
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
                  value={selectedFactory?.id || ''}
                  sx={{
                    borderRadius: '12px',
                    width: '309px',
                    background: 'white'
                  }}
                  onChange={(event: SelectChangeEvent<string>) => {
                    const selectedValue = factoryList.find(
                      (item) => item.id === event.target.value
                    )
                    if (selectedValue) {
                      setSelectedFactory(selectedValue)
                    }
                  }}
                >
                  {factoryList.map((item) => (
                    <MenuItem value={item.id}>{item.name}</MenuItem>
                  ))}
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
                    maxWidth: '1200px',
                    background: 'white',
                    padding: 2,
                    borderRadius: '16px',
                    marginBottom: 4
                  }}
                >
                  <div className="flex justify-between items-center">
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '8px'
                      }}
                    >
                      <EDIT_OUTLINED_ICON
                        fontSize="small"
                        className="cursor-pointer text-grey-dark mr-2"
                        onClick={(event) => {
                          setAction('edit')
                          handleEdit(item)
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <DELETE_OUTLINED_ICON
                        fontSize="small"
                        className="cursor-pointer text-grey-dark"
                        onClick={(event) => {
                          //handleDelete(item)
                          setSelectedDeletedItem(item)
                          setOpenDelete(true)
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                  <Divider></Divider>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {columns.map((col) => (
                            <TableCell>{col.headerName}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {item.rows.map((row) => renderRow(row))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ))}

              {/* form input process In */}
              <InputProcessForm
                drawerOpen={inputProcessDrawer}
                action={action}
                handleDrawerClose={() => setInputProcessDrawer(false)}
                plannedStartAtInput={
                  processStartAt ? formattedDate(processStartAt) : ''
                }
                dataSet={processOrderDtlSource}
                onSave={onSaveProcessDtl}
                editedValue={selectedDetailPOR}
              ></InputProcessForm>
              <Button
                variant="outlined"
                startIcon={
                  <AddCircleIcon
                    sx={{ fontSize: 25, color: colorTheme, pr: 1 }}
                  />
                }
                onClick={() => {
                  setSelectedPOR(null)
                  setAction('add')
                  setInputProcessDrawer(true)
                }}
                disabled={errCreatedDate}
                sx={{
                  height: '40px',
                  width: '100%',
                  maxWidth: '1230px',
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
            <Grid item sx={{ width: '100%' }}>
              {trySubmited &&
                validation.map((val, index) => (
                  <FormErrorMsg
                    key={index}
                    field={t(val.field)}
                    errorMsg={returnErrorMsg(val.problem, t)}
                    type={val.type}
                    dataTestId={val.dataTestId}
                  />
                ))}
            </Grid>
            <DeleteModal
              open={openDelete}
              onClose={() => {
                setOpenDelete(false)
              }}
              selectedItem={selectedDeletedItem}
              onDelete={handleDelete}
            />
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
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '34%',
    height: 'fit-content',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: 5
  }
}

export default CreateProcessOrder
