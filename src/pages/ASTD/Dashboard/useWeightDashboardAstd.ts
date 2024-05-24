import  { useEffect, useState } from 'react'
import { useContainer } from "unstated-next";
import dayjs from 'dayjs';
import CommonTypeContainer from '../../../contexts/CommonTypeContainer';
import { Languages, STATUS_CODE } from '../../../constants/constant';
import { randomBackgroundColor } from '../../../utils/utils';
import { getWeightRecyclablesColPointAstd } from '../../../APICalls/Collector/dashboardRecyables';
import i18n from '../../../setups/i18n';

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
   const [tenantId, setTenandId] = useState<string>('');
   const [errorMessage, setErrorMessage] = useState<string>('')

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
      if(tenantId !== '' && !tenantId) return
      const response = await getWeightRecyclablesColPointAstd(tenantId, frmDate.format('YYYY-MM-DD'), toDate.format('YYYY-MM-DD'))
   
      if (response.status === STATUS_CODE[200]) {
          const labels:string[] = Object.keys(response?.data);
          if(!recycType) return;
          const datasets = getDataSetBarChart(response?.data, labels.length)
          setLabels(labels)
          setDataSet(datasets)
          setErrorMessage('')
      } else if(response?.response?.status === STATUS_CODE[400]){
         setErrorMessage(response?.response?.data?.message || '')
         setDataSet([])
         setLabels([])
      }
   }

    useEffect(() => {
      if(tenantId !== '') {
         setTimeout(() => {
            getRecyclablesDashboard()
         }, 1000);
      } else {
         setErrorMessage('')
         setDataSet([])
         setLabels([])
      }
   }, [recycType, frmDate, toDate, tenantId])

   const onChangeTenandId = (value: string) => {
      setTenandId(value)
   }

   const onHandleSearch = () => {
      if(tenantId !== '') {
         setTimeout(() => {
            getRecyclablesDashboard()
         }, 1000);
      }else {
         setDataSet([])
         setLabels([])
      }
   }

  return {
   onChangeTenandId,
   setFrmDate,
   setToDate,
   onHandleSearch,
   frmDate,
   toDate,
   labels,
   dataset,
   tenantId,
   errorMessage
  };
}

export default useWeightDashboardWithIdRecycable