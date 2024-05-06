import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {Autocomplete, Grid, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useTranslation } from 'react-i18next'
import dayjs from "dayjs";
import { styles } from '../../constants/styles';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface Dataset{
    id: string,
    label: string,
    data: number[],
    backgroundColor: string,
}

type props = {
    labels: string[]
    dataset:Dataset[]|[]
    onChangeFromDate: (value: dayjs.Dayjs ) => void
    onChangeToDate:(value: dayjs.Dayjs) => void
    onHandleSearch:() => void
    frmDate:dayjs.Dayjs
    toDate:dayjs.Dayjs
    collectionIds?: number[]
    title:string
    onChangeColdId: (value: number | null) => void
    colId:number | null
}

const Dashboard = ({
    labels, 
    dataset, 
    onChangeFromDate,
    onChangeToDate,
    frmDate,
    toDate,
    collectionIds,
    title,
    onChangeColdId,
    colId
}:props) => {
    const { t } = useTranslation()

    const options: any = {
        plugins: {
          title: {
            display: false,
            text: 'Chart.js Bar Chart - Stacked',
          },
          legend: {
            labels: {
                usePointStyle: true,
            },
            position: 'right',
            pointStyle: 'circle',
            usePointStyle: true,
          },
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
                    return value  + 'Kg';
                }
            }
          },
        },
    };
   
    const data = {
        labels,
        datasets: dataset,
    };

    return(
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
                <Grid style={{display: 'flex', alignItems: 'center', height: '80px', padding: '20px, 20px, 0px, 20px', gap: '40px', backgroundColor: '#F4F5F7'}}>
                    <Typography style={{fontWeight: '700', color: '#000000', fontSize: '22px'}}>
                        {title}
                    </Typography>
                </Grid>
                
                <Grid style={{width: '100%', height: '518px', padding: '38px, 55px, 38px, 55px', gap: '10px', backgroundColor: '#F4F5F7'}}>
                    <Grid style={{display: 'flex', flexDirection: 'column', width: '100%', height: '465px', padding: '30px', gap: '10px', backgroundColor: '#FFFFFF', borderRadius: '30px'}}>
                        <Typography style={{fontWeight: 700, fontSize: '18px', color: '#717171' }}>
                            {t('dashboard_recyclables.different_recycling_weights')}
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
                                    format="YYYY/MM/DD"
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
                                    format="YYYY/MM/DD"
                                />
                           </Grid>

                            <Autocomplete
                                disablePortal
                                id="collectionIds"
                                defaultValue={0}
                                options={collectionIds ? collectionIds : []}
                                onChange={(event, value) => {
                                    onChangeColdId(value)
                                }}
                                value={colId}
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
                        
                        </Grid>
                        <Grid style={{height: '295px', width: '1200px'}}>
                            <Bar options={options} data={data}/>
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

export default Dashboard