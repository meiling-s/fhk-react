import { FunctionComponent } from "react";
import { Box, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
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
        tenantId,
        errorMessage
    } =  useWeightDashboardAstd()

    return(
        <Box >
            <Grid style={{marginBottom: 5}}>
                <TextField
                    id="searchShipment"
                    value={tenantId}
                    onChange={(event) =>{
                        const numericValue = event.target.value.replace(
                            /\D/g,
                            ''
                          )
                          event.target.value = numericValue
                        onChangeTenandId(event.target.value)
                    }
                    }
                    sx={{...styles.inputStyle}}
                    label={t('check_in.search')}
                    placeholder={t('tenant.enter_company_number')}
                    inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        maxLength: 6
                      }}
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
                {
                    errorMessage && (
                        <Typography style={{color: 'red', fontWeight: 500}}>
                            {errorMessage}
                        </Typography>
                    )
                }
           </Grid>
            <Typography style={{fontSize: '32px', fontWeight: '700', color: '#000000', marginBottom: '10px'}}>
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