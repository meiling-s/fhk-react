import { Autocomplete, Box, Button, Grid, TextField, TextareaAutosize, Typography } from "@mui/material";
import { LEFT_ARROW_ICON } from "../../../themes/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FunctionComponent, useEffect, useState, SyntheticEvent } from "react";
import { getDetailNotifTemplate, updateNotifTemplateBroadcast } from "../../../APICalls/notify";
import { ToastContainer, toast } from 'react-toastify'
import dayjs from "dayjs";
import { styles } from "../../../constants/styles";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { formValidate } from "../../../interfaces/common";
import { formErr } from "../../../constants/constant";
import { FormErrorMsg } from "../../../components/FormComponents/FormErrorMsg";

interface TemplateProps {
    templateId: string
}

const BroadcastTemplate: FunctionComponent<TemplateProps> = ({templateId}) => {
    const [notifTemplate, setNotifTemplate] = useState({templateId: '', notiType: '', variables: [], lang: '', title: '', content: '', senders: [], receivers: [], updatedBy: '', effFrmDate: dayjs().format('YYYY/MM/DDD'), effToDate: dayjs().format('YYYY/MM/DDD')})
    const navigate= useNavigate();
    const { t } = useTranslation();
    const [validation, setValidation] = useState<formValidate[]>([])
    const [trySubmited, setTrySubmited] = useState<boolean>(false)

    const validate = () => {
        const tempV: formValidate[] = [];
        if(notifTemplate.lang === '') tempV.push({ field: "field", problem: formErr.empty, type: "error" });
        if(notifTemplate.content === '') tempV.push({ field: "field", problem: formErr.empty, type: "error" });
        if(notifTemplate.effFrmDate === '') tempV.push({ field: "field", problem: formErr.empty, type: "error" });
        if(notifTemplate.effToDate === '') tempV.push({ field: "field", problem: formErr.empty, type: "error" });
        setValidation(tempV)
    }

    useEffect(() => {
        validate()
    }, [notifTemplate])


    const getDetailTemplate = async () => {
        const notif =  await getDetailNotifTemplate(templateId);
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
                    updatedBy: notif?.updatedBy,
                    effFrmDate: notif?.effFrmDate,
                    effToDate: notif?.effToDate,
                }
            })
        }
    }

    

    useEffect(() => {
        if(templateId){
            getDetailTemplate()
        }
    }, [])
   
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

    const onSubmitUpdateTemplate =  async() => {
        if (validation.length == 0) {
            const response = await updateNotifTemplateBroadcast(templateId, notifTemplate)
            if(response){
                showSuccessToast('Succeed Update Template')
                setTimeout(() => {
                    navigate('/astd/notice')
                }, 1000);
                
            } else {
                showErrorToast('Failed Update Template')
            }
        } else {
            setTrySubmited(true)
        }
        
    }

    const onChangeLanguage = (lang: string | null) => {
       if(lang){
        setNotifTemplate(prev => {
            return{
                ...prev,
                lang
            }
        })
       }
    }

    const onChangeDate = (value: dayjs.Dayjs | null, type: string) => {
        
        if(value){
            setNotifTemplate(prev => {
                return{
                    ...prev,
                    [type]: dayjs(value).format('YYYY/MM/DDD')
                }
            })
        }
    }

    const returnErrorMsg = (error: string) => {
        let msg = ''
        switch (error) {
          case formErr.empty:
            msg = t('form.error.shouldNotBeEmpty')
            break
          case formErr.wrongFormat:
            msg = t('form.error.isInWrongFormat')
            break
          case formErr.numberSmallThanZero:
            msg = t('form.error.shouldNotSmallerThanZero')
            break
          case formErr.withInColPt_Period:
            msg = t('form.error.withInColPt_Period')
            break
          case formErr.notWithInContractEffDate:
            msg = t('form.error.isNotWithInContractEffDate')
            break
          case formErr.alreadyExist:
            msg = t('form.error.alreadyExist')
            break
          case formErr.hasBeenUsed:
            msg = t('form.error.hasBeenUsed')
            break
          case formErr.exceedsMaxLength:
            msg = t('form.error.exceedsMaxLength')
            break
        }
        return msg
    }
    
    return(
        <Box className="container-wrapper w-full mr-11">
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="zh-cn"
            >
                <div className="overview-page bg-bg-primary">
                    <div 
                        className="header-page flex justify-start items-center mb-4 cursor-pointer"
                        onClick={() => navigate('/astd/notice')}
                    >
                        <LEFT_ARROW_ICON fontSize="large" />
                        <Typography style={{fontSize:'22px', color: 'black'}}> 
                            {t('notification.modify_template.header')}
                        </Typography>
                        <ToastContainer></ToastContainer>
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
                            {notifTemplate.title}
                        </Typography>
                    </Grid>

                    <Grid display={'flex'} direction={'column'} rowGap={1}>
                        <Typography style={{fontSize: '13px', color: '#ACACAC'}}>
                            {t('notification.modify_template.broadcast.language')}
                        </Typography>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            value={notifTemplate.lang}
                            options={['EN-US', 'ZH-HK', 'ZH-CH']}
                            sx={{ width: 300 }}
                            onChange={(_: SyntheticEvent, newValue: string | null) => onChangeLanguage(newValue)}
                            renderInput={(params) => <TextField {...params} style={{backgroundColor: 'white'}} label={t('notification.modify_template.sms.language')} />}
                        />
                    </Grid>
                    <Grid display={'flex'} direction={'row'} rowGap={1} >
                        <Grid display={'flex'} direction={'column'} rowGap={1} style={{width: '180px'}}>
                            <Typography style={{fontSize: '13px', color: '#ACACAC'}}>
                                {t('notification.modify_template.broadcast.start_valid_date')}
                            </Typography>
                            <DatePicker 
                                defaultValue={dayjs()}
                                sx={localstyles.datePicker(false)}
                                onChange={(event) => onChangeDate(event, 'effFrmDate')}
                            />
                            
                        </Grid>

                        <Grid display={'flex'} direction={'column'} rowGap={1} style={{width: '180px'}}>
                            <Typography style={{fontSize: '13px', color: '#ACACAC'}}>
                                {t('notification.modify_template.broadcast.end_valid_date')}
                            </Typography>
                            <DatePicker 
                                sx={localstyles.datePicker(false)}
                                // value={notifTemplate.effToDate}
                                defaultValue={dayjs()}
                                onChange={(event) => onChangeDate(event, 'effToDate')}
                            />
                        </Grid>

                    </Grid>

                    <Grid display={'flex'} direction={'column'} rowGap={1}>
                        <Typography style={{fontSize: '13px', color: '#ACACAC'}}>
                            {t('notification.modify_template.broadcast.content')}
                        </Typography>
                        <TextareaAutosize
                            id="content" 
                            style={{width: '1135px', backgroundColor: 'white'}}
                            value={notifTemplate?.content}
                            minRows={5}
                            onChange={(event) => {
                                setNotifTemplate(prev => {
                                    return{
                                        ...prev,
                                        content: event.target.value
                                    }
                                })
                            }}
                        />
                    </Grid>

                    <Grid  display={'flex'} direction={'column'}>
                        <Button
                            onClick={onSubmitUpdateTemplate}
                            sx={{
                                borderRadius: "20px",
                                backgroundColor: "#79ca25",
                                '&.MuiButton-root:hover':{bgcolor: '#79ca25'},
                                width:'175px',
                                height: "44px",
                                fontSize: '16px',
                                fontWeight: '700'
                            }}
                            variant='contained'
                        >
                            {t('notification.modify_template.app.button_submit')}
                        </Button>
                    </Grid>

                    <Grid item sx={{ width: '50%' }}>
                        {trySubmited &&
                            validation.map((val) => (
                            <FormErrorMsg
                                field={t(val.field)}
                                errorMsg={returnErrorMsg(val.problem)}
                                type={val.type}
                            />
                        ))}
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