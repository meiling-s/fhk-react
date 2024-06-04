import { Autocomplete, Box, Button, Grid, TextField, TextareaAutosize, Typography } from "@mui/material";
import { LEFT_ARROW_ICON } from "../../../themes/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FunctionComponent, useEffect, useState, SyntheticEvent } from "react";
import { getDetailNotifTemplate, updateNotifTemplate } from "../../../APICalls/notify";
import { ToastContainer } from 'react-toastify'
import { extractError, getThemeColorRole, showErrorToast, showSuccessToast } from "../../../utils/utils";
import FileUploadCard from "../../../components/FormComponents/FileUploadCard";
import { styles } from "../../../constants/styles";
import { Languages, STATUS_CODE, localStorgeKeyName } from "../../../constants/constant";
import { LanguagesNotif,Option } from "../../../interfaces/notif";
import i18n from "../../../setups/i18n";

interface TemplateProps {
    templateId: string,
    realmApiRoute: string
}

const SMSTemplate: FunctionComponent<TemplateProps> = ({ templateId, realmApiRoute }) => {
    const [notifTemplate, setNotifTemplate] = useState({ templateId: '', notiType: '', variables: [], lang: '', title: '', content: '', senders: [], receivers: [], updatedBy: '' })
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isPreviousContentArea, setIsPreviouscontentArea] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [errors, setErrors] = useState({content: {status: false, message: ''}, lang: {status: false, message: ''}})
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
                        variables: notif?.variables
                    }
                })
                setCurrentLanguage(notif.lang)
            }
        } catch (error:any) {
            const {state, realm} =  extractError(error);
            if(state.code === STATUS_CODE[503] ){
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

        if(notifTemplate.lang === ''){
            setErrors(prev => {
                return{
                    ...prev,
                    lang: {status: true, message: t('form.error.shouldNotBeEmpty')}
                }
            })
        } else {
            setErrors(prev => {
                return{
                    ...prev,
                    lang: {status: false, message: ''}
                }
            })
        }
    }, [notifTemplate.content, notifTemplate.lang])

    const variables = ["CheckInId", "ReceiverCompanyName", "ReceivedDateTime", "PickupOrder", "SenderCompanyName"]

    const onChangeContent = (index: number) => {
        if (isPreviousContentArea) {
            let content = ''
            const contentLength = notifTemplate.content.length;
            const activeButton = `[${notifTemplate.variables[index]}]`
            if (cursorPosition === 0) {
                content = activeButton + ' ' + notifTemplate.content
            } else if (cursorPosition >= contentLength) {
                content = notifTemplate.content + ' ' + activeButton
            } else {
                const start = notifTemplate.content.slice(0, cursorPosition);
                const end = notifTemplate.content.slice(cursorPosition);
                content = start + ' ' + activeButton + ' ' + end
            }

            setNotifTemplate(prev => {
                return {
                    ...prev,
                    content
                }
            })
        }
    }

    const onChangeCursor = () => {
        setIsPreviouscontentArea(true)
    }

    const onSubmitUpdateTemplate = async () => {
        if(notifTemplate.content === '' || notifTemplate.lang === ''){
            showErrorToast(t('common.editFailed'))
            return 
        }

        const response = await updateNotifTemplate(templateId, notifTemplate, realmApiRoute)
        if (response) {
            showSuccessToast(t('common.editSuccessfully'))
            setTimeout(() => {
                navigate(`/${realm}/notice`)
            }, 1000);

        } else {
            showErrorToast(t('common.editFailed'))
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

    const handleSelect = (event: React.SyntheticEvent<HTMLTextAreaElement, Event>) => {
        const target = event.target as HTMLInputElement;
        const cursorPosition = target?.selectionStart;
        if (cursorPosition) setCursorPosition(cursorPosition)
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
                        {t('notification.modify_template.sms.type')}
                    </Typography>
                    <Typography style={{ fontSize: '16px', color: 'black', fontWeight: '700' }}>
                        SMS
                    </Typography>
                </Grid>

                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                        {t('notification.modify_template.sms.title')}
                    </Typography>
                    <Typography style={{ fontSize: '16px', color: 'black', fontWeight: '700' }}>
                        {notifTemplate.title}
                    </Typography>
                </Grid>

                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                        {t('notification.modify_template.sms.language')}
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

                {/* <Grid display={'flex'} justifyContent={'left'} direction={'column'} rowGap={1}>
                    <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                        {t(`notification.drag_drop_content`)}
                    </Typography>
                    <FileUploadCard 
                        onHandleUpload={onHandleUpload}
                    />
                </Grid> */}

                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                        {t('notification.modify_template.sms.content')}
                    </Typography>
                    <TextareaAutosize
                        id="content"
                        style={{ width: '1200px', backgroundColor: 'white', padding: '10px', borderRadius: '12px' }}
                        value={notifTemplate?.content}
                        minRows={7}
                        onChange={(event) => {
                            setNotifTemplate(prev => {
                                return {
                                    ...prev,
                                    content: event.target.value
                                }
                            })
                        }}
                        onFocusCapture={onChangeCursor}
                        onClick={(event) => handleSelect(event)}
                    />
                    <Typography style={{ fontSize: '13px', color: 'red', fontWeight: '500' }}>
                        {errors.content.status ? t('form.error.shouldNotBeEmpty') : ''}
                    </Typography>
                </Grid>

                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                        {t('notification.modify_template.sms.variables')}
                    </Typography>
                    <Grid display={'flex'} direction={'row'} style={{ gap: 2 }}>
                        {notifTemplate.variables.map((item, index) => {
                            return <button
                                key={index}
                                className="bg-[#FBFBFB] py-1 px-2 hover:cursor-pointer text-[##717171]"
                                style={{ borderRadius: '4px', borderColor: '#E2E2E2' }}
                                onClick={(event) => onChangeContent(index)}
                            > [{item}] </button>
                        })}
                    </Grid>
                </Grid>

                <Grid display={'flex'} direction={'column'}>
                    <Button
                        disabled = {errors.content.status || errors.lang.status}
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
        </Box>
    )
};

export default SMSTemplate;