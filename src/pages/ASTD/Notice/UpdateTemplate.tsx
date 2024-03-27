import EmailTemplate from "./EmailTemplate";
import SMSTemplate from "./SMSTemplate";
import BroadcastTemplate from "./BroadcastTemplate";
import AppTemplate from "./AppTemplate";
import { useParams } from "react-router-dom";
import { Notiftemplate, Roles } from "../../../constants/constant";

const UpdateTemplate = () => {
    const { type, templateId } = useParams();

    const userRole  = localStorage.getItem('userRole') || '';
    let dynamicPath:string = '';
    
    if(userRole === Roles.collectoradmin) {
        dynamicPath = 'collectors'
    } else if(userRole === Roles.logisticadmin){
        dynamicPath = 'logistic'
    }
    return(
        <div>
            {templateId && type === Notiftemplate.app && <AppTemplate templateId = {templateId} dynamicPath={dynamicPath}/>}
            {templateId && type === Notiftemplate.email && <EmailTemplate templateId = {templateId} dynamicPath={dynamicPath}/>}
            {templateId && type === Notiftemplate.broadcast && <BroadcastTemplate templateId = {templateId} dynamicPath={dynamicPath}/>}
            {templateId && type === Notiftemplate.sms && <SMSTemplate templateId = {templateId} dynamicPath={dynamicPath}/>}
        </div>
    )
};


export default UpdateTemplate;