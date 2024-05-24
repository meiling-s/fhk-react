import  { useEffect, useState } from 'react'
import { useContainer } from "unstated-next";
import CommonTypeContainer from '../../../contexts/CommonTypeContainer';
import dayjs from 'dayjs';
import i18n from '../../../setups/i18n';
import { Languages, STATUS_CODE } from '../../../constants/constant';
import { extractError, randomBackgroundColor } from '../../../utils/utils';
import { getWeightRecyclablesColPointDashboard } from '../../../APICalls/Collector/dashboardRecyables';
import { useNavigate } from 'react-router-dom';

interface Dataset{
   id: string,
   label: string,
   data: number[],
   backgroundColor: string
}

const useWeightDashboardWithIdRecycable = () => {
   const { recycType } =useContainer(CommonTypeContainer);
   const [labels, setLabels] = useState<string[]>([]);
   const [frmDate, setFrmDate] = useState<dayjs.Dayjs>(dayjs().startOf('month'))
   const [toDate, setToDate] = useState<dayjs.Dayjs>(dayjs())
   const [dataset, setDataSet] = useState<Dataset[]>([])
   const [colId, setColId] = useState<number | null>(null);
   const [companyNumber, setCompanyNumber] = useState<string | null>(null)
   const navigate = useNavigate();

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

   useEffect(() => {
      const changeLang = dataset.map(item => {
          return{
              ...item,
              label: getLabel(item.id)
          }
      })
      setDataSet(changeLang)
   }, [i18n.language]);

   const getDataWeights = (type: string, length: number, response: any): number[] =>{
      const weights:number[]= [];
      if(!response) return weights
      const processing:any =  Object.values(response)
      for(let index=0; index<length; index++){
          const data:any = processing[index];
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
          datasets.push({
              id: type.recyclableNameEng,
              label: getLabel(type.recyclableNameEng),
              data: getDataWeights(type.recycTypeId, length, response),
              backgroundColor: type?.backgroundColor ? type.backgroundColor : randomBackgroundColor()
          })
      }
      return datasets
  }
   
   const getRecyclablesDashboard = async () => {
     try {
      const response = await getWeightRecyclablesColPointDashboard(frmDate.format('YYYY-MM-DD'), toDate.format('YYYY-MM-DD'))
      if (response) {
          const labels:string[] = Object.keys(response);
          if(!recycType) return;
          const datasets = getDataSetBarChart(response, labels.length)
          setLabels(labels)
          setDataSet(datasets)
      }
     } catch (error) {
      const { state, realm} =  extractError(error);
      if(state.code === STATUS_CODE[503]){
         navigate('/maintenace')
      }
     }
   }

    useEffect(() => {
      getRecyclablesDashboard()
   }, [recycType, frmDate, toDate, colId, companyNumber])

   const onChangeColdId = (value: number | null) => {
      setColId(value)
   }

   const onHandleSearch = () => {
      getRecyclablesDashboard()
   }

   const onChangeCompanyNumber = (value: string | null) => {
      setCompanyNumber(value)
   }
  
  return {
   onChangeColdId,
   onChangeCompanyNumber,
   setFrmDate,
   setToDate,
   onHandleSearch,
   frmDate,
   toDate,
   labels,
   dataset,
  };
}

export default useWeightDashboardWithIdRecycable