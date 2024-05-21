import { FunctionComponent} from "react";
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next'
import Dashboard from "../../../components/Dashboard/Chart";
import ChartTotalSales from "../../../components/Dashboard/ChartTotalSales";
import ChartDistrictSales from "../../../components/Dashboard/ChartDistrictSales";
import useWeightDashboard from "./useWeightDashboard";
import useSalesProductAnalysis from "./useSalesProductAnalysis";
import useWeightProcessing from "./useWeightProcessing";

const Recyclables: FunctionComponent = () => {
    const { t } = useTranslation()

    const {
        setFrmDate,
        setToDate,
        frmDate,
        toDate,
        labels,
        dataset,
    } = useWeightDashboard();

    const {
        labelProduct,
        datasetProduct,
        frmDateProduct,
        toDateProduct,
        setFrmDateProduct,
        setToDateProduct
    } =  useSalesProductAnalysis();

    const {
        labelProcessing,
        datasetProcessing,
        frmDateProcessing,
        toDateProcessing,
        setFrmDateProcessing,
        setToDateProcessing
    } = useWeightProcessing()
    
    return(
        <Box >
            <Typography style={{fontSize: '32px', fontWeight: '700', color: '#000000', marginBottom: '30px'}}>
                {t('dashboard_manufacturer.data')}
            </Typography>
            <Dashboard 
                key={t('dashboard_manufacturer.recycling_station')}
                labels={labels}
                dataset={dataset}
                onChangeFromDate={setFrmDate}
                onChangeToDate={setToDate}
                frmDate={frmDate}
                toDate={toDate}
                title={t('dashboard_manufacturer.recycling_station')}
                typeChart="bar"
            />

            <Dashboard 
                key={t('dashboard_manufacturer.recycled_product')}
                labels={labelProduct.map(item => item.value)}
                dataset={datasetProduct}
                onChangeFromDate={setFrmDateProduct}
                onChangeToDate={setToDateProduct}
                frmDate={frmDateProduct}
                toDate={toDateProduct}
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
                title={t('dashboard_manufacturer.recycling_processing_types')} 
                typeChart="bar"
            />

            <ChartTotalSales/>
            <ChartDistrictSales />
        </Box>
    )
};

export default Recyclables