import { useEffect, useState } from 'react'
import CustomTimePicker from '../../../FormComponents/CustomTimePicker'
import CustomField from '../../../FormComponents/CustomField'
import { useTranslation } from 'react-i18next'
import { timePeriod } from '../../../../interfaces/collectionPoint'
import { routineContent } from '../../../../interfaces/common'
import dayjs from 'dayjs'

type props = {
  setDaily: (RDs: routineContent[]) => void
  defaultTime?: routineContent[]
  required?: boolean
}

export default function Daily({
  setDaily,
  defaultTime,
  required = false
}: props) {
  const [period, setPeriod] = useState<timePeriod[]>([])

  const { t } = useTranslation()

  //   useEffect(() => {
  //     if (defaultTime != undefined) {
  //       console.log('default time', defaultTime)
  //       setPeriod(toTimePeriod(defaultTime[0].startTime, defaultTime[0].endTime))
  //     }
  //     return () => {
  //       setDaily([])
  //     }
  //   }, [])

  useEffect(() => {
    if (defaultTime && defaultTime.length > 0) {
      //console.log('default time', defaultTime)
      setPeriod(toTimePeriod(defaultTime[0].startTime, defaultTime[0].endTime))
    } else {
      setPeriod([]) // Reset period if defaultTime is undefined or empty
    }
    return () => {
      setDaily([])
    }
  }, [defaultTime])

  useEffect(() => {
    setDaily(returnRoutineContent(period))
  }, [period])

  const toTimePeriod = (st: string[], et: string[]) => {
    //start time end time
    const timeP: timePeriod[] = []
    for (var i = 0; i < Math.min(st.length, et.length); i++) {
      timeP.push({ startFrom: dayjs(st[i]), endAt: dayjs(et[i]) })
    }
    return timeP
  }

  const returnRoutineContent = (dailyPeriod: timePeriod[]) => {
    const ST: string[] = dailyPeriod.map((value) => value.startFrom.toString())
    const ET: string[] = dailyPeriod.map((value) => value.endAt.toString())
    const content: routineContent[] = [
      {
        id: 'daily',
        startTime: ST,
        endTime: ET
      }
    ]
    return content
  }

  return (
    <CustomField label={t('time_Period')} mandatory={required}>
      <CustomTimePicker
        multiple={true}
        setTime={setPeriod}
        defaultTime={
          defaultTime && defaultTime.length > 0
            ? toTimePeriod(defaultTime[0].startTime, defaultTime[0].endTime)
            : undefined
        }
      />
    </CustomField>
  )
}
