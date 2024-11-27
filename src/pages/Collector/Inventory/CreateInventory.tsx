import React, { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Divider, InputAdornment, Select, SelectChangeEvent, MenuItem, FormControl, Typography, ImageList, ImageListItem, Card, ButtonBase } from '@mui/material';
import RightOverlayForm from '../../../components/RightOverlayForm';
import CustomField from '../../../components/FormComponents/CustomField';
import CustomTextField from '../../../components/FormComponents/CustomTextField';
import { useTranslation } from 'react-i18next';
import { useContainer } from 'unstated-next';
import CommonTypeContainer from '../../../contexts/CommonTypeContainer';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import { styles } from 'src/constants/styles'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import {
    formatWeight,
    getThemeColorRole,
    getThemeCustomList,
    ImageToBase64,
    onChangeWeight,
    returnErrorMsg
} from '../../../utils/utils';
import Switcher from '../../../../src/components/FormComponents/CustomSwitch';
import RecyclablesListSingleSelect from '../../../../src/components/SpecializeComponents/RecyclablesListSingleSelect';
import ProductListSingleSelect from '../../../../src/components/SpecializeComponents/ProductListSingleSelect';
import { formErr, Languages, localStorgeKeyName } from 'src/constants/constant';
import { singleProduct } from '../../../components/FormComponents/CreateRecycleForm'
import { collectionPoint, singleRecyclable } from 'src/interfaces/collectionPoint';
import { PackagingUnit } from 'src/interfaces/packagingUnit';
import i18n from 'src/setups/i18n';
import { FactoryData, FactoryWarehouseData } from 'src/interfaces/factory';
import { CAMERA_OUTLINE_ICON } from 'src/themes/icons';
import { FormErrorMsg } from 'src/components/FormComponents/FormErrorMsg';
import { formValidate, weightUnit } from 'src/interfaces/common';
import { createProcessIn, createProcessOut } from 'src/APICalls/Collector/inventory';
import { ProcessOut } from 'src/interfaces/processRecords';
import { ProcessDetailPhotoType, ProcessInType, ProcessOutType } from 'src/interfaces/inventory';

interface CreateInventoryItemProps {
    drawerOpen: boolean;
    colList: collectionPoint[];
    factoryDataList: FactoryData[];
    warehouseDataList: FactoryWarehouseData[];
    packagingUnit: PackagingUnit[];
    handleDrawerClose: () => void;
    onSuccess: (type: string, msg: string) => void
}

interface LocationOption {
    id: string | number;
    name: string;
    type: 'collectionPoint' | 'factory' | 'warehouse';
}

