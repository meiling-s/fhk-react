
import {Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useTranslation } from 'react-i18next'
import dayjs from "dayjs";
import { styles } from '../../constants/styles';
import { Languages, Realm, localStorgeKeyName } from '../../constants/constant';
import { useEffect, useState, useRef } from 'react';
import { Chart } from "react-chartjs-2";
import * as ChartGeo from "chartjs-chart-geo";
import {
  Chart as ChartJS,
  CategoryScale,
  Tooltip,
  Title,
  Legend
} from "chart.js";
import location from './hongkongLocation.json';
import i18n from '../../setups/i18n';
import { getTotalSalesProductByDistrictAnalysis } from '../../APICalls/Collector/dashboardRecyables';
import CommonTypeContainer from '../../contexts/CommonTypeContainer';
import { useContainer } from 'unstated-next';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    ChartGeo.ChoroplethController,
    ChartGeo.ProjectionScale,
    ChartGeo.ColorScale,
    ChartGeo.GeoFeature
);

type Districts = "Central and Western"|"Eastern"|"Southern"|"Sham Shui Po"|"Kowloon City"|"Wong Tai Sin"|"Kwun Tong"|"Yau Tsim Mong"|"Kwai Tsing"|"Tsuen Wan"|"Tuen Mun"|"Yuen Long"|"North"|"Tai Po"|"Sha Tin"|"Sai Kung"|"Islands"|"Wan Chai";
type DataDistricts = {
    district: Districts,
    percentage: string,
    total_weight: string,
    recyc_weight: {}
}

