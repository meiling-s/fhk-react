import {Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useTranslation } from 'react-i18next'
import dayjs from "dayjs";
import { styles } from '../../constants/styles';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import { getTotalSalesProductAnalysis } from '../../APICalls/Collector/dashboardRecyables';
import CommonTypeContainer from '../../contexts/CommonTypeContainer';
import { useContainer } from 'unstated-next';
import { Languages } from '../../constants/constant';

type fieldName = 'Rechargeable Batteries' | 'Glass Bottles' | 'Paper' | 'Fluorescent Lamps and Tubes' | 'Small Electrical Appliances'| 'Plastics' | 'Non-recyclable' | 'Cardboard';
interface DataSales {
    label: fieldName,
    weight: number,
    backgroundColor: string,
    width: string,
    description: string
}

interface Dataset{
    total_weight: number,
    sales: DataSales[]   
}

// type props = {
//     labels: string[]
//     dataset:Dataset[]|[]
//     setFrmDate: (value: dayjs.Dayjs ) => void
//     onChangeToDate:(value: dayjs.Dayjs) => void
//     onHandleSearch?:() => void
//     frmDate:dayjs.Dayjs
//     toDate:dayjs.Dayjs
//     collectionIds?: number[]
//     title:string
//     onChangeColdId: (value: number | null) => void
//     colId:number | null
//     typeChart:string
// }

// [
    // {
    //     id: 'Rechargeable Batteries',
    //     label: 'Rechargeable Batteries',
    //     data: 30,
    //     backgroundColor: '#EFE72F',
    //     width: '20%' 
    // },
    // {
    //     id: 'Glass Bottles',
    //     label: 'Glass Bottles',
    //     data: 30,
    //     backgroundColor: '#4FB5F5',
    //     width: '20%' 
    // },
    // {
    //     id: 'Paper',
    //     label: 'Paper',
    //     data: 30,
    //     backgroundColor: '#7ADFF1',
    //     width: '10%' 
    // },
    // {
    //     id: 'Fluorescent Lamps and Tubes',
    //     label: 'Fluorescent Lamps and Tubes',
    //     data: 30,
    //     backgroundColor: '#ECAB05',
    //     width: '10%' 
    // },
    // {
    //     id: 'Small Electrical Appliances',
    //     label: 'Small Electrical Appliances',
    //     data: 30,
    //     backgroundColor: '#5AE9D8',
    //     width: '10%' 
    // },
    // {
    //     id: 'Plastics',
    //     label: 'Plastics',
    //     data: 30,
    //     backgroundColor: '#FF9FB7',
    //     width: '10%' 
    // },
    // {
    //     id: 'Non-recyclable',
    //     label: 'Non-recyclable',
    //     data: 30,
    //     backgroundColor: '#F9B8FF',
    //     width: '10%' 
    // },
    // {
    //     id: 'Cardboard',
    //     label: 'Cardboard',
    //     data: 30,
    //     backgroundColor: '#C69AFF',
    //     width: '33%' 
    // }
// ]

