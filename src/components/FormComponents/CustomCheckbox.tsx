import React, { useState, useEffect } from 'react'
import '../../styles/Checkbox.css'
interface CheckboxProps {
  id?: string
  label?: string
  value?: string
  disabled?: boolean
  checked?: boolean
  className?: string
  onChange?: (isChecked: boolean, item: any) => void
}

const CustomCheckbox: React.FC<CheckboxProps> = ({
  id = '',
  label = '',
  value = '',
  disabled = false,
  checked = false,
  className,
  onChange
}) => {
  const [picked, setPicked] = useState<boolean>(checked)

  useEffect(() => {
    setPicked(checked)
  }, [checked])

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    setPicked(isChecked)
    if (onChange) {
      onChange(isChecked, value)
    }
  }

  return (
    <div
      className={`checkbox flex items-center justify-center pt-1 ${className}`}
    >
      <input
        type="checkbox"
        id={id || label}
        className="mt-0.5"
        checked={picked}
        value={value}
        disabled={disabled}
        onChange={handleCheckboxChange}
      />
      <div className={`${disabled ? 'disable-label' : 'enable-label'}`}></div>
    </div>
  )
}

export default CustomCheckbox
