import { useTranslation } from 'react-i18next'
import { styles } from '../../../../constants/styles'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import CustomDatePicker from '../../../FormComponents/CustomDatePicker'
import { format } from '../../../../constants/constant'
import { Add } from '@mui/icons-material'
import CustomField from '../../../FormComponents/CustomField'
import CommonTypeContainer from '../../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'

type props = {
  setSpecificDate: (RSDs: string[]) => void
  defaultDates?: string[]
  roleColor?: string
}

export default function SpecificDate({
  setSpecificDate,
  defaultDates,
  roleColor
}: props) {
  const [specificDates, setSpecificDates] = useState<string[]>([])

  const { t } = useTranslation()
  const { dateFormat } = useContainer(CommonTypeContainer)

  useEffect(() => {
    if (defaultDates) {
      setSpecificDates(defaultDates)
    }
    return () => {
      setSpecificDate([])
    }
  }, [])

  useEffect(() => {
    setSpecificDate(specificDates)
  }, [specificDates])

  const handleDatePick = (day: dayjs.Dayjs[]) => {
    var newSpecificDates = day.map((date) => {
      return date.format(dateFormat)
    })
    setSpecificDates(newSpecificDates)
  }

  return (
    <CustomField
      label={t('pick_up_order.routine.period')}
      style={{ width: '100%' }}
      mandatory
    >
      <CustomDatePicker
        defaultDate={defaultDates}
        setMultiDate={(dates) => handleDatePick(dates)}
        dp_style={{ width: '200px' }}
        roleColor={roleColor}
      />
    </CustomField>
  )
}

let localstyles = {
  gridContainer: {
    width: '100%'
  },
  gridRow: {
    width: '100%',
    flexDirection: 'row',
    marginY: 1
  },
  dataRow: {
    backgroundColor: '#FBFBFB',
    borderRadius: 5,
    paddingX: 2
  },
  txtHeader: {
    ...styles.header3,
    pl: 1
  },
  tableCell: {
    display: 'flex',
    alignSelf: 'center'
  }
}
