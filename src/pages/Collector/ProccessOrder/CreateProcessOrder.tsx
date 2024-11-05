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
import { LocalizationProvider } from '@mui/x-date-pickers'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import CustomDatePicker2 from '../../../components/FormComponents/CustomDatePicker2'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomAutoComplete from '../../../components/FormComponents/CustomAutoComplete'
import InputProcessForm from '../../Collector/ProccessOrder/InputProcessForm'
import { styles } from '../../../constants/styles'
import { getThemeColorRole } from '../../../utils/utils'
import { localStorgeKeyName } from '../../../constants/constant'

import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DataGrid } from '@mui/x-data-grid'

const CreateProcessOrder = ({}: {}) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [inputProcessDrawer, setInputProcessDrawer] = useState<boolean>(false)
  const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'
  const colorTheme: string = getThemeColorRole(role)

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

  const columns = [
    { field: 'status', headerName: '', width: 150 },
    { field: 'date', headerName: '開始/完成日期', width: 180 },
    { field: 'warehouse', headerName: '貨倉', width: 150 },
    { field: 'weight', headerName: '重量', width: 100 },
    { field: 'itemCategory', headerName: '物品類別', width: 150 },
    { field: 'mainCategory', headerName: '主類別', width: 100 },
    { field: 'subCategory', headerName: '次類別', width: 100 },
    { field: 'additionalInfo', headerName: '追加類別', width: 100 }
  ]

  const rows = [
    {
      id: 1,
      status: '待處理',
      date: '2023/09/18 18:00',
      warehouse: '貨倉 1、貨倉 2',
      weight: '20kg',
      itemCategory: '回收物',
      mainCategory: '廢紙',
      subCategory: '報紙',
      additionalInfo: '-'
    },
    {
      id: 2,
      status: '',
      date: '',
      warehouse: '',
      weight: '',
      itemCategory: '產品',
      mainCategory: '1號膠',
      subCategory: '水樽',
      additionalInfo: '500ml'
    },
    {
      id: 3,
      status: '處理後',
      date: '2023/09/18 18:00',
      warehouse: '貨倉 1、貨倉 2',
      weight: '20kg',
      itemCategory: '回收物',
      mainCategory: '廢紙',
      subCategory: '報紙',
      additionalInfo: '-'
    },
    {
      id: 4,
      status: '',
      date: '',
      warehouse: '',
      weight: '',
      itemCategory: '產品',
      mainCategory: '1號膠',
      subCategory: '水樽',
      additionalInfo: '500ml'
    }
  ]

  const processInData = [
    {
      category: 'classification',
      label: t('processOrder.create.classification'),
      rows: rows
    },
    {
      category: 'sol',
      label: t('processOrder.create.sol'),
      rows: rows
    },
    {
      category: 'package',
      label: t('processOrder.create.package'),
      rows: rows
    }
  ]

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
              <Typography
                sx={{
                  ...styles.header2,
                  marginBottom: 2
                }}
              >
                {t('processOrder.createdate')}
              </Typography>
              <CustomDatePicker2
                pickupOrderForm={true}
                setDate={(values) => {
                  console.log(values)
                }}
                defaultStartDate={new Date()}
                defaultEndDate={new Date()}
                iconColor={colorTheme}
              />
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
                  value={''}
                  sx={{
                    borderRadius: '12px',
                    width: '309px',
                    background: 'white'
                  }}
                  onChange={(event: SelectChangeEvent<string>) => {}}
                >
                  <MenuItem disabled value="">
                    <em>{t('common.noOptions')}</em>
                  </MenuItem>
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
              {processInData.map((item) => (
                <Box
                  sx={{
                    height: 'max-content',
                    width: 'max-content',
                    background: 'white',
                    padding: 2,
                    borderRadius: '16px',
                    marginBottom: 4
                  }}
                >
                  <div>
                    <Typography variant="h6" gutterBottom>
                      {item.label}
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
                {t('common.createdDatetime') + ' : ' + '2023/09/24 17:00'}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                sx={[
                  buttonFilledCustom,
                  { width: '200px', fontSize: 18, mr: 3 }
                ]}
                onClick={() => {}}
              >
                {t('pick_up_order.finish')}
              </Button>
              <Button
                sx={[
                  buttonOutlinedCustom,
                  { width: '200px', fontSize: 18, mr: 3 }
                ]}
                onClick={() => {}}
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

export default CreateProcessOrder
