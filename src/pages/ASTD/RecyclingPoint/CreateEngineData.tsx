import {
    FunctionComponent,
    useState,
    useEffect,
    useRef
} from 'react'
import RightOverlayForm from '../../../components/RightOverlayForm'
import {
    Autocomplete,
    Box,
    Divider,
    Grid,
    TextField,
} from '@mui/material'
import Switcher from '../../../components/FormComponents/CustomSwitch'
import { useTranslation } from 'react-i18next'
import { ToastContainer, toast } from 'react-toastify'
import { extractError, returnApiToken, showErrorToast, showSuccessToast } from '../../../utils/utils'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { createRecyc, deleteEngineData, editEngineData, sendEngineData, sendWeightUnit } from '../../../APICalls/ASTD/recycling'
import { styles } from '../../../constants/styles'
import { useNavigate } from 'react-router-dom'
import { STATUS_CODE } from '../../../constants/constant'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'

interface engineDataProps {
    createdAt: string
    createdBy: string
    premiseTypeId: string
    premiseTypeNameEng: string
    premiseTypeNameSchi: string
    premiseTypeNameTchi: string
    registeredFlg: boolean
    remark: string
    description: string
    residentalFlg: boolean
    serviceType: string
    status: string
    updatedAt: string
    updatedBy: string
    version: number
}


interface SiteTypeProps {
    drawerOpen: boolean
    handleDrawerClose: () => void
    action?: 'add' | 'edit' | 'delete'
    rowId?: number,
    selectedItem: engineDataProps | null,
    handleOnSubmitData: (type: string) => void;
  }

