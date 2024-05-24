import {Box, Grid, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FunctionComponent } from "react";
import { LEFT_ARROW_ICON } from "../../themes/icons";
import CustomField from "../../components/FormComponents/CustomField";
import CustomTextField from "../../components/FormComponents/CustomTextField";

const ErrorPages: FunctionComponent= () => {
    const { state } = useLocation()
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Box className="container-wrapper w-full mr-11">
            <div className="overview-page bg-bg-primary">
                <div
                    className="header-page flex justify-start items-center mb-4 cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <LEFT_ARROW_ICON fontSize="large" />
                    <Typography style={{ fontSize: '22px', color: 'black' }}>
                        {t('common.errorMessage')}
                    </Typography>
                </div>
            </div>
            <Grid style={{display: 'flex', justifyContent: 'start', alignItems: 'start', flexDirection: 'column', gap: 2, marginTop: '20px'}}>
                <Grid item style={{width: '20%', marginBottom: '20px'}}>
                    <CustomField label={t('common.statusCode')} mandatory = {false}>
                        <CustomTextField
                            id="statusCode"
                            placeholder={t('common.statusCode')}
                            onChange={(event) => {}}
                            value={state.code}
                            sx={{ width: '100%' }}
                            disabled={true}
                        />
                    </CustomField>
                </Grid>
                <Grid item style={{width: '80%'}}>
                    <CustomField label={t('common.message')} mandatory = {false}>
                        <CustomTextField
                            id={'receiverAddr'}
                            placeholder={t('common.message')}
                            rows={4}
                            multiline={true}
                            onChange={(event) => {}}
                            value={state.message}
                            sx={{ width: '100%', height: '100%' }}
                            disabled={true}
                        />
                    </CustomField>
                </Grid>
            </Grid>
           
        </Box>
    )
};

export default ErrorPages;