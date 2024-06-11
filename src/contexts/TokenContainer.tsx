import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { localStorgeKeyName } from '../constants/constant'

const useAuthCheck = () => {
  const navigate = useNavigate()
  /**Add other path if wanna exclude without token checkin */
  const excludePath = [
    '/changePassword',
    '/resetPassword',
    '/confirmNewPassword',
    '/changePassword/:idReset?'
  ]

  useEffect(() => {
    const currentPath = window.location.pathname
    const checkToken = () => {
      const token = localStorage.getItem(localStorgeKeyName.keycloakToken)
      if (!token && !excludePath.includes(currentPath)) {
        navigate('/')
      }
    }

    checkToken() // Initial check when component mounts

    window.addEventListener('storage', checkToken)

    return () => {
      window.removeEventListener('storage', checkToken)
    }
  }, [navigate])
}

export default useAuthCheck
