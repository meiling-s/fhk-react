import {
  FunctionComponent,
  useCallback,
  ReactNode,
  useState,
  useEffect
} from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
// import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { ADD_ICON } from '../../../themes/icons'
import AddWarehouse from '../../../components/AddWarehouse'
import TableBase from '../../../components/TableBase'
import { useTranslation } from 'react-i18next'
import {
  getAllWarehouse,
  createWarehouse
} from '../../../APICalls/warehouseManage'

interface Warehouse {
  id: number
  warehouseNameTchi: string
  warehouseNameSchi: string
  warehouseNameEng: string
  location: string
  physicalFlag: boolean
  contractNo: string[]
  status: string
  // warehouseRecyc: string
  warehouseRecyc: {
    recycTypeId: string
    recycSubtypeId: string
    recycSubtypeCapacity: number
    recycTypeCapacity: number
  }[]
}

type TableRow = {
  [key: string]: any
}

const Warehouse: FunctionComponent = () => {
  // const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [checkedRows, setCheckedRows] = useState<TableRow[]>([])
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [warehouseItems, setWarehouseItems] = useState<Warehouse[]>([])
  const headerTitles = [
    {
      type: 'string',
      field: 'warehouseNameTchi',
      label: t('warehouse_page.trad_name'),
      width: 150
    },
    {
      type: 'string',
      field: 'warehouseNameSchi',
      label: t('warehouse_page.simp_name'),
      width: 150
    },
    {
      type: 'string',
      field: 'warehouseNameEng',
      label: t('warehouse_page.english_name'),
      width: 150
    },
    {
      type: 'string',
      field: 'location',
      label: t('warehouse_page.location'),
      width: 100
    },
    {
      type: 'string',
      field: 'physicalFlag',
      label: t('warehouse_page.place'),
      width: 100
    },
    {
      type: 'string',
      field: 'contractNo',
      label: t('warehouse_page.place'),
      width: 100
    },
    {
      type: 'status',
      field: 'status',
      label: t('warehouse_page.status'),
      width: 100
    },
    {
      type: 'string',
      field: 'warehouseRecyc',
      label: t('warehouse_page.recyclable_subcategories'),
      width: 200
    }
  ]

  const handleOnSubmitData = (
    formData: Warehouse,
    action: string,
    id?: number
  ) => {
    if (action == 'add') {
  
    }

    if (action == 'delete') {
      //real case use delete api base on id
      // const { idRow } = id
      // if (idRow) {
      const updatedItems = warehouseItems.filter((item) => item.id != id)
      setWarehouseItems(updatedItems)
      // }
    }

    if (action == 'edit') {
      //real case use put api
      //setWarehouseItems([...warehouseItems, formData])
    }
  }

  const transformToTableRow = (warehouse: Warehouse): TableRow => {
    return {
      id: warehouse.id,
      warehouseNameTchi: warehouse.warehouseNameTchi,
      warehouseNameSchi: warehouse.warehouseNameSchi,
      warehouseNameEng: warehouse.warehouseNameEng,
      location: warehouse.location,
      physicalFlag: warehouse.physicalFlag ? 'yes' : 'no',
      status: warehouse.status,
      contractNo: warehouse.contractNo,
      //warehouseRecyc: warehouse.warehouseRecyc.map(item => `${item.recycSubtypeId},  ${item.recycTypeId},  ${item.warehouseRecycId}` ).join(", ")
      warehouseRecyc: 'warehouseRecyc'
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllWarehouse(0, 10)
        if (response) {
          setWarehouseItems(response.data.content.map(transformToTableRow))
          console.log(response.data.content)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [action])

  const addDataWarehouse = () => {
    setDrawerOpen(true)
    setAction('add')
  }

  const handleEdit = (type: string, row: TableRow) => {
    setRowId(row.id)
    setDrawerOpen(true)
    setAction('edit')
  }

  const handleDelete = (type: string, row: TableRow) => {
    setDrawerOpen(true)
    setAction('delete')
    setRowId(row.id)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  const handleCheckAll = (checked: boolean) => {
    console.log('checkedAll', checked)
    if (checked) {
      setCheckedRows([...warehouseItems]) // Select all rows
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
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: 375, sm: 480, md: '100%' }
      }}
    >
      <div className="warehouse-section">
        <div className="settings-page relative bg-bg-primary w-full h-[1046px] overflow-hidden flex flex-row items-start justify-start text-center text-mini text-grey-darker font-tag-chi-medium">
          <div className=" self-stretch flex-1 bg-white flex flex-col items-start justify-start text-smi text-grey-middle font-noto-sans-cjk-tc">
            <div className="self-stretch flex-1 bg-bg-primary flex flex-col items-start justify-start text-3xl text-black font-tag-chi-medium">
              <div
                className={`settings-container self-stretch flex-1 flex flex-col items-start justify-start pt-[30px] pb-[75px] text-mini text-grey-darker ${
                  isMobile
                    ? 'overflow-auto whitespace-nowrap w-[375px] mx-4 my-0'
                    : 'px-10'
                }`}
              >
                <div className="self-stretch flex flex-col items-start justify-start gap-[12px] overflow-auto">
                  <div className="settings-header self-stretch flex flex-row items-center justify-start gap-[12px] text-base text-grey-dark">
                    <b className="relative tracking-[0.08em] leading-[28px]">
                      {t('top_menu.workshop')}
                    </b>
                    <div
                      className="rounded-6xl bg-white overflow-hidden flex flex-row items-center justify-center py-2 pr-5 pl-3 gap-[5px] cursor-pointer text-smi text-green-primary border-[1px] border-solid border-green-pale"
                      onClick={addDataWarehouse}
                    >
                      <ADD_ICON />
                      <b className="relative tracking-[1px] leading-[20px]">
                        {t('top_menu.add_new')}
                      </b>
                    </div>
                  </div>
                  <Box className="w-full">
                    <TableBase
                      header={headerTitles}
                      dataRow={warehouseItems.map(transformToTableRow)}
                      onDelete={(type, row) => handleDelete(action, row)}
                      onEdit={(type, row) => handleEdit(action, row)}
                      checkAll={checkedRows.length === warehouseItems.length}
                      onCheckAll={handleCheckAll}
                      checkedRows={checkedRows}
                      onCheckRow={handleCheckRow}
                    />
                  </Box>
                </div>
              </div>
            </div>
          </div>
          {/* right drawer */}
          <AddWarehouse
            drawerOpen={drawerOpen}
            handleDrawerClose={handleDrawerClose}
            action={action}
            onSubmitData={handleOnSubmitData}
            rowId={rowId}
          ></AddWarehouse>
        </div>
      </div>
    </Box>
  )
}

export default Warehouse
