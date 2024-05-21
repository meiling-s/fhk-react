import { FunctionComponent } from "react";
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next'
import Dashboard from "../../../components/Dashboard/Chart";
import useWeightDashboardCollector from "./useWeightDashboardCollector";

const Recyclables: FunctionComponent = () => {
    const { t } = useTranslation()
    const {  
        onChangeColdId,
        setFrmDate,
        setToDate,
        onHandleSearch,
        frmDate,
        toDate,
        labels,
        dataset,
    } =  useWeightDashboardCollector()

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
                onChangeColdId={onChangeColdId}
                title={t('dashboard_recyclables.recycling_data')}
                typeChart="bar"
            />
        </Box>
    )
};

export default Recyclables