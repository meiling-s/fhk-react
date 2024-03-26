import { Autocomplete, Box, Button, Grid, TextField, TextareaAutosize, Typography } from "@mui/material";
import { LEFT_ARROW_ICON } from "../../../themes/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getDetailNotifTemplate } from "../../../APICalls/notify";

const AppTemplate = (props) => {
    const [notifTemplate, setNotifTemplate] = useState({templateId: '', notiType: '', variables: [], lang: '', title: '', content: '', senders: [], receivers: [], updatedBy: ''})
    const navigate= useNavigate();
    const { t } = useTranslation();

    const getDetailTemplate = async () => {
        const notif =  await getDetailNotifTemplate(props?.templateId);
        console.log('notice', notif)
        if(notif){
            setNotifTemplate(prev => {
                return{
                    ...prev,
                    templateId: notif?.templateId,
                    notiType: notif?.notiType,
                    lang: notif?.lang,
                    title: notif?.title,
                    content: notif?.content,
                    senders: notif?.senders,
                    receivers: notif?.receivers,
                    updatedBy: notif?.updatedBy
                }
            })
        }
    }

    useEffect(() => {
        if(props?.templateId){
            getDetailTemplate(props.templateId)
        }
    }, [])
    console.log('notifTemplate', notifTemplate)
    const variables = ["CheckInId","Requester","RequestDateTime","PickupOrder","LogisticProvider","ReceiverCompanyName"]
    
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
                    {t('notification.modify_template.app.Recycling_delivery_request')}
                </Typography>
                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{fontSize: '13px', color: '#ACACAC'}}>
                        {t('notification.modify_template.app.type')}
                    </Typography>
                    <Typography style={{fontSize: '16px', color: 'black', fontWeight: '700'}}>
                        In-app
                    </Typography>
                </Grid>

                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{fontSize: '13px', color: '#ACACAC'}}>
                        {t('notification.modify_template.app.title')}
                    </Typography>
                    <Typography style={{fontSize: '16px', color: 'black', fontWeight: '700'}}>
                        {notifTemplate.title}
                    </Typography>
                </Grid>

                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{fontSize: '13px', color: '#ACACAC'}}>
                        {t('notification.modify_template.app.language')}
                    </Typography>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        value={notifTemplate?.lang}
                        options={['EN-US', 'ZH-HK', 'ZH-CH']}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} style={{backgroundColor: 'white'}} label={t('notification.modify_template.app.language')} />}
                        />
                </Grid>

                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{fontSize: '13px', color: '#ACACAC'}}>
                        {t('notification.modify_template.app.content')}
                    </Typography>
                    <TextareaAutosize 
                        style={{width: '1135px', backgroundColor: 'white'}}
                        value={notifTemplate?.content}
                        minRows={5}
                    />
                </Grid>

                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{fontSize: '13px', color: '#ACACAC'}}>
                        {t('notification.modify_template.app.variables')}
                    </Typography>
                    <Grid display={'flex'} direction={'row'} style={{gap: 2}}>
                        {variables.map(item => {
                            return <button 
                                className="bg-[#FBFBFB] py-1 px-2 hover:cursor-pointer text-[##717171]"
                            > [{item}] </button>
                        })}
                        
                    </Grid>
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
                        {t('notification.modify_template.app.button_submit')}
                    </Button>
                </Grid>

            </Grid>
        </Box>
    )
};

export default AppTemplate;