const CreateEngineData: FunctionComponent<SiteTypeProps> = ({
    drawerOpen,
    handleDrawerClose,
    action,
    rowId,
    selectedItem,
    handleOnSubmitData
}) => {
    const { t } = useTranslation()
    const { i18n } = useTranslation()
    const currentLanguage = localStorage.getItem('selectedLanguage') || 'zhhk'
    const [errorMsgList, setErrorMsgList] = useState<string[]>([])
    const [openDelete, setOpenDelete] = useState<boolean>(false)
    const [trySubmited, setTrySubmitted] = useState<boolean>(false)
    const [tChineseName, setTChineseName] = useState<string>('')
    const [sChineseName, setSChineseName] = useState<string>('')
    const [englishName, setEnglishName] = useState<string>('')
    const [registeredFlg, setRegisteredFlg] = useState<boolean>(false)
    const [residentalFlg, setResidentalFlg] = useState<boolean>(false)
    const [description, setDescription] = useState<string>('')
    const [remark, setRemark] = useState<string>('')
    const [selectedService, setSelectedService] = useState<string>('')
    const [version, setVersion] = useState<number>(0)
    const [validation, setValidation] = useState<{ field: string; error: string }[]>([])
    const navigate = useNavigate();

    const serviceTypeSelect = [
        {
            name: t('recycling_point.offsite'),
            value: 'OFFSITE',
        },
        {
            name: t('recycling_point.community'),
            value: 'COMMUNITY'
        }
    ]
    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, [i18n, currentLanguage])

    useEffect(() => {
        setTrySubmitted(false)
        if (action === 'edit' || action === 'delete') {
            if (selectedItem !== null && selectedItem !== undefined) {
                const newServiceValue = serviceTypeSelect.filter(value => value.value === selectedItem.serviceType)[0]
                setTChineseName(selectedItem.premiseTypeNameTchi)
                setSChineseName(selectedItem.premiseTypeNameSchi)
                setEnglishName(selectedItem.premiseTypeNameEng)
                setRegisteredFlg(selectedItem.registeredFlg)
                setResidentalFlg(selectedItem.residentalFlg)
                setSelectedService(newServiceValue.name)
                setDescription(selectedItem.description)
                setRemark(selectedItem.remark)
                setVersion(selectedItem.version)
            }
        } else if (action === 'add') {
            resetForm()
        }
    }, [selectedItem, action, drawerOpen])

    const resetForm = () => {
        setTChineseName('')
        setSChineseName('')
        setEnglishName('')
        setRegisteredFlg(false)
        setResidentalFlg(false)
        setSelectedService('')
        setDescription('')
        setRemark('')
    }

    const checkString = (s: string) => {
        if (!trySubmited) {
            //before first submit, don't check the validation
            return false
        }
        return s == ''
    }

    const checkNumber = (s: number) => {
        if (!trySubmited) {
            //before first submit, don't check the validation
            return false
        }
        return s == 0
    }

    const getFormErrorMsg = () => {
        const errorList: string[] = []
        validation.map((item) => {
            errorList.push(`${item.error}`)
        })
        setErrorMsgList(errorList)

        return ''
    }

    useEffect(() => {
        const tempV: { field: string; error: string }[] = []

        tChineseName.trim() === '' &&
            tempV.push({
                field: `${t('packaging_unit.traditional_chinese_name')}`,
                error: `${t(`common.traditionalChineseName`)} ${t(
                    'add_warehouse_page.shouldNotEmpty'
                )}`
            })

        sChineseName.trim() === '' &&
            tempV.push({
                field: `${t('packaging_unit.simplified_chinese_name')}`,
                error: `${t(`common.simplifiedChineseName`)} ${t(
                    'add_warehouse_page.shouldNotEmpty'
                )}`
            })

        englishName.trim() === '' &&
            tempV.push({
                field: `${t('packaging_unit.english_name')}`,
                error: `${t(`common.englishName`)} ${t(
                    'add_warehouse_page.shouldNotEmpty'
                )}`
            })

        selectedService.trim() === '' &&
        tempV.push({
            field: `${t('recycling_point.service_type')}`,
            error: `${t(`recycling_point.service_type`)} ${t(
                'add_warehouse_page.shouldNotEmpty'
            )}`
        })

        setValidation(tempV)
    }, [tChineseName, sChineseName, englishName, selectedService, i18n, currentLanguage])

    const handleDelete = async () => {
        const token = returnApiToken()
        const premiseTypeForm = {
            status: 'DELETED',
            updatedBy: token.loginId,
            version: version
        }
        
        if (selectedItem !== null && selectedItem !== undefined) {
            try {
                const response = await deleteEngineData(selectedItem?.premiseTypeId, premiseTypeForm)
                if (response) {
                    handleOnSubmitData('premiseType')
                    showSuccessToast(t('notify.successDeleted'))
                }
            } catch (error:any) {
                const { state } = extractError(error)
                if (state.code === STATUS_CODE[503]) {
                    navigate('/maintenance')
                  } else if (state.code === STATUS_CODE[409]){
                    showErrorToast(error.response.data.message);
                  }
            }
        }
    }

    const handleSubmit = () => {
        const { loginId } = returnApiToken();
        const serviceValue = serviceTypeSelect.filter(value => value.name === selectedService)[0] || ''

        const premiseTypeForm = {
            premiseTypeNameTchi: tChineseName,
            premiseTypeNameSchi: sChineseName,
            premiseTypeNameEng: englishName,
            residentalFlg: residentalFlg,
            registeredFlg: registeredFlg,
            remark: remark,
            description: description,
            status: 'ACTIVE',
            serviceType: serviceValue.value,
            createdBy: loginId,
            updatedBy: loginId,
            ...(action === 'edit' && {version: version})
        }

        const isError = validation.length == 0
        getFormErrorMsg()

        if (validation.length == 0) {
            action == 'add' ? createEngineData(premiseTypeForm) : editRecyclingPointData(premiseTypeForm)

            setValidation([])
        } else {
            setTrySubmitted(true)
        }
    }

    const createEngineData = async (premiseTypeForm: any) => {
        try {
            const response = await sendEngineData(premiseTypeForm)
            if (response) {
                handleOnSubmitData('premiseType')
                showSuccessToast(t('notify.successCreated'))
            }
        } catch (error:any) {
            const {state} =  extractError(error);
            if(state.code === STATUS_CODE[503] ){
                navigate('/maintenance')
            } else {
                console.error(error)
                showErrorToast(t('errorCreated.errorCreated'))
            }
        }
    }

    const editRecyclingPointData = async (premiseTypeForm: any) => {
        if (selectedItem !== null && selectedItem !== undefined) {
            try {
            const response = await editEngineData(selectedItem?.premiseTypeId, premiseTypeForm)
                if (response) {
                    handleOnSubmitData('premiseType')
                    showSuccessToast(t('notify.SuccessEdited'))
                }
            } catch (error:any) {
                const {state} =  extractError(error);
                if (state.code === STATUS_CODE[503]) {
                    navigate('/maintenance')
                  } else if (state.code === STATUS_CODE[409]){
                    showErrorToast(error.response.data.message);
                  }
            }
        }
    }

    return (
        <div className="add-vehicle">
            <RightOverlayForm
                open={drawerOpen}
                onClose={handleDrawerClose}
                anchor={'right'}
                action={action}
                headerProps={{
                    title:
                        action == 'add'
                            ? t('top_menu.add_new')
                            : action == 'delete'
                                ? t('common.delete')
                                : '',
                    subTitle: t('recycling_point.house_or_place'),
                    submitText: t('add_warehouse_page.save'),
                    cancelText: t('add_warehouse_page.delete'),
                    onCloseHeader: handleDrawerClose,
                    onSubmit: handleSubmit,
                    onDelete: handleDelete,
                    deleteText: t('common.deleteMessage')
                }}
            >
                <Divider></Divider>
                <Box sx={{ marginX: 2 }}>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('packaging_unit.traditional_chinese_name')} mandatory>
                            <CustomTextField
                                id="tChineseName"
                                value={tChineseName}
                                disabled={action === 'delete'}
                                placeholder={t('packaging_unit.traditional_chinese_name_placeholder')}
                                onChange={(event) => setTChineseName(event.target.value)}
                                error={checkString(tChineseName)}
                            />
                        </CustomField>
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('packaging_unit.simplified_chinese_name')} mandatory>
                            <CustomTextField
                                id="sChineseName"
                                value={sChineseName}
                                disabled={action === 'delete'}
                                placeholder={t('packaging_unit.simplified_chinese_name_placeholder')}
                                onChange={(event) => setSChineseName(event.target.value)}
                                error={checkString(sChineseName)}
                            />
                        </CustomField>
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('packaging_unit.english_name')} mandatory>
                            <CustomTextField
                                id="englishName"
                                value={englishName}
                                disabled={action === 'delete'}
                                placeholder={t('packaging_unit.english_name_placeholder')}
                                onChange={(event) => setEnglishName(event.target.value)}
                                error={checkString(englishName)}
                            />
                        </CustomField>
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('recycling_point.residence')}>
                            <Switcher
                                onText={t('add_warehouse_page.yes')}
                                offText={t('add_warehouse_page.no')}
                                disabled={action === 'delete'}
                                defaultValue={residentalFlg}
                                setState={(newValue) => setResidentalFlg(newValue)}
                            />
                        </CustomField>
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('recycling_point.epd')}>
                            <Switcher
                                onText={t('add_warehouse_page.yes')}
                                offText={t('add_warehouse_page.no')}
                                disabled={action === 'delete'}
                                defaultValue={registeredFlg}
                                setState={(newValue) => setRegisteredFlg(newValue)}
                            />
                        </CustomField>
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('recycling_point.service_type')} mandatory>
                            <Autocomplete
                                disablePortal
                                id="selectedService"
                                defaultValue={selectedService}
                                options={serviceTypeSelect.map((functionItem) => functionItem.name)}
                                onChange={(event, value) => {
                                    if (value) {
                                        setSelectedService(value)
                                    }
                                }}
                                value={selectedService}
                                disabled={action === 'delete'}
                                renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder={t('recycling_point.service_type')}
                                    sx={[styles.textField, { width: 320 }]}
                                    InputProps={{
                                    ...params.InputProps,
                                    sx: styles.inputProps
                                    }}
                                    error={checkString(selectedService)}
                                />
                                )}
                                noOptionsText={t('common.noOptions')}
                            />
                        </CustomField>
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('packaging_unit.introduction')}>
                            <CustomTextField
                                id="introduction"
                                placeholder={t('packaging_unit.introduction_placeholder')}
                                onChange={(event) => setDescription(event.target.value)}
                                multiline={true}
                                defaultValue={description}
                                disabled={action === 'delete'}
                            />
                        </CustomField>
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('packaging_unit.remark')}>
                            <CustomTextField
                                id="remark"
                                placeholder={t('packaging_unit.remark_placeholder')}
                                onChange={(event) => setRemark(event.target.value)}
                                multiline={true}
                                defaultValue={remark}
                                disabled={action === 'delete'}
                            />
                        </CustomField>
                    </Box>
                    <Grid item sx={{ width: '92%' }}>
                        {trySubmited &&
                            validation.map((val, index) => (
                            <FormErrorMsg
                                key={index}
                                field={t(val.field)}
                                errorMsg={val.error}
                                type={'error'}
                            />
                            ))}
                    </Grid>
                </Box>
            </RightOverlayForm>
        </div>
    )
}

export default CreateEngineData
