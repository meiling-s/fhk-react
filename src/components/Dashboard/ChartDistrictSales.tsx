
import {Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useTranslation } from 'react-i18next'
import dayjs from "dayjs";
import { styles } from '../../constants/styles';
import { Realm, localStorgeKeyName } from '../../constants/constant';
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

interface Dataset{
    data: any,
    outline: any,
    label: string,
    backgroundColor: string,
}

type props = {
    labels: string[]
    dataset:Dataset[]|[]
    onChangeFromDate: (value: dayjs.Dayjs ) => void
    onChangeToDate:(value: dayjs.Dayjs) => void
    onHandleSearch?:() => void
    frmDate:dayjs.Dayjs
    toDate:dayjs.Dayjs
    collectionIds?: number[]
    title:string
    onChangeColdId: (value: number | null) => void
    colId:number | null
    typeChart:string
}

const ChartDistrictSales = () => {
    const { t } = useTranslation()
    const realm = localStorage.getItem(localStorgeKeyName.realm);
    const [frmDate, setFrmDate] = useState<dayjs.Dayjs>(dayjs().startOf('month'))
    const [toDate, setToDate] = useState<dayjs.Dayjs>(dayjs())
    const chartRef = useRef();
    const [data, setData] = useState<any>(location);
    const colors:string[] = ['#6FBD33','#88D13D','#AED982','#D3E3C3','#CCCCCC'];

    const getData = async() => {
        try {
            fetch("https://raw.githubusercontent.com/markmarkoh/datamaps/master/src/js/data/hkg.topo.json")
            .then((response) => response.json())
            .then((value) => {
                setData((ChartGeo.topojson.feature(value, value.objects.hkg) as any).features);
            });
        } catch (error) {

        }
    }
  
    useEffect(() => {
        // getData()
    }, []);
   
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
                                            // if(value) onChangeFromDate(value)
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
                                            // if(value) onChangeToDate(value)
                                        }}
                                        format="DD/MM/YYYY"
                                    />
                            </Grid>

                            {realm === Realm.collector && (
                                <Autocomplete
                                    disablePortal
                                    id="collectionIds"
                                    defaultValue={''}
                                    options={[]}
                                    onChange={(event, value) => {
                                        // onChangeColdId(value)
                                    }}
                                    value={'colId'}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size='small'
                                            placeholder={t('dashboard_recyclables.recycling_point')}
                                            sx={[styles.textField, { width: 400}]}
                                            InputProps={{
                                                ...params.InputProps,
                                                sx: styles.inputProps
                                            }}
                                        />
                                    )}
                                />
                                )}
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
                                            data: data.map((d: any) => ({
                                            feature: d,
                                            value: Math.round(Math.random() * 100),
                                            backgroundColor: 'red'
                                            })),
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
                                        return `${context.element.feature.properties.name} - ${context.dataset.label}: ${context.formattedValue}%`;
                                      }
                                    }
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
                                        if(value > 0.9){
                                            return '#6FBD33'
                                        } else if(value > 0.7){
                                            return '#88D13D'
                                        } else if(value > 0.5){
                                            return '#AED982'
                                        } else if(value > .03){
                                            return '#D3E3C3'
                                        } else {
                                            return '#CCCCCC'
                                        }
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