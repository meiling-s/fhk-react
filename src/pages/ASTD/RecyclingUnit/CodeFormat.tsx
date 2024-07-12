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
import { createPackagingUnit, createRecyc, editPackagingUnit } from '../../../APICalls/ASTD/recycling'
import { createCodeData, deleteCodeData, updateCodeData } from '../../../APICalls/ASTD/code'
import { STATUS_CODE } from '../../../constants/constant'

interface CodeFormatProps {
    createdAt: string
    createdBy: string
    description: string
    recycCodeId: number
    recycCodeName: string
    recycSubTypeId: string
    recycTypeId: string
    remark: string
    status: string
    updatedAt: string
    updatedBy: string
  }

interface RecyclingFormatProps {
    drawerOpen: boolean
    handleDrawerClose: () => void
    action?: 'add' | 'edit' | 'delete'
    onSubmitData: (type: string) => void
    selectedItem: CodeFormatProps | null 
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
    const [description, setDescription] = useState('')
    const [remark, setRemark] = useState('')
    const [codeId, setCodeId] = useState(0)
    const [codeName, setCodeName] = useState('')
    const [mainName, setMainName] = useState('')
    const [subName, setSubName] = useState('')
    const [validation, setValidation] = useState<{ field: string; error: string }[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, [i18n, currentLanguage])
    
    useEffect(() => {
        setTrySubmitted(false)
        resetForm()
        if (action === 'edit' || action === 'delete') {
            if (selectedItem !== null && selectedItem !== undefined) {
                setCodeId(selectedItem.recycCodeId)
                setCodeName(selectedItem.recycCodeName)
                setMainName(selectedItem.recycTypeId)
                setSubName(selectedItem.recycSubTypeId)
                setDescription(selectedItem.description)
                setRemark(selectedItem.remark)
            }
        } else if (action === 'add') {
            resetForm()
        }
    }, [selectedItem, action,drawerOpen])

    const resetForm = () => {
        setCodeId(0)
        setCodeName('')
        setMainName('')
        setSubName('')
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

        codeName.trim() === '' &&
        tempV.push({
            field: `${t('recycling_unit.recyclable_code')}`,
            error: `${t(
            'add_warehouse_page.shouldNotEmpty'
            )}`
        })

        mainName.trim() === '' &&
        tempV.push({
            field: `${t('recycling_unit.main_category')}`,
            error: `${t(
            'add_warehouse_page.shouldNotEmpty'
            )}`
        })

        subName.trim() === '' &&
        tempV.push({
            field: `${t('recycling_unit.sub_category')}`,
            error: `${t(
            'add_warehouse_page.shouldNotEmpty'
            )}`
        })

        setValidation(tempV)
    }, [codeName, mainName, subName, i18n, currentLanguage])

    const handleDelete = async () => {
        const { loginId, tenantId } = returnApiToken();

        const codeForm = {
            status: "INACTIVE",
            updatedBy: loginId
        }

       if (codeForm) {
        try {
            const response = await deleteCodeData(codeForm, codeId)
            if (response) {
                onSubmitData('code')
                showSuccessToast(t('notify.successDeleted'))
                resetForm()
            }
        } catch (error:any) {
            const {state} = extractError(error)
            if(state.code === STATUS_CODE[503] ){
                navigate('/maintenance')
            } else {
                console.error(error)
                showErrorToast(t('notify.errorDeleted'))
            }
        }
       }
    }
    
    const handleSubmit = () => {
        const { loginId, tenantId } = returnApiToken();

        const codeForm = {
            recycCodeName: codeName,
            recycTypeId: mainName,
            recycSubTypeId: subName,
            description: description,
            remark: remark,
            status: 'ACTIVE',
            createdBy: loginId,
            updatedBy: loginId
        }

        const isError = validation.length == 0
        getFormErrorMsg()

        if (validation.length == 0) {
            action == 'add' ? createCode(codeForm) : editCode(codeForm, codeId)

            setValidation([])
        } else {
            setTrySubmitted(true)
        }
    }

    const createCode = async (codeForm: any) => {
        try {
            const response = await createCodeData(codeForm)
            if (response) {
                showSuccessToast(t('notify.successCreated'))
                onSubmitData('code')
                resetForm()
            }
        } catch (error:any) {
            const {state} = extractError(error)
            if(state.code === STATUS_CODE[503] ){
                navigate('/maintenance')
            } else {
                console.error(error)
                showErrorToast(t('errorCreated.errorCreated'))
            }
        }
    }
    const editCode = async (codeForm: any, codeId: number) => {
        try {
            const response = await updateCodeData(codeForm, codeId)
            if (response) {
                showSuccessToast(t('notify.SuccessEdited'))
                onSubmitData('code')
                resetForm()
            }
        } catch (error:any) {
            const {state} = extractError(error)
            if(state.code === STATUS_CODE[503] ){
                navigate('/maintenance')
            } else {
                console.error(error)
                showErrorToast(t('notify.errorEdited'))
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
                    subTitle: t('recycling_unit.recyclable_code'),
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
                        <CustomField label={t('recycling_unit.recyclable_code')} mandatory>
                            <CustomTextField
                                id="codeName"
                                value={codeName}
                                disabled={action === 'delete'}
                                placeholder={t('recycling_unit.recyclable_code')}
                                onChange={(event) => setCodeName(event.target.value)}
                                error={checkString(codeName)}
                            />
                        </CustomField>
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('recycling_unit.main_category')} mandatory>
                            <CustomTextField
                                id="mainName"
                                value={mainName}
                                disabled={action === 'delete'}
                                placeholder={t('recycling_unit.main_category')}
                                onChange={(event) => setMainName(event.target.value)}
                                error={checkString(mainName)}
                            />
                        </CustomField>
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('recycling_unit.sub_category')} mandatory>
                            <CustomTextField
                                id="subName"
                                value={subName}
                                disabled={action === 'delete'}
                                placeholder={t('recycling_unit.sub_category')}
                                onChange={(event) => setSubName(event.target.value)}
                                error={checkString(subName)}
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
