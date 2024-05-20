import  { useEffect, useState } from 'react'
import { useContainer } from "unstated-next";
import CommonTypeContainer from '../contexts/CommonTypeContainer';
import dayjs from 'dayjs';
import i18n from '../setups/i18n';
import { Languages, indexMonths, monthSequence } from '../constants/constant';
import { getRecycProcessAnalysis} from '../APICalls/Collector/dashboardRecyables';
import { useTranslation } from 'react-i18next';

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
  
type fieldNameProcssing = 'Total amount of recyclate processed' | 'Total amount of recyclate remaining after processing' | 'Total amount of recycled material that cannot be used after processing';

const useWeightProcessing = () => {
   const { recycType } =useContainer(CommonTypeContainer);
   const {t} =  useTranslation()
   const [labelProcessing, setLabelProcessing] = useState<{id: number, value: string}[]>([]);
   const [datasetProcessing, setDataSetProcessing] = useState<Dataset[]>([]);
   const [frmDateProcessing, setFrmDateProcessing] = useState<dayjs.Dayjs>(dayjs().subtract(6, 'month'))
   const [toDateProcessing, setToDateProcessing] = useState<dayjs.Dayjs>(dayjs())

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
         
          const datasets = getDataSetProsessingBarChart(response, labels.length)
          setLabelProcessing(labels)
          setDataSetProcessing(datasets)
      }
  }

  useEffect(() => {
      setTimeout(() => {
          initgetRecycProcessAnalysis()
      }, 1000);
  }, [frmDateProcessing, toDateProcessing, recycType])
  
  useEffect(() => {
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
  
  return {
   labelProcessing,
   datasetProcessing,
   frmDateProcessing,
   toDateProcessing,
   setFrmDateProcessing,
   setToDateProcessing
  };
}

export default useWeightProcessing