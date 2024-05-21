import { useContainer } from "unstated-next";
import CommonTypeContainer from "../contexts/CommonTypeContainer";
import { useTranslation } from "react-i18next";
import { MAINTENANCE_STATUS } from "../constants/constant";
import Maintenance from "../pages/Common/Maintenance";
import { useEffect, useState } from "react";
import { getSystemMaintenanceStatus } from "../APICalls/commont";
import { useNavigate } from "react-router-dom";

const useMaintenanceMode = () => {
    const { t } = useTranslation();
    const [message, setMessage] = useState<string>('')
    const [maintenanceStatus, setMaintenanceStatus] = useState<string>('');
    const navigate = useNavigate();

    const initMaintenanceStatus = async() => {
        try {
            const status = await getSystemMaintenanceStatus();
            if(status && status === MAINTENANCE_STATUS.UNDER_MAINTENANCE){
                setMaintenanceStatus(status)
                setMessage(t('common.maintenance'))
                navigate('/')
            }
        } catch (error) {
            return null
        }
    }

    useEffect(() => {
        initMaintenanceStatus()
    }, [])

    return{
        maintenanceStatus,
        message
    }
};

export default useMaintenanceMode;