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
import { getBackgroundColor, randomBackgroundColor } from '../../utils/utils';
import { Dataset } from '@mui/icons-material';

type fieldName = 'Rechargeable Batteries' | 'Glass Bottles' | 'Paper' | 'Fluorescent Lamps and Tubes' | 'Small Electrical Appliances'| 'Plastics' | 'Non-recyclable' | 'Cardboard' | 'Metals';
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

const ChartTotalSales = () => {
    const { t, i18n } = useTranslation()
    const { recycType } = useContainer(CommonTypeContainer);
    const [frmDate, setFrmDate] = useState<dayjs.Dayjs>(dayjs().startOf('month'))
    const [toDate, setToDate] = useState<dayjs.Dayjs>(dayjs())
    const [dataset, setDataset] = useState<Dataset>({total_weight: 0, sales: []});
    const [recycTypeId, setRecycTypeId] = useState<string|null>(null);
    const [datasetBackup, setDatasetBackup] = useState<Dataset>({total_weight: 0, sales: []});
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
            const total_weight = response.total_weight
            dataSales.total_weight = total_weight;
            const sales:DataSales[] = [];

            for(let [key, value] of Object.entries(response.sales)){
                const recycable = recycType?.find(item => item.recycTypeId === key);
                const label = recycable?.recyclableNameEng as fieldName
                if(!recycable) continue;
                sales.push(
                    {
                        label: label,
                        weight: Number(value),
                        backgroundColor: recycable?.backgroundColor ? recycable.backgroundColor : randomBackgroundColor(),
                        width: `${Number(value) / dataSales.total_weight*100}%`,
                        description: getLabel(label),
                    }
                )
            }
            dataSales.sales = sales
            setDataset(dataSales)
            setDatasetBackup(dataSales)
        }
    };
  
    useEffect(() => {
        initTotalSales()
    }, [recycType])

    useEffect(() => {
        
        if(!recycTypeId){
            initTotalSales()
            return
        }
        const recycable = recycType?.find(item => item.recycTypeId === recycTypeId);
        if(!recycable) return
        const label = recycable?.recyclableNameEng as fieldName
        let weight:number = 0;
        const sales:DataSales[] = []
        for(let data of datasetBackup.sales){
            if(label === data.label){
                weight = data.weight
                data.width = '100%'
                sales.push(data)
            }
        }
  
        setDataset(prev => {
            return{
                ...prev,
                total_weight: weight,
                sales : sales
            }
        })
    }, [recycTypeId])

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

    const onChangeRecycTypeId = (value: string|null) => {
        setRecycTypeId(value)
    }
    
    return(
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">               
                <Grid style={{width: '100%', height: '340px', padding: '38px, 55px, 38px, 55px', gap: '10px', backgroundColor: '#F4F5F7'}}>
                    <Grid style={{display: 'flex', flexDirection: 'column', width: '100%', height: '320', padding: '30px', gap: '10px', backgroundColor: '#FFFFFF', borderRadius: '30px'}}>
                        <Grid style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <Autocomplete
                                disablePortal
                                id="recycTypeId"
                                defaultValue={recycTypeId}
                                options={recycType ? recycType?.map(item =>  item.recycTypeId).sort() : []}
                                sx={{width: 170}}
                                onChange={(event, value) => {
                                    onChangeRecycTypeId(value)
                                }}
                                value={recycTypeId}
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
                                    value={frmDate}
                                    disableOpenPicker
                                    slotProps={{ textField: { size: 'small' } }}
                                    sx={localstyles.datePicker}
                                    maxDate={toDate}
                                    onChange={(value) => {
                                        if(value) setFrmDate(value)
                                    }}
                                    format="DD/MM/YYYY"
                                />
                                <Typography>-</Typography>
                                <DatePicker
                                    value={toDate}
                                    disableOpenPicker
                                    slotProps={{ textField: { size: 'small' } }}
                                    sx={localstyles.datePicker}
                                    minDate={frmDate}
                                    onChange={(value) => {
                                        if(value) setToDate(value)
                                    }}
                                    format="DD/MM/YYYY"
                                />
                           </Grid>
                        </Grid>
                        <Grid style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '40px', marginBottom: '60px'}}>
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
                                            title={
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        maxWidth: 320,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        p: 1,
                                                    }}
                                                >
                                                    <Typography 
                                                        style={
                                                            {
                                                                fontSize: '20px', 
                                                                fontWeight: '500', 
                                                                alignItems: 'center', 
                                                                textAlign: 'center'
                                                        }
                                                        }
                                                    >
                                                        {item.description}
                                                    </Typography>
                                                    <Typography 
                                                        style={
                                                            {
                                                                fontSize: '20px', 
                                                                fontWeight: '500', 
                                                                alignItems: 'center', 
                                                                textAlign: 'center'
                                                            }
                                                        }
                                                    >
                                                        {item.weight} Kg
                                                    </Typography>
                                                </Box>
                                            } 
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
        width: '150px',
        height: '60px',
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