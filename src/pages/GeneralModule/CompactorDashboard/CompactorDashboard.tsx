import { useEffect, useState, FunctionComponent, useCallback } from 'react'
import { Box, Button, Divider } from '@mui/material'

import CustomSearchField from '../../../components/TableComponents/CustomSearchField'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridRenderCellParams
} from '@mui/x-data-grid'
import AddProcessCompactor from './AddProcessCompactor'

import { styles } from '../../../constants/styles'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTranslation } from 'react-i18next'

const CompactorDashboard: FunctionComponent = () => {
  const { t } = useTranslation()
  const [selectedItem, setSelectedItem] = useState<string[]>([])

  const recycleItems = [
    {
      id: '0'
    },
    {
      id: '1'
    },
    {
      id: '2'
    },
    {
      id: '3'
    },
    {
      id: '4'
    }
  ]

  const compactorItems = [
    {
      id: '0',
      date: '2023/09/18 18:00',
      itemCategory: '回收物',
      mainCategory: '廢紙',
      subcategory: '報紙',
      addCategory: '-',
      package: '袋',
      itemNumber: 'RC12345678',
      inStock: '火炭',
      weight: '20kg'
    },
    {
      id: '1',
      date: '2023/09/18 18:00',
      itemCategory: '回收物',
      mainCategory: '廢紙',
      subcategory: '報紙',
      addCategory: '-',
      package: '袋',
      itemNumber: 'RC12345678',
      inStock: '火炭',
      weight: '20kg'
    },
    {
      id: '2',
      date: '2023/09/18 18:00',
      itemCategory: '回收物',
      mainCategory: '廢紙',
      subcategory: '報紙',
      addCategory: '-',
      package: '袋',
      itemNumber: 'RC12345678',
      inStock: '火炭',
      weight: '20kg'
    }
  ]

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: t('compactor.table.date'),
      width: 200,
      type: 'string'
    },
    {
      field: 'itemCategory',
      headerName: t('compactor.table.itemCategory'),
      width: 100,
      type: 'string'
    },
    {
      field: 'mainCategory',
      headerName: t('compactor.table.mainCategory'),
      width: 100,
      type: 'string'
    },
    {
      field: 'subcategory',
      headerName: t('compactor.table.subcategory'),
      width: 100,
      type: 'string'
    },
    {
      field: 'addCategory',
      headerName: t('compactor.table.addCategory'),
      width: 150,
      type: 'string'
    },
    {
      field: 'package',
      headerName: t('compactor.table.package'),
      width: 80,
      type: 'string'
    },
    {
      field: 'itemNumber',
      headerName: t('compactor.table.itemNumber'),
      width: 200,
      type: 'string'
    },
    {
      field: 'inStock',
      headerName: t('compactor.table.inStock'),
      width: 100,
      type: 'string'
    },
    {
      field: 'weight',
      headerName: t('compactor.table.weight'),
      width: 100,
      type: 'string'
    }
  ]

  const searchfield = [
    {
      label: t('compactor.processingDate'),
      placeholder: t('check_in.search'),
      field: 'processingDate'
    },
    {
      label: t('compactor.plateNumber'),
      placeholder: t('check_in.search'),
      field: 'plateNumber'
    }
  ]

  const handleSearch = () => {}

  const selectCard = (id: string) => {
    setSelectedItem((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id)
      } else {
        return [...prevSelected, id]
      }
    })
  }

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  return (
    <>
      <Box
        sx={{
          // width: '1200px',
          maxWidth: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: 5,
          pr: 4
        }}
      >
        <h2>{t('compactor.compactorTruckHandling')}</h2>
        {/* SECTION 1 */}
        <Box sx={{ marginBottom: 10 }}>
          <div className="bg-[#7CE495] w-max px-[20px] py-[10px] text-white font-bold rounded-t-xl">
            {t('compactor.unloadRecord')}
          </div>
          <Box
            sx={{
              width: '100%',
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px',
              borderBottomLeftRadius: '12px',
              background: 'white',
              height: '704px'
            }}
          >
            <Box
              sx={{
                padding: 4,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {searchfield.map((s) => (
                <CustomSearchField
                  key={s.field}
                  label={s.label}
                  placeholder={s?.placeholder}
                  field={s.field}
                  options={[]}
                  width="500px"
                  onChange={handleSearch}
                />
              ))}
              <Button
                sx={[
                  styles.buttonFilledGreen,
                  {
                    backgroundColor: '#79CA25',
                    width: 'max-content',
                    height: '40px'
                  }
                ]}
                onClick={() => {}}
              >
                {t('compactor.show')}
              </Button>
            </Box>
            <Divider></Divider>
            <Box sx={{ paddingY: '24px', paddingX: '40px' }}>
              <div className="grid grid-cols-2 gap-4 justify-items-start w-full max-w-[980px]">
                {recycleItems.map((item) => (
                  <div
                    className={`relative card-wrapper col-span-1 max-w-[448px] w-full flex items-center space-x-6 py-4 px-4 rounded-lg border-solid cursor-pointer ${
                      selectedItem.includes(item.id)
                        ? 'border-[2px] border-[#79CA25]'
                        : 'border-[1px] border-[#C6C6C6]'
                    }`}
                    onClick={() => selectCard(item.id)}
                  >
                    <div className="text-left">
                      <div className="mb-2 text-[#717171] text-xs font-medium">
                        卸貨時間
                      </div>
                      <div className="mb-2 text-black font-bold text-base">
                        18:00
                      </div>
                      <div className="mb-2 text-[#717171] text-sm font-medium">
                        PO12345678
                      </div>
                    </div>
                    <div className="flex flex-col border-l border-[#E2E2E2] pl-6">
                      <div className="flex items-center mb-2">
                        <PersonOutlineOutlinedIcon className=" text-[#ACACAC] text-sm mr-1" />
                        <div className="text-[#ACACAC] text-sm font-medium">
                          司機
                        </div>
                      </div>
                      <div className="flex items-center mb-2">
                        <Inventory2OutlinedIcon className=" text-[#ACACAC] text-sm mr-1" />
                        <div className="text-[#ACACAC] text-sm font-medium">
                          寄件及收件公司
                        </div>
                      </div>
                      <div className="flex items-center mb-2">
                        <LocationOnOutlinedIcon className=" text-[#ACACAC] text-sm mr-1" />
                        <div className="text-[#ACACAC] text-sm font-medium">
                          送出及到達地點
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 text-[#535353] text-sm font-medium">
                        司機
                      </div>
                      <div className="mb-2">
                        <div className="text-[#535353] text-sm font-medium">
                          寄件公司 ➔ 收件公司
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="text-[#535353] text-sm font-medium">
                          寄件公司 ➔ 收件公司
                        </div>
                      </div>
                    </div>
                    {selectedItem.includes(item.id) && (
                      <CheckCircleIcon className="absolute top-[-8px] right-[-8px] text-[#79CA25] w-6 h-6" />
                    )}
                  </div>
                ))}
              </div>
            </Box>
          </Box>
        </Box>
        {/* SECTION 2 */}
        <Box sx={{ marginBottom: 10 }}>
          <div className="bg-[#7CE495] w-max px-[20px] py-[10px] text-white font-bold rounded-t-xl">
            {t('compactor.unloadRecord')}
          </div>
          <Box
            sx={{
              width: '100%',
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px',
              borderBottomLeftRadius: '12px',
              background: 'white',
              height: '448px',
              padding: 4
            }}
          >
            <DataGrid
              rows={compactorItems}
              getRowId={(row) => row.id}
              hideFooter
              columns={columns}
              onRowClick={() => {}}
              getRowSpacing={getRowSpacing}
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  border: 'none'
                },
                '& .MuiDataGrid-row': {
                  bgcolor: '#FBFBFB',
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
                }
              }}
            />
          </Box>
        </Box>
        {/* SECTION 3 */}
        <Box>
          <div className="bg-[#7CE495] w-max px-[20px] py-[10px] text-white font-bold rounded-t-xl">
            {t('compactor.處理後的壓縮物')}
          </div>
          <Box
            sx={{
              width: '100%',
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px',
              borderBottomLeftRadius: '12px',
              background: 'white',
              height: 'max-content'
            }}
          >
            <AddProcessCompactor />
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default CompactorDashboard
