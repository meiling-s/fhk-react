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
import { createPackagingUnit, createRecyc, editPackagingUnit } from '../../../APICalls/ASTD/recycling'

interface PackagingUnitProps {
    createdAt: string
    createdBy: string
    description: string
    packagingNameEng: string
    packagingNameSchi: string
    packagingNameTchi: string
    packagingTypeId: string
    remark: string
    status: string
    tenantId: string
    updatedAt: string
    updatedBy: string
}

interface RecyclingFormatProps {
    drawerOpen: boolean
    handleDrawerClose: () => void
    action?: 'add' | 'edit' | 'delete'
    onSubmitData: (type: string) => void
    selectedItem: PackagingUnitProps | null 
  }

const RecyclingFormat: FunctionComponent<RecyclingFormatProps> = ({
    drawerOpen,
    handleDrawerClose,
    action,
    onSubmitData,
    selectedItem
}) => {
    const { t } = useTranslation()
    const { i18n } = useTranslation()
    const currentLanguage = localStorage.getItem('selectedLanguage') || 'zhhk'
    const [errorMsgList, setErrorMsgList] = useState<string[]>([])

    const [trySubmited, setTrySubmitted] = useState(false)
    const [tChineseName, setTChineseName] = useState('')
    const [sChineseName, setSChineseName] = useState('')
    const [englishName, setEnglishName] = useState('')
    const [description, setDescription] = useState('')
    const [remark, setRemark] = useState('')
    const [packagingId, setPackagingId] = useState('')
    const [validation, setValidation] = useState<{ field: string; error: string }[]>([])

    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, [i18n, currentLanguage])
    
    useEffect(() => {
        if (action === 'edit' || action === 'delete') {
            if (selectedItem !== null && selectedItem !== undefined) {
                setPackagingId(selectedItem.packagingTypeId)
                setTChineseName(selectedItem.packagingNameTchi)
                setSChineseName(selectedItem.packagingNameSchi)
                setEnglishName(selectedItem.packagingNameEng)
                setDescription(selectedItem.description)
                setRemark(selectedItem.remark)
            }
        } else if (action === 'add') {
            resetForm()
        }
    }, [selectedItem, action,drawerOpen])

    const resetForm = () => {
        setTChineseName('')
        setSChineseName('')
        setEnglishName('')
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
        const tempV: {field: string; error: string}[] = []

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
        const { loginId, tenantId } = returnApiToken();

        const packagingForm = {
            tenantId: tenantId,
            packagingNameTchi: tChineseName,
            packagingNameSchi: sChineseName,
            packagingNameEng: englishName,
            description: description,
            remark: remark,
            status: 'DELETED',
            createdBy: loginId,
            updatedBy: loginId
        }

        if (validation.length == 0) {
            editPackagingData(packagingForm, 'delete')
        } else {
            setTrySubmitted(true)
            showErrorToast(t('notify.errorDeleted'))
        }
    }
    
    const handleSubmit = () => {
        const { loginId, tenantId } = returnApiToken();

        const packagingForm = {
            tenantId: tenantId,
            packagingNameTchi: tChineseName,
            packagingNameSchi: sChineseName,
            packagingNameEng: englishName,
            description: description,
            remark: remark,
            status: 'ACTIVE',
            createdBy: loginId,
            updatedBy: loginId
        }

        const isError = validation.length == 0
        getFormErrorMsg()

        if (validation.length == 0) {
            action == 'add' ? createPackagingData(packagingForm) : editPackagingData(packagingForm, 'edit')

            setValidation([])
        } else {
            setTrySubmitted(true)
        }
    }

    const createPackagingData = async (packagingForm: any) => {
        try {
            const response = await createPackagingUnit(packagingForm)
            if (response) {
                showSuccessToast(t('notify.successCreated'))
                onSubmitData('packaging')
            }
        } catch (error) {
            console.error(error)
            showErrorToast(t('errorCreated.errorCreated'))
        }
    }
    const editPackagingData = async (packagingForm: any, value: string) => {
        try {
            const response = await editPackagingUnit(packagingForm, packagingId)
            if (response) {
                onSubmitData('packaging')
                if (value === 'edit') {
                    showSuccessToast(t('notify.SuccessEdited'))
                } else {
                    showSuccessToast(t('notify.successDeleted'))
                }
            }
        } catch (error) {
            console.error(error)
            showErrorToast(t('notify.errorEdited'))
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
                    subTitle: t('packaging_unit.packaging_unit'),
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
                    <CustomField label={t('packaging_unit.introduction')} mandatory={false}>
                        <CustomTextField
                            id="description"
                            placeholder={t('packaging_unit.introduction')}
                            onChange={(event) => setDescription(event.target.value)}
                            multiline={true}
                            defaultValue={description}
                        />
                    </CustomField>
                    <CustomField label={t('packaging_unit.remark')} mandatory={false}>
                        <CustomTextField
                            id="remark"
                            placeholder={t('packaging_unit.remark')}
                            onChange={(event) => setRemark(event.target.value)}
                            multiline={true}
                            defaultValue={remark}
                        />
                    </CustomField>
                </Box>
            </RightOverlayForm>
        </div>
    )
}

let styles = {
    textField: {
        borderRadius: '10px',
        fontWeight: '500',
        '& .MuiOutlinedInput-input': {
            padding: '15px 20px',
            margin: 0
        }
    },
    textArea: {
        borderRadius: '10px',
        fontWeight: '500',
        '& .MuiOutlinedInput-input': {
            padding: 0,
            margin: 0
        }
    },
    inputState: {
        '& .MuiOutlinedInput-root': {
            margin: 0,
            '&:not(.Mui-disabled):hover fieldset': {
                borderColor: '#79CA25'
            },
            '&.Mui-focused fieldset': {
                borderColor: '#79CA25'
            }
        }
    },
    dropDown: {
        '& .MuiOutlinedInput-root-MuiSelect-root': {
            borderRadius: '10px'
        }
    },
    modal: {
        position: 'absolute',
        top: '50%',
        width: '34%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        height: 'fit-content',
        padding: 4,
        backgroundColor: 'white',
        border: 'none',
        borderRadius: 5,

        '@media (max-width: 768px)': {
            width: '70%' /* Adjust the width for mobile devices */
        }
    }
}

export default RecyclingFormat
