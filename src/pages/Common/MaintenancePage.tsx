import { useTranslation } from 'react-i18next'
import Maintenance from './MaintenanceCard'

const MaintenancePage = () => {
  const { t } = useTranslation()
  return ( <Maintenance message={t('common.maintenance')} /> )

}

export default MaintenancePage;
  