import { Button } from '@mui/joy'
import { SetStateAction, useEffect, useState } from 'react'
import { Functions } from '../../../interfaces/userGroup'
import { styles } from '../../../constants/styles'

import i18next from 'i18next'

export default function FunctionList({
  keyId,
  item,
  functions,
  disabled,
  setFunctions
}: {
  keyId: number
  item: Functions
  functions: number[]
  disabled: boolean
  setFunctions: (value: SetStateAction<number[]>) => void
}) {
  const [selected, setSelected] = useState(functions.includes(item.functionId))

  const handleClick = () => {
    const index = functions.indexOf(item.functionId)
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

  //   useEffect(() => {
  //     const index = functions.indexOf(item.functionId)
  //     if (index !== -1) {
  //       setSelected(true)
  //     } else {
  //       setSelected(false)
  //     }
  //   }, [functions, item.functionId])

  useEffect(() => {
    setSelected(functions.includes(item.functionId))
  }, [functions, item.functionId])

  return (
    <Button
      key={keyId}
      value={item.functionId}
      color="success"
      variant={selected ? 'soft' : 'outlined'}
      sx={[
        selected ? styles.tagOutlineActive : styles.tagOutlineDefault,
        {
          width: 'max-content',
          height: '40px',
          borderColor: disabled ? 'gainsboro' : ''
        }
      ]}
      style={{ borderRadius: 50, margin: 4 }}
      disabled={disabled}
      onClick={handleClick}
    >
      {i18next.language === 'enus' && item.functionNameEng}
      {i18next.language === 'zhch' && item.functionNameSChi}
      {i18next.language === 'zhhk' && item.functionNameTChi}
    </Button>
  )
}
