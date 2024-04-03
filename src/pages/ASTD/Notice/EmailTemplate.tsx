import { Autocomplete, Box, Button, Grid, TextField, TextareaAutosize, Typography } from "@mui/material";
import { LEFT_ARROW_ICON } from "../../../themes/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FunctionComponent, useEffect, useState, SyntheticEvent } from "react";
import { getDetailNotifTemplate, updateNotifTemplate } from "../../../APICalls/notify";
import { ToastContainer, toast } from 'react-toastify'

interface TemplateProps {
    templateId: string,
    dynamicPath: string
}

const EmailTemplate: FunctionComponent<TemplateProps> = ({ templateId, dynamicPath }) => {
    const [notifTemplate, setNotifTemplate] = useState({ templateId: '', notiType: '', variables: [], lang: '', title: '', content: '', senders: [], receivers: [], updatedBy: '' })
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isPreviousContentArea, setIsPreviouscontentArea] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);

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
                    updatedBy: notif?.updatedBy
                }
            })
        }
    }

    useEffect(() => {
        if (templateId) {
            getDetailTemplate()
        }
    }, [])

    const variables = ["CompanyName", "InviteURL"]

    const onChangeContent = (index: number) => {
        if (isPreviousContentArea) {
            let content = ''
            const contentLength = notifTemplate.content.length;
            const activeButton = `[${variables[index]}]`
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
            theme: 'light'
        })
    }

    const onSubmitUpdateTemplate = async () => {
        const response = await updateNotifTemplate(templateId, notifTemplate, dynamicPath)
        if (response) {
            showSuccessToast('Succeed Update Template')
            setTimeout(() => {
                navigate(`/${dynamicPath}/notice`)
            }, 1000);

        } else {
            showErrorToast('Failed Update Template')
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

    const handleSelect = (event: React.SyntheticEvent<HTMLTextAreaElement, Event>) => {
        const target = event.target as HTMLInputElement;
        const cursorPosition = target?.selectionStart;
        if (cursorPosition) setCursorPosition(cursorPosition)
    }


    return (
        <Box className="container-wrapper w-full mr-11">
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
                    {t('notification.modify_template.email.Recycling_delivery_request')}
                </Typography>
                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                        {t('notification.modify_template.email.type')}
                    </Typography>
                    <Typography style={{ fontSize: '16px', color: 'black', fontWeight: '700' }}>
                        Email
                    </Typography>
                </Grid>

                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                        {t('notification.modify_template.email.title')}
                    </Typography>
                    <Typography style={{ fontSize: '16px', color: 'black', fontWeight: '700' }}>
                        {notifTemplate.title}
                    </Typography>
                </Grid>

                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                        {t('notification.modify_template.email.language')}
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
                </Grid>

                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                        {t('notification.modify_template.email.content')}
                    </Typography>
                    <TextareaAutosize
                        id="content"
                        style={{ width: '800px', backgroundColor: 'white', borderColor: '#E2E2E2', padding: '20px' }}
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
                </Grid>

                <Grid display={'flex'} direction={'column'} rowGap={1}>
                    <Typography style={{ fontSize: '13px', color: '#ACACAC' }}>
                        {t('notification.modify_template.email.variables')}
                    </Typography>
                    <Grid display={'flex'} direction={'row'} style={{ gap: 2 }}>
                        {variables.map((item, index) => {
                            return <button
                                className="bg-[#FBFBFB] py-1 px-2 hover:cursor-pointer text-[##717171]"
                                style={{ borderRadius: '4px', borderColor: '#E2E2E2' }}
                                onClick={(event) => onChangeContent(index)}
                            > [{item}] </button>
                        })}
                    </Grid>
                </Grid>

                <Grid display={'flex'} direction={'column'}>
                    <Button
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
        </Box>
    )
};

export default EmailTemplate;