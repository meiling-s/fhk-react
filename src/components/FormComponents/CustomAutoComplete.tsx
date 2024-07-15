import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  SxProps,
  TextField,
  Theme
} from '@mui/material'
import React from 'react'
import { styles } from '../../constants/styles'

const CustomAutoComplete = ({
  placeholder,
  option,
  sx,
  onChange,
  onInputChange,
  value,
  inputValue,
  error,
  helpertext,
  readOnly,
  onCompositionEnd
}: {
  option: any
  placeholder: string
  sx?: SxProps<Theme>
  value: string
  onChange: (
    event: React.SyntheticEvent<Element, Event>,
    newValue: string | null,
    reason: AutocompleteChangeReason
  ) => void
  onInputChange?: any
  inputValue?: any
  error?: boolean
  helpertext?: any
  readOnly?: boolean | undefined
  onCompositionEnd?: any
}) => {
  return (
    <Autocomplete
      freeSolo
      value={value}
      inputValue={inputValue}
      onInputChange={onInputChange}
      disableClearable
      options={option}
      onChange={onChange}
      onCompositionEnd={onCompositionEnd}
      renderInput={(params) => (
        <TextField
          error={error}
          hiddenLabel
          {...params}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            type: 'search'
          }}
          helperText={helpertext}
          sx={{ ...styles.textField, ...sx }}
        />
      )}
    />
  )
}

export default CustomAutoComplete
