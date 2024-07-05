import { useTranslation } from 'react-i18next'
import CustomItemList, { il_item } from '../../FormComponents/CustomItemList'
import { routineType } from './predefinedOption'
import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import SpecificDate from './SpecificDate/SpecificDate'
import Weekly from './Weekly/Weekly'
import { picoRoutine } from '../../../interfaces/common'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

type itemList = {
  bgColor: string
  borderColor: string
}

type props = {
  setRoutine: (routine: picoRoutine) => void
  defaultValue?: picoRoutine
  itemColor?: itemList
  roleColor?: string
}

export default function PicoRoutineSelect({
  setRoutine,
  defaultValue,
  itemColor,
  roleColor
}: props) {
  //shared state
  const [rouType, setRouType] = useState<string>('')
  const [routineContent, setRoutineContent] = useState<string[]>([])

  useEffect(() => {
    if (defaultValue) {
      setRouType(defaultValue.routineType)
      setRoutineContent(defaultValue.routineContent)
    }
  }, [])

  useEffect(() => {
    setRoutine(returnPicoRoutine(rouType, routineContent))
  }, [rouType, routineContent])

  const returnPicoRoutine = (rType: string, rContent: string[]) => {
    const picoRoutine: picoRoutine = {
      routineType: rType,
      routineContent: rContent
    }
    console.log(picoRoutine)
    return picoRoutine
  }

  const { t, i18n } = useTranslation()

  const getRoutineType = () => {
    const routineT: il_item[] = routineType.map((routine) => {
      var name: string = ''
      switch (i18n.language) {
        case 'enus':
          name = routine.engName
          break
        case 'zhch':
          name = routine.schiName
          break
        case 'zhhk':
          name = routine.tchiName
          break
        default:
          name = routine.tchiName //default fallback language is zhhk
      }
      return { name: name, id: routine.id }
    })
    return routineT
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
      <CustomItemList
        items={getRoutineType()}
        singleSelect={setRouType}
        defaultSelected={defaultValue ? defaultValue.routineType : undefined}
        itemColor={itemColor ? itemColor : null}
      />
      <Box sx={{ marginTop: 2 }}>
        {rouType == 'weekly' ? (
          <Weekly
            setWeekly={setRoutineContent}
            itemColor={itemColor ? itemColor : null}
            defaultWeek={
              defaultValue?.routineType == routineType[1].id
                ? routineContent
                : undefined
            }
          />
        ) : (
          rouType == 'specificDate' && (
            <SpecificDate
              setSpecificDate={setRoutineContent}
              defaultDates={
                defaultValue?.routineType == routineType[2].id
                  ? defaultValue.routineContent
                  : undefined
              }
              roleColor={roleColor}
            />
          )
        )}
      </Box>
    </LocalizationProvider>
  )
}