const ChartDistrictSales = () => {
    const { t } = useTranslation()
    const realm = localStorage.getItem(localStorgeKeyName.realm);
    const [frmDate, setFrmDate] = useState<dayjs.Dayjs>(dayjs().startOf('month'))
    const [toDate, setToDate] = useState<dayjs.Dayjs>(dayjs())
    const chartRef = useRef();
    const [data, setData] = useState<any>(location);
    const [dataset, setDataset] = useState<any>([]);
    const [recycTypeId, setRecycTypeId] = useState<string|null>(null);
    const [sourceData, setSourcaData] = useState<DataDistricts>()

    const colors:string[] = ['#6FBD33','#88D13D','#AED982','#D3E3C3','#CCCCCC'];
    const { recycType } = useContainer(CommonTypeContainer);

    const initData = async() => {
        const response = await getTotalSalesProductByDistrictAnalysis(frmDate.format('YYYY-MM-DD'), toDate.format('YYYY-MM-DD'));

        if(response){
            const copyData = [...data];
            const update:any = []
            for(let region of response){
                const indexOfRegion = copyData.findIndex(item => item.properties.name_english === region.district);
                const reg = copyData[indexOfRegion]
                update.push({
                    feature: reg,
                    value:  Number(region?.percentage),
                    weight:  Number(region?.total_weight),
                    recyc_weight: region.recyc_weight
                })
            }
            // setSourcaData(response)
            setDataset(update)

        }
    }

    useEffect(() => {
        initData()
    }, []);

    useEffect(() => {
        initData()
    }, [frmDate, toDate])

    const getDistirctLabelName = (properties: any):string => {
        if(i18n.language === Languages.ENUS){
            return properties.name_english
        } else if(i18n.language === Languages.ZHCH){
            return properties.name_simplified
        } else {
            return properties.name_traditional
        }
    }

    // useEffect(() => {
    //     const changeLang = data.map((item:any) => {
    //         return{
    //             ...item,
    //             properties: {
    //                 ...item.properties,
    //                 name: getDistirctLabelName(item.properties)

    //             }
    //         }
    //     })

    //     setData(changeLang)
    // }, [i18n.language])
    
    const footerTooltip = (tooltipItems:any[]) => {
        let total:number = 0;
        const weights = tooltipItems[0]?.raw?.recyc_weight;
        if(recycTypeId){
            for(let [key, value] of  Object.entries(weights)){
                if(recycTypeId && key === recycTypeId){
                    total += Number(value);
                } 
           }
        } else {
            for(let [key, value] of  Object.entries(weights)){
                total += Number(value);
           }
        }
 
        //     tooltipItems.forEach(function(tooltipItem) {
        //         // console.log('tooltip', tooltipItem.raw.recyc_weight)
        //       total = tooltipItem.raw.weight;
        //     });
        return total + ' Kg';
    };

    // const data1 = data.map((d: any) => (
    //     {
    //         feature: d,
    //         value:  Math.round(Math.random() * 100),
    //     }
    // ));

    const onChangeRecycTypeId = (value: string|null) => {
        setRecycTypeId(value)
    }

    return(
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">               
                <Grid style={{width: '100%', height: '900px', padding: '38px, 55px, 38px, 55px', gap: '10px', backgroundColor: '#F4F5F7'}}>
                    <Grid style={{display: 'flex', flexDirection: 'column', width: '100%', height: '800px', padding: '30px', gap: '10px', backgroundColor: '#FFFFFF', borderRadius: '30px'}}>
                        <Typography style={{fontWeight: 700, fontSize: '18px', color: '#717171' }}>
                            {t('dashboard_manufacturer.sales_volume_region')}
                        </Typography>
                        <Grid style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Grid style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <Autocomplete
                                    disablePortal
                                    id="recycTypeId"
                                    defaultValue={recycTypeId}
                                    options={recycType ? recycType?.map(item =>  item.recycTypeId).sort() : []}
                                    onChange={(event, value) => {
                                        onChangeRecycTypeId(value)
                                    }}
                                    sx={{width: 170}}
                                    value={recycTypeId}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size='small'
                                            placeholder={t('dashboard_manufacturer.product_category')}
                                            sx={[styles.textField, { width: 500}]}
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

                            <Grid style={{display: 'flex', flexDirection: 'column', width: '250px'}}>
                                <Typography style={{fontSize: '13px', color: '#535353' , marginBottom: '5px'}}>{t('dashboard_manufacturer.sales_volume')}</Typography>
                                <Grid style={{width: '100%', display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center'}}>
                                    <Typography style={{fontSize: '12px', color: '#535353'}}>{t('dashboard_manufacturer.high')}</Typography>
                                    <Grid style={{display: 'flex', width: '100%'}}>
                                        {
                                            colors.map((item, index) => {
                                                return <Box 
                                                    sx={{
                                                        width: '20%', 
                                                        height: '10px',
                                                        backgroundColor: item, 
                                                        borderTopLeftRadius: (index === 0) ? '6px' : '', 
                                                        borderBottomLeftRadius: (index === 0) ? '6px' : '', 
                                                        borderTopRightRadius: (colors.length === index + 1) ? '6px' : '', 
                                                        borderBottomRightRadius: (colors.length === index + 1) ? '6px' : '', 
                                                    }}
                                                >
                                                </Box>
                                            })
                                        }
                                    </Grid>
                                    <Typography style={{fontSize: '12px', color: '#535353'}}>{t('dashboard_manufacturer.low')}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        
                        <Grid style={{height: '295px', width: '1200px'}}>
                            <Chart
                                ref={chartRef}
                                type="choropleth"
                                data={{
                                    labels: data.map((d: any) => d.properties.name),
                                    datasets: [
                                        {
                                            outline: data,
                                            label: "Completed",
                                            data: dataset,
                                        },
                                    ]
                                }}
                                options={{
                                    showOutline: true,
                                    showGraticule: false,
                                    plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: (context: any) => {
                                                // return `${context.element.feature.properties.name} - ${context.dataset.label}: ${context.formattedValue}Kg`;
                                                return ` ${context.element.feature.properties.name} `;
                                            },
                                            footer: footerTooltip,
                                        },
                                        position: 'nearest',
                                        usePointStyle: true,
                                        backgroundColor: '#C3DAAC',
                                        boxWidth: 50,
                                        boxHeight: 50,
                                        bodyColor: '#717171',
                                        footerColor: '#717171',
                                        footerAlign: 'center',
                                        bodyAlign: 'center',
                                        xAlign: 'center',
                                        bodyFont: {
                                            size: 17
                                        },
                                        
                                    },
                                    legend: {
                                        display: false
                                    }
                                    },
                                    hover: {
                                        mode: "nearest"
                                    },
                                    scales: {
                                        xy: {
                                            axis: 'x',
                                            projection: "mercator",
                                            ticks: {
                                                // Include a dollar sign in the ticks
                                                callback: function(value, index, ticks) {
                                                    return '$' + value;
                                                }
                                            }
                                        },
                                        color: {
                                            axis: 'x',
                                            interpolate: (value) => {
                                                let color:string= ''
                                                if(value > 0.9){
                                                    color = '#6FBD33'
                                                } else if(value > 0.7){
                                                    color = '#88D13D'
                                                } else if(value > 0.5){
                                                    color = '#AED982'
                                                } else if(value > 0.3){
                                                    color = '#D3E3C3'
                                                } else {
                                                    color = '#CCCCCC'
                                                }
                                                return color
                                            },
                                            display: false,
                                            legend: {
                                                position: "top-right",
                                                align: "right",
                                            }
                                        }
                                    }
                                }}
                            />
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
    })
  }

export default ChartDistrictSales;