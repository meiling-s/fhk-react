import { FunctionComponent, useEffect, useState } from "react";
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next'
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import { getcolPointRecyclablesDashboard, getWeightRecyclablesColPointDashboard } from "../../../APICalls/Collector/dashboardRecyables";
import dayjs from "dayjs";
import { Languages } from "../../../constants/constant";
import i18n from "../../../setups/i18n";
import Dashboard from "../../../components/Dashboard/Chart";
import { getCollectionPoint } from "../../../APICalls/Collector/collectionPointManage";
import { collectionPoint } from '../../../interfaces/collectionPoint'
import ChartCustomer from "../../../components/Dashboard/ChartCustomer";
import ChartRegion from "../../../components/Dashboard/ChartRegion";

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
};

type fieldName = 'Rechargeable Batteries' | 'Glass Bottles' | 'Paper' | 'Fluorescent Lamps and Tubes' | 'Small Electrical Appliances'| 'Plastics' | 'Non-recyclable' | 'Cardboard';
const Recyclables: FunctionComponent = () => {
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
    const { t } = useTranslation()
    const { recycType } =useContainer(CommonTypeContainer);
    const [labelWeight, setLabelWeigth] = useState<string[]>([]);
    const [datasetWeigth, setDataSetWeight] = useState<Dataset[]>([]);
    const [labelProcessing, setLabelProcessing] = useState<string[]>(['January', 'February', 'Maret','April','Mei','Juni','Juli','Agust','September','October','November','December']);
    const [datasetProcessing, setDataSetProcessing] = useState<Dataset[]>([
        // {
        //     id: 'Rechargeable Batteries',
        //     label: getLabel('Rechargeable Batteries'),
        //     data:[10, 40, 90, 20, 50, 230, 90, 69, 12, 456, 345, 100],
        //     borderColor: '#EFE72F',
        //     backgroundColor: '#EFE72F',
        //     yAxisID: 'y',
        //     pointStyle: 'circle',
        //     pointRadius: 8,
        //     pointHoverRadius: 15
        // },
        // {
        //     id: 'Glass Bottles',
        //     label: getLabel('Glass Bottles'),
        //     data:[100, 200, 45, 490, 50, 123, 45, 345, 123, 444, 234, 100],
        //     borderColor: '#4FB5F5',
        //     backgroundColor: '#4FB5F5',
        //     yAxisID: 'y',
        //     pointStyle: 'circle',
        //     pointRadius: 8,
        //     pointHoverRadius: 15
        // },
        // {
        //     id: 'Paper',
        //     label: getLabel('Paper'),
        //     data:[45, 300, 22, 124, 231, 111, 90, 121, 150, 234, 222, 980, 200],
        //     borderColor: '#7ADFF1',
        //     backgroundColor: '#7ADFF1',
        //     yAxisID: 'y',
        //     pointStyle: 'circle',
        //     pointRadius: 8,
        //     pointHoverRadius: 15
        // },
        // {
        //     id: 'Fluorescent Lamps and Tubes',
        //     label: getLabel('Fluorescent Lamps and Tubes'),
        //     data:[20, 50, 100, 200, 500, 450, 100, 500, 890, 345, 225, 800],
        //     borderColor: '#ECAB05',
        //     backgroundColor: '#ECAB05',
        //     yAxisID: 'y',
        //     pointStyle: 'circle',
        //     pointRadius: 8,
        //     pointHoverRadius: 15
        // },
        // {
        //     id: 'Small Electrical Appliances',
        //     label: getLabel('Small Electrical Appliances'),
        //     data:[1, 120, 80, 300, 500, 1000, 450, 234, 100, 400, 200, 500],
        //     borderColor: '#5AE9D8',
        //     backgroundColor: '#5AE9D8',
        //     yAxisID: 'y',
        //     pointStyle: 'circle',
        //     pointRadius: 8,
        //     pointHoverRadius: 15
        // },
        // {
        //     id: 'Plastics',
        //     label: getLabel('Plastics'),
        //     data:[23, 100, 220, 150, 289, 150, 190, 200, 100, 200, 250, 450, 300],
        //     borderColor: '#FF9FB7',
        //     backgroundColor: '#FF9FB7',
        //     yAxisID: 'y',
        //     pointStyle: 'circle',
        //     pointRadius: 8,
        //     pointHoverRadius: 15
        // },
        // {
        //     id: 'Non-recyclable',
        //     label:getLabel('Non-recyclable'),
        //     data:[30, 50, 100, 80, 90, 300, 450, 300, 120, 450, 500, 120],
        //     borderColor: '#F9B8FF',
        //     backgroundColor: '#F9B8FF',
        //     yAxisID: 'y',
        //     pointStyle: 'circle',
        //     pointRadius: 8,
        //     pointHoverRadius: 15
        // },
        // {
        //     id: 'Cardboard',
        //     label: getLabel('Cardboard'),
        //     data:[10, 30, 45, 900, 20, 100, 90, 90, 40, 345, 123, 1000],
        //     borderColor: '#C69AFF',
        //     backgroundColor: '#C69AFF',
        //     yAxisID: 'y',
        //     pointStyle: 'circle',
        //     pointRadius: 8,
        //     pointHoverRadius: 15
        // },
    ]);
    const [labelProduct, setLabelProduct] = useState<string[]>([]);
    const [datasetProduct, setDataSetProduct] = useState<Dataset[]>([]);
    const [frmDateWeight, setFrmDateWeight] = useState<dayjs.Dayjs>(dayjs().startOf('month'))
    const [toDateWeight, setToDateWeigth] = useState<dayjs.Dayjs>(dayjs())
    const [frmDateProcessing, setFrmDateProcessing] = useState<dayjs.Dayjs>(dayjs().startOf('month'))
    const [toDateProcessing, setToDateProcessing] = useState<dayjs.Dayjs>(dayjs())
    const [frmDateProduct, setFrmDateProduct] = useState<dayjs.Dayjs>(dayjs().startOf('month'))
    const [toDateProduct, setToDateProduct] = useState<dayjs.Dayjs>(dayjs())
    const [colId, setColId] = useState<number | null>(null)

  

    const getDataWeights = (type: fieldName, length: number, response: any): number[] =>{
        const weights:number[]= [];
        if(!response) return weights
        const recyclables:any =  Object.values(response.data)
        
        for(let index=0; index<length; index++){
            const data:TypeRecycable = recyclables[index];
            if(data[type]){
                weights.push(Number(data[type]?.slice(0, -2)) ?? 0)
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
            if(type.recyclableNameEng === 'Rechargeable Batteries'){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: '#EFE72F'
                })
            } else if(type.recyclableNameEng === 'Glass Bottles'){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: '#4FB5F5'
                })
            } else if(type.recyclableNameEng === 'Paper'){ 
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: '#7ADFF1'
                })
            } else if(type.recyclableNameEng === 'Fluorescent Lamps and Tubes'){ 
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: '#ECAB05'
                })
            } else if(type.recyclableNameEng === 'Small Electrical Appliances'){ 
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: '#5AE9D8'
                })
            } else if(type.recyclableNameEng === 'Plastics'){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: '#FF9FB7'
                })
            } else if(type.recyclableNameEng === 'Non-recyclable'){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: '#F9B8FF'
                })
            } else if(type.recyclableNameEng === 'Cardboard'){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: getDataWeights(type.recyclableNameEng, length, response),
                    backgroundColor: '#C69AFF'
                })
            }
        }
        return datasets
    }

    const getDataSetLineChart = (response: any, length:number) :Dataset[] => {
        const datasets:Dataset[] = [];
        if(!recycType) return datasets
        for(let type of recycType){
            if(type.recyclableNameEng === 'Rechargeable Batteries'){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: [10, 40, 90, 20, 50, 230, 90, 69, 12, 456, 345, 100],
                    backgroundColor: '#EFE72F',
                    yAxisID: 'y',
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 15
                })
            } else if(type.recyclableNameEng === 'Glass Bottles'){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data: [100, 200, 45, 490, 50, 123, 45, 345, 123, 444, 234, 100],
                    backgroundColor: '#4FB5F5',
                    yAxisID: 'y',
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 15
                })
            } else if(type.recyclableNameEng === 'Paper'){ 
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data:[45, 300, 22, 124, 231, 111, 90, 121, 150, 234, 222, 980, 200],
                    backgroundColor: '#7ADFF1',
                    yAxisID: 'y',
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 15
                })
            } else if(type.recyclableNameEng === 'Fluorescent Lamps and Tubes'){ 
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data:[20, 50, 100, 200, 500, 450, 100, 500, 890, 345, 225, 800],
                    backgroundColor: '#ECAB05',
                    yAxisID: 'y',
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 15
                })
            } else if(type.recyclableNameEng === 'Small Electrical Appliances'){ 
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data:[1, 120, 80, 300, 500, 1000, 450, 234, 100, 400, 200, 500],
                    backgroundColor: '#5AE9D8',
                    yAxisID: 'y',
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 15
                })
            } else if(type.recyclableNameEng === 'Plastics'){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data:[23, 100, 220, 150, 289, 150, 190, 200, 100, 200, 250, 450, 300],
                    backgroundColor: '#FF9FB7',
                    yAxisID: 'y',
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 15
                })
            } else if(type.recyclableNameEng === 'Non-recyclable'){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data:[30, 50, 100, 80, 90, 300, 450, 300, 120, 450, 500, 120],
                    backgroundColor: '#F9B8FF',
                    yAxisID: 'y',
                    pointStyle: 'circle',
                    pointRadius: 8,
                    pointHoverRadius: 15
                })
            } else if(type.recyclableNameEng === 'Cardboard'){
                datasets.push({
                    id: type.recyclableNameEng,
                    label: getLabel(type.recyclableNameEng),
                    data:[10, 30, 45, 900, 20, 100, 90, 90, 40, 345, 123, 1000],
                    backgroundColor: '#C69AFF',
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
            const labels:string[] = Object.keys(response.data);
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

    const initProcessingtRecyclables = async () => {
        const response = await getWeightRecyclablesColPointDashboard(frmDateWeight.format('YYYY-MM-DD'), toDateWeight.format('YYYY-MM-DD'))
        if (response) {
            const labels:string[] = Object.keys(response.data);
            if(!recycType) return;
            const datasets = getDataSetLineChart(response, labels.length)
            // setLabelProcessing(labels)
            setDataSetProcessing(datasets)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            initProcessingtRecyclables()
        }, 1000);
    }, [frmDateProcessing, toDateProcessing])


    const initProductRecyclables = async () => {
        const response = await getWeightRecyclablesColPointDashboard(frmDateWeight.format('YYYY-MM-DD'), toDateWeight.format('YYYY-MM-DD'))
        if (response) {
            const labels:string[] = Object.keys(response.data);
            if(!recycType) return;
            const datasets = getDataSetBarChart(response, labels.length)
            setLabelProduct(labels)
            setDataSetProduct(datasets)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            initProductRecyclables()
        }, 1000);
    }, [frmDateProduct, toDateProduct])
    
    useEffect(() => {
        const changeLangWeight = datasetWeigth.map(item => {
            return{
                ...item,
                label: getLabel(item.id)
            }
        })
        setDataSetWeight(changeLangWeight)

        const changeLangProcessing = datasetProcessing.map(item => {
            return{
                ...item,
                label: getLabel(item.id)
            }
        })
        setDataSetProcessing(changeLangProcessing)
    }, [i18n.language])

  
    useEffect(() => {
        initWeightRecyclables()
        initProcessingtRecyclables()
        initProductRecyclables()
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
                labels={labelProcessing}
                dataset={datasetProcessing}
                onChangeFromDate={setFrmDateProcessing}
                onChangeToDate={setToDateProcessing}
                frmDate={frmDateProcessing}
                toDate={toDateProcessing}
                onChangeColdId={onChangeColdId}
                colId={colId}
                title={t('dashboard_manufacturer.recycling_processing_types')}
                typeChart="line"
            />

            <Dashboard 
                labels={labelProduct}
                dataset={datasetProduct}
                onChangeFromDate={setFrmDateProduct}
                onChangeToDate={setToDateProduct}
                frmDate={frmDateProduct}
                toDate={toDateProduct}
                onChangeColdId={onChangeColdId}
                colId={colId}
                title={t('dashboard_manufacturer.recycled_product')}
                typeChart="bar"
            />

            <ChartCustomer/>
            <ChartRegion />
        </Box>
    )
};

export default Recyclables