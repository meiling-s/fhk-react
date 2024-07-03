import {
    FunctionComponent,
    useCallback,
    useState,
    useEffect,
    useRef
} from 'react'
import { useNavigate } from 'react-router-dom'
import RightOverlayForm from '../../../components/RightOverlayForm'
import TextField from '@mui/material/TextField'
import {
    Grid,
    FormHelperText,
    Autocomplete,
    Modal,
    Box,
    Stack,
    Divider,
    Typography
} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switcher from '../../../components/FormComponents/CustomSwitch'
import LabelField from '../../../components/FormComponents/CustomField'
import { ADD_CIRCLE_ICON, REMOVE_CIRCLE_ICON } from '../../../themes/icons'
import { useTranslation } from 'react-i18next'
import { ToastContainer, toast } from 'react-toastify'
import { extractError, returnApiToken, showErrorToast, showSuccessToast } from '../../../utils/utils'
import {
    createWarehouse,
    getWarehouseById,
    editWarehouse,
    getRecycleType
} from '../../../APICalls/warehouseManage'
import { set } from 'date-fns'
import { getLocation } from '../../../APICalls/getLocation'
import { get } from 'http'
import { getCommonTypes } from '../../../APICalls/commonManage'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { createRecyc, createRecyclingPoint, deleteRecyclingPoint, editRecyclingPoint, sendWeightUnit } from '../../../APICalls/ASTD/recycling'
import { STATUS_CODE } from '../../../constants/constant'

interface siteTypeDataProps {
    createdAt: string
    createdBy: string
    description: string
    remark: string
    siteTypeId: string
    siteTypeNameEng: string
    siteTypeNameSchi: string
    siteTypeNameTchi: string
    status: string
    updatedAt: string
    updatedBy: string
}

interface SiteTypeProps {
    drawerOpen: boolean
    handleDrawerClose: () => void
    action?: 'add' | 'edit' | 'delete'
    rowId?: number,
    selectedItem: siteTypeDataProps | null,
    handleOnSubmitData: (type: string) => void
  }

