import { FunctionComponent, useEffect, useState } from "react";
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next'
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import { getcolPointRecyclablesDashboard } from "../../../APICalls/Collector/dashboardRecyables";
import dayjs from "dayjs";
import { Languages } from "../../../constants/constant";
import i18n from "../../../setups/i18n";
import Dashboard from "../../../components/Dashboard/Chart";
import { getCollectionPoint } from "../../../APICalls/Collector/collectionPointManage";
import { collectionPoint } from '../../../interfaces/collectionPoint'
import { TypeRecycables, fieldNameRecycables } from '../../../constants/constant'
import { getBackgroundColor } from "../../../utils/utils";

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

// type fieldName = 'Rechargeable Batteries' | 'Glass Bottles' | 'Paper' | 'Fluorescent Lamps and Tubes' | 'Small Electrical Appliances'| 'Plastics' | 'Non-recyclable' | 'Cardboard';
const Recyclables: FunctionComponent = () => {
    const { t } = useTranslation()
    const { recycType } =useContainer(CommonTypeContainer);
    const [labels, setLabels] = useState<string[]>([]);
    const [frmDate, setFrmDate] = useState<dayjs.Dayjs>(dayjs().startOf('month'))
    const [toDate, setToDate] = useState<dayjs.Dayjs>(dayjs())
    const [dataset, setDataSet] = useState<Dataset[]>([])
    const [collectionIds, setCollectionIds] = useState<number[]>([])
    const [colId, setColId] = useState<number | null>(null)
    
    useEffect(() => {
        initCollectionPoint()
    }, [])

    const initCollectionPoint = async () => {
        const result = await getCollectionPoint(0, 1000)
        const data = result?.data.content
        
        if (data && data.length > 0) {
          const collectionPoint: number[] = []
          data.map((item: collectionPoint) => {
            if(item?.colId) collectionPoint.push(Number(item?.colId))
          })
    
          setCollectionIds(collectionPoint)
        }
      }
    
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
        const response = await getcolPointRecyclablesDashboard(frmDate.format('YYYY-MM-DD'), toDate.format('YYYY-MM-DD'), colId);

        const getDataWeights = (type: fieldNameRecycables, length: number): number[] =>{
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
                if(type.recyclableNameEng === TypeRecycables.RECHARGEABLE_BATTERIES){
                    datasets.push({
                        id: type.recyclableNameEng,
                        label: getLabel(type.recyclableNameEng),
                        data: getDataWeights(type.recyclableNameEng, labels.length),
                        backgroundColor: getBackgroundColor(TypeRecycables.RECHARGEABLE_BATTERIES)
                    })
                } else if(type.recyclableNameEng === TypeRecycables.GLASS_BOTTLES){
                    datasets.push({
                        id: type.recyclableNameEng,
                        label: getLabel(type.recyclableNameEng),
                        data: getDataWeights(type.recyclableNameEng, labels.length),
                        backgroundColor: getBackgroundColor(TypeRecycables.GLASS_BOTTLES)
                    })
                } else if(type.recyclableNameEng === TypeRecycables.PAPER){ 
                    datasets.push({
                        id: type.recyclableNameEng,
                        label: getLabel(type.recyclableNameEng),
                        data: getDataWeights(type.recyclableNameEng, labels.length),
                        backgroundColor: getBackgroundColor(TypeRecycables.PAPER)
                    })
                } else if(type.recyclableNameEng === TypeRecycables.FLUORESCENT_LAMPS_AND_TUBES){ 
                    datasets.push({
                        id: type.recyclableNameEng,
                        label: getLabel(type.recyclableNameEng),
                        data: getDataWeights(type.recyclableNameEng, labels.length),
                        backgroundColor: getBackgroundColor(TypeRecycables.FLUORESCENT_LAMPS_AND_TUBES)
                    })
                } else if(type.recyclableNameEng === TypeRecycables.SMALL_ELETRICAL_APPLIANCES){ 
                    datasets.push({
                        id: type.recyclableNameEng,
                        label: getLabel(type.recyclableNameEng),
                        data: getDataWeights(type.recyclableNameEng, labels.length),
                        backgroundColor: getBackgroundColor(TypeRecycables.SMALL_ELETRICAL_APPLIANCES)
                    })
                } else if(type.recyclableNameEng === TypeRecycables.PLASTICS){
                    datasets.push({
                        id: type.recyclableNameEng,
                        label: getLabel(type.recyclableNameEng),
                        data: getDataWeights(type.recyclableNameEng, labels.length),
                        backgroundColor: getBackgroundColor(TypeRecycables.PLASTICS)
                    })
                } else if(type.recyclableNameEng === TypeRecycables.NON_RECYCLABLE){
                    datasets.push({
                        id: type.recyclableNameEng,
                        label: getLabel(type.recyclableNameEng),
                        data: getDataWeights(type.recyclableNameEng, labels.length),
                        backgroundColor: getBackgroundColor(TypeRecycables.NON_RECYCLABLE)
                    })
                } else if(type.recyclableNameEng === TypeRecycables.CARDBOARD){
                    datasets.push({
                        id: type.recyclableNameEng,
                        label: getLabel(type.recyclableNameEng),
                        data: getDataWeights(type.recyclableNameEng, labels.length),
                        backgroundColor: getBackgroundColor(TypeRecycables.CARDBOARD)
                    })
                }
            }

            setLabels(labels)
            setDataSet(datasets)
        }
    }
  
    useEffect(() => {
        getRecyclablesDashboard()
    }, [recycType, frmDate, toDate, colId])

    const onHandleSearch = () => {
        getRecyclablesDashboard()
    }
    const onChangeColdId = (value: number | null) => {
        setColId(value)
    }

    return(
        <Box >
            <Typography style={{fontSize: '32px', fontWeight: '700', color: '#000000', marginBottom: '30px'}}>
                {t('dashboard_recyclables.recycling_data')}
            </Typography>
            <Dashboard 
                labels={labels}
                dataset={dataset}
                onChangeFromDate={setFrmDate}
                onChangeToDate={setToDate}
                onHandleSearch={onHandleSearch}
                frmDate={frmDate}
                toDate={toDate}
                collectionIds={collectionIds}
                onChangeColdId={onChangeColdId}
                colId={colId}
                title={t('dashboard_recyclables.recycling_data')}
                typeChart="bar"
            />
        </Box>
    )
};

export default Recyclables