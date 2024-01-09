import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { Notif } from '../interfaces/notif'
import {
  getNumUnreadNotif,
  getNotifByUserId,
  updateFlagNotif
} from '../APICalls/notify'

const Notification = () => {
  const loginId: string = localStorage.getItem('loginId') || 'string' //change key based on fixed key for loginId
  const [numOfNotif, setNumOfNotif] = useState(0)
  const [notifList, setNotifList] = useState<Notif[]>([])

  useEffect(() => {
    getNumNotif(loginId)
    getNotifList(loginId)
  }, [loginId])

  const getNumNotif = async (loginId: string) => {
    const result = await getNumUnreadNotif(loginId)
    const data = result?.data
    if (data) {
      setNumOfNotif(data)
    }
  }

  const getNotifList = async (loginId: string) => {
    const result = await getNotifByUserId(loginId)
    const data = result?.data
    if (data) {
      setNotifList(data)
    }
  }

  const updateNotifications = async () => {
    await getNumNotif(loginId)
    await getNotifList(loginId)
  }

  return {
    numOfNotif,
    notifList,
    updateNotifications
  }
}

const NotifContainer = createContainer(Notification)

export default NotifContainer