const CreateInventoryItem: React.FC<CreateInventoryItemProps> = ({ 
    drawerOpen, 
    colList,
    factoryDataList,
    warehouseDataList,
    packagingUnit,
    handleDrawerClose,
    onSuccess 
}) => {
    const { t } = useTranslation();
    const { recycType, imgSettings, decimalVal, productType, getProductType, weightUnits } = useContainer(CommonTypeContainer);
    
    // State management
    const [isRecyc, setIsRecyc] = useState<boolean>(true);
    const [itemCategory, setItemCategory] = useState(isRecyc ? 'Recyclables' : 'Product');
    const [packagingUnitValue, setPackagingUnitValue] = useState<PackagingUnit | null>(null);
    const [weight, setWeight] = useState('0');
    const [location, setLocation] = useState('');
    const [packageType, setPackageType] = useState('');
    const [selectedRecycType, setSelectedRecycType] = useState('');
    const [selectedRecycSubType, setSelectedRecycSubType] = useState('');
    const [productTypeId, setProductTypeId] = useState('');
    const [productSubTypeId, setProductSubTypeId] = useState('');
    const [productAddon, setProductAddon] = useState('');
    const [productSubtypeRemark, setProductSubtypeRemark] = useState('');
    const [productAddonRemark, setProductAddonRemark] = useState('');
    const [selectedWeightUnit, setSelectedWeightUnit] = useState<weightUnit>()
    const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'
    const colorTheme: string = getThemeColorRole(role) || '#79CA25'
    const customListTheme = getThemeCustomList(role) || '#E4F6DC'
    const [defaultRecyc, setDefaultRecyc] = useState<singleRecyclable>()
    const [defaultProduct, setDefaultProduct] = useState<singleProduct>()
    const [selectedLocationType, setSelectedLocationType] = useState<'collectionPoint' | 'factory' | 'warehouse'>('collectionPoint');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [pictures, setPictures] = useState<ImageListType>([])
    const [trySubmited, setTrySubmited] = useState<boolean>(false)
    const [validation, setValidation] = useState<formValidate[]>([])


    const getWeightUnits = (): { unitId: number; lang: string }[] => {
        let units: { unitId: number; lang: string }[] = []
        if (i18n.language === Languages.ENUS) {
            units = weightUnits.map((item) => {
            return {
                unitId: item?.unitId,
                lang: item?.unitNameEng
            }
            })
        } else if (i18n.language === Languages.ZHCH) {
            units = weightUnits.map((item) => {
            return {
                unitId: item?.unitId,
                lang: item?.unitNameSchi
            }
            })
        } else {
            units = weightUnits.map((item) => {
            return {
                unitId: item?.unitId,
                lang: item?.unitNameTchi
            }
            })
        }

        return units
    }
    
    useEffect(() => {
            resetData()
    }, [drawerOpen])

    const resetData = () => {
        setIsRecyc(true);
        setItemCategory('');
        setPackagingUnitValue(null);
        setWeight('0');
        setLocation('');
        setPackageType('');
        setSelectedRecycType('');
        setSelectedRecycSubType('');
        setProductTypeId('');
        setProductSubTypeId('');
        setProductAddon('');
        setProductSubtypeRemark('');
        setProductAddonRemark('');
        setSelectedWeightUnit(weightUnits[0]);
        setDefaultRecyc(undefined);
        setDefaultProduct(undefined);
        setSelectedLocation('');
        setSelectedLocationType('collectionPoint')
        setPictures([]);
        setTrySubmited(false);
        setValidation([]);
    };

    const handleLocationTypeChange = (type: 'collectionPoint' | 'factory' | 'warehouse') => {
        setSelectedLocationType(type);
    };

    useEffect(() => {
        const validate = async () => {
            const tempV: formValidate[] = []
    
            if (!packagingUnitValue) {
                tempV.push({
                    field: t('packaging_unit.packaging_unit'),
                    problem: formErr.empty,
                    type: 'error'
                })
            }
    
            if (isRecyc) {
                if (!selectedRecycType || !selectedRecycSubType) {
                    tempV.push({
                        field: t('col.recycType'),
                        problem: formErr.empty,
                        type: 'error'
                    })
                }
            } else {
                if (!productTypeId || !productSubTypeId) {
                    tempV.push({
                        field: t('pick_up_order.product_type.product'),
                        problem: formErr.empty,
                        type: 'error'
                    })
                }
            }
    
            if (!selectedLocation) {
                tempV.push({
                    field: t('processRecord.location'),
                    problem: formErr.empty,
                    type: 'error'
                })
            }
    
            if (weight === '0' || weight === '') {
                tempV.push({
                    field: t('inventory.weight'),
                    problem: formErr.empty,
                    type: 'error'
                })
            }
    
            if (pictures.length === 0) {
                tempV.push({
                    field: t('report.picture'),
                    problem: formErr.empty,
                    type: 'error'
                })
            } 
            console.log('tempV', tempV)
            setValidation(tempV)
        }
        validate()
    }, [packagingUnitValue, isRecyc, selectedRecycType, selectedRecycSubType, productTypeId, productSubTypeId, selectedLocation, weight, pictures, t])
    
    const handleSubmit = async () => {
        const submissionData = {
            itemCategory,
            packagingUnit: packagingUnitValue,
            recycType: isRecyc ? selectedRecycType : '',
            recycSubType: isRecyc ? selectedRecycSubType : '',
            productType: !isRecyc ? productTypeId : '',
            productSubType: !isRecyc ? productSubTypeId : '',
            productAddon: !isRecyc ? productAddon : '',
            weight,
            location,
            packageType
        };

        if (validation.length === 0) {
            const photos: ProcessDetailPhotoType[] = [];
            ImageToBase64(pictures)?.map((photo, idx) => {
                photos.push({sid: idx, photo: photo});
            });
            const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
            const dataProcessIn: ProcessInType = {
                processTypeId: '0',
                colId: selectedLocationType === "collectionPoint" ? Number(selectedLocation) : 0,
                warehouseId: selectedLocationType === "warehouse" ? Number(selectedLocation) : 0,
                address: selectedLocation,
                status: 'CREATED',
                createdBy: loginId,
                updatedBy: loginId,
                processinDatetime: new Date().toISOString(), 
                processinDetail: []
            }
            const result = await createProcessIn(dataProcessIn, "-1", "-1")
            if (result) {
                const dataProcessOut: ProcessOutType = {
                    status: 'CREATED',
                    processInId: result.data.processInId,
                    processOutDatetime: new Date().toISOString(), 
                    createdBy: loginId,
                    updatedBy: loginId,
                    processoutDetail: [{
                        recycTypeId: isRecyc? selectedRecycType : '',
                        recycSubTypeId: isRecyc ? selectedRecycSubType : '',
                        productTypeId: !isRecyc ? productSubTypeId: '',
                        productSubTypeId: !isRecyc ? productSubTypeId : '',
                        productSubTypeRemark: !isRecyc ? productSubtypeRemark : '',
                        productAddonTypeId: !isRecyc ? productAddon : '',
                        productAddonTypeRemark: !isRecyc ? productAddonRemark : '',
                        packageTypeId:packagingUnitValue ? String(packagingUnitValue.packagingTypeId) : '',
                        weight: Number(weight),
                        unitId: String(selectedWeightUnit?.unitId),
                        status: 'ACTIVE',
                        processoutDetailPhoto: photos,
                        itemId: null,
                        createdBy: loginId,
                        updatedBy: loginId,
                    }]
                }
                const resp = await createProcessOut(dataProcessOut, "-1", "-1")
                if (resp){
                    onSuccess('success', t('common.saveSuccessfully'))
                    resetData()
                    handleDrawerClose()
                }
            } else {
                onSuccess('error', t('common.saveFailed'))
                }
            } else {
            setTrySubmited(true)
        }

        setTrySubmited(true)
    };

    const onImageChange = (
        imageList: ImageListType,
        addUpdateIndex: number[] | undefined
        ) => {
            setPictures(imageList)
    }
    
    const removeImage = (index: number) => {
        const newPictures = [...pictures]
        newPictures.splice(index, 1)
        setPictures(newPictures)
    }
    
    const handleRecycChange = (values: any) => {
        console.log('Recycle Change Values:', values);
    
        if(values && values.recycTypeId){
            const newDefaultRecyc: singleRecyclable = {
                recycTypeId: values.recycTypeId,
                recycSubTypeId: values.recycSubTypeId,
            };
            
                setSelectedRecycType(values.recycTypeId);
            
                if (values.recycSubTypeId) {
                    setSelectedRecycSubType(values.recycSubTypeId);
                }
            
                setDefaultRecyc(newDefaultRecyc);
        }
    };

    const handleProductChange = (values: any) => {
        if (values && values.productTypeId) {
            const newDefaultProduct: singleProduct = {
                productTypeId: values.productTypeId || '',
                productSubTypeId: values.productSubTypeId || '',
                productAddonId: values.productAddonId || '',
                productAddOnTypeRemark: values.productAddOnTypeRemark || '',
                productSubTypeRemark:  values.productSubTypeRemark || '',
                isProductAddonTypeOthers: false,
            };
            setDefaultProduct(newDefaultProduct);
            setProductTypeId(values.productTypeId);
            setProductAddonRemark(values.productAddOnTypeRemark);
            setProductSubtypeRemark(values.productSubTypeRemark)
            
            if (values.productSubTypeId) {
                setProductSubTypeId(values.productSubTypeId);
            }
            if (values.productAddonId) {
                setProductAddon(values.productAddonId);
            }
        }
    };

    return (
        <RightOverlayForm
            open={drawerOpen}
            onClose={handleDrawerClose}
            anchor={'right'}
            action="add"
            useConfirmModal={true}
            headerProps={{
                title: t('top_menu.add_new'),
                subTitle: t('inventory.inventory'),
                submitText: t('common.save'),
                cancelText: t('common.cancel'),
                onCloseHeader: handleDrawerClose,
                onSubmit: handleSubmit
            }}
        >
            <Divider />
            <Box sx={{ px: 2 }}>
                <Grid
                    container
                    direction="column"
                    spacing={4}
                    sx={{
                        width: '100%',
                        mt: { sm: 2, xs: 6 },
                        ml: { xs: 0 },
                        pr: 2
                    }}
                >
                    <Grid item>
                        <Box>
                        <CustomField label={t('packaging_unit.packaging_unit')} mandatory>
                        <FormControl
                            sx={{
                            width: '100%'
                            }}
                        >
                            <Select
                                labelId="packagingUnit-label"
                                id="packagingUnit"
                                value={packagingUnitValue?.packagingNameEng ? String(packagingUnitValue.packagingNameEng) : ''}
                                sx={[
                                    styles.textField, 
                                    { 
                                        width: 400,
                                        borderRadius: '12px'
                                    }
                                ]}
                                onChange={(event: SelectChangeEvent<string>) => {
                                    const selectedValue = event.target.value ? event.target.value.trim().toLowerCase() : '';
                                    
                                    if (!selectedValue) {
                                        setPackagingUnitValue(null);
                                        return;
                                    }
                                
                                    const selectedUnit = packagingUnit.find(
                                        (item) => 
                                            (item.packagingNameEng || '').trim().toLowerCase() === selectedValue
                                    );
                                    
                                    if (selectedUnit) {
                                        setPackagingUnitValue(selectedUnit);
                                    } else {
                                        console.warn('No packaging unit found for:', selectedValue);
                                        setPackagingUnitValue(null);
                                    }
                                }}
                            >
                                {packagingUnit.length > 0 ? (
                                    packagingUnit.map((unit: PackagingUnit) => {
                                        const currentLang = i18n.language;
                                        let displayName;
                                        
                                        switch (currentLang) {
                                            case 'enus':
                                                displayName = unit.packagingNameEng;
                                                break;
                                            case 'zhch':
                                                displayName = unit.packagingNameSchi;
                                                break;
                                            case 'zhhk':
                                                displayName = unit.packagingNameTchi;
                                                break;
                                            default:
                                                displayName = unit.packagingNameEng;
                                        }

                                        return (
                                            <MenuItem key={unit.id} value={unit.packagingNameEng}>
                                                {displayName}
                                            </MenuItem>
                                        );
                                    })
                                ) : (
                                    <MenuItem disabled value="">
                                        <em>{t('common.noOptions')}</em>
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        </CustomField>
                        </Box>
                    </Grid>
                    <Grid item>
                        <CustomField label={t('pick_up_order.recyclForm.item_category')}>
                            <Switcher
                                onText={t('recyclables')}
                                offText={t('product')}
                                defaultValue={isRecyc}
                                setState={(newValue: boolean) => {
                                    setIsRecyc(newValue);
                                    if(newValue){
                                        setDefaultRecyc(undefined)
                                    } else {
                                        setDefaultProduct(undefined)
                                    }
                                }}
                            />
                        </CustomField>
                    </Grid>

                    <Grid item>
                    {isRecyc ? (
                        <CustomField label={t('col.recycType')} mandatory>
                            <RecyclablesListSingleSelect
                                showError={undefined} 
                                recycL={recycType ?? []}
                                setState={(values) => handleRecycChange(values)}
                                itemColor={{
                                bgColor: customListTheme ? customListTheme.bgColor : '#E4F6DC',
                                borderColor: customListTheme ? customListTheme.border : '79CA25'
                                }}
                                defaultRecycL={defaultRecyc}
                                key={selectedRecycSubType}
                            />
                            </CustomField>
                        ) : (
                            <CustomField label={t('pick_up_order.product_type.product')} mandatory>
                            <ProductListSingleSelect
                                showError={undefined} 
                                label={t('pick_up_order.product_type.product')}
                                options={productType ?? []}
                                setState={(values) => handleProductChange(values)}
                                itemColor={{
                                bgColor: customListTheme ? customListTheme.bgColor : '#E4F6DC',
                                borderColor: customListTheme ? customListTheme.border : '79CA25'
                                }}
                                defaultProduct={defaultProduct}
                                key={productTypeId}
                            />
                            </CustomField>
                        )}
                    </Grid>
                    <Grid item>
                        <CustomField label={t('processRecord.location')} mandatory>  
                        <Select
                            value={selectedLocation}
                            onChange={(e) => {
                                const value = e.target.value as string;
                                if (value) {
                                    setSelectedLocation(value);
                                    const [locationType, locationId] = value.split(':');
                                    setSelectedLocationType(locationType as 'collectionPoint' | 'factory' | 'warehouse');
                                }
                            }}
                            sx={[
                                styles.textField, 
                                { 
                                    width: 400,
                                    borderRadius: '12px'
                                }
                            ]}
                            displayEmpty
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <em>{t('inventory.select_location')}</em>;
                                }
                                const [type, id] = selected.split(':');
                                // Find and display the corresponding location name based on type and id
                                switch(type) {
                                    case 'collectionPoint':
                                        const colPoint = colList.find(point => point.colId.toString() === id);
                                        return colPoint ? colPoint.colName : selected;
                                    case 'warehouse':
                                        const warehouse = warehouseDataList.find(w => w.warehouseId.toString() === id);
                                        return warehouse ? (
                                            i18n.language === 'enus' ? warehouse.warehouseNameEng :
                                            i18n.language === 'zhch' ? warehouse.warehouseNameSchi :
                                            i18n.language === 'zhhk' ? warehouse.warehouseNameTchi : warehouse.warehouseNameEng
                                        ) : selected;
                                    case 'factory':
                                        const factory = factoryDataList.find(f => f.factoryNameEng === id);
                                        return factory ? (
                                            i18n.language === 'enus' ? factory.factoryNameEng :
                                            i18n.language === 'zhch' ? factory.factoryNameSchi :
                                            i18n.language === 'zhhk' ? factory.factoryNameTchi : factory.factoryNameEng
                                        ) : selected;
                                    default:
                                        return selected;
                                }
                            }}
                        >
                            {/* Collection Points Section */}
                            <MenuItem disabled>{t('collection_Point')}</MenuItem>
                            {colList.map((point) => (
                                <MenuItem 
                                    key={`collection-${point.colId}`} 
                                    value={`collectionPoint:${point.colId}`}
                                    sx={{ pl: 4 }}
                                >
                                    {point.colName}
                                </MenuItem>
                            ))}

                            {/* Warehouses Section */}
                            <MenuItem disabled>{t('top_menu.workshop')}</MenuItem>
                            {warehouseDataList.map((warehouse) => (
                                <MenuItem 
                                    key={`warehouse-${warehouse.warehouseId}`} 
                                    value={`warehouse:${warehouse.warehouseId}`}
                                    sx={{ pl: 4 }}
                                >
                                    {i18n.language === 'enus' ? warehouse.warehouseNameEng :
                                    i18n.language === 'zhch' ? warehouse.warehouseNameSchi :
                                    i18n.language === 'zhhk' ? warehouse.warehouseNameTchi : warehouse.warehouseNameEng}
                                </MenuItem>
                            ))}

                            {/* Factories Section */}
                            <MenuItem disabled>{t('factory.factory')}</MenuItem>
                            {factoryDataList.map((factory) => (
                                <MenuItem 
                                    key={`factory-${factory.factoryId}`} 
                                    value={`factory:${factory.factoryNameEng}`}
                                    sx={{ pl: 4 }}
                                >
                                    {i18n.language === 'enus' ? factory.factoryNameEng :
                                    i18n.language === 'zhch' ? factory.factoryNameSchi :
                                    i18n.language === 'zhhk' ? factory.factoryNameTchi : factory.factoryNameEng}
                                </MenuItem>
                            ))}
                        </Select>
                        </CustomField>
                    </Grid>
                    <Grid item>
                        <CustomField label={t('inventory.weight')} mandatory>
                            <CustomTextField
                                id="weight"
                                placeholder={t('inventory.enterWeight')}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    const rawValue = event.target.value;
                                    if (!rawValue || isNaN(Number(rawValue))) {
                                        setWeight(''); 
                                        return;
                                    }
                                    onChangeWeight(rawValue, decimalVal, (formattedValue: string) => {
                                        setWeight(formatWeight(formattedValue, decimalVal));
                                    });
                                }}
                                sx={{
                                    '.MuiInputBase-root': {
                                        paddingRight: 0, 
                                    },
                                    '& .MuiInputAdornment-root': {
                                        marginRight: 0, 
                                    },
                                }}
                                value={weight}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Select
                                            value={selectedWeightUnit?.unitId.toString() || ''}
                                            onChange={(e) => {
                                                const selectedUnit = weightUnits.find(
                                                    unit => unit.unitId.toString() === e.target.value
                                                );
                                                setSelectedWeightUnit(selectedUnit);
                                            }}
                                            sx={{
                                                '.MuiOutlinedInput-notchedOutline': {
                                                    border: 'none', 
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none', 
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none', 
                                                },
                                            }}
                                        >
                                            {getWeightUnits().map((unit) => (
                                                <MenuItem key={unit.unitId} value={unit.unitId.toString()}>
                                                    {unit.lang}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </InputAdornment>
                                }
                            />
                        </CustomField>
                    </Grid>
                    <Grid item>
                        {/* image field */}
                        <Box key={t('report.picture')} >
                            <Typography sx={{ ...styles.header3, marginBottom: 2 }}>
                            {t('report.picture')}
                            </Typography>
                            <ImageUploading
                            multiple
                            value={pictures}
                            onChange={(imageList, addUpdateIndex) =>
                                onImageChange(imageList, addUpdateIndex)
                            }
                            maxNumber={imgSettings?.ImgQuantity}
                            maxFileSize={imgSettings?.ImgSize}
                            dataURLKey="data_url"
                            acceptType={['jpg', 'jpeg', 'png']}
                            >
                            {({ imageList, onImageUpload, onImageRemove, errors }) => (
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
                                {errors && (
                                    <div>
                                    {errors.maxFileSize && (
                                    <span  style={{color: "red"}}>
                                        Selected file size exceeds maximum file size {imgSettings?.ImgSize/1000000} mb
                                    </span>
                                    )}
                                    </div>
                                )}
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
                                        <CancelRoundedIcon className="text-white" />
                                        </ButtonBase>
                                    </ImageListItem>
                                    ))}
                                </ImageList>
                                </Box>
                            )}
                            </ImageUploading>
                        </Box>
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
                </Grid>
            </Box>
        </RightOverlayForm>
    );
};

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
    
export default CreateInventoryItem;

