import {Box, Grid, Typography } from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FunctionComponent } from "react";
import { localStorgeKeyName } from "../../constants/constant";
import { LEFT_ARROW_ICON } from "../../themes/icons";

const ErrorPages: FunctionComponent= () => {
    const { state } = useLocation()
    const navigate = useNavigate();
    const { t } = useTranslation();
    const realm = localStorage.getItem(localStorgeKeyName.realm);

    return (
        <Box className="container-wrapper w-full mr-11">
            <div className="overview-page bg-bg-primary">
                <div
                    className="header-page flex justify-start items-center mb-4 cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <LEFT_ARROW_ICON fontSize="large" />
                    <Typography style={{ fontSize: '22px', color: 'black' }}>
                        {t('notification.modify_template.header')}
                    </Typography>
                </div>
            </div>
            <Grid style={{display: 'flex', justifyContent: 'start', alignItems: 'start', flexDirection: 'column', gap: 2, marginTop: '20px'}}>
                <Grid style={{display: 'flex', gap: 2}}>
                    <Typography style={{width: '200px', fontSize: 20, fontWeight: 500, color: '#535353'}}>Status Code</Typography>
                    <Typography style={{marginRight: '10px', color: '#535353'}}>: </Typography>
                    <Typography style={{fontSize: 20, fontWeight: 500, color: '#535353'}}>{state.code}</Typography>
                </Grid>
                <Grid style={{display: 'flex', gap: 2}}>
                    <Typography style={{width: '200px', fontSize: 20, fontWeight: 500, color: '#535353'}}>Error Message</Typography>
                    <Typography style={{marginRight: '10px', color: '#535353'}}>: </Typography>
                    <Typography style={{fontSize: 20, fontWeight: 500, color: '#535353'}}>{state.message}</Typography>
                </Grid>
            </Grid>
           
        </Box>
    )
};

export default ErrorPages;