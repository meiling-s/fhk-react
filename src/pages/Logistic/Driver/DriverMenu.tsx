import { Box, Button, IconButton, InputAdornment, Pagination, TextField } from "@mui/material"
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams, GridRowSpacingParams } from "@mui/x-data-grid"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { getDriverList } from "../../../APICalls/driver"
import { styles } from "../../../constants/styles"
import { Driver } from "../../../interfaces/driver"
import { ADD_ICON, DELETE_OUTLINED_ICON, EDIT_OUTLINED_ICON, SEARCH_ICON } from "../../../themes/icons"
import { showErrorToast, showSuccessToast } from "../../../utils/utils"
import DriverDetail from "./DriverDetail"
import useLocaleTextDataGrid from "../../../hooks/useLocaleTextDataGrid"

const localstyles = {
    inputState: {
        mt: 3,
        width: '100%',
        m: 1,
        borderRadius: '10px',
        bgcolor: 'white',
        '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '& fieldset': {

                borderColor: '#79CA25'
            },
            '&:hover fieldset': {
                borderColor: '#79CA25'
            },
            '&.Mui-focused fieldset': {
                borderColor: '#79CA25'
            },
            '& label.Mui-focused': {
                color: '#79CA25'
            }
        }
    }
}

const DriverMenu = () => {
    const { t, i18n } = useTranslation()
    const [page, setPage] = useState(1)
    const pageSize = 10
    const [totalData, setTotalData] = useState<number>(0)
    const currentLanguage = i18n.language
    const [selectedRow, setSelectedRow] = useState<null | Driver>(null)
    const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [driverLists, setDriverLists] = useState<Driver[]>([])
    const [filterDriverLists, setFilterDriverLists] = useState<Driver[]>([])
    const { localeTextDataGrid } = useLocaleTextDataGrid()

    const columns: GridColDef[] = useMemo(() => ([
        {
            field: 'driverId',
            headerName: t('driver.DriverMenu.table.driverId'),
            width: 150,
            type: 'string'
        },
        {
            field: currentLanguage === 'zhch' ? 'driverNameSchi' : 'driverNameTchi',
            headerName: t('driver.DriverMenu.table.driverName'),
            width: 150,
            type: 'string'
        },
        {
            field: 'driverNameEng',
            headerName: t('driver.DriverMenu.table.driverEngName'),
            width: 250,
            type: 'string'
        },
        {
            field: 'loginId',
            headerName: t('driver.DriverMenu.table.loginName'),
            width: 150,
            type: 'string'
        },
        {
            field: 'contactNo',
            headerName: t('driver.DriverMenu.table.contactNo'),
            width: 150,
            type: 'string'
        },
        {
            field: 'edit',
            headerName: '',
            renderCell: (params) => {
                return (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <EDIT_OUTLINED_ICON
                            fontSize="small"
                            className="cursor-pointer text-grey-dark mr-2"
                            style={{ cursor: 'pointer' }}
                            onClick={(event) => {
                                event.stopPropagation()
                                handleAction(params, 'edit')
                            }}
                        />
                    </div>
                )
            }
        },
        {
            field: 'delete',
            headerName: '',
            renderCell: (params) => {
                return (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <DELETE_OUTLINED_ICON
                            fontSize="small"
                            className="cursor-pointer text-grey-dark"
                            onClick={(event) => {
                                event.stopPropagation()
                                handleAction(params, 'delete')
                            }}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                )
            }
        }
    ]), [currentLanguage, t])

    const handleSearch = (search: string) => {
        if (search.trim() !== '') {
            const filterData: Driver[] = filterDriverLists.filter((item) =>
                item.driverId.toString().toLowerCase().startsWith(search.toLowerCase())
            )
            setFilterDriverLists(filterData)
            return
        }
        setFilterDriverLists(driverLists)
    }
    const handleAction = (
        params: GridRenderCellParams,
        action: 'add' | 'edit' | 'delete'
    ) => {
        setAction(action)
        setSelectedRow(params.row)
        setDrawerOpen(true)
    }

    const handleSelectRow = (params: GridRowParams) => {
        setAction('edit')
        setSelectedRow(params.row)
        setDrawerOpen(true)
    }

    const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
        return {
            top: params.isFirstVisible ? 0 : 10
        }
    }, [])

    const initDriverList = useCallback(async () => {
        const res = await getDriverList(page - 1, pageSize)
        if (res) {
            const data = res.data.content
            const driverList = [...data]
            setDriverLists(driverList)
            setFilterDriverLists(driverList)
            setTotalData(res.data.totalPages)
        }

    }, [page, pageSize])


    const onSubmitData = (type: 'success' | 'error', msg: string) => {

        if (type === 'success') {
            showSuccessToast(msg)
        } else {
            showErrorToast(msg)
        }
        initDriverList()
    }


    useEffect(() => {
        initDriverList()
    }, [initDriverList])

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                px: 8
            }}>
            <Box sx={{ marginY: 4 }}>
                <Button
                    sx={[styles.buttonOutlinedGreen,
                    {
                        width: 'max-content',
                        height: '40px'
                    }]}
                    onClick={() => {
                        setDrawerOpen(true)
                        setAction('add')
                    }}
                    variant="outlined">
                    <ADD_ICON />{t('driver.DriverMenu.AddBtn')}
                </Button>
            </Box>
            <Box>
                <TextField
                    label={t('driver.DriverMenu.search.label')}
                    placeholder={t('driver.DriverMenu.search.placeholder')}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => { }}>
                                    <SEARCH_ICON style={{ color: '#79CA25' }} />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    sx={[localstyles.inputState, { width: '1460px' }]}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </Box>
            <div className="table-vehicle">
                <Box pr={4} sx={{ flexGrow: 1, maxWidth: '1460px' }}>
                    <DataGrid
                        rows={filterDriverLists}
                        getRowId={(row) => row.driverId}
                        hideFooter
                        columns={columns}
                        checkboxSelection
                        onRowClick={handleSelectRow}
                        getRowSpacing={getRowSpacing}
                        localeText={localeTextDataGrid}
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
            </div>
            <DriverDetail
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                action={action}
                onSubmitData={(type, msg) => onSubmitData(type, msg)}
                driver={selectedRow}
            />
        </Box>
    )
}
export default DriverMenu