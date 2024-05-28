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
import { extractError, getThemeColorRole, showErrorToast, showSuccessToast } from "../../../utils/utils";
import CustomField from "../../../components/FormComponents/CustomField";
import CustomTextField from "../../../components/FormComponents/CustomTextField";
import FileUploadCard from "../../../components/FormComponents/FileUploadCard";
import { toast } from 'react-toastify'
import { Languages, STATUS_CODE, localStorgeKeyName } from "../../../constants/constant";
import { LanguagesNotif,Option } from "../../../interfaces/notif";
import i18n from "../../../setups/i18n";
interface TemplateProps {
    templateId: string,
    realmApiRoute: string
}

const BroadcastTemplate: FunctionComponent<TemplateProps> = ({ templateId, realmApiRoute }) => {
    const [notifTemplate, setNotifTemplate] = useState({ templateId: '', notiType: '', variables: [], lang: '', title: '', content: '', senders: [], receivers: [], updatedBy: '', effFromDate: dayjs().format('YYYY-MM-DD'), effToDate: dayjs().format('YYYY-MM-DD') })
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [errors, setErrors] = useState({content: {status: false, message: ''}, lang: {status: false, message: ''}, title: {status: false, message: ''}})
    const userRole:string = localStorage.getItem('userRole') || '';
    const themeColor:string = getThemeColorRole(userRole);
    const realm = localStorage.getItem(localStorgeKeyName.realm);
    const [currentLang, setCurrentLang] = useState<Option>({value: '', lang: ''})
    const languages: readonly LanguagesNotif[] = [
        {
            value: "ZH-CH",
            langTchi: '簡體中文',
            langSchi: '简体中文',
            langEng: 'Simplified Chinese',
        },
        {
            value: "ZH-HK",
            langTchi: '繁體中文',
            langSchi: '繁体中文',
            langEng: 'Traditional Chinese',
        },
        {
            value: "EN-US",
            langTchi: '英語',
            langSchi: '英语',
            langEng: 'English',
        }
    ];

    const getCurrentLang = () => {
        if(i18n.language === Languages.ENUS){
            let options: Option[] = languages.map(item => {
                return{
                    value: item.value,
                    lang: item.langEng
                }
            })
            return options
        } else if(i18n.language === Languages.ZHCH){
            let options: Option[] = languages.map(item => {
                return{
                    value: item.value,
                    lang: item.langSchi
                }
            })
            return options
        } else {
            let options: Option[] = languages.map(item => {
                return{
                    value: item.value,
                    lang: item.langTchi
                }
            })
            return options
        }
    }

    const setCurrentLanguage = (lang: string) => {
        if(lang === 'ZH-CH' && i18n.language === Languages.ZHCH) {
            setCurrentLang({value: lang, lang: '简体中文'})
        }else if(lang === 'ZH-CH' && i18n.language === Languages.ZHHK) {
            setCurrentLang({value: lang, lang: '簡體中文'})
        }else if(lang === 'ZH-CH' && i18n.language === Languages.ENUS) {
            setCurrentLang({value: lang, lang: 'Simplified Chinese'})
        }else if (lang === 'ZH-HK' && i18n.language === Languages.ZHCH) {
            setCurrentLang({value: lang, lang: '繁体中文'})
        }else if (lang === 'ZH-HK' && i18n.language === Languages.ZHHK) {
            setCurrentLang({value: lang, lang: '繁體中文'})
        }else if (lang === 'ZH-HK' && i18n.language === Languages.ENUS) {
            setCurrentLang({value: lang, lang: 'Traditional Chinese'})
        } else if (lang === 'EN-US' && i18n.language === Languages.ZHCH) {
            setCurrentLang({value: lang, lang: '英语'})
        }else if (lang === 'EN-US' && i18n.language === Languages.ZHHK) {
            setCurrentLang({value: lang, lang: '英语'})
        }else if (lang === 'EN-US' && i18n.language === Languages.ENUS) {
            setCurrentLang({value: lang, lang: 'English'})
        }
    }

    const getDetailTemplate = async () => {
      try {
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
                    effFromDate: notif?.effFromDate,
                    effToDate: notif?.effToDate,
                }
            })
            setCurrentLanguage(notif.lang)
        }
      } catch (error:any) {
        const {state, realm} =  extractError(error);
        if(state.code === STATUS_CODE[503] || !error?.response){
          navigate('/maintenance')
        }
      }
    }

    useEffect(() => {
        setCurrentLanguage(currentLang.value)
    }, [i18n.language])

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
        if(errors.lang.status || errors.content.status || errors.title.status){
            showErrorToast(t('common.editFailed'))
            return
        } else {
            const response = await updateNotifTemplateBroadcast(templateId, notifTemplate, realmApiRoute)
            if (response) {
                showSuccessToast(t('common.editSuccessfully' + ' ' + notifTemplate.content))
                setTimeout(() => {
                    navigate(`/${realm}/notice`)
                }, 2000);

            } else {
                showErrorToast(t('common.editFailed'))
            }
        }
    }

    const onChangeLanguage = (value: string, lang: string) => {
        if (value) {
            setCurrentLang({value: value, lang: lang})
            setNotifTemplate(prev => {
                return {
                    ...prev,
                    lang : value
                }
            })
        }
    }

    const onChangeDate = (value: dayjs.Dayjs | null, type: string) => {
        if (value) {
            setNotifTemplate(prev => {
                return {
                    ...prev,
                    [type]: dayjs(value).format('YYYY-MM-DD')
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

    const showErrorToast = (msg: string) => {
        toast.error(msg, {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        })
      }
      
     const showSuccessToast = (msg: string) => {
        toast.info(msg, {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          style: {width: 800}
        })
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
                        onClick={() => navigate(`/${realm}/notice`)}
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
                            id="combo-box-demo"
                            sx={{ width: 300, color: '#79CA25', '&.Mui-checked': { color: '#79CA25'}}}
                            options={getCurrentLang()}
                            autoHighlight
                            getOptionLabel={(option) => option.lang}
                            value={currentLang}
                            onChange={(event, newValue) => {
                                if(newValue) onChangeLanguage(newValue.value, newValue.lang)
                            }}
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
                                value={dayjs(notifTemplate.effFromDate)}
                                sx={localstyles.datePicker(false)}
                                maxDate={dayjs(notifTemplate.effToDate)}
                                onChange={(event) => onChangeDate(event, 'effFromDate')}
                            />

                        </Grid>

                        <Grid display={'flex'} direction={'column'} rowGap={1} style={{ width: '180px' }}>
                            <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                                {t('notification.modify_template.broadcast.end_valid_date')}
                            </Typography>
                            <DatePicker
                                value={dayjs(notifTemplate.effToDate)}
                                sx={localstyles.datePicker(false)}
                                minDate={dayjs(notifTemplate.effFromDate)}
                                onChange={(event) => onChangeDate(event, 'effToDate')}
                            />
                        </Grid>

                    </Grid>

                    <Grid display={'flex'} justifyContent={'left'} direction={'column'} rowGap={1}>
                        <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                            {t(`notification.drag_drop_content`)}
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