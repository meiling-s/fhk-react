import { useEffect, useState, FunctionComponent, useCallback } from 'react'
import { Box, Typography } from '@mui/material'

import { styles } from '../../../constants/styles'
import { ADD_ICON } from '../../../themes/icons'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { format } from '../../../constants/constant'
import { useTranslation } from 'react-i18next'
import RosterDetail from './RosterDetail'

import { getRosterList } from '../../../APICalls/roster'
import { GroupedRoster, Roster } from '../../../interfaces/roster'

import dayjs from 'dayjs'

const Rosters: FunctionComponent = () => {
  const { t } = useTranslation()

  const [filterDate, setFilterDate] = useState<dayjs.Dayjs>(dayjs())
  const [groupedRoster, setGroupedRoster] = useState<GroupedRoster[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [selectedRoster, setSelectedRoster] = useState<Roster | null>(null)
  const [selectedRosterDate, setRosterDate] = useState<string>('')
  const [rosterColId, setRosterColId] = useState<number | null>(null)

  useEffect(() => {
    initRosterData()
  }, [])

  const initRosterData = async () => {
    const result = await getRosterList()
    if (result) {
      const rosterRawData = result.data.content

      //maaping data roster
      const groupedRoster = rosterRawData.reduce(
        (grouped: any, item: Roster) => {
         
          const collectionId = item.collectionPoint.colId
          const collectionName = item.collectionPoint.colName
          const rosterItem = item

          if (rosterItem.status != 'CANCELLED') {
            const existingCollection = grouped.find(
              (group: any) => group.collectionId === collectionId
            )
            if (existingCollection) {
              existingCollection.roster.push(rosterItem)
            } else {
              grouped.push({
                collectionId,
                collectionName,
                roster: [rosterItem]
              })
            }
          }

          return grouped
        },
        []
      )
      setGroupedRoster(groupedRoster)
    }
  }

  const formattedTime = (value: string) => {
    const dateObject = dayjs(value)
    return dateObject.format('HH:mm')
  }

  const onSubmitData = (type: string, msg: string) => {
    setSelectedRoster(null)
    setRosterColId(null)
    setRosterDate('')
    initRosterData()
  }

  const addNewRoster = (item: GroupedRoster) => {
    setAction('add')
    setRosterColId(item.collectionId)
    if (item.roster.length > 0) {
      const startDate = item.roster[0].startAt
      setRosterDate(startDate)
    } else {
      setRosterDate(dayjs().toString())
    }
    setDrawerOpen(true)
  }

  return (
    <>
      <Box className="container-wrapper w-full">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          <Box className="filter-date" sx={{ marginY: 4 }}>
            <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Box sx={{ ...localstyles.DateItem }}>
                <DatePicker
                  defaultValue={dayjs(filterDate)}
                  format={format.dateFormat2}
                  onChange={(value) => setFilterDate(value!!)}
                  sx={{ ...localstyles.datePicker }}
                />
              </Box>
            </Box>
          </Box>
          <Box className="roster-section flex gap-6">
            {groupedRoster.map((item, index) => (
              <Box className="roster" key={index + item.collectionId}>
                <div className="col-title mb-3 text-[#717171] text-base font-bold">
                  {item.collectionName}
                </div>
                {item.roster.map((rosterItem, indexRoster) => (
                  <div
                    className="roster-item mb-6 w-[225px] bg-white rounded-2xl p-6 cursor-pointer"
                    key={indexRoster + rosterItem.rosterId}
                    onClick={() => {
                      setDrawerOpen(true)
                      setSelectedRoster(rosterItem)
                      setAction('edit')
                    }}
                  >
                    <div className="text-[#717171] text-[18px] font-bold">
                      {formattedTime(rosterItem.startAt)}-
                      {formattedTime(rosterItem.endAt)}
                    </div>
                    {rosterItem.staff.map((staffItem, indexStaff) => (
                      <Box
                        className="roster-staff"
                        sx={{
                          borderTop:
                            indexStaff !== 0 ? '1px solid #E2E2E2' : 'none',
                          paddingBottom: '12px'
                        }}
                        key={indexStaff + staffItem.staffId}
                      >
                        <div className="staff flex gap-2 mt-2 justify-start items-center">
                          <div className="w-[25px] h-[25px] rounded-3xl bg-[#86C049] p-1 font-bold text-white text-center">
                            {staffItem.staffNameTchi.substring(0, 2)}
                          </div>
                          <div className="right-side">
                            <div className="font-bold text-base text-black mb-1">
                              {staffItem.staffNameTchi}
                            </div>
                            <div className="text-xs font-normal text-[#717171]">
                              {staffItem.titleId}
                            </div>
                          </div>
                        </div>
                      </Box>
                    ))}
                  </div>
                ))}
                <div className="add-roster text-center flex justify-center items-center gap-2 cursor-pointer"
                 onClick={() => addNewRoster(item)}>
                  <ADD_ICON fontSize="small" className="text-[#717171]" />
                  <div className="text-[#717171] text-smi font-bold">
                    {t('roster.addSchedule')}
                  </div>
                </div>
              </Box>
            ))}
             <RosterDetail
              drawerOpen={drawerOpen}
              handleDrawerClose={() => setDrawerOpen(false)}
              action={action}
              onSubmitData={onSubmitData}
              selectedRoster={selectedRoster}
              selectedDate={selectedRosterDate}
              rosterColId={rosterColId}
            />
          </Box>
        </LocalizationProvider>
      </Box>
    </>
  )
}

const localstyles = {
  textField: {
    borderRadius: '10px',
    fontWeight: '500',
    '& .MuiOutlinedInput-input': {
      padding: '10px'
    }
  },
  datePicker: {
    ...styles.textField,
    width: '350px',
    '& .MuiIconButton-edgeEnd': {
      color: '#79CA25'
    }
  },
  DateItem: {
    display: 'flex',
    height: 'fit-content',
    alignItems: 'center'
  }
}

export default Rosters
