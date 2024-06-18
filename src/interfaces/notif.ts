export type Notif = {
  notiRecordId: number
  loginId: string
  messageType: string
  title: string
  content: string
  sender: string
  receiver: string
  exeDatetime: string
  status: string
  createdBy: string
  updatedBy: string
  readFlg: boolean
  createdAt: string
  updatedAt: string
}

export type NotifTemplate = {
  templateId: string
  notiType: string
  variables:  string[]
  lang: string
  title: string
  senders: string[]
  receivers: string[]
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}

export type UpdateNotifTemplate = {
  notiType: string
  variables:  string[]
  lang: string
  title: string
  content: string
  senders: string[]
  receivers: string[]
  updatedBy: string
}

export type UpdateNotifTemplateBroadcast = {
  notiType: string
  variables:  string[]
  lang: string
  title: string
  content: string
  senders: string[]
  receivers: string[]
  updatedBy: string
  effFromDate: string
  effToDate: string
}

export interface LanguagesNotif  {
  value: string,
  langTchi: string,
  langSchi: string,
  langEng: string,
}

export interface Option {
  value: string
  lang: string,
}

export type Broadcast = {
  title: string
  content: string
  effFromDate: string
  effToDate: string
}