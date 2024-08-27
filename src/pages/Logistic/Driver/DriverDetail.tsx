import { AddCircle, CancelRounded, DeleteSweepOutlined } from "@mui/icons-material"
import { Autocomplete, Box, Button, ButtonBase, Card, Divider, Grid, ImageList, ImageListItem, TextField, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { useContainer } from "unstated-next"
import { createDriver, deleteDriver, editDriver } from "../../../APICalls/driver"
import { getLoginIdList } from "../../../APICalls/staff"
import { getTenantById } from "../../../APICalls/tenantManage"
import CustomField from "../../../components/FormComponents/CustomField"
import { il_item } from "../../../components/FormComponents/CustomItemList"
import CustomTextField from "../../../components/FormComponents/CustomTextField"
import { FormErrorMsg } from "../../../components/FormComponents/FormErrorMsg"
import RightOverlayForm from "../../../components/RightOverlayForm"
import { formErr } from "../../../constants/constant"
import { styles } from '../../../constants/styles'
import CommonTypeContainer from "../../../contexts/CommonTypeContainer"
import { formValidate } from "../../../interfaces/common"
import { Driver } from "../../../interfaces/driver"
import { CAMERA_OUTLINE_ICON } from "../../../themes/icons"
import { ImageToBase64, returnErrorMsg } from "../../../utils/utils"

interface FormValues {
    [key: string]: string | string[]
}

interface DriverDetailProps {
    open: boolean
    onClose: () => void
    action: 'add' | 'edit' | 'delete'
    driver?: Driver | null
    onSubmitData: (type: 'success' | 'error', msg: string) => void
}

interface DriverInfo {
    [key: string]: any,
    driverExpId?: number,
    vehicleTypeId: string,
    licenseExp: string,
    workingExp: string
}
const DriverDetail: React.FC<DriverDetailProps> = ({ open, onClose, action, onSubmitData, driver }) => {
    const initialFormValues = useMemo(()=>({
        loginId: '',
        driverNameTchi: '',
        driverNameEng: '',
        driverNameSchi: '',
        licenseNo: '',
        contactNo: '',
        photo: [],
        driverDetail: []
    }),[])
    const initDriverInfo: DriverInfo = useMemo(()=>(
        {
            vehicleTypeId: '',
            licenseExp: '',
            workingExp: ''
        }
    ),[])
    const initDriverDetail: DriverInfo[] = useMemo(()=> ([initDriverInfo]),[initDriverInfo])
    const { t, i18n } = useTranslation()
    const tenantId = localStorage.getItem('tenantId')
    const [pictures, setPictures] = useState<ImageListType>([])
    const [loginIdList, setLoginIdList] = useState<il_item[]>([])
    const [trySubmited, setTrySubmited] = useState<boolean>(false)
    const [formData, setFormData] = useState<FormValues>(initialFormValues)
    const [driverDetailList, setDriverDetailList] = useState<DriverInfo[]>(initDriverDetail)
    const [maxImageNumber, setMaxImageNumber] = useState(0)
    const [maxImageSize, setMaxImageSize] = useState(0)
    const [validation, setValidation] = useState<formValidate[]>([])
    const [version, setVersion] = useState<number>(0)

    const driverField = useMemo(() => (
        [
            {
                label: t('driver.DriverMenu.popUp.field.loginName'),
                placeholder: t('driver.DriverMenu.popUp.field.nameText'),
                field: 'loginId',
                type: 'text'
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
            {
                label: t('driver.DriverMenu.popUp.field.contactNo'),
                placeholder: '',
                field: 'contactNo',
                type: ''
            },
        ]
    ), [t])

    const validate = useCallback(() => {
        const tempV: formValidate[] = []
        Object.keys(formData).forEach((key) => {
            if (key !== 'photo' && formData[key] === '') {
                const item = driverField.find((d) => d.field === key)
                if (item) {
                    tempV.push({
                        field: item.label,
                        problem: formErr.empty,
                        type: 'error'
                    })
                }
            }
            if (key == 'photo' && pictures.length == 0) {
                const item = driverField.find((d) => d.field === key)
                if (item) {
                    tempV.push({
                        field: item.label,
                        problem: formErr.empty,
                        type: 'error'
                    })
                }
            }
        })
        driverDetailList.forEach((item: DriverInfo, index: number) => {
            Object.keys(item).forEach((key) => {
                if (!item[key]) {
                    let field = ''
                    switch (key) {
                        case 'vehicleTypeId':
                            field = t('driver.DriverMenu.popUp.field.carType')
                            break;
                        case 'licenseExp':
                            field = t('driver.DriverMenu.popUp.field.carYear')
                            break;
                        case 'workingExp':
                            field = t('driver.DriverMenu.popUp.field.driveYear')
                            break;
                        default:
                            break;
                    }
                    tempV.push({
                        field: field,
                        problem: formErr.empty,
                        type: 'error'
                    })
                }
            })
        })
        setValidation(tempV)
    }, [
        formData,
        setValidation,
        driverField,
        driverDetailList
    ])

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
        return s === ''
    }

    const { vehicleType, imgSettings } =
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

    const initLimit = useCallback(async () => {
        if (tenantId) {
            const res = await getTenantById(parseInt(tenantId))
            if (res?.data) {
                setMaxImageNumber(res.data?.allowImgNum as number)
                setMaxImageSize(res.data?.allowImgSize as number)
            }
        }
    },[tenantId]) 

    const mappingData = useCallback(() => {
        if (driver !== null && driver) {
            setFormData({
                loginId: driver.loginId,
                driverNameTchi: driver.driverNameTchi,
                driverNameEng: driver.driverNameEng,
                driverNameSchi: driver.driverNameSchi,
                licenseNo: driver.licenseNo,
                contactNo: driver.contactNo,
            })
            if (driver.driverDetail.length > 0) {
                setDriverDetailList([...driver.driverDetail])
            }
            setVersion(driver.version)

            const imageList: any = driver.photo.map(
                (url: string, index: number) => {
                    const format = url.startsWith('data:image/png') ? 'png' : 'jpeg'
                    const imgdata = `data:image/${format};base64,${url}`

                    return {
                        data_url: imgdata,
                        file: {
                            name: `image${index + 1}`,
                            size: 0,
                            type: 'image/jpeg'
                        }
                    }
                }
            )

            setPictures(imageList)
        }
    },[driver]) 

    const resetData = useCallback(() => {
        setPictures([])
        setFormData(initialFormValues)
        setDriverDetailList(initDriverDetail)
    },[initDriverDetail, initialFormValues])

    const handleSubmit = async () => {
        const formValues = {
            ...formData,
            photo: ImageToBase64(pictures),
            driverDetail: driverDetailList,
            status: 'ACTIVE',
            version: version,
        }

        console.log(formValues, 'formValues')
        const user = localStorage.getItem('username')
        if (action === 'add' || action === 'edit') {
            setTrySubmited(true)
            if (validation.length === 0) {
                if (action === 'add') {
                    const res = await createDriver({ ...formValues, createdBy: user, updatedBy: user })
                    if (res) {
                        onSubmitData('success', t('driver.DriverMenu.popUp.field.createSuccessMsg'))
                        resetData()
                        onClose()
                    } else {
                        onSubmitData('error', t('driver.DriverMenu.popUp.field.createFailMsg'))
                    }
                }
                if (action === 'edit') {
                    const res = await editDriver({ ...formValues, updatedBy: user }, driver?.driverId.toString()!)
                    if (res) {
                        onSubmitData('success', t('driver.DriverMenu.popUp.field.editSuccessMsg'))
                        onClose()
                    } else {
                        onSubmitData('error', t('driver.DriverMenu.popUp.field.editFailMsg'))
                    }
                }
            }
        }
        if (action === 'delete') {
            const res = await deleteDriver({ status: 'DELETED', updatedBy: user }, driver?.driverId.toString()!)
            if (res) {
                onSubmitData('success', t('driver.DriverMenu.popUp.field.deleteSuccessMsg'))
                onClose()
            } else {
                onSubmitData('error', t('driver.DriverMenu.popUp.field.deleteFailMsg'))
            }
        }
    }
    useEffect(() => {
        validate()
    }, [validate])

    useEffect(() => {
        initLoginIdList()
        initLimit()
        if (action === 'add') {
            setTrySubmited(false)
            setFormData(initialFormValues)
            resetData()
        } else {
            mappingData()
        }

    }, [open, action, initLimit, initialFormValues, mappingData, resetData])
    return (
        <div className="add-vehicle">
            <RightOverlayForm
                open={open}
                onClose={onClose}
                action={action}
                anchor="right"
                headerProps={{
                    title: action === 'add'
                        ? t('driver.DriverMenu.popUp.addTitle')
                        : action === 'edit' ? t('driver.DriverMenu.popUp.editTitle')
                            : action === 'delete' ? t('driver.DriverMenu.popUp.deleteTitle') : '',
                    submitText: t('driver.DriverMenu.popUp.saveText'),
                    cancelText: t('driver.DriverMenu.popUp.removeText'),
                    onCloseHeader: onClose,
                    onSubmit: handleSubmit,
                    onDelete: handleSubmit,
                    subTitle: driver?.labelId ? driver.labelId.toString() : ''
                }}
            >
                <Divider />
                <Box sx={{ paddingX: 2 }}>
                    <Grid
                        container
                        direction={'column'}
                        spacing={3}
                        sx={{
                            width: { xs: '100%' },
                            marginTop: { sm: 2, xs: 6 },
                            marginLeft: 0,
                            paddingRight: 2
                        }}
                        className="sm:ml-0 mt-o w-full">
                        {driverField.map((driver, driverIndex) =>
                            driver.type === 'text' ? (
                                <Grid item key={driverIndex.toString()}>
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
                                <Grid item key={driverIndex.toString()}>
                                    <CustomField label={driver.label} mandatory>
                                        <ImageUploading
                                            multiple
                                            value={pictures}
                                            onChange={(imageList, addUpdateIndex) => { 
                                                setPictures(imageList)
                                             }}
                                            dataURLKey="data_url"
                                            maxNumber={imgSettings?.ImgQuantity}
                                            maxFileSize={imgSettings?.ImgSize}
                                        >
                                            {({ imageList, onImageUpload, onImageRemove }) => (
                                                <Box className="box">
                                                    <Card
                                                        sx={{
                                                            ...localstyles.cardImg,
                                                        }}
                                                    >
                                                        <ButtonBase
                                                            sx={localstyles.btnBase}
                                                            onClick={() => {
                                                                if (action === 'delete') return
                                                                onImageUpload()
                                                            }}
                                                            disabled={action === 'delete'}
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
                                                                    disabled={action === 'delete'}
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
                                <Grid item key={driverIndex.toString()}>
                                    {driverDetailList.map((info, idx) =>
                                        <Grid container spacing={2} key={idx} sx={{ mt: 1 }}>
                                            <Grid item xs={4.5}>
                                                <CustomField
                                                    label={idx === 0 ? t('driver.DriverMenu.popUp.field.carType') : ''}
                                                >
                                                    <Autocomplete
                                                        disablePortal
                                                        disabled={action === 'delete'}
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
                                                                disabled={action !== 'add'}
                                                            />
                                                        )}
                                                        onChange={(_, value) => {
                                                            if (value) {
                                                                handleEditInfo(idx, 'vehicleTypeId', value.id)
                                                            }
                                                        }}
                                                        noOptionsText={t('common.noOptions')}
                                                    />
                                                </CustomField>
                                            </Grid>
                                            <Grid item xs>
                                                <CustomField
                                                    label={idx === 0 ? t('driver.DriverMenu.popUp.field.carYear') : ''}
                                                >
                                                    <TextField
                                                        sx={{ ...styles.textField, width: '12ch' }}
                                                        id='caryear'
                                                        placeholder={t('driver.DriverMenu.popUp.field.yearInput')}
                                                        onChange={(e) => {
                                                            handleEditInfo(idx, 'licenseExp', e.target.value)
                                                        }}
                                                        value={info.licenseExp}
                                                        disabled={action === 'delete'}
                                                    />
                                                </CustomField>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <CustomField
                                                    label={idx === 0 ? t('driver.DriverMenu.popUp.field.driveYear') : ''}
                                                >
                                                    <TextField
                                                        sx={{ ...styles.textField, width: '12ch' }}
                                                        id='driveYear'
                                                        placeholder={t('driver.DriverMenu.popUp.field.yearInput')}
                                                        onChange={(e) => {
                                                            handleEditInfo(idx, 'workingExp', e.target.value)
                                                        }}
                                                        value={info.workingExp}
                                                        disabled={action === 'delete'}
                                                    />
                                                </CustomField>
                                            </Grid>
                                            <Grid item xs>
                                                {idx > 0
                                                    &&
                                                    <ButtonBase onClick={() => handleRemoveInfo(idx)}>
                                                        <DeleteSweepOutlined style={{ color: '#ACACAC', fontSize: 30, marginTop: '13px' }} />
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
                                            disabled={action === 'delete'}
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
                                                error={checkString(formData['contactNo'] as string)}
                                            />
                                        </CustomField>
                                    </Grid>
                                </Grid>
                                :
                                driver.type === 'autocomplete' ? (
                                    <CustomField label={driver.label} mandatory  key={driverIndex.toString()}>
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
                                                        disabled={action !== 'add'}
                                                        error={checkString(formData['loginId'] as string)}
                                                    />
                                                )}
                                                onChange={(_, value) => {
                                                    if (value) {
                                                        handleFieldChange(
                                                            driver.field as keyof FormValues,
                                                            value.id
                                                        )
                                                    }   
                                                }}
                                                noOptionsText={t('common.noOptions')}
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
                                                value={formData['loginId']}
                                            />
                                        )}
                                    </CustomField>
                                ) : null)}
                        <Grid item sx={{ width: '100%' }}>
                            {trySubmited &&
                                validation.map((val, index) => (
                                    <FormErrorMsg
                                        key={index}
                                        field={t(val.field)}
                                        errorMsg={returnErrorMsg(val.problem, t)}
                                        type={val.type}
                                    />
                                ))}
                        </Grid>
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