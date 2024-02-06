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
import InventoryDetail from './DetailInventory'
import { useContainer } from "unstated-next";
import { InventoryItem, InventoryDetail as InvDetails} from '../../../interfaces/inventory'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import { getAllInventory } from '../../../APICalls/Collector/inventory'
import { format } from "../../../constants/constant";
import dayjs from 'dayjs'
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";

import { useTranslation } from 'react-i18next'
import i18n from '../../../setups/i18n'

interface Option {
  value: string
  label: string
}

type recycItem = {
  recycType: il_item,
  recycSubType: il_item[]
}

function createInventory(
  itemId: number,
  warehouseId: number,
  recycTypeId: string,
  recycSubTypeId: string,
  packageTypeId: string,
  weight: number,
  unitId: string,
  status: string,
  createdBy: string,
  updatedBy: string,
  inventoryDetail: InvDetails[],
  createdAt: string,
  updatedAt: string
): InventoryItem {
  return {
    itemId,
    warehouseId,
    recycTypeId,
    recycSubTypeId,
    packageTypeId,
    weight,
    unitId,
    status,
    createdBy,
    updatedBy,
    inventoryDetail,
    createdAt,
    updatedAt
  }
}

const Inventory: FunctionComponent = () => {
  const { t } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [inventoryList, setInventory] = useState<any[]>([])
  const [filteredInventory, setFilteredInventory] = useState<any[]>([])
  const [selectedRow, setSelectedRow] = useState<any | null>(null)
  const [rowId, setRowId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const {recycType} = useContainer(CommonTypeContainer)
  const [recycItem, setRecycItem] = useState<recycItem[]>([])
  const [currentRecyName, setCurRecycName] = useState<string>("")
  const [currentSubName, setCurrentSubName] = useState<string>("")
  const [searchkey, setSerchKey] = useState<string>("")

  useEffect(() =>{ 
    mappingRecyleItem()
   }, [recycType]);

   useEffect(() =>{ 
    if(recycItem.length > 0) initInventory() //init dat when recyleitem done mapping
   }, [recycItem]);

  const mappingRecyleItem = () => {
    const recyleMapping: recycItem[] = []
    recycType?.forEach((re) =>{
     var reItem: recycItem = {recycType: {name: "", id: ""}, recycSubType: []};
     var subItem: il_item[] = [];
    var name = ""
    switch (i18n.language) {
      case 'enus':
        name = re.recyclableNameEng
        break
      case 'zhch':
        name = re.recyclableNameSchi
        break
      case 'zhhk':
        name = re.recyclableNameTchi
        break
      default:
        name = re.recyclableNameTchi
        break
    }
   reItem.recycType = {name: name, id: re.recycTypeId};

     re.recycSubType.map((sub) => {
       var subName = "";
       switch(i18n.language){
           case "enus":
               subName = sub.recyclableNameEng;
               break;
           case "zhch":
               subName = sub.recyclableNameSchi;
               break;
           case "zhhk":
               subName = sub.recyclableNameTchi;
               break;
           default:
               subName = sub.recyclableNameTchi;      
               break;
       }

       reItem.recycSubType = subItem;
       subItem.push({name: subName, id: sub.recycSubTypeId})
     })
     reItem.recycSubType = subItem;
     recyleMapping.push(reItem)
   })
   setRecycItem(recyleMapping)
   console.log("recycItem",recyleMapping )
  }

  const initInventory = async () => {
    const result = await getAllInventory(page - 1, pageSize)
    const data = result?.data
    if(data) {
      var inventoryMapping: InventoryItem[] = []
      data.content.map((item: any) => {
        const recy = recycItem.find((re) => re.recycType.id === item.recycTypeId)
        const recyName = recy ? recy.recycType.name : "-"
        const subType = recy ? recy.recycSubType.find((sub) => sub.id == item.recycSubTypeId) : null
        const subName = subType ? subType.name : "-"
        inventoryMapping.push(
          createInventory(
            item?.itemId,
            item?.warehouseId,
            recyName,
            subName,
            item?.packageTypeId,
            item?.weight,
            item?.unitId,
            item?.status,
            item?.updatedBy,
            item?.createdBy,
            item?.inventoryDetail,
            item?.createdAt,
            item?.updatedAt,
          )
        )
      })
      setInventory(inventoryMapping)
      setFilteredInventory(inventoryMapping)
      setTotalData(data.totalPages)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: t('inventory.date'),
      width: 200,
      type: 'string',
      renderCell: (params) => {
        const dateFormatted = dayjs(new Date(params.row.createdAt)).format(format.dateFormat1)
        return <div>{dateFormatted}</div>
      }
    },
    {
      field: 'recycTypeId',
      headerName: t('inventory.recyleType'),
      width: 200,
      type: 'string',
    },
    {
      field: 'recycSubTypeId',
      headerName: t('inventory.recyleSubType'),
      width: 200,
      type: 'string',
    },
    {
      field: 'packageTypeId',
      headerName: t('inventory.package'),
      width: 200,
      type: 'string'
    },
    {
      field: 'unitId',
      headerName: t('inventory.recyclingNumber'),
      width: 200,
      type: 'string'
    },
    {
      field: 'inventoryLocation',
      headerName: t('inventory.inventoryLocation'),
      width: 200,
      type: 'string',
      renderCell: (params) => {
        return <div>-</div>
      }
    },
    {
      field: 'weight',
      headerName: t('inventory.weight'),
      width: 200,
      type: 'string',
      renderCell: (params) => {
        return <div>{params.row.weight} kg</div>
      }
    }
  ]

  const getSubTypeOption = () => {
    if(currentRecyName) {
      const filteredOption = recycItem.filter((item) => item.recycType.name == currentRecyName)
      
      const options: Option[] = filteredOption.flatMap(item => item.recycSubType.map((sub) => ({
        value: sub.id,
        label: sub.name
      })))
      return options;
    } else {
      getUniqueOptions("recycSubTypeId")
    }
  }

  const searchfield = [
    { label: t('pick_up_order.filter.search'), width: '14%' },
    {
      label: t('inventory.recyleType'),
      width: '15%',
      options: getUniqueOptions("recycTypeId"),
      field: "recycTypeId"
    },
    {
      label: t('inventory.recyleSubType'),
      width: '15%',
      options: getUniqueOptions("recycSubTypeId"),
      field: "recycSubTypeId"
    },
    {
      label: t('inventory.inventoryLocation'),
      width: '15%',
      field: "location"
    }
  ]

  function getUniqueOptions(propertyName: keyof InventoryItem) {
    const optionMap = new Map();
    inventoryList.forEach((row) => {
      optionMap.set(row[propertyName], row[propertyName]);
    });
    const options: Option[] = Array.from(optionMap.values()).map((option) => ({
      value: option,
      label: option,
    }));
    return options
  }

  const handleSelectRow = (params: GridRowParams) => {
    const selectedInv = inventoryList.find((item) => item.itemId == params.row.itemId)
    setSelectedRow(selectedInv)
    setDrawerOpen(true)
  }

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  const handleSearch = (label: string, value: string) => {
    if(label == 'recycTypeId'){
      setCurRecycName(value)
      const filtered:InventoryItem[] = inventoryList.filter(item => item.recycTypeId == value)
      if (filtered) {
        setFilteredInventory(filtered)
      } else {
        setFilteredInventory(inventoryList)
      }
    } 

    if(label == "recycSubTypeId"){
      setCurrentSubName(value)
      const filtered:InventoryItem[] = inventoryList.filter(item => item.recycSubTypeId == value)
      if (filtered) {
        setFilteredInventory(filtered)
      } else {
        setFilteredInventory(inventoryList)
      }
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
            marginY: 4
          }}
        >
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t('inventory.recyclingInformation')}
          </Typography>
        </Box>
        <Stack direction="row" mt={3}>
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
        </Stack>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: '100%' }}>
            <DataGrid
              rows={filteredInventory}
              getRowId={(row) => row.itemId}
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
          <InventoryDetail
            drawerOpen={drawerOpen}
            handleDrawerClose={() => setDrawerOpen(false)}
            selectedRow={selectedRow}
          />
        </div>
      </Box>
    </>
  )
}

export default Inventory
