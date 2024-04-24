import { Button, Grid, Typography, IconButton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { styles } from '../../../../constants/styles'
import { timePeriod } from '../../../../interfaces/collectionPoint'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import CustomTimePicker from '../../../FormComponents/CustomTimePicker'
import CustomDatePicker from '../../../FormComponents/CustomDatePicker'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { routineContent } from '../../../../interfaces/common'
import { format } from '../../../../constants/constant'
import CustomField from '../../../FormComponents/CustomField'

type props = {
  setSpecificDate: (RSDs: routineContent[]) => void
  defaultDates?: routineContent[]
  required?: boolean
}

type specificDate_timePeriod = {
  //store the timePeriod with the weekDay id
  id: number
  date: dayjs.Dayjs
  timePeriod: timePeriod[]
}

export default function SpecificDate({
  setSpecificDate,
  defaultDates,
  required = false
}: props) {
  const [specificDates, setSpecificDates] = useState<specificDate_timePeriod[]>(
    []
  )
  const [lastIndex, setLastIndex] = useState<number>(0)

  const { t } = useTranslation()

  useEffect(() => {
    if (defaultDates) {
      handleAddDefaultDate()
    }
    return () => {
      setSpecificDate(returnRoutineContent([]))
    }
  }, [])

  useEffect(() => {
    setSpecificDate(returnRoutineContent(specificDates))
  }, [specificDates])

  const toTimePeriod = (st: string[], et: string[]) => {
    //start time end time
    const timeP: timePeriod[] = []
    for (var i = 0; i < Math.min(st.length, et.length); i++) {
      timeP.push({ startFrom: dayjs(st[i]), endAt: dayjs(et[i]) })
    }
    return timeP
  }

  // const returnDefaultTime = (index: number) => {
  //     if(defaultDates){
  //         if(index <= defaultDates.length){
  //             const default_time = defaultDates.find((date, index2) => {
  //                 return index2 == index;
  //             })
  //         }
  //     }
  //     return undefined;
  // }

  const returnRoutineContent = (specificDate: specificDate_timePeriod[]) => {
    const routineSpecificDate: routineContent[] = specificDate.map((date) => {
      const ST: string[] = date.timePeriod.map((value) =>
        value.startFrom.toString()
      )
      const ET: string[] = date.timePeriod.map((value) =>
        value.endAt.toString()
      )

      //console.log('returnRoutineContent', date.date.format(format.dateFormat2))
      const RSD: routineContent = {
        id: date.date.format(format.dateFormat2),
        startTime: ST,
        endTime: ET
      }
      return RSD
    })
    return routineSpecificDate
  }

  const handleDatePick = (day: dayjs.Dayjs, index: number) => {
    console.log('handleDatePick', day, index)
    var newSpecificDates = specificDates.map((date) => {
      if (date.id == index) {
        date.date = day
      }
      return date
    })
    setSpecificDates(newSpecificDates)
  }

  const handleTimePick = (timePeriod: timePeriod[], index: number) => {
    var newSpecificDates = specificDates.map((date) => {
      if (date.id == index) {
        date.timePeriod = timePeriod
      }
      return date
    })
    setSpecificDates(newSpecificDates)
  }

  const handleAddDate = () => {
    var newSpecificDates = Object.assign([], specificDates)
    newSpecificDates.push({
      id: lastIndex,
      date: dayjs(new Date()),
      timePeriod: []
    })
    setSpecificDates(newSpecificDates)
    setLastIndex(lastIndex + 1)
  }

  const handleAddDefaultDate = () => {
    if (defaultDates) {
      var newSpecificDates = Object.assign([], specificDates)
      defaultDates.map((date, index) => {
        newSpecificDates.push({
          id: index,
          date: dayjs(date.id),
          timePeriod: toTimePeriod(date.startTime, date.endTime)
        })
      })
      setSpecificDates(newSpecificDates)
      setLastIndex(defaultDates.length)
    }
  }

  const handleRemoveDate = (index: number) => {
    var newSpecificDates = specificDates.filter((date) => {
      return date.id != index //if date.id == id of item we are deleting, filter it (delete)
    })
    if (newSpecificDates) {
      console.log(newSpecificDates)
      setSpecificDates(newSpecificDates)
    }
  }

  return (
    <Grid container sx={localstyles.gridContainer}>
      <Grid container item key={'header'} sx={[localstyles.gridRow]}>
        <Grid xs={3}>
          <Typography sx={localstyles.txtHeader}>{t('date')}</Typography>
        </Grid>
        <Grid xs={9}>
          {/* <Typography sx={localstyles.txtHeader}>
                        {t("time_Period")}
                    </Typography> */}
          <CustomField label={t('time_Period')} mandatory={required} />
        </Grid>
      </Grid>
      {specificDates.map((date) => (
        <Grid
          container
          item
          key={date.id}
          sx={[
            localstyles.gridRow,
            localstyles.dataRow,
            { display: { md: 'flex', xs: 'block' } }
          ]}
        >
          <Grid xs={3} sx={localstyles.tableCell} key={date.id + 'datePick'}>
            <CustomDatePicker
              defaultDate={date.date.format(format.dateFormat2)}
              setDate={(d) => {
                handleDatePick(d, date.id)
              }}
            />
          </Grid>
          <Grid xs={8.5} sx={localstyles.tableCell} key={date.id + 'timePick'}>
            <CustomTimePicker
              setTime={(periods) => handleTimePick(periods, date.id)}
              multiple={true}
              defaultTime={date.timePeriod}
            />
          </Grid>
          <Grid xs={0.5} sx={localstyles.tableCell} key={date.id + 'delete'}>
            <IconButton onClick={() => handleRemoveDate(date.id)}>
              <DeleteOutlineIcon className="text-[#ACACAC]" />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Grid item key={'addDateBtn'} sx={localstyles.gridRow}>
        <Button
          sx={{
            ...styles.buttonOutlinedGreen,
            width: '100%',
            paddingY: 2,
            borderRadius: 5
          }}
          onClick={() => handleAddDate()}
        >
          <AddCircleIcon sx={{ ...styles.endAdornmentIcon, pr: 1 }} />
          {t('component.routine.addDate')}
        </Button>
      </Grid>
    </Grid>
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
  },
  tableCellMobile: {
    display: 'block'
  }
}
