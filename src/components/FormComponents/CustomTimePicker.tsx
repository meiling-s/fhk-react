import { Box, Button, IconButton, Typography } from '@mui/material'
import { PickersLocaleText, TimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { timePeriod } from '../../interfaces/collectionPoint'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { styles } from '../../constants/styles'
import { useTranslation } from 'react-i18next'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import i18n from '../../setups/i18n'

type timePicker = {
  multiple: boolean
  //timePeriod: boolean,       enable it if need to support non timePeriod time picker
  setTime: (timePeriod: timePeriod[]) => void
  defaultTime?: timePeriod[]
}
const localeTexts = {
  en: {
    okButtonLabel: 'OK',
    cancelButtonLabel: 'Cancel',
    toolbarTitle: 'Select Time'
  },
  zhch: {
    okButtonLabel: '确定',
    cancelButtonLabel: '取消',
    toolbarTitle: '选择时间'
  },
  zhhk: {
    okButtonLabel: '確定',
    cancelButtonLabel: '取消',
    toolbarTitle: '選擇時間'
  }
  // Add more language translations as needed
}

function CustomTimePicker({
  multiple,
  //timePeriod,
  setTime,
  defaultTime
}: timePicker) {
  const tempTP: timePeriod = {
    startFrom: dayjs('09:00', 'HH:mm'),
    endAt: dayjs('17:00', 'HH:mm')
  }
  const [timePeriod, setTimePeriod] = useState<timePeriod[]>(
    defaultTime ? defaultTime : []
  )
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const [language, setLanguage] = useState({})

  const { t } = useTranslation()

  useEffect(() => {
    setTime(timePeriod)
  }, [timePeriod])

  useEffect(() => {
    if (!multiple) {
      addTimePeriod()
    }
  }, [])

  useEffect(() => {
    switch (i18n.language) {
      case 'enus':
        setLanguage(localeTexts.en) // Update language state
        break
      case 'zhch':
        setLanguage(localeTexts.zhch) // Update language state
        break
      case 'zhhk':
        setLanguage(localeTexts.zhhk) // Update language state
        break
      default:
        setLanguage(localeTexts.zhhk) // Update language state
        break
    }
  }, [i18n.language])

  const handleTimePeriodChange = (
    start: boolean,
    value: dayjs.Dayjs | null,
    index: number
  ) => {
    if (value != null) {
      if (index >= 0) {
        const TP = timePeriod[index]
        const isValidStartTime = start ? value.isBefore(TP.endAt) : true
        const isValidEndTime = !start ? value.isAfter(TP.startFrom) : true

        if (isValidStartTime && isValidEndTime) {
          const updatedErrorMessages = [...errorMessages]
          updatedErrorMessages[index] = '' // Clear the error message for this index
          setErrorMessages(updatedErrorMessages)

          if (start) {
            TP.startFrom = value
          } else {
            TP.endAt = value
          }

          const timeP = timePeriod.map((hr, curIndex) => {
            if (index === curIndex) {
              return TP
            }
            return hr
          })

          setTimePeriod(timeP)
        } else {
          // Show an error message for this index
          const errorMessage = t('form.error.startDateBehindEndDate')
          const updatedErrorMessages = [...errorMessages]
          updatedErrorMessages[index] = errorMessage
          setErrorMessages(updatedErrorMessages)
          //console.error(errorMessage)
        }
      }
    }
  }

  const addTimePeriod = () => {
    const timeP = Object.assign([], timePeriod)
    const TP = Object.assign({}, tempTP)
    timeP.push(TP)
    setTimePeriod(timeP)
  }

  const removeTimePeriod = (index: number) => {
    if (index > -1 && timePeriod.length > 0) {
      setTimePeriod(
        Object.values(timePeriod).filter((i, index2) => index2 !== index)
      )
    }
  }

  const showTP = (
    startTime: dayjs.Dayjs,
    endTime: dayjs.Dayjs,
    index: number
  ) => {
    return (
      <Box>
        <Box sx={localstyles.timePeriodItem}>
          <MobileTimePicker
            localeText={language}
            defaultValue={startTime}
            onChange={(value) => handleTimePeriodChange(true, value, index)}
            sx={localstyles.timePicker}
          />
          <Typography sx={localstyles.txtStyle_to}>{t('to')}</Typography>
          <MobileTimePicker
            localeText={language}
            defaultValue={endTime}
            onChange={(value) => handleTimePeriodChange(false, value, index)}
            sx={localstyles.timePicker}
          />
          <IconButton
            aria-label="addSerivceHr"
            size="medium"
            onClick={() => removeTimePeriod(index)}
          >
            <RemoveCircleOutlineIcon sx={styles.disableIcon} />
          </IconButton>
        </Box>
        {errorMessages[index] && (
          <div className="text-red text-2xs">{errorMessages[index]}</div>
        )}
      </Box>
    )
  }

  if (multiple) {
    return (
      <Box sx={localstyles.container}>
        {timePeriod.map((timePeriod, index) =>
          showTP(timePeriod.startFrom, timePeriod.endAt, index)
        )}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            sx={{ ...styles.buttonOutlinedGreen_2, marginY: 2 }}
            onClick={(event) => addTimePeriod()}
          >
            <AddCircleIcon sx={{ ...styles.endAdornmentIcon, pr: 1 }} />
            {t('component.routine.addPeriod')}
          </Button>
        </Box>
      </Box>
    )
  } else {
    //just one time picker
    return (
      <Box sx={localstyles.container}>
        <Box sx={localstyles.timePeriodItem}>
          <MobileTimePicker
            defaultValue={tempTP.startFrom}
            onChange={(value) => handleTimePeriodChange(true, value, 0)}
            sx={localstyles.timePicker}
          />
          <Typography sx={localstyles.txtStyle_to}>{t('to')}</Typography>
          <MobileTimePicker
            defaultValue={tempTP.endAt}
            onChange={(value) => handleTimePeriodChange(false, value, 0)}
            sx={localstyles.timePicker}
          />
        </Box>
      </Box>
    )
  }
}

const localstyles = {
  timePicker: {
    width: 72,
    borderRadius: 5,
    backgroundColor: 'white',
    '& fieldset': {
      borderWidth: 0
    },
    '& input': {
      paddingX: 0
    }
  },
  timePeriodItem: {
    display: 'flex',
    height: 'fit-content',
    paddingX: 2,
    mr: 2,
    marginY: 2,
    alignItems: 'center',
    backgroundColor: 'white',
    border: 2,
    borderRadius: 3,
    borderColor: '#E2E2E2'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 10
  },
  txtStyle_to: {
    marginX: 1,
    color: '#ACACAC',
    fontSize: 15,
    fontWeight: 'bold'
  }
}

export default CustomTimePicker
