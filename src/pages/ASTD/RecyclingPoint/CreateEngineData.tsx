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
import { returnApiToken, showErrorToast, showSuccessToast } from '../../../utils/utils'
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
import { createRecyc, sendWeightUnit } from '../../../APICalls/ASTD/recycling'

interface engineDataProps {
    createdAt: string
    createdBy: string
    premiseTypeId: string
    premiseTypeNameEng: string
    premiseTypeNameSchi: string
    premiseTypeNameTchi: string
    registeredFlg: boolean
    remark: string
    residentalFlg: boolean
    status: string
    updatedAt: string
    updatedBy: string
}


interface SiteTypeProps {
    drawerOpen: boolean
    handleDrawerClose: () => void
    action?: 'add' | 'edit' | 'delete'
    rowId?: number,
    selectedItem: engineDataProps | null
  }

const CreateEngineData: FunctionComponent<SiteTypeProps> = ({
    drawerOpen,
    handleDrawerClose,
    action,
    rowId,
    selectedItem
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
    const [registeredFlg, setRegisteredFlg] = useState(false)
    const [residentalFlg, setResidentalFlg] = useState(false)
    const [remark, setRemark] = useState('')
    const [isMainCategory, setMainCategory] = useState(true)
    const [chosenRecyclableType, setChosenRecyclableType] = useState('')
    const [validation, setValidation] = useState<{ field: string; error: string }[]>([])
    const isInitialRender = useRef(true) // Add this line

    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, [i18n, currentLanguage])

    useEffect(() => {
        if (action === 'edit') {
            if (selectedItem !== null && selectedItem !== undefined) {
                setTChineseName(selectedItem.premiseTypeNameTchi)
                setSChineseName(selectedItem.premiseTypeNameSchi)
                setEnglishName(selectedItem.premiseTypeNameEng)
                setRegisteredFlg(selectedItem.registeredFlg)
                setResidentalFlg(selectedItem.residentalFlg)
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
        setRegisteredFlg(false)
        setResidentalFlg(false)
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
                field: 'tChineseName',
                error: `${t(`common.traditionalChineseName`)} ${t(
                    'add_warehouse_page.shouldNotEmpty'
                )}`
            })

        sChineseName.trim() === '' &&
            tempV.push({
                field: 'sChineseName',
                error: `${t(`common.simplifiedChineseName`)} ${t(
                    'add_warehouse_page.shouldNotEmpty'
                )}`
            })

        englishName.trim() === '' &&
            tempV.push({
                field: 'englishName',
                error: `${t(`common.englishName`)} ${t(
                    'add_warehouse_page.shouldNotEmpty'
                )}`
            })

        setValidation(tempV)
    }, [tChineseName, sChineseName, englishName])

    const handleDelete = () => {
        setOpenDelete(true)
    }

    const handleSubmit = () => {
        const { loginId } = returnApiToken();
        console.log(action, 'action')
        
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

    const createRecyclingPointData = async (weightForm: any) => {
        try {
            const response = await sendWeightUnit(weightForm)
            if (response) {
                showSuccessToast(t('notify.successCreated'))
            }
        } catch (error) {
            console.error(error)
            showErrorToast(t('errorCreated.errorCreated'))
        }
    }
    const editRecyclingPointData = async (weightForm: any) => {
        // try {
        //     const response = await createRecyc(addRecyclingForm)
        //     if (response) {
        //         showSuccessToast(t('notify.successCreated'))
        //     }
        // } catch (error) {
        //     console.error(error)
        //     showErrorToast(t('errorCreated.errorCreated'))
        // }
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
                        <CustomField label={t('packaging_unit.traditional_chinese_name')}>
                            <CustomTextField
                                id="tChineseName"
                                value={tChineseName}
                                disabled={action === 'delete'}
                                placeholder={t('packaging_unit.traditional_chinese_name')}
                                onChange={(event) => setTChineseName(event.target.value)}
                                error={checkString(tChineseName)}
                            />
                        </CustomField>
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('packaging_unit.simplified_chinese_name')}>
                            <CustomTextField
                                id="sChineseName"
                                value={sChineseName}
                                disabled={action === 'delete'}
                                placeholder={t('packaging_unit.simplified_chinese_name')}
                                onChange={(event) => setSChineseName(event.target.value)}
                                error={checkString(sChineseName)}
                            />
                        </CustomField>
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('packaging_unit.english_name')}>
                            <CustomTextField
                                id="englishName"
                                value={englishName}
                                disabled={action === 'delete'}
                                placeholder={t('packaging_unit.english_name')}
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
                        <CustomField label={t('packaging_unit.introduction')} mandatory={false}>
                            <CustomTextField
                                id="description"
                                placeholder={t('packaging_unit.introduction')}
                                onChange={(event) => setDescription(event.target.value)}
                                error={checkString(description)}
                                multiline={true}
                                defaultValue={description}
                            />
                        </CustomField>
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('packaging_unit.remark')} mandatory={false}>
                            <CustomTextField
                                id="remark"
                                placeholder={t('packaging_unit.remark')}
                                onChange={(event) => setRemark(event.target.value)}
                                error={checkString(remark)}
                                multiline={true}
                                defaultValue={remark}
                            />
                        </CustomField>
                    </Box>
                </Box>
            </RightOverlayForm>
        </div>
    )
}

export default CreateEngineData
