import EmailTemplate from "./EmailTemplate";
import SMSTemplate from "./SMSTemplate";
import BroadcastTemplate from "./BroadcastTemplate";
import AppTemplate from "./AppTemplate";
import { useParams } from "react-router-dom";
import { Notiftemplate } from "../../../constants/constant";
import { returnApiToken } from "../../../utils/utils";

const UpdateTemplate = () => {
    const { type, templateId } = useParams();
    const { realmApiRoute } = returnApiToken()

    return(
        <div>
            {templateId && type === Notiftemplate.app && <AppTemplate templateId = {templateId} realmApiRoute={realmApiRoute}/>}
            {templateId && type === Notiftemplate.email && <EmailTemplate templateId = {templateId} realmApiRoute={realmApiRoute}/>}
            {templateId && type === Notiftemplate.broadcast && <BroadcastTemplate templateId = {templateId} realmApiRoute={realmApiRoute}/>}
            {templateId && type === Notiftemplate.sms && <SMSTemplate templateId = {templateId} realmApiRoute={realmApiRoute}/>}
        </div>
    )
};


export default UpdateTemplate;