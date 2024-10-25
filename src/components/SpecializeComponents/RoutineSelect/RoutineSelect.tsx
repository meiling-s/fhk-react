import { useTranslation } from 'react-i18next';
import CustomItemList, { il_item } from '../../FormComponents/CustomItemList';
import { routineType } from './predefinedOption';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Daily from './Daily/Daily';
import SpecificDate from './SpecificDate/SpecificDate';
import Weekly from './Weekly/Weekly';
import { routineContent, colPtRoutine } from '../../../interfaces/common';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

type props = {
  setRoutine: (routine: colPtRoutine) => void;
  requiredTimePeriod?: boolean;
  defaultValue?: colPtRoutine;
  setValidationError?: (error: string | null) => void;
};

export default function RoutineSelect({
  setRoutine,
  requiredTimePeriod = false,
  defaultValue,
  setValidationError,
}: props) {
  //shared state
  const [rouType, setRouType] = useState<string>('');
  const [routineContent, setRoutineContent] = useState<routineContent[]>([]);
  const [validationError, setLocalValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultValue) {
      setRouType(defaultValue.routineType);
      setRoutineContent(defaultValue.routineContent);
    }
  }, []);

  useEffect(() => {
    setRoutine(returnColPtRoutine(rouType, routineContent));
  }, [rouType, routineContent]);

  useEffect(() => {
    if (setValidationError) {
      console.log('Validation Error:', validationError);
      setValidationError(validationError);
    }
  }, [validationError, setValidationError]);
  
  const returnColPtRoutine = (rType: string, rContent: routineContent[]) => {
    const colPtRoutine: colPtRoutine = {
      routineType: rType,
      routineContent: rContent,
    };
    console.log(colPtRoutine);
    return colPtRoutine;
  };

  const { t, i18n } = useTranslation();

  const getRoutineType = () => {
    const routineT: il_item[] = routineType.map((routine) => {
      var name: string = '';
      switch (i18n.language) {
        case 'enus':
          name = routine.engName;
          break;
        case 'zhch':
          name = routine.schiName;
          break;
        case 'zhhk':
          name = routine.tchiName;
          break;
        default:
          name = routine.tchiName; //default fallback language is zhhk
      }
      return { name: name, id: routine.id };
    });
    return routineT;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
      <CustomItemList
        items={getRoutineType()}
        singleSelect={setRouType}
        defaultSelected={defaultValue ? defaultValue.routineType : undefined}
      />

      <Box sx={{ marginTop: 2 }}>
        {rouType == 'daily' ? (
          <>
            <Daily
              setDaily={setRoutineContent}
              required={requiredTimePeriod}
              defaultTime={
                defaultValue?.routineType == routineType[0].id
                  ? defaultValue.routineContent
                  : undefined
              }
              setValidationError={setLocalValidationError}
            />
           
          </>
        ) : rouType == 'weekly' ? (
          <Weekly
            setWeekly={setRoutineContent}
            required={requiredTimePeriod}
            defaultWeek={
              defaultValue?.routineType == routineType[1].id
                ? defaultValue.routineContent
                : undefined
            }
          />
        ) : (
          rouType == 'specificDate' && (
            <SpecificDate
              setSpecificDate={setRoutineContent}
              required={requiredTimePeriod}
              defaultDates={
                defaultValue?.routineType == routineType[2].id
                  ? defaultValue.routineContent
                  : undefined
              }
            />
          )
        )}
      </Box>
    </LocalizationProvider>
  );
}
