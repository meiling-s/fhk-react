import * as Yup from 'yup';
import { TFunction } from 'i18next';

export const validationSchema = (t: TFunction) => {
  return Yup.object({
    colName: Yup.string()
      .required(t('form.error.shouldNotBeEmpty'))
      .max(100, t('form.error.exceedsMaxLength')),
    colType: Yup.string().required(t('form.error.shouldNotBeEmpty')),
    siteType: Yup.string().required(t('form.error.shouldNotBeEmpty')),
    address: Yup.string()
      .required(t('form.error.incorrectAddress'))
      .min(10, t('form.error.incorrectAddress'))
      .max(200, t('form.error.exceedsMaxLength')),
    openingPeriod: Yup.object().shape({
      startDate: Yup.date().required(t('form.error.shouldNotBeEmpty')),
      endDate: Yup.date()
        .required(t('form.error.shouldNotBeEmpty'))
        .min(Yup.ref('startDate'), t('form.error.endDateEarlyThanStartDate')),
    }),
    premiseName: Yup.string().required(t('form.error.shouldNotBeEmpty')),
    premiseType: Yup.string().when('colType', {
      is: (colType: string) => !['CPT00001', 'CPT00002'].includes(colType),
      then: (schema) => schema.required(t('form.error.shouldNotBeEmpty')),
      otherwise: (schema) => schema.nullable(), // No validation for CPT00001 or CPT00002
    }),
    premiseRemark: Yup.string().when('premiseType', {
      is: (value: string) => ['PT00009', 'PT00027', 'PT00028'].includes(value),
      then: (schema) => schema.required(t('form.error.shouldNotBeEmpty')),
      otherwise: (schema) => schema, // Optional if other values
    }),
    staffNum: Yup.number()
      .required(t('form.error.shouldNotBeEmpty'))
      .min(0, t('form.error.numberSmallThanZero')),
    contractNo: Yup.string().when('serviceFlg', {
      is: 'additional',
      then: (schema) => schema.required(t('form.error.shouldNotBeEmpty')),
      otherwise: (schema) => schema, // Optional schema in other cases
    }),
    colPtRoutine: Yup.object().shape({
      routineType: Yup.string().required(t('form.error.routineTypeRequired')),
      routineContent: Yup.array().min(1, t('form.error.routineContentRequired')),
    }),
    recyclables: Yup.array().min(1, t('form.error.recyclablesRequired')),
    serviceFlg: Yup.string().oneOf(['basic', 'additional', 'others'], t('form.error.invalidServiceType')),
  });
};
