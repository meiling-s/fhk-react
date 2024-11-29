import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import CustomButton from './FormComponents/CustomButton'
import { getFormatId, getPrimaryColor } from '../utils/utils'
import { useEffect, useState } from 'react'
import { localStorgeKeyName } from '../constants/constant'
import { useLocation } from 'react-router-dom'

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
  const [isShow, setIsShow] = useState<boolean>(false)
  const currentTenantId = localStorage.getItem(localStorgeKeyName.tenantId)
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  useEffect(() => {
    const formatLogisticId = getFormatId(row.logisticId)
    if (formatLogisticId === currentTenantId) {
      setIsShow(true)
    }
  }, [currentTenantId, row.logisticId])

  return (
    <>
      {row.status === 'CREATED' ? (
        <Box>
          {isShow ? (
            <>
              <CustomButton
                text={t('pick_up_order.table.approve')}
                style={{
                  marginRight: '8px'
                }}
                disabled={!isAdmin}
                onClick={() => {
                  onApprove(row)
                }}
              ></CustomButton>
              <CustomButton
                text={t('pick_up_order.table.reject')}
                outlined={true}
                disabled={!isAdmin}
                onClick={() => {
                  onReject(row)
                }}
              ></CustomButton>
            </>
          ) : (
            <></>
          )}
        </Box>
      ) : null}
    </>
  )
}

export default TableOperation
