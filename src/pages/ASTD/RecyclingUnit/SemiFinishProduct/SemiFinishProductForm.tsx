import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Box, FormControl, InputLabel, Select, MenuItem, Tabs, Tab, Typography } from '@mui/material';
import RightOverlayForm from '../../../../components/RightOverlayForm';
import CustomField from '../../../../components/FormComponents/CustomField';
import CustomTextField from '../../../../components/FormComponents/CustomTextField';
import { Products, ProductPayload } from '../../../../types/settings';
import { createProductType, editProductType, editProductSubtype, editProductAddonType } from '../../../../APICalls/ASTD/settings/productType';

const validationSchema = Yup.object({
  traditionalName: Yup.string().required('Required'),
  simplifiedName: Yup.string().required('Required'),
  englishName: Yup.string().required('Required'),
  category: Yup.string().required('Please select a category'),
  subcategory: Yup.string().required('Please select a subcategory'),
  introduction: Yup.string(),
  remarks: Yup.string(),
});

type SemiFinishProductProps = {
  isEditMode?: boolean;
  initialData?: Products;
  paramId?: string;
  activeTab?: number;
  handleClose: () => void;
  handleSubmit: () => void;
  open: boolean;
};

function TabPanel(props: { children: React.ReactNode; value: number; index: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div
      data-testId="astd-semi-product-new-button-473"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


const SemiFinishProductForm: React.FC<SemiFinishProductProps> = (
  {
    isEditMode = false, 
    initialData, 
    open, 
    activeTab, 
    paramId, 
    handleClose, 
    handleSubmit
  }
) => {
  const [tabIndex, setTabIndex] = useState<number>(activeTab || 0);
  const {t} = useTranslation()
  const handleTabChange = (event: React.ChangeEvent<{}>, newIndex: number) => {
    setTabIndex(newIndex);
  };

  const formik = useFormik({
    initialValues: {
      traditionalName: initialData?.productNameTchi || '',
      simplifiedName: initialData?.productNameSchi || '',
      englishName: initialData?.productNameEng || '',
      category: '',
      subcategory: '',
      introduction: initialData?.description || '',
      remarks: initialData?.remark || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        productNameTchi: values.traditionalName,
        productNameSchi: values.simplifiedName,
        productNameEng: values.englishName,
        description: values.introduction,
        remark: values.remarks,
        createdBy: localStorage.getItem('username') || '',
        updatedBy: localStorage.getItem('username') || '',
      };
      console.log(payload);
      handleSubmit();
    },
  });
  
  const onSubmitForm = async (): Promise<void> => {
    try {
      const payload: ProductPayload = {
        productNameTchi: formik.values.traditionalName,
        productNameSchi: formik.values.simplifiedName,
        productNameEng: formik.values.englishName,
        description: formik.values.introduction,
        remark: formik.values.remarks,
        updatedBy: localStorage.getItem('username') || '',
        createdBy: localStorage.getItem('username') || ''
      };
  
      if (isEditMode && initialData) {
        await handleEdit(payload);
      } else {
        await handleCreate(payload);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };
  
  const handleEdit = async (payload: ProductPayload): Promise<void> => {
    if (!paramId) {
      throw new Error('Missing parameter ID for edit operation.');
    }
  
    const version =initialData?.version 
    let editPayload: ProductPayload = { ...payload, status: 0, version };
  
    switch (activeTab) {
      case 0:
        await editProductType(paramId, editPayload);
        toast.success('Product type updated successfully!');
        break;
      case 1:
        editPayload = { ...editPayload, productTypeId: paramId };
        await editProductSubtype(paramId, editPayload);
        toast.success('Product subtype updated successfully!');
        break;
      case 2:
        editPayload = { ...editPayload, productSubTypeId: paramId, };
        await editProductAddonType(paramId, editPayload);
        toast.success('Product addon type updated successfully!');
        break;
      default:
        throw new Error('Invalid active tab selection.');
    }
  
    handleSubmit();
    handleClose();
  };
  
  const handleCreate = async (payload: ProductPayload): Promise<void> => {
    const createPayload: ProductPayload = { ...payload };
    const response = await createProductType(createPayload);
    console.log('API Response:', response.data);
    toast.success('Product type created successfully!');
  
    handleSubmit();
    handleClose();
  };

  useEffect(() => {
    setTabIndex(activeTab || 0);
  }, [activeTab]);

  return (
    <RightOverlayForm
      open={open}
      onClose={handleClose}
      anchor="right"
      showHeader={true}
      headerProps={{
        title:   t('settings_page.recycling.add_new'),
        subTitle: t('settings_page.recycling.product_category'),
        submitText: 'Save',
        cancelText: 'Cancel',
        onCloseHeader: handleClose,
        onSubmit: () => onSubmitForm(),
      }}
    >
      <form onSubmit={formik.handleSubmit} data-testId="astd-semi-product-form-564">
        <Box display="flex" flexDirection="column" gap={2} padding="25px">
          <Box mb="16px">
            <CustomField label={ t('settings_page.recycling.traditional_chinese_name')} mandatory>
              <CustomTextField
                dataTestId="astd-semi-product-traditional-name-473"
                id="traditionalName"
                value={formik.values.traditionalName}
                placeholder={t('settings_page.recycling.traditional_chinese_name_placeholder')}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.traditionalName && Boolean(formik.errors.traditionalName)}
                helperText={formik.touched.traditionalName && formik.errors.traditionalName}
              />
            </CustomField>
          </Box>

          <Box mb="16px">
           
            <CustomField label={ t('settings_page.recycling.simplified_chinese_name')} mandatory>
              <CustomTextField
                dataTestId="astd-semi-product-simplified-name-391"
                id="simplifiedName"
                value={formik.values.simplifiedName}
                placeholder={t('settings_page.recycling.simplified_chinese_name_placeholder')}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.simplifiedName && Boolean(formik.errors.simplifiedName)}
                helperText={formik.touched.simplifiedName && formik.errors.simplifiedName}
              />
            </CustomField>
          </Box>

          <Box mb="16px">
            {/* English Name */}
            <CustomField label={t('settings_page.recycling.english_name')} mandatory>
              <CustomTextField
                id="englishName"
                dataTestId="astd-semi-product-english-name-829"
                value={formik.values.englishName}
                placeholder={t('settings_page.recycling.english_name_placeholder')}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.englishName && Boolean(formik.errors.englishName)}
                helperText={formik.touched.englishName && formik.errors.englishName}
              />
            </CustomField>
          </Box>

          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="form tabs">
            <Tab label={t('settings_page.recycling.main_category')}/>
            <Tab label={t('settings_page.recycling.sub_category')} />
            <Tab label={t('settings_page.recycling.additional_category')}/>
          </Tabs>

          <TabPanel value={tabIndex} index={0} data-testId="astd-semi-product-tabpanel-main-category-219">
            <Box mb="16px">
              {/* 簡介 - Introduction */}
              <CustomField  label={t('settings_page.recycling.introduction')}>
                <CustomTextField
                  data-testId="astd-semi-product-main-category-introduction-625"
                  id="introduction"
                  value={formik.values.introduction}
                  placeholder={t('settings_page.recycling.enter_text')}
                  onChange={formik.handleChange}
                  multiline
                  rows={4}
                />
              </CustomField>
            </Box>

            <Box mb="16px">
              {/* 備註 - Remarks */}
              <CustomField label={t('settings_page.recycling.remarks')}>
                <CustomTextField
                  dataTestId="astd-semi-product-main-category-remarks-904"
                  id="remarks"
                  value={formik.values.remarks}
                  placeholder={t('settings_page.recycling.enter_text')}
                  onChange={formik.handleChange}
                  multiline
                  rows={4}
                />
              </CustomField>
            </Box>
          </TabPanel>

          <TabPanel value={tabIndex} index={1} data-testId="astd-semi-product-tabpanel-sub-category-308">
            <Box mb="16px">
              {/* 類別 - Category */}
              <CustomField label={t('settings_page.recycling.category')} mandatory>
                <FormControl fullWidth>
                  <InputLabel id="category-label">{t('settings_page.recycling.category')}</InputLabel>
                  <Select
                    data-testId="astd-semi-product-sub-category-select-512"
                    labelId="category-label"
                    id="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.category && Boolean(formik.errors.category)}
                    label={t('settings_page.recycling.category')}
                    disabled={isEditMode && activeTab !== 1}
                  >
                    <MenuItem value="1號膠">{t('settings_page.recycling.plastic_no_1')}</MenuItem>
                    <MenuItem value="2號膠">{t('settings_page.recycling.plastic_no_2')}</MenuItem>
                  </Select>
                  {formik.touched.category && formik.errors.category && (
                    <Typography color="error">{formik.errors.category}</Typography>
                  )}
                </FormControl>
                </CustomField>
                <Box mb="16px">
                {/* 簡介 - Introduction */}
                <CustomField  label={t('settings_page.recycling.introduction')}>
                    <CustomTextField
                    dataTestId="astd-semi-product-sub-category-introduction-123"
                    id="introduction"
                    value={formik.values.introduction}
                    placeholder={t('settings_page.recycling.enter_text')}
                    onChange={formik.handleChange}
                    multiline
                    rows={4}
                    />
                </CustomField>
                </Box>

                <Box mb="16px">
                {/* 備註 - Remarks */}
                <CustomField label={t('settings_page.recycling.remarks')}>
                    <CustomTextField
                      dataTestId="astd-semi-product-sub-category-remarks-654"
                      id="remarks"
                      value={formik.values.remarks}
                      placeholder={t('settings_page.recycling.enter_text')}
                      onChange={formik.handleChange}
                      multiline
                      rows={4}
                    />
                </CustomField>
                </Box>
            </Box>
          </TabPanel>

          <TabPanel value={tabIndex} index={2} data-testId="astd-semi-product-tabpanel-additional-category-737">
            <Box mb="16px">
              <CustomField label={t('settings_page.recycling.main_category')} mandatory>
                <FormControl fullWidth>
                    <InputLabel id="subcategory-label">{t('settings_page.recycling.category')}</InputLabel>
                    <Select
                      data-testId="astd-semi-product-additional-category-select-831"
                      labelId="subcategory-label"
                      id="subcategory"
                      value={formik.values.subcategory}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.subcategory && Boolean(formik.errors.subcategory)}
                      label={t('settings_page.recycling.sub_category')}
                      disabled={isEditMode && activeTab !== 2}
                    >
                      <MenuItem value="水樟">{t('settings_page.recycling.category')} 1</MenuItem>
                      <MenuItem value="水樟">{t('settings_page.recycling.category')} 2</MenuItem>
                    </Select>
                    {formik.touched.subcategory && formik.errors.subcategory && (
                      <Typography color="error">{formik.errors.subcategory}</Typography>
                    )}
                  </FormControl>
                </CustomField>
              </Box>

                <Box mb="16px">
                <CustomField label={t('settings_page.recycling.sub_category')}>
                  <FormControl fullWidth>
                    <InputLabel id="subcategory-label">{t('settings_page.recycling.sub_category')}</InputLabel>
                    <Select
                      data-testId="astd-semi-product-additional-category-sub-select-978"
                      labelId="subcategory-label"
                      id="subcategory"
                      value={formik.values.subcategory}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.subcategory && Boolean(formik.errors.subcategory)}
                      label={t('settings_page.recycling.sub_category')}
                      disabled={isEditMode && activeTab !== 2}
                      >
                      <MenuItem value="water_bottle">{t('settings_page.recycling.water_bottle')}</MenuItem>
                      <MenuItem value="film">{t('settings_page.recycling.film')}</MenuItem>
                    </Select>
                    {formik.touched.subcategory && formik.errors.subcategory && (
                      <Typography color="error">{formik.errors.subcategory}</Typography>
                    )}
                  </FormControl>
                  </CustomField>
                </Box>
                
              <Box mb="16px">
              <CustomField label={t('settings_page.recycling.introduction')}>
                  <CustomTextField
                      dataTestId="astd-semi-product-additional-category-introduction-211"
                      id="addonIntroduction"
                      value={formik.values.introduction}
                      placeholder={t('settings_page.recycling.enter_text')}
                      onChange={formik.handleChange}
                      multiline
                      rows={4}
                      />
                </CustomField>
            </Box>
            <Box mb="16px">
              {/* 備註 - Remarks */}
              <CustomField label={t('settings_page.recycling.remarks')}>
                <CustomTextField
                  dataTestId="astd-semi-product-additional-category-remarks-789"
                  id="addOnRemarks"
                  value={formik.values.remarks}
                  placeholder={t('settings_page.recycling.enter_text')}
                  onChange={formik.handleChange}
                  multiline
                  rows={4}
                />
              </CustomField>
            </Box>
          </TabPanel>
        </Box>
      </form>
    </RightOverlayForm>
  );
};

export default SemiFinishProductForm;
