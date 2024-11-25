import { Button } from '@mui/material'
import { SetStateAction, useEffect, useState } from 'react'
import { Functions } from '../../../interfaces/userGroup'
import { styles } from '../../../constants/styles'

import i18next from 'i18next'

export default function FunctionList({
  keyId,
  item,
  functions,
  disabled,
  setFunctions,
  readOnly = false
}: {
  keyId: number
  item: Functions
  functions: number[]
  disabled: boolean
  readOnly?: boolean
  setFunctions: (value: SetStateAction<number[]>) => void
}) {
  const [selected, setSelected] = useState(functions.includes(item.functionId))

  const handleClick = () => {
    const index = functions.indexOf(item.functionId)
    if (readOnly) return
    let newValue
    if (index !== -1) {
      // Remove the functionId from the array
      newValue = functions.filter((id) => id !== item.functionId)
    } else {
      // Add the functionId to the array
      newValue = [...functions, item.functionId]
    }
    setFunctions(newValue)
    setSelected(!selected)
  }

  useEffect(() => {
    setSelected(functions.includes(item.functionId))
  }, [functions, item.functionId])

  return (
    <Button
      key={keyId}
      datatest-id="astd-user-group-form-available-feature-select-button-9031"
      value={item.functionId}
      color="success"
      //variant={selected ? 'soft' : 'outlined'}
      sx={[
        selected ? styles.tagOutlineActive : styles.tagOutlineDefault,
        {
          width: 'max-content',
          height: '40px',
          borderColor: disabled ? 'gainsboro' : ''
        }
      ]}
      style={{
        borderRadius: 50,
        margin: 4,
        backgroundColor: disabled ? '#C7C7C7' : '',
        color: disabled ? '#808080' : ''
      }}
      disabled={disabled}
      onClick={handleClick}
    >
      {i18next.language === 'enus' && item.functionNameEng}
      {i18next.language === 'zhch' && item.functionNameSChi}
      {i18next.language === 'zhhk' && item.functionNameTChi}
    </Button>
  )
}
