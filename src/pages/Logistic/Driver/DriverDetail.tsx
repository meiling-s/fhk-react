import { Autocomplete, Box, Button, ButtonBase, Card, Divider, FormControl, Grid, ImageList, ImageListItem, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import ImageUploading, { ImageListType } from 'react-images-uploading'
import RightOverlayForm from "../../../components/RightOverlayForm"
import { useTranslation } from "react-i18next"
import CustomTextField from "../../../components/FormComponents/CustomTextField"
import CustomField from "../../../components/FormComponents/CustomField"
import { CAMERA_OUTLINE_ICON } from "../../../themes/icons"
import { AddCircle, AddCircleOutline, AddOutlined, CancelRounded, DeleteSweep, DeleteSweepOutlined } from "@mui/icons-material"
import { styles } from '../../../constants/styles'
import { useEffect, useMemo, useState } from "react"
import CustomItemList, { il_item } from "../../../components/FormComponents/CustomItemList"
import { getLoginIdList, getStaffTitle } from "../../../APICalls/staff"
import { Driver } from "../../../interfaces/driver"
import { useContainer } from "unstated-next"
import CommonTypeContainer from "../../../contexts/CommonTypeContainer"
import { getTenantById } from "../../../APICalls/tenantManage"
import { formValidate } from "../../../interfaces/common"
import { formErr } from "../../../constants/constant"

interface FormValues {
    [key: string]: string | string[]
}

interface DriverDetailProps {
    open: boolean
    onClose: () => void
    action: 'add' | 'edit' | 'delete'
    driver?: Driver | null
}

interface DriverInfo {
    driverExpId?: number,
    vehicleTypeId: string,
    licenseExp: string,
    workingExp: string
}
const DriverDetail: React.FC<DriverDetailProps> = ({ open, onClose, action }) => {
    const initialFormValues = {
        loginId: '',
        staffNameTchi: '',
        staffNameEng: '',
        staffNameSchi: '',
        licenseNo: '',
        contactNo: '',
        email: '',
        titleId: '',
        photo: []
    }
    const initDriverInfo: DriverInfo = {
        vehicleTypeId: '',
        licenseExp: '',
        workingExp: ''
    }
    const initDriverDetail: DriverInfo[] = [initDriverInfo]
    const { t, i18n } = useTranslation()
    const tenantId = localStorage.getItem('tenantId')
    const [pictures, setPictures] = useState<ImageListType>([])
    const [loginIdList, setLoginIdList] = useState<il_item[]>([])
    const [trySubmited, setTrySubmited] = useState<boolean>(false)
    const [selectedLoginId, setSelectedLoginId] = useState<string>('')
    const [formData, setFormData] = useState<FormValues>(initialFormValues)
    const [driverDetailList, setDriverDetailList] = useState<DriverInfo[]>(initDriverDetail)
    const [maxImageNumber, setMaxImageNumber] = useState(0)
    const [maxImageSize, setMaxImageSize] = useState(0)
    const [validation, setValidation] = useState<formValidate[]>([])

    const driverField = [
        {
            label: t('driver.DriverMenu.popUp.field.loginName'),
            placeholder: t('driver.DriverMenu.popUp.field.nameText'),
            field: 'loginId',
            type: 'autocomplete'
        },
        {
            label: t('driver.DriverMenu.popUp.field.TchiName'),
            placeholder: t('driver.DriverMenu.popUp.field.nameText'),
            field: 'driverNameTchi',
            type: 'text'
        },
        {
            label: t('driver.DriverMenu.popUp.field.SchiName'),
            placeholder: t('driver.DriverMenu.popUp.field.nameText'),
            field: 'driverNameSchi',
            type: 'text'
        },
        {
            label: t('driver.DriverMenu.popUp.field.engName'),
            placeholder: t('driver.DriverMenu.popUp.field.engText'),
            field: 'driverNameEng',
            type: 'text'
        },
        {
            label: t('driver.DriverMenu.popUp.field.linsenceName'),
            placeholder: t('driver.DriverMenu.popUp.field.linsenceText'),
            field: 'licenseNo',
            type: 'text'
        },
        {
            label: t('driver.DriverMenu.popUp.field.uploadLinsence'),
            placeholder: t('report.uploadPictures'),
            field: 'photo',
            type: 'upload'
        },
        {
            label: '',
            placeholder: '',
            field: '',
            type: 'select'
        },
    ]

    const validate = ()=>{
        const tempV:formValidate[]=[]
        Object.keys(formData).forEach((key)=>{
            if(key !== 'photo' && formData[key] ===''){
                const item = driverField.find((d)=>d.field === key)
                if(item){
                    tempV.push({
                        field:item.label,
                        problem:formErr.empty
                    })
                }
            }
        })
    }

    const removeImage = (index: number) => {
        // Remove the image at the specified index
        const newPictures = [...pictures]
        newPictures.splice(index, 1)
        setPictures(newPictures)
    }

    const initLoginIdList = async () => {
        const result = await getLoginIdList()
        if (result) {
            const data = result.data
            const staffTitle: il_item[] = []
            data.forEach((item: any) => {
                staffTitle.push({
                    id: item.loginId,
                    name: item.loginId
                })
            })
            setLoginIdList(staffTitle)
        }
    }

    const checkString = (s: string) => {
        if (!trySubmited) {
            return false
        }
        return s == ''
    }

    const { vehicleType } =
        useContainer(CommonTypeContainer);

    const handleFieldChange = (field: keyof FormValues, value: string) => {
        setFormData({
            ...formData,
            [field]: value
        })
    }

    const handleRemoveInfo = (idx: number) => {
        const tempInfoList = [...driverDetailList]
        tempInfoList.splice(idx, 1)
        setDriverDetailList([...tempInfoList])
    }

    const handleEditInfo = (idx: number, field: (keyof DriverInfo), value: string) => {
        let tempInfoList = [...driverDetailList]
        let filedValue = tempInfoList[idx]
        filedValue = {
            ...filedValue,
            [field]: value
        }
        tempInfoList.splice(idx, 1, filedValue)
        setDriverDetailList([...tempInfoList])
    }

    const getvehicleType = useMemo(() => {
        if (vehicleType) {
            const carType: il_item[] = []
            vehicleType?.forEach((vehicle) => {
                let name = ''
                switch (i18n.language) {
                    case 'enus':
                        name = vehicle.vehicleTypeNameEng
                        break
                    case 'zhch':
                        name = vehicle.vehicleTypeNameSchi
                        break
                    case 'zhhk':
                        name = vehicle.vehicleTypeNameTchi
                        break
                    default:
                        name = vehicle.vehicleTypeNameTchi //default fallback language is zhhk
                        break
                }
                const vehicleType: il_item = {
                    id: vehicle.vehicleTypeId,
                    name: name
                }
                carType.push(vehicleType)
            })
            return carType
        }
        return []
    }, [i18n.language, vehicleType])

    const initLimit = async () => {
        if (tenantId) {
            const res = await getTenantById(parseInt(tenantId))
            if (res?.data) {
                // Hardcode maxupload = 3
                setMaxImageNumber(res.data?.allowImgNum as number || 3)
                setMaxImageSize(res.data?.allowImgSize as number || 3 * 1000 * 1000)
            }
        }

    }

    const handleSubmit = ()=>{
        const formValues = {
            loginId: selectedLoginId,
        }
    }

    useEffect(() => {
        if (action === 'add') {
            initLoginIdList()
            setFormData(initialFormValues)
            initLimit()
        } else {

        }

    }, [open])
    return (
        <div className="add-vehicle">
            <RightOverlayForm
                open={open}
                onClose={onClose}
                anchor="right"
                headerProps={{
                    title: action === 'add'
                        ? t('driver.DriverMenu.popUp.addTitle')
                        : action === 'edit' ? t('driver.DriverMenu.popUp.editTitle')
                            : action === 'delete' ? t('driver.DriverMenu.popUp.deleteTitle') : '',
                    submitText: t('driver.DriverMenu.popUp.saveText'),
                    cancelText: t('driver.DriverMenu.popUp.removeText'),
                    onCloseHeader: onClose,
                    onSubmit: handleSubmit
                }}
            >
                <Divider />
                <Box sx={{ paddingX: 2 }}>
                    <Grid
                        container
                        direction={'column'}
                        spacing={4}
                        sx={{
                            width: { xs: '100%' },
                            marginTop: { sm: 2, xs: 6 },
                            marginLeft: {
                                xs: 0
                            },
                            paddingRight: 2
                        }}
                        className="sm:ml-0 mt-o w-full">
                        {driverField.map((driver) =>
                            driver.type === 'text' ? (
                                <Grid item key={driver.label}>
                                    <CustomField label={driver.label} mandatory>
                                        <CustomTextField
                                            id={driver.label}
                                            disabled={action === 'delete'}
                                            placeholder={driver.placeholder}
                                            onChange={(e) => {
                                                handleFieldChange(
                                                    driver.field as keyof FormValues,
                                                    e.target.value
                                                )
                                            }}
                                            value={formData[driver.field] as string}
                                            error={checkString(formData[driver.field] as string)}
                                        />
                                    </CustomField>
                                </Grid>
                            ) : driver.type === 'upload' ? (
                                maxImageNumber > 0 && maxImageSize > 0 &&
                                <Grid item key={driver.label}>
                                    <CustomField label={driver.label} mandatory>
                                        <ImageUploading
                                            multiple
                                            value={pictures}
                                            onChange={(imageList) => { setPictures(imageList) }}
                                            dataURLKey="data_url"
                                            maxFileSize={maxImageSize}
                                            maxNumber={maxImageNumber}
                                        >
                                            {({ imageList, onImageUpload, onImageRemove }) => (
                                                <Box className="box">
                                                    <Card
                                                        sx={{
                                                            ...localstyles.cardImg,
                                                              ...(trySubmited &&
                                                                (imageList.length === 0) &&
                                                                localstyles.imgError)
                                                        }}
                                                    >
                                                        <ButtonBase
                                                            sx={localstyles.btnBase}
                                                            onClick={(event) => onImageUpload()}
                                                        >
                                                            <CAMERA_OUTLINE_ICON style={{ color: '#ACACAC' }} />
                                                            <Typography
                                                                sx={[styles.labelField, { fontWeight: 'bold' }]}
                                                            >
                                                                {t('report.uploadPictures')}
                                                            </Typography>
                                                        </ButtonBase>
                                                    </Card>
                                                    <ImageList sx={localstyles.imagesContainer} cols={4}>
                                                        {imageList.map((image, index) => (
                                                            <ImageListItem
                                                                key={image['file']?.name}
                                                                style={{ position: 'relative', width: '100px' }}
                                                            >
                                                                <img
                                                                    style={localstyles.image}
                                                                    src={image['data_url']}
                                                                    alt={image['file']?.name}
                                                                    loading="lazy"
                                                                />
                                                                <ButtonBase
                                                                    onClick={(event) => {
                                                                        onImageRemove(index)
                                                                        removeImage(index)
                                                                    }}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '2px',
                                                                        right: '2px',
                                                                        padding: '4px'
                                                                    }}
                                                                >
                                                                    <CancelRounded className="text-white" />
                                                                </ButtonBase>
                                                            </ImageListItem>
                                                        ))}
                                                    </ImageList>

                                                </Box>
                                            )}
                                        </ImageUploading>
                                    </CustomField>
                                </Grid>
                            ) : driver.type === 'select' ?
                                <Grid item>
                                    {driverDetailList.map((info, idx) =>
                                        <Grid container spacing={2} key={idx} sx={{ mt: 1 }}>
                                            <Grid item xs={4}>
                                                <CustomField
                                                    label={t('driver.DriverMenu.popUp.field.carType')}
                                                    mandatory
                                                >
                                                    <Autocomplete
                                                        disablePortal
                                                        id='vehicleTypeId'
                                                        options={getvehicleType}
                                                        getOptionLabel={(option) => option.name}
                                                        value={getvehicleType.find(item => item.id === info.vehicleTypeId) || null}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                placeholder={t('driver.DriverMenu.popUp.field.carTypeSelect')}
                                                                sx={[styles.textField, { width: '100%' }]}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    sx: styles.inputProps
                                                                }}
                                                                disabled={action != 'add'}
                                                                error={checkString(info.vehicleTypeId)}
                                                            />
                                                        )}
                                                        onChange={(e, value) => {
                                                            if (value) {
                                                                handleEditInfo(idx, 'vehicleTypeId', value.id)
                                                            }
                                                        }}

                                                    />
                                                </CustomField>
                                            </Grid>
                                            <Grid item xs>
                                                <CustomField
                                                    label={t('driver.DriverMenu.popUp.field.carYear')}
                                                    mandatory
                                                >
                                                    <TextField
                                                        sx={{ width: '12ch' }}
                                                        id='caryear'
                                                        placeholder={t('driver.DriverMenu.popUp.field.yearInput')}
                                                        onChange={(e) => {
                                                            handleEditInfo(idx, 'licenseExp', e.target.value)
                                                        }}
                                                        value={info.licenseExp}
                                                        error={checkString(info.licenseExp)}
                                                    />
                                                </CustomField>
                                            </Grid>
                                            <Grid item xs>
                                                <CustomField
                                                    label={t('driver.DriverMenu.popUp.field.driveYear')}
                                                    mandatory
                                                >
                                                    <TextField
                                                        sx={{ width: '12ch' }}
                                                        id='driveYear'
                                                        placeholder={t('driver.DriverMenu.popUp.field.yearInput')}
                                                        onChange={(e) => {
                                                            handleEditInfo(idx, 'workingExp', e.target.value)
                                                        }}
                                                        value={info.workingExp}
                                                        error={checkString(info.workingExp)}
                                                    />
                                                </CustomField>
                                            </Grid>
                                            <Grid item xs>
                                                {idx > 0
                                                    &&
                                                    <ButtonBase
                                                        sx={{
                                                            mt: 5
                                                        }}
                                                        onClick={() => handleRemoveInfo(idx)}>
                                                        <DeleteSweepOutlined style={{ color: '#ACACAC', fontSize: 30 }} />
                                                    </ButtonBase>}

                                            </Grid>
                                        </Grid>)
                                    }
                                    <Box>
                                        <Button
                                            sx={[
                                                styles.buttonOutlinedGreen,
                                                {
                                                    mt: 5,
                                                    width: '100%',
                                                    height: '40px'
                                                }]}
                                            onClick={() => setDriverDetailList([...driverDetailList, initDriverInfo])}
                                        >
                                            <AddCircle />
                                            <Typography sx={{ ml: 1 }}>
                                                {t('driver.DriverMenu.popUp.field.addvehicleButton')}
                                            </Typography>
                                        </Button>
                                    </Box>
                                    <Grid item sx={{ mt: 5 }}>
                                        <CustomField label={t('driver.DriverMenu.popUp.field.contactNo')} mandatory>
                                            <CustomTextField
                                                id={t('driver.DriverMenu.popUp.field.contactNo')}
                                                disabled={action === 'delete'}
                                                placeholder={t('driver.DriverMenu.popUp.field.contactText')}
                                                onChange={(e) => {
                                                    handleFieldChange(
                                                        'contactNo' as keyof FormValues,
                                                        e.target.value
                                                    )
                                                }}
                                                value={formData['contactNo'] as string}
                                            />
                                        </CustomField>
                                    </Grid>
                                </Grid>
                                :
                                driver.type === 'autocomplete' ? (
                                    <CustomField label={driver.label} mandatory>
                                        {action === 'add' ? (
                                            <Autocomplete
                                                disablePortal
                                                id='loginId'
                                                options={loginIdList}
                                                getOptionLabel={(option) => option.name}
                                                value={loginIdList.find(item => item.id === formData['loginId']) || null}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder={driver.placeholder}
                                                        sx={[styles.textField, { width: 320 }]}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            sx: styles.inputProps
                                                        }}
                                                        disabled={action != 'add'}
                                                        error={checkString(formData['loginId'] as string)}
                                                    />
                                                )}
                                                onChange={(_, value) => {
                                                    console.log(value);
                                                    
                                                    if (value) {
                                                        handleFieldChange(
                                                            driver.field as keyof FormValues,
                                                            value.id
                                                        )
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <TextField
                                                placeholder={driver.placeholder}
                                                sx={[styles.textField, { width: 320 }]}
                                                InputProps={{
                                                    readOnly: true,
                                                    sx: styles.inputProps
                                                }}
                                                disabled={true}
                                                value={selectedLoginId}
                                            />
                                        )}
                                    </CustomField>
                                ) : null)}
                    </Grid>
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
    }
}
export default DriverDetail