import { FunctionComponent, useState, useEffect } from 'react'
import {
    Box,
    Divider,
} from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { styles } from '../../../constants/styles'

import { useTranslation } from 'react-i18next'
import { localStorgeKeyName } from "../../../constants/constant";
import { createPackaging, editPackaging } from '../../../APICalls/Collector/packagingUnit'
import { returnApiToken } from '../../../utils/utils'
import { createPackagingUnit, editPackagingUnit } from '../../../APICalls/Customer/packagingUnit'

interface PackagingUnit {
    packagingTypeId: string
  tenantId: string
  packagingNameTchi: string
  packagingNameSchi: string
  packagingNameEng: string
  description: string
  remark: string
  status: string
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
  }

interface CreatePackagingProps {
    drawerOpen: boolean
    handleDrawerClose: () => void
    action: 'add' | 'edit' | 'delete' | 'none'
    onSubmitData: (type: string, msg: string) => void
    rowId?: number,
    selectedItem?: PackagingUnit | null
}

const CreatePackagingUnit: FunctionComponent<CreatePackagingProps> = ({
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
    const [brNo, setBRNumber] = useState('')
    const [description, setDescription] = useState('')
    const [remark, setRemark] = useState('')
    const [packagingId, setPackagingId] = useState('')
    const [status, setStatus] = useState('')
    const [trySubmited, setTrySubmited] = useState<boolean>(false)


    useEffect(() => {
        if (action === 'edit' || action === 'delete') {
            if (selectedItem !== null && selectedItem !== undefined) {
                setPackagingId(selectedItem.packagingTypeId)
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
        setPackagingId('')
        setTChineseName('')
        setSChineseName('')
        setEnglishName('')
        setDescription('')
        setRemark('')
        setStatus('')
    }


    const checkString = (s: string) => {
        if (!trySubmited) {
            //before first submit, don't check the validation
            return false
        }
        return s == ''
    }

    const handleSubmit = () => {
        const token = returnApiToken()

        const formData = {
            tenantId: token.tenantId,
            packagingNameTchi: tChineseName,
            packagingNameSchi: sChineseName,
            packagingNameEng: englishName,
            description: description,
            remark: remark,
            status: 'ACTIVE',
            createdBy: token.loginId,
            updatedBy: token.loginId
        }

        if (action == 'add') {
            handleCreatePackaging(formData)
        } else if (action == 'edit') {
            handleEditPackaging(formData, packagingId)
        } else if (action === 'delete') {
            handleDelete()
        }
    }

    const handleCreatePackaging = async (formData: any) => {
        const result = await createPackaging(formData)
        if (result) {
            onSubmitData("success", t('common.saveSuccessfully'))
            resetData()
            handleDrawerClose()
        } else {
            onSubmitData("error", t('common.saveFailed'))
        }
    }

    const handleEditPackaging = async (formData: any, collectorId: string) => {
        const result = await editPackaging(formData, collectorId)
        if (result) {
            onSubmitData("success", t('common.editSuccessfully'))
            resetData()
            handleDrawerClose()
        }
    }

    const handleDelete = async () => {
        const token = returnApiToken()

        const formData = {
            tenantId: token.tenantId,
            packagingNameTchi: tChineseName,
            packagingNameSchi: sChineseName,
            packagingNameEng: englishName,
            description: description,
            remark: remark,
            status: 'DELETED',
            createdBy: token.loginId,
            updatedBy: token.loginId
        }

      if(selectedItem != null){
        const result = await editPackaging(formData, packagingId)
        if(result) {
          onSubmitData("success", t('common.deletedSuccessfully'))
          resetData()
          handleDrawerClose()
        } else {
          onSubmitData("error", t('common.deleteFailed'))
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
                      : selectedItem?.packagingTypeId,
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
                    <Box sx={{ marginY: 2 }}>
                        <CustomField label={t('general_settings.reference_number')}>
                            <CustomTextField
                                id="brNo"
                                value={brNo}
                                disabled={action === 'delete'}
                                placeholder={t('general_settings.reference_number')}
                                onChange={(event) => setBRNumber(event.target.value)}
                                error={checkString(brNo)}
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

export default CreatePackagingUnit