const CreateRecyclingPoint: FunctionComponent<SiteTypeProps> = ({
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
    const [trySubmited, setTrySubmitted] = useState(false)
    const [tChineseName, setTChineseName] = useState('')
    const [sChineseName, setSChineseName] = useState('')
    const [englishName, setEnglishName] = useState('')
    const [equivalent, setEquivalent] = useState('')
    const [description, setDescription] = useState('')
    const [remark, setRemark] = useState('')
    const [isMainCategory, setMainCategory] = useState(true)
    const [chosenRecyclableType, setChosenRecyclableType] = useState('')
    const [validation, setValidation] = useState<{ field: string; error: string }[]>([])
    const isInitialRender = useRef(true) // Add this line
    const navigate = useNavigate();

    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, [i18n, currentLanguage])

    useEffect(() => {
        setTrySubmitted(false)
        if (action === 'edit' || action === 'delete') {
            if (selectedItem !== null && selectedItem !== undefined) {
                setTChineseName(selectedItem.siteTypeNameTchi)
                setSChineseName(selectedItem.siteTypeNameSchi)
                setEnglishName(selectedItem.siteTypeNameEng)
                setDescription(selectedItem.description)
                setRemark(selectedItem.remark)
            }
        } else if (action === 'add') {
            resetForm()
        }
    }, [selectedItem, action, drawerOpen])

    const resetForm = () => {
        setTChineseName('')
        setSChineseName('')
        setEnglishName('')
        setEquivalent('')
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

        setValidation(tempV)
    }, [tChineseName, sChineseName, englishName, i18n, currentLanguage])

    const handleDelete = async () => {
        const { loginId } = returnApiToken();
        const recyclingPointForm = {
            status: 'DELETED',
            updatedBy: loginId
        }
        
        try {
            if (selectedItem !== null && selectedItem !== undefined) {
                const response = await deleteRecyclingPoint(selectedItem?.siteTypeId, recyclingPointForm)
                if (response) {
                    handleOnSubmitData('siteType')
                    showSuccessToast(t('notify.successDeleted'))
                }
            }
        } catch (error:any) {
            const {state} =  extractError(error)
            if(state.code === STATUS_CODE[503] ){
                navigate('/maintenance')
            } else {
                console.log(error)
                showErrorToast(t('notify.errorDeleted'))
            }
        }
    }

    const handleSubmit = () => {
        const { loginId } = returnApiToken();
        
        const recyclingPointForm = {
            siteTypeNameTchi: tChineseName,
            siteTypeNameSchi: sChineseName,
            siteTypeNameEng: englishName,
            description: description,
            remark: remark,
            status: 'ACTIVE',
            createdBy: loginId,
            updatedBy: loginId
        }

        const isError = validation.length == 0
        getFormErrorMsg()

        if (validation.length == 0) {
            action == 'add' ? createRecyclingPointData(recyclingPointForm) : editRecyclingPointData(recyclingPointForm)

            setValidation([])
        } else {
            setTrySubmitted(true)
        }
    }

    const createRecyclingPointData = async (data: any) => {
        try {
            const response = await createRecyclingPoint(data)
            if (response) {
                handleOnSubmitData('siteType')
                showSuccessToast(t('notify.successCreated'))
            }
        } catch (error:any) {
            const {state} =  extractError(error)
            if(state.code === STATUS_CODE[503] ){
                navigate('/maintenance')
            } else {
                console.error(error)
                showErrorToast(t('errorCreated.errorCreated'))
            }
        }
    }
    const editRecyclingPointData = async (data: any) => {
        try {
            if (selectedItem !== null && selectedItem !== undefined) {
                const response = await editRecyclingPoint(selectedItem?.siteTypeId, data)
                if (response) {
                    handleOnSubmitData('siteType')
                    showSuccessToast(t('notify.SuccessEdited'))
                }
            }
        } catch (error:any) {
            const {state} =  extractError(error)
            if(state.code === STATUS_CODE[503] ){
                navigate('/maintenance')
            } else {
                console.error(error)
                showErrorToast(t('errorCreated.errorCreated'))
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
                    subTitle: t('recycling_point.engineering_land'),
                    submitText: t('add_warehouse_page.save'),
                    cancelText: t('add_warehouse_page.delete'),
                    onCloseHeader: handleDrawerClose,
                    onSubmit: handleSubmit,
                    onDelete: handleDelete
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
                                placeholder={t('packaging_unit.traditional_chinese_name')}
                                onChange={(event) => setTChineseName(event.target.value)}
                                error={trySubmited && checkString(tChineseName)}
                            />
                        </CustomField>
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('packaging_unit.simplified_chinese_name')} mandatory>
                            <CustomTextField
                                id="sChineseName"
                                value={sChineseName}
                                disabled={action === 'delete'}
                                placeholder={t('packaging_unit.simplified_chinese_name')}
                                onChange={(event) => setSChineseName(event.target.value)}
                                error={trySubmited && checkString(sChineseName)}
                            />
                        </CustomField>
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('packaging_unit.english_name')} mandatory>
                            <CustomTextField
                                id="englishName"
                                value={englishName}
                                disabled={action === 'delete'}
                                placeholder={t('packaging_unit.english_name')}
                                onChange={(event) => setEnglishName(event.target.value)}
                                error={trySubmited && checkString(englishName)}
                            />
                        </CustomField>
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('packaging_unit.introduction')}>
                            <CustomTextField
                                id="description"
                                placeholder={t('packaging_unit.introduction')}
                                onChange={(event) => setDescription(event.target.value)}
                                multiline={true}
                                defaultValue={description}
                            />
                        </CustomField>
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('packaging_unit.remark')}>
                            <CustomTextField
                                id="remark"
                                placeholder={t('packaging_unit.remark')}
                                onChange={(event) => setRemark(event.target.value)}
                                multiline={true}
                                defaultValue={remark}
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

export default CreateRecyclingPoint
