import { FunctionComponent } from "react";
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next'
import Dashboard from "../../../components/Dashboard/Chart";
import { primaryColor, styles } from "../../../constants/styles";
import { SEARCH_ICON } from "../../../themes/icons";
import useWeightDashboardAstd from "./useWeightDashboardAstd";

const Recyclables: FunctionComponent = () => {
    const { t } = useTranslation()
    const {  
        onChangeTenandId,
        setFrmDate,
        setToDate,
        onHandleSearch,
        frmDate,
        toDate,
        labels,
        dataset,
        tenantId
    } =  useWeightDashboardAstd()

    return(
        <Box >
             <TextField
                id="searchShipment"
                value={tenantId}
                onChange={(event) =>
                    onChangeTenandId(event.target.value)
                }
                sx={{...styles.inputStyle, marginBottom: 3}}
                label={t('check_in.search')}
                placeholder={t('tenant.enter_company_number')}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => {}}>
                                <SEARCH_ICON
                                    style={{ color: primaryColor }}
                                />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
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
                title={t('dashboard_recyclables.recycling_data')}
                typeChart="bar"
            />
        </Box>
    )
};

export default Recyclables