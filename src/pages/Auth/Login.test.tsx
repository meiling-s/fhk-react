import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from './Login'
import { BrowserRouter as Router } from 'react-router-dom'
import NotifContainer from '../../contexts/NotifContainer'
import CommonTypeContainer from '../../contexts/CommonTypeContainer'
import { ToastContainer } from 'react-toastify'
import { login } from '../../APICalls/login'

jest.mock('../../constants/axiosInstance')
jest.mock('../../APICalls/login')
global.fetch = jest.fn()
jest.mock('axios')

describe('Login Component', () => {
  const renderLoginComponent = () => {
    return render(
      <CommonTypeContainer.Provider>
        <NotifContainer.Provider>
          <ToastContainer />
          <Router>
            <Login />
          </Router>
        </NotifContainer.Provider>
      </CommonTypeContainer.Provider>
    )
  }

  const wrongLogginAccount = () => {
    fireEvent.input(
      screen.getByTestId('astd-username-input').querySelector('input')!!,
      {
        target: { value: 'manuAdmin' }
      }
    )
    fireEvent.input(
      screen.getByTestId('astd-pass-input').querySelector('input')!!,
      {
        target: { value: 'xxxxx.' }
      }
    )

    fireEvent.click(screen.getByTestId('astd-login-btn'))
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the login form', () => {
    renderLoginComponent()
    expect(screen.getByTestId('astd-username-input')).toBeInTheDocument()
    expect(screen.getByTestId('astd-pass-input')).toBeInTheDocument()
    expect(screen.getByTestId('astd-login-btn')).toBeInTheDocument()
  })

  it('requires username and password', async () => {
    renderLoginComponent()
    const loginButton = screen.getByTestId('astd-login-btn')
    fireEvent.click(loginButton)

    const errMsgLogin = screen.getByTestId('astd-err-login')
    expect(errMsgLogin).toBeInTheDocument()
  })

  it('login failed - Public key not available ', async () => {
    renderLoginComponent()
    wrongLogginAccount()
    await waitFor(() => {
      expect(screen.getByTestId('astd-err-login')).toHaveTextContent(
        'Public key is not available. Please try again later.'
      )
    })
  })
})
