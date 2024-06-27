import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { SEARCH_ICON } from '../../themes/icons'
import { t } from 'i18next'
import { localStorgeKeyName } from '../../constants/constant'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import { styles } from '../../constants/styles'
import { format } from './../../constants/constant'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

interface Option {
  value: string
  label: string
}

const CustomSearchField = ({
  label,
  width,
  options,
  onChange,
  field,
  placeholder,
  handleSearch,
  inputType,
  numberOnly = false
}: {
  label: string
  width?: string
  options?: Option[]
  onChange?: (labelField: string, value: string) => void
  field?: string
  placeholder?: string
  handleSearch?: (value: string) => void
  inputType?: string
  numberOnly?: boolean
}) => {
  const hasOptions = options && options.length > 0
  //const [selectedValue, setSelectedValue] = useState<string>("")
  const initialSelectedValue =
    inputType === 'date' ? dayjs().format('YY-MM-DD') : ''
  const [selectedValue, setSelectedValue] =
    useState<string>(initialSelectedValue)

  const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
    let newValue = event.target.value as string
    if (numberOnly) {
      // Only allow numeric input
      newValue = newValue.replace(/\D/g, '')
    }
    setSelectedValue(newValue)

    if (onChange) {
      onChange(field ? field : label, newValue)
    }
  }
  const [primaryColor, setPrimaryColor] = useState<string>('#79CA25')
  const role = localStorage.getItem(localStorgeKeyName.role)

  const handleDateChange = (date: Dayjs | null) => {
    const formattedDate = date ? date.format('YYYY-MM-DD') : ''
    setSelectedValue(formattedDate)

    if (onChange) {
      onChange(field ? field : label, formattedDate)
    }
    // }
  }

  const handleSearchClick = () => {
    if (handleSearch) {
      handleSearch(selectedValue)
    }
  }

  useEffect(() => {
    setPrimaryColor(
      role === 'manufacturer' || role === 'customer' ? '#6BC7FF' : '#79CA25'
    )
  }, [role])

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
        {inputType === 'date' ? (
          <Box sx={{ ...localstyles.DateItem }}>
            <DatePicker
              defaultValue={null}
              label={label}
              format={format.dateFormat2}
              onChange={handleDateChange}
              sx={{
                ...localstyles.datePicker,
                '& .MuiIconButton-edgeEnd': {
                  color: primaryColor
                }
              }}
            ></DatePicker>
          </Box>
        ) : (
          <TextField
            sx={{
              mt: 3,
              m: 1,
              width: width ? width : '250px',
              bgcolor: 'white',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#grey'
                },
                '&:hover fieldset': {
                  borderColor: primaryColor
                },
                '&.Mui-focused fieldset': {
                  borderColor: primaryColor
                },
                '& label.Mui-focused': {
                  color: primaryColor // Change label color when input is focused
                }
              }
            }}
            label={label}
            InputLabelProps={{
              style: { color: primaryColor },
              focused: true
            }}
            value={selectedValue}
            placeholder={
              placeholder ? placeholder : t('pick_up_order.filter.search')
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {!hasOptions && (
                    <IconButton
                      onClick={
                        handleSearch ? () => handleSearchClick() : undefined
                      }
                    >
                      <SEARCH_ICON style={{ color: primaryColor }} />
                    </IconButton>
                  )}
                </InputAdornment>
              )
            }}
            select={hasOptions}
            onChange={handleChange}
            inputProps={
              numberOnly
                ? {
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }
                : {
                    inputMode: 'text',
                    pattern: '[A-Za-z0-9]*'
                  }
            }
          >
            {hasOptions &&
              options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
          </TextField>
        )}
      </LocalizationProvider>
    </Box>
  )
}

let localstyles = {
  timePeriodItem: {
    display: 'flex',
    height: 'fit-content',
    // paddingX: 2,
    alignItems: 'center',
    backgroundColor: 'white',
    border: 2,
    borderRadius: 1,
    borderColor: '#E2E2E2'
  },
  datePicker: {
    width: {
      xs: '280px',
      md: '100%'
    },
    backgroundColor: 'white',
    '& fieldset': {
      borderRadius: '4px'
    },
    borderRadius: '4px'
  },
  DateItem: {
    display: 'flex',
    height: 'fit-content',
    alignItems: 'center',
    marginTop: '8px',
    marginRight: '8px',
    width: '250px'
  }
}

export default CustomSearchField
