import { Autocomplete, Box, Button, Grid, TextField, TextareaAutosize, Typography } from "@mui/material";
import { LEFT_ARROW_ICON } from "../../../themes/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BroadcastTemplate = ({templateId: string}) => {
    const navigate= useNavigate();
    const { t } = useTranslation();
    
    return(
        <Box className="container-wrapper w-full mr-11">
            <div className="overview-page bg-bg-primary">
                <div 
                    className="header-page flex justify-start items-center mb-4 cursor-pointer"
                    onClick={() => navigate('/astd/notice')}
                >
                    <LEFT_ARROW_ICON fontSize="large" />
                    <Typography style={{fontSize:'22px', color: 'black'}}> 
                        {t('notification.modify_template.header')}
                    </Typography>
                </div>
            </div>
            <Grid
                display={'flex'}
                direction={'column'}
                sx={{alignItems: 'flex-start', rowGap: 2}}
                spacing={2.5}
            >
                <Typography style={{color: '#717171', fontSize: '16px', fontWeight: '700'}}>
                    {t('notification.modify_template.broadcast.Recycling_delivery_request')}
                </Typography>
                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{fontSize: '13px', color: '#ACACAC'}}>
                        {t('notification.modify_template.broadcast.type')}
                    </Typography>
                    <Typography style={{fontSize: '16px', color: 'black', fontWeight: '700'}}>
                        Boardcast
                    </Typography>
                </Grid>

                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{fontSize: '13px', color: '#ACACAC'}}>
                        {t('notification.modify_template.broadcast.title')}
                    </Typography>
                    <Typography style={{fontSize: '16px', color: 'black', fontWeight: '700'}}>
                        送入請求
                    </Typography>
                </Grid>

                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{fontSize: '13px', color: '#ACACAC'}}>
                        {t('notification.modify_template.broadcast.language')}
                    </Typography>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={['EN-US', 'ZH-HK', 'ZH-CH']}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} style={{backgroundColor: 'white'}} label={t('notification.modify_template.broadcast.language')} />}
                        />
                </Grid>

                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{fontSize: '13px', color: '#ACACAC'}}>
                        {t('notification.modify_template.broadcast.content')}
                    </Typography>
                    <TextareaAutosize 
                        style={{width: '1135px', backgroundColor: 'white'}}
                        minRows={5}
                    />
                </Grid>

                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{fontSize: '13px', color: '#ACACAC'}}>
                        {t('notification.modify_template.broadcast.variables')}
                    </Typography>
                </Grid>

                <Grid  display={'flex'} direction={'column'}>
                    <Button
                    onClick={() => navigate("/collector/createCollectionPoint")}
                    sx={{
                        borderRadius: "20px",
                        backgroundColor: "#79ca25",
                        '&.MuiButton-root:hover':{bgcolor: '#79ca25'},
                        width:'175px',
                        height: "44px",
                        fontSize: '16px',
                        fontWeight: '700'
                    }}
                    variant='contained'>
                        {t('notification.modify_template.broadcast.button_submit')}
                    </Button>
                </Grid>

            </Grid>
        </Box>
    )
};

export default BroadcastTemplate;