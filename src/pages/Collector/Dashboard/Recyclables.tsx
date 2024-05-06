import { FunctionComponent, useEffect, useState } from "react";
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next'
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import { getcolPointRecyclablesDashboard } from "../../../APICalls/Collector/dashboardRecyables";
import dayjs from "dayjs";
import { Languages } from "../../../constants/constant";
import i18n from "../../../setups/i18n";
import Dashboard from "../../../components/Dashboard/Dashboard";

interface Dataset{
    id: string,
    label: string,
    data: number[],
    backgroundColor: string
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
    const { t } = useTranslation()
    const { recycType } =useContainer(CommonTypeContainer);
    const [labels, setLabels] = useState<string[]>([]);
    const [frmDate, setFrmDate] = useState<dayjs.Dayjs>(dayjs().startOf('month'))
    const [toDate, setToDate] = useState<dayjs.Dayjs>(dayjs())
    const [dataset, setDataSet] = useState<Dataset[]>([])
    
    useEffect(() => {
        const changeLang = dataset.map(item => {
            return{
                ...item,
                label: getLabel(item.id)
            }
        })
        setDataSet(changeLang)
    }, [i18n.language])

    
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

    const getRecyclablesDashboard = async () => {
        const response = await getcolPointRecyclablesDashboard(frmDate.format('YYYY-MM-DD'), toDate.format('YYYY-MM-DD'));

        const getDataWeights = (type: fieldName, length: number): number[] =>{
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
        
        if(response){
            const labels:string[] = Object.keys(response.data);

            const datasets:Dataset[] = []
            if(!recycType) return;

            for(let type of recycType){
                if(type.recyclableNameEng === 'Rechargeable Batteries'){
                    datasets.push({
                        id: type.recyclableNameEng,
                        label: getLabel(type.recyclableNameEng),
                        data: getDataWeights(type.recyclableNameEng, labels.length),
                        backgroundColor: '#EFE72F'
                    })
                } else if(type.recyclableNameEng === 'Glass Bottles'){
                    datasets.push({
                        id: type.recyclableNameEng,
                        label: getLabel(type.recyclableNameEng),
                        data: getDataWeights(type.recyclableNameEng, labels.length),
                        backgroundColor: '#4FB5F5'
                    })
                } else if(type.recyclableNameEng === 'Paper'){ 
                    datasets.push({
                        id: type.recyclableNameEng,
                        label: getLabel(type.recyclableNameEng),
                        data: getDataWeights(type.recyclableNameEng, labels.length),
                        backgroundColor: '#7ADFF1'
                    })
                } else if(type.recyclableNameEng === 'Fluorescent Lamps and Tubes'){ 
                    datasets.push({
                        id: type.recyclableNameEng,
                        label: getLabel(type.recyclableNameEng),
                        data: getDataWeights(type.recyclableNameEng, labels.length),
                        backgroundColor: '#ECAB05'
                    })
                } else if(type.recyclableNameEng === 'Small Electrical Appliances'){ 
                    datasets.push({
                        id: type.recyclableNameEng,
                        label: getLabel(type.recyclableNameEng),
                        data: getDataWeights(type.recyclableNameEng, labels.length),
                        backgroundColor: '#5AE9D8'
                    })
                } else if(type.recyclableNameEng === 'Plastics'){
                    datasets.push({
                        id: type.recyclableNameEng,
                        label: getLabel(type.recyclableNameEng),
                        data: getDataWeights(type.recyclableNameEng, labels.length),
                        backgroundColor: '#FF9FB7'
                    })
                } else if(type.recyclableNameEng === 'Non-recyclable'){
                    datasets.push({
                        id: type.recyclableNameEng,
                        label: getLabel(type.recyclableNameEng),
                        data: getDataWeights(type.recyclableNameEng, labels.length),
                        backgroundColor: '#F9B8FF'
                    })
                } else if(type.recyclableNameEng === 'Cardboard'){
                    datasets.push({
                        id: type.recyclableNameEng,
                        label: getLabel(type.recyclableNameEng),
                        data: getDataWeights(type.recyclableNameEng, labels.length),
                        backgroundColor: '#C69AFF'
                    })
                }
            }

            setLabels(labels)
            setDataSet(datasets)
        }
    }
  
    useEffect(() => {
        getRecyclablesDashboard()
    }, [recycType])

    const onHandleSearch = () => {
        getRecyclablesDashboard()
    }

    return(
        <Box >
            <Dashboard 
                labels={labels}
                dataset={dataset}
                onChangeFromDate={setFrmDate}
                onChangeToDate={setToDate}
                onHandleSearch={onHandleSearch}
                frmDate={frmDate}
                toDate={toDate}
                title={t('dashboard_recyclables.recycling_data')}
            />
        </Box>
    )
};

export default Recyclables