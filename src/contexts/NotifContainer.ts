import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { Broadcast, Notif } from '../interfaces/notif'
import {
  getNumUnreadNotif,
  getNotifByUserId,
  getBroadcastMessage
} from '../APICalls/notify'
import { getSelectedLanguange, returnApiToken } from '../utils/utils'
import { Languages } from '../constants/constant'
import dayjs from 'dayjs'

const Notification = () => {
  const { loginId } = returnApiToken();
  // const loginId: string = localStorage.getItem('loginId') || 'string' //change key based on fixed key for loginId
  const [numOfNotif, setNumOfNotif] = useState(0)
  const [notifList, setNotifList] = useState<Notif[]>([])
  const [broadcast, setBroadcast] = useState<Broadcast | null>(null)
  const [showBroadcast, setShowBroadcast] = useState<boolean>(true);
  const [marginTop, setMarginTop] = useState<string>('0px');

  // useEffect(() => {
  //  if(loginId){
  //   const interval = setInterval((a) => {
  //     setNotifList([])
  //     setNumOfNotif(0)
  //     getNumNotif(loginId)
  //     getNotifList(loginId)
  //   }, 10000);

  //   return() => {
  //     clearInterval(interval)
  //   }

  //  } 
  // }, [loginId])
  
  useEffect(() => {
    const interval = setInterval(() => {
      initBroadcastMessage()
    }, 60 * 60000);

    return() => {
      clearInterval(interval)
    }
  }, [])
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifList([])
      setNumOfNotif(0)
      getNumNotif(loginId)
      getNotifList(loginId)
    }, 20000)

    return() => {
      clearInterval(interval)
    }
  }, [])

  const getNumNotif = async (loginId: string) => {
    const result = await getNumUnreadNotif(loginId)
    const data = result?.data
    if (result?.status === 200) {
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

  const updateNotifications = async (loginId: string) => {
    await getNumNotif(loginId)
    await getNotifList(loginId)
  }

  const initBroadcastMessage = async () => {
    const result = await getBroadcastMessage()
      if (result?.length >= 1) {
        let broadcast: Broadcast = {}
        for(let message of result){
          const isBefore = dayjs().isBefore(message.effToDate, 'day');
          const isSame = dayjs().isSame(message.effToDate, 'day');
          if(isSame || isBefore){
            broadcast.effFromDate = message.effFromDate;
            broadcast.effToDate = message.effToDate;

            switch (message.lang) {
              case getSelectedLanguange(Languages.ZHCH):
                broadcast.title_schi = message.title;
                broadcast.content_schi = message.content;
                break;
              case getSelectedLanguange(Languages.ZHHK):
                broadcast.title_tchi = message.title;
                broadcast.content_tchi = message.content;
                break;
              default:
                broadcast.title_enus = message.title;
                broadcast.content_enus = message.content;
                break;
            }
          }
        }
        
        setBroadcast(prev => {
          if(prev?.title_enus == broadcast?.title_enus && prev?.content_enus == broadcast?.content_enus){
            return prev
          } else {
            setShowBroadcast(true)
            setMarginTop('30px')
            return broadcast
          }
        })
      }  else {
        setShowBroadcast(false)
        setMarginTop('0px')
        setBroadcast(null)
      }
  }

  useEffect(() => {
    initBroadcastMessage()
  }, [])

  // useEffect(() => {
  //   if(showBroadcast){
  //     setMarginTop('30px')
  //   } else {
  //     setMarginTop('0px')
  //   }
  // }, [showBroadcast]);
  
  return {
    numOfNotif,
    notifList,
    updateNotifications,
    setNumOfNotif,
    setNotifList,
    broadcast,
    setBroadcast,
    showBroadcast, 
    setShowBroadcast,
    initBroadcastMessage,
    marginTop,
    setMarginTop
  }
}


const NotifContainer = createContainer(Notification)

export default NotifContainer
