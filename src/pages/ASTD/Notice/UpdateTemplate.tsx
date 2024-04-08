import EmailTemplate from "./EmailTemplate";
import SMSTemplate from "./SMSTemplate";
import BroadcastTemplate from "./BroadcastTemplate";
import AppTemplate from "./AppTemplate";
import { useParams } from "react-router-dom";
import { Notiftemplate, Roles } from "../../../constants/constant";
import { dynamicpath } from "../../../utils/utils";

const UpdateTemplate = () => {
    const { type, templateId } = useParams();
    const { pathRole } =  dynamicpath()

    return(
        <div>
            {templateId && type === Notiftemplate.app && <AppTemplate templateId = {templateId} dynamicPath={pathRole}/>}
            {templateId && type === Notiftemplate.email && <EmailTemplate templateId = {templateId} dynamicPath={pathRole}/>}
            {templateId && type === Notiftemplate.broadcast && <BroadcastTemplate templateId = {templateId} dynamicPath={pathRole}/>}
            {templateId && type === Notiftemplate.sms && <SMSTemplate templateId = {templateId} dynamicPath={pathRole}/>}
        </div>
    )
};


export default UpdateTemplate;