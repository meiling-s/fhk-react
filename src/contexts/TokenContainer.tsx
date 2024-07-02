import { useEffect } from 'react'
import { useNavigate, matchPath } from 'react-router-dom'
import { localStorgeKeyName } from '../constants/constant'

const useAuthCheck = () => {
  const navigate = useNavigate()
  /**Add other path if wanna exclude without token checkin */
  const excludePath = [
    '/changePassword',
    '/resetPassword',
    '/confirmNewPassword',
    '/changePassword/:idReset?',
    '/register/details/:tenantId',
    '/register/result'
  ]

  useEffect(() => {
    const checkToken = () => {
      const currentPath = window.location.pathname
      const isExcluded = excludePath.some(path => 
        matchPath({ path, end: false }, currentPath)
      )
      const token = localStorage.getItem(localStorgeKeyName.keycloakToken)
      if (!token && !isExcluded) {
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
