import  { useEffect, useState } from 'react'
import { useContainer } from "unstated-next";
import CommonTypeContainer from '../../../contexts/CommonTypeContainer';
import dayjs from 'dayjs';
import i18n from '../../../setups/i18n';
import { Languages, STATUS_CODE, indexMonths, monthSequence } from '../../../constants/constant';
import { getSalesProductAnalysis} from '../../../APICalls/Collector/dashboardRecyables';
import { extractError, randomBackgroundColor } from '../../../utils/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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

const useSalesProductAnalysis = () => {
   const { recycType } =useContainer(CommonTypeContainer);
   const {t} =  useTranslation()
   const [labelProduct, setLabelProduct] = useState<{id: number, value: string}[]>([]);
   const [datasetProduct, setDataSetProduct] = useState<Dataset[]>([]);
   const [frmDateProduct, setFrmDateProduct] = useState<dayjs.Dayjs>(dayjs().subtract(6, 'month'))
   const [toDateProduct, setToDateProduct] = useState<dayjs.Dayjs>(dayjs())
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

  const getDataWeightsUsingName = (type: string, length: number, response: any): number[] =>{
   const weights:number[]= [];
   if(!response) return weights
   const processing:any =  Object.values(response);
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

  const getDataSetLineChart = (response: any, length:number) :Dataset[] => {
      const datasets:Dataset[] = [];
      if(!recycType) return datasets
      for(let type of recycType){
         datasets.push({
            id: type.recyclableNameEng,
            label: getLabel(type.recyclableNameEng),
            data: getDataWeightsUsingName(type.recyclableNameEng, length, response),
            backgroundColor: type?.backgroundColor ? type.backgroundColor : randomBackgroundColor(),
            yAxisID: 'y',
            pointStyle: 'circle',
            pointRadius: 8,
            pointHoverRadius: 15
         })
      }
      return datasets
   }

   const sortingBasedOnMonth = (array: any[]) => {
      const length = array.length;
   
      for(let i = 0; i < length; i++){
            // set current index as minimum
            let min = i;
            let temp = array[i];
   
            for(let j = i+1; j < length; j++){
               if (array[j].index < array[min].index){
                  //update minimum if current is lower that what we had previously
                  min = j;
               }
            };
   
            array[i] = array[min];
            array[min] = temp;
      };
      return array;
   };

   const sortingBasedOnYear = (array: any[]) => {
      const length = array.length;
   
      for(let i = 0; i < length; i++){
            // set current index as minimum
            let min = i;
            let temp = array[i];
   
            for(let j = i+1; j < length; j++){
               if (Number(array[j].year) < (array[min].year)){
                  //update minimum if current is lower that what we had previously
                  min = j;
               }
            };
   
            array[i] = array[min];
            array[min] = temp;
      };

      return array;
   };

   const initSalesProductAnalysis = async () => {
     try {
      const response = await getSalesProductAnalysis(frmDateProduct.format('YYYY-MM-DD'), toDateProduct.format('YYYY-MM-DD'));
      if (response) {
            // sort data by year
            let sortByYear:any[] = sortingBasedOnYear(response)

            let cache:any = {}
            const source:any = {}

            // sort data by month
            for(let product of sortByYear){
               const year= Number(product.year);
               if(year in source){
                  let data = source[year];
                  const currentIndex = indexMonths.indexOf(product.month) as monthSequence
                  data = [{index: currentIndex, ...product}, ...data]
                  data = sortingBasedOnMonth(data)
                  
                  source[year] = data;
               } else {
                  const currentIndex = indexMonths.indexOf(product.month) as monthSequence
                  source[year] = [{index: currentIndex, ...product}]
               }
            }
            
            let allData:any = {}
            for(let item of Object.values(source).flatMap(item => item)) {
               const product:any = item
               const label = product?.month + ' ' + product?.year;
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
                  allData[label] = data
               }
  
            }

            // define label 
            const labels = Object.keys(allData).map(item => {
               const currentMonth = item.split(' ')[0];
               const currentYear = item.split(' ')[1]
               const index = indexMonths.indexOf(currentMonth) as monthSequence
               const month = getLangMonth(index)
               return{
                  id: index,
                  value: `${month} ${currentYear}`
               }
            })
            if(!recycType) return;
            const datasets = getDataSetLineChart(allData, labels.length)
            setLabelProduct(labels)
            setDataSetProduct(datasets)
      }
     } catch (error:any) {
      const { state, realm } = extractError(error);
      if(state.code === STATUS_CODE[503] ){
         navigate('/maintenace')
      }
     }
   }

   useEffect(() => {
      setTimeout(() => {
         initSalesProductAnalysis()
      }, 1000);
   }, [frmDateProduct, toDateProduct, recycType])


   useEffect(() => {
      const changeLangProduct = datasetProduct.map(item => {
         return{
             ...item,
             label: getLabel(item.id)
         }
      })

     const labelsProduct:{id: number, value: string}[] = labelProduct?.map((item:any) => {
         const month = getLangMonth(item.id)
         return{
             id: item?.id,
             value: `${month} ${item?.value?.split(' ')[1]}`
         }
     })
     
     setDataSetProduct(changeLangProduct);
     setLabelProduct(labelsProduct)
   }, [i18n.language])
  
  return {
   labelProduct,
   datasetProduct,
   frmDateProduct,
   toDateProduct,
   setFrmDateProduct,
   setToDateProduct
  };
}

export default useSalesProductAnalysis