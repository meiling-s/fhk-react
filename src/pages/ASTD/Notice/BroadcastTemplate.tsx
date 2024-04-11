import { Autocomplete, Box, Button, Grid, TextField, Typography } from "@mui/material";
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
import { getThemeColorRole, showErrorToast, showSuccessToast } from "../../../utils/utils";
import CustomField from "../../../components/FormComponents/CustomField";
import CustomTextField from "../../../components/FormComponents/CustomTextField";
import FileUploadCard from "../../../components/FormComponents/FileUploadCard";

interface TemplateProps {
    templateId: string,
    realmApiRoute: string
}

const BroadcastTemplate: FunctionComponent<TemplateProps> = ({ templateId, realmApiRoute }) => {
    const [notifTemplate, setNotifTemplate] = useState({ templateId: '', notiType: '', variables: [], lang: '', title: '', content: '', senders: [], receivers: [], updatedBy: '', effFrmDate: dayjs().format('YYYY/MM/DDD'), effToDate: dayjs().format('YYYY/MM/DDD') })
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [errors, setErrors] = useState({content: {status: false, message: ''}, lang: {status: false, message: ''}, title: {status: false, message: ''}})
    const userRole:string = localStorage.getItem('userRole') || '';
    const themeColor:string = getThemeColorRole(userRole);

    const getDetailTemplate = async () => {
        const notif = await getDetailNotifTemplate(templateId, realmApiRoute);
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
            const response = await updateNotifTemplateBroadcast(templateId, notifTemplate, realmApiRoute)
            if (response) {
                showSuccessToast(t('common.editSuccessfully'))
                setTimeout(() => {
                    navigate(`/${realmApiRoute}/notice`)
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

    const onChangeTitle = (title: string | null) => {
        if (title) {
            setNotifTemplate(prev => {
                return {
                    ...prev,
                    title
                }
            })
            setErrors(prev => {
                return{
                    ...prev,
                    title: {status: false, message: ''}
                }
            })
        } else {
            setErrors(prev => {
                return{
                    ...prev,
                    title: {status: true, message: t('form.error.shouldNotBeEmpty')}
                }
            })
        }
    }

    const onHandleUpload = (content: string) => {
       setNotifTemplate(prev => {
        return{
            ...prev,
            content: content
        }
       })
    };

    return (
        <Box className="container-wrapper w-full mr-11">
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="zh-cn"
            >
                <div className="overview-page bg-bg-primary">
                    <div
                        className="header-page flex justify-start items-center mb-4 cursor-pointer"
                        onClick={() => navigate(`/${realmApiRoute}/notice`)}
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
                        <CustomTextField
                            id="eventName"
                            placeholder={t('notification.modify_template.broadcast.title')}
                            value={notifTemplate?.title}
                            onChange={(event) =>  onChangeTitle(event.target.value)}
                            sx={{ width: '400px', color: 'black', fontSize: 16, fontWeight: 'medium' }}
                        />
                        <Typography style={{ fontSize: '13px', color: 'red', fontWeight: '500' }}>
                            {errors.title.status ? t('form.error.shouldNotBeEmpty') : ''}
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
                            sx={{ width: 300, color: '#79CA25', '&.Mui-checked': { color: '#79CA25'}}}
                            onChange={(_: SyntheticEvent, newValue: string | null) => onChangeLanguage(newValue)}
                            renderInput={(params) => <TextField {...params} 
                                sx={[styles.textField, { width: 400 }]}InputProps={{
                                ...params.InputProps,
                                sx: styles.inputProps
                              }} 
                            />}
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
                                defaultValue={dayjs(notifTemplate.effFrmDate)}
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
                                defaultValue={dayjs(notifTemplate.effToDate)}
                                onChange={(event) => onChangeDate(event, 'effToDate')}
                            />
                        </Grid>

                    </Grid>

                    <Grid display={'flex'} justifyContent={'left'} direction={'column'} rowGap={1}>
                        <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                            {t(`notification.upload`)}
                        </Typography>
                        <FileUploadCard 
                             onHandleUpload={onHandleUpload}
                        />
                    </Grid>
                    <Grid display={'flex'} justifyContent={'left'} direction={'column'} rowGap={1}>
                        <CustomField label={t('notification.modify_template.broadcast.content')}>
                            <CustomTextField
                                id="content"
                                placeholder={t('notification.modify_template.broadcast.content')}
                                value={notifTemplate?.content}
                                onChange={(event) => {
                                    setNotifTemplate(prev => {
                                        return {
                                            ...prev,
                                            content: event.target.value
                                        }
                                    })
                                }}
                                sx={{width: 1200}}
                                multiline={true}
                            />
                        </CustomField>
                        <Typography style={{ fontSize: '13px', color: 'red', fontWeight: '500' }}>
                            {errors.content.status ? t('form.error.shouldNotBeEmpty') : ''}
                        </Typography>
                    </Grid>

                    <Grid display={'flex'} direction={'column'}>
                        <Button
                            disabled = {errors.content.status || errors.lang.status || errors.title.status}
                            onClick={onSubmitUpdateTemplate}
                            sx={{
                                borderRadius: "20px",
                                backgroundColor: themeColor,
                                '&.MuiButton-root:hover': { bgcolor: themeColor },
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