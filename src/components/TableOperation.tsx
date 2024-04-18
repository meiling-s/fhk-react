import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import CustomButton from './FormComponents/CustomButton'

interface TableOperationProps {
  row: any
  onApprove: (row: any) => void
  onReject: (row: any) => void
  navigateToJobOrder: (row: any) => void
  color?: 'blue' | 'green'
}

const TableOperation = ({
  row,
  onApprove,
  onReject,
  navigateToJobOrder,
  color
}: TableOperationProps) => {
  const { t } = useTranslation()
  return (
    <>
      {row.status === 'CREATED' ? (
        <Box>
          <CustomButton
            text={t('pick_up_order.table.approve')}
            color={color ? color : 'green'}
            style={{ marginRight: '8px' }}
            onClick={() => {
              onApprove(row)
            }}
          ></CustomButton>
          <CustomButton
            text={t('pick_up_order.table.reject')}
            color={color ? color : 'green'}
            outlined={true}
            onClick={() => {
              onReject(row)
            }}
          ></CustomButton>
        </Box>
      ) : row.status === 'STARTED' || row.status === 'OUTSTANDING' ? (
        <CustomButton
          text={t('pick_up_order.table.create_job_order')}
          onClick={() => {
            navigateToJobOrder(row)
          }}
        ></CustomButton>
      ) : null}
    </>
  )
}

export default TableOperation
