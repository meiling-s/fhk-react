
import {Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useTranslation } from 'react-i18next'
import dayjs from "dayjs";
import { styles } from '../../constants/styles';
import { useEffect, useState, useRef } from 'react';
import * as ChartGeo from "chartjs-chart-geo";
import * as echarts from "echarts";
import {
  Chart as ChartJS,
  CategoryScale,
  Tooltip,
  Title,
  Legend
} from "chart.js";
import location from './hongkongLocation.json';
import { getTotalSalesProductByDistrictAnalysis } from '../../APICalls/Collector/dashboardRecyables';
import CommonTypeContainer from '../../contexts/CommonTypeContainer';
import { useContainer } from 'unstated-next';
import i18n from '../../setups/i18n';
import { Languages } from '../../constants/constant';
import hongkong from './echartHongkong.json'
interface Properties {
    name: string,
    name_english: string,
    name_simplified: string,
    name_traditional: string
}

interface Geometry {
    type: string
    coordinates: []
}
interface District{
    type: string,
    id: string,
    properties: Properties,
    geometry: Geometry
}

interface Dataset {
    feature: District
    value?:  number,
    weight?:  number,
    recyc_weight: any
}

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

const ChartDistrictSales = () => {
    const { t } = useTranslation()
    const [frmDate, setFrmDate] = useState<dayjs.Dayjs>(dayjs().startOf('month'))
    const [toDate, setToDate] = useState<dayjs.Dayjs>(dayjs())
    const [data, setData] = useState<any>(hongkong)
    const [dataset, setDataset] = useState<Dataset[]>([]);
    const [recycable, setRecyable] = useState<{recycTypeId: string|null|undefined, text: string}>({recycTypeId: null, text: ''})
    const chartRef = useRef<HTMLDivElement>(null);
    const [dataValue, setDataValue] = useState<{name:string, value: number, select: any}[]>([]);
    const [dataNameMap, setDataNameMap] = useState<any>({});
    const [dataSource, setDataSource] = useState<any>([])
    echarts.registerMap('HK', data);
    const districtLang = [
        {
            "name": "Central and Western",
            "name_english": "Central and Western",
            "name_simplified": "中西区",
            "name_traditional": "中西區"
        },
        {
            "name": "Wan Chai",
            "name_english": "Wan Chai",
            "name_simplified": "晚拆",
            "name_traditional": "晚拆"
        },
        {
            "name": "Eastern",
            "name_english": "Eastern",
            "name_simplified": "东",
            "name_traditional": "東"
        },
        {
            "name": "Southern",
            "name_english": "Southern",
            "name_simplified": "南方",
            "name_traditional": "南方"
        },
        {
            "name": "Yau Tsim Mong",
            "name_english": "Yau Tsim Mong",
            "name_simplified": "油尖旺",
            "name_traditional": "油尖旺"
        },
        {
            "name": "Kowloon City",
            "name_english": "Kowloon City",
            "name_simplified": "九龙城",
            "name_traditional": "九龍城"
        },
        {
            "name": "Sham Shui Po",
            "name_english": "Sham Shui Po",
            "name_simplified": "沙漠水泼",
            "name_traditional": "沙漠水潑"
        },
        {
            "name": "Wong Tai Sin",
            "name_english": "Wong Tai Sin",
            "name_simplified": "黄大仙",
            "name_traditional": "黃大仙"
        },
        {
            "name": "Kwun Tong",
            "name_english": "Kwun Tong",
            "name_simplified": "可无奈同",
            "name_traditional": "可無奈同"
        },
        {
            "name": "Sai Kung",
            "name_english": "Sai Kung",
            "name_simplified": "西贡",
            "name_traditional": "西貢"
        },
        {
            "name": "Sha Tin",
            "name_english": "Sha Tin",
            "name_simplified": "沙田",
            "name_traditional": "沙田"
        },
        {
            "name": "Kwai Tsing",
            "name_english": "Kwai Tsing",
            "name_simplified": "葵青区",
            "name_traditional": "葵青區"
        },
        {
            "name": "Tsuen Wan",
            "name_english": "Tsuen Wan",
            "name_simplified": "荃一号",
            "name_traditional": "荃一號"
        },
        {
            "name": "Tuen Mun",
            "name_english": "Tuen Mun",
            "name_simplified": "我支持蒙",
            "name_traditional": "我支持蒙"
        },
        {
            "name": "Yuen Long",
            "name_english": "Yuen Long",
            "name_simplified": "与恩龙",
            "name_traditional": "與恩龍"
        },
        {
            "name": "North",
            "name_english": "North",
            "name_simplified": "北",
            "name_traditional": "北"
        },
        {
            "name": "Tai Po",
            "name_english": "Tai Po",
            "name_simplified": "这是坡",
            "name_traditional": "這是坡"
        },
        {
            "name": "Islands",
            "name_english": "Islands",
            "name_simplified": "岛屿",
            "name_traditional": "島嶼"
        },
    ];

    const option: any = {
        tooltip: {
            width: '300px',
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params:any, ticket:any, callback:any) {
                const data = dataSource[params?.dataIndex];
                const recyc_weight = data?.recyc_weight;
                if(!recyc_weight) return
                let total:number = 0
                if(recycable.recycTypeId){
                    total = recyc_weight[recycable.recycTypeId] ?? 0
                } else {
                    const reduce = Object.values(recyc_weight).reduce((acc, cur) => {
                        return Number(acc) + Number(cur)
                    }, 0) as number
                    total = reduce
                }
                const indexLang = districtLang.find(item => item.name === data.district);
                let lang:string = '';
                if(indexLang) {
                    if(i18n.language === Languages.ENUS){
                        lang = indexLang.name_english
                    } else if(i18n.language === Languages.ZHCH){
                        lang = indexLang.name_simplified
                    } else {
                        lang = indexLang.name_traditional
                    }
                }
                 return `<div style="width: 120px; height: 40px; display: flex; alignItems: center; flexDirection: column; justifyContent: center; color: black;">
                    ${lang} <br>
                    ${total} Kg
                 </div>`
            },
            position: 'inside',
            backgroundColor: '#C3DAAC',
            textStyle: {
                color: '#5d6f80',
            },            
        },


        toolbox: {
            show: false,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },
        visualMap: {
            // type:
            show: false,
            min: 0,
            max: 1,
            text: ['High', 'Low'],
            realtime: true,
            calculable: true,
            inRange: {
                color: ['#CCCCCC','#D3E3C3','#AED982','#88D13D','#6FBD33']
            }
        },
        series: [
            {
                name: '香港18区人口密度',
                type: 'map',
                map: 'HK',
                label: {
                    show: false
                },
                data: dataValue,
                nameMap: dataNameMap,
                itemStyle: {
                    emphasis: {
                       areaColor: '#C3DAAC',
                       silent: true
                    }  
                },
                
            }
        ]
    };

    const initChart = async (dom: HTMLDivElement) => {
        const response = await getTotalSalesProductByDistrictAnalysis(frmDate.format('YYYY-MM-DD'), toDate.format('YYYY-MM-DD'));
        if(response){
            let chart = echarts.init(dom);
            const nameMap:any = {};
            const values:{name:string, value: number, select: any}[] = []
            for(let region of response){
                const name = region.district;
                const value = Number(region.percentage) / 100;
                const indexLang = districtLang.find(item => item.name === name);
                if(!indexLang) continue;
                let lang:string = '';
                if(i18n.language === Languages.ENUS){
                    lang = indexLang.name_english
                } else if(i18n.language === Languages.ZHCH){
                    lang = indexLang.name_simplified
                } else {
                    lang = indexLang.name_traditional
                }
                nameMap[name] = lang;
                values.push(
                    {
                        name: lang, 
                        value: value , 
                        select: {
                            label: {
                                color: 'black',
                                // backgroundColor: 'none'
                                areaColor: '#C3DAAC',
                            }
                        }
                    });
            }
            setDataValue(values);
            setDataNameMap(nameMap)
            setDataSource(response)
            chart.setOption(option);
            window.addEventListener('resize',function(){
                chart.resize();
            })
        }

    }

    useEffect(() => {
        if (chartRef.current) {
            const chart = echarts.getInstanceByDom(chartRef.current);
            chart?.setOption(option);
        }
    }, [dataValue, dataNameMap, recycable])

    useEffect(() => {
        if (chartRef.current) initChart(chartRef.current);
    }, []);

    const colors:string[] = ['#6FBD33','#88D13D','#AED982','#D3E3C3','#CCCCCC'];
    const { recycType } = useContainer(CommonTypeContainer);

    const initData = async() => {
        const response = await getTotalSalesProductByDistrictAnalysis(frmDate.format('YYYY-MM-DD'), toDate.format('YYYY-MM-DD'));

        if(response){
            const copyData = [...location];
            const update:any = []
            for(let region of response){
                const indexOfRegion = copyData.findIndex(item => item.properties.name_english === region.district);
                const reg = copyData[indexOfRegion]
                update.push({
                    feature: {
                        ...reg,
                        properties: {
                            ...reg.properties,
                            name: getDistrictName(reg.properties)
                        }
                    },
                    value:  Number(region?.percentage),
                    weight:  Number(region?.total_weight),
                    recyc_weight: region.recyc_weight
                })
            }
            setDataset(update)

        }
    }

    useEffect(() => {
        if (chartRef.current)  initChart(chartRef.current);
    }, [frmDate, toDate, recycType])

    const footerTooltip = (tooltipItems:any[]) => {
        let total:number = 0;
        const weights = tooltipItems[0]?.raw?.recyc_weight;
        if(recycable.recycTypeId){
            for(let [key, value] of  Object.entries(weights)){
                if(recycable.recycTypeId && key === recycable.recycTypeId){
                    total += Number(value);
                } 
           }
        } else {
            for(let [key, value] of  Object.entries(weights)){
                total += Number(value);
           }
        }
 
        return total + ' Kg';
    };

    const onChangeRecycTypeId = (value: {recycTypeId: string | undefined | null, text: string}) => {
        setRecyable(value)
    }

    const getDistrictName = (properties:Properties):string => {
        let language:string = ''
        if(i18n.language === Languages.ENUS){
            language = properties.name_english
        } else if(i18n.language === Languages.ZHCH){
            language = properties.name_simplified
        } else {
            language = properties.name_traditional
        }
        return language
    }

    const changeDistrictLanguangeName = () => {
        const district = dataset.map((item:Dataset) => {
            return{
                ...item,
                feature: {
                    ...item.feature,
                    properties: {
                        ...item.feature.properties,
                        name: getDistrictName(item?.feature?.properties)
                    }
                }
            }
        })
        setDataset(district)
    }

    const getRecyable = ():{recycTypeId: string, text: string}[] => {
        let recycables: {recycTypeId: string, text: string}[] = [];
        if(i18n.language === Languages.ENUS){
            const recycable = recycType?.map(item => {
                return{
                    recycTypeId: item.recycTypeId,
                    text: item.recyclableNameEng
                }
            })
            if(recycable) recycables = recycable
        } else if(i18n.language === Languages.ZHCH){
            const recycable = recycType?.map(item => {
                return{
                    recycTypeId: item.recycTypeId,
                    text: item.recyclableNameSchi
                }
            })
            if(recycable) recycables = recycable
        } else {
            const recycable = recycType?.map(item => {
                return{
                    recycTypeId: item.recycTypeId,
                    text: item.recyclableNameTchi
                }
            })
            if(recycable) recycables = recycable
        }

        return recycables
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
                                    defaultValue={recycable}
                                    options={getRecyable()}
                                    getOptionLabel={(option) => option.text}
                                    onChange={(event, value) => {
                                        if(value) onChangeRecycTypeId(value)
                                        else onChangeRecycTypeId({recycTypeId: null, text: ''})
                                    }}
                                    sx={{width: 170}}
                                    value={recycable}
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
                        
                        <Grid style={{display: 'flex', justifyContent: 'center', height: '295px', width: '1200px'}}>
                            <div className="w-[1200px] h-[730px]" ref={chartRef} ></div>
                            {/* <Chart
                                ref={chartRef}
                                type="choropleth"
                                data={{
                                    labels: location.map((d: any) => d.properties.name),
                                    datasets: [
                                        {
                                            outline: location,
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
                            /> */}
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