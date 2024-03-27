import { FunctionComponent, useState, useEffect } from 'react'
import {
    Box,
    Divider,
    Grid,
    Typography,
    Button,
    InputLabel,
    MenuItem,
    Card,
    FormControl,
    ButtonBase,
    ImageList,
    ImageListItem,
    OutlinedInput
} from '@mui/material'
import dayjs from 'dayjs'
import { CAMERA_OUTLINE_ICON } from '../../../themes/icons'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { EVENT_RECORDING } from '../../../constants/configs'
import { styles } from '../../../constants/styles'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'

import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import { Vehicle, CreateVehicle as CreateVehicleForm } from '../../../interfaces/vehicles'
import { formErr, format } from '../../../constants/constant'
import { returnErrorMsg, ImageToBase64 } from '../../../utils/utils'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import { createVehicles as addVehicle, deleteVehicle, editVehicle } from '../../../APICalls/Collector/vehicles'
import { localStorgeKeyName } from "../../../constants/constant";
import i18n from '../../../setups/i18n'
import { Contract, CreateContract as CreateContractProps } from '../../../interfaces/contract'
import LabelField from '../../../components/FormComponents/CustomField'
import Switcher from '../../../components/FormComponents/CustomSwitch'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { createContract, editContract } from '../../../APICalls/Collector/contracts'
import { CreatePackagingUnit as CreatePackagingUnitProps, PackagingUnit } from '../../../interfaces/packagingUnit'
import { createPackaging, editPackaging } from '../../../APICalls/Collector/packagingUnit'

interface CreatePackagingProps {
    drawerOpen: boolean
    handleDrawerClose: () => void
    action: 'add' | 'edit' | 'delete' | 'none'
    onSubmitData: (type: string, msg: string) => void
    rowId?: number,
    selectedItem?: PackagingUnit | null
}

const CreatePackaging: FunctionComponent<CreatePackagingProps> = ({
    drawerOpen,
    handleDrawerClose,
    action,
    onSubmitData,
    rowId,
    selectedItem,
}) => {
    const { t } = useTranslation()
    const [tChineseName, setTChineseName] = useState('')
    const [sChineseName, setSChineseName] = useState('')
    const [englishName, setEnglishName] = useState('')
    const [description, setDescription] = useState('')
    const [remark, setRemark] = useState('')
    const [packagingTypeId, setPackagingTypeId] = useState('')
    const [status, setStatus] = useState('')
    const [trySubmited, setTrySubmited] = useState<boolean>(false)


    useEffect(() => {
        console.log(selectedItem, 'selectedItem')
        if (action === 'edit') {
            if (selectedItem !== null && selectedItem !== undefined) {
                setPackagingTypeId(selectedItem.packagingTypeId)
                setTChineseName(selectedItem.packagingNameTchi)
                setSChineseName(selectedItem.packagingNameSchi)
                setEnglishName(selectedItem.packagingNameEng)
                setDescription(selectedItem.description)
                setRemark(selectedItem.remark)
                setStatus(selectedItem.status)
            }
        } else if (action === 'add') {
            resetData()
        }
    }, [selectedItem, action, drawerOpen])

    const resetData = () => {
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

    const handleSubmit = () => {
        const loginId = localStorage.getItem(localStorgeKeyName.username) || ""
        const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ""

        const formData: CreatePackagingUnitProps = {
            tenantId: tenantId,
            packagingTypeId: packagingTypeId,
            packagingNameTchi: tChineseName,
            packagingNameSchi: sChineseName,
            packagingNameEng: englishName,
            description: description,
            remark: remark,
            status: status,
            createdBy: loginId,
            updatedBy: loginId
        }

        if (action == 'add') {
            handleCreatePackaging(formData)
        } else if (action == 'edit') {
            handleEditPackaging(formData)
        }
    }

    const handleCreatePackaging = async (formData: CreatePackagingUnitProps) => {
        console.log(formData, 'formData before submit')
        const result = await createPackaging(formData)
        if (result) {
            onSubmitData("success", "Success created data")
            resetData()
            handleDrawerClose()
        } else {
            onSubmitData("error", "Failed created data")
        }
    }

    const handleEditPackaging = async (formData: CreatePackagingUnitProps) => {
        const result = await editPackaging(formData)
        if (result) {
            onSubmitData("success", "Edit data success")
            resetData()
            handleDrawerClose()
        }
    }

    // const handleDelete = async () => {
    //   const status = 'DELETED'
    //   if(selectedItem != null){
    //     const result = await deleteVehicle(status, selectedItem.vehicleId)
    //     if(result) {
    //       onSubmitData("success", "Deleted data success")
    //       resetData()
    //       handleDrawerClose()
    //     } else {
    //       onSubmitData("error", "Deleted data success")
    //     }
    //   }
    // }

    return (
        <div className="add-vehicle">
            <RightOverlayForm
                open={drawerOpen}
                onClose={handleDrawerClose}
                anchor={'right'}
                action={action}
                headerProps={{
                    title: t('packaging_unit.new'),
                    subTitle: t('packaging_unit.packaging_unit'),
                    submitText: t('add_warehouse_page.save'),
                    cancelText: t('add_warehouse_page.delete'),
                    onCloseHeader: handleDrawerClose,
                    onSubmit: handleSubmit,
                    // onDelete: handleDelete
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
                            error={checkString(description)}
                            multiline={true}
                            defaultValue={description}
                        />
                    </CustomField>
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
            </RightOverlayForm>
        </div>
    )
}

const localstyles = {
    textField: {
        borderRadius: '10px',
        fontWeight: '500',
        '& .MuiOutlinedInput-input': {
            padding: '10px'
        }
    },
    imagesContainer: {
        width: '100%',
        height: 'fit-content'
    },
    image: {
        aspectRatio: '1/1',
        width: '100px',
        borderRadius: 2
    },
    cardImg: {
        borderRadius: 2,
        backgroundColor: '#E3E3E3',
        width: '100%',
        height: 150,
        boxShadow: 'none'
    },
    btnBase: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 10
    },
    imgError: {
        border: '1px solid red'
    },
    datePicker: {
        ...styles.textField,
        width: '250px',
        '& .MuiIconButton-edgeEnd': {
            color: '#79CA25',
        }
    },
    DateItem: {
        display: 'flex',
        height: 'fit-content',
    }
}

export default CreatePackaging
