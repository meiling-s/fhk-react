import { FunctionComponent, useEffect, useState } from "react";
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next'
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import {  
    getWeightRecyclablesColPointDashboard,
    getSalesProductAnalysis,
    getRecycProcessAnalysis 
} from "../../../APICalls/Collector/dashboardRecyables";
import dayjs from "dayjs";
import { Languages, indexMonths, monthSequence } from "../../../constants/constant";
import i18n from "../../../setups/i18n";
import Dashboard from "../../../components/Dashboard/Chart";
import ChartTotalSales from "../../../components/Dashboard/ChartTotalSales";
import ChartDistrictSales from "../../../components/Dashboard/ChartDistrictSales";
import { TypeRecycables,fieldNameRecycables, months } from '../../../constants/constant'
import { getBackgroundColor } from '../../../utils/utils'
interface Dataset{
    id: string,
    label: string,
    data: number[],
    backgroundColor: string,
    borderColor?: string,
    yAxisID?: string,
    pointStyle?: string,
    pointRadius?: number,
    pointHoverRadius?: number
}

type TypeRecycable = {
    'Rechargeable Batteries'?: string;
    'Glass Bottles'?: string;
    'Paper'?: string;
    'Fluorescent Lamps and Tubes'?: string;
    'Small Electrical Appliances'?: string;
    'Plastics'?: string;
    'Non-recyclable'?: string;
    'Cardboard'?: string;
    'Metals'?:string
};

type TypeProcessing = {
    'Total amount of recyclate processed'?: string;
    'Total amount of recyclate remaining after processing'?: string;
    'Total amount of recycled material that cannot be used after processing'?: string;
};

