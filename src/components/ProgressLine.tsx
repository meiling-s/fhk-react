import React from 'react'
import LinearProgress from '@mui/material/LinearProgress'

type progressLineProps = {
  value: number
  total: number
  color?: string
}

const ProgressLine: React.FC<progressLineProps> = ({ value, total, color }) => {
  const percentage = (value / total) * 100
  console.log('percentage', percentage)
  const colorIndicator = percentage > 70 ? '#FF4242' : '#79CA25'

  return (
    <div>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 2,
          borderRadius: 2,
          '& .MuiLinearProgress-bar': {
            backgroundColor: color || colorIndicator
          },
          '&.MuiLinearProgress-root': {
            backgroundColor: 'lightgray'
          }
        }}
      />
    </div>
  )
}

export default ProgressLine
