import {Box, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FunctionComponent, useState } from "react";
import { localStorgeKeyName } from "../../constants/constant";
import { LEFT_ARROW_ICON } from "../../themes/icons";

const ErrorPages: FunctionComponent= () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const realm = localStorage.getItem(localStorgeKeyName.realm);

    return (
        <Box className="container-wrapper w-full mr-11">
            <div className="overview-page bg-bg-primary">
                <div
                    className="header-page flex justify-start items-center mb-4 cursor-pointer"
                    onClick={() => navigate(`/${realm}/notice`)}
                >
                    <LEFT_ARROW_ICON fontSize="large" />
                    <Typography style={{ fontSize: '22px', color: 'black' }}>
                        {t('notification.modify_template.header')}
                    </Typography>
                </div>
            </div>
           
        </Box>
    )
};

export default ErrorPages;