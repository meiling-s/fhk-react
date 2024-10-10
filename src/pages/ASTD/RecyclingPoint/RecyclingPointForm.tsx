import {FC} from 'react';
import {
    Box,
    Grid
} from '@mui/material'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'

interface RecyclingPointFormProps {
    tChineseName: string;
    sChineseName: string;
    englishName: string;
    description: string;
    remark: string;
    trySubmited: boolean;
    validation: { field: string; error: string }[];
    action?: 'add' | 'edit' | 'delete'; 
    setTChineseName: (value: string) => void;
    setSChineseName: (value: string) => void;
    setEnglishName: (value: string) => void;
    setDescription: (value: string) => void;
    setRemark: (value: string) => void;
    checkString: (value: string) => boolean;
    t: (key: string) => string;
}

const RecyclingPointForm: FC<RecyclingPointFormProps> = ({
    tChineseName,
    sChineseName,
    englishName,
    description,
    remark,
    trySubmited,
    validation,
    action,
    setTChineseName,
    setSChineseName,
    setEnglishName,
    setDescription,
    setRemark,
    checkString,
    t
}) => {
    return (
        <Box sx={{ marginX: 2 }}>
            <Box sx={{ marginY: 2 }}>
                <CustomField label={t('packaging_unit.traditional_chinese_name')} mandatory>
                    <CustomTextField
                        dataTestId="astd-land-form-tc-input-field-8562"
                        id="tChineseName"
                        value={tChineseName}
                        disabled={action === 'delete'}
                        placeholder={t('packaging_unit.traditional_chinese_name_placeholder')}
                        onChange={(event) => setTChineseName(event.target.value)}
                        error={trySubmited && checkString(tChineseName)}
                    />
                </CustomField>
            </Box>
            <Box sx={{ marginY: 2 }}>
                <CustomField label={t('packaging_unit.simplified_chinese_name')} mandatory>
                    <CustomTextField
                        dataTestId="astd-land-form-sc-input-field-9837"
                        id="sChineseName"
                        value={sChineseName}
                        disabled={action === 'delete'}
                        placeholder={t('packaging_unit.simplified_chinese_name_placeholder')}
                        onChange={(event) => setSChineseName(event.target.value)}
                        error={trySubmited && checkString(sChineseName)}
                    />
                </CustomField>
            </Box>
            <Box sx={{ marginY: 2 }}>
                <CustomField label={t('packaging_unit.english_name')} mandatory>
                    <CustomTextField
                        dataTestId="astd-land-form-en-input-field-3666"
                        id="englishName"
                        value={englishName}
                        disabled={action === 'delete'}
                        placeholder={t('packaging_unit.english_name_placeholder')}
                        onChange={(event) => setEnglishName(event.target.value)}
                        error={trySubmited && checkString(englishName)}
                    />
                </CustomField>
            </Box>
            <Box sx={{ marginY: 2 }}>
                <CustomField label={t('packaging_unit.introduction')}>
                    <CustomTextField
                        dataTestId=""
                        id="description"
                        placeholder={t('packaging_unit.introduction_placeholder')}
                        onChange={(event) => setDescription(event.target.value)}
                        multiline={true}
                        defaultValue={description}
                        disabled={action === 'delete'}
                    />
                </CustomField>
            </Box>
            <Box sx={{ marginY: 2 }}>
                <CustomField label={t('packaging_unit.remark')}>
                    <CustomTextField
                        dataTestId=""
                        id="remark"
                        placeholder={t('packaging_unit.remark_placeholder')}
                        onChange={(event) => setRemark(event.target.value)}
                        multiline={true}
                        defaultValue={remark}
                        disabled={action === 'delete'}
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
    )
}

export default RecyclingPointForm