// type fieldName = 'Rechargeable Batteries' | 'Glass Bottles' | 'Paper' | 'Fluorescent Lamps and Tubes' | 'Small Electrical Appliances'| 'Plastics' | 'Non-recyclable' | 'Cardboard';
type fieldNameProcssing = 'Total amount of recyclate processed' | 'Total amount of recyclate remaining after processing' | 'Total amount of recycled material that cannot be used after processing';
const Recyclables: FunctionComponent = () => {
    const { t } = useTranslation()
    const { recycType } =useContainer(CommonTypeContainer);
    const [labelWeight, setLabelWeigth] = useState<string[]>([]);
    const [datasetWeigth, setDataSetWeight] = useState<Dataset[]>([]);
    const [labelProduct, setLabelProduct] = useState<string[]>([]);
    const [datasetProduct, setDataSetProduct] = useState<Dataset[]>([]);
    const [labelProcessing, setLabelProcessing] = useState<{id: number, value: string}[]>([]);
    const [datasetProcessing, setDataSetProcessing] = useState<Dataset[]>([]);
    const [frmDateWeight, setFrmDateWeight] = useState<dayjs.Dayjs>(dayjs().startOf('month'))
    const [toDateWeight, setToDateWeigth] = useState<dayjs.Dayjs>(dayjs())
    const [frmDateProcessing, setFrmDateProcessing] = useState<dayjs.Dayjs>(dayjs().startOf('month'))
    const [toDateProcessing, setToDateProcessing] = useState<dayjs.Dayjs>(dayjs())
    const [frmDateProduct, setFrmDateProduct] = useState<dayjs.Dayjs>(dayjs().startOf('month'))
    const [toDateProduct, setToDateProduct] = useState<dayjs.Dayjs>(dayjs())
    const [colId, setColId] = useState<number | null>(null);
    const processingType = [
        {
            id: '1',
            processingNameEng: 'Total amount of recyclate processed',
            processingNameSchi: '已处理的回收物总量',
            processingNameTchi: '已處理的回收物總量'
        },
        {
            id: '2',
            processingNameEng: 'Total amount of recyclate remaining after processing',
            processingNameSchi: '处理后剩余的回收物总量',
            processingNameTchi: '處理後剩餘的回收物總量'
        },
        {
            id: '3',
            processingNameEng: 'Total amount of recycled material that cannot be used after processing',
            processingNameSchi: '处理后无法使用的回收物总量',
            processingNameTchi: '處理後無法使用的回收物總量'
        }
    ]

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

    const getLabelProcessing = (type: string): string => {
        let languages:string = ''
        if(i18n.language === Languages.ENUS){
            const processing = processingType?.find(item => item.processingNameEng === type)
            if(processing) languages = processing?.processingNameEng
        } else if(i18n.language === Languages.ZHCH){
            const processing = processingType?.find(item => item.processingNameEng === type)
            if(processing) languages = processing?.processingNameSchi
        } else {
            const processing = processingType?.find(item => item.processingNameEng === type)
            if(processing) languages = processing?.processingNameTchi
        }
        return languages
    }

    const getDataWeights = (type: fieldNameRecycables, length: number, response: any): number[] =>{
        const weights:number[]= [];
        if(!response) return weights
        const processing:any =  Object.values(response)
        
        for(let index=0; index<length; index++){
            const data:TypeRecycable = processing[index];
            if(data[type]){
                weights.push(Number(data[type]?.slice(0, -2)) ?? 0)
            } else {
                weights.push(0)
            }
        }
        
        return weights
    }

    const getDataWeightsUsingName = (type: fieldNameRecycables, length: number, response: any): number[] =>{
        const weights:number[]= [];
        if(!response) return weights
        const processing:any =  Object.values(response);
        for(let index=0; index<length; index++){
            const data:TypeRecycable = processing[index];
            if(data[type]){
                weights.push(Number(data[type]) ?? 0)
            } else {
                weights.push(0)
            }
        }
        return weights
    }

    const getDataSetBarChart = (response: any, length:number) :Dataset[] => {
        const datasets:Dataset[] = [];
        if(!recycType) return datasets
        for(let type of recycType){
            if(type.recyclableNameEng === TypeRecycables.RECHARGEABLE_BATTERIES){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.RECHARGEABLE_BATTERIES)
                })
            } else if(type.recyclableNameEng === TypeRecycables.GLASS_BOTTLES){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.GLASS_BOTTLES)
                })
            } else if(type.recyclableNameEng === TypeRecycables.PAPER){ 
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.PAPER)
                })
            } else if(type.recyclableNameEng === TypeRecycables.FLUORESCENT_LAMPS_AND_TUBES){ 
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.FLUORESCENT_LAMPS_AND_TUBES)
                })
            } else if(type.recyclableNameEng === TypeRecycables.SMALL_ELETRICAL_APPLIANCES){ 
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.SMALL_ELETRICAL_APPLIANCES)
                })
            } else if(type.recyclableNameEng === TypeRecycables.PLASTICS){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.PLASTICS)
                })
            } else if(type.recyclableNameEng === TypeRecycables.NON_RECYCLABLE){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.NON_RECYCLABLE)
                })
            } else if(type.recyclableNameEng === TypeRecycables.CARDBOARD){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.CARDBOARD)
                })
            }else if(type.recyclableNameEng === TypeRecycables.Metals){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.Metals)
                })
            }
        }
        return datasets
    }

    const getDataWeightsProcessing = (type: fieldNameProcssing, length: number, response: any): number[] =>{
        let weights:number[]= [];
        if(!response) return weights
        if(type === 'Total amount of recyclate processed'){
            weights = response.map((item: any) => {
                return Number(item?.processed.split('.').join("")) ?? 0
            })
        } else if(type === 'Total amount of recyclate remaining after processing'){
            weights = response.map((item: any) => {
                return Number(item?.processing.split('.').join("")) ?? 0
            })
        } else if(type === 'Total amount of recycled material that cannot be used after processing') {
            weights = response.map((item: any) => {
                return Number(item?.disposal.split('.').join("")) ?? 0
            })
        }
        
        return weights
    }

    const getDataSetProsessingBarChart = (response: any, length:number) :Dataset[] => {
        const datasets:Dataset[] = [];
        for(let type of processingType){

            if(type.processingNameEng === 'Total amount of recyclate processed'){
                datasets.push({
                    id: type.processingNameEng,
                    label: getLabelProcessing(type.processingNameEng),
                    data: getDataWeightsProcessing(type.processingNameEng, length, response),
                    backgroundColor: '#E2F592'
                })
            } else if(type.processingNameEng === 'Total amount of recyclate remaining after processing'){
                datasets.push({
                    id: type.processingNameEng,
                    label: getLabelProcessing(type.processingNameEng),
                    data: getDataWeightsProcessing(type.processingNameEng, length, response),
                    backgroundColor: '#5DCED6'
                })
            } else if(type.processingNameEng === 'Total amount of recycled material that cannot be used after processing'){
                datasets.push({
                    id: type.processingNameEng,
                    label: getLabelProcessing(type.processingNameEng),
                    data: getDataWeightsProcessing(type.processingNameEng, length, response),
                    backgroundColor: '#FCC9D3'
                })
            }
        }
        return datasets
    }

    const getDataSetLineChart = (response: any, length:number) :Dataset[] => {
        const datasets:Dataset[] = [];
        if(!recycType) return datasets
        for(let type of recycType){
            if(type.recyclableNameEng === TypeRecycables.RECHARGEABLE_BATTERIES){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeightsUsingName(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.RECHARGEABLE_BATTERIES),
                    yAxisID: 'y',
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 15
                })
            } else if(type.recyclableNameEng === TypeRecycables.GLASS_BOTTLES){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeightsUsingName(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.GLASS_BOTTLES),
                    yAxisID: 'y',
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 15
                })
            } else if(type.recyclableNameEng === TypeRecycables.PAPER){ 
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeightsUsingName(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.PAPER),
                    yAxisID: 'y',
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 15
                })
            } else if(type.recyclableNameEng === TypeRecycables.FLUORESCENT_LAMPS_AND_TUBES){ 
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeightsUsingName(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.FLUORESCENT_LAMPS_AND_TUBES),
                    yAxisID: 'y',
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 15
                })
            } else if(type.recyclableNameEng === TypeRecycables.SMALL_ELETRICAL_APPLIANCES){ 
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeightsUsingName(type.recyclableNameEng, length, response),
                    backgroundColor:  getBackgroundColor(TypeRecycables.SMALL_ELETRICAL_APPLIANCES),
                    yAxisID: 'y',
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 15
                })
            } else if(type.recyclableNameEng === TypeRecycables.PLASTICS){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeightsUsingName(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.PLASTICS),
                    yAxisID: 'y',
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 15
                })
            } else if(type.recyclableNameEng === TypeRecycables.NON_RECYCLABLE){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeightsUsingName(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.NON_RECYCLABLE),
                    yAxisID: 'y',
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 15
                })
            } else if(type.recyclableNameEng === TypeRecycables.CARDBOARD){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeightsUsingName(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.CARDBOARD),
                    yAxisID: 'y',
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 15
                })
            } else if(type.recyclableNameEng === TypeRecycables.Metals){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeightsUsingName(type.recyclableNameEng, length, response),
                    backgroundColor: getBackgroundColor(TypeRecycables.Metals),
                    yAxisID: 'y',
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 15
                })
            }
        }
        return datasets
    }

    const initWeightRecyclables = async () => {
        const response = await getWeightRecyclablesColPointDashboard(frmDateWeight.format('YYYY-MM-DD'), toDateWeight.format('YYYY-MM-DD'))
        if (response) {
            const labels:string[] = Object.keys(response);
            if(!recycType) return;
            const datasets = getDataSetBarChart(response, labels.length)
            setLabelWeigth(labels)
            setDataSetWeight(datasets)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            initWeightRecyclables()
        }, 1000);
    }, [frmDateWeight, toDateWeight])

    const initSalesProductAnalysis = async () => {
        const response = await getSalesProductAnalysis(frmDateWeight.format('YYYY-MM-DD'), toDateWeight.format('YYYY-MM-DD'));
        if (response) {
            let cache:any = {}
            const source:any = {}
            for(let product of response){
                const label = product.month + ' ' + product.year;
                const data:any = {}
                for(let [key, value] of Object.entries(product)){
                    if(!['year', 'month'].includes(key)){
                        if(cache[key]){
                            const name:string = cache[key];
                            data[name] = value
                        } else {
                            const type = recycType?.find(item => item.recycTypeId === key);
                            cache[key] = type?.recyclableNameEng;
                            const name:string = type?.recyclableNameEng || '';
                            if(name !== '')  data[name] = value
                           
                        }
                    }
                }
                source[label]= data 
            }
            const labels:string[] = Object.keys(source);
            if(!recycType) return;
            const datasets = getDataSetLineChart(source, labels.length)
            setLabelProduct(labels)
            setDataSetProduct(datasets)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            initSalesProductAnalysis()
        }, 1000);
    }, [frmDateProduct, toDateProduct])

    const getLangMonth = (value: monthSequence) :string => {
        const months = {
            0: t('dashboard_manufacturer.january'),
            1: t('dashboard_manufacturer.february'),
            2: t('dashboard_manufacturer.march'),
            3: t('dashboard_manufacturer.april'),
            4: t('dashboard_manufacturer.may'),
            5: t('dashboard_manufacturer.june'),
            6: t('dashboard_manufacturer.juli'),
            7: t('dashboard_manufacturer.august'),
            8: t('dashboard_manufacturer.september'),
            9: t('dashboard_manufacturer.october'),
            10: t('dashboard_manufacturer.november'),
            11: t('dashboard_manufacturer.december')
        }
        return months[value]
    }

    const initgetRecycProcessAnalysis = async () => {
        const response = await getRecycProcessAnalysis(frmDateProcessing.format('YYYY-MM-DD'), toDateProcessing.format('YYYY-MM-DD'))
        if (response) {
            const labels:{id: number, value: string}[] = response?.map((item:any) => {
                const index = indexMonths.indexOf(item.month) as monthSequence
                const month = getLangMonth(index)
                return{
                    id: index,
                    value: `${month} ${item.year}`
                }
            });
           
            // if(!recycType) return;
            const datasets = getDataSetProsessingBarChart(response, labels.length)
            setLabelProcessing(labels)
            setDataSetProcessing(datasets)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            initgetRecycProcessAnalysis()
        }, 1000);
    }, [frmDateProcessing, toDateProcessing])
    
    useEffect(() => {
        const changeLangWeight = datasetWeigth.map(item => {
            return{
                ...item,
                label: getLabel(item.id)
            }
        })
        setDataSetWeight(changeLangWeight)


        const changeLangProduct = datasetProduct.map(item => {
            return{
                ...item,
                label: getLabel(item.id)
            }
        })
        setDataSetProduct(changeLangProduct);

        const changeLangProcessing = datasetProcessing.map(item => {
            return{
                ...item,
                label: getLabelProcessing(item.id)
            }
        })

        const labels:{id: number, value: string}[] = labelProcessing?.map((item:any) => {
            const month = getLangMonth(item.id)
            return{
                id: item?.id,
                value: `${month} ${item?.value?.split(' ')[1]}`
            }
        })
        setLabelProcessing(labels)
        setDataSetProcessing(changeLangProcessing);

    }, [i18n.language])

  
    useEffect(() => {
        initWeightRecyclables()
        initSalesProductAnalysis()
        initgetRecycProcessAnalysis()
    }, [recycType])

    const onChangeColdId = (value: number | null) => {
        setColId(value)
    }
    
    return(
        <Box >
            <Typography style={{fontSize: '32px', fontWeight: '700', color: '#000000', marginBottom: '30px'}}>
                {t('dashboard_manufacturer.data')}
            </Typography>
            <Dashboard 
                key={t('dashboard_manufacturer.recycling_station')}
                labels={labelWeight}
                dataset={datasetWeigth}
                onChangeFromDate={setFrmDateWeight}
                onChangeToDate={setToDateWeigth}
                frmDate={frmDateWeight}
                toDate={toDateWeight}
                onChangeColdId={onChangeColdId}
                colId={colId}
                title={t('dashboard_manufacturer.recycling_station')}
                typeChart="bar"
            />

            <Dashboard 
                key={t('dashboard_manufacturer.recycled_product')}
                labels={labelProduct}
                dataset={datasetProduct}
                onChangeFromDate={setFrmDateProduct}
                onChangeToDate={setToDateProduct}
                frmDate={frmDateProduct}
                toDate={toDateProduct}
                onChangeColdId={onChangeColdId}
                colId={colId}
                title={t('dashboard_manufacturer.recycled_product')}
                typeChart="line"
                canvasColor="#F4F4F4"
            />

            <Dashboard 
                key={t('dashboard_manufacturer.recycling_processing_types')}
                labels={labelProcessing.map(item => item.value)}
                dataset={datasetProcessing}
                onChangeFromDate={setFrmDateProcessing}
                onChangeToDate={setToDateProcessing}
                frmDate={frmDateProcessing}
                toDate={toDateProcessing}
                onChangeColdId={onChangeColdId}
                colId={colId}
                title={t('dashboard_manufacturer.recycling_processing_types')} 
                typeChart="bar"
            />

            <ChartTotalSales/>
            <ChartDistrictSales />
        </Box>
    )
};

export default Recyclables