import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, FormControl, InputLabel, Select, MenuItem, Tabs, Tab, Typography } from '@mui/material';
import RightOverlayForm from '../../../../components/RightOverlayForm';
import CustomField from '../../../../components/FormComponents/CustomField';
import CustomTextField from '../../../../components/FormComponents/CustomTextField';

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
  handleClose: () => void;
  handleSubmit: () => void;
  open: boolean;
};

function TabPanel(props: { children: React.ReactNode; value: number; index: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div
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

const SemiFinishProductForm: React.FC<SemiFinishProductProps> = ({ handleClose, open, handleSubmit }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newIndex: number) => {
    setTabIndex(newIndex);
  };

  const formik = useFormik({
    initialValues: {
      traditionalName: '',
      simplifiedName: '',
      englishName: '',
      category: '',
      subcategory: '',
      introduction: '',
      remarks: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <RightOverlayForm
      open={open}
      onClose={handleClose}
      anchor="right"
      showHeader={true}
      headerProps={{
        title: '新增',
        subTitle: '產品類別',
        submitText: 'Save',
        cancelText: 'Cancel',
        onCloseHeader: handleClose,
        onSubmit: () => handleSubmit,
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2} padding="25px">
          <Box mb="16px">
            {/* 繁體中文名稱 - Traditional Chinese Name */}
            <CustomField label="繁體中文名稱" mandatory>
              <CustomTextField
                id="traditionalName"
                value={formik.values.traditionalName}
                placeholder="請輸入名稱"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.traditionalName && Boolean(formik.errors.traditionalName)}
                helperText={formik.touched.traditionalName && formik.errors.traditionalName}
              />
            </CustomField>
          </Box>

          <Box mb="16px">
            {/* 简体中文名称 - Simplified Chinese Name */}
            <CustomField label="简体中文名称" mandatory>
              <CustomTextField
                id="simplifiedName"
                value={formik.values.simplifiedName}
                placeholder="请输入名称"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.simplifiedName && Boolean(formik.errors.simplifiedName)}
                helperText={formik.touched.simplifiedName && formik.errors.simplifiedName}
              />
            </CustomField>
          </Box>

          <Box mb="16px">
            {/* English Name */}
            <CustomField label="English Name" mandatory>
              <CustomTextField
                id="englishName"
                value={formik.values.englishName}
                placeholder="Enter English Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.englishName && Boolean(formik.errors.englishName)}
                helperText={formik.touched.englishName && formik.errors.englishName}
              />
            </CustomField>
          </Box>

          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="form tabs">
            <Tab label="主類別 " />
            <Tab label="次類別 " />
            <Tab label="追加類別" />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            <Box mb="16px">
              {/* 簡介 - Introduction */}
              <CustomField label="簡介">
                <CustomTextField
                  id="introduction"
                  value={formik.values.introduction}
                  placeholder="請輸入文字"
                  onChange={formik.handleChange}
                  multiline
                  rows={4}
                />
              </CustomField>
            </Box>

            <Box mb="16px">
              {/* 備註 - Remarks */}
              <CustomField label="備註">
                <CustomTextField
                  id="remarks"
                  value={formik.values.remarks}
                  placeholder="請輸入文字"
                  onChange={formik.handleChange}
                  multiline
                  rows={4}
                />
              </CustomField>
            </Box>
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            <Box mb="16px">
              {/* 類別 - Category */}
              <CustomField label="類別" mandatory>
                <FormControl fullWidth>
                  <InputLabel id="category-label">類別</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.category && Boolean(formik.errors.category)}
                    label="類別"
                  >
                    <MenuItem value="1號膠">1號膠</MenuItem>
                    <MenuItem value="2號膠">2號膠</MenuItem>
                  </Select>
                  {formik.touched.category && formik.errors.category && (
                    <Typography color="error">{formik.errors.category}</Typography>
                  )}
                </FormControl>
                </CustomField>
                <Box mb="16px">
                {/* 簡介 - Introduction */}
                <CustomField label="簡介">
                    <CustomTextField
                    id="introduction"
                    value={formik.values.introduction}
                    placeholder="請輸入文字"
                    onChange={formik.handleChange}
                    multiline
                    rows={4}
                    />
                </CustomField>
                </Box>

                <Box mb="16px">
                {/* 備註 - Remarks */}
                <CustomField label="備註">
                    <CustomTextField
                    id="remarks"
                    value={formik.values.remarks}
                    placeholder="請輸入文字"
                    onChange={formik.handleChange}
                    multiline
                    rows={4}
                    />
                </CustomField>
                </Box>
            </Box>
          </TabPanel>

          <TabPanel value={tabIndex} index={2}>
            <Box mb="16px">
              <CustomField label="主類別 " mandatory>
                <FormControl fullWidth>
                    <InputLabel id="subcategory-label">主類別</InputLabel>
                    <Select
                      labelId="subcategory-label"
                      id="subcategory"
                      value={formik.values.subcategory}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.subcategory && Boolean(formik.errors.subcategory)}
                      label="次類別"
                    >
                      <MenuItem value="水樟">1號膠</MenuItem>
                      <MenuItem value="菲林">2號膠</MenuItem>
                    </Select>
                    {formik.touched.subcategory && formik.errors.subcategory && (
                      <Typography color="error">{formik.errors.subcategory}</Typography>
                    )}
                  </FormControl>
                </CustomField>
              </Box>

                <Box mb="16px">
                <CustomField label="次類別">
                  <FormControl fullWidth>
                    <InputLabel id="subcategory-label">次類別</InputLabel>
                    <Select
                      labelId="subcategory-label"
                      id="subcategory"
                      value={formik.values.subcategory}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.subcategory && Boolean(formik.errors.subcategory)}
                      label="次類別"
                    >
                      <MenuItem value="水樽">水樽</MenuItem>
                      <MenuItem value="菲林">菲林</MenuItem>
                    </Select>
                    {formik.touched.subcategory && formik.errors.subcategory && (
                      <Typography color="error">{formik.errors.subcategory}</Typography>
                    )}
                  </FormControl>
                  </CustomField>
                </Box>
                
              <Box mb="16px">
              <CustomField label="簡介">
                  <CustomTextField
                      id="introduction"
                      value={formik.values.introduction}
                      placeholder="請輸入文字"
                      onChange={formik.handleChange}
                      multiline
                      rows={4}
                      />
                </CustomField>
            </Box>
            <Box mb="16px">
              {/* 備註 - Remarks */}
              <CustomField label="備註">
                <CustomTextField
                  id="remarks"
                  value={formik.values.remarks}
                  placeholder="請輸入文字"
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
