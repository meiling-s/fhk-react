import EmailTemplate from "./EmailTemplate";
import SMSTemplate from "./SMSTemplate";
import BroadcastTemplate from "./BroadcastTemplate";
import AppTemplate from "./AppTemplate";
import { useParams } from "react-router-dom";
import { Notiftemplate } from "../../../constants/constant";

const UpdateTemplate = () => {
    const { type, templateId } = useParams();
    return(
        <div>
             {type === Notiftemplate.app && <AppTemplate templateId = {templateId}/>}
            {type === Notiftemplate.email && <EmailTemplate templateId = {templateId}/>}
            {type === Notiftemplate.broadcast && <BroadcastTemplate templateId = {templateId}/>}
            {type === Notiftemplate.sms && <SMSTemplate templateId = {templateId}/>}
        </div>
    )
};


export default UpdateTemplate;