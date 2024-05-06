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
import { createRecyc, createSubRecyc, deleteRecyc, deleteSubRecyc, updateRecyc, updateSubRecyc } from '../../../APICalls/ASTD/recycling'

interface recyleSubtyeData {
    recycSubTypeId: string
    recyclableNameEng: string
    recyclableNameSchi: string
    recyclableNameTchi: string
    description: string
    remark: string
    status: string
    updatedAt: string
    updatedBy: string
}

interface recyleTypeData {
    createdAt: string
    createdBy: string
    description: string
    recycSubType: recyleSubtyeData[]
    recycTypeId: string
    recyclableNameEng: string
    recyclableNameSchi: string
    recyclableNameTchi: string
    remark: string
    status: string
    updatedAt: string
    updatedBy: string
    recycSubTypeId: string
}

interface RecyclingFormatProps {
    drawerOpen: boolean
    handleDrawerClose: () => void
    action?: 'add' | 'edit' | 'delete'
    onSubmitData: (type: string) => void
    recyclableType: recyleTypeData[],
    selectedItem: recyleTypeData | null,
    mainCategory: boolean
    setDeleteModal: (value: boolean) => void
  }

const RecyclingFormat: FunctionComponent<RecyclingFormatProps> = ({
    drawerOpen,
    handleDrawerClose,
    action,
    onSubmitData,
    recyclableType,
    selectedItem,
    mainCategory,
    setDeleteModal
}) => {
    const { t } = useTranslation()
    const { i18n } = useTranslation()
    const currentLanguage = localStorage.getItem('selectedLanguage') || 'zhhk'
    const [errorMsgList, setErrorMsgList] = useState<string[]>([])
    const [openDelete, setOpenDelete] = useState<boolean>(false)

    const [recycleType, setRecycleType] = useState([])
    const [recycleSubType, setSubRecycleType] = useState({})
    const [contractList, setContractList] = useState<
        { contractNo: string; isEpd: boolean; frmDate: string; toDate: string }[]
    >([])
    const [pysicalLocation, setPysicalLocation] = useState<boolean>(false) // pysical location field
    const [status, setStatus] = useState(true) // status field
    const [trySubmited, setTrySubmitted] = useState(false)
    const [tChineseName, setTChineseName] = useState('')
    const [sChineseName, setSChineseName] = useState('')
    const [englishName, setEnglishName] = useState('')
    const [description, setDescription] = useState('')
    const [remark, setRemark] = useState('')
    const [isMainCategory, setMainCategory] = useState(true)
    const [chosenRecyclableType, setChosenRecyclableType] = useState('')
    const [subTypeId, setSubTypeId] = useState('')
    const [mainTypeId, setMainTypeId] = useState('')
    const [validation, setValidation] = useState<{ field: string; error: string }[]>([])
    const isInitialRender = useRef(true) // Add this line

    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, [i18n, currentLanguage])
    
    useEffect(() => {
        if (action === 'edit') {
            if (selectedItem !== null && selectedItem !== undefined) {
                if (!mainCategory) {
                    const parentData = !isMainCategory && recyclableType.filter(value => value.recycSubType.find(value => value.recycSubTypeId === selectedItem.recycSubTypeId))
                    setSubTypeId(selectedItem.recycSubTypeId)
                    setChosenRecyclableType(parentData !== false ? parentData[0].recycTypeId : '')
                } else {
                    setMainTypeId(selectedItem.recycTypeId)
                }
                setTChineseName(selectedItem.recyclableNameTchi)
                setSChineseName(selectedItem.recyclableNameSchi)
                setEnglishName(selectedItem.recyclableNameEng)
                setDescription(selectedItem.description)
                setRemark(selectedItem.remark)
                setMainCategory(mainCategory)
            }
        } else if (action === 'add') {
            resetForm()
        }
    }, [selectedItem, action,drawerOpen, mainCategory])

    const resetForm = () => {
        setTChineseName('')
        setSChineseName('')
        setEnglishName('')
        setDescription('')
        setRemark('')
        setMainCategory(true)
        setChosenRecyclableType('')
        setSubTypeId('')
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

        if (isMainCategory === false) {
            chosenRecyclableType.trim() === '' &&
            tempV.push({
                field: 'chosenRecyclableType',
                error: `${t(`recycling_unit.main_category`)} ${t(
                'add_warehouse_page.shouldNotEmpty'
                )}`
            })
        }

        setValidation(tempV)
    }, [tChineseName, sChineseName, englishName, isMainCategory, chosenRecyclableType])

    const handleDelete = async () => {
        const token = returnApiToken()
        
        const recyclingForm = {
            status: 'INACTIVE',
            updatedBy: token.loginId
        }

        try {
            if (isMainCategory) {
                setDeleteModal(true)
                // const response = await deleteRecyc(recyclingForm, mainTypeId)
                // if (response) {
                //     showSuccessToast(t('notify.successDeleted'))
                //     onSubmitData('recycle')
                // }
            } else {
            const response = await deleteSubRecyc(recyclingForm, subTypeId)
                if (response) {
                    showSuccessToast(t('notify.successDeleted'))
                    onSubmitData('recycle')
                }
            }
        } catch (error) {
            console.error(error)
            showErrorToast(t('notify.errorDeleted'))
        }
    }
    
    const handleSubmit = () => {
        const { loginId } = returnApiToken();
        
        const addRecyclingForm = {
            recyclableNameTchi:tChineseName, 
            recyclableNameSchi: sChineseName,
            recyclableNameEng: englishName,
            description: description,
            remark: remark,
            status: 'ACTIVE',
            createdBy: loginId,
            updatedBy: loginId,
        }

        const isError = validation.length == 0
        getFormErrorMsg()

        if (validation.length == 0) {
            action == 'add' ? createRecycData(addRecyclingForm) : editRecycData(addRecyclingForm)

            setValidation([])
        } else {
            setTrySubmitted(true)
        }
    }

    const createRecycData = async (addRecyclingForm: any) => {
        try {
            if (isMainCategory) {
                const response = await createRecyc(addRecyclingForm)
                if (response) {
                    showSuccessToast(t('notify.successCreated'))
                    onSubmitData('recycle')
                }
            } else {
                const response = await createSubRecyc(addRecyclingForm, chosenRecyclableType)
                if (response) {
                    showSuccessToast(t('notify.successCreated'))
                    onSubmitData('recycle')
                }
            }
        } catch (error) {
            console.error(error)
            showErrorToast(t('errorCreated.errorCreated'))
        }
    }
    const editRecycData = async (addRecyclingForm: any) => {
        try {
            if (isMainCategory) {
                console.log(mainTypeId, 'aaa')
                const response = await updateRecyc(addRecyclingForm, mainTypeId)
                if (response) {
                    showSuccessToast(t('notify.SuccessEdited'))
                    onSubmitData('recycle')
                }
            } else {
            const response = await updateSubRecyc(addRecyclingForm, subTypeId)
                if (response) {
                    showSuccessToast(t('notify.SuccessEdited'))
                    onSubmitData('recycle')
                }
            }
        } catch (error) {
            console.error(error)
            showErrorToast(t('errorCreated.errorCreated'))
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
                    subTitle: t('recycling_unit.recyclable_subtype_semi_complete'),
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
                        <CustomField label={t('recycling_unit.main_category')}>
                            <Switcher
                                onText={t('add_warehouse_page.yes')}
                                offText={t('add_warehouse_page.no')}
                                disabled={action === 'delete'}
                                defaultValue={isMainCategory}
                                setState={(newValue) => {
                                    setMainCategory(newValue);
                                    newValue === false && setChosenRecyclableType('')
                                }}
                            />
                        </CustomField>
                    </Box>
                    {!isMainCategory && (
                        <Box sx={{ marginY: 2 }}>
                            <CustomField label={t('recycling_unit.main_category')}>
                                <div className="self-stretch flex flex-col items-start justify-start">
                                    <div className="self-stretch ">
                                        <FormControl sx={{ m: 1, width: '100%' }}>
                                            <Select
                                                value={chosenRecyclableType}
                                                onChange={(event: SelectChangeEvent<string>) => setChosenRecyclableType(event.target.value)}
                                                displayEmpty
                                                disabled={action === 'delete'}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                sx={{ borderRadius: '12px' }}
                                                error={checkString(chosenRecyclableType)}
                                            >
                                                <MenuItem value="">
                                                <em>-</em>
                                                </MenuItem>
                                                {recyclableType.map((item, index) => (
                                                <MenuItem value={item.recycTypeId} key={index}>
                                                    {currentLanguage === 'zhhk'
                                                    ? item.recyclableNameTchi
                                                    : currentLanguage === 'zhch'
                                                    ? item.recyclableNameSchi
                                                    : item.recyclableNameEng}
                                                </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </CustomField>
                        </Box>
                    )}
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