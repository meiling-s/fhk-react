import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {Autocomplete, Grid, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useTranslation } from 'react-i18next'
import dayjs from "dayjs";
import { styles } from '../../constants/styles';
import { Realm, localStorgeKeyName } from '../../constants/constant';
import { useEffect, useState } from 'react';
import { collectionPoint } from '../../interfaces/collectionPoint'
import { getCollectionPoint } from '../../APICalls/collectionPointManage';
import CommonTypeContainer from '../../contexts/CommonTypeContainer';
import { useContainer } from 'unstated-next';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
);

interface Dataset{
    id: string,
    label: string,
    data: number[],
    backgroundColor: string,
    borderColor?: string,
    yAxisID?: string
}

type props = {
    labels: string[]
    dataset:Dataset[]|[]
    onChangeFromDate: (value: dayjs.Dayjs ) => void
    onChangeToDate:(value: dayjs.Dayjs) => void
    onHandleSearch?:() => void
    frmDate:dayjs.Dayjs
    toDate:dayjs.Dayjs
    title:string
    onChangeColdId?: (value: number | null) => void
    typeChart:string,
    canvasColor?: string
}

type Collection = {
    colId: number,
    colName: string
}

const Chart = ({
    labels, 
    dataset, 
    onChangeFromDate,
    onChangeToDate,
    frmDate,
    toDate,
    title,
    onChangeColdId,
    typeChart,
    canvasColor
}:props) => {
    const { t } = useTranslation()
    const {dateFormat} = useContainer(CommonTypeContainer)
    const realm = localStorage.getItem(localStorgeKeyName.realm);
    const [collectionPoint, setCollectionPoint] = useState<Collection[]>([])
    const [collection, setCollection] = useState<Collection>({colId: 0, colName: ''})

    const plugin = {
        id: 'customCanvasBackgroundColor',
        beforeDraw: (chart:any, args:any, options:any) => {
          const {ctx, chartArea} = chart;
          ctx.save();
          ctx.globalCompositeOperation = 'destination-over';
          ctx.fillStyle = canvasColor? canvasColor : 'white';
          ctx.fillRect(chartArea.left, 0, chartArea.width, chart.height);
          ctx.restore();
        }
      };

    let options: any = {
        plugins: {
          title: {
            display: false,
            text: 'Chart.js Bar Chart - Stacked',
          },
          labels: {
            align: 'center',
            
          },
          legend: {
            labels: {
                usePointStyle: true,
                fontColor: '#717171',
            },
            position: 'right',
            align: 'start',
            pointStyle: 'circle',
            usePointStyle: true,
          },
          customCanvasBackgroundColor: {
            color: '',
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            ticks: {
                // Include a dollar sign in the ticks
                callback: function(value: string) :string{
                    return value  + ' Kg';
                }
            }
          },
        },
    };
   
    const data = {
        labels,
        datasets: dataset,
    };

    let chart:JSX.Element = <div></div>
    switch(typeChart){
        case('bar'):
            chart =  <Bar options={options} data={data} plugins={[plugin]}/>
            break;
        case('line'):
            chart =  <Line options={options} data={data} plugins={[plugin]}/>
            break;
        default:
            break;
    }

    const initCollectionPoint = async () => {
        const result = await getCollectionPoint(0, 1000)
        const data = result?.data.content
        
        if (data && data.length > 0) {
          const collectionPoint: Collection[] = []
          data.map((item: collectionPoint) => {
            if(item?.colId) collectionPoint.push({
                colId: Number(item.colId),
                colName: item.colName
            })
          })
    
          setCollectionPoint(collectionPoint)
        }
    }

    useEffect(() => {
        if(realm === Realm.collector) initCollectionPoint()
    }, [realm])

    return(
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">               
                <Grid style={{width: '100%', height: '518px', padding: '38px, 55px, 38px, 55px', gap: '10px', backgroundColor: '#F4F5F7'}}>
                    <Grid style={{display: 'flex', flexDirection: 'column', width: '100%', height: '465px', padding: '30px', gap: '10px', backgroundColor: '#FFFFFF', borderRadius: '30px'}}>
                        <Typography style={{fontWeight: 700, fontSize: '18px', color: '#717171' }}>
                            {title}
                        </Typography>
                        <Grid style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
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
                                        if(value) onChangeFromDate(value)
                                    }}
                                    format={dateFormat}
                                />
                                <Typography>-</Typography>
                                <DatePicker
                                    value={toDate}
                                    disableOpenPicker
                                    slotProps={{ textField: { size: 'small' } }}
                                    sx={localstyles.datePicker}
                                    minDate={frmDate}
                                    onChange={(value) => {
                                        if(value) onChangeToDate(value)
                                    }}
                                    format={dateFormat}
                                />
                           </Grid>

                           {realm === Realm.collector && (
                            <Autocomplete
                                disablePortal
                                id="collectionIds"
                                defaultValue={collection}
                                options={collectionPoint}
                                getOptionLabel={(option) => option.colName}
                                onChange={(event, value) => {
                                    if(value){
                                        setCollection(value)
                                        onChangeColdId && onChangeColdId(value.colId)
                                    } else {
                                        setCollection({colId: 0, colName: ''})
                                        onChangeColdId && onChangeColdId(null)
                                    }
                                }}
                                sx={{width: 200}}
                                value={collection}
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
                                noOptionsText={t('common.noOptions')}
                            />
                            )}
                        </Grid>
                        <Grid style={{height: '295px', width: '1200px'}}>
                            {chart}
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

export default Chart;