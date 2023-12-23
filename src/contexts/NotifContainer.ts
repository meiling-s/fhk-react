import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import {
  getNumUnreadNotif,
  getNotifByUserId,
  updateFlagNotif
} from '../APICalls/notify'

const Notification = () => {
  const loginId: string = localStorage.getItem('loginId') || 'string' //change key based on fixed key for loginId
  const [numOfNotif, setNumOfNotif] = useState(0)
  const [userId, setLoginId] = useState(loginId)

  useEffect(() => {
    getNumNotif(userId)
    // getNotifList()
  }, [userId])

  const getNumNotif = async (loginId: string) => {
    const result = await getNumUnreadNotif(loginId)
    const data = result?.data
    if (data) {
      setNumOfNotif(data)
    }
  }

  // const getNotifList = async (loginId: string) => {
  // }

  return {
    numOfNotif,
    setLoginId
  }
}

const NotifContainer = createContainer(Notification)

export default NotifContainer
