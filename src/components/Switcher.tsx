import { useState } from 'react'
import Switch from '@mui/material/Switch'
import { green } from '@mui/material/colors'
import CheckIcon from '@mui/icons-material/Check'

const Switcher = () => {
  const [isPhysicalLocation, setIsPhysicalLocation] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleLocationChange = () => {
    setIsPhysicalLocation((prevValue) => !prevValue)
  }

  const handleConfirmation = () => {
    setIsConfirmed(true) // Logic for confirmation
  }
  //need adjust the layout
  return (
    <div className="self-stretch flex flex-col items-start justify-start gap-[8px] text-center">
      <div className="rounded-61xl bg-grey-line flex flex-row items-start justify-start p-1 gap-[8px] text-mini text-grey-dark">
        <Switch
          checked={isPhysicalLocation}
          onChange={handleLocationChange}
          color="primary"
          inputProps={{ 'aria-label': 'physical location switch' }}
        />
      </div>
    </div>
  )
}

export default Switcher
