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
import { createRecyc, createVehicleData, deleteVehicleData, sendWeightUnit, updateVehicleData } from '../../../APICalls/ASTD/recycling'
import { paletteColors } from '../../../themes/palette'
import { STATUS_CODE } from '../../../constants/constant'

interface VehicleDataProps {
    createdAt: string
    createdBy: string
    description: string
    remark: string
    status: string
    updatedAt: string
    updatedBy: string
    vehicleTypeId: string
    vehicleTypeNameEng: string
    vehicleTypeNameSchi: string
    vehicleTypeNameTchi: string
    vehicleTypeLimit: string
}


interface SiteTypeProps {
    drawerOpen: boolean
    handleDrawerClose: () => void
    action?: 'add' | 'edit' | 'delete'
    selectedItem: VehicleDataProps | null
    onSubmit: (type: string) => void;
  }

const CreateEngineData: FunctionComponent<SiteTypeProps> = ({
    drawerOpen,
    handleDrawerClose,
    action,
    selectedItem,
    onSubmit,
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
    const [weight, setWeight] = useState('')
    const [description, setDescription] = useState('')
    const [remark, setRemark] = useState('')
    const [vehicleTypeId, setVehicleTypeId] = useState('')
    const [validation, setValidation] = useState<{ field: string; error: string }[]>([])
    const isInitialRender = useRef(true) // Add this line
    const navigate = useNavigate();

    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, [i18n, currentLanguage])

    useEffect(() => {
        if (action === 'edit') {
            if (selectedItem !== null && selectedItem !== undefined) {
                setVehicleTypeId(selectedItem.vehicleTypeId)
                setTChineseName(selectedItem.vehicleTypeNameTchi)
                setSChineseName(selectedItem.vehicleTypeNameSchi)
                setEnglishName(selectedItem.vehicleTypeNameEng)
                setDescription(selectedItem.description)
                setWeight(selectedItem.vehicleTypeLimit)
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
        setDescription('')
        setWeight('')
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
        return s >= 0
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
        
        Number(weight) < 0 &&
            tempV.push({
                field: 'weight',
                error: `${t(`pickup_order.card_detail.weight`)} ${t('recycling_unit.weight_error')}`
            })
            
        setValidation(tempV)
    }, [tChineseName, sChineseName, englishName, weight])

    const handleDelete = async () => {
        const token = returnApiToken()

        const vehicleForm = {
            status: "DELETED",
            updatedBy: token.loginId
        }

        if (vehicleForm) {
            try {
                const response = await deleteVehicleData(vehicleTypeId, vehicleForm)

                if (response) {
                    showSuccessToast(t('notify.successDeleted'))
                    onSubmit('vehicle')
                }
            } catch (error:any) {
                const {state} =  extractError(error);
                if(state.code === STATUS_CODE[503] ){
                    navigate('/maintenance')
                } else {
                    showErrorToast(t('notify.errorDeleted'))
                }
                
            }
        }
    }

    const handleSubmit = () => {
        const { loginId } = returnApiToken();
        
        const vehicleForm = {
            vehicleTypeNameTchi: tChineseName,
            vehicleTypeNameSchi: sChineseName,
            vehicleTypeNameEng: englishName,
            vehicleTypeLimit: weight,
            description: description,
            remark: remark,
            status: 'ACTIVE',
            createdBy: loginId,
            updatedBy: loginId
        }

        const isError = validation.length == 0
        getFormErrorMsg()

        if (validation.length == 0) {
            action == 'add' ? createVehicle(vehicleForm) : editVehicleData(vehicleForm)

            setValidation([])
        } else {
            setTrySubmitted(true)
        }
    }

    const createVehicle = async (vehicleForm: any) => {
        try {
            const response = await createVehicleData(vehicleForm)
            if (response) {
                showSuccessToast(t('notify.successCreated'))
                onSubmit('vehicle')
            }
        } catch (error:any) {
            console.error(error)
            const {state} = extractError(error);
            if(state.code === STATUS_CODE[503] ){
                navigate('/maintenance')
            } else {
                showErrorToast(t('notify.errorCreated'))
            }
        }
    }

    const editVehicleData = async (vehicleForm: any) => {
        try {
            const response = await updateVehicleData(vehicleTypeId, vehicleForm)
            if (response) {
                showSuccessToast(t('notify.SuccessEdited'))
                onSubmit('vehicle')
            }
        } catch (error:any) {
            console.error(error)
            const {state} = extractError(error);
            if(state.code === STATUS_CODE[503] ){
                navigate('/maintenance')
            } else {
                showErrorToast(t('notify.errorCreated'))
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
                    subTitle: t('vehicle.vehicle'),
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
                        <CustomField label={t('vehicle.loading_capacity')}>
                            <CustomTextField
                                id="weight"
                                type="number"
                                value={weight}
                                disabled={action === 'delete'}
                                placeholder={t('vehicle.loading_capacity')}
                                onChange={(event) => setWeight(event.target.value)}
                                error={checkNumber(Number(weight))}
                                endAdornment={(
                                    <Typography>kg</Typography>
                                  )}
                            />
                        </CustomField>
                    </Box>
                    {Number(weight) < 0 && (
                        <Typography sx={{color: paletteColors.Red1}}>{t('recycling_unit.weight_error')}</Typography>
                    )}
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