const ChartTotalSales = () => {
    const { t, i18n } = useTranslation()
    const { recycType } = useContainer(CommonTypeContainer);
    const [frmDate, setFrmDate] = useState<dayjs.Dayjs>(dayjs().startOf('month'))
    const [toDate, setToDate] = useState<dayjs.Dayjs>(dayjs())
    const [dataset, setDataset] = useState<Dataset>({total_weight: 0, sales: []});

    const getBackgroundColor = (fieldName: fieldName) :string => {
        const backgroundColors = {
            'Rechargeable Batteries': '#EFE72F',
            'Glass Bottles': '#4FB5F5',
            'Paper': '#7ADFF1',
            'Fluorescent Lamps and Tubes': '#ECAB05',
            'Small Electrical Appliances': '#5AE9D8',
            'Plastics': '#FF9FB7',
            'Non-recyclable': '#F9B8FF',
            'Cardboard': '#C69AFF'
        }

        return backgroundColors[fieldName]
    }

    const getLabel = (type: string): string => {
        let languages:string = ''
        if(i18n.language === Languages.ENUS){
            const recyclables = recycType?.find(item => item.recyclableNameEng === type)
            if(recyclables) languages = recyclables?.recyclableNameEng
        } else if(i18n.language === Languages.ZHCH){
            const recyclables = recycType?.find(item => item.recyclableNameEng === type)
            if(recyclables) languages = recyclables?.recyclableNameSchi
        } else {
            const recyclables = recycType?.find(item => item.recyclableNameEng === type)
            if(recyclables) languages = recyclables?.recyclableNameTchi
        }
        return languages
    }

    const initTotalSales = async () => {
        const response = await getTotalSalesProductAnalysis(frmDate.format('YYYY-MM-DD'), toDate.format('YYYY-MM-DD'));
        const dataSales:Dataset = {total_weight: 0, sales: []}
        if(response){
            const total_weight = 5500
            dataSales.total_weight = total_weight;
            const sales:DataSales[] = [
                {
                    label: 'Rechargeable Batteries',
                    weight: 1000,
                    backgroundColor: '',
                    width: '',
                    description: '',
                },
                {
                    label: 'Glass Bottles',
                    weight: 1000,
                    backgroundColor: '',
                    width: '',
                    description: '',
                },
                {
                    label: 'Paper',
                    weight: 1000,
                    backgroundColor: '',
                    width: '',
                    description: '',
                },
                {
                    label: 'Fluorescent Lamps and Tubes',
                    weight: 500,
                    backgroundColor: '',
                    width: '',
                    description: '',
                },
                {
                    label: 'Small Electrical Appliances',
                    weight: 500,
                    backgroundColor: '',
                    width: '',
                    description: '',
                },
                {
                    label: 'Plastics',
                    weight: 500,
                    backgroundColor: '',
                    width: '',
                    description: '',
                },
                {
                    label: 'Non-recyclable',
                    weight: 500,
                    backgroundColor: '',
                    width: '',
                    description: '',
                },
                {
                    label: 'Cardboard',
                    weight: 500,
                    backgroundColor: '',
                    width: '',
                    description: '',
                }
            ];

            for(let sale of sales){
                dataSales.sales.push({
                    label: sale.label,
                    description: getLabel(sale.label),
                    weight: sale.weight,
                    backgroundColor: getBackgroundColor(sale.label),
                    width: `${sale.weight / dataSales.total_weight*100}%`
                })
            }
            // for(let [key, value] of Object.entries(response.sales)){
            //     if(!value?.weight) continue
            //     const weight:number = Number(value?.weight.slice(0, -1))
            //     dataSales.sales.push({
            //         label: '',
            //         data: 0,
            //         backgroundColor: '',
            //         width: `${weight/Number(dataSales.total_weight)}%`,
            //     })
            // }
            setDataset(dataSales)
        }
    };
   
    useEffect(() => {
        initTotalSales()
    }, [])

    useEffect(() => {
        const datsetLang = {
            ...dataset,
            sales: dataset.sales.map(sale => {
                return{
                    ...sale,
                    description: getLabel(sale.label)
                }
            })
        }
        setDataset(datsetLang)
    }, [i18n.language])

    useEffect(() => {
       setTimeout(() => {
        initTotalSales()
       }, 1000);
    }, [frmDate, toDate])

    return(
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">               
                <Grid style={{width: '100%', height: '340px', padding: '38px, 55px, 38px, 55px', gap: '10px', backgroundColor: '#F4F5F7'}}>
                    <Grid style={{display: 'flex', flexDirection: 'column', width: '100%', height: '270px', padding: '30px', gap: '10px', backgroundColor: '#FFFFFF', borderRadius: '30px'}}>
                        <Grid style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <Autocomplete
                                disablePortal
                                id="collectionIds"
                                defaultValue={''}
                                options={ []}
                                onChange={(event, value) => {
                                    // onChangeColdId(value)
                                }}
                                value={''}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size='small'
                                        placeholder={t('dashboard_manufacturer.product_category')}
                                        sx={[styles.textField, { width: 400}]}
                                        InputProps={{
                                            ...params.InputProps,
                                            sx: styles.inputProps
                                        }}
                                    />
                                )}
                            />
                            <Grid  item style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 1, border: '1px solid #E2E2E2', height: '40px', padding: '8px', borderRadius: '6px'}} >
                                <Typography>
                                {t('dashboard_recyclables.date_range')}
                                </Typography>
                            </Grid>

                           <Grid item style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1}}>
                                <DatePicker
                                    value={dayjs()}
                                    disableOpenPicker
                                    slotProps={{ textField: { size: 'small' } }}
                                    sx={localstyles.datePicker}
                                    maxDate={dayjs()}
                                    onChange={(value) => {
                                        if(value) setFrmDate(value)
                                    }}
                                    format="DD/MM/YYYY"
                                />
                                <Typography>-</Typography>
                                <DatePicker
                                    value={dayjs()}
                                    disableOpenPicker
                                    slotProps={{ textField: { size: 'small' } }}
                                    sx={localstyles.datePicker}
                                    minDate={dayjs()}
                                    onChange={(value) => {
                                        if(value) setToDate(value)
                                    }}
                                    format="DD/MM/YYYY"
                                />
                           </Grid>
                        </Grid>
                        <Grid style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', marginBottom: '60px'}}>
                            <Typography style={{fontSize: '18px', color: '#717171', fontWeight: '700'}}>
                                {t('dashboard_manufacturer.total_customer_orders')}
                            </Typography>
                            <Typography style={{fontSize: '36px', color: '#717171', fontWeight: '700'}}>
                                {dataset.total_weight}
                            </Typography>
                            <Typography style={{fontSize: '20px', color:'#717171', fontWeight: '700'}}>
                                {'Kg'}
                            </Typography>
                        </Grid>
                        <Grid style={{display: 'flex', height: '20px', width: '1200px'}}>
                            {
                                dataset?.sales.map((item, index) => {
                                    return(
                                        <Tooltip 
                                        title={`${item.description} ${item.weight}Kg`} 
                                        arrow 
                                        placement="top" 
                                        componentsProps={{
                                            tooltip: {
                                                sx: localstyles.tooltip(item.backgroundColor)
                                            },
                                        }}    
                                    >
                                        <Box 
                                            sx={{
                                                width: item.width, 
                                                backgroundColor: item.backgroundColor, 
                                                borderTopLeftRadius: (index === 0) ? '6px' : '', 
                                                borderBottomLeftRadius: (index === 0) ? '6px' : '', 
                                                borderTopRightRadius: (dataset.sales.length === index + 1) ? '6px' : '', 
                                                borderBottomRightRadius: (dataset.sales.length === index + 1) ? '6px' : '', 
                                            }}>    
                                        </Box>
                                    </Tooltip>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                    
                </Grid>
            </LocalizationProvider>
        </>
    )
};

const localstyles = {
    datePicker: () => ({
        padding: 0, 
        width: 110,
        '.react-datepicker-wrapper input[type="text"]' :{
            border: 'none'
        }
    }),
    tooltip: (color: string) => ({
        bgcolor: color,
        width: '100px',
        height: '48px',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#717171',
        '& .MuiTooltip-arrow': {
            color: color,
        },
    })
  }

export default ChartTotalSales;