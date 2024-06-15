import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { Notif } from '../interfaces/notif'
import {
  getNumUnreadNotif,
  getNotifByUserId,
  updateFlagNotif,
  getBroadcastMessage
} from '../APICalls/notify'
import { returnApiToken } from '../utils/utils'
import dayjs from 'dayjs'

const Notification = () => {
  const { loginId } = returnApiToken();
  // const loginId: string = localStorage.getItem('loginId') || 'string' //change key based on fixed key for loginId
  const [numOfNotif, setNumOfNotif] = useState(0)
  const [notifList, setNotifList] = useState<Notif[]>([])
  const [broadcast, setBroadcast] = useState<Notif[]>([])

  useEffect(() => {
   if(loginId){
    const interval = setInterval((a) => {
      initBroadcastMessage()
      setNotifList([])
      setNumOfNotif(0)
      getNumNotif(loginId)
      getNotifList(loginId)
    }, 10000);

    return() => {
      clearInterval(interval)
    }

   } 
  }, [loginId])

  const getNumNotif = async (loginId: string) => {
    const result = await getNumUnreadNotif(loginId)
    const data = result?.data

    if (result?.status === 200) {
      setNumOfNotif(prev => prev + Number(data))
    }
  }

  const getNotifList = async (loginId: string) => {
    const result = await getNotifByUserId(loginId)
    const data = result?.data
    if (data) {
      setNotifList((prev:Notif[]) => {
        return [...prev, ...data]
      })
    }
  }

  const updateNotifications = async (loginId: string) => {
    await getNumNotif(loginId)
    await getNotifList(loginId)
    await getBroadcastMessage()
  }

  const initBroadcastMessage = async () => {
    const result = await getBroadcastMessage()
    if (result) {
      const notifications:Notif [] = [];
      for(let broadcast of result){
        const isBefore = dayjs().isBefore(broadcast.effToDate, 'day');
        const isSame = dayjs().isSame(broadcast.effToDate, 'day');
        if(isSame || isBefore){
          notifications.push(
            {
              notiRecordId: 0,
              loginId: loginId,
              messageType: 'broadcast',
              title: broadcast.title,
              content: broadcast.content,
              sender: '',
              receiver: '',
              exeDatetime: '',
              status: '',
              createdBy: '',
              updatedBy: '',
              readFlg: false,
              createdAt: '',
              updatedAt: '',
            }
          )
        }
      }
      setBroadcast(notifications)
    }
  }

  return {
    numOfNotif,
    notifList,
    updateNotifications,
    setNumOfNotif,
    setNotifList,
    broadcast
  }
}

const NotifContainer = createContainer(Notification)

export default NotifContainer
