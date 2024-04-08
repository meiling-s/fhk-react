import { Autocomplete, Box, Button, Grid, TextField, TextareaAutosize, Typography } from "@mui/material";
import { LEFT_ARROW_ICON } from "../../../themes/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FunctionComponent, useEffect, useState, SyntheticEvent } from "react";
import { getDetailNotifTemplate, updateNotifTemplateBroadcast } from "../../../APICalls/notify";
import { ToastContainer } from 'react-toastify'
import dayjs from "dayjs";
import { styles } from "../../../constants/styles";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { showErrorToast, showSuccessToast } from "../../../utils/utils";

interface TemplateProps {
    templateId: string,
    dynamicPath: string
}

const BroadcastTemplate: FunctionComponent<TemplateProps> = ({ templateId, dynamicPath }) => {
    const [notifTemplate, setNotifTemplate] = useState({ templateId: '', notiType: '', variables: [], lang: '', title: '', content: '', senders: [], receivers: [], updatedBy: '', effFrmDate: dayjs().format('YYYY/MM/DDD'), effToDate: dayjs().format('YYYY/MM/DDD') })
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [errors, setErrors] = useState({content: {status: false, message: ''}, lang: {status: false, message: ''}})

    const getDetailTemplate = async () => {
        const notif = await getDetailNotifTemplate(templateId, dynamicPath);
        if (notif) {
            setNotifTemplate(prev => {
                return {
                    ...prev,
                    templateId: notif?.templateId,
                    notiType: notif?.notiType,
                    lang: notif?.lang,
                    title: notif?.title,
                    content: notif?.content,
                    senders: notif?.senders,
                    receivers: notif?.receivers,
                    updatedBy: notif?.updatedBy,
                    effFrmDate: notif?.effFrmDate,
                    effToDate: notif?.effToDate,
                }
            })
        }
    }

    useEffect(() => {
        if (templateId) {
            getDetailTemplate()
        }
    }, [])

    useEffect(() => {   
        if(notifTemplate.content === ''){
            setErrors(prev => {
                return{
                    ...prev,
                    content: {status: true, message: t('form.error.shouldNotBeEmpty')}
                }
            })
        } else {
            setErrors(prev => {
                return{
                    ...prev,
                    content: {status: false, message: ''}
                }
            })
        }
    }, [notifTemplate.content, notifTemplate.lang])

    const onSubmitUpdateTemplate = async () => {
        if(errors.lang.status || errors.content.status){
            showErrorToast(t('common.editFailed'))
            return
        } else {
            const response = await updateNotifTemplateBroadcast(templateId, notifTemplate, dynamicPath)
            if (response) {
                showSuccessToast(('common.editSuccessfully'))
                setTimeout(() => {
                    navigate(`/${dynamicPath}/notice`)
                }, 1000);

            } else {
                showErrorToast(t('common.editFailed'))
            }
        }
    }

    const onChangeLanguage = (lang: string | null) => {
        if (lang) {
            setNotifTemplate(prev => {
                return {
                    ...prev,
                    lang
                }
            })
        }
    }

    const onChangeDate = (value: dayjs.Dayjs | null, type: string) => {
        if (value) {
            setNotifTemplate(prev => {
                return {
                    ...prev,
                    [type]: dayjs(value).format('YYYY/MM/DDD')
                }
            })
        }
    }

    return (
        <Box className="container-wrapper w-full mr-11">
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="zh-cn"
            >
                <div className="overview-page bg-bg-primary">
                    <div
                        className="header-page flex justify-start items-center mb-4 cursor-pointer"
                        onClick={() => navigate(`/${dynamicPath}/notice`)}
                    >
                        <LEFT_ARROW_ICON fontSize="large" />
                        <Typography style={{ fontSize: '22px', color: 'black' }}>
                            {t('notification.modify_template.header')}
                        </Typography>
                        <ToastContainer></ToastContainer>
                    </div>
                </div>
                <Grid
                    display={'flex'}
                    direction={'column'}
                    sx={{ alignItems: 'flex-start', rowGap: 2 }}
                    spacing={2.5}
                >
                    <Typography style={{ color: '#717171', fontSize: '16px', fontWeight: '700' }}>
                        {t('notification.modify_template.broadcast.Recycling_delivery_request')}
                    </Typography>
                    <Grid display={'flex'} direction={'column'} rowGap={1}>
                        <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                            {t('notification.modify_template.broadcast.type')}
                        </Typography>
                        <Typography style={{ fontSize: '16px', color: 'black', fontWeight: '700' }}>
                            Boardcast
                        </Typography>
                    </Grid>

                    <Grid display={'flex'} direction={'column'} rowGap={1}>
                        <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                            {t('notification.modify_template.broadcast.title')}
                        </Typography>
                        <Typography style={{ fontSize: '16px', color: 'black', fontWeight: '700' }}>
                            {notifTemplate.title}
                        </Typography>
                    </Grid>

                    <Grid display={'flex'} direction={'column'} rowGap={1}>
                        <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                            {t('notification.modify_template.broadcast.language')}
                        </Typography>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            value={notifTemplate.lang}
                            options={['EN-US', 'ZH-HK', 'ZH-CH']}
                            sx={{ width: 300 }}
                            onChange={(_: SyntheticEvent, newValue: string | null) => onChangeLanguage(newValue)}
                            renderInput={(params) => <TextField {...params} style={{ backgroundColor: 'white' }} />}
                        />
                        <Typography style={{ fontSize: '13px', color: 'red', fontWeight: '500' }}>
                            {errors.lang.status ? t('form.error.shouldNotBeEmpty') : ''}
                        </Typography>
                    </Grid>
                    <Grid display={'flex'} direction={'row'} rowGap={1} >
                        <Grid display={'flex'} direction={'column'} rowGap={1} style={{ width: '180px' }}>
                            <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                                {t('notification.modify_template.broadcast.start_valid_date')}
                            </Typography>
                            <DatePicker
                                defaultValue={dayjs()}
                                sx={localstyles.datePicker(false)}
                                maxDate={dayjs(notifTemplate.effToDate)}
                                onChange={(event) => onChangeDate(event, 'effFrmDate')}
                            />

                        </Grid>

                        <Grid display={'flex'} direction={'column'} rowGap={1} style={{ width: '180px' }}>
                            <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                                {t('notification.modify_template.broadcast.end_valid_date')}
                            </Typography>
                            <DatePicker
                                sx={localstyles.datePicker(false)}
                                // value={notifTemplate.effToDate}
                                minDate={dayjs(notifTemplate.effFrmDate)}
                                defaultValue={dayjs()}
                                onChange={(event) => onChangeDate(event, 'effToDate')}
                            />
                        </Grid>

                    </Grid>

                    <Grid display={'flex'} direction={'column'} rowGap={1}>
                        <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                            {t('notification.modify_template.broadcast.content')}
                        </Typography>
                        <TextareaAutosize
                            id="content"
                            style={{ width: '800px', backgroundColor: 'white', borderColor: '#E2E2E2', padding: '20px' }}
                            value={notifTemplate?.content}
                            minRows={5}
                            onChange={(event) => {
                                setNotifTemplate(prev => {
                                    return {
                                        ...prev,
                                        content: event.target.value
                                    }
                                })
                            }}
                        />
                        <Typography style={{ fontSize: '13px', color: 'red', fontWeight: '500' }}>
                            {errors.content.status ? t('form.error.shouldNotBeEmpty') : ''}
                        </Typography>
                    </Grid>

                    <Grid display={'flex'} direction={'column'}>
                        <Button
                            disabled = {errors.content.status || errors.lang.status}
                            onClick={onSubmitUpdateTemplate}
                            sx={{
                                borderRadius: "20px",
                                backgroundColor: "#79ca25",
                                '&.MuiButton-root:hover': { bgcolor: '#79ca25' },
                                width: '175px',
                                height: "44px",
                                fontSize: '16px',
                                fontWeight: '700'
                            }}
                            variant='contained'
                        >
                            {t('notification.modify_template.app.button_submit')}
                        </Button>
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </Box>
    )
};

const localstyles = {
    datePicker: (showOne: boolean) => ({
        ...styles.textField,
        width: showOne ? '310px' : '160px',
        '& .MuiIconButton-edgeEnd': {
            color: '#79CA25'
        }
    })
}

export default BroadcastTemplate